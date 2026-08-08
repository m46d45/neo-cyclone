import { runCyclone } from "./engine";
import type {
  CycloneModel,
  SensitivityRange,
  SensitivityResult,
  SensitivityRow,
  SimConfig,
} from "./types";

function norm(s: string): string {
  return s.toLowerCase().replace(/\s*idle$/i, "").replace(/[^a-z0-9]+/g, "");
}

function findHomeQueue(model: CycloneModel, label: string) {
  const n = norm(label);
  return model.nodes.find(
    (q) =>
      q.type === "QUEUE" &&
      (q.initialUnits ?? 0) > 0 &&
      (norm(q.label) === n ||
        norm(q.label).includes(n) ||
        n.includes(norm(q.label).replace(/idle$/, ""))),
  );
}

/** Cartesian product of integer ranges (capped for teaching UI). */
function expandCombos(
  ranges: { queueId: string; label: string; values: number[] }[],
  maxCombos = 48,
): { counts: Record<string, number>; label: string }[] {
  let combos: { counts: Record<string, number>; label: string }[] = [
    { counts: {}, label: "" },
  ];
  for (const r of ranges) {
    const next: typeof combos = [];
    for (const c of combos) {
      for (const v of r.values) {
        next.push({
          counts: { ...c.counts, [r.queueId]: v },
          label: c.label
            ? `${c.label}, ${r.label}=${v}`
            : `${r.label}=${v}`,
        });
        if (next.length >= maxCombos) return next;
      }
    }
    combos = next;
  }
  return combos;
}

/**
 * Sensitivity analysis (Halpin / MicroCYCLONE teaching pattern):
 * vary resource counts low..high and compare productivity, unit cost, utilization.
 */
export function runSensitivity(
  model: CycloneModel,
  config: SimConfig,
  ranges?: SensitivityRange[],
): SensitivityResult {
  const plan = ranges ?? model.sensitivity ?? [];
  if (!plan.length) return { rows: [], bestProductivityLabel: null, bestUnitCostLabel: null };

  const resolved: { queueId: string; label: string; values: number[] }[] = [];
  for (const p of plan) {
    const q = findHomeQueue(model, p.resourceLabel);
    if (!q) continue;
    const step = Math.max(1, Math.floor(p.step ?? 1));
    const low = Math.max(1, Math.floor(p.low));
    const high = Math.max(low, Math.floor(p.high));
    const values: number[] = [];
    for (let v = low; v <= high; v += step) values.push(v);
    resolved.push({
      queueId: q.id,
      label: q.label.replace(/\s*Idle$/i, "").trim() || q.label,
      values,
    });
  }
  if (!resolved.length) {
    return { rows: [], bestProductivityLabel: null, bestUnitCostLabel: null };
  }

  const combos = expandCombos(resolved);
  const rows: SensitivityRow[] = [];

  for (const combo of combos) {
    const m: CycloneModel = {
      ...model,
      nodes: model.nodes.map((n) =>
        combo.counts[n.id] != null
          ? { ...n, initialUnits: combo.counts[n.id] }
          : { ...n },
      ),
    };
    const result = runCyclone(m, config);
    const primary = result.counterStats[0];
    const utilizations: Record<string, number> = {};
    for (const a of result.activityStats) {
      utilizations[a.label] = Math.round(a.utilization * 1000) / 1000;
    }
    rows.push({
      counts: { ...combo.counts },
      label: combo.label,
      unitsPerHour: primary?.unitsPerHour ?? 0,
      unitCostUsd: result.cost?.unitCostUsd ?? null,
      totalCostUsd: result.cost?.totalCostUsd ?? null,
      runLength: result.simTime,
      cycles: result.cyclesCompleted,
      utilizations,
    });
  }

  let bestP: SensitivityRow | null = null;
  let bestC: SensitivityRow | null = null;
  for (const r of rows) {
    if (!bestP || r.unitsPerHour > bestP.unitsPerHour) bestP = r;
    if (r.unitCostUsd != null && r.unitCostUsd > 0) {
      if (!bestC || (bestC.unitCostUsd ?? Infinity) > r.unitCostUsd) bestC = r;
    }
  }

  return {
    rows,
    bestProductivityLabel: bestP?.label ?? null,
    bestUnitCostLabel: bestC?.label ?? null,
  };
}

