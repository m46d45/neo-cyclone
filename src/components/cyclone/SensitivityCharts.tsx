import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SensitivityResult, SensitivityRow } from "@/lib/cyclone/types";
import { formatNum } from "@/lib/utils";
import { ChartDownloadFrame } from "@/components/cyclone/ChartDownload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      point[seriesKeys[0]!] =
        metric === "unitsPerHour" ? (hit?.unitsPerHour ?? null) : (hit?.unitCostUsd ?? null);
    } else {
      for (const sv of plan.seriesValues) {
        const key = `${plan.seriesName}=${sv}`;
        const hit = rows.find((r) => {
          const f = parseRowFactors(r.label);
          return f[plan.xName] === x && f[plan.seriesName!] === sv;
        });
        point[key] =
          metric === "unitsPerHour" ? (hit?.unitsPerHour ?? null) : (hit?.unitCostUsd ?? null);
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
  best,
}: {
  title: string;
  yLabel: string;
  data: Record<string, number | null>[];
  seriesKeys: string[];
  xName: string;
  best?: { x: number; y: number; caption: string } | null;
}) {
  const fileBase = title.replace(/[^a-zA-Z0-9]+/g, "_").slice(0, 40) || "sensitivity_chart";
  return (
    <div className="min-w-0 rounded-[var(--radius-sm)] border border-border bg-card p-3">
      <ChartDownloadFrame title={title} filename={`chart_${fileBase}`} chartClassName="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 112, left: 8, bottom: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="x"
              type="number"
              domain={["dataMin", "dataMax"]}
              allowDecimals={false}
              tick={{ fontSize: 10 }}
              height={36}
              label={{
                value: xName,
                position: "insideBottom",
                offset: -2,
                fontSize: 11,
              }}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              width={48}
              label={{
                value: yLabel,
                angle: -90,
                position: "insideLeft",
                offset: 8,
                fontSize: 10,
              }}
            />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: "var(--card)",
              }}
            />
            {/* Legend on the right — clear of X-axis name and ticks */}
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{
                fontSize: 10,
                lineHeight: "16px",
                paddingLeft: 4,
                maxHeight: 200,
                overflow: "auto",
              }}
            />
            {seriesKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                strokeWidth={2}
                strokeDasharray={i === 0 ? undefined : "6 4"}
                dot={{ r: i === 0 ? 3 : 4 }}
                connectNulls
                isAnimationActive={false}
              />
            ))}
            {best && (
              <>
                <ReferenceLine x={best.x} stroke="#c41e3a" strokeDasharray="4 4" />
                <ReferenceLine
                  y={best.y}
                  stroke="#c41e3a"
                  strokeDasharray="4 4"
                  label={{ value: formatNum(best.y), position: "right", fontSize: 10 }}
                />
                <ReferenceDot
                  x={best.x}
                  y={best.y}
                  r={6}
                  fill="#c41e3a"
                  stroke="#fff"
                  strokeWidth={2}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </ChartDownloadFrame>
      {best && (
        <p className="mt-1 text-[10px] text-destructive">
          Best: {best.caption} → {xName}={best.x}, {formatNum(best.y)} {yLabel}
        </p>
      )}
    </div>
  );
}

function bestMarkerFromLabel(
  rows: SensitivityRow[],
  plan: ChartAxisPlan,
  bestLabel: string | null,
  metric: "unitsPerHour" | "unitCostUsd",
): { x: number; y: number; caption: string } | null {
  if (!bestLabel) return null;
  const row = rows.find((r) => r.label === bestLabel);
  if (!row) return null;
  const f = parseRowFactors(row.label);
  const x = f[plan.xName];
  if (x == null) return null;
  const y = metric === "unitsPerHour" ? row.unitsPerHour : row.unitCostUsd;
  if (y == null || !Number.isFinite(y)) return null;
  return { x, y, caption: bestLabel };
}

