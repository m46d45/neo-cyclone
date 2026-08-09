import type { CycloneModel, SimResult, SensitivityResult } from "./types";

/** Compact studio snapshot sent to the AI Assistant (not full engine dumps). */
export function buildAssistantContext(input: {
  prompt: string;
  model: CycloneModel;
  modelReady: boolean;
  seed: number;
  maxCycles: number;
  result: SimResult | null;
  sensitivityResult: SensitivityResult | null;
}): string {
  const lines: string[] = [];
  lines.push("=== CURRENT FORMAT PROMPT ===");
  lines.push((input.prompt || "(empty)").slice(0, 6000));
  lines.push("");
  lines.push("=== RUN PARAMETERS ===");
  lines.push(`modelReady: ${input.modelReady}`);
  lines.push(`seed: ${input.seed}`);
  lines.push(`maxCycles: ${input.maxCycles}`);
  lines.push(`model: ${input.model.name || input.model.id || "unnamed"}`);

  const nodes = input.model.nodes ?? [];
  if (nodes.length) {
    lines.push("");
    lines.push("=== NETWORK SUMMARY ===");
    for (const n of nodes) {
      const bits = [`${n.type}:${n.label || n.id}`];
      if (n.type === "QUEUE" && n.initialUnits != null) bits.push(`initial=${n.initialUnits}`);
      if (n.type === "QUEUE" && n.generateCount != null && n.generateCount >= 2) {
        bits.push(`GEN=${n.generateCount}`);
      }
      if (n.type === "CONSOLIDATE" && n.consolidateCount != null) {
        bits.push(`CON=${n.consolidateCount}`);
      }
      if ((n.type === "COMBI" || n.type === "NORMAL") && n.duration) {
        bits.push(`dur=${n.duration.kind}`);
      }
      if (n.type === "COMBI" && n.priority != null) bits.push(`priority=${n.priority}`);
      if (n.type === "COUNTER" && n.productionAmount != null) {
        bits.push(`prod=${n.productionAmount}`);
      }
      lines.push(`- ${bits.join(" ")}`);
    }
    const links = input.model.links ?? [];
    if (links.length) {
      lines.push("links:");
      for (const l of links.slice(0, 80)) {
        const p = l.probability != null ? ` p=${l.probability}` : "";
        lines.push(`  ${l.from} → ${l.to}${p}`);
      }
    }
  }

  const r = input.result;
  if (r) {
    lines.push("");
    lines.push("=== LAST SIMULATION RESULTS ===");
    lines.push(`cyclesCompleted: ${r.cyclesCompleted} / requested ${r.maxCyclesRequested}`);
    lines.push(`simTime (min): ${r.simTime.toFixed(2)}`);
    const last = r.productivitySeries[r.productivitySeries.length - 1];
    if (last) {
      lines.push(`last unitsPerHour: ${last.unitsPerHour.toFixed(3)}`);
      lines.push(`cumulative production: ${last.production}`);
    }
    for (const c of r.counterStats) {
      lines.push(
        `counter ${c.label}: count=${c.count} production=${c.production} unitsPerHour=${c.unitsPerHour.toFixed(3)}`,
      );
    }
    for (const a of r.activityStats.slice(0, 20)) {
      lines.push(
        `activity ${a.label}: util=${(a.utilization * 100).toFixed(1)}% starts=${a.starts}`,
      );
    }
    for (const q of r.queueStats.slice(0, 20)) {
      lines.push(
        `queue ${q.label}: avgLen=${q.avgLength.toFixed(2)} maxLen=${q.maxLength} pctOccupied=${(q.percentOccupied * 100).toFixed(1)}%`,
      );
    }
    for (const idle of r.resourceIdleStats ?? []) {
      lines.push(
        `idle ${idle.resourceLabel}: idlePct=${idle.idlePct.toFixed(1)} busyPct=${idle.busyPct.toFixed(1)} n=${idle.n}`,
      );
    }
    if (r.cost) {
      lines.push(
        `cost totalUsd=${r.cost.totalCostUsd.toFixed(2)} unitCostUsd=${r.cost.unitCostUsd.toFixed(4)}`,
      );
      for (const row of r.cost.resources ?? []) {
        lines.push(`  cost ${row.label}: ${row.totalCostUsd.toFixed(2)} USD`);
      }
    }
    if (r.branchStats?.length) {
      for (const b of r.branchStats) {
        lines.push(
          `branch ${b.fromLabel}→${b.toLabel}: declared=${b.probability ?? "?"} empirical=${b.empiricalShare.toFixed(3)} times=${b.timesTaken}`,
        );
      }
    }
  } else {
    lines.push("");
    lines.push("=== LAST SIMULATION RESULTS ===");
    lines.push("(none — user has not simulated yet)");
  }

  const s = input.sensitivityResult;
  if (s) {
    lines.push("");
    lines.push("=== SENSITIVITY (summary) ===");
    lines.push(`mode: ${s.mode}`);
    if (s.bestProductivityLabel) lines.push(`best productivity: ${s.bestProductivityLabel}`);
    if (s.bestUnitCostLabel) lines.push(`best unit cost: ${s.bestUnitCostLabel}`);
    for (const row of s.rows.slice(0, 25)) {
      lines.push(
        `  ${row.label}: uph=${row.unitsPerHour.toFixed(3)} unitCost=${row.unitCostUsd?.toFixed(4) ?? "n/a"}`,
      );
    }
  }

  return lines.join("\n").slice(0, 14000);
}
