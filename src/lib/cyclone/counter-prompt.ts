/**
 * Where COUNTER(s) sit: each counts production when a unit passes.
 *
 * Prompt (one or many):
 *   Counter after: Dump
 *   Counter after: LiftAtA, LiftAtB, LiftAtC
 *   Count at: Pour
 *   production = 12 m3
 *
 * Multiple counters = multi-demand / multi-product teaching (e.g. crane lifts
 * at three zones each credit +1). Default if omitted: after the **last task**
 * of the **first** resource cycle.
 */

export type CounterPlacement = {
  /** Task label after which this COUNTER is inserted (exact label match). */
  afterLabel: string | null;
  /** Units credited per counter hit. */
  amount: number;
  /** Production unit string (m³, load, lift, …). */
  unit: string;
};

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function normalizeUnit(u: string): string {
  const s = u.trim();
  if (/^m3$|^m³$|^m\^3$|cubic/i.test(s)) return "m³";
  if (/^m2$|^m²$/i.test(s)) return "m²";
  return s;
}

function parseProductionAmount(text: string): { amount: number; unit: string } {
  let amount = 1;
  let unit = "unit";
  const prodEq = text.match(
    /production\s*[=:]\s*(\d+(?:\.\d+)?)\s*([A-Za-zµμ³3\/\-]{0,16})?/i,
  );
  if (prodEq) {
    amount = Math.max(0.001, Number(prodEq[1]));
    if (prodEq[2]?.trim()) unit = normalizeUnit(prodEq[2].trim());
  } else {
    const loose = text.match(
      /(\d+(?:\.\d+)?)\s*(m3|m³|m\^3|ton|m2|m²|load|loads|pour|kit|unit|units|course|panel|lift)\b/i,
    );
    if (loose) {
      amount = Math.max(0.001, Number(loose[1]));
      unit = normalizeUnit(loose[2]!);
    }
  }
  const unitOnly = text.match(/production\s*unit\s*[=:]\s*([A-Za-zµμ³30-9\/\-]{1,16})/i);
  if (unitOnly) unit = normalizeUnit(unitOnly[1]!);
  return { amount, unit };
}

/**
 * Parse all counter placements. Supports:
 *   Counter after: A
 *   Counter after: A, B, C
 *   multiple Counter after: lines
 */
export function parseCounterPlacements(text: string): CounterPlacement[] {
  const { amount, unit } = parseProductionAmount(text);
  const labels: string[] = [];
  const re =
    /(?:counter\s+after|count\s+at|production\s+after|count\s+after)\s*:\s*([^\n#]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const parts = m[1]!
      .split(/[,;|]/)
      .map((s) => s.trim())
      .filter((s) => /^[A-Za-z][A-Za-z0-9 _/-]{0,40}$/.test(s));
    for (const p of parts) {
      if (!labels.some((x) => norm(x) === norm(p))) labels.push(p);
    }
  }
  if (labels.length === 0) {
    return [{ afterLabel: null, amount, unit }];
  }
  return labels.map((afterLabel) => ({ afterLabel, amount, unit }));
}

/** @deprecated use parseCounterPlacements — first placement only */
export function parseCounterPlacement(text: string): CounterPlacement {
  return parseCounterPlacements(text)[0]!;
}

export function resolveCounterAfter(
  placement: CounterPlacement,
  productionItinerary: string[],
): string | null {
  if (!productionItinerary.length) return null;
  if (placement.afterLabel) {
    const want = norm(placement.afterLabel);
    const hit = productionItinerary.find((lab) => norm(lab) === want);
    if (hit) return hit;
    return null;
  }
  return productionItinerary[productionItinerary.length - 1]!;
}
