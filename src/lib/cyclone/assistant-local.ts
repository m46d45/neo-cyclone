/**
 * On-device AI Assistant (no xAI key / API failure).
 * Grounded in Format Prompt + compact CONTEXT. Never dumps API-key noise.
 */

export const ASSISTANT_MAX_REPLY_LINES = 20;

export type LocalAssistantResult = {
  reply: string;
  proposedPrompt: string | null;
  suggestSimulate: boolean;
};

const SKIP_CYCLE_LABEL =
  /^(operation|model|title|op|counter\s+after|count\s+at|production|durations?|durasi|cost|sensitivity|priority|functions?|branch(es)?|after)$/i;

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function nameStem(name: string): string {
  const t = name.trim();
  if (t.length > 3 && /s$/i.test(t) && !/ss$/i.test(t)) return t.slice(0, -1);
  return t;
}

function namePattern(name: string): string {
  return `${escapeRe(nameStem(name))}s?`;
}

function toTaskLabel(raw: string): string {
  const cleaned = raw
    .replace(/\b(an?|the|activity|task|step|operation)\b/gi, " ")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim();
  if (!cleaned) return "NewTask";
  return cleaned
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("")
    .slice(0, 32);
}

function isCycleLine(line: string): boolean {
  const m = line.match(/^([A-Za-z][A-Za-z0-9 _/-]{0,40})\s*:\s*(.+)$/);
  if (!m) return false;
  const label = m[1]!.trim();
  const rhs = m[2]!.trim();
  if (SKIP_CYCLE_LABEL.test(label)) return false;
  if (/^\d+(\.\d+)?\s*$/.test(rhs)) return false;
  if (/^\d+\s*\.\.\s*\d+/.test(rhs)) return false;
  return /→|->|-->|=>|—|\|/.test(rhs) || /^[A-Za-z][A-Za-z0-9 _/-]{0,40}$/.test(rhs);
}

export function listResourceCycles(prompt: string): { name: string; rhs: string }[] {
  const out: { name: string; rhs: string }[] = [];
  for (const raw of prompt.split("\n")) {
    const line = raw.trim();
    if (!isCycleLine(line)) continue;
    const m = line.match(/^([A-Za-z][A-Za-z0-9 _/-]{0,40})\s*:\s*(.+)$/);
    if (!m) continue;
    out.push({ name: m[1]!.trim(), rhs: m[2]!.trim() });
  }
  return out;
}

export function listTasksFromPrompt(prompt: string): string[] {
  const names: string[] = [];
  const seen = new Set<string>();
  for (const c of listResourceCycles(prompt)) {
    const parts = c.rhs.split(/\s*(?:→|->|-->|=>|—|\|)\s*/);
    for (const p of parts) {
      const lab = p.replace(/\bGEN\s*\d+\b/gi, "").replace(/\bCON\s*\d+\b/gi, "").trim();
      if (!lab || lab.length > 40) continue;
      const key = lab.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      names.push(lab);
    }
  }
  return names;
}

function guessCount(prompt: string, label: string): number | null {
  const cleaned = prompt
    .split("\n")
    .filter((line) => {
      const s = line.trim();
      if (/^(cost|sensitivity|priority|durations?)\s*:/i.test(s)) return false;
      if (/^[A-Za-z][A-Za-z0-9 _/-]{0,40}:\s*\d+(\.\d+)?\s*$/.test(s)) return false;
      return true;
    })
    .join("\n");
  const pat = namePattern(label);
  const re = new RegExp(`(\\d+)[ \\t]+${pat}\\b`, "i");
  const m = cleaned.match(re);
  if (m?.[1]) return Math.max(1, Math.floor(Number(m[1])));
  const reN = new RegExp(`\\bn[ \\t]+${pat}[ \\t]*=[ \\t]*(\\d+)`, "i");
  const mN = cleaned.match(reN);
  if (mN?.[1]) return Math.max(1, Math.floor(Number(mN[1])));
  const prefix = new RegExp(`^(\\d+)[ \\t]+${pat}\\s*:`, "im");
  const mP = cleaned.match(prefix);
  if (mP?.[1]) return Math.max(1, Math.floor(Number(mP[1])));
  return null;
}

export function fleetFromPrompt(prompt: string): { n: number; name: string }[] {
  const cycles = listResourceCycles(prompt);
  if (!cycles.length) return [];
  return cycles.map((c) => ({
    name: c.name,
    n: guessCount(prompt, c.name) ?? 1,
  }));
}

