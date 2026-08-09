import type { CycloneLink, CycloneModel, CycloneNode, DurationDist } from "./types";
import {
  parseDurationBlock,
  parseStepsWithInlineDurations,
  parseDurationToken,
} from "./duration-format";
import { stripPromptComments } from "./prompt-template";
import {
  parseCostAndSensitivity,
  applyCostsToModel,
} from "./sensitivity";
import { parsePriorityBlock, applyPrioritiesToModel } from "./priority";
import {
  parseFunctionsAndBranch,
  matchGen,
  matchCon,
  type FunctionsPrompt,
} from "./functions-prompt";
import {
  parseCounterPlacement,
  resolveCounterAfter,
  type CounterPlacement,
} from "./counter-prompt";

export type ResourceCycle = {
  id: string;
  label: string;
  count: number;
  /** Primary task sequence for this resource. */
  itinerary: string[];
  /**
   * Extra first COMBIs served from the same home QUEUE (shared resource multi-demand).
   * Example tower crane: itinerary=["Lift Steel"], alsoServes=["Lift Forms","Lift Bucket"].
   * Engine/priority decide which COMBI wins when the resource is free.
   */
  alsoServes?: string[];
};

export type OperationSpec = {
  name: string;
  description?: string;
  timeUnit?: string;
  productionUnit?: string;
  productionPerCycle?: number;
  maxTime?: number;
  maxCycles?: number;
  resources: ResourceCycle[];
  durations?: Record<string, DurationDist>;
  productionResourceId?: string;
  /** GEN / CON / Branch from Format Prompt §4 (no hand-drawn QUEUE/arcs). */
  functions?: FunctionsPrompt;
  /**
   * Where COUNTER sits (one production unit / completed cycle).
   * Default: after last task of first resource if not specified.
   */
  counter?: CounterPlacement;
};

const DEFAULT_DUR: DurationDist = { kind: "triangular", min: 2, mode: 4, max: 6 };

function slug(s: string): string {
  const x = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 28);
  return x && /^[a-z]/.test(x) ? x : `n_${x || "x"}`;
}

function uniqueId(base: string, used: Set<string>): string {
  let id = slug(base);
  if (!used.has(id)) {
    used.add(id);
    return id;
  }
  let i = 2;
  while (used.has(`${id}_${i}`)) i++;
  const out = `${id}_${i}`;
  used.add(out);
  return out;
}

function titleCase(s: string): string {
  return s.replace(/(^|[\s-_])(\w)/g, (_, a, b) => a + String(b).toUpperCase());
}

