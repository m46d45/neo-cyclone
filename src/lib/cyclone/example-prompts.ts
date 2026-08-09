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
    title: "4. Tower crane — 3 zones + priority",
    goal: "One crane serves three different work zones (A/B/C); Priority when demands compete.",
    source: "Halpin multi-work / crane contention (zones made explicit for teaching).",
    features: ["3 locations", "multi-demand |", "Priority P1–P3", "cost"],
    prompt: `# Example 4 — Tower crane serving three zones
# One tower crane, three clear work locations (not the same task renamed):
#   Zone A — floor steel:   CrewA  LiftAtA → ErectSteelA
#   Zone B — perimeter forms: CrewB  LiftAtB → SetFormsB
#   Zone C — core concrete: CrewC  LiftAtC → PlaceConcreteC
# Crane: LiftAtA | LiftAtB | LiftAtC   (one idle pool, three demands)
# Priority: lower number first when several zones wait at once.
# 1 steel crew + longer erect → crane free for B/C while steel is busy on deck.
# Production = EVERY crane lift (A+B+C) — multi-counter; util/idle shows waste.

1 CrewA Steel: LiftAtA → ErectSteelA
2 CrewB Forms: LiftAtB → SetFormsB
2 CrewC Concrete: LiftAtC → PlaceConcreteC
1 Crane: LiftAtA | LiftAtB | LiftAtC

Counter after: LiftAtA, LiftAtB, LiftAtC
production = 1 lift

Priority:
LiftAtA: 1
LiftAtB: 2
LiftAtC: 3

Cost:
Crane: 280
CrewA Steel: 95
CrewB Forms: 80
CrewC Concrete: 90

Durations:
LiftAtA: tri 4, 6, 9
ErectSteelA: normal 25, 4
LiftAtB: tri 3, 5, 8
SetFormsB: normal 10, 1.5
LiftAtC: tri 2, 3, 5
PlaceConcreteC: normal 8, 1.2
`,
  },
  {
    id: "masonry",
    title: "5. Masonry (scaffold + SA)",
    goal: "3 scaffold spaces; brick packs + mortar GEN2/CON2; sensitivity analysis.",
    source: "Halpin masonry adapted: scaffold capacity, 20-brick packs, 1 mortar : 2 packs.",
    features: [
      "sensitivity analysis",
      "scaffold 3 spaces",
      "Priority mortar>brick",
      "GEN 2 mortar doses",
      "CON 2 rejoin",
      "pairwise SA",
    ],
    prompt: `# Example 5 — Masonry crew (scaffold + brick packs + mortar)
# Scaffold has 3 material spaces (shared): typically 2 brick packs + 1 mortar bucket.
# Brick pack = 20 bricks (production unit). 
# 1 mortar bucket → GEN 2 doses (covers two packs of 20).
# Helpers stock onto scaffold (uses a space), then meet masons at Lay.
# After two dose-lays, CON 2 reunites the mortar-helper cycle (no entity blow-up).
# Scaffold multi-demand: StockBrick | StockMortar — when both wait, PRIORITY decides.
# Prefer mortar first (P1): 1 bucket unlocks GEN 2 doses = 2 packs of laying work.
# Brick packs (P2) fill remaining spaces (typically 2 packs + 1 mortar = 3 spaces).
# ONLY preset with Sensitivity: (pairwise when 3 resources vary).

4 Masons: Lay
2 Brick helpers: FetchBrick → StockBrick → Lay
1 Mortar helpers: FetchMortar → StockMortar → GEN 2 → Lay → CON 2 Rejoin
3 Scaffold: StockBrick | StockMortar

Counter after: Lay
production = 20 bricks

Priority:
StockMortar: 1
StockBrick: 2

Cost:
Masons: 75
Brick helpers: 45
Mortar helpers: 45
Scaffold: 25

Sensitivity:
Masons: 2..6
Brick helpers: 1..4
Scaffold: 2..4

Durations:
FetchBrick: tri 2, 3, 5
StockBrick: tri 1, 1.5, 2.5
FetchMortar: tri 3, 4, 6
StockMortar: tri 1, 2, 3
Lay: tri 4, 6, 9
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
