export type NodeType =
  | "QUEUE"
  | "COMBI"
  | "NORMAL"
  | "COUNTER"
  | "CONSOLIDATE";

export type DistType =
  | "CONSTANT"
  | "UNIFORM"
  | "TRIANGULAR"
  | "NORMAL"
  | "LOGNORMAL"
  | "BETA"
  | "GAMMA";

export interface DurationSpec {
  type: DistType;
  /** Parameters depend on distribution (e.g. CONSTANT: [value]). */
  params: number[];
}

export interface CycloneNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  /** QUEUE: starting resource units in the home pool. */
  initialUnits?: number;
  /** COMBI / NORMAL duration. */
  duration?: DurationSpec;
  /** COUNTER: production amount per passage. */
  productionAmount?: number;
  /** CONSOLIDATE: units needed before release. */
  consolidateCount?: number;
  /** QUEUE: owning resource hourly cost (USD/h) for cost report. */
  costPerHourUsd?: number;
}

export interface CycloneLink {
  id: string;
  from: string;
  to: string;
}

/** Sensitivity range for one resource (home QUEUE), Halpin-style. */
export interface SensitivityRange {
  /** Match resource / queue label (case-insensitive). */
  resourceLabel: string;
  low: number;
  high: number;
  step?: number;
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
  /** Optional sensitivity plan from the prompt. */
  sensitivity?: SensitivityRange[];
}

export interface SimConfig {
  seed: number;
  maxTime: number;
  maxCycles: number;
  warmupTime?: number;
}

/** Per-resource cost line (Process / cost report). */
export interface ResourceCostStat {
  nodeId: string;
  label: string;
  count: number;
  costPerHourUsd: number;
  /** costPerHourUsd × count × runHours */
  totalCostUsd: number;
}

export interface CostReport {
  currency: "USD";
  runHours: number;
  resources: ResourceCostStat[];
  totalCostUsd: number;
  /** Total cost / total production (USD per production unit). */
  unitCostUsd: number;
  production: number;
  productionUnit: string;
}

/** MicroCYCLONE-style QUEUE node statistics (Report by Element). */
export interface QueueStat {
  nodeId: string;
  label: string;
  avgLength: number;
  maxLength: number;
  avgWaitTime: number;
  totalWaitTime: number;
  departures: number;
  unitsAtEnd: number;
  percentOccupied: number;
  initialUnits: number;
}

export interface ActivityStat {
  nodeId: string;
  label: string;
  type: "COMBI" | "NORMAL";
  busyTime: number;
  starts: number;
  utilization: number;
  avgDuration: number;
  avgInterArrival: number;
  avgUnitsAtTask: number;
}

export interface CounterStat {
  nodeId: string;
  label: string;
  count: number;
  production: number;
  productivity: number;
  unitsPerHour: number;
  avgCycleTime: number;
  firstPassageTime: number;
  avgTimeBetweenUnits: number;
  unitsPerCycle: number;
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
  productivitySeries: {
    t: number;
    cycle: number;
    production: number;
    rate: number;
    unitsPerHour: number;
  }[];
  /** Present when any home QUEUE carries costPerHourUsd. */
  cost?: CostReport;
}

/** One cell of a Halpin-style sensitivity batch. */
export interface SensitivityRow {
  /** Resource counts keyed by queue node id */
  counts: Record<string, number>;
  /** Short label e.g. "Trucks=4, Loader=1" */
  label: string;
  unitsPerHour: number;
  unitCostUsd: number | null;
  totalCostUsd: number | null;
  runLength: number;
  cycles: number;
  /** Key activity utilizations (label → 0–1) */
  utilizations: Record<string, number>;
}

/** One resource-pair slice (pairwise sensitivity when ≥3 resources). */
export interface SensitivityPairResult {
  /** e.g. "Trucks × Loader" */
  pairLabel: string;
  resourceA: string;
  resourceB: string;
  /** Fixed counts for resources not in this pair (label → units). */
  baseline: Record<string, number>;
  rows: SensitivityRow[];
  bestProductivityLabel: string | null;
  bestUnitCostLabel: string | null;
}

export interface SensitivityResult {
  /**
   * Rows for the default view (full factorial if ≤2 resources,
   * or the first pair if pairwise). Prefer `pairs` when mode is pairwise.
   */
  rows: SensitivityRow[];
  bestProductivityLabel: string | null;
  bestUnitCostLabel: string | null;
  /** factorial = 1–2 resources varied together; pairwise = C(n,2) pairs. */
  mode: "factorial" | "pairwise";
  pairs: SensitivityPairResult[];
  /** e.g. when more than 5 resources were listed in the prompt. */
  note?: string;
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
    shape: "square-notch",
    description:
      "Constrained work task. Requires one unit from each preceding QUEUE; may run multiple concurrent instances.",
  },
  NORMAL: {
    label: "NORMAL",
    shape: "square",
    description: "Unconstrained work task. Starts when a unit arrives from upstream.",
  },
  COUNTER: {
    label: "COUNTER",
    shape: "flag",
    description: "Production counter (golf-flag notation). Records cycles and output.",
  },
  CONSOLIDATE: {
    label: "CONSOLIDATE",
    shape: "triangle",
    description: "Gathers several units before releasing one downstream.",
  },
};