function normLabel(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function lookupDur(
  map: Record<string, DurationDist> | undefined,
  key: string,
): DurationDist | undefined {
  if (!map) return undefined;
  if (map[key]) return map[key];
  const found = Object.entries(map).find(([k]) => normLabel(k) === normLabel(key));
  return found?.[1];
}

export function buildFromSpec(spec: OperationSpec): CycloneModel {
  if (!spec.resources.length) throw new Error("Need at least one resource");
  for (const r of spec.resources) {
    if (!r.itinerary.length) {
      throw new Error(`Resource "${r.label}" needs at least one task in its cycle`);
    }
  }

  const used = new Set<string>();
  const nodes: CycloneNode[] = [];
  const links: CycloneLink[] = [];
  let linkN = 0;
  const linkSet = new Set<string>();
  const addLink = (from: string, to: string) => {
    const key = `${from}->${to}`;
    if (linkSet.has(key)) return;
    linkSet.add(key);
    links.push({ id: `l${++linkN}`, from, to });
  };

  const homeQueue = new Map<string, string>();
  spec.resources.forEach((r, i) => {
    const id = uniqueId(`q_${r.id}`, used);
    homeQueue.set(r.id, id);
    nodes.push({
      id,
      type: "QUEUE",
      label: /idle|antrian|wait/i.test(r.label) ? r.label : `${r.label} Idle`,
      x: 60,
      y: 90 + i * 140,
      initialUnits: Math.max(0, Math.floor(r.count)),
    });
  });

  const fn = spec.functions ?? { gens: [], cons: [], branches: [] };

  // Expand inline GEN/CON tokens in each resource chain (chain = source of truth).
  for (const r of spec.resources) {
    const expanded = expandInlineGenCon(r.itinerary, fn);
    r.itinerary = expanded.labels;
  }
  // Functions: GEN Name = k not appearing in any chain → prepend as named GEN step
  // (legacy). Prefer inline "GEN 5 → …" in the cycle.
  for (const g of fn.gens) {
    const gk = normLabel(g.label);
    const used = spec.resources.some((r) =>
      r.itinerary.some((lab) => normLabel(lab) === gk),
    );
    if (used) continue;
    // If label looks like pure GEN token already handled, skip
    if (/^gen\d+$/i.test(gk)) continue;
    const host = spec.resources[0];
    if (!host) continue;
    host.itinerary = [g.label.trim(), ...host.itinerary];
  }

  /**
   * COMBI = two or more resources must meet (task appears in ≥2 resource cycles
   * or in itinerary + alsoServes of another). Single-resource work = NORMAL
   * (e.g. LoadAtPlant with only trucks; plant assumed unlimited / no second QUEUE).
   */
  const resourceTouch = new Map<string, Set<string>>();
  const touch = (lab: string, rid: string) => {
    const k = normLabel(lab);
    const set = resourceTouch.get(k) ?? new Set<string>();
    set.add(rid);
    resourceTouch.set(k, set);
  };
  for (const r of spec.resources) {
    for (const lab of r.itinerary) touch(lab, r.id);
    for (const lab of r.alsoServes ?? []) touch(lab, r.id);
  }
  const isMeetingTask = (key: string) => (resourceTouch.get(key)?.size ?? 0) >= 2;

  /** Step id by norm label; may be COMBI, NORMAL, QUEUE(GEN), or CONSOLIDATE. */
  const activityId = new Map<string, string>();
  type StepKind = "COMBI" | "NORMAL" | "GEN" | "CON";
  const activityType = new Map<string, StepKind>();

  const ensureActivity = (lab: string) => {
    const key = normLabel(lab);
    if (activityId.has(key)) return;

    const gen = matchGen(lab, fn.gens);
    const con = matchCon(lab, fn.cons);

    if (gen) {
      const id = uniqueId(`q_gen_${key}`, used);
      activityId.set(key, id);
      activityType.set(key, "GEN");
      nodes.push({
        id,
        type: "QUEUE",
        label: lab.trim(),
        x: 0,
        y: 0,
        initialUnits: 0,
        generateCount: gen.k,
      });
      return;
    }
    if (con) {
      const id = uniqueId(`con_${key}`, used);
      activityId.set(key, id);
      activityType.set(key, "CON");
      nodes.push({
        id,
        type: "CONSOLIDATE",
        label: lab.trim(),
        x: 0,
        y: 0,
        consolidateCount: con.n,
      });
      return;
    }

    const isCombi = isMeetingTask(key);
    const id = uniqueId(isCombi ? `c_${key}` : `n_${key}`, used);
    activityId.set(key, id);
    activityType.set(key, isCombi ? "COMBI" : "NORMAL");
    const dur =
      lookupDur(spec.durations, lab) ?? lookupDur(spec.durations, key) ?? DEFAULT_DUR;
    nodes.push({
      id,
      type: isCombi ? "COMBI" : "NORMAL",
      label: lab.trim(),
      x: 0,
      y: 0,
      duration: dur,
    });
  };

  // Branch arm targets may not appear in a resource itinerary — still create them
  for (const b of fn.branches) {
    ensureActivity(b.afterLabel);
    for (const arm of b.arms) ensureActivity(arm.toLabel);
  }

  for (const r of spec.resources) {
    for (const lab of r.itinerary) ensureActivity(lab);
    for (const lab of r.alsoServes ?? []) ensureActivity(lab);
  }

  // QUEUE (GEN) may only feed COMBI — promote following NORMAL → COMBI
  for (const r of spec.resources) {
    for (let i = 0; i < r.itinerary.length - 1; i++) {
      const aKey = normLabel(r.itinerary[i]!);
      const bKey = normLabel(r.itinerary[i + 1]!);
      if (activityType.get(aKey) !== "GEN") continue;
      if (activityType.get(bKey) === "NORMAL") {
        const id = activityId.get(bKey)!;
        const node = nodes.find((n) => n.id === id);
        if (node && node.type === "NORMAL") {
          node.type = "COMBI";
          activityType.set(bKey, "COMBI");
        }
      }
    }
  }

  const prodRes =
    spec.resources.find((r) => r.id === spec.productionResourceId) ?? spec.resources[0]!;
  const counterId = uniqueId("ctr", used);
  const counterAmt = spec.counter?.amount ?? spec.productionPerCycle ?? 1;
  nodes.push({
    id: counterId,
    type: "COUNTER",
    label: "Production",
    x: 0,
    y: 0,
    productionAmount: counterAmt,
  });

  const stagingByResource = new Map<string, string[]>();

  // Only ONE resource owns the COUNTER insertion point (avoid Lay matching
  // every resource that shares a COMBI). Prefer production resource if it
  // contains Counter after:; else first resource that has that task.
  const counterSpecGlobal = spec.counter ?? { afterLabel: null, amount: 1, unit: "unit" };
  const countOwnerId: string = (() => {
    if (!counterSpecGlobal.afterLabel) return prodRes.id;
    const want = normLabel(counterSpecGlobal.afterLabel);
    if (prodRes.itinerary.some((lab) => normLabel(lab) === want)) return prodRes.id;
    for (const r of spec.resources) {
      if (r.itinerary.some((lab) => normLabel(lab) === want)) return r.id;
    }
    return prodRes.id;
  })();


  for (const r of spec.resources) {
    const home = homeQueue.get(r.id)!;
    const steps = r.itinerary.map((lab) => ({
      key: normLabel(lab),
      id: activityId.get(normLabel(lab))!,
      type: activityType.get(normLabel(lab))!,
      label: lab,
    }));

    // COUNTER after a named task — only on the single owner resource cycle
    // (e.g. after Pave on paver; not on every resource that shares Dump/Lay).
    let countAtForThis: string | null = null;
    if (r.id === countOwnerId) {
      if (counterSpecGlobal.afterLabel) {
        const want = normLabel(counterSpecGlobal.afterLabel);
        // Exact match only — "Pave" must not hit "DumpToPaver"
        const hit = r.itinerary.find((lab) => normLabel(lab) === want);
        if (hit) countAtForThis = hit;
      } else {
        countAtForThis = r.itinerary[r.itinerary.length - 1] ?? null;
      }
    }
    const countAtKey = countAtForThis ? normLabel(countAtForThis) : null;

    // Home QUEUE feeds first step: COMBI / NORMAL / GEN load-zone queue.
    const first = steps[0]!;
    if (first.type === "COMBI" || first.type === "NORMAL" || first.type === "GEN") {
      addLink(home, first.id);
    } else {
      const firstWork =
        steps.find((s) => s.type === "COMBI" || s.type === "NORMAL" || s.type === "GEN") ??
        first;
      addLink(home, firstWork.id);
    }
    const stags: string[] = [];

    for (let i = 0; i < steps.length - 1; i++) {
      const a = steps[i]!;
      const b = steps[i + 1]!;
      // Skip sequential A→B only if B is a declared branch arm after A
      // (keeps Dump→Pave for the other resource when trucks branch after Dump).
      const isBranchArm = fn.branches.some(
        (br) =>
          normLabel(br.afterLabel) === a.key &&
          br.arms.some((arm) => normLabel(arm.toLabel) === b.key),
      );
      if (isBranchArm) continue;
      // COUNTER sits between count-at task and its successor
      if (countAtKey && a.key === countAtKey) continue;

      if (b.type === "COMBI" && a.type !== "GEN") {
        // Need QUEUE predecessor for COMBI (Halpin) unless previous is already QUEUE
        const stagId = uniqueId(`q_${r.id}_${b.key}`, used);
        nodes.push({
          id: stagId,
          type: "QUEUE",
          label: `${r.label} @ ${b.label}`,
          x: 0,
          y: 0,
          initialUnits: 0,
        });
        stags.push(stagId);
        addLink(a.id, stagId);
        addLink(stagId, b.id);
      } else {
        // GEN→COMBI, *→CON, *→NORMAL, *→GEN
        addLink(a.id, b.id);
      }
    }
    stagingByResource.set(r.id, stags);

    const last = steps[steps.length - 1]!;
    const countAfterLab = countAtForThis;
    const countAfterKey = countAtKey;
    const countAfterStep = countAfterKey
      ? steps.find((s) => s.key === countAfterKey)
      : null;

    // Branch that forks the production return (e.g. after Dump → Return/Breakdown)
    const branchAfterCount = countAfterKey
      ? fn.branches.some((br) => normLabel(br.afterLabel) === countAfterKey)
      : false;
    const branchAfterLast = fn.branches.some(
      (br) => normLabel(br.afterLabel) === last.key,
    );

    if (countAfterStep) {
      // Insert COUNTER immediately after the count-at task (any resource cycle)
      addLink(countAfterStep.id, counterId);
      // Continue path: if count-at is not last, counter → next step
      const idx = steps.findIndex((s) => s.key === countAfterKey);
      if (idx >= 0 && idx < steps.length - 1 && !branchAfterCount) {
        const next = steps[idx + 1]!;
        // Avoid double sequential if already linked count→next before (branch skip may have removed it)
        addLink(counterId, next.id);
      } else if (!branchAfterCount) {
        // Count-at is last task: return home after counter
        addLink(counterId, home);
      }
      // branchAfterCount: counter → Return/Breakdown with p (wired below)
      // If count-at is mid-path, still need last → home unless last goes through counter chain
      if (idx < steps.length - 1 && last.id !== countAfterStep.id) {
        // last task still needs return home for this resource
        if (!branchAfterLast) addLink(last.id, home);
      }
    } else if (r.id !== prodRes.id) {
      if (!branchAfterLast) addLink(last.id, home);
    } else if (!branchAfterLast) {
      addLink(last.id, home);
    }

    // Multi-demand: home QUEUE also feeds other COMBIs; return to home after each
    for (const alt of r.alsoServes ?? []) {
      const aid = activityId.get(normLabel(alt));
      if (!aid) continue;
      addLink(home, aid);
      // Shared resource returns home after serving this demand COMBI
      addLink(aid, home);
    }
  }


  // Probabilistic branches: After Task → arms with p (diagram shows p=…)
  const addLinkP = (from: string, to: string, probability?: number) => {
    const key = `${from}->${to}`;
    if (linkSet.has(key)) {
      // upgrade existing with probability
      const existing = links.find((l) => l.from === from && l.to === to);
      if (existing && probability != null) existing.probability = probability;
      return;
    }
    linkSet.add(key);
    links.push({
      id: `l${++linkN}`,
      from,
      to,
      probability,
    });
  };

  // Exact Counter after: label (any resource) — used for branch fork-from-counter
  const countAfterExact = spec.counter?.afterLabel
    ? normLabel(spec.counter.afterLabel)
    : null;

  for (const br of fn.branches) {
    const afterKey = normLabel(br.afterLabel);
    const fromId = activityId.get(afterKey);
    if (!fromId) continue;

    // If Branch after the same task as Counter after:, fork FROM the COUNTER
    // so production is counted before Return vs Breakdown is sampled.
    const afterIsCountAt = countAfterExact != null && afterKey === countAfterExact;
    const forkFrom = afterIsCountAt ? counterId : fromId;

    // Main continuation on a resource cycle that lists After → Next
    // (e.g. DumpToPaver → RefillAsphalt). Detour arms rejoin this next step.
    let mainNextLab: string | null = null;
    for (const r of spec.resources) {
      const idx = r.itinerary.findIndex((lab) => normLabel(lab) === afterKey);
      if (idx >= 0 && idx < r.itinerary.length - 1) {
        mainNextLab = r.itinerary[idx + 1]!;
        break;
      }
    }
    const mainNextKey = mainNextLab ? normLabel(mainNextLab) : null;
    const mainNextId = mainNextKey ? activityId.get(mainNextKey) : undefined;
    const home = homeQueue.get(prodRes.id)!;

    for (const arm of br.arms) {
      let toId = activityId.get(normLabel(arm.toLabel));
      if (!toId) {
        ensureActivity(arm.toLabel);
        toId = activityId.get(normLabel(arm.toLabel));
      }
      if (!toId) continue;

      if (/^(pass|ok|done|accept|good|finish)/i.test(arm.toLabel) && !afterIsCountAt) {
        addLinkP(fromId, counterId, arm.p);
      } else {
        addLinkP(forkFrom, toId, arm.p);
        const hasOut = links.some((l) => l.from === toId);
        if (!hasOut) {
          const armKey = normLabel(arm.toLabel);
          // Detour (Breakdown, Repair, …) → rejoin main next (Refill), not home.
          // Home would skip refill and dump again with empty logic error.
          if (mainNextId && armKey !== mainNextKey) {
            addLink(toId, mainNextId);
          } else {
            addLink(toId, home);
          }
        }
      }
    }
  }

  layoutNodes(nodes, links, spec.resources, homeQueue, activityId, counterId, stagingByResource);

  return {
    id: uniqueId(slug(spec.name) || "operation", new Set()),
    name: spec.name,
    description:
      spec.description ??
      "Per-resource CYCLONE cycles with task durations.",
    timeUnit: spec.timeUnit ?? "min",
    productionUnit: spec.counter?.unit ?? spec.productionUnit ?? "unit",
    defaultRuns: 1,
    defaultMaxTime: spec.maxTime ?? 480,
    defaultMaxCycles: spec.maxCycles ?? 100,
    nodes,
    links,
  };
}


/**
 * Inline chain notation (preferred):
 *   GEN 5          → GENERATE queue, k=5  (display "GEN 5")
 *   CON 5 Name     → CONSOLIDATE Name, n=5
 *   Name CON 5     → same
 * Mutates fn.gens / fn.cons so ensureActivity classifies nodes correctly.
 */
function expandInlineGenCon(
  itinerary: string[],
  fn: { gens: { label: string; k: number }[]; cons: { label: string; n: number }[] },
): { labels: string[] } {
  const labels: string[] = [];
  for (const raw of itinerary) {
    const s = raw.trim();
    // GEN 5 / GEN5
    let m = s.match(/^GEN\s*(\d+)\s*$/i);
    if (m) {
      const k = Math.max(2, Math.floor(Number(m[1])));
      const label = `GEN ${k}`;
      if (!fn.gens.some((g) => normLabel(g.label) === normLabel(label))) {
        fn.gens.push({ label, k });
      }
      labels.push(label);
      continue;
    }
    // CON 5 TruckFull / CON5 TruckFull
    m = s.match(/^CON\s*(\d+)\s+(.+)$/i);
    if (m) {
      const n = Math.max(2, Math.floor(Number(m[1])));
      const label = m[2]!.trim();
      if (!fn.cons.some((c) => normLabel(c.label) === normLabel(label))) {
        fn.cons.push({ label, n });
      }
      labels.push(label);
      continue;
    }
    // TruckFull CON 5
    m = s.match(/^(.+?)\s+CON\s*(\d+)\s*$/i);
    if (m) {
      const label = m[1]!.trim();
      const n = Math.max(2, Math.floor(Number(m[2])));
      if (!fn.cons.some((c) => normLabel(c.label) === normLabel(label))) {
        fn.cons.push({ label, n });
      }
      labels.push(label);
      continue;
    }
    // Name GEN 5 → treat as GEN queue named Name
    m = s.match(/^(.+?)\s+GEN\s*(\d+)\s*$/i);
    if (m) {
      const label = m[1]!.trim();
      const k = Math.max(2, Math.floor(Number(m[2])));
      if (!fn.gens.some((g) => normLabel(g.label) === normLabel(label))) {
        fn.gens.push({ label, k });
      }
      labels.push(label);
      continue;
    }
    labels.push(s);
  }
  return { labels };
}


/**
 * Multi-resource layout (general):
 * - one horizontal row per resource (home QUEUE + exclusive tasks)
 * - shared COMBI: common x, y averaged across meeting resources
 * - staging QUEUE ("R @ Task") sits on the row, mid-column before COMBI
 * - COUNTER sits just right of its predecessor (not floating far away)
 * - collision pass separates remaining overlaps
 */
function layoutNodes(
  nodes: CycloneNode[],
  links: { from: string; to: string }[],
  resources: ResourceCycle[],
  homeQueue: Map<string, string>,
  activityId: Map<string, string>,
  counterId: string,
  stagingByResource: Map<string, string[]> = new Map(),
): void {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const ROW = 170;
  const COL = 200;
  const LEFT = 70;
  const ACT0 = 260;
  const TOP = 80;

  const useCount = new Map<string, number>();
  const useRows = new Map<string, number[]>();
  resources.forEach((r, ri) => {
    for (const lab of r.itinerary) {
      const key = normLabel(lab);
      useCount.set(key, (useCount.get(key) ?? 0) + 1);
      const rows = useRows.get(key) ?? [];
      rows.push(ri);
      useRows.set(key, rows);
    }
  });

  resources.forEach((r, i) => {
    const q = byId.get(homeQueue.get(r.id)!)!;
    q.x = LEFT;
    q.y = TOP + i * ROW;
  });

  // Column index per activity key (max index across resources that use it)
  const colOf = new Map<string, number>();
  resources.forEach((r) => {
    r.itinerary.forEach((lab, j) => {
      const key = normLabel(lab);
      colOf.set(key, Math.max(colOf.get(key) ?? 0, j));
    });
  });

  const placed = new Set<string>();
  resources.forEach((r, ri) => {
    const rowY = TOP + ri * ROW;
    r.itinerary.forEach((lab, j) => {
      const key = normLabel(lab);
      const n = byId.get(activityId.get(key)!)!;
      const shared = (useCount.get(key) ?? 1) > 1;
      const x = ACT0 + j * COL;
      if (!placed.has(n.id)) {
        n.x = x;
        n.y = rowY;
        placed.add(n.id);
      } else if (shared) {
        const rows = useRows.get(key) ?? [ri];
        n.y = rows.reduce((s, idx) => s + (TOP + idx * ROW), 0) / rows.length;
        // Keep shared node at earliest column where it appears
        n.x = Math.min(n.x, x);
      }
    });
  });

  // Staging queues: on the resource row, halfway before the COMBI they feed
  resources.forEach((r, ri) => {
    const rowY = TOP + ri * ROW;
    const stags = stagingByResource.get(r.id) ?? [];
    for (const sid of stags) {
      const sn = byId.get(sid);
      if (!sn) continue;
      // Label form: "Trucks @ DumpToPaver"
      const m = sn.label.match(/@\s*(.+)$/);
      const taskKey = m ? normLabel(m[1]!) : null;
      const combi = taskKey ? byId.get(activityId.get(taskKey)!) : null;
      if (combi) {
        sn.x = combi.x - COL * 0.48;
        sn.y = rowY;
      } else {
        sn.x = ACT0 + COL * 0.5;
        sn.y = rowY;
      }
      placed.add(sn.id);
    }
  });

  // COUNTER: just to the right of its real predecessor(s)
  const ctr = byId.get(counterId)!;
  const preds = links
    .filter((l) => l.to === counterId)
    .map((l) => byId.get(l.from))
    .filter((n): n is CycloneNode => !!n);
  if (preds.length) {
    const maxX = Math.max(...preds.map((n) => n.x));
    const avgY = preds.reduce((s, n) => s + n.y, 0) / preds.length;
    ctr.x = maxX + COL * 0.9;
    ctr.y = avgY;
  } else {
    ctr.x = ACT0 + COL * 4;
    ctr.y = TOP;
  }

  // Exclusive post-shared tasks already placed on rows; give orphans a row below
  let orphan = 0;
  for (const n of nodes) {
    if (n.id === counterId) continue;
    if (!placed.has(n.id) && n.x === 0 && n.y === 0) {
      n.x = ACT0 + (orphan % 4) * COL;
      n.y = TOP + resources.length * ROW + Math.floor(orphan / 4) * ROW;
      orphan++;
    }
  }
  placed.add(ctr.id);

  resolveCollisions(nodes, 170, 125);
}

function resolveCollisions(nodes: CycloneNode[], minDx: number, minDy: number): void {
  for (let pass = 0; pass < 12; pass++) {
    let moved = false;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]!;
        const b = nodes[j]!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        if (Math.abs(dx) >= minDx || Math.abs(dy) >= minDy) continue;
        if (Math.abs(dy) <= Math.abs(dx)) {
          const push = (minDy - Math.abs(dy)) / 2 + 6;
          if (dy >= 0) {
            b.y += push;
            a.y -= push * 0.2;
          } else {
            b.y -= push;
            a.y += push * 0.2;
          }
        } else {
          const push = (minDx - Math.abs(dx)) / 2 + 6;
          if (dx >= 0) {
            b.x += push;
            a.x -= push * 0.15;
          } else {
            b.x -= push;
            a.x += push * 0.15;
          }
        }
        moved = true;
      }
    }
    if (!moved) break;
  }
  for (const n of nodes) {
    n.x = Math.max(20, Math.round(n.x));
    n.y = Math.max(20, Math.round(n.y));
  }
}

