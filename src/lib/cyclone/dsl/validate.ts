import type { NeoCycloneDocument } from "./schema";

export type DslIssue = {
  level: "error" | "warning";
  code: string;
  message: string;
  path?: string;
};

/**
 * Halpin structural rules beyond zod field checks.
 */
export function validateHalpinRules(doc: NeoCycloneDocument): DslIssue[] {
  const issues: DslIssue[] = [];
  const { nodes, links } = doc.model;
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const ids = nodes.map((n) => n.id);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) {
    issues.push({
      level: "error",
      code: "duplicate_node_id",
      message: `Duplicate node id(s): ${[...new Set(dup)].join(", ")}`,
    });
  }

  links.forEach((l, i) => {
    if (!byId.has(l.from)) {
      issues.push({
        level: "error",
        code: "unknown_from",
        message: `Link ${l.id ?? i}: unknown from "${l.from}"`,
        path: `links[${i}].from`,
      });
    }
    if (!byId.has(l.to)) {
      issues.push({
        level: "error",
        code: "unknown_to",
        message: `Link ${l.id ?? i}: unknown to "${l.to}"`,
        path: `links[${i}].to`,
      });
    }
  });

  // QUEUE → COMBI only; COMBI predecessors all QUEUE
  for (const n of nodes) {
    if (n.type === "QUEUE") {
      const outs = links.filter((l) => l.from === n.id);
      for (const l of outs) {
        const t = byId.get(l.to);
        if (t && t.type !== "COMBI") {
          issues.push({
            level: "error",
            code: "queue_must_feed_combi",
            message: `QUEUE "${n.id}" may only link to COMBI (found ${t.type} "${t.id}")`,
          });
        }
      }
    }
    if (n.type === "COMBI") {
      const ins = links.filter((l) => l.to === n.id);
      if (ins.length === 0) {
        issues.push({
          level: "error",
          code: "combi_needs_queue",
          message: `COMBI "${n.id}" needs at least one QUEUE predecessor`,
        });
      }
      for (const l of ins) {
        const f = byId.get(l.from);
        if (f && f.type !== "QUEUE") {
          issues.push({
            level: "error",
            code: "combi_pred_not_queue",
            message: `COMBI "${n.id}" predecessor "${l.from}" must be QUEUE (found ${f.type})`,
          });
        }
      }
    }
  }

  // Probabilistic branches: sum of declared p on multi-outs should be ~1
  const byFrom = new Map<string, typeof links>();
  for (const l of links) {
    const arr = byFrom.get(l.from) ?? [];
    arr.push(l);
    byFrom.set(l.from, arr);
  }
  for (const [from, outs] of byFrom) {
    if (outs.length < 2) continue;
    const withP = outs.filter((l) => l.probability != null);
    if (!withP.length) continue;
    const sum = withP.reduce((s, l) => s + (l.probability ?? 0), 0);
    if (Math.abs(sum - 1) > 0.05) {
      issues.push({
        level: "warning",
        code: "branch_p_sum",
        message: `Outgoing probabilities from "${from}" sum to ${sum.toFixed(3)} (expect ~1.0); engine will normalize`,
      });
    }
  }

  const counters = nodes.filter((n) => n.type === "COUNTER");
  if (counters.length === 0) {
    issues.push({
      level: "warning",
      code: "no_counter",
      message: "No COUNTER node — productivity stats will be empty",
    });
  }

  // Can any COMBI start?
  const combis = nodes.filter((n) => n.type === "COMBI");
  let anyStartable = false;
  for (const c of combis) {
    const preds = links.filter((l) => l.to === c.id).map((l) => byId.get(l.from));
    if (preds.length && preds.every((p) => p && p.type === "QUEUE" && (p.initial ?? 0) > 0)) {
      anyStartable = true;
      break;
    }
  }
  if (combis.length > 0 && !anyStartable) {
    const anyQueueUnits = nodes.some((n) => n.type === "QUEUE" && (n.initial ?? 0) > 0);
    if (!anyQueueUnits) {
      issues.push({
        level: "warning",
        code: "no_initial_units",
        message: "No QUEUE has initial > 0 — simulation may produce zero cycles",
      });
    }
  }

  return issues;
}

export function hasBlockingErrors(issues: DslIssue[]): boolean {
  return issues.some((i) => i.level === "error");
}
