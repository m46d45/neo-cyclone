/**
 * General prompt template + default example.
 * Product language: English (tribute to Halpin CYCLONE).
 *
 * Format Prompt order (structured):
 *   1. Network (resource cycles)  2. Durations  3. Priority
 *   4. GEN / CON / branch notes   5. Cost       6. Sensitivity (last)
 *
 * Comments (ignored): # and //
 * Default time unit: **minutes**. Costs in **USD** per resource-hour.
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
 * Required for a runnable model: §1 network + §2 durations.
 * Everything else is optional; Sensitivity is last (economics / experiments).
 */
export const GENERAL_TEMPLATE = `# ============================================================
# FORMAT PROMPT — Neo-CYCLONE
# AI-agent of Daniel W. Halpin's CYCLONE
# ------------------------------------------------------------
# Lines starting with # or // are notes only (ignored by the agent).
# Time unit for all durations: minutes.
# Replace placeholders <…> with your operation. Keep section order.
# ============================================================

# ------------------------------------------------------------
# 1. NETWORK — resource cycles (required)
#    Each resource: home QUEUE → tasks → return.
#    Shared multi-demand (e.g. crane): Resource: TaskA | TaskB | TaskC
# ------------------------------------------------------------
Resource1: Task1 → Task2 → Task3 → …
Resource2: Task1
Resource3: TaskA → TaskB

n Resource1 = <count>, n Resource2 = <count>
production = <amount> <unit>

# ------------------------------------------------------------
# 2. DURATIONS — every task used above (required)
#    dist: const | unif | tri | normal | lognormal | beta | gamma
# ------------------------------------------------------------
Durations:
Task1: <dist> <params…>
Task2: <dist> <params…>
TaskA: <dist> <params…>

# ------------------------------------------------------------
# 3. PRIORITY — only if a shared resource serves several COMBIs
#    Lower number = higher priority (MicroCYCLONE node-number tradition).
#    Omit entirely when there is no contention.
# ------------------------------------------------------------
Priority:
Task1: 1
TaskA: 2

# ------------------------------------------------------------
# 4. FUNCTION NODES & BRANCHES — optional teaching extensions
#    GEN k  : on a QUEUE, each *arrival* becomes k units (not initial)
#    CON n  : CONSOLIDATE gathers n units then releases 1
#    Branch : e.g. After Inspect: OK p=0.9, Rework p=0.1
#    (Diagram: solid black = forward; dashed gold = return to QUEUE)
# ------------------------------------------------------------
# GEN / CON / p — describe here only if the operation needs them

# ------------------------------------------------------------
# 5. COST — optional (currency: USD per resource-hour)
#    Enables resource cost, total cost, unit cost in Results.
# ------------------------------------------------------------
Cost:
Resource1: <rate>
Resource2: <rate>

# ------------------------------------------------------------
# 6. SENSITIVITY — optional, usually last
#    Batch runs: vary fleet size low..high (step 1) for comparison charts.
# ------------------------------------------------------------
Sensitivity:
Resource1: <low>..<high>
Resource2: <low>..<high>
`;

export { DEFAULT_EXAMPLE_PROMPT, EXAMPLE_PROMPTS, getExampleById } from "./example-prompts";
export type { ExamplePrompt } from "./example-prompts";

/** Quick reference under Format Prompt (same logical order). */
export const DIST_TABLE = `# Quick reference (same order as Format Prompt)

# 1–2 Network + Durations (minutes)
  const value · unif min,max · tri min,mode,max
  normal mean,sd · lognormal mean,sd · beta min,max,α,β · gamma shape,scale

# 3 Priority (optional)
  Priority:  Task: 1     → lower number = higher priority

# 4 GEN / CON / branch (optional)
  GEN k on QUEUE · CON n · arc p=0..1

# 5 Cost (optional, USD / resource-hour)
  Cost:
  Resource: <rate>

# 6 Sensitivity (optional, last)
  Sensitivity:
  Resource: <low>..<high>

# Run controls (under diagram, not in this box)
  max cycles default 100, limit 500 · seed default 12345

# Notes: # …  or  // …`;

export const PRODUCT_TAGLINE = "AI-agent of Daniel W. Halpin's CYCLONE";