export function parseExplicitResourceCycles(text: string): {
  resources: ResourceCycle[];
  inlineDurations: Record<string, DurationDist>;
} | null {
  const cycles: ResourceCycle[] = [];
  const inlineDurations: Record<string, DurationDist> = {};
  const seen = new Set<string>();

  const bracket = [
    ...text.matchAll(/(\d+)\s*([A-Za-z][A-Za-z0-9 \-]{1,28}?)\s*\[\s*([^\]]+?)\s*\]/g),
  ];
  for (const m of bracket) {
    const count = Math.max(1, Math.floor(Number(m[1])));
    const label = titleCase(m[2]!.trim());
    const { labels, durations } = parseStepsWithInlineDurations(m[3]!.replace(/,/g, " → "));
    const itinerary = labels.length > 1 ? labels : splitSteps(m[3]!);
    Object.assign(inlineDurations, durations);
    if (!itinerary.length) continue;
    const id = slug(label);
    if (seen.has(id)) {
      mergeAlsoServes(cycles, id, itinerary);
      continue;
    }
    seen.add(id);
    cycles.push({ id, label, count, itinerary, alsoServes: [] });
  }

  const lines = text.split(/\n|;/).map((l) => l.trim()).filter(Boolean);
  /** Skip Cost / Priority / Sensitivity / Durations section bodies. */
  let section: "none" | "skip" | "cycle" = "none";
  for (const line of lines) {
    if (/^(durations?|durasi|cost\b|sensitivity|priority|functions?|branch(es)?)\s*:/i.test(line)) {
      section = "skip";
      // Single-line headers only — body lines are pure "Name: number" or durations
      continue;
    }
    // New resource cycle line re-enables parsing when it looks like a cycle
    const m = line.match(/^(?:(\d+)\s+)?([A-Za-z][A-Za-z0-9 \-]{1,28}?)\s*:\s*(.+)$/);
    if (!m) continue;
    if (/^(counter\s+after|count\s+at|production(\s+after)?|production\s+unit)\s*$/i.test(m[2]!.trim())) continue;
    if (/^production\s*$/i.test(m[2]!.trim())) continue;

    const rhs = m[3]!.trim();
    const label = titleCase(m[2]!.trim());

    // Pure numeric RHS → cost rate, priority rank, or count — never a cycle
    if (/^\d+(\.\d+)?\s*$/.test(rhs)) continue;
    // low..high sensitivity
    if (/^\d+\s*\.\.\s*\d+/.test(rhs)) continue;
    // Duration-only lines
    if (
      parseDurationToken(rhs) &&
      /const|tri|unif|normal|norm|logn|beta|gamma|uniform|triangular/i.test(rhs) &&
      !/→|->|=>|—|\|/.test(rhs)
    ) {
      continue;
    }
    if (/^(http|https|min|note|phase|cost|priority|sensitivity|duration|counter|count|production)/i.test(label)) continue;
    if (/^counter\s+after$|^count\s+at$|^production$/i.test(label)) continue;

    // Must look like a task sequence or multi-demand
    const looksLikeCycle =
      /→|->|=>|—/.test(rhs) ||
      /\|/.test(rhs) ||
      (/\[/.test(rhs) && /\]/.test(rhs));
    if (!looksLikeCycle) {
      // bare "Loader: Load" single task is OK for supporting resources
      if (!/^[A-Za-z][A-Za-z0-9 \/-]{0,30}$/.test(rhs)) continue;
    }

    section = "cycle";

    let itinerary: string[];
    if (/→|->|=>|—/.test(rhs) || /\(.*\d/.test(rhs)) {
      const parsed = parseStepsWithInlineDurations(rhs);
      itinerary = parsed.labels;
      Object.assign(inlineDurations, parsed.durations);
    } else {
      itinerary = splitSteps(rhs);
    }
    if (!itinerary.length) continue;

    // Pipe multi-demand: Crane: Lift Steel | Lift Forms | Lift Bucket
    let alsoServes: string[] = [];
    if (/\|/.test(rhs) && !/→|->|=>|—/.test(rhs)) {
      const parts = rhs.split("|").map((s) => s.trim()).filter(Boolean);
      if (parts.length > 1) {
        itinerary = [parts[0]!];
        alsoServes = parts.slice(1);
      }
    }

    const id = slug(label);
    if (seen.has(id)) {
      mergeAlsoServes(cycles, id, itinerary);
      for (const a of alsoServes) mergeAlsoServes(cycles, id, [a]);
      continue;
    }
    seen.add(id);
    const count = m[1] ? Math.max(1, Math.floor(Number(m[1]))) : guessCount(text, label);
    cycles.push({
      id,
      label,
      count,
      itinerary,
      alsoServes,
    });
  }

  return cycles.length ? { resources: cycles, inlineDurations } : null;
}

