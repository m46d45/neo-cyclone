/**
 * Teaching examples for Neo-CYCLONE (Halpin / MicroCYCLONE tradition).
 * Six construction-operation presets — features distributed across cases:
 *   1 Earthmoving (+ truck breakdown branch p)
 *   2 Asphalt paving
 *   3 Concrete placing (+ GEN/CON bucket scale)
 *   4 Precast forms
 *   5 Masonry (pairwise sensitivity)
 *   6 Tower crane (priority / multi-demand)
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
    goal: "Classic fleet + optional truck breakdown delay on return (branch p).",
    source: "Halpin earthmoving; stochastic return/breakdown teaching pattern.",
    features: [
      "COMBI Load",
      "cost",
      "sensitivity",
      "steady-state",
      "branch p (breakdown)",
    ],
    prompt: `# Example 1 — Earthmoving fleet
# Classic loader + trucks. After Dump, most trucks return normally;
# a few break down and return late (probability branch).

Trucks: Load → Haul → Dump
Loader: Load
5 trucks, 1 loader

# Where one production unit is counted (required for clear teaching)
Counter after: Dump
production = 12 m3

Cost:
Trucks: 85
Loader: 120

Sensitivity:
Trucks: 2..12
Loader: 1..2

Durations:
Load: tri 1.5, 2, 3
Haul: normal 8, 1.5
Dump: const 1.2
Return: lognormal 7, 1.5
Breakdown: tri 25, 40, 60

# p = chance of delayed return (broke down / repair on the way back)
Branch:
After Dump: Return p=0.85, Breakdown p=0.15
`,
  },
  {
    id: "asphalt-paving",
    title: "2. Asphalt paving (paver + trucks)",
    goal: "Paver as constrained resource; truck haul cycle; multi-resource sensitivity.",
    source: "Halpin / asphalt paving teaching models (simplified).",
    features: ["COMBI Pave", "truck cycle", "cost", "sensitivity"],
    prompt: `# Example 2 — Asphalt paving
# Trucks deliver mix; paver is the constrained meeting point.

Trucks: DumpToPaver → HaulEmpty → LoadAtPlant → ReturnToPaver
Paver: DumpToPaver → Pave
4 trucks, 1 paver

Counter after: DumpToPaver
production = 1 load

Cost:
Trucks: 95
Paver: 180

Sensitivity:
Trucks: 2..10
Paver: 1..2

Durations:
DumpToPaver: tri 0.8, 1.2, 1.8
Pave: normal 3.5, 0.6
HaulEmpty: normal 12, 2
LoadAtPlant: tri 2, 3, 4
ReturnToPaver: normal 11, 2
`,
  },
  {
    id: "concrete-crane",
    title: "3. Concrete placing (crane + GEN/CON)",
    goal: "Crane–truck pour with GEN (truck → buckets) and CON (buckets → truck free).",
    source: "Halpin concrete placement; GEN/CON bucket-scale teaching.",
    features: ["crane cycle", "GEN 4", "CON 4", "cost", "sensitivity"],
    prompt: `# Example 3 — Concrete placing (crane + trucks + GEN/CON)
# SpotLoad truck → BucketPool (GEN 4): one truck load becomes 4 bucket units.
# Crane meets buckets at ProcessBucket (COMBI); after 4 pours, CON AssemblePour
# releases the truck to Leave. (QUEUE only feeds COMBI — Halpin rule.)

Trucks: SpotLoad → BucketPool → ProcessBucket → AssemblePour → Leave
Crane: ProcessBucket
3 trucks, 1 crane

Counter after: AssemblePour
production = 1 pour

Functions:
GEN BucketPool = 4
CON AssemblePour = 4

Cost:
Trucks: 90
Crane: 200

Sensitivity:
Trucks: 2..8
Crane: 1..2

Durations:
SpotLoad: tri 1, 1.5, 2.5
ProcessBucket: tri 1.2, 2, 3
Leave: normal 14, 2
`,
  },
  {
    id: "precast-forms",
    title: "4. Precast form cycle (forms + crew)",
    goal: "Form as resource cycle: strip → clean → set → pour → cure hold.",
    source: "Halpin precast / formwork teaching examples (simplified).",
    features: ["form queue", "crew COMBI", "longer cycle times"],
    prompt: `# Example 4 — Precast form cycle
# Forms circulate; crew performs strip/clean/set/pour. Cure is a delay on the form.

Forms: Strip → Clean → Set → Pour → Cure
Crew: Strip → Clean → Set → Pour
6 forms, 1 crew

Counter after: Pour
production = 1 panel

Cost:
Forms: 15
Crew: 110

Sensitivity:
Forms: 4..12
Crew: 1..2

Durations:
Strip: tri 20, 30, 45
Clean: normal 15, 3
Set: tri 25, 35, 50
Pour: tri 15, 20, 30
Cure: const 120
`,
  },
  {
    id: "masonry",
    title: "5. Masonry crew (masons + helpers + scaffold)",
    goal: "Three resources; pairwise sensitivity; shared lay-block task.",
    source: "Halpin masonry / crew models (simplified).",
    features: ["3 resources", "pairwise sensitivity", "COMBI Lay"],
    prompt: `# Example 5 — Masonry crew
# Masons + helpers meet at Lay; scaffold is a supporting resource cycle.

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
    id: "tower-crane",
    title: "6. Tower crane multi-demand (priority)",
    goal: "Shared crane serves several lifts; Priority decides who goes first.",
    source: "Halpin multi-work / crane contention teaching pattern (simplified).",
    features: ["multi-demand |", "Priority P1–P3", "cost"],
    prompt: `# Example 6 — Tower crane with competing demands
# One crane idle pool feeds several lift COMBIs. Lower Priority number = first.

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
];

export function getExampleById(id: string): ExamplePrompt | undefined {
  return EXAMPLE_PROMPTS.find((e) => e.id === id);
}

/** Default app prompt = Example 1 (earthmoving). */
export const DEFAULT_EXAMPLE_PROMPT =
  EXAMPLE_PROMPTS.find((e) => e.id === "earthmoving")!.prompt;
