/**
 * Teaching examples for Neo-CYCLONE (Halpin / MicroCYCLONE tradition).
 * Six construction-operation presets — features staged for teaching:
 *   1 Earthmoving — classic cycles, cost, steady-state
 *   2 Asphalt — branch p breakdown
 *   3 Excavator — GEN/CON inline
 *   4 Tower crane — multi-demand | + Priority (easier contention lesson)
 *   5 Masonry — 3 resources + sensitivity analysis only here
 *   6 Precast forms — longer form cycle (more complex; no SA)
 *
 * Source orientation: Halpin & Riggs, Planning and Analysis of Construction
 * Operations (Wiley, 1992) — simplified for first contact.
 */

export type ExamplePrompt = {
  id: string;
  title: string;
  goal: string;
  source: string;
  features: string[];
  prompt: string;
};

export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    id: "earthmoving",
    title: "1. Earthmoving fleet (loader + trucks)",
    goal: "Classic fleet — resource cycles, cost, steady-state (no branch, no sensitivity).",
    source: "Halpin earthmoving teaching model (classic).",
    features: ["COMBI Load", "cost", "steady-state"],
    prompt: `# Example 1 — Earthmoving fleet (classic)
# Pure classic cycle: no breakdown, no sensitivity analysis yet.
# Focus: resource cycles, cost report, steady-state productivity.

Trucks: Load → Haul → Dump → Return
Loader: Load
5 trucks, 1 loader

Counter after: Dump
production = 12 m3

Cost:
Trucks: 85
Loader: 120

Durations:
Load: tri 1.5, 2, 3
Haul: normal 8, 1.5
Dump: const 1.2
Return: lognormal 7, 1.5
`,
  },
  {
    id: "asphalt-paving",
    title: "2. Asphalt paving (paver + branch p)",
    goal: "Dump+Refill truck cycle; meeting at DumpToPaver; truck breakdown branch p; count after Pave.",
    source: "Halpin asphalt simplified + stochastic return delay (breakdown).",
    features: [
      "COMBI DumpToPaver",
      "branch p",
      "Counter after Pave",
      "cost",
    ],
    prompt: `# Example 2 — Asphalt paving (simplified + breakdown)
# Trucks: DumpToPaver → RefillAsphalt (normal), or Breakdown then RefillAsphalt.
# Breakdown is a detour delay — then refill — then dump again.
# Production after Pave. No sensitivity (see Example 5 Masonry for SA).

Trucks: DumpToPaver → RefillAsphalt
Paver: DumpToPaver → Pave
4 trucks, 1 paver

Counter after: Pave
production = 1 load

Branch:
After DumpToPaver: RefillAsphalt p=0.85, Breakdown p=0.15

Cost:
Trucks: 95
Paver: 180

Durations:
DumpToPaver: tri 0.8, 1.2, 1.8
RefillAsphalt: tri 8, 12, 18
Breakdown: tri 20, 35, 55
Pave: normal 3.5, 0.6
`,
  },
  {
    id: "excavator-load",
    title: "3. Excavator loading dump trucks (GEN/CON)",
    goal: "Inline GEN 5 + CON 5 TruckFull; Haul&Return (no sensitivity).",
    source: "Halpin GENERATE/CONSOLIDATE teaching (excavator fill dump truck).",
    features: ["GEN 5", "CON 5", "COMBI Scoop", "cost"],
    prompt: `# Example 3 — Excavator loading dump trucks (GEN / CON)
# Chain is the source of truth (inline GEN/CON):
#   GEN 5 → Scoop → CON 5 TruckFull → Haul&Return
# Home QUEUE "Trucks Idle" + GEN load-zone. No sensitivity (see Example 5 Masonry for SA).

Trucks: GEN 5 → Scoop → CON 5 TruckFull → Haul&Return
Excavator: Scoop
4 trucks, 1 excavator

Counter after: TruckFull
production = 1 load

Cost:
Trucks: 85
Excavator: 150

Durations:
Scoop: tri 0.4, 0.7, 1.2
Haul&Return: normal 10, 1.5
`,
  },
  {
    id: "tower-crane",
    title: "4. Tower crane multi-demand (priority)",
    goal: "Shared crane serves several lifts; Priority decides who goes first.",
    source: "Halpin multi-work / crane contention teaching pattern (simplified).",
    features: ["multi-demand |", "Priority P1–P3", "cost"],
    prompt: `# Example 4 — Tower crane with competing demands
# One crane idle pool feeds several lift COMBIs. Lower Priority number = first.
# (No sensitivity here — see Example 5 Masonry for SA.)

Steel crew: Lift Steel → Place Steel
Form crew: Lift Forms → Place Forms
Concrete crew: Lift Bucket → Pour
Crane: Lift Steel | Lift Forms | Lift Bucket

1 steel crew, 2 form crew, 2 concrete crew, 1 crane

Counter after: Lift Steel
production = 1 lift

Priority:
Lift Steel: 1
Lift Forms: 2
Lift Bucket: 3

Cost:
Crane: 280
Steel crew: 95
Form crew: 80
Concrete crew: 90

Durations:
Lift Steel: tri 4, 6, 9
Place Steel: normal 12, 2
Lift Forms: tri 3, 5, 8
Place Forms: normal 10, 1.5
Lift Bucket: tri 2, 3, 5
Pour: normal 8, 1.2
`,
  },
  {
    id: "masonry",
    title: "5. Masonry crew (sensitivity analysis)",
    goal: "Only preset with sensitivity: 3 resources, pairwise SA + shared Lay.",
    source: "Halpin masonry / crew models (simplified).",
    features: ["sensitivity analysis", "3 resources", "pairwise SA", "COMBI Lay"],
    prompt: `# Example 5 — Masonry crew (sensitivity analysis)
# ONLY teaching example that includes Sensitivity: (pairwise for 3 resources).
# Masons + helpers meet at Lay; scaffold supports the course.

Masons: Lay → MortarPrep
Helpers: Lay → SupplyBrick
Scaffold: Lay → MoveScaffold
4 masons, 2 helpers, 1 scaffold

Counter after: Lay
production = 1 course

Cost:
Masons: 75
Helpers: 45
Scaffold: 25

Sensitivity:
Masons: 2..6
Helpers: 1..4
Scaffold: 1..2

Durations:
Lay: tri 4, 6, 9
MortarPrep: normal 3, 0.5
SupplyBrick: normal 2.5, 0.4
MoveScaffold: tri 8, 12, 18
`,
  },
  {
    id: "precast-forms",
    title: "6. Precast form cycle (forms + crew)",
    goal: "Longer multi-step form cycle; strip → clean → set → pour → cure (no SA).",
    source: "Halpin precast / formwork teaching examples (simplified).",
    features: ["form cycle", "longer durations", "cost"],
    prompt: `# Example 6 — Precast form cycle
# Forms circulate; crew strip/clean/set/pour. Cure holds the form.
# More complex multi-step cycle (no sensitivity — use Example 5 for SA).

Forms: Strip → Clean → Set → Pour → Cure
Crew: Strip → Clean → Set → Pour
6 forms, 1 crew

Counter after: Pour
production = 1 panel

Cost:
Forms: 15
Crew: 110

Durations:
Strip: tri 20, 30, 45
Clean: normal 15, 3
Set: tri 25, 35, 50
Pour: tri 15, 20, 30
Cure: const 120
`,
  },
];

export function getExampleById(id: string): ExamplePrompt | undefined {
  return EXAMPLE_PROMPTS.find((e) => e.id === id);
}

/** Default app prompt = Example 1 (earthmoving). */
export const DEFAULT_EXAMPLE_PROMPT =
  EXAMPLE_PROMPTS.find((e) => e.id === "earthmoving")!.prompt;