/** Halpin-style sensitivity: multi-line charts + collapsible detail table. */
export function SensitivitySection({
  sensitivity,
  productionUnit,
}: {
  sensitivity: SensitivityResult;
  productionUnit: string;
}) {
  const pairs = sensitivity.pairs?.length
    ? sensitivity.pairs
    : [
        {
          pairLabel: "Sensitivity",
          resourceA: "",
          resourceB: "",
          baseline: {},
          rows: sensitivity.rows,
          bestProductivityLabel: sensitivity.bestProductivityLabel,
          bestUnitCostLabel: sensitivity.bestUnitCostLabel,
        },
      ];
  const [pairIdx, setPairIdx] = useState(0);
  const [tableOpen, setTableOpen] = useState(false);

  const safeIdx = Math.min(pairIdx, pairs.length - 1);
  const active = pairs[safeIdx]!;
  const rows = active.rows;

  const plan = useMemo(() => planAxes(rows), [rows]);
  const prodChart = useMemo(
    () => (plan ? buildSeriesData(rows, plan, "unitsPerHour") : null),
    [rows, plan],
  );
  const costChart = useMemo(
    () => (plan ? buildSeriesData(rows, plan, "unitCostUsd") : null),
    [rows, plan],
  );
  if (!rows.length || !plan || !prodChart || !costChart) return null;

  const seriesHint =
    plan.seriesName != null
      ? `X = ${plan.xName}; one line per ${plan.seriesName} count.`
      : `X = ${plan.xName}.`;

  const baselineEntries = Object.entries(active.baseline);
  const isPairwise = sensitivity.mode === "pairwise" && pairs.length > 1;

  return (
    <div className="space-y-4">
      {sensitivity.note && (
        <p className="rounded-[var(--radius-sm)] border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11px] text-foreground">
          {sensitivity.note}
        </p>
      )}

      {isPairwise && (
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-[11px] font-medium text-muted-foreground" htmlFor="sens-pair">
            Pair
          </label>
          <select
            id="sens-pair"
            className="rounded-[var(--radius-sm)] border border-border bg-background px-2 py-1.5 text-xs text-foreground"
            value={safeIdx}
            onChange={(e) => setPairIdx(Number(e.target.value))}
          >
            {pairs.map((pr, i) => (
              <option key={pr.pairLabel} value={i}>
                {pr.pairLabel}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-muted-foreground">
            {pairs.length} pairs (C(n,2)) — others fixed at baseline
          </span>
        </div>
      )}

      {baselineEntries.length > 0 && (
        <p className="text-[11px] text-muted-foreground">
          Baseline (fixed):{" "}
          {baselineEntries.map(([k, v]) => `${k}=${v}`).join(", ")}
        </p>
      )}

      <p className="text-[11px] text-muted-foreground">
        {isPairwise ? "Pairwise sensitivity. " : "Halpin-style sensitivity (line charts). "}
        {seriesHint} Compare productivity and unit cost side by side. When two series coincide, the
        first is solid and the second is dashed.
      </p>

      {(active.bestProductivityLabel || active.bestUnitCostLabel) && (
        <div className="flex flex-wrap gap-3 text-xs">
          {active.bestProductivityLabel && (
            <div className="rounded-[var(--radius-sm)] border border-primary/30 bg-primary/5 px-3 py-2">
              <span className="text-muted-foreground">Best productivity: </span>
              <span className="font-medium text-foreground">{active.bestProductivityLabel}</span>
            </div>
          )}
          {active.bestUnitCostLabel && (
            <div className="rounded-[var(--radius-sm)] border border-primary/30 bg-primary/5 px-3 py-2">
              <span className="text-muted-foreground">Best unit cost: </span>
              <span className="font-medium text-foreground">{active.bestUnitCostLabel}</span>
            </div>
          )}
        </div>
      )}

      <Tabs defaultValue="compare" className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap gap-1 p-1.5">
          <TabsTrigger value="compare" className="flex-1 text-xs">
            Productivity & unit cost
          </TabsTrigger>
          <TabsTrigger value="idle" className="flex-1 text-xs">
            Idleness & utilization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compare" className="mt-3 space-y-3">
          <div className="grid gap-3 lg:grid-cols-2">
            <SensitivityLineChart
              title={`Productivity (${productionUnit}/h)`}
              data={prodChart.data}
              seriesKeys={prodChart.seriesKeys}
              xName={plan.xName}
              yLabel={`${productionUnit}/h`}
              best={bestMarkerFromLabel(rows, plan, active.bestProductivityLabel, "unitsPerHour")}
            />
            <SensitivityLineChart
              title="Unit cost (USD)"
              data={costChart.data}
              seriesKeys={costChart.seriesKeys}
              xName={plan.xName}
              yLabel="USD / unit"
              best={bestMarkerFromLabel(rows, plan, active.bestUnitCostLabel, "unitCostUsd")}
            />
          </div>

          <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-card">
            <button
              type="button"
              onClick={() => setTableOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-muted/40"
            >
              <span>
                Detail table ({rows.length} combinations
                {isPairwise ? ` · ${active.pairLabel}` : ""})
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
                    {rows.map((row) => (
                      <tr
                        key={row.label}
                        className={
                          row.label === active.bestProductivityLabel ||
                          row.label === active.bestUnitCostLabel
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
        </TabsContent>

        <TabsContent value="idle" className="mt-3 space-y-3">
          <SensitivityIdlePanel rows={rows} bestLabel={active.bestProductivityLabel} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/** Idleness (waste) + activity util for best combo and optional second pick. */
function SensitivityIdlePanel({
  rows,
  bestLabel,
}: {
  rows: SensitivityRow[];
  bestLabel: string | null;
}) {
  const best =
    rows.find((r) => r.label === bestLabel) ??
    rows.reduce((a, b) => (a.unitsPerHour >= b.unitsPerHour ? a : b), rows[0]!);

  const idleData = Object.keys(best.idleByResource ?? {})
    .sort()
    .map((name) => ({
      name,
      idle: best.idleByResource[name] ?? 0,
      busy: best.busyByResource[name] ?? Math.max(0, 100 - (best.idleByResource[name] ?? 0)),
    }));

  const utilData = Object.entries(best.utilizations ?? {})
    .map(([name, u]) => ({
      name,
      util: Math.round(u * 1000) / 10,
    }))
    .sort((a, b) => b.util - a.util)
    .slice(0, 12);

  if (!idleData.length && !utilData.length) {
    return (
      <p className="text-[11px] text-muted-foreground">
        No idleness data for this sensitivity run. Re-run Simulate after updating.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-muted-foreground">
        Snapshot for{" "}
        <strong className="text-foreground">{best.label}</strong>
        {" "}
        ({formatNum(best.unitsPerHour)} units/h
        {best.unitCostUsd != null ? ` · ${formatNum(best.unitCostUsd)} USD/unit` : ""}
        ). Resource <strong className="text-foreground">idleness</strong> = waste at home QUEUE;
        activity bars = % time in operation.
      </p>
      <div className="grid gap-3 lg:grid-cols-2">
        {idleData.length > 0 && (
          <ChartDownloadFrame
            title="Resource idle vs busy (best productivity combo)"
            filename="sens_resource_idleness"
            chartClassName="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={idleData} margin={{ top: 28, right: 8, left: 0, bottom: 8 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} angle={-20} textAnchor="end" height={56} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                <Tooltip formatter={(v: number, name: string) => [`${v}%`, name === "idle" ? "Idle %" : "Busy %"]} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="idle" fill="#c41e3a" name="Idle %" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="idle" position="top" formatter={(v: number | string) => `${v}%`} style={{ fontSize: 9, fontWeight: 600 }} />
                </Bar>
                <Bar dataKey="busy" fill="#4a7c59" name="Busy %" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="busy" position="top" formatter={(v: number | string) => `${v}%`} style={{ fontSize: 9, fontWeight: 600 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartDownloadFrame>
        )}
        {utilData.length > 0 && (
          <ChartDownloadFrame
            title="% time in operation (activities)"
            filename="sens_activity_utilization"
            chartClassName="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilData} margin={{ top: 28, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} angle={-20} textAnchor="end" height={56} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                <Tooltip formatter={(v: number) => [`${v}%`, "% time in operation"]} />
                <Bar dataKey="util" fill="var(--chart-1)" name="%" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="util" position="top" formatter={(v: number | string) => `${v}%`} style={{ fontSize: 9, fontWeight: 600 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartDownloadFrame>
        )}
      </div>
    </div>
  );
}
