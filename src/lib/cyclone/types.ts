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

/** MicroCYCLONE-style QUEUE node statistics (Report by Element). */
export interface QueueStat {
  nodeId: string;
  label: string;
  /** Average number of units at the queue over simulation time */
  avgLength: number;
  maxLength: number;
  /** Average waiting time per departing unit */
  avgWaitTime: number;
  totalWaitTime: number;
  departures: number;
  /** Units still in queue at end of run */
  unitsAtEnd: number;
  /** Fraction of time the queue was non-empty (0–1) */
  percentOccupied: number;
  initialUnits: number;
}

/** MicroCYCLONE-style COMBI/NORMAL statistics (Report by Element). */
export interface ActivityStat {
  nodeId: string;
  label: string;
  type: "COMBI" | "NORMAL";
  busyTime: number;
  /** Number of times the work task was activated */
  starts: number;
  /** Percentage of time the work task was in operation (0–1) */
  utilization: number;
  /** Mean duration of the work task */
  avgDuration: number;
  /** Average time between arrivals / activations */
  avgInterArrival: number;
  /** Average number of units positioned at the work task */
  avgUnitsAtTask: number;
}

/** COUNTER / production statistics. */
export interface CounterStat {
  nodeId: string;
  label: string;
  count: number;
  production: number;
  /** Production per simulation time unit (e.g. units/min) */
  productivity: number;
  /** Production per hour (Halpin Process Report style when time is minutes) */
  unitsPerHour: number;
  avgCycleTime: number;
  /** Simulation time of first unit through the counter */
  firstPassageTime: number;
  /** Average time between successive units through the counter */
  avgTimeBetweenUnits: number;
  unitsPerCycle: number;
}

export interface SimResult {
  modelId: string;
  modelName: string;
  seed: number;
  /** Run length (simulation clock at stop) */
  simTime: number;
  cyclesCompleted: number;
  maxCyclesRequested: number;
  queueStats: QueueStat[];
  activityStats: ActivityStat[];
  counterStats: CounterStat[];
  timeline: { t: number; event: string }[];
  /**
   * Production by Cycle (MicroCYCLONE):
   * cycle number, sim time at completion, cumulative production & productivity.
   */
  productivitySeries: {
    t: number;
    cycle: number;
    production: number;
    /** Cumulative productivity in units per simulation time unit */
    rate: number;
    /** Cumulative productivity in units per hour (if time unit is minutes) */
    unitsPerHour: number;
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
