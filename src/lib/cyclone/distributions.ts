import type { DurationDist } from "./types";

/** Mulberry32 PRNG */
export function createRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box–Muller → standard normal */
function randn(rng: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Gamma(shape k, scale θ) — Marsaglia & Tsang for k≥1; boost for k<1 */
function sampleGamma(shape: number, scale: number, rng: () => number): number {
  const k = Math.max(1e-9, shape);
  const theta = Math.max(0, scale);
  if (theta === 0) return 0;

  if (k < 1) {
    // Johnk / boost: Gamma(k) = Gamma(k+1) * U^(1/k)
    const g = sampleGamma(k + 1, 1, rng);
    let u = rng();
    while (u === 0) u = rng();
    return g * Math.pow(u, 1 / k) * theta;
  }

  const d = k - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x: number;
    let v: number;
    do {
      x = randn(rng);
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = rng();
    if (u < 1 - 0.0331 * (x * x) * (x * x)) return d * v * theta;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v * theta;
  }
}

/** Beta(α,β) on (0,1) via gamma ratio */
function sampleBeta(alpha: number, beta: number, rng: () => number): number {
  const a = Math.max(1e-9, alpha);
  const b = Math.max(1e-9, beta);
  const x = sampleGamma(a, 1, rng);
  const y = sampleGamma(b, 1, rng);
  const s = x + y;
  if (s <= 0) return 0.5;
  return x / s;
}

/** Lognormal parameterized by mean & sd of the **duration** (not of ln X) */
function sampleLognormalMeanSd(mean: number, sd: number, rng: () => number): number {
  const m = Math.max(1e-12, mean);
  const s = Math.max(0, sd);
  if (s === 0) return m;
  const v = (s / m) * (s / m);
  const sigma = Math.sqrt(Math.log(1 + v));
  const mu = Math.log(m) - 0.5 * sigma * sigma;
  return Math.exp(mu + sigma * randn(rng));
}

export function sampleDuration(dist: DurationDist | undefined, rng: () => number): number {
  if (!dist) return 0;
  let t = 0;
  switch (dist.kind) {
    case "constant":
      t = dist.value;
      break;
    case "uniform": {
      const a = Math.min(dist.min, dist.max);
      const b = Math.max(dist.min, dist.max);
      t = a + rng() * (b - a);
      break;
    }
    case "triangular": {
      const a = dist.min;
      const c = dist.mode;
      const b = dist.max;
      const u = rng();
      const span = b - a || 1;
      const fc = (c - a) / span;
      if (u < fc) t = a + Math.sqrt(u * span * (c - a));
      else t = b - Math.sqrt((1 - u) * span * (b - c));
      break;
    }
    case "normal":
      t = dist.mean + dist.sd * randn(rng);
      break;
    case "lognormal":
      t = sampleLognormalMeanSd(dist.mean, dist.sd, rng);
      break;
    case "beta": {
      const lo = Math.min(dist.min, dist.max);
      const hi = Math.max(dist.min, dist.max);
      const u = sampleBeta(dist.alpha, dist.beta, rng);
      t = lo + u * (hi - lo);
      break;
    }
    case "gamma":
      t = sampleGamma(dist.shape, dist.scale, rng);
      break;
    default:
      t = 0;
  }
  return Math.max(0, t);
}
