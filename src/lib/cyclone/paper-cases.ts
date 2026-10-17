/**
 * Paper reproduction cases (ITcon archive prompts).
 * Productivity numbers below are the v1.7.5 seed-12345 archive targets.
 * v1.8.0 must keep those productivities; see engine.paper.test.ts.
 */
import { runCyclone } from "./engine";
import type { CycloneModel, SimResult } from "./types";

export const PAPER_SEED = 12345;

/** Ten seeds used for the ITcon multi-seed tables. */
export const PAPER_SEEDS = [12345, 1, 7, 13, 21, 42, 99, 2024, 2026, 31415] as const;

export type FieldReference = {
  /** Short label shown on the comparison card, e.g. "Sc 1". */
  label: string;
  /** Published field productivity, m³/h. */
  m3PerHour: number;
};

export type PavementCase = {
  id: string;
  operation: string;
  volumeM3: number;
  dischargeMean: number;
  dischargeSd: number;
  /** Archive Table 7 point at seed 12345, m³/h. */
  unitsPerHour12345: number;
  field: FieldReference | null;
};

export const PAVEMENT_CASES: PavementCase[] = [
  {
    id: "paper-pavement-sc1",
    operation: "RigidPavement_Baseline10",
    volumeM3: 10,
    dischargeMean: 11.05,
    dischargeSd: 5.27,
    unitsPerHour12345: 52.7,
    field: { label: "Sc 1", m3PerHour: 59.8 },
  },
  {
    id: "paper-pavement-sc2",
    operation: "RigidPavement_Volume4",
    volumeM3: 4,
    dischargeMean: 5.52,
    dischargeSd: 2.31,
    unitsPerHour12345: 40.46,
    field: null,
  },
  {
    id: "paper-pavement-sc3",
    operation: "RigidPavement_Volume8",
    volumeM3: 8,
    dischargeMean: 13.43,
    dischargeSd: 8.3,
    unitsPerHour12345: 33.68,
    field: null,
  },
  {
    id: "paper-pavement-sc4",
    operation: "RigidPavement_Sedang",
    volumeM3: 10,
    dischargeMean: 10.01,
    dischargeSd: 7.27,
    unitsPerHour12345: 58.53,
    field: null,
  },
  {
    id: "paper-pavement-sc5",
    operation: "RigidPavement_Panjang",
    volumeM3: 10,
    dischargeMean: 9.94,
    dischargeSd: 3.16,
    unitsPerHour12345: 57.84,
    field: null,
  },
  {
    id: "paper-pavement-sc6",
    operation: "RigidPavement_SSC",
    volumeM3: 10,
    dischargeMean: 9.3,
    dischargeSd: 4.07,
    unitsPerHour12345: 62.65,
    field: { label: "Sc 6", m3PerHour: 67.0 },
  },
  {
    id: "paper-pavement-sc7",
    operation: "RigidPavement_MPMA",
    volumeM3: 10,
    dischargeMean: 9.95,
    dischargeSd: 6.32,
    unitsPerHour12345: 59.02,
    field: null,
  },
];

export function pavementPrompt(c: PavementCase): string {
  return `Operation: ${c.operation}

Trucks: Away → Discharge → Return
Paver: Discharge
n Trucks = 5, n Paver = 1

Counter after: Discharge
production = ${c.volumeM3} m3

Durations:
Away: lognormal 8.0 3.2
Discharge: lognormal ${c.dischargeMean} ${c.dischargeSd}
Return: lognormal 8.0 3.2

Cycles: 100
Seed: 12345
`;
}

export const DETERMINISTIC_EARTHMOVING_PROMPT = `Operation: Earthmoving_Validation

Trucks: Load → Haul → Dump → Return
Loader: Load
Spotter: Dump
4 trucks, 1 loader, 1 spotter

Counter after: Dump
production = 1 load

Durations:
Load: const 7
Haul: const 8
Dump: const 5
Return: const 6

Cycles: 100
Seed: 12345
`;

export const GIRDER_PROMPT = `Operation: PCI_Girder_Cinapel

Trucks: LiftToTruck → Travel → PlaceToLifter → Return
Lifter: PlaceToLifter → Lift → PlaceGirder → Brace → ReturnLifter
ErectionTeam: PlaceGirder → Brace
1 truck, 1 lifter, 1 ErectionTeam

Counter after: Brace
production = 1 girder

Durations:
LiftToTruck: tri 15, 18, 20
Travel: tri 12, 15, 17
PlaceToLifter: tri 15, 18, 20
Return: tri 10, 12, 15
Lift: const 35
PlaceGirder: tri 15, 18, 20
Brace: tri 13, 17, 20
ReturnLifter: tri 10, 12, 15

Cycles: 100
Seed: 12345
`;

export function fieldReferenceForModel(name: string): FieldReference | null {
  const found = PAVEMENT_CASES.find((c) => c.operation === name);
  return found?.field ?? null;
}

export function isRigidPavementModel(name: string): boolean {
  return name.replace(/\s+/g, "").toLowerCase().startsWith("rigidpavement");
}

/** Re-run the drawn model on the ten archive seeds. Productivity path is unchanged. */
export function runPaperSeedArchive(
  model: CycloneModel,
  maxCycles: number,
  maxTime: number,
): SimResult[] {
  return PAPER_SEEDS.map((seed) => runCyclone(model, { seed, maxCycles, maxTime }));
}
