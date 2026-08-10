import type { CostReport } from "@/lib/cyclone/types";
import { formatNum } from "@/lib/utils";

export { SensitivitySection } from "@/components/cyclone/SensitivityCharts";

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
