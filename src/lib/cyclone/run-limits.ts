/** Hard cap on simulation cycles (Neo-CYCLONE product limit). */
export const MAX_CYCLES_LIMIT = 500;

/** Form / first-open default for Max cycles. */
export const DEFAULT_MAX_CYCLES = 100;

/**
 * Safety minutes reserved per requested cycle so the time stop does not
 * cut the productivity-by-cycle series short of the user's cycle target.
 * (Slow construction cycles rarely exceed ~1 h; 60 is a teaching safety margin.)
 */
export const MINUTES_PER_CYCLE_HORIZON = 60;

export function clampMaxCycles(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_MAX_CYCLES;
  return Math.min(MAX_CYCLES_LIMIT, Math.max(1, Math.floor(n)));
}

/** Ensure maxTime is long enough that maxCycles can actually complete. */
export function horizonForCycles(maxCycles: number, currentMaxTime: number): number {
  const need = clampMaxCycles(maxCycles) * MINUTES_PER_CYCLE_HORIZON;
  return Math.max(1, Math.max(currentMaxTime, need));
}