export function parseIdleFromContext(
  context: string,
): { resourceLabel: string; idlePct: number; busyPct: number; n: number }[] {
  const out: { resourceLabel: string; idlePct: number; busyPct: number; n: number }[] = [];
  for (const m of context.matchAll(
    /idle\s+([^:]+):\s*idlePct=([\d.]+)\s+busyPct=([\d.]+)\s+n=(\d+)/gi,
  )) {
    out.push({
      resourceLabel: m[1]!.trim(),
      idlePct: Number(m[2]),
      busyPct: Number(m[3]),
      n: Number(m[4]),
    });
  }
  return out;
}

export function hasSimResults(context: string): boolean {
  return /cyclesCompleted:\s*\d+/i.test(context) && !/\(none — user has not simulated yet\)/i.test(context);
}

export function parseCostFromContext(context: string): {
  totalUsd: number | null;
  unitCostUsd: number | null;
  rows: { label: string; usd: number }[];
} {
  const total = context.match(/cost totalUsd=([\d.]+)/i);
  const unit = context.match(/unitCostUsd=([\d.]+)/i);
  const rows: { label: string; usd: number }[] = [];
  for (const m of context.matchAll(/cost\s+([^:]+):\s*([\d.]+)\s*USD/gi)) {
    rows.push({ label: m[1]!.trim(), usd: Number(m[2]) });
  }
  return {
    totalUsd: total ? Number(total[1]) : null,
    unitCostUsd: unit ? Number(unit[1]) : null,
    rows,
  };
}

export function parseProductivityHint(context: string): string {
  const uph = context.match(/last unitsPerHour:\s*([\d.]+)/i);
  const cycles = context.match(/cyclesCompleted:\s*(\d+)/i);
  const unitCost = context.match(/unitCostUsd=([\d.]+)/i);
  const bits: string[] = [];
  if (cycles) bits.push(`${cycles[1]} cycles`);
  if (uph) bits.push(`units/hour ≈ ${Number(uph[1]).toFixed(3)}`);
  if (unitCost) bits.push(`unit cost ≈ ${Number(unitCost[1]).toFixed(4)} USD`);
  return bits.join(", ");
}

export function compactModelSummary(prompt: string, context: string): string {
  const out: string[] = [];
  const name = context.match(/model:\s*(.+)/i)?.[1]?.trim();
  if (name && name !== "unnamed") out.push(`Model: ${name}`);

  const fleet = fleetFromPrompt(prompt);
  if (fleet.length) {
    out.push("Fleet: " + fleet.map((c) => `${c.n}× ${c.name}`).join(", "));
  }

  const cycles = listResourceCycles(prompt);
  for (const c of cycles.slice(0, 6)) {
    out.push(`${c.name}: ${c.rhs}`);
  }

  if (hasSimResults(context)) {
    const hint = parseProductivityHint(context);
    if (hint) out.push(`Last run: ${hint}`);
  } else {
    out.push("Not simulated yet — Draw Model then Simulate for metrics.");
  }

  if (out.length === 0) {
    const lines = prompt.trim() ? prompt.trim().split(/\n/).filter(Boolean).length : 0;
    out.push(lines ? `Prompt loaded (${lines} lines). Draw Model for network summary.` : "No prompt yet.");
  }
  return out.slice(0, ASSISTANT_MAX_REPLY_LINES).join("\n");
}

/** "Propose trucks = 8; keep paver = 1" / "set trucks to 8" / "n Trucks = 8" */
export function parseCountAssignments(message: string): { name: string; n: number }[] {
  const out: { name: string; n: number }[] = [];
  const seen = new Set<string>();
  const push = (name: string, nStr: string) => {
    const n = Math.floor(Number(nStr));
    if (!Number.isFinite(n) || n < 1 || n > 500) return;
    const key = nameStem(name).toLowerCase();
    if (seen.has(key)) return;
    if (/^(cycle|min|minute|hour|seed|p)$/i.test(name)) return;
    seen.add(key);
    out.push({ name: name.trim(), n });
  };

  const reVerb =
    /(?:propose|set|change|make|keep|use|want|let)\s+([A-Za-z][\w-]*)\s*(?:to|=|→|->|:)\s*(\d+)/gi;
  for (const m of message.matchAll(reVerb)) push(m[1]!, m[2]!);

  const reEq = /\b([A-Za-z][\w-]*)\s*=\s*(\d+)\b/g;
  for (const m of message.matchAll(reEq)) push(m[1]!, m[2]!);

  const reN = /\bn\s+([A-Za-z][\w-]*)\s*=\s*(\d+)/gi;
  for (const m of message.matchAll(reN)) push(m[1]!, m[2]!);

  return out;
}

