import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CostReport, SensitivityResult, SensitivityRow } from "@/lib/cyclone/types";
import { formatNum } from "@/lib/utils";

const SERIES_COLORS = [
  "var(--chart-2)",
  "var(--chart-1)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "#c41e3a",
  "#1e3a8a",
  "#b45309",
];

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-primary/20 bg-primary/5 px-2 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display text-lg font-semibold tabular-nums text-foreground">{value}</p>
      {unit && <p className="text-[10px] text-muted-foreground">{unit}</p>}
    </div>
  );
}

/** MicroCYCLONE-style process costing table + summary. */
export function CostReportSection({ cost }: { cost: CostReport }) {
  return (
    <section className="space-y-2">
      <h3 className="font-display text-sm font-semibold text-foreground">Cost Report</h3>
      <p className="text-[11px] text-muted-foreground">
        MicroCYCLONE-style process costing (USD). Resource cost = count × (USD/h) × run hours;
        unit cost = total cost ÷ production.
      </p>
      <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-border">
        <table className="w-full min-w-[480px] text-left text-xs">
          <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
            <tr>
              <th className="px-2 py-1.5 font-medium">Resource</th>
              <th className="px-2 py-1.5 font-medium">Count</th>
              <th className="px-2 py-1.5 font-medium">USD / h</th>
              <th className="px-2 py-1.5 font-medium">Total cost (USD)</th>
            </tr>
          </thead>
          <tbody>
            {cost.resources.map((r) => (
              <tr key={r.nodeId} className="border-b border-border/60">
                <td className="px-2 py-1.5 font-medium text-foreground">{r.label}</td>
                <td className="px-2 py-1.5 tabular-nums">{r.count}</td>
                <td className="px-2 py-1.5 tabular-nums">{formatNum(r.costPerHourUsd)}</td>
                <td className="px-2 py-1.5 tabular-nums">{formatNum(r.totalCostUsd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Run hours" value={formatNum(cost.runHours)} unit="h" />
        <Stat label="Total cost" value={formatNum(cost.totalCostUsd)} unit="USD" />
        <Stat
          label="Unit cost"
          value={formatNum(cost.unitCostUsd)}
          unit={`USD / ${cost.productionUnit}`}
        />
        <Stat
          label="Production"
          value={formatNum(cost.production)}
          unit={cost.productionUnit}
        />
      </div>
    </section>
  );
}

/** Parse "Trucks=4, Loader=1" → { Trucks: 4, Loader: 1 } */
function parseRowFactors(label: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const part of label.split(",")) {
    const m = part.trim().match(/^(.+?)\s*=\s*(\d+(?:\.\d+)?)$/);
    if (m) out[m[1]!.trim()] = Number(m[2]);
  }
  return out;
}

type ChartAxisPlan = {
  xName: string;
  seriesName: string | null;
  seriesValues: number[];
  xValues: number[];
};

/**
 * Halpin-style reading of sensitivity:
 * X-axis = resource with the widest range (e.g. Trucks 2..8).
 * One line per value of the secondary resource (e.g. Loader=1, Loader=2).
 */
function planAxes(rows: SensitivityRow[]): ChartAxisPlan | null {
  if (!rows.length) return null;
  const factorSets = new Map<string, Set<number>>();
  for (const row of rows) {
    const f = parseRowFactors(row.label);
    for (const [k, v] of Object.entries(f)) {
      if (!factorSets.has(k)) factorSets.set(k, new Set());
      factorSets.get(k)!.add(v);
    }
  }
  if (!factorSets.size) return null;

  const dims = [...factorSets.entries()]
    .map(([name, set]) => ({ name, values: [...set].sort((a, b) => a - b) }))
    .sort((a, b) => b.values.length - a.values.length);

  const primary = dims[0]!;
  const secondary = dims.length > 1 ? dims[1]! : null;

  return {
    xName: primary.name,
    seriesName: secondary?.name ?? null,
    seriesValues: secondary?.values ?? [0],
    xValues: primary.values,
  };
}

function buildSeriesData(
  rows: SensitivityRow[],
  plan: ChartAxisPlan,
  metric: "unitsPerHour" | "unitCostUsd",
): { data: Record<string, number | null>[]; seriesKeys: string[] } {
  const seriesKeys =
    plan.seriesName == null
      ? [metric === "unitsPerHour" ? "Units / h" : "Unit cost"]
      : plan.seriesValues.map((v) => `${plan.seriesName}=${v}`);

  const data: Record<string, number | null>[] = plan.xValues.map((x) => {
    const point: Record<string, number | null> = { x };
    if (plan.seriesName == null) {
      const hit = rows.find((r) => parseRowFactors(r.label)[plan.xName] === x);
      const val =
        metric === "unitsPerHour"
          ? (hit?.unitsPerHour ?? null)
          : (hit?.unitCostUsd ?? null);
      point[seriesKeys[0]!] = val;
    } else {
      for (const sv of plan.seriesValues) {
        const key = `${plan.seriesName}=${sv}`;
        const hit = rows.find((r) => {
          const f = parseRowFactors(r.label);
          return f[plan.xName] === x && f[plan.seriesName!] === sv;
        });
        const val =
          metric === "unitsPerHour"
            ? (hit?.unitsPerHour ?? null)
            : (hit?.unitCostUsd ?? null);
        point[key] = val;
      }
    }
    return point;
  });

  return { data, seriesKeys };
}

function SensitivityLineChart({
  title,
  yLabel,
  data,
  seriesKeys,
  xName,
}: {
  title: string;
  yLabel: string;
  data: Record<string, number | null>[];
  seriesKeys: string[];
  xName: string;
}) {
  return (
    <div className="min-w-0 rounded-[var(--radius-sm)] border border-border bg-card p-3">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
      <div className="h-56 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 16, left: 4, bottom: 28 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="x"
              type="number"
              domain={["dataMin", "dataMax"]}
              allowDecimals={false}
              tick={{ fontSize: 10 }}
              label={{
                value: xName,
                position: "insideBottom",
                offset: -16,
                style: { fontSize: 11, fill: "var(--muted-foreground)" },
              }}
            />
            <YAxis
              domain={[0, "auto"]}
              tick={{ fontSize: 10 }}
              width={48}
              label={{
                value: yLabel,
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 10, fill: "var(--muted-foreground)" },
              }}
            />
            <Tooltip
              formatter={(v, name) => [
                v == null ? "—" : formatNum(Number(v)),
                String(name),
              ]}
              labelFormatter={(x) => `${xName} = ${x}`}
            />
            <Legend
              verticalAlign="top"
              height={28}
              wrapperStyle={{ fontSize: 11 }}
            />
            {seriesKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                strokeWidth={2.25}
                dot={{ r: 3.5 }}
                activeDot={{ r: 5 }}
                connectNulls
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** Halpin-style sensitivity: multi-line charts + collapsible detail table. */
export function SensitivitySection({
  sensitivity,
  productionUnit,
}: {
  sensitivity: SensitivityResult;
  productionUnit: string;
}) {
  const [tableOpen, setTableOpen] = useState(false);

  const plan = useMemo(() => planAxes(sensitivity.rows), [sensitivity.rows]);

  const prodChart = useMemo(
    () => (plan ? buildSeriesData(sensitivity.rows, plan, "unitsPerHour") : null),
    [sensitivity.rows, plan],
  );
  const costChart = useMemo(
    () => (plan ? buildSeriesData(sensitivity.rows, plan, "unitCostUsd") : null),
    [sensitivity.rows, plan],
  );

  if (!sensitivity.rows.length || !plan || !prodChart || !costChart) return null;

  const seriesHint =
    plan.seriesName != null
      ? `X = ${plan.xName}; one line per ${plan.seriesName} count.`
      : `X = ${plan.xName}.`;

  return (
    <div className="space-y-4">
      <p className="text-[11px] text-muted-foreground">
        Halpin-style sensitivity (line charts). {seriesHint} Compare productivity and unit cost side
        by side to choose a fleet mix.
      </p>

      {(sensitivity.bestProductivityLabel || sensitivity.bestUnitCostLabel) && (
        <div className="flex flex-wrap gap-3 text-xs">
          {sensitivity.bestProductivityLabel && (
            <div className="rounded-[var(--radius-sm)] border border-primary/30 bg-primary/5 px-3 py-2">
              <span className="text-muted-foreground">Best productivity: </span>
              <span className="font-medium text-foreground">
                {sensitivity.bestProductivityLabel}
              </span>
            </div>
          )}
          {sensitivity.bestUnitCostLabel && (
            <div className="rounded-[var(--radius-sm)] border border-primary/30 bg-primary/5 px-3 py-2">
              <span className="text-muted-foreground">Best unit cost: </span>
              <span className="font-medium text-foreground">
                {sensitivity.bestUnitCostLabel}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        <SensitivityLineChart
          title={`Productivity (${productionUnit}/h)`}
          yLabel={`${productionUnit}/h`}
          data={prodChart.data}
          seriesKeys={prodChart.seriesKeys}
          xName={plan.xName}
        />
        <SensitivityLineChart
          title="Unit cost (USD)"
          yLabel={`USD / ${productionUnit}`}
          data={costChart.data}
          seriesKeys={costChart.seriesKeys}
          xName={plan.xName}
        />
      </div>

      <div className="rounded-[var(--radius-sm)] border border-border">
        <button
          type="button"
          onClick={() => setTableOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-muted/40"
        >
          <span>
            Detail table ({sensitivity.rows.length} combinations)
            {!tableOpen && (
              <span className="ml-2 font-normal text-muted-foreground">— click to expand</span>
            )}
          </span>
          <span className="tabular-nums text-muted-foreground">{tableOpen ? "Hide ▲" : "Show ▼"}</span>
        </button>
        {tableOpen && (
          <div className="max-h-72 overflow-auto border-t border-border">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="sticky top-0 border-b border-border bg-muted/90 text-[10px] uppercase text-muted-foreground backdrop-blur">
                <tr>
                  <th className="px-2 py-1.5 font-medium">Combination</th>
                  <th className="px-2 py-1.5 font-medium">Units / h</th>
                  <th className="px-2 py-1.5 font-medium">Unit cost (USD)</th>
                  <th className="px-2 py-1.5 font-medium">Total cost (USD)</th>
                  <th className="px-2 py-1.5 font-medium">Cycles</th>
                </tr>
              </thead>
              <tbody>
                {sensitivity.rows.map((row) => (
                  <tr
                    key={row.label}
                    className={
                      row.label === sensitivity.bestProductivityLabel ||
                      row.label === sensitivity.bestUnitCostLabel
                        ? "border-b border-border/60 bg-primary/5"
                        : "border-b border-border/60"
                    }
                  >
                    <td className="px-2 py-1.5 font-medium text-foreground">{row.label}</td>
                    <td className="px-2 py-1.5 tabular-nums">{formatNum(row.unitsPerHour)}</td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {row.unitCostUsd != null ? formatNum(row.unitCostUsd) : "—"}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {row.totalCostUsd != null ? formatNum(row.totalCostUsd) : "—"}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">{row.cycles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
