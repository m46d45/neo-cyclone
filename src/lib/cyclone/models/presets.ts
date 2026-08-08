import type { CycloneModel } from "../types";

/**
 * Classic earthmoving fleet (Halpin-style CYCLONE).
 * Trucks + loader: Load (COMBI) → Haul → Dump → Return → Truck idle.
 * Loader returns to idle after Load.
 * Predecessor order on COMBI: trucks then loader → multi-out maps entity[0]→haul, entity[1]→loader.
 */
export const earthmovingModel: CycloneModel = {
  id: "earthmoving",
  name: "Earthmoving Fleet",
  description:
    "Classic CYCLONE earthmoving: loader fills trucks, trucks haul, dump, and return. Tune fleet size and durations to study productivity and waiting.",
  timeUnit: "min",
  productionUnit: "m³",
  defaultRuns: 1,
  defaultMaxTime: 480,
  defaultMaxCycles: 500,
  nodes: [
    {
      id: "q-trucks",
      type: "QUEUE",
      label: "Trucks Idle",
      x: 80,
      y: 200,
      initialUnits: 5,
      costPerHourUsd: 85,
    },
    {
      id: "q-loader",
      type: "QUEUE",
      label: "Loader Idle",
      x: 80,
      y: 80,
      initialUnits: 1,
      costPerHourUsd: 120,
    },
    {
      id: "c-load",
      type: "COMBI",
      label: "Load",
      x: 260,
      y: 140,
      duration: { kind: "triangular", min: 1.5, mode: 2.0, max: 3.0 },
    },
    {
      id: "n-haul",
      type: "NORMAL",
      label: "Haul",
      x: 440,
      y: 200,
      duration: { kind: "triangular", min: 6, mode: 8, max: 12 },
    },
    {
      id: "n-dump",
      type: "NORMAL",
      label: "Dump",
      x: 620,
      y: 200,
      duration: { kind: "constant", value: 1.2 },
    },
    {
      id: "n-return",
      type: "NORMAL",
      label: "Return",
      x: 440,
      y: 320,
      duration: { kind: "triangular", min: 5, mode: 7, max: 10 },
    },
    {
      id: "ctr",
      type: "COUNTER",
      label: "Loads Done",
      x: 620,
      y: 80,
      productionAmount: 12,
    },
  ],
  links: [
    { id: "l1", from: "q-trucks", to: "c-load" },
    { id: "l2", from: "q-loader", to: "c-load" },
    { id: "l3", from: "c-load", to: "n-haul" },
    { id: "l4", from: "c-load", to: "q-loader" },
    { id: "l5", from: "n-haul", to: "n-dump" },
    { id: "l6", from: "n-dump", to: "ctr" },
    { id: "l7", from: "ctr", to: "n-return" },
    { id: "l8", from: "n-return", to: "q-trucks" },
  ],
  sensitivity: [
    { resourceLabel: "Trucks", low: 2, high: 8, step: 1 },
    { resourceLabel: "Loader", low: 1, high: 2, step: 1 },
  ],
};

