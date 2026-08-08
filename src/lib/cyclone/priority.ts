import type { CycloneModel } from "./types";

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/**
 * Parse optional Priority block from the operation prompt.
 *
 * ```
 * Priority:
 * Lift Steel: 1
 * Lift Forms: 2
 * Pour Deck: 3
 * ```
 *
 * Lower number = higher priority (MicroCYCLONE node-number tradition).
 * Matches COMBI/NORMAL by task label.
 */
export function parsePriorityBlock(text: string): Record<string, number> {
  const out: Record<string, number> = {};
  const lines = text.split(/\n/);
  let inBlock = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || line.startsWith("//")) continue;
    if (/^priority\s*:?\s*$/i.test(line)) {
      inBlock = true;
      continue;
    }
    if (inBlock && /^(cost|sensitivity|durations?|resource|n\s|production|gen|con)\b/i.test(line)) {
      inBlock = false;
    }
    // Also allow single-line: Priority: Lift Steel: 1, Lift Forms: 2
    if (/^priority\s*:/i.test(line) && !/^priority\s*:?\s*$/i.test(line)) {
      inBlock = true;
      const rest = line.replace(/^priority\s*:/i, "").trim();
      if (rest) parsePriorityLine(rest, out);
      continue;
    }
    if (!inBlock) {
      // Inline: Task (priority 1) or Task prio 1
      const m = line.match(/^([A-Za-z][A-Za-z0-9 _/-]{0,40}?)\s*[\(:]\s*(?:priority|prio|pri)\s*[=:]?\s*(\d+)/i);
      if (m) {
        const lab = m[1]!.trim();
        const p = Math.max(1, Math.floor(Number(m[2])));
        if (lab) out[norm(lab)] = p;
      }
      continue;
    }
    parsePriorityLine(line, out);
  }
  return out;
}

function parsePriorityLine(line: string, out: Record<string, number>) {
  // "Lift Steel: 1" or "Lift Steel = 1"
  const m = line.match(/^([A-Za-z][A-Za-z0-9 _/-]{0,40}?)\s*[:=]\s*(\d+)\s*$/);
  if (!m) return;
  const lab = m[1]!.trim();
  if (/^(http|min|note|cost|duration)/i.test(lab)) return;
  const p = Math.max(1, Math.floor(Number(m[2])));
  out[norm(lab)] = p;
}

/** Attach priority numbers to COMBI/NORMAL nodes by label match. */
export function applyPrioritiesToModel(
  model: CycloneModel,
  priorities: Record<string, number>,
): CycloneModel {
  if (!Object.keys(priorities).length) return model;
  return {
    ...model,
    nodes: model.nodes.map((n) => {
      if (n.type !== "COMBI" && n.type !== "NORMAL") return n;
      const p =
        priorities[norm(n.label)] ??
        Object.entries(priorities).find(
          ([k]) => norm(n.label).includes(k) || k.includes(norm(n.label)),
        )?.[1];
      if (p == null || p < 1) return n;
      return { ...n, priority: p };
    }),
  };
}
