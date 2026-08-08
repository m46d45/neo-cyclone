import { createRng, sampleDuration } from "./distributions";
import { buildCostReport } from "./cost";
import type {
  ActivityStat,
  BranchStat,
  CounterStat,
  CycloneModel,
  QueueStat,
  SimConfig,
  SimResult,
} from "./types";

type Entity = { id: number; arrivedAt: number };

interface RuntimeQueue {
  nodeId: string;
  label: string;
  units: Entity[];
  lengthIntegral: number;
  occupiedIntegral: number;
  maxLength: number;
  totalWait: number;
  departures: number;
  lastChange: number;
  initialUnits: number;
}

interface RuntimeActivity {
  nodeId: string;
  label: string;
  type: "COMBI" | "NORMAL";
  busyUntil: number;
  busyIntegral: number;
  concurrent: number;
  lastUtilChange: number;
  starts: number;
  totalDuration: number;
  lastStartTime: number;
  interArrivalSum: number;
}

interface RuntimeCounter {
  nodeId: string;
  label: string;
  amount: number;
  count: number;
  production: number;
  lastCountTime: number;
  firstPassageTime: number;
  cycleTimes: number[];
}

interface RuntimeConsolidate {
  nodeId: string;
  label: string;
  need: number;
  buffer: Entity[];
}

type OutArc = {
  id: string;
  to: string;
  probability?: number;
};

type EventKind = "END_ACTIVITY";

interface SimEvent {
  time: number;
  kind: EventKind;
  activityId: string;
  entities: Entity[];
  fromQueues: string[];
}

function isMinutes(unit: string): boolean {
  const u = unit.toLowerCase();
  return u === "min" || u === "mins" || u === "minute" || u === "minutes";
}

function toUnitsPerHour(production: number, simTime: number, timeUnit: string): number {
  if (simTime <= 0) return 0;
  if (isMinutes(timeUnit)) return production / (simTime / 60);
  if (timeUnit.toLowerCase().startsWith("h")) return production / simTime;
  return production / (simTime / 60);
}

/**
 * Discrete-event CYCLONE engine (Halpin-style).
 * MicroCYCLONE-style stats + optional USD cost + GEN / CON / probabilistic branch.
 */
