/**
 * General prompt template + default example.
 * Product language: English (tribute to Halpin CYCLONE).
 *
 * Comments (ignored): # and //
 * Default time unit for all durations: **minutes**.
 * Costs: USD per resource-hour (Halpin teaching tradition).
 *
 * Full standard also covers: GEN, CON, probability branches, arrows (diagram),
 * and Priority (lower number = higher priority, MicroCYCLONE-style).
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
 * Canonical Format Prompt (Neo-CYCLONE).
 * Sections are optional except resource cycles + durations for a runnable model.
 */
export const GENERAL_TEMPLATE = `Resource1: Task1 → Task2 → Task3 → …
Resource2: Task1
Resource3: TaskA → TaskB

n Resource1 = <count>, n Resource2 = <count>
production = <amount> <unit>

# --- Optional blocks (use only what the operation needs) ---

# Hourly costs in USD (enables total cost & unit cost)
Cost USD/h:
Resource1: <rate>
Resource2: <rate>

# Sensitivity: vary counts from low..high step 1
Sensitivity:
Resource1: <low>..<high>
Resource2: <low>..<high>

# Priority when a shared resource can serve several tasks (e.g. tower crane).
# Lower number = higher priority (MicroCYCLONE node-number tradition).
# Omit if there is no contention among COMBI tasks.
Priority:
Task1: 1
TaskA: 2

# Probabilistic branch (optional): after a task, choose successors with p.
# Write in Network / DSL as link probability, or describe e.g.:
# After Inspect: OK p=0.9, Rework p=0.1

# GEN k (optional): on a QUEUE, each arrival becomes k units (not initial).
# CON n (optional): CONSOLIDATE node gathers n units then releases 1.

Durations:   # default unit = minutes
Task1: <dist> <params…>
Task2: <dist> <params…>

# lines starting with # or // are notes (ignored)`;

export { DEFAULT_EXAMPLE_PROMPT, EXAMPLE_PROMPTS, getExampleById } from "./example-prompts";
export type { ExamplePrompt } from "./example-prompts";

export const DIST_TABLE = `Distributions (durations in minutes):
  const   value
  unif    min, max
  tri     min, mode, max
  normal  mean, sd
  lognormal  mean, sd
  beta    min, max, alpha, beta
  gamma   shape, scale   ·  or  gamma mean M sd S

Cost (optional): Cost USD/h:  Resource: rate
  → resource cost, total cost, unit cost (USD / production unit)

Sensitivity (optional): Sensitivity:  Resource: low..high
  → batch runs over resource combinations (Halpin-style)

Priority (optional): Priority:  Task: 1
  → lower number = higher priority when COMBIs compete for a shared resource
  → MicroCYCLONE tradition (smaller node number first)
  → typical: tower crane serving several demand tasks

GEN k (optional, on QUEUE): each *arrival* becomes k units
CON n (optional, CONSOLIDATE): buffer n → release 1
Branch p (optional, on arcs): probabilistic multi-out (Results → Branches)

Diagram arrows (drawn by the app):
  solid black + tip = forward flow toward production
  dashed gold + tip = return into a QUEUE (resource cycle)

Notes (not commands): # ...  or  // ...
Run: max cycles (default 100, limit 500) & seed (default 12345) under the diagram.`;

export const PRODUCT_TAGLINE = "AI-agent of Daniel W. Halpin's CYCLONE";