/** Parse "Sensitivity:" / "Cost USD/h:" blocks from a prompt. */
export function parseCostAndSensitivity(text: string): {
  costs: Record<string, number>;
  sensitivity: SensitivityRange[];
} {
  const costs: Record<string, number> = {};
  const sensitivity: SensitivityRange[] = [];
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);

  let mode: "none" | "cost" | "sens" = "none";
  for (const line of lines) {
    if (/^cost(\s+usd\/h)?\s*:/i.test(line)) {
      mode = "cost";
      const rest = line.replace(/^cost(\s+usd\/h)?\s*:/i, "").trim();
      if (rest) parseCostLine(rest, costs);
      continue;
    }
    if (/^sensitivity\s*:/i.test(line)) {
      mode = "sens";
      const rest = line.replace(/^sensitivity\s*:/i, "").trim();
      if (rest) parseSensLine(rest, sensitivity);
      continue;
    }
    if (/^(durations?|resource|n\s|production)\b/i.test(line) && !/usd|cost|sensitivity/i.test(line)) {
      mode = "none";
    }
    if (mode === "cost") parseCostLine(line, costs);
    else if (mode === "sens") parseSensLine(line, sensitivity);
    else {
      // inline: Trucks: 85 USD/h  or  cost trucks 85
      const m = line.match(/^([A-Za-z][\w\s-]{1,24}?)\s*:\s*(\d+(?:\.\d+)?)\s*(usd\/h|\/h|\$\/h)?\s*$/i);
      if (m && /usd|\/h|cost/i.test(line + (m[3] ?? ""))) {
        costs[m[1]!.trim()] = Number(m[2]);
      }
    }
  }
  return { costs, sensitivity };
}

function parseCostLine(line: string, costs: Record<string, number>) {
  // "Trucks: 85" or "Trucks 85" or "Trucks=85"
  const parts = line.split(/[,;]/).map((p) => p.trim()).filter(Boolean);
  for (const p of parts) {
    const m = p.match(/^([A-Za-z][\w\s-]{0,24}?)\s*[:=]?\s*(\d+(?:\.\d+)?)/);
    if (m) costs[m[1]!.trim()] = Number(m[2]);
  }
}

function parseSensLine(line: string, sensitivity: SensitivityRange[]) {
  const parts = line.split(/[,;]/).map((p) => p.trim()).filter(Boolean);
  for (const p of parts) {
    const m = p.match(/^([A-Za-z][\w\s-]{0,24}?)\s*[:=]?\s*(\d+)\s*\.\.\s*(\d+)(?:\s*step\s*(\d+))?/i);
    if (m) {
      sensitivity.push({
        resourceLabel: m[1]!.trim(),
        low: Number(m[2]),
        high: Number(m[3]),
        step: m[4] ? Number(m[4]) : 1,
      });
    }
  }
}

/** Apply parsed USD/h rates onto home QUEUE nodes by label match. */
export function applyCostsToModel(
  model: CycloneModel,
  costs: Record<string, number>,
): CycloneModel {
  if (!Object.keys(costs).length) return model;
  const nodes = model.nodes.map((n) => {
    if (n.type !== "QUEUE" || !(n.initialUnits && n.initialUnits > 0)) return n;
    const nl = norm(n.label);
    for (const [lab, rate] of Object.entries(costs)) {
      const k = norm(lab);
      if (nl === k || nl.includes(k) || k.includes(nl.replace(/idle$/, ""))) {
        return { ...n, costPerHourUsd: rate };
      }
    }
    return n;
  });
  return { ...model, nodes };
}