/** Merge additional first-task demands onto an existing resource (shared crane, etc.). */
function mergeAlsoServes(cycles: ResourceCycle[], id: string, itinerary: string[]) {
  const r = cycles.find((c) => c.id === id);
  if (!r || !itinerary.length) return;
  const first = itinerary[0]!;
  const primary = r.itinerary[0] ? normLabel(r.itinerary[0]) : "";
  if (normLabel(first) === primary) return;
  const bag = r.alsoServes ?? (r.alsoServes = []);
  if (!bag.some((x) => normLabel(x) === normLabel(first))) bag.push(first);
}

function splitSteps(s: string): string[] {
  return s
    .split(/\s*(?:→|->|=>|—|,|;|\|)\s*/)
    .map((x) => x.trim().replace(/\s*[\(\[].*$/, ""))
    .filter((x) => x.length > 0 && x.length < 40)
    .slice(0, 12);
}

function guessCount(text: string, label: string): number {
  const re = new RegExp(`(\\d+)\\s*${label.replace(/\s+/g, "\\s*")}\\b`, "i");
  const m = text.match(re);
  if (m?.[1]) return Math.max(1, Math.floor(Number(m[1])));
  const word = label.split(/\s+/)[0] ?? label;
  const re2 = new RegExp(`(\\d+)\\s*${word}s?\\b`, "i");
  const m2 = text.match(re2);
  return m2?.[1] ? Math.max(1, Math.floor(Number(m2[1]))) : 1;
}

const RESOURCE_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /(\d+)\s*mixer\s*trucks?\b/i, label: "Mixer trucks" },
  { re: /(\d+)\s*(dump\s*)?trucks?\b/i, label: "Trucks" },
  { re: /(\d+)\s*truk\b/i, label: "Trucks" },
  { re: /(\d+)\s*haulers?\b/i, label: "Haulers" },
  { re: /(\d+)\s*mixers?\b/i, label: "Mixers" },
  { re: /(\d+)\s*loaders?\b/i, label: "Loader" },
  { re: /(\d+)\s*excavators?\b/i, label: "Excavator" },
  { re: /(\d+)\s*cranes?\b/i, label: "Crane" },
  { re: /(\d+)\s*pumps?\b/i, label: "Pump" },
  { re: /(\d+)\s*pompa\b/i, label: "Pump" },
  { re: /(\d+)\s*crews?\b/i, label: "Crew" },
  { re: /(\d+)\s*(workers?|pekerja|tukang)\b/i, label: "Workers" },
  { re: /(\d+)\s*scaffolds?\b/i, label: "Scaffold" },
  { re: /(\d+)\s*dozers?\b/i, label: "Dozer" },
  { re: /(\d+)\s*rollers?\b/i, label: "Roller" },
  { re: /(\d+)\s*pavers?\b/i, label: "Paver" },
  { re: /(\d+)\s*barges?\b/i, label: "Barge" },
  { re: /(\d+)\s*forms?\b/i, label: "Formwork" },
];