function applyOneCount(prompt: string, name: string, n: number): { next: string; ok: boolean } {
  const pat = namePattern(name);
  let next = prompt;
  let ok = false;

  const reCount = new RegExp(`(\\d+)([ \\t]+)(${pat})\\b`, "i");
  if (reCount.test(next)) {
    next = next.replace(reCount, `${n}$2$3`);
    ok = true;
  }

  const reN = new RegExp(`(\\bn[ \\t]+${pat}[ \\t]*=[ \\t]*)\\d+`, "i");
  if (reN.test(next)) {
    next = next.replace(reN, `$1${n}`);
    ok = true;
  }

  const rePrefix = new RegExp(`^(\\d+)([ \\t]+)(${pat})(\\s*:)`, "im");
  if (rePrefix.test(next)) {
    next = next.replace(rePrefix, `${n}$2$3$4`);
    ok = true;
  }

  return { next, ok };
}

export function applyCountAssignments(
  prompt: string,
  assignments: { name: string; n: number }[],
): { next: string; applied: { name: string; n: number }[]; missed: string[] } {
  let next = prompt;
  const applied: { name: string; n: number }[] = [];
  const missed: string[] = [];
  const fleet = fleetFromPrompt(prompt);

  for (const a of assignments) {
    const known =
      fleet.find((f) => nameStem(f.name).toLowerCase() === nameStem(a.name).toLowerCase()) ??
      fleet.find((f) => f.name.toLowerCase().startsWith(nameStem(a.name).toLowerCase()));
    const target = known?.name ?? a.name;
    const r = applyOneCount(next, target, a.n);
    if (r.ok) {
      next = r.next;
      applied.push({ name: target, n: a.n });
    } else {
      missed.push(a.name);
    }
  }
  return { next, applied, missed };
}

export function parseAddAfter(message: string): {
  name: string;
  after: string;
  minutes: number | null;
} | null {
  const withDur = message.match(
    /\badd(?:\s+an?)?\s+(.+?)(?:\s+activity|\s+task)?\s+(?:of|lasting|with)\s+(\d+(?:\.\d+)?)\s*(?:min(?:ute)?s?)?\s+after\s+([A-Za-z][\w-]*)/i,
  );
  if (withDur) {
    const minutes = Number(withDur[2]);
    return {
      name: toTaskLabel(withDur[1]!),
      after: withDur[3]!.trim(),
      minutes: Number.isFinite(minutes) && minutes > 0 ? minutes : null,
    };
  }
  const noDur = message.match(
    /\b(?:add(?:\s+an?)?|insert|put)\s+(.+?)(?:\s+activity|\s+task)?\s+after\s+([A-Za-z][\w-]*)/i,
  );
  if (noDur) {
    return { name: toTaskLabel(noDur[1]!), after: noDur[2]!.trim(), minutes: null };
  }
  return null;
}

const ARROW_SPLIT = /\s*(?:→|->|-->|=>|—)\s*/;

function insertInChain(chain: string, after: string, neu: string): string | null {
  const afterKey = after.replace(/\s+/g, "").toLowerCase();
  const neuKey = neu.replace(/\s+/g, "").toLowerCase();

  const insertInSeq = (seq: string): string | null => {
    const tokens = seq.split(ARROW_SPLIT).map((t) => t.trim()).filter(Boolean);
    if (!tokens.length) return null;
    if (tokens.some((t) => t.replace(/\s+/g, "").toLowerCase() === neuKey)) {
      return tokens.join(" → ");
    }
    const idx = tokens.findIndex((t) => {
      const k = t.replace(/\s+/g, "").toLowerCase();
      return k === afterKey || k.endsWith(afterKey) || afterKey.endsWith(k);
    });
    if (idx < 0) return null;
    tokens.splice(idx + 1, 0, neu);
    return tokens.join(" → ");
  };

  if (chain.includes("|")) {
    const parts = chain.split("|").map((s) => s.trim());
    let hit = false;
    const next = parts.map((p) => {
      const r = insertInSeq(p);
      if (r == null) return p;
      hit = true;
      return r;
    });
    return hit ? next.join(" | ") : null;
  }
  return insertInSeq(chain);
}

