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

Cost USD/h:
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

Cost USD/h:
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

Cost USD/h:
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

Cost USD/h:
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

Cost USD/h:
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
# After Inspect: p=0.9 pass → finished unit; p=0.1 rework then re-enter crew queue.
# Branch probabilities are set in the model (diagram shows p=…).

Crew: Inspect → (pass / rework)
1 crew, 1 unit

Durations:
Inspect: tri 4, 5, 7
Rework: tri 6, 8, 12

# Notes: Draw Model then Simulate. Results → Branches compares declared vs empirical p.
`,
  },
  {
    id: "gen-con-scale",
    title: "7. GEN and CON scale",
    goal: "GENERATE multiplies arrivals; CONSOLIDATE reunites N units into one production unit.",
    source: "Halpin GEN/CON function-node teaching (kit / bucket-scale simplified).",
    features: ["GEN 4", "CON 4", "independent function nodes"],
    prompt: `# Example 7 — GEN and CON scale
# After Setup Batch → Prepare, Parts Pool multiplies each arrival into 4 (GEN 4).
# Process Unit works each part; Assemble Kit (CON 4) releases one kit.

Crew: SetupBatch → Prepare → ProcessUnit → AssembleKit → Return
1 crew, 1 kit

Durations:
SetupBatch: tri 2, 3, 4
Prepare: const 1
ProcessUnit: tri 1.5, 2, 3
Return: const 0.5

# Prefer loading network via Example dropdown "GEN and CON Scale" if listed,
# or Draw Model — AI should place QUEUE generate:4 and CONSOLIDATE consolidate:4.
`,
  },

];

export function getExampleById(id: string): ExamplePrompt | undefined {
  return EXAMPLE_PROMPTS.find((e) => e.id === id);
}

/** Default app prompt = Example 1 (earthmoving). */
export const DEFAULT_EXAMPLE_PROMPT =
  EXAMPLE_PROMPTS.find((e) => e.id === "earthmoving")!.prompt;
