import type { CycloneModel, CycloneNode, DurationDist } from "./types";
import { formatDuration } from "./duration-format";

/**
 * Human-readable per-resource cycles + task durations.
 */
export function summarizeResourceCycles(model: CycloneModel): string[] {
  const node = new Map(model.nodes.map((n) => [n.id, n]));
  const out = new Map<string, string[]>();
  const inn = new Map<string, string[]>();
  for (const n of model.nodes) {
    out.set(n.id, []);
    inn.set(n.id, []);
  }
  for (const l of model.links) {
    out.get(l.from)?.push(l.to);
    inn.get(l.to)?.push(l.from);
  }

  const lines: string[] = [];
  const homes = model.nodes.filter(
    (n) => n.type === "QUEUE" && (n.initialUnits ?? 0) > 0 && !/@/.test(n.label),
  );

  for (const q of homes) {
    const pathIds = walkResourceCycle(q.id, out, inn, node);
    const labels = pathIds.map((id) => node.get(id)?.label ?? id);
    const n = q.initialUnits ?? 0;
    lines.push(`${q.label} (n=${n}): ${labels.join(" → ")}`);
  }
  return lines;
}

function walkResourceCycle(
  startQueue: string,
  out: Map<string, string[]>,
  inn: Map<string, string[]>,
  node: Map<string, CycloneNode>,
): string[] {
  const path = [startQueue];
  let current = startQueue;
  const visitedEdge = new Set<string>();

  for (let step = 0; step < 32; step++) {
    const outs = out.get(current) ?? [];
    if (!outs.length) break;

    let next: string | undefined;
    const ntype = node.get(current)?.type;

    if (ntype === "COMBI" && outs.length > 1) {
      const preds = (inn.get(current) ?? []).filter((id) => node.get(id)?.type === "QUEUE");
      let idx = preds.indexOf(startQueue);
      if (idx < 0) idx = preds.findIndex((pid) => path.includes(pid));
      if (idx < 0) idx = 0;
      next = outs[idx] ?? outs[0];
    } else if (current === startQueue) {
      next = outs[0];
    } else if (ntype === "QUEUE") {
      next = outs[0];
    } else {
      next = outs.find((id) => id === startQueue) ?? outs[0];
    }

    if (!next) break;
    const edge = `${current}>${next}`;
    if (visitedEdge.has(edge)) break;
    visitedEdge.add(edge);

    path.push(next);
    current = next;
    if (current === startQueue && path.length > 1) break;
  }

  return path;
}

export function summarizeTaskDurations(model: CycloneModel): string[] {
  return model.nodes
    .filter((n) => (n.type === "COMBI" || n.type === "NORMAL") && n.duration)
    .map((n) => `${n.label}: ${formatDuration(n.duration as DurationDist)}`);
}

export function formatCycleSummary(model: CycloneModel, lang: "id" | "en" = "id"): string {
  const cycles = summarizeResourceCycles(model);
  const durs = summarizeTaskDurations(model);
  const parts: string[] = [];

  if (cycles.length) {
    parts.push(
      lang === "id"
        ? "Siklus per resource (pakem CYCLONE):"
        : "Per-resource cycles (CYCLONE):",
    );
    parts.push(...cycles.map((l) => `• ${l}`));
  }
  if (durs.length) {
    parts.push(lang === "id" ? "\nDurasi task:" : "\nTask durations:");
    parts.push(...durs.map((l) => `• ${l}`));
  }
  if (!parts.length) {
    return lang === "id" ? "(belum ada model)" : "(no model yet)";
  }
  return parts.join("\n");
}
