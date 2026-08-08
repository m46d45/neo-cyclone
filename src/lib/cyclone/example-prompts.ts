/**
 * Teaching examples for Neo-CYCLONE (Halpin / MicroCYCLONE tradition).
 * Each entry is a ready-to-paste prompt. GEN / CON / probabilistic branch
 * are noted where classic models use them (GEN, CON, branch p supported).
 *
 * Source orientation: Halpin & Riggs, Planning and Analysis of Construction
 * Operations (Wiley, 1992) and related CYCLONE teaching examples — simplified
 * for first contact, not full textbook figures.
 */

export type ExamplePrompt = {
  id: string;
  title: string;
  /** Short classroom goal */
  goal: string;
  /** Halpin-oriented source note */
  source: string;
  /** Features exercised (for regression / manual) */
  features: string[];
  /** Full prompt text */
  prompt: string;
};

export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    id: "earthmoving",
    title: "1. Earthmoving fleet (loader + trucks)",
    goal: "Classic two-resource cycle: bottleneck, utilization, cost, sensitivity.",
    source: "Halpin tradition — earthmoving / scraper–truck style fleet (simplified).",
    features: ["COMBI Load", "cost USD/h", "sensitivity", "steady-state productivity"],
    prompt: `# Example 1 — Earthmoving fleet
# Durations in minutes. Costs in USD per hour. Seed default = 12345.

Trucks: Load → Haul → Dump → Return
Loader: Load
5 trucks, 1 loader, 12 m3

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
Return: lognormal 7, 1.5`,
  },
  {
    id: "asphalt-paving",
    title: "2. Asphalt paving (paver + trucks)",
    goal: "Paver as constrained resource; truck haul cycle; multi-resource sensitivity.",
    source: "Halpin / asphalt paving teaching models (simplified).",
    features: ["COMBI Pave", "three-step truck cycle", "cost", "sensitivity"],
    prompt: `# Example 2 — Asphalt paving
# Trucks deliver mix; paver is the constrained meeting point.

Trucks: DumpToPaver → HaulEmpty → LoadAtPlant → ReturnToPaver
Paver: DumpToPaver → Pave
4 trucks, 1 paver, 1 load

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
ReturnToPaver: normal 11, 2`,
  },
  {
    id: "concrete-crane",
    title: "3. Concrete placing (crane + trucks)",
    goal: "Shared Load/Spot; crane swing cycle. See also GEN and CON Scale preset for GEN/CON.",
    source: "Halpin concrete / crane–bucket family (simplified 1:1 pour; GEN/CON in Example 6).",
    features: ["COMBI SpotLoad", "crane cycle", "cost"],
    prompt: `# Example 3 — Concrete placing (crane + trucks)
# Simplified: one truck load = one crane pour cycle.
# Classic MicroCYCLONE often uses GEN (truck → N bucket loads) + CON (N → truck leaves).
# Use Example 6 (GEN and CON Scale) to exercise that pair.

Trucks: SpotLoad → WaitPour → Leave
Crane: SpotLoad → Swing → Pour → ReturnSwing
3 trucks, 1 crane, 1 pour

Cost:
Trucks: 90
Crane: 200

Sensitivity:
Trucks: 2..8
Crane: 1..2

Durations:
SpotLoad: tri 1, 1.5, 2.5
Swing: const 0.8
Pour: tri 1.2, 2, 3
ReturnSwing: const 0.7
WaitPour: const 0.1
Leave: normal 14, 2`,
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
6 forms, 1 crew, 1 panel

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
Cure: const 120`,
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
4 masons, 2 helpers, 1 scaffold, 1 course

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
MoveScaffold: tri 8, 12, 18`,
  },
  {
    id: "inspect-rework",
    title: "6. Inspect and rework (branch p)",
    goal: "Probabilistic arc after inspection: pass vs rework.",
    source: "Halpin stochastic branch / quality teaching examples (simplified).",
    features: ["probability branch", "rework loop", "empirical share"],
    prompt: `# Example 6 — Inspect and rework
# Network names the steps; Branch block sets p on arcs (no hand-drawn arrows).

Crew: Inspect → Pass
1 crew, 1 unit

Durations:
Inspect: tri 4, 5, 7
Rework: tri 6, 8, 12
Pass: const 0

Branch:
After Inspect: Pass p=0.9, Rework p=0.1
`,
  },
  {
    id: "gen-con-scale",
    title: "7. GEN and CON scale",
    goal: "GENERATE multiplies arrivals; CONSOLIDATE reunites N units into one production unit.",
    source: "Halpin GEN/CON function-node teaching (kit / bucket-scale simplified).",
    features: ["GEN 4", "CON 4", "independent function nodes"],
    prompt: `# Example 7 — GEN and CON scale
# PartsPool and AssembleKit appear in the cycle; Functions turns them into GEN/CON.
# You never draw the Q or triangle by hand — only name them in the network.

Crew: SetupBatch → Prepare → PartsPool → ProcessUnit → AssembleKit → Return
1 crew, 1 kit

Durations:
SetupBatch: tri 2, 3, 4
Prepare: const 1
ProcessUnit: tri 1.5, 2, 3
Return: const 0.5

Functions:
GEN PartsPool = 4
CON AssembleKit = 4
`,
  },

  {
    id: "tower-crane",
    title: "8. Tower crane multi-demand (priority)",
    goal: "Shared crane serves several lifts; Priority block decides who goes first.",
    source: "Halpin multi-work / crane contention teaching pattern (simplified).",
    features: ["shared QUEUE → several COMBIs", "Priority lower=first", "cost optional"],
    prompt: `# Example 8 — Tower crane with competing demands
# One crane idle pool feeds several lift COMBIs. Lower Priority number = first.

Steel crew: Lift Steel → Place Steel
Form crew: Lift Forms → Place Forms
Concrete crew: Lift Bucket → Pour
# Shared resource multi-demand: pipe = several COMBIs from same home QUEUE
Crane: Lift Steel | Lift Forms | Lift Bucket

1 steel crew, 2 form crew, 2 concrete crew, 1 crane
production = 1 lift

# MicroCYCLONE-style: smaller number = higher priority when crane is free.
# With only 1 steel crew, after Lift Steel the crew is busy at Place Steel,
# so the crane can serve Lift Forms / Lift Bucket (P2, P3). If steel count is
# high and always waiting, P1 starves lower priorities — that is intentional.
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
Pour: normal 8, 1.2`,
  },

];

export function getExampleById(id: string): ExamplePrompt | undefined {
  return EXAMPLE_PROMPTS.find((e) => e.id === id);
}

/** Default app prompt = Example 1 (earthmoving). */
export const DEFAULT_EXAMPLE_PROMPT =
  EXAMPLE_PROMPTS.find((e) => e.id === "earthmoving")!.prompt;
