import type { CostReport, CycloneModel, ResourceCostStat } from "./types";

function isMinutes(unit: string): boolean {
  const u = unit.toLowerCase();
  return u === "min" || u === "mins" || u === "minute" || u === "minutes";
}

/** Convert simulation clock to operating hours (Halpin process costing). */
export function simTimeToHours(simTime: number, timeUnit: string): number {
  if (simTime <= 0) return 0;
  if (isMinutes(timeUnit)) return simTime / 60;
  if (timeUnit.toLowerCase().startsWith("h")) return simTime;
  // default minutes
  return simTime / 60;
}

/**
 * MicroCYCLONE-style process cost:
 * resource total = n × (USD/h) × run hours
 * unit cost = total cost / production
 */
export function buildCostReport(
  model: CycloneModel,
  simTime: number,
  production: number,
): CostReport | undefined {
  const runHours = simTimeToHours(simTime, model.timeUnit);
  const resources: ResourceCostStat[] = [];

  for (const n of model.nodes) {
    if (n.type !== "QUEUE") continue;
    const rate = n.costPerHourUsd;
    if (rate == null || !(rate > 0)) continue;
    const count = Math.max(0, n.initialUnits ?? 0);
    if (count <= 0) continue;
    const totalCostUsd = Math.round(count * rate * runHours * 100) / 100;
    resources.push({
      nodeId: n.id,
      label: n.label.replace(/\s*Idle$/i, "").trim() || n.label,
      count,
      costPerHourUsd: rate,
      totalCostUsd,
    });
  }

  if (!resources.length) return undefined;

  const totalCostUsd =
    Math.round(resources.reduce((s, r) => s + r.totalCostUsd, 0) * 100) / 100;
  const unitCostUsd =
    production > 0 ? Math.round((totalCostUsd / production) * 10000) / 10000 : 0;

  return {
    currency: "USD",
    runHours: Math.round(runHours * 1000) / 1000,
    resources,
    totalCostUsd,
    unitCostUsd,
    production,
    productionUnit: model.productionUnit,
  };
}
