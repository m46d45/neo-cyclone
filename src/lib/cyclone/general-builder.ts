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
  parseCounterPlacements,
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
  /**
   * Full alternate paths for multi-demand (pipe with arrows):
   *   Helpers: ServeBrick → Lay | ServeMortar → GEN 2 → Lay → CON 2 Rejoin
   * alsoServes = first task of each path; alsoPaths = full paths (excluding primary).
   */
  alsoPaths?: string[][];
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
  /** Primary / first COUNTER (compat). Prefer `counters` for multi. */
  counter?: CounterPlacement;
  /** One or more COUNTER placements (multi-demand / multi-product). */
  counters?: CounterPlacement[];
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
    if (r.alsoPaths?.length) {
      r.alsoPaths = r.alsoPaths.map((path) => expandInlineGenCon(path, fn).labels);
      r.alsoServes = r.alsoPaths.map((p) => p[0]!).filter(Boolean);
    }
  }
  // Functions: GEN Name = k not appearing in any chain → prepend as named GEN step
  // (legacy). Prefer inline "GEN 5 → …" in the cycle.
  for (const g of fn.gens) {
    const gk = normLabel(g.label);
    const used = spec.resources.some(
      (r) =>
        r.itinerary.some((lab) => normLabel(lab) === gk) ||
        (r.alsoPaths ?? []).some((path) =>
          path.some((lab) => normLabel(lab) === gk),
        ),
    );
    if (used) continue;
    // Inline "GEN 5" tokens are already on a chain — never prepend to another resource
    if (/^gen\s*\d+$/i.test(gk) || /^gen\d+$/i.test(gk)) continue;
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
    for (const path of r.alsoPaths ?? []) {
      for (const lab of path) touch(lab, r.id);
    }
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
    for (const path of r.alsoPaths ?? []) {
      for (const lab of path) ensureActivity(lab);
    }
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

  // Normalize counter list (multi-counter support)
  const counterList: CounterPlacement[] =
    spec.counters && spec.counters.length
      ? spec.counters
      : [
          spec.counter ?? {
            afterLabel: null,
            amount: spec.productionPerCycle ?? 1,
            unit: "unit",
          },
        ];
  const counterAmtDefault = counterList[0]?.amount ?? spec.productionPerCycle ?? 1;

  /** afterKey → counter node id */
  const counterByAfter = new Map<string, string>();
  let primaryCounterId = "";

  for (let ci = 0; ci < counterList.length; ci++) {
    const cspec = counterList[ci]!;
    const amt = cspec.amount ?? counterAmtDefault;
    const afterLab = cspec.afterLabel;
    const id = uniqueId(
      ci === 0 ? "ctr" : `ctr_${slug(afterLab || String(ci))}`,
      used,
    );
    if (ci === 0) primaryCounterId = id;
    const label =
      counterList.length === 1
        ? "Production"
        : afterLab
          ? `Prod ${afterLab}`
          : `Production ${ci + 1}`;
    nodes.push({
      id,
      type: "COUNTER",
      label,
      x: 0,
      y: 0,
      productionAmount: amt,
    });
    if (afterLab) counterByAfter.set(normLabel(afterLab), id);
  }
  // Default single counter with null after → last task of production resource
  if (counterList.length === 1 && !counterList[0]!.afterLabel) {
    const lastLab = prodRes.itinerary[prodRes.itinerary.length - 1];
    if (lastLab) counterByAfter.set(normLabel(lastLab), primaryCounterId);
  }

  const counterId = primaryCounterId;

  const stagingByResource = new Map<string, string[]>();

  /**
   * Owner resource for a count-at task: prefers a cycle that continues after
   * the task (crew path), not pure multi-demand server (crane).
   */
  function countOwnerForTask(afterKey: string): string {
    const withTask = spec.resources.filter((r) =>
      r.itinerary.some((lab) => normLabel(lab) === afterKey),
    );
    if (!withTask.length) return prodRes.id;
    const continuing = withTask.find((r) => {
      const idx = r.itinerary.findIndex((lab) => normLabel(lab) === afterKey);
      return idx >= 0 && idx < r.itinerary.length - 1;
    });
    if (continuing) return continuing.id;
    const nonServer = withTask.find((r) => !(r.alsoServes && r.alsoServes.length));
    return (nonServer ?? withTask[0]!).id;
  }

  for (const r of spec.resources) {
    const home = homeQueue.get(r.id)!;
    const steps = r.itinerary.map((lab) => ({
      key: normLabel(lab),
      id: activityId.get(normLabel(lab))!,
      type: activityType.get(normLabel(lab))!,
      label: lab,
    }));

    const countAtsOnThis: { lab: string; key: string; ctrId: string }[] = [];
    for (const [afterKey, ctrId] of counterByAfter) {
      if (countOwnerForTask(afterKey) !== r.id) continue;
      const hit = r.itinerary.find((lab) => normLabel(lab) === afterKey);
      if (hit) countAtsOnThis.push({ lab: hit, key: afterKey, ctrId });
    }
    const countAtKeys = new Set(countAtsOnThis.map((c) => c.key));

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
      const isBranchArm = fn.branches.some(
        (br) =>
          normLabel(br.afterLabel) === a.key &&
          br.arms.some((arm) => normLabel(arm.toLabel) === b.key),
      );
      if (isBranchArm) continue;
      if (countAtKeys.has(a.key)) continue;

      if (b.type === "COMBI" && a.type !== "GEN") {
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
        addLink(a.id, b.id);
      }
    }
    stagingByResource.set(r.id, stags);

    const last = steps[steps.length - 1]!;
    const branchAfterLast = fn.branches.some(
      (br) => normLabel(br.afterLabel) === last.key,
    );

    for (const ca of countAtsOnThis) {
      const countAfterStep = steps.find((s) => s.key === ca.key);
      if (!countAfterStep) continue;
      const branchAfterCount = fn.branches.some(
        (br) => normLabel(br.afterLabel) === ca.key,
      );
      addLink(countAfterStep.id, ca.ctrId);
      const idx = steps.findIndex((s) => s.key === ca.key);
      if (idx >= 0 && idx < steps.length - 1 && !branchAfterCount) {
        addLink(ca.ctrId, steps[idx + 1]!.id);
      } else if (!branchAfterCount) {
        addLink(ca.ctrId, home);
      }
      if (idx < steps.length - 1 && last.id !== countAfterStep.id) {
        if (!branchAfterLast) addLink(last.id, home);
      }
    }
    if (!countAtsOnThis.length) {
      if (!branchAfterLast) addLink(last.id, home);
    }

    // Multi-demand alternate paths (full) or simple alsoServes (home↔COMBI only)
    if (r.alsoPaths && r.alsoPaths.length) {
      for (const path of r.alsoPaths) {
        if (!path.length) continue;
        const altSteps = path.map((lab) => ({
          key: normLabel(lab),
          id: activityId.get(normLabel(lab))!,
          type: activityType.get(normLabel(lab))!,
          label: lab,
        }));
        const firstAlt = altSteps[0]!;
        addLink(home, firstAlt.id);
        for (let i = 0; i < altSteps.length - 1; i++) {
          const a = altSteps[i]!;
          const b = altSteps[i + 1]!;
          if (countAtKeys.has(a.key)) continue;
          if (b.type === "COMBI" && a.type !== "GEN") {
            const stagId = uniqueId(`q_${r.id}_alt_${b.key}`, used);
            nodes.push({
              id: stagId,
              type: "QUEUE",
              label: `${r.label} @ ${b.label}`,
              x: 0,
              y: 0,
              initialUnits: 0,
            });
            addLink(a.id, stagId);
            addLink(stagId, b.id);
          } else {
            addLink(a.id, b.id);
          }
        }
        // Counters on this alternate path
        for (const ca of countAtsOnThis) {
          const step = altSteps.find((s) => s.key === ca.key);
          if (!step) continue;
          // already wired if primary also had same task — only link if missing
          addLink(step.id, ca.ctrId);
          const idx = altSteps.findIndex((s) => s.key === ca.key);
          if (idx >= 0 && idx < altSteps.length - 1) {
            addLink(ca.ctrId, altSteps[idx + 1]!.id);
          } else {
            addLink(ca.ctrId, home);
          }
        }
        const lastAlt = altSteps[altSteps.length - 1]!;
        const lastIsCount = countAtKeys.has(lastAlt.key);
        if (!lastIsCount) {
          // if last is CON or work, return home
          addLink(lastAlt.id, home);
        }
      }
    } else {
      for (const alt of r.alsoServes ?? []) {
        const aid = activityId.get(normLabel(alt));
        if (!aid) continue;
        addLink(home, aid);
        addLink(aid, home);
      }
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

  for (const br of fn.branches) {
    const afterKey = normLabel(br.afterLabel);
    const fromId = activityId.get(afterKey);
    if (!fromId) continue;

    // If Branch after a Counter after: task, fork FROM that COUNTER
    // so production is counted before Return vs Breakdown is sampled.
    const ctrForBranch = counterByAfter.get(afterKey);
    const afterIsCountAt = ctrForBranch != null;
    const forkFrom = afterIsCountAt ? ctrForBranch! : fromId;

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
    productionUnit:
      counterList[0]?.unit ?? spec.counter?.unit ?? spec.productionUnit ?? "unit",
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
 *   CON 5          → CONSOLIDATE "CON 5", n=5  (same style as GEN 5)
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
    // CON 2 / CON2  (same style as GEN 2 — no extra name)
    m = s.match(/^CON\s*(\d+)\s*$/i);
    if (m) {
      const n = Math.max(2, Math.floor(Number(m[1])));
      const label = `CON ${n}`;
      if (!fn.cons.some((c) => normLabel(c.label) === normLabel(label))) {
        fn.cons.push({ label, n });
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
 * Grid-first CYCLONE layout (Halpin-clean):
 *  1) Place WORK tasks on a center grid, ordered by cycle / graph layer
 *  2) Place home resource QUEUEs on a left rail, aligned to the tasks they serve
 *  3) Place staging QUEUEs just left of their task, on the resource’s row
 *  4) COUNTER at the end of the task band (right) or just below the last task
 * Links are drawn later by the canvas from these positions.
 */
function layoutNodes(
  nodes: CycloneNode[],
  links: { from: string; to: string }[],
  resources: ResourceCycle[],
  homeQueue: Map<string, string>,
  activityId: Map<string, string>,
  _counterId: string,
  stagingByResource: Map<string, string[]> = new Map(),
): void {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const COL = 168;
  const ROW = 132;
  const HOME_X = 56;
  const TASK0 = 230;
  const TOP = 64;
  const STAG_DX = 82;

  const isHome = (n: CycloneNode) =>
    n.type === "QUEUE" && (n.initialUnits ?? 0) > 0 && !/\s@\s/.test(n.label);
  const isStaging = (n: CycloneNode) =>
    n.type === "QUEUE" && /\s@\s/.test(n.label) && !(n.generateCount && n.generateCount >= 2);
  const isWork = (n: CycloneNode) =>
    n.type === "COMBI" ||
    n.type === "NORMAL" ||
    n.type === "CONSOLIDATE" ||
    n.type === "COUNTER" ||
    (n.type === "QUEUE" && (n.generateCount ?? 0) >= 2);

  // --- Resource ownership of work keys ---
  const useRows = new Map<string, number[]>();
  const colHint = new Map<string, number>();
  resources.forEach((r, ri) => {
    r.itinerary.forEach((lab, j) => {
      const key = normLabel(lab);
      const rows = useRows.get(key) ?? [];
      if (!rows.includes(ri)) rows.push(ri);
      useRows.set(key, rows);
      colHint.set(key, Math.max(colHint.get(key) ?? 0, j));
    });
    for (const lab of r.alsoServes ?? []) {
      const key = normLabel(lab);
      const rows = useRows.get(key) ?? [];
      if (!rows.includes(ri)) rows.push(ri);
      useRows.set(key, rows);
      if (!colHint.has(key)) colHint.set(key, 0);
    }
    for (const path of r.alsoPaths ?? []) {
      path.forEach((lab, j) => {
        const key = normLabel(lab);
        const rows = useRows.get(key) ?? [];
        if (!rows.includes(ri)) rows.push(ri);
        useRows.set(key, rows);
        colHint.set(key, Math.max(colHint.get(key) ?? 0, j));
      });
    }
  });

  // Map node id → activity key
  const keyOfNode = new Map<string, string>();
  for (const [k, id] of activityId) keyOfNode.set(id, k);
  for (const n of nodes) {
    if (keyOfNode.has(n.id)) continue;
    if (n.type === "CONSOLIDATE" || (n.generateCount ?? 0) >= 2) {
      keyOfNode.set(n.id, normLabel(n.label));
    }
  }

  // --- 1) Ordered task sequence (cycle order on a grid) ---
  // Spine = longest primary itinerary. Other sequences merge by predecessor.
  // Multi-demand alsoServes share column 0 (parallel first tasks), stacked by resource row.
  let spine: string[] = [];
  for (const r of resources) {
    if (r.itinerary.length > spine.length) spine = r.itinerary.map(normLabel);
  }
  const colOf = new Map<string, number>();
  const existsKey = (k: string) =>
    activityId.has(k) ||
    nodes.some((n) => normLabel(n.label) === k && isWork(n) && n.type !== "COUNTER");

  spine.forEach((k, i) => {
    if (existsKey(k)) colOf.set(k, i);
  });

  // Multi-demand first tasks → column 0 (parallel)
  for (const r of resources) {
    for (const lab of r.alsoServes ?? []) {
      const k = normLabel(lab);
      if (existsKey(k) && !colOf.has(k)) colOf.set(k, 0);
    }
  }

  // Merge other primary / alternate paths: place after max known predecessor in path
  for (const r of resources) {
    const paths = [r.itinerary.map(normLabel), ...(r.alsoPaths ?? []).map((p) => p.map(normLabel))];
    for (const path of paths) {
      let prevCol = -1;
      for (const k of path) {
        if (!existsKey(k)) continue;
        if (colOf.has(k)) {
          prevCol = Math.max(prevCol, colOf.get(k)!);
          continue;
        }
        colOf.set(k, prevCol + 1);
        prevCol = colOf.get(k)!;
      }
    }
  }

  // GEN / CON: column from graph neighbors or after related itinerary tokens
  for (const n of nodes) {
    if (!(n.type === "CONSOLIDATE" || (n.generateCount ?? 0) >= 2)) continue;
    const k = normLabel(n.label);
    if (colOf.has(k)) continue;
    const preds = links
      .filter((l) => l.to === n.id)
      .map((l) => byId.get(l.from))
      .filter(Boolean) as CycloneNode[];
    let pc = -1;
    for (const p of preds) {
      const pk = keyOfNode.get(p.id) ?? normLabel(p.label);
      if (colOf.has(pk)) pc = Math.max(pc, colOf.get(pk)!);
    }
    colOf.set(k, pc + 1);
  }

  const maxCol = Math.max(0, ...[...colOf.values()], 0);

  // --- 1b) Place WORK tasks on center grid ---
  const taskIds: string[] = [];
  for (const n of nodes) {
    if (!isWork(n) || n.type === "COUNTER") continue;
    taskIds.push(n.id);
    const key = keyOfNode.get(n.id) ?? normLabel(n.label);
    const col = colOf.get(key) ?? 0;
    const rows = useRows.get(key) ?? [];
    // Exclusive task → its resource row; shared COMBI → mean of meeting rows
    let slot: number;
    if (rows.length >= 2) {
      slot = rows.reduce((s, r) => s + r, 0) / rows.length;
    } else if (rows.length === 1) {
      slot = rows[0]!;
    } else {
      slot = Math.max(0, (resources.length - 1) / 2);
    }
    n.x = TASK0 + col * COL;
    n.y = TOP + slot * ROW;
  }

  // --- 2) Home resource QUEUEs (left rail) ---
  resources.forEach((r, ri) => {
    const hid = homeQueue.get(r.id);
    if (!hid) return;
    const q = byId.get(hid);
    if (!q) return;
    // Align Y to first task this resource serves
    const firstLabs = [
      ...r.itinerary,
      ...(r.alsoServes ?? []),
      ...((r.alsoPaths ?? []).flat() as string[]),
    ];
    let ty = TOP + ri * ROW;
    for (const lab of firstLabs) {
      const id = activityId.get(normLabel(lab));
      const tn = id ? byId.get(id) : undefined;
      if (tn) {
        ty = tn.y;
        break;
      }
    }
    q.x = HOME_X;
    q.y = ty;
  });

  // Spread homes if stacked on same y
  const homes = resources
    .map((r) => byId.get(homeQueue.get(r.id)!))
    .filter((n): n is CycloneNode => !!n);
  homes.sort((a, b) => a.y - b.y || a.x - b.x);
  for (let i = 1; i < homes.length; i++) {
    if (homes[i]!.y - homes[i - 1]!.y < ROW * 0.75) {
      homes[i]!.y = homes[i - 1]!.y + ROW * 0.85;
    }
  }

  // Realign WORK Y to home rows (grid columns already set)
  for (const n of nodes) {
    if (!isWork(n) || n.type === "COUNTER") continue;
    const key = keyOfNode.get(n.id) ?? normLabel(n.label);
    const rows = useRows.get(key) ?? [];
    if (!rows.length) continue;
    const ys = rows
      .map((ri) => {
        const hid = homeQueue.get(resources[ri]!.id);
        return hid ? byId.get(hid)?.y : undefined;
      })
      .filter((y): y is number => y != null);
    if (!ys.length) continue;
    n.y = ys.reduce((s, y) => s + y, 0) / ys.length;
  }

  // --- 3) Staging QUEUEs ---
  resources.forEach((r, ri) => {
    const hid = homeQueue.get(r.id);
    const homeY = hid ? byId.get(hid)?.y ?? TOP + ri * ROW : TOP + ri * ROW;
    for (const sid of stagingByResource.get(r.id) ?? []) {
      const sn = byId.get(sid);
      if (!sn) continue;
      const m = sn.label.match(/@\s*(.+)$/);
      const taskKey = m ? normLabel(m[1]!) : null;
      const combi = taskKey ? byId.get(activityId.get(taskKey)!) : null;
      sn.x = combi ? combi.x - STAG_DX : TASK0 - STAG_DX;
      sn.y = homeY;
    }
  });
  // leftover staging still at origin
  for (const n of nodes) {
    if (!isStaging(n)) continue;
    if (n.x !== 0 || n.y !== 0) continue;
    const outs = links
      .filter((l) => l.from === n.id)
      .map((l) => byId.get(l.to))
      .filter(Boolean) as CycloneNode[];
    const combi = outs.find((o) => o.type === "COMBI" || o.type === "NORMAL");
    if (!combi) continue;
    const pref = n.label.split("@")[0]?.trim() ?? "";
    const ri = resources.findIndex((r) => normLabel(r.label) === normLabel(pref));
    const homeY =
      ri >= 0 && homeQueue.get(resources[ri]!.id)
        ? byId.get(homeQueue.get(resources[ri]!.id)!)?.y ?? TOP + Math.max(0, ri) * ROW
        : combi.y;
    n.x = combi.x - STAG_DX;
    n.y = homeY;
  }

  // --- 4) COUNTER at end of flow (right of predecessor); multi-counter stack if needed ---
  const counters = nodes.filter((n) => n.type === "COUNTER");
  const workYs = nodes.filter((n) => isWork(n) && n.type !== "COUNTER").map((n) => n.y);
  const bandBottom = workYs.length ? Math.max(...workYs) : TOP;
  const bandMid = workYs.length ? workYs.reduce((s, y) => s + y, 0) / workYs.length : TOP;
  counters.forEach((n) => {
    const preds = links
      .filter((l) => l.to === n.id)
      .map((l) => byId.get(l.from))
      .filter((x): x is CycloneNode => !!x);
    if (preds.length) {
      n.x = Math.max(...preds.map((p) => p.x)) + COL * 0.9;
      n.y = preds.reduce((s, p) => s + p.y, 0) / preds.length;
    } else {
      n.x = TASK0 + (maxCol + 1) * COL;
      n.y = bandMid;
    }
  });
  // Separate overlapping counters vertically (bottom of band)
  counters.sort((a, b) => a.x - b.x || a.y - b.y);
  for (let i = 1; i < counters.length; i++) {
    const a = counters[i - 1]!;
    const b = counters[i]!;
    if (Math.abs(a.x - b.x) < COL * 0.5 && Math.abs(a.y - b.y) < ROW * 0.7) {
      b.y = Math.max(b.y, a.y + ROW * 0.7);
    }
  }

  // --- 5) Orphans (never positioned) ---
  for (const n of nodes) {
    if (n.x !== 0 || n.y !== 0) continue;
    const preds = links.filter((l) => l.to === n.id).map((l) => byId.get(l.from)).filter(Boolean) as CycloneNode[];
    const succs = links.filter((l) => l.from === n.id).map((l) => byId.get(l.to)).filter(Boolean) as CycloneNode[];
    const refs = [...preds, ...succs];
    if (refs.length) {
      n.x = refs.reduce((s, p) => s + p.x, 0) / refs.length;
      n.y = refs.reduce((s, p) => s + p.y, 0) / refs.length;
    } else {
      n.x = TASK0;
      n.y = bandBottom + ROW;
    }
  }

  // --- 6) Soft collision (prefer vertical; pin homes x; re-pin counters) ---
  resolveCollisions(nodes, 145, 100);
  for (const n of nodes) {
    if (isHome(n)) n.x = HOME_X;
  }
  // Counters must stay to the RIGHT of their predecessor (never drift left)
  for (const n of nodes) {
    if (n.type !== "COUNTER") continue;
    const preds = links
      .filter((l) => l.to === n.id)
      .map((l) => byId.get(l.from))
      .filter((x): x is CycloneNode => !!x);
    if (preds.length) {
      n.x = Math.max(n.x, Math.max(...preds.map((p) => p.x)) + COL * 0.85);
      n.y = preds.reduce((s, p) => s + p.y, 0) / preds.length;
    }
  }
  // Re-snap staging left of combi after collision
  resources.forEach((r) => {
    const hid = homeQueue.get(r.id);
    const homeY = hid ? byId.get(hid)?.y : undefined;
    for (const sid of stagingByResource.get(r.id) ?? []) {
      const sn = byId.get(sid);
      if (!sn) continue;
      const m = sn.label.match(/@\s*(.+)$/);
      const taskKey = m ? normLabel(m[1]!) : null;
      const combi = taskKey ? byId.get(activityId.get(taskKey)!) : null;
      if (combi) {
        sn.x = Math.min(sn.x, combi.x - STAG_DX);
        if (homeY != null) sn.y = homeY;
      }
    }
  });

  // Padding
  let minX = Infinity;
  let minY = Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
  }
  const ox = minX < 36 ? 36 - minX : 0;
  const oy = minY < 36 ? 36 - minY : 0;
  for (const n of nodes) {
    n.x = Math.round(n.x + ox);
    n.y = Math.round(n.y + oy);
  }
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
      !/→|-->|->|=>|—|\|/.test(rhs)
    ) {
      continue;
    }
    if (/^(http|https|min|note|phase|cost|priority|sensitivity|duration|counter|count|production|operation|model|title|op)$/i.test(label)) continue;
    if (/^counter\s+after$|^count\s+at$|^production$/i.test(label)) continue;

    // Must look like a task sequence or multi-demand
    const looksLikeCycle =
      /→|-->|->|=>|—/.test(rhs) ||
      /\|/.test(rhs) ||
      (/\[/.test(rhs) && /\]/.test(rhs));
    if (!looksLikeCycle) {
      // bare "Loader: Load" single task is OK for supporting resources
      if (!/^[A-Za-z][A-Za-z0-9 \/-]{0,30}$/.test(rhs)) continue;
    }

    section = "cycle";

    let itinerary: string[] = [];
    let alsoServes: string[] = [];
    let alsoPaths: string[][] = [];

    // Pipe multi-demand — with or without full alternate paths:
    //   Crane: LiftA | LiftB | LiftC
    //   Helpers: ServeBrick → Lay | ServeMortar → GEN 2 → Lay → CON 2 Rejoin
    if (/\|/.test(rhs)) {
      const parts = rhs.split("|").map((s) => s.trim()).filter(Boolean);
      if (parts.length > 1) {
        const paths: string[][] = [];
        for (const part of parts) {
          if (/→|-->|->|=>|—/.test(part) || /\(.*\d/.test(part)) {
            const parsed = parseStepsWithInlineDurations(part);
            Object.assign(inlineDurations, parsed.durations);
            paths.push(parsed.labels);
          } else {
            paths.push(splitSteps(part));
          }
        }
        itinerary = paths[0] ?? [];
        alsoPaths = paths.slice(1).filter((p) => p.length > 0);
        alsoServes = alsoPaths.map((p) => p[0]!).filter(Boolean);
      }
    }

    if (!itinerary.length) {
      if (/→|-->|->|=>|—/.test(rhs) || /\(.*\d/.test(rhs)) {
        const parsed = parseStepsWithInlineDurations(rhs);
        itinerary = parsed.labels;
        Object.assign(inlineDurations, parsed.durations);
      } else {
        itinerary = splitSteps(rhs);
      }
    }
    if (!itinerary.length) continue;

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
      alsoPaths: alsoPaths.length ? alsoPaths : undefined,
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
    .split(/\s*(?:→|-->|->|=>|—|,|;|\|)\s*/)
    .map((x) => x.trim().replace(/\s*[\(\[].*$/, ""))
    .filter((x) => x.length > 0 && x.length < 40)
    .slice(0, 12);
}

function guessCount(text: string, label: string): number {
  // Ignore Cost / Sensitivity / Priority / Durations bodies so "Crane: 280"
  // cannot become a resource count via newline-spanning regex.
  const cleaned = text
    .split(/\n/)
    .filter((line) => {
      const s = line.trim();
      if (/^(cost|sensitivity|priority|durations?)\s*:/i.test(s)) return false;
      if (/^[A-Za-z][A-Za-z0-9 _/-]{0,40}:\s*\d+(\.\d+)?\s*$/.test(s)) return false;
      if (/^[A-Za-z][A-Za-z0-9 _/-]{0,40}:\s*\d+\s*\.\.\s*\d+/.test(s)) return false;
      return true;
    })
    .join("\n");
  const esc = label.replace(/\s+/g, "[ \\t]+");
  // Same-line only: "5 trucks" / "1 CrewA Steel"
  const re = new RegExp(`(\\d+)[ \\t]+${esc}\\b`, "i");
  const m = cleaned.match(re);
  if (m?.[1]) return Math.max(1, Math.floor(Number(m[1])));
  const reN = new RegExp(`\\bn[ \\t]+${esc}[ \\t]*=[ \\t]*(\\d+)`, "i");
  const mN = cleaned.match(reN);
  if (mN?.[1]) return Math.max(1, Math.floor(Number(mN[1])));
  const word = label.split(/\s+/)[0] ?? label;
  if (word.length >= 3) {
    const re2 = new RegExp(`(\\d+)[ \\t]+${word}s?\\b`, "i");
    const m2 = cleaned.match(re2);
    if (m2?.[1]) return Math.max(1, Math.floor(Number(m2[1])));
  }
  return 1;
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
    /([A-Za-z][A-Za-z0-9_/ -]{1,24})\s*(?:→|-->|->|=>|—)\s*([A-Za-z0-9_/ →\->,-]{3,140})/,
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


/** Operation title for reports / Excel filename (not a resource cycle). */
export function parseOperationName(text: string): string | null {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    // Official syntax (preferred)
    const m = line.match(/^(?:operation|model|title|op)\s*:\s*(.+)$/i);
    if (m?.[1]) {
      const name = m[1].replace(/\s*[#/].*$/, "").trim();
      if (name && name.length <= 80) return name;
    }
  }
  // From teaching comments: "# Example 1 — Earthmoving fleet" or "# Earthmoving"
  for (const line of lines) {
    if (!line.startsWith("#")) continue;
    const body = line.replace(/^#+\s*/, "").trim();
    if (!body || /format prompt|network|duration|notes|====|----/i.test(body)) continue;
    const ex = body.match(/^example\s*\d+\s*[—\-–:]\s*(.+)$/i);
    if (ex?.[1]) {
      let name = ex[1].trim();
      // drop trailing parenthetical notes
      name = name.replace(/\s*\([^)]*\)\s*$/, "").trim();
      // take before first " · " or " - " long suffix like "(classic)"
      if (name.length > 2 && name.length <= 80) return name.slice(0, 56);
    }
  }
  return null;
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
  // Prefer Operation: / Model: / Title: (or # Example N — Name). Avoid resource-cycle lines as title.
  const fromPrompt = parseOperationName(text) ?? parseOperationName(raw);
  const nameLine =
    fromPrompt ??
    (raw
      .split("\n")
      .map((l) => l.trim())
      .find(
        (l) =>
          l &&
          /:/.test(l) &&
          /→|->|=>/.test(l) &&
          !/^(operation|model|title|op)\s*:/i.test(l),
      ) ??
      allSteps.join(" · "));
  const name = String(nameLine).slice(0, 56) || "Custom operation";

  try {
    const functions = parseFunctionsAndBranch(raw);
    const counters = parseCounterPlacements(raw);
    for (const counter of counters) {
      if (!counter.amount || counter.amount === 1) {
        if (prodAmt > 1) counter.amount = prodAmt;
      }
      if (counter.unit === "unit" && productionUnit !== "cycle" && productionUnit !== "unit") {
        counter.unit = productionUnit;
      }
    }
    const counter = counters[0]!;
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
      counters,
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
