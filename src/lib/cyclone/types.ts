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
  /**
   * QUEUE: Halpin GENERATE (GEN k).
   * Each unit that *arrives* during the run is multiplied to k units in this QUEUE
   * (1 arrival → k available). Independent of CONSOLIDATE. Does not multiply initialUnits.
   */
  generateCount?: number;
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

export interface SensitivityRange {
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
  sensitivity?: SensitivityRange[];
}

export interface SimConfig {
  seed: number;
  maxTime: number;
  maxCycles: number;
  warmupTime?: number;
}

export interface ResourceCostStat {
  nodeId: string;
  label: string;
  count: number;
  costPerHourUsd: number;
  totalCostUsd: number;
}

export interface CostReport {
  currency: "USD";
  runHours: number;
  resources: ResourceCostStat[];
  totalCostUsd: number;
  unitCostUsd: number;
  production: number;
  productionUnit: string;
}

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
  cost?: CostReport;
}

export interface SensitivityRow {
  counts: Record<string, number>;
  label: string;
  unitsPerHour: number;
  unitCostUsd: number | null;
  totalCostUsd: number | null;
  runLength: number;
  cycles: number;
  utilizations: Record<string, number>;
}

export interface SensitivityPairResult {
  pairLabel: string;
  resourceA: string;
  resourceB: string;
  baseline: Record<string, number>;
  rows: SensitivityRow[];
  bestProductivityLabel: string | null;
  bestUnitCostLabel: string | null;
}

export interface SensitivityResult {
  rows: SensitivityRow[];
  bestProductivityLabel: string | null;
  bestUnitCostLabel: string | null;
  mode: "factorial" | "pairwise";
  pairs: SensitivityPairResult[];
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
      "Idle resource pool. Circle with lower-right slash (Halpin “Q”). Units wait until a following COMBI can start. Optional GEN k multiplies each arriving unit into k units (Halpin GENERATE; independent of CON).",
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
    description:
      "Function node (Halpin CON). Buffers arriving units until N are collected, then releases one unit downstream (time = 0). Independent of GEN — use only when the operation logic requires aggregating flow units (e.g. N bucket cycles → 1 truck departure).",
  },
};
