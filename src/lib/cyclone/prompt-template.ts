/**
 * General prompt template + default example.
 * Product language: English (tribute to Halpin CYCLONE).
 *
 * Comments (ignored): # and //
 * Default time unit for all durations: **minutes**.
 * Costs: USD per resource-hour (Halpin teaching tradition).
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

export const GENERAL_TEMPLATE = `Resource1: Task1 → Task2 → Task3 → …
Resource2: Task1

n Resource1 = <count>, n Resource2 = <count>
production = <amount> <unit>

# Hourly costs in USD (optional; enables total cost & unit cost)
Cost USD/h:
Resource1: <rate>
Resource2: <rate>

# Sensitivity (optional): vary counts from low..high step 1
Sensitivity:
Resource1: <low>..<high>
Resource2: <low>..<high>

Durations:   # default unit = minutes
Task1: <dist> <params…>
Task2: <dist> <params…>

# lines starting with # or // are notes (ignored)`;

export const DEFAULT_EXAMPLE_PROMPT = `# Default example (earthmoving) — replace with your operation
# Durations in minutes. Costs in USD per hour. Seed default = 12345.

Trucks: Load → Haul → Dump → Return
Loader: Load
5 trucks, 1 loader, 12 m3

Cost USD/h:
Trucks: 85
Loader: 120

Sensitivity:
Trucks: 2..8
Loader: 1..2

Durations:
Load: tri 1.5, 2, 3
Haul: normal 8, 1.5
Dump: const 1.2
Return: lognormal 7, 1.5`;

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

Notes (not commands): # ...  or  // ...
Run: max cycles & seed (default seed 12345) under the diagram.`;

export const PRODUCT_TAGLINE = "AI-agent of Daniel W. Halpin's CYCLONE";