function resolveAfterTask(prompt: string, after: string): string | null {
  const tasks = listTasksFromPrompt(prompt);
  const key = after.replace(/\s+/g, "").toLowerCase();
  const exact = tasks.find((t) => t.replace(/\s+/g, "").toLowerCase() === key);
  if (exact) return exact;
  const fuzzy = tasks.find((t) => {
    const k = t.replace(/\s+/g, "").toLowerCase();
    return k.includes(key) || key.includes(k);
  });
  return fuzzy ?? null;
}

function upsertDuration(prompt: string, task: string, minutes: number, afterTask?: string): string {
  const durLine = `${task}: const ${minutes}`;
  const existing = new RegExp(`^${escapeRe(task)}\\s*:\\s*.+$`, "im");
  if (existing.test(prompt)) {
    return prompt.replace(existing, durLine);
  }
  if (afterTask) {
    const afterDur = new RegExp(`^(${escapeRe(afterTask)}\\s*:\\s*.+)$`, "im");
    if (afterDur.test(prompt)) {
      return prompt.replace(afterDur, `$1\n${durLine}`);
    }
  }
  if (/^durations?\s*:\s*$/im.test(prompt)) {
    return prompt.replace(/^(durations?\s*:)\s*$/im, `$1\n${durLine}`);
  }
  if (/^durations?\s*:/im.test(prompt)) {
    return prompt.replace(/^(durations?\s*:)/im, `$1\n${durLine}`);
  }
  return `${prompt.trimEnd()}\n\nDurations:\n${durLine}\n`;
}

export function applyAddAfter(
  prompt: string,
  name: string,
  afterRaw: string,
  minutes: number | null,
): { next: string; ok: boolean; after: string | null; reason?: string } {
  const after = resolveAfterTask(prompt, afterRaw);
  if (!after) {
    const tasks = listTasksFromPrompt(prompt);
    return {
      next: prompt,
      ok: false,
      after: null,
      reason: tasks.length
        ? `No task matching “${afterRaw}”. Known tasks: ${tasks.slice(0, 10).join(", ")}.`
        : `No task matching “${afterRaw}” in the Format Prompt.`,
    };
  }

  const lines = prompt.split("\n");
  let changed = false;
  const nextLines = lines.map((line) => {
    const t = line.trim();
    if (!isCycleLine(t)) return line;
    const m = t.match(/^(.+?)\s*:\s*(.+)$/);
    if (!m) return line;
    const inserted = insertInChain(m[2]!, after, name);
    if (!inserted) return line;
    changed = true;
    const indent = line.match(/^\s*/)?.[0] ?? "";
    return `${indent}${m[1]!.trim()}: ${inserted}`;
  });

  if (!changed) {
    return {
      next: prompt,
      ok: false,
      after,
      reason: `Found ${after}, but it is not on a resource cycle I can edit.`,
    };
  }

  let next = nextLines.join("\n");
  if (minutes != null) next = upsertDuration(next, name, minutes, after);
  return { next, ok: true, after };
}

function helpText(): string {
  return [
    "I can answer from the current prompt and last run:",
    "• How many resources?",
    "• Which resource is the bottleneck?",
    "• What was productivity?",
    "• What is the unit cost?",
    "Edits (Apply, then Draw Model, then Simulate):",
    "• Propose trucks = 8; keep paver = 1",
    "• Add SlumpTest of 5 minutes after Discharge",
  ].join("\n");
}

