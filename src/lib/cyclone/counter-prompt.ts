/**
 * Where the COUNTER sits: counts one completed production unit / cycle.
 *
 * Prompt (optional, recommended):
 *   Counter after: Dump
 *   Count at: Dump
 *   production = 12 m3
 *
 * Default if omitted: after the **last task** of the **first** resource cycle
 * (production resource). Always documented so it does not "vanish" silently.
 */

export type CounterPlacement = {
  /** Task label after which COUNTER is inserted (normalized match). */
  afterLabel: string | null;
  /** Units credited per counter hit. */
  amount: number;
  /** Production unit string (m³, load, kit, …). */
  unit: string;
};

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function parseCounterPlacement(text: string): CounterPlacement {
  let afterLabel: string | null = null;
  let amount = 1;
  let unit = "unit";

  // Counter after: Dump   |   Count at: Dump   |   Production after: Dump
  const afterRe =
    /(?:counter\s+after|count\s+at|production\s+after|count\s+after)\s*:\s*([A-Za-z][A-Za-z0-9 _/-]{0,40})/i;
  const mAfter = text.match(afterRe);
  if (mAfter) afterLabel = mAfter[1]!.trim();

  // production = 12 m3   |   production: 12 m³
  const prodEq = text.match(
    /production\s*[=:]\s*(\d+(?:\.\d+)?)\s*([A-Za-zµμ³3\/\-]{0,16})?/i,
  );
  if (prodEq) {
    amount = Math.max(0.001, Number(prodEq[1]));
    if (prodEq[2]?.trim()) unit = normalizeUnit(prodEq[2].trim());
  } else {
    // trailing "12 m3" on a counts line
    const loose = text.match(/(\d+(?:\.\d+)?)\s*(m3|m³|m\^3|ton|m2|m²|load|loads|pour|kit|unit|units|course|panel|lift)\b/i);
    if (loose) {
      amount = Math.max(0.001, Number(loose[1]));
      unit = normalizeUnit(loose[2]!);
    }
  }

  // production unit only: production unit = m3
  const unitOnly = text.match(/production\s*unit\s*[=:]\s*([A-Za-zµμ³30-9\/\-]{1,16})/i);
  if (unitOnly) unit = normalizeUnit(unitOnly[1]!);

  return { afterLabel, amount, unit };
}

function normalizeUnit(u: string): string {
  const s = u.trim();
  if (/^m3$|^m³$|^m\^3$|cubic/i.test(s)) return "m³";
  if (/^m2$|^m²$/i.test(s)) return "m²";
  return s;
}

export function resolveCounterAfter(
  placement: CounterPlacement,
  productionItinerary: string[],
): string | null {
  if (!productionItinerary.length) return null;
  if (placement.afterLabel) {
    const want = norm(placement.afterLabel);
    // Exact match only — "Pave" must not match "DumpToPaver"
    const hit = productionItinerary.find((lab) => norm(lab) === want);
    if (hit) return hit;
    // Label not on this itinerary (e.g. count on another resource) → null
    return null;
  }
  // Default: last task of the production (first) resource cycle
  return productionItinerary[productionItinerary.length - 1]!;
}