/** Concrete pouring with batch plant, mixer trucks, and crane. */
export const concretePourModel: CycloneModel = {
  id: "concrete-pour",
  name: "Concrete Pour",
  description:
    "Batch plant → transit mixer → crane bucket pour. Studies plant vs. truck vs. crane balance.",
  timeUnit: "min",
  productionUnit: "m³",
  defaultRuns: 1,
  defaultMaxTime: 360,
  defaultMaxCycles: 200,
  nodes: [
    {
      id: "q-plant",
      type: "QUEUE",
      label: "Plant Idle",
      x: 60,
      y: 100,
      initialUnits: 1,
    },
    {
      id: "q-trucks",
      type: "QUEUE",
      label: "Trucks Idle",
      x: 60,
      y: 240,
      initialUnits: 3,
    },
    {
      id: "q-crane",
      type: "QUEUE",
      label: "Crane Idle",
      x: 520,
      y: 100,
      initialUnits: 1,
    },
    {
      id: "c-batch",
      type: "COMBI",
      label: "Batch",
      x: 220,
      y: 170,
      duration: { kind: "triangular", min: 2, mode: 3, max: 4 },
    },
    {
      id: "n-haul",
      type: "NORMAL",
      label: "Haul to Site",
      x: 380,
      y: 240,
      duration: { kind: "triangular", min: 8, mode: 12, max: 18 },
    },
    {
      id: "c-pour",
      type: "COMBI",
      label: "Pour",
      x: 540,
      y: 170,
      duration: { kind: "triangular", min: 4, mode: 6, max: 9 },
    },
    {
      id: "n-return",
      type: "NORMAL",
      label: "Return",
      x: 380,
      y: 340,
      duration: { kind: "triangular", min: 7, mode: 10, max: 14 },
    },
    {
      id: "ctr",
      type: "COUNTER",
      label: "Pours",
      x: 700,
      y: 100,
      productionAmount: 6,
    },
  ],
  links: [
    { id: "a1", from: "q-trucks", to: "c-batch" },
    { id: "a2", from: "q-plant", to: "c-batch" },
    { id: "a3", from: "c-batch", to: "n-haul" },
    { id: "a4", from: "c-batch", to: "q-plant" },
    { id: "a5", from: "n-haul", to: "c-pour" },
    { id: "a6", from: "q-crane", to: "c-pour" },
    { id: "a7", from: "c-pour", to: "ctr" },
    { id: "a8", from: "c-pour", to: "q-crane" },
    { id: "a9", from: "ctr", to: "n-return" },
    { id: "a10", from: "n-return", to: "q-trucks" },
  ],
};

/** Single-loader trench excavation with spoil haul. */
export const trenchExcavationModel: CycloneModel = {
  id: "trench-excavation",
  name: "Trench Excavation",
  description:
    "Excavator digs trench segments; trucks haul spoil. Simple two-resource cycle for teaching ACD basics.",
  timeUnit: "min",
  productionUnit: "m",
  defaultRuns: 1,
  defaultMaxTime: 420,
  defaultMaxCycles: 300,
  nodes: [
    {
      id: "q-ex",
      type: "QUEUE",
      label: "Excavator Idle",
      x: 100,
      y: 120,
      initialUnits: 1,
    },
    {
      id: "q-trucks",
      type: "QUEUE",
      label: "Trucks Ready",
      x: 100,
      y: 260,
      initialUnits: 4,
    },
    {
      id: "c-dig",
      type: "COMBI",
      label: "Dig & Load",
      x: 280,
      y: 190,
      duration: { kind: "triangular", min: 3, mode: 4.5, max: 6 },
    },
    {
      id: "n-haul",
      type: "NORMAL",
      label: "Haul Spoil",
      x: 480,
      y: 260,
      duration: { kind: "triangular", min: 8, mode: 10, max: 14 },
    },
    {
      id: "n-dump",
      type: "NORMAL",
      label: "Dump Spoil",
      x: 660,
      y: 260,
      duration: { kind: "constant", value: 1.5 },
    },
    {
      id: "n-return",
      type: "NORMAL",
      label: "Return",
      x: 480,
      y: 360,
      duration: { kind: "triangular", min: 7, mode: 9, max: 12 },
    },
    {
      id: "ctr",
      type: "COUNTER",
      label: "Segments",
      x: 480,
      y: 80,
      productionAmount: 2.5,
    },
  ],
  links: [
    { id: "t1", from: "q-trucks", to: "c-dig" },
    { id: "t2", from: "q-ex", to: "c-dig" },
    { id: "t3", from: "c-dig", to: "n-haul" },
    { id: "t4", from: "c-dig", to: "q-ex" },
    { id: "t5", from: "n-haul", to: "n-dump" },
    { id: "t6", from: "n-dump", to: "ctr" },
    { id: "t7", from: "ctr", to: "n-return" },
    { id: "t8", from: "n-return", to: "q-trucks" },
  ],
};

export const PRESET_MODELS: CycloneModel[] = [
  earthmovingModel,
  concretePourModel,
  trenchExcavationModel,
];

export function getPreset(id: string): CycloneModel | undefined {
  return PRESET_MODELS.find((m) => m.id === id);
}

export function cloneModel(model: CycloneModel): CycloneModel {
  return structuredClone(model);
}