export function localAssistant(message: string, prompt: string, context: string): LocalAssistantResult {
  const q = message.toLowerCase();
  const bits: string[] = [];
  let proposedPrompt: string | null = null;
  let suggestSimulate = false;

  const assignments = parseCountAssignments(message);
  if (assignments.length && prompt.trim()) {
    const r = applyCountAssignments(prompt, assignments);
    if (r.applied.length) {
      proposedPrompt = r.next;
      suggestSimulate = true;
      bits.push(
        "Propose fleet change:",
        ...r.applied.map((a) => `• ${a.name} → ${a.n}`),
        "Click Apply, then Draw Model, then Simulate.",
      );
      if (r.missed.length) {
        bits.push(`Not found in prompt: ${r.missed.join(", ")}.`);
      }
    } else if (r.missed.length) {
      bits.push(
        `Could not find ${r.missed.join(", ")} as a fleet count in the Format Prompt.`,
        "Use a line like `4 trucks, 1 paver` or `n Trucks = 4`.",
      );
    }
  }

  const add = parseAddAfter(message);
  if (add && prompt.trim()) {
    const r = applyAddAfter(proposedPrompt ?? prompt, add.name, add.after, add.minutes);
    if (r.ok) {
      proposedPrompt = r.next;
      suggestSimulate = true;
      bits.push(
        `Propose new task ${add.name} after ${r.after}.` +
          (add.minutes != null ? ` Duration: const ${add.minutes} min.` : " Add a Durations: line if needed."),
        "Click Apply, then Draw Model, then Simulate.",
      );
    } else if (r.reason) {
      bits.push(r.reason);
    }
  }

  const asksBottleneck =
    /bottleneck|most (problem|critical|idle|busy)|which resource|waste|highest idle/i.test(q);

  if (asksBottleneck) {
    const idleStats = parseIdleFromContext(context);
    if (idleStats.length) {
      const sorted = [...idleStats].sort((a, b) => b.idlePct - a.idlePct);
      const worst = sorted[0]!;
      bits.push(
        "Home-QUEUE idleness (waste):",
        ...sorted
          .slice(0, 8)
          .map((r) => `• ${r.resourceLabel}: idle ${r.idlePct.toFixed(1)}% · busy ${r.busyPct.toFixed(1)}%`),
        `Highest idle: ${worst.resourceLabel} (${worst.idlePct.toFixed(1)}%).`,
      );
    } else {
      bits.push("Run Simulate first, then ask about the bottleneck.");
    }
  }

  if (/how many|fleet|jumlah|berapa|resources\?/.test(q)) {
    const counts = fleetFromPrompt(prompt);
    if (counts.length) {
      bits.push("Fleet:", ...counts.map((c) => `• ${c.n} × ${c.name}`));
    } else {
      bits.push("No clear fleet counts in the Format Prompt.");
    }
  }

  if (/explain|summary|describe|jelaskan|resource cycle|this model/.test(q) && !asksBottleneck) {
    bits.push(compactModelSummary(prompt, context));
  }

  const asksUnitCost = /unit\s*cost|biaya\s*satuan|cost per unit/.test(q);
  if (asksUnitCost) {
    const cost = parseCostFromContext(context);
    if (cost.unitCostUsd != null) {
      bits.push(
        `Unit cost ≈ ${cost.unitCostUsd.toFixed(4)} USD / unit` +
          (cost.totalUsd != null ? ` (total ${cost.totalUsd.toFixed(2)} USD).` : "."),
      );
      for (const row of cost.rows.slice(0, 8)) {
        bits.push(`• ${row.label}: ${row.usd.toFixed(2)} USD`);
      }
    } else if (hasSimResults(context)) {
      bits.push("This run has no Cost Report. Add `Cost:` rates (USD per resource-hour) and Simulate again.");
    } else {
      bits.push("No results yet. Draw Model, then Simulate (Cost: block needed for unit cost).");
    }
  }

  if (/productiv|produktiv|units per|steady|hasil/.test(q)) {
    if (hasSimResults(context)) {
      const hint = parseProductivityHint(context);
      bits.push(hint ? `Productivity: ${hint}.` : "Last run metrics are in context.");
    } else {
      bits.push("No results yet. Draw Model, then Simulate.");
    }
  }

  if (!asksBottleneck && /idle|waste|util|busy/.test(q)) {
    const idleStats = parseIdleFromContext(context);
    if (idleStats.length) {
      bits.push(
        "Idleness:",
        ...idleStats
          .slice(0, 8)
          .map((r) => `• ${r.resourceLabel}: idle ${r.idlePct.toFixed(1)}% / busy ${r.busyPct.toFixed(1)}%`),
      );
    }
  }

  if (/help|keyword|command|what can you/.test(q)) {
    bits.push(helpText());
  }

  let reply = bits.filter(Boolean).join("\n").trim();
  if (!reply) {
    reply = compactModelSummary(prompt, context) + "\n\n" + helpText();
  }

  return { reply, proposedPrompt, suggestSimulate };
}