export function runCyclone(model: CycloneModel, config: SimConfig): SimResult {
  const rng = createRng(config.seed);
  const nodeById = new Map(model.nodes.map((n) => [n.id, n]));
  const outArcs = new Map<string, OutArc[]>();
  const inLinks = new Map<string, string[]>();
  for (const n of model.nodes) {
    outArcs.set(n.id, []);
    inLinks.set(n.id, []);
  }
  for (const l of model.links) {
    outArcs.get(l.from)?.push({
      id: l.id,
      to: l.to,
      probability: l.probability,
    });
    inLinks.get(l.to)?.push(l.from);
  }

  const queues = new Map<string, RuntimeQueue>();
  const activities = new Map<string, RuntimeActivity>();
  const counters = new Map<string, RuntimeCounter>();
  const consolidates = new Map<string, RuntimeConsolidate>();
  const branchHits = new Map<string, number>();

  for (const n of model.nodes) {
    if (n.type === "QUEUE") {
      const units: Entity[] = [];
      const init = n.initialUnits ?? 0;
      for (let i = 0; i < init; i++) {
        units.push({ id: entitySeed(n.id, i), arrivedAt: 0 });
      }
      queues.set(n.id, {
        nodeId: n.id,
        label: n.label,
        units,
        lengthIntegral: 0,
        occupiedIntegral: 0,
        maxLength: init,
        totalWait: 0,
        departures: 0,
        lastChange: 0,
        initialUnits: init,
      });
    } else if (n.type === "COMBI" || n.type === "NORMAL") {
      activities.set(n.id, {
        nodeId: n.id,
        label: n.label,
        type: n.type,
        busyUntil: 0,
        busyIntegral: 0,
        concurrent: 0,
        lastUtilChange: 0,
        starts: 0,
        totalDuration: 0,
        lastStartTime: -1,
        interArrivalSum: 0,
      });
    } else if (n.type === "COUNTER") {
      counters.set(n.id, {
        nodeId: n.id,
        label: n.label,
        amount: n.productionAmount ?? 1,
        count: 0,
        production: 0,
        lastCountTime: 0,
        firstPassageTime: -1,
        cycleTimes: [],
      });
    } else if (n.type === "CONSOLIDATE") {
      consolidates.set(n.id, {
        nodeId: n.id,
        label: n.label,
        need: n.consolidateCount ?? 2,
        buffer: [],
      });
    }
  }

  let time = 0;
  let entitySeq = 1_000_000;
  let cycles = 0;
  const events: SimEvent[] = [];
  const timeline: { t: number; event: string }[] = [];
  const productivitySeries: {
    t: number;
    cycle: number;
    production: number;
    rate: number;
    unitsPerHour: number;
  }[] = [{ t: 0, cycle: 0, production: 0, rate: 0, unitsPerHour: 0 }];

  const primaryCounterId = model.nodes.find((n) => n.type === "COUNTER")?.id;

  function record(msg: string) {
    if (timeline.length < 200) timeline.push({ t: time, event: msg });
  }

  function touchQueue(q: RuntimeQueue) {
    const dt = time - q.lastChange;
    if (dt > 0) {
      q.lengthIntegral += q.units.length * dt;
      if (q.units.length > 0) q.occupiedIntegral += dt;
      q.lastChange = time;
    }
    if (q.units.length > q.maxLength) q.maxLength = q.units.length;
  }

  function touchActivity(a: RuntimeActivity) {
    const dt = time - a.lastUtilChange;
    if (dt > 0) {
      a.busyIntegral += a.concurrent * dt;
      a.lastUtilChange = time;
    }
  }

  function pushEvent(ev: SimEvent) {
    events.push(ev);
    events.sort((a, b) => a.time - b.time);
  }

  function noteBranch(arc: OutArc) {
    branchHits.set(arc.id, (branchHits.get(arc.id) ?? 0) + 1);
  }

  function resolveWeights(outs: OutArc[]): number[] {
    const specified = outs.map((o) =>
      o.probability != null && o.probability > 0 ? o.probability : null,
    );
    let sumSpec = 0;
    let missing = 0;
    for (const p of specified) {
      if (p != null) sumSpec += p;
      else missing += 1;
    }
    if (missing > 0) {
      const residual = Math.max(0, 1 - sumSpec);
      const each = residual / missing;
      return specified.map((p) => (p != null ? p : each));
    }
    if (sumSpec <= 0) return outs.map(() => 1 / outs.length);
    return specified.map((p) => p ?? 0);
  }

  /** Sample one target when any arc has probability; else first arc. */
  function pickTarget(fromId: string): string | null {
    const outs = outArcs.get(fromId) ?? [];
    if (!outs.length) return null;
    if (outs.length === 1) {
      noteBranch(outs[0]!);
      return outs[0]!.to;
    }

    const anyP = outs.some((o) => o.probability != null && o.probability > 0);
    if (!anyP) {
      noteBranch(outs[0]!);
      return outs[0]!.to;
    }

    const weights = resolveWeights(outs);
    let sum = 0;
    for (const w of weights) sum += w;
    if (sum <= 0) {
      noteBranch(outs[0]!);
      return outs[0]!.to;
    }

    let r = rng() * sum;
    for (let i = 0; i < outs.length; i++) {
      r -= weights[i]!;
      if (r <= 0) {
        const chosen = outs[i]!;
        noteBranch(chosen);
        const fromLab = nodeById.get(fromId)?.label ?? fromId;
        const toLab = nodeById.get(chosen.to)?.label ?? chosen.to;
        const pLabel =
          chosen.probability != null
            ? `p=${chosen.probability}`
            : `w=${weights[i]!.toFixed(2)}`;
        record(`BRANCH "${fromLab}" → "${toLab}" (${pLabel})`);
        return chosen.to;
      }
    }
    const last = outs[outs.length - 1]!;
    noteBranch(last);
    return last.to;
  }

  function routeDownstream(fromId: string, entity: Entity) {
    const target = pickTarget(fromId);
    if (target) enterNode(target, entity);
  }

  function enterNode(nodeId: string, entity: Entity) {
    const node = nodeById.get(nodeId);
    if (!node) return;
    if (node.type === "QUEUE") {
      const q = queues.get(nodeId)!;
      touchQueue(q);
      // Halpin GENERATE: each arrival becomes k units (GEN k). initialUnits are not multiplied.
      const gen = Math.max(1, Math.floor(node.generateCount ?? 1));
      entity.arrivedAt = time;
      q.units.push(entity);
      for (let i = 1; i < gen; i++) {
        q.units.push({ id: entitySeq++, arrivedAt: time });
      }
      if (gen > 1) {
        record(`QUEUE "${q.label}" GEN ${gen} (arrival → ${gen} units)`);
      }
      tryStartCombisFedBy(nodeId);
    } else if (node.type === "NORMAL") {
      startNormal(nodeId, entity);
    } else if (node.type === "COUNTER") {
      hitCounter(nodeId, entity);
    } else if (node.type === "CONSOLIDATE") {
      hitConsolidate(nodeId, entity);
    } else if (node.type === "COMBI") {
      const qFallback = [...queues.values()].find((q) =>
        (outArcs.get(q.nodeId) ?? []).some((a) => a.to === nodeId),
      );
      if (qFallback) {
        touchQueue(qFallback);
        entity.arrivedAt = time;
        qFallback.units.push(entity);
        tryStartCombisFedBy(qFallback.nodeId);
      }
    }
  }

  function noteActivityStart(a: RuntimeActivity) {
    if (a.lastStartTime >= 0) {
      a.interArrivalSum += time - a.lastStartTime;
    }
    a.lastStartTime = time;
  }

  function startNormal(activityId: string, entity: Entity) {
    const a = activities.get(activityId);
    const node = nodeById.get(activityId);
    if (!a || !node) return;
    touchActivity(a);
    const dur = sampleDuration(node.duration, rng);
    a.concurrent += 1;
    a.starts += 1;
    a.totalDuration += dur;
    noteActivityStart(a);
    record(`NORMAL "${a.label}" start (${dur.toFixed(2)})`);
    pushEvent({
      time: time + dur,
      kind: "END_ACTIVITY",
      activityId,
      entities: [entity],
      fromQueues: [],
    });
  }

  function tryStartCombisFedBy(queueId: string) {
    const outs = outArcs.get(queueId) ?? [];
    for (const arc of outs) {
      const node = nodeById.get(arc.to);
      if (node?.type === "COMBI") tryStartCombi(arc.to);
    }
  }

  /**
   * COMBI (classic CYCLONE): start as many concurrent instances as preceding
   * QUEUE resources allow.
   */
  function tryStartCombi(activityId: string) {
    const a = activities.get(activityId);
    const node = nodeById.get(activityId);
    if (!a || !node || a.type !== "COMBI") return;

    const predQueues = (inLinks.get(activityId) ?? []).filter((id) =>
      queues.has(id),
    );
    if (!predQueues.length) return;

    let guard = 0;
    while (guard++ < 10_000) {
      let canStart = true;
      for (const qid of predQueues) {
        if (queues.get(qid)!.units.length < 1) {
          canStart = false;
          break;
        }
      }
      if (!canStart) break;

      const entities: Entity[] = [];
      for (const qid of predQueues) {
        const q = queues.get(qid)!;
        touchQueue(q);
        const e = q.units.shift()!;
        q.totalWait += time - e.arrivedAt;
        q.departures += 1;
        entities.push(e);
      }

      touchActivity(a);
      const dur = sampleDuration(node.duration, rng);
      a.concurrent += 1;
      a.starts += 1;
      a.totalDuration += dur;
      a.busyUntil = Math.max(a.busyUntil, time + dur);
      noteActivityStart(a);
      record(`COMBI "${a.label}" start ×${a.concurrent} (${dur.toFixed(2)})`);
      pushEvent({
        time: time + dur,
        kind: "END_ACTIVITY",
        activityId,
        entities,
        fromQueues: predQueues,
      });
    }
  }

  function endActivity(ev: SimEvent) {
    const a = activities.get(ev.activityId);
    if (!a) return;
    touchActivity(a);
    if (a.type === "COMBI") {
      a.concurrent = Math.max(0, a.concurrent - 1);
      if (a.concurrent === 0) a.busyUntil = 0;
      const outs = outArcs.get(ev.activityId) ?? [];
      const anyP = outs.some((o) => o.probability != null);
      // Deterministic COMBI multi-out: entity i → arc i (resource fan-out)
      if (!anyP && outs.length >= ev.entities.length && ev.entities.length > 1) {
        for (let i = 0; i < ev.entities.length; i++) {
          const arc = outs[i] ?? outs[outs.length - 1]!;
          noteBranch(arc);
          enterNode(arc.to, ev.entities[i]!);
        }
      } else if (!anyP && outs.length > 0 && ev.entities.length === 1) {
        noteBranch(outs[0]!);
        enterNode(outs[0]!.to, ev.entities[0]!);
      } else {
        for (const ent of ev.entities) {
          routeDownstream(ev.activityId, ent);
        }
      }
      for (const qid of ev.fromQueues) tryStartCombisFedBy(qid);
      tryStartCombi(ev.activityId);
    } else {
      a.concurrent = Math.max(0, a.concurrent - 1);
      const entity = ev.entities[0];
      if (entity) routeDownstream(ev.activityId, entity);
    }
  }

  function hitCounter(counterId: string, entity: Entity) {
    const c = counters.get(counterId);
    if (!c) {
      routeDownstream(counterId, entity);
      return;
    }
    c.count += 1;
    cycles = Math.max(cycles, c.count);
    c.production += c.amount;
    if (c.firstPassageTime < 0) c.firstPassageTime = time;
    if (c.count > 1) {
      c.cycleTimes.push(time - c.lastCountTime);
    }
    c.lastCountTime = time;
    record(`COUNTER "${c.label}" = ${c.count} (${c.production} ${model.productionUnit})`);
    const rate = time > 0 ? c.production / time : 0;
    productivitySeries.push({
      t: Math.round(time * 100) / 100,
      cycle: c.count,
      production: Math.round(c.production * 1000) / 1000,
      rate: Math.round(rate * 1000) / 1000,
      unitsPerHour:
        Math.round(toUnitsPerHour(c.production, time, model.timeUnit) * 1000) / 1000,
    });
    routeDownstream(counterId, entity);
  }

  function hitConsolidate(nodeId: string, entity: Entity) {
    const c = consolidates.get(nodeId);
    if (!c) {
      routeDownstream(nodeId, entity);
      return;
    }
    c.buffer.push(entity);
    if (c.buffer.length >= c.need) {
      c.buffer.splice(0, c.need);
      const merged: Entity = { id: entitySeq++, arrivedAt: time };
      record(`CONSOLIDATE "${c.label}" released unit (need ${c.need})`);
      routeDownstream(nodeId, merged);
    }
  }

  for (const n of model.nodes) {
    if (n.type === "COMBI") tryStartCombi(n.id);
  }

  const maxTime = config.maxTime;
  const maxCycles = config.maxCycles;

  while (events.length > 0) {
    const ev = events.shift()!;
    if (ev.time > maxTime) break;
    time = ev.time;
    if (primaryCounterId) {
      const pc = counters.get(primaryCounterId);
      if (pc && pc.count >= maxCycles) break;
    } else if (cycles >= maxCycles) break;

    if (ev.kind === "END_ACTIVITY") endActivity(ev);

    if (primaryCounterId) {
      const pc = counters.get(primaryCounterId);
      if (pc && pc.count >= maxCycles) break;
    }
  }

  const simTime = time;
  for (const q of queues.values()) touchQueue(q);
  for (const a of activities.values()) touchActivity(a);

  const queueStats: QueueStat[] = [...queues.values()].map((q) => ({
    nodeId: q.nodeId,
    label: q.label,
    avgLength: simTime > 0 ? q.lengthIntegral / simTime : q.units.length,
    maxLength: q.maxLength,
    avgWaitTime: q.departures > 0 ? q.totalWait / q.departures : 0,
    totalWaitTime: q.totalWait,
    departures: q.departures,
    unitsAtEnd: q.units.length,
    percentOccupied: simTime > 0 ? q.occupiedIntegral / simTime : 0,
    initialUnits: q.initialUnits,
  }));

  const activityStats: ActivityStat[] = [...activities.values()].map((a) => {
    const util = simTime > 0 ? a.busyIntegral / simTime : 0;
    return {
      nodeId: a.nodeId,
      label: a.label,
      type: a.type,
      busyTime: a.busyIntegral,
      starts: a.starts,
      utilization: util,
      avgDuration: a.starts > 0 ? a.totalDuration / a.starts : 0,
      avgInterArrival:
        a.starts > 1
          ? a.interArrivalSum / (a.starts - 1)
          : simTime > 0 && a.starts === 1
            ? simTime
            : 0,
      avgUnitsAtTask: simTime > 0 ? a.busyIntegral / simTime : 0,
    };
  });

  const counterStats: CounterStat[] = [...counters.values()].map((c) => {
    const avgCycle =
      c.cycleTimes.length > 0
        ? c.cycleTimes.reduce((s, x) => s + x, 0) / c.cycleTimes.length
        : simTime > 0 && c.count > 0
          ? simTime / c.count
          : 0;
    return {
      nodeId: c.nodeId,
      label: c.label,
      count: c.count,
      production: c.production,
      productivity: simTime > 0 ? c.production / simTime : 0,
      unitsPerHour: toUnitsPerHour(c.production, simTime, model.timeUnit),
      avgCycleTime: avgCycle,
      firstPassageTime: c.firstPassageTime >= 0 ? c.firstPassageTime : 0,
      avgTimeBetweenUnits: avgCycle,
      unitsPerCycle: c.amount,
    };
  });

  const fromTotals = new Map<string, number>();
  for (const l of model.links) {
    const hits = branchHits.get(l.id) ?? 0;
    fromTotals.set(l.from, (fromTotals.get(l.from) ?? 0) + hits);
  }

  const branchStats: BranchStat[] = model.links
    .map((l) => {
      const hits = branchHits.get(l.id) ?? 0;
      const total = fromTotals.get(l.from) ?? 0;
      const outs = outArcs.get(l.from) ?? [];
      const isBranchNode =
        outs.length > 1 && outs.some((o) => o.probability != null);
      if (!isBranchNode) return null;
      return {
        linkId: l.id,
        fromId: l.from,
        toId: l.to,
        fromLabel: nodeById.get(l.from)?.label ?? l.from,
        toLabel: nodeById.get(l.to)?.label ?? l.to,
        probability: l.probability ?? null,
        timesTaken: hits,
        empiricalShare: total > 0 ? hits / total : 0,
      };
    })
    .filter(Boolean) as BranchStat[];

  const primaryProd = primaryCounterId
    ? (counters.get(primaryCounterId)?.production ?? 0)
    : [...counters.values()][0]?.production ?? 0;
  const cost = buildCostReport(model, simTime, primaryProd);

  return {
    modelId: model.id,
    modelName: model.name,
    seed: config.seed,
    simTime,
    cyclesCompleted: primaryCounterId
      ? (counters.get(primaryCounterId)?.count ?? 0)
      : cycles,
    maxCyclesRequested: maxCycles,
    queueStats,
    activityStats,
    counterStats,
    branchStats,
    timeline,
    productivitySeries,
    cost,
  };
}

function entitySeed(nodeId: string, i: number): number {
  let h = 0;
  for (let k = 0; k < nodeId.length; k++) h = (h * 31 + nodeId.charCodeAt(k)) | 0;
  return -((Math.abs(h) + i + 1) % 1_000_000);
}
