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


/** Inspect & Rework — Halpin probabilistic branch. */
export const inspectReworkModel: CycloneModel = {
  id: "inspect-rework",
  name: "Inspect and Rework",
  description:
    "Probabilistic branch after inspection: 90% pass, 10% rework then re-inspect.",
  timeUnit: "min",
  productionUnit: "unit",
  defaultRuns: 1,
  defaultMaxTime: 480,
  defaultMaxCycles: 200,
  nodes: [
    { id: "q-crew", type: "QUEUE", label: "Crew Idle", x: 80, y: 180, initialUnits: 1, costPerHourUsd: 70 },
    { id: "c-inspect", type: "COMBI", label: "Inspect", x: 280, y: 180, duration: { kind: "triangular", min: 4, mode: 5, max: 7 } },
    { id: "n-rework", type: "NORMAL", label: "Rework", x: 280, y: 320, duration: { kind: "triangular", min: 6, mode: 8, max: 12 } },
    { id: "ctr", type: "COUNTER", label: "Finished Units", x: 500, y: 120, productionAmount: 1 },
  ],
  links: [
    { id: "ir1", from: "q-crew", to: "c-inspect" },
    { id: "ir2", from: "c-inspect", to: "ctr", probability: 0.9 },
    { id: "ir3", from: "c-inspect", to: "n-rework", probability: 0.1 },
    { id: "ir4", from: "n-rework", to: "q-crew" },
    { id: "ir5", from: "ctr", to: "q-crew" },
  ],
};

/** GEN + CON teaching model. */
export const genConScaleModel: CycloneModel = {
  id: "gen-con-scale",
  name: "GEN and CON Scale",
  description:
    "Parts Pool GEN 4 multiplies arrivals; CON 4 reunites into one kit. Independent Halpin functions.",
  timeUnit: "min",
  productionUnit: "kit",
  defaultRuns: 1,
  defaultMaxTime: 480,
  defaultMaxCycles: 80,
  nodes: [
    { id: "q-crew", type: "QUEUE", label: "Crew Idle", x: 60, y: 180, initialUnits: 1, costPerHourUsd: 80 },
    { id: "c-setup", type: "COMBI", label: "Setup Batch", x: 220, y: 180, duration: { kind: "triangular", min: 2, mode: 3, max: 4 } },
    { id: "n-prepare", type: "NORMAL", label: "Prepare", x: 380, y: 180, duration: { kind: "constant", value: 1 } },
    { id: "q-parts", type: "QUEUE", label: "Parts Pool", x: 520, y: 180, initialUnits: 0, generateCount: 4 },
    { id: "c-process", type: "COMBI", label: "Process Unit", x: 680, y: 180, duration: { kind: "triangular", min: 1.5, mode: 2, max: 3 } },
    { id: "con", type: "CONSOLIDATE", label: "Assemble Kit", x: 680, y: 320, consolidateCount: 4 },
    { id: "ctr", type: "COUNTER", label: "Kits Done", x: 520, y: 320, productionAmount: 1 },
    { id: "n-return", type: "NORMAL", label: "Return", x: 220, y: 320, duration: { kind: "constant", value: 0.5 } },
  ],
  links: [
    { id: "g1", from: "q-crew", to: "c-setup" },
    { id: "g2", from: "c-setup", to: "n-prepare" },
    { id: "g3", from: "n-prepare", to: "q-parts" },
    { id: "g4", from: "q-parts", to: "c-process" },
    { id: "g5", from: "c-process", to: "con" },
    { id: "g6", from: "con", to: "ctr" },
    { id: "g7", from: "ctr", to: "n-return" },
    { id: "g8", from: "n-return", to: "q-crew" },
  ],
};

export const PRESET_MODELS: CycloneModel[] = [
  earthmovingModel,
  concretePourModel,
  trenchExcavationModel,
  inspectReworkModel,
  genConScaleModel,
];

export function getPreset(id: string): CycloneModel | undefined {
  return PRESET_MODELS.find((m) => m.id === id);
}

export function cloneModel(model: CycloneModel): CycloneModel {
  return structuredClone(model);
}
