/** CYCLONE modeling elements (Halpin) */

export type NodeType =
  | "QUEUE"
  | "COMBI"
  | "NORMAL"
  | "COUNTER"
  | "CONSOLIDATE";

/**
 * Activity duration distributions (common in construction DES / CYCLONE).
 * All sampled times are clamped to be ≥ 0. Default time unit: **minutes**.
 */
export type DurationDist =
  | { kind: "constant"; value: number }
  | { kind: "uniform"; min: number; max: number }
  | { kind: "triangular"; min: number; mode: number; max: number }
  | { kind: "normal"; mean: number; sd: number }
  | { kind: "lognormal"; mean: number; sd: number }
  | { kind: "beta"; min: number; max: number; alpha: number; beta: number }
  | { kind: "gamma"; shape: number; scale: number };

export interface CycloneNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  initialUnits?: number;
  duration?: DurationDist;
  productionAmount?: number;
  consolidateCount?: number;
}

export interface CycloneLink {
  id: string;
  from: string;
  to: string;
}

export interface CycloneModel {
  id: string;
  name: string;
  description: string;
  timeUnit: string;
  productionUnit: string;
  nodes: CycloneNode[];
  links: CycloneLink[];
  defaultRuns: number;
  defaultMaxTime: number;
  defaultMaxCycles: number;
}

export interface SimConfig {
  seed: number;
  maxTime: number;
  maxCycles: number;
  warmupTime?: number;
}

export interface QueueStat {
  nodeId: string;
  label: string;
  avgLength: number;
  maxLength: number;
  totalWaitTime: number;
  departures: number;
}

export interface ActivityStat {
  nodeId: string;
  label: string;
  type: "COMBI" | "NORMAL";
  busyTime: number;
  starts: number;
  utilization: number;
  avgDuration: number;
}

export interface CounterStat {
  nodeId: string;
  label: string;
  count: number;
  production: number;
  productivity: number;
  avgCycleTime: number;
}

export interface SimResult {
  modelId: string;
  modelName: string;
  seed: number;
  simTime: number;
  cyclesCompleted: number;
  maxCyclesRequested: number;
  queueStats: QueueStat[];
  activityStats: ActivityStat[];
  counterStats: CounterStat[];
  timeline: { t: number; event: string }[];
  /** One point per completed production cycle */
  productivitySeries: {
    t: number;
    cycle: number;
    production: number;
    rate: number;
  }[];
}

export const NODE_META: Record<
  NodeType,
  { label: string; shape: string; description: string }
> = {
  QUEUE: {
    label: "QUEUE",
    shape: "Q-circle",
    description:
      "Idle resource pool. Circle with lower-right slash (Halpin “Q”). Units wait until a following COMBI can start.",
  },
  COMBI: {
    label: "COMBI",
    shape: "cut-square",
    description:
      "Constrained activity. Square with top-left corner cut. Starts only when every preceding QUEUE has a unit.",
  },
  NORMAL: {
    label: "NORMAL",
    shape: "rectangle",
    description:
      "Unconstrained activity. Plain rectangle (no corner cut). Processes units as they arrive.",
  },
  COUNTER: {
    label: "COUNTER",
    shape: "golf-flag",
    description:
      "Production tally. Drawn as a golf flag: vertical pole + triangular pennant. Counts each pass and drives productivity stats.",
  },
  CONSOLIDATE: {
    label: "CONSOLIDATE",
    shape: "barred-circle",
    description:
      "Function node: circle with a horizontal bar. Merges N arriving units into one outgoing unit.",
  },
};
