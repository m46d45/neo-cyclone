import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CostReport, SensitivityResult } from "@/lib/cyclone/types";
import { formatNum } from "@/lib/utils";

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

/** Halpin-style sensitivity comparison chart + table. */
export function SensitivitySection({
  sensitivity,
  productionUnit,
}: {
  sensitivity: SensitivityResult;
  productionUnit: string;
}) {
  if (!sensitivity.rows.length) return null;
  return (
    <div className="mt-3 space-y-4">
      <p className="text-[11px] text-muted-foreground">
        Halpin-style sensitivity: resource counts varied low..high (step 1). Compare productivity,
        unit cost, and utilization across combinations.
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
      <div className="h-56 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sensitivity.rows} margin={{ top: 18, right: 12, left: 0, bottom: 48 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9 }}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={60}
            />
            <YAxis
              yAxisId="left"
              domain={[0, "auto"]}
              tick={{ fontSize: 10 }}
              label={{
                value: `${productionUnit}/h`,
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 10, fill: "var(--muted-foreground)" },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, "auto"]}
              tick={{ fontSize: 10 }}
              label={{
                value: "USD / unit",
                angle: 90,
                position: "insideRight",
                style: { fontSize: 10, fill: "var(--muted-foreground)" },
              }}
            />
            <Tooltip />
            <Bar yAxisId="left" dataKey="unitsPerHour" fill="var(--chart-2)" name="Units / hour" radius={3}>
              <LabelList
                dataKey="unitsPerHour"
                position="top"
                formatter={(v: number | string) => `${v}`}
                style={{ fontSize: 9, fill: "var(--foreground)" }}
              />
            </Bar>
            <Bar
              yAxisId="right"
              dataKey="unitCostUsd"
              fill="var(--chart-1)"
              name="Unit cost (USD)"
              radius={3}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="max-h-72 overflow-auto rounded-[var(--radius-sm)] border border-border">
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
    </div>
  );
}
