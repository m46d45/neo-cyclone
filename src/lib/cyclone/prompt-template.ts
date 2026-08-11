/**
 * General prompt template + default example.
 * Product language: English (tribute to Halpin CYCLONE).
 *
 * Format Prompt order (structured):
 *   1. Network (resource cycles)  2. Durations  3. Priority
 *   4. Functions (GEN/CON) + Branch (p)   5. Cost   6. Sensitivity (last)
 *
 * Comments (ignored): # and //
 * Default time unit: **minutes**. Costs in **USD** per resource-hour.
 *
 * QUEUE nodes and arrows are NOT written by hand — the agent builds them from
 * resource cycles. GEN / CON / p annotate special nodes and arcs by name.
 */

export function stripPromptComments(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      const t = line.trim();
      if (!t) return "";
      if (t.startsWith("#") || t.startsWith("//")) return "";
      const hash = line.indexOf(" #");
      if (hash >= 0) return line.slice(0, hash).trimEnd();
      const slash = line.indexOf(" //");
      if (slash >= 0) return line.slice(0, slash).trimEnd();
      return line;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Canonical Format Prompt (Neo-CYCLONE) — structured top → bottom.
 * Required: §1 network + §2 durations.
 */
export const GENERAL_TEMPLATE = `# ============================================================
# FORMAT PROMPT — Neo-CYCLONE
# AI-Assisted Construction Operation Simulation
# AI-agent of Daniel W. Halpin's CYCLONE
# ------------------------------------------------------------
# # and // = notes only (ignored). Durations in minutes.
# You do NOT draw QUEUE circles or arrows here.
# Resource cycles imply home QUEUE + forward/return arcs.
# GEN / CON prefer INLINE on the resource chain (source of truth).
# Home QUEUE is automatic per resource; GEN is an extra load-zone QUEUE.
# ============================================================

# After notes (# …), first data line — operation name (reports + Excel filename)
Operation: <short name of the construction operation>


# ------------------------------------------------------------
# 1. NETWORK — resource cycles (required)
#    Home QUEUE is created automatically for each resource.
#    Inline GEN/CON in the chain (preferred):
#      Trucks: GEN 5 → Scoop → CON 5 TruckFull → Haul&Return
#    Sequence:     Resource: Task1 → Task2 → Task3
#      arrows OK: →   ->   -->   =>
#    Multi-demand: Resource: TaskA | TaskB | TaskC
#      → one home QUEUE may serve A or B or C (not a sequence).
#      → use Priority: when several demands wait (lower = first).
#      Examples: Crane: LiftAtA | LiftAtB | LiftAtC
#                Helpers: ReceiveBrick | ReceiveMortar
# ------------------------------------------------------------
Resource1: Task1 → Task2 → Task3 → …
Resource2: Task1
# Multi-demand example:
# 1 Crane: LiftAtA | LiftAtB | LiftAtC
# GEN/CON example:
# Trucks: GEN 5 → Scoop → CON 5 TruckFull → Haul&Return
# Excavator: Scoop

n Resource1 = <count>, n Resource2 = <count>

# Production COUNTER — where ONE completed unit / cycle is counted
# (golf-flag node). Always name it so it cannot "disappear".
# Default if omitted: after the LAST task of the FIRST resource cycle.
Counter after: <TaskName>
# Multiple: Counter after: LiftAtA, LiftAtB, LiftAtC
production = <amount> <unit>

# ------------------------------------------------------------
# 2. DURATIONS — every named task (required)
#    dist: const | unif | tri | normal | lognormal | beta | pert | gamma
#    beta min,max,α,β  |  pert a,m,b (optimistic, mode, pessimistic → PERT-beta)
# ------------------------------------------------------------
Durations:
Task1: <dist> <params…>
Task2: <dist> <params…>
TaskA: <dist> <params…>

# ------------------------------------------------------------
# 3. PRIORITY — shared resource contention only (optional)
#    Lower number = higher priority (MicroCYCLONE tradition).
# ------------------------------------------------------------
Priority:
Task1: 1
TaskA: 2

# ------------------------------------------------------------
# 4. BRANCH + optional Functions alias (Halpin p / legacy GEN-CON names)
#    Prefer GEN/CON **inline** in §1. Functions: only if you name pools:
#      GEN PartsPool = 4   (PartsPool must appear in a cycle)
#      CON Assemble = 4
#    Branch → after a task, probabilistic successors (diagram p=…)
# ------------------------------------------------------------
# Branch:
# After Inspect: Pass p=0.9, Rework p=0.1

# ------------------------------------------------------------
# 5. COST — optional (USD per resource-hour)
# ------------------------------------------------------------
Cost:
Resource1: <rate>
Resource2: <rate>

# ------------------------------------------------------------
# 6. SENSITIVITY — optional, usually last
# ------------------------------------------------------------
Sensitivity:
Resource1: <low>..<high>
Resource2: <low>..<high>
`;

export { DEFAULT_EXAMPLE_PROMPT, EXAMPLE_PROMPTS, getExampleById } from "./example-prompts";
export type { ExamplePrompt } from "./example-prompts";

export const DIST_TABLE = `# Quick reference (same order as Format Prompt)

# 1 Network — resource cycles (QUEUE + arrows drawn by the app)
#    Counter after: <Task>   ← where production is counted (default: last task of 1st resource)
#    production = <amount> <unit>
# 2 Durations (minutes)
  const · unif · tri · normal · lognormal · beta · pert · gamma
  # beta min,max,α,β   |   pert a,m,b (optimistic, mode, pessimistic)

# 3 Priority (optional)
  Priority:
  Task: 1

# 4 GEN / CON / Branch — prefer inline in the cycle
  Trucks: GEN 5 → Scoop → CON 5 TruckFull → …
  (optional) Functions: GEN <Name> = k  if Name is already a step
  CON <NodeName> = n     → CONSOLIDATE n on that step name
  Branch:
  After <Task>: OutA p=0.9, OutB p=0.1

# 5 Cost (optional, USD / resource-hour)
  Cost:
  Resource: <rate>

# 6 Sensitivity (optional, last)
  Sensitivity:
  Resource: <low>..<high>

# Run: max cycles default 100, limit 500 · seed 12345
# Notes: # …  or  // …`;

/** Primary product descriptor (header, manual, exports). */
export const PRODUCT_TAGLINE = "AI-Assisted Construction Operation Simulation";

/** Dedication line — Halpin lineage (footer / manual). */
export const PRODUCT_DEDICATION = "AI-agent of Daniel W. Halpin's CYCLONE";

/** App release label for footer / citation. Keep in sync with manual badge. */
export const PRODUCT_VERSION = "1.6.12";

/** Copyright / release year. */
export const PRODUCT_YEAR = 2026;