function extractResources(text: string): { id: string; label: string; count: number }[] {
  const found: { id: string; label: string; count: number; index: number }[] = [];
  const consumed: [number, number][] = [];
  const overlaps = (start: number, end: number) =>
    consumed.some(([a, b]) => start < b && end > a);

  for (const { re, label } of RESOURCE_PATTERNS) {
    const global = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    let m: RegExpExecArray | null;
    while ((m = global.exec(text)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      if (overlaps(start, end)) continue;
      const id = slug(label);
      if (found.some((f) => f.id === id)) continue;
      consumed.push([start, end]);
      found.push({
        id,
        label,
        count: Math.max(1, Math.floor(Number(m[1]))),
        index: start,
      });
    }
  }

  if (!found.length) {
    const gen = text.matchAll(/(\d+)\s+([a-z][a-z-]{2,18})s?\b/gi);
    for (const m of gen) {
      const lab = titleCase(m[2] ?? "Unit");
      if (/^(min|minute|hour|sec|cycle|unit|m3|ton|step|load|haul|dump)$/i.test(lab)) continue;
      const id = slug(lab);
      if (found.some((f) => f.id === id)) continue;
      found.push({
        id,
        label: lab,
        count: Math.max(1, Math.floor(Number(m[1]))),
        index: m.index ?? 0,
      });
      if (found.length >= 5) break;
    }
  }

  if (!found.length) return [{ id: "units", label: "Units", count: 3 }];
  found.sort((a, b) => a.index - b.index);
  return found.map(({ id, label, count }) => ({ id, label, count }));
}

function extractStepLabels(text: string): string[] {
  const arrow = text.match(
    /([A-Za-z][A-Za-z0-9_/ -]{1,24})\s*(?:→|->|=>|—)\s*([A-Za-z0-9_/ →\->,-]{3,140})/,
  );
  if (arrow) {
    return parseStepsWithInlineDurations(`${arrow[1]} → ${arrow[2]}`).labels;
  }
  if (/earthmov|haul|loader|excav/i.test(text)) return ["Load", "Haul", "Dump", "Return"];
  if (/concrete|pour|mixer|pump|beton/i.test(text)) return ["Load", "Travel", "Pour", "Return"];
  if (/trench|pipe/i.test(text)) return ["Excavate", "Place", "Backfill"];
  if (/crane|lift|erect|steel/i.test(text)) return ["Hook", "Lift", "Place", "Return"];
  if (/pave|asphalt/i.test(text)) return ["Pave", "Compact", "Return"];
  if (/mason|brick|bata/i.test(text)) return ["Lay", "Tool", "Move"];
  return ["Work", "Return"];
}

export function buildOperationFromText(text: string): CycloneModel | null {
  const raw = stripPromptComments(text);
  if (!raw) return null;

  const explicit = parseExplicitResourceCycles(raw);
  let resources: ResourceCycle[];
  let durations: Record<string, DurationDist> = {
    ...parseDurationBlock(raw),
    ...(explicit?.inlineDurations ?? {}),
  };

  if (explicit?.resources.length) {
    resources = explicit.resources;
  } else {
    const resInfo = extractResources(raw);
    const steps = extractStepLabels(raw);
    const meet = steps[0] ?? "Work";
    resources = resInfo.map((r, i) => ({
      id: r.id,
      label: r.label,
      count: r.count,
      itinerary: i === 0 ? [...steps] : [meet],
    }));
  }

  for (const lab of resources.flatMap((r) => r.itinerary)) {
    const key = normLabel(lab);
    if (durations[key]) continue;
    const re = new RegExp(
      `${lab.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^\\n]{0,20}?((?:const|tri|unif|normal|norm|logn|beta|gamma|constant|uniform|triangular)\\s+[\\d.,\\s/-]+|\\d+(?:\\.\\d+)?(?:\\s*[,/-]\\s*\\d+(?:\\.\\d+)?){0,2})`,
      "i",
    );
    const m = raw.match(re);
    if (m?.[1]) {
      const d = parseDurationToken(m[1]);
      if (d) durations[key] = d;
    }
  }

  let productionUnit = "cycle";
  if (/m3|m³|cubic/i.test(raw)) productionUnit = "m3";
  else if (/ton/i.test(raw)) productionUnit = "ton";
  else if (/m2|m²/i.test(raw)) productionUnit = "m2";
  else if (/joint|pipe/i.test(raw)) productionUnit = "joint";
  else if (/lift|panel/i.test(raw)) productionUnit = "lift";

  const prodAmt = (() => {
    const m = raw.match(/(\d+(?:\.\d+)?)\s*(m3|m³|ton|m2|units?)\b/i);
    return m ? Number(m[1]) : 1;
  })();

  const allSteps = [...new Set(resources.flatMap((r) => r.itinerary))];
  const nameLine =
    raw
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l && /:/.test(l) && /→|->|=>/.test(l)) ?? allSteps.join(" · ");
  const name = nameLine.slice(0, 56) || "Custom operation";

  try {
    const functions = parseFunctionsAndBranch(raw);
    const counter = parseCounterPlacement(raw);
    if (!counter.amount || counter.amount === 1) {
      // keep prodAmt from legacy "12 m3" guess if counter parse had no amount
      if (prodAmt > 1) counter.amount = prodAmt;
    }
    if (counter.unit === "unit" && productionUnit !== "cycle" && productionUnit !== "unit") {
      counter.unit = productionUnit;
    }
    let model = buildFromSpec({
      name,
      description: raw.slice(0, 400),
      productionUnit: counter.unit || productionUnit,
      productionPerCycle: counter.amount,
      resources,
      durations,
      productionResourceId: resources[0]!.id,
      functions,
      counter,
    });
    const { costs, sensitivity } = parseCostAndSensitivity(raw);
    model = applyCostsToModel(model, costs);
    const pri = parsePriorityBlock(raw);
    model = applyPrioritiesToModel(model, pri);
    if (sensitivity.length) {
      model = { ...model, sensitivity };
    }
    return model;
  } catch {
    return null;
  }
}

export { normLabel };
