import type { DurationDist } from "./types";

/**
 * Duration prompt format → DurationDist.
 *
 * Distributions:
 *   constant   | const | c     → value
 *   uniform    | unif  | u     → min, max
 *   triangular | tri   | t     → min, mode, max
 *   normal     | norm  | n     → mean, sd
 *   lognormal  | logn  | ln    → mean, sd   (of the duration)
 *   beta       | b             → min, max, alpha, beta
 *   pert | beta-pert | betapert → a, m, b  (optimistic, most likely, pessimistic)
 *                                 → classic PERT-beta on [a,b] (stored as kind "beta")
 *   gamma      | g             → shape, scale
 *                              or mean, sd  (method-of-moments → shape, scale)
 *
 * Examples:
 *   Load: tri 1.5, 2, 3
 *   Haul: normal 8, 1.5
 *   Wait: beta 1, 5, 2, 5
 *   Pour: pert 4, 6, 10
 *   Cure: gamma 4, 1.2
 *   Dump: const 1.2
 */

type Kind =
  | "constant"
  | "uniform"
  | "triangular"
  | "normal"
  | "lognormal"
  | "beta"
  | "pert"
  | "gamma";

export function parseDurationToken(raw: string): DurationDist | null {
  const s = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (!s) return null;

  const kindFirst = s.match(
    /^(constant|const|c|uniform|unif|u|triangular|tri|t|normal|norm|n|lognormal|lognorm|logn|ln|beta-pert|betapert|pert|beta|b|gamma|gam|g)\s*[\s(:]?\s*(.+?)\)?\s*$/i,
  );
  if (kindFirst) {
    const kind = normalizeKind(kindFirst[1]!);
    const nums = parseNums(kindFirst[2]!);
    return fromKindAndNums(kind, nums);
  }

  const nums = parseNums(s);
  if (!nums.length) return null;
  if (nums.length === 1) return { kind: "constant", value: nums[0]! };
  if (nums.length === 2) return { kind: "uniform", min: nums[0]!, max: nums[1]! };
  if (nums.length >= 3) {
    return {
      kind: "triangular",
      min: nums[0]!,
      mode: nums[1]!,
      max: nums[2]!,
    };
  }
  return null;
}

function normalizeKind(k: string): Kind {
  const x = k.toLowerCase();
  if (x === "c" || x === "const" || x === "constant") return "constant";
  if (x === "u" || x === "unif" || x === "uniform") return "uniform";
  if (x === "t" || x === "tri" || x === "triangular") return "triangular";
  if (x === "n" || x === "norm" || x === "normal") return "normal";
  if (x === "ln" || x === "logn" || x === "lognorm" || x === "lognormal") return "lognormal";
  // pert / beta-pert before plain "beta" / "b"
  if (x === "pert" || x === "beta-pert" || x === "betapert") return "pert";
  if (x === "b" || x === "beta") return "beta";
  if (x === "g" || x === "gam" || x === "gamma") return "gamma";
  return "triangular";
}

/**
 * Classic PERT → Beta(α,β) on [a,b].
 * μ = (a + 4m + b) / 6,  σ = (b − a) / 6  (method of moments).
 */
export function pertToBeta(a: number, m: number, b: number): DurationDist {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  const mode = Math.min(max, Math.max(min, m));
  if (max - min < 1e-12) {
    return { kind: "constant", value: min };
  }
  const mu = (min + 4 * mode + max) / 6;
  const sigma = (max - min) / 6;
  const var_ = sigma * sigma;
  const range = max - min;
  // MoM for Beta on [min, max]
  const t = (mu - min) / range; // mean in unit interval
  const tClamped = Math.min(1 - 1e-9, Math.max(1e-9, t));
  const factor = (tClamped * (1 - tClamped)) / (var_ / (range * range)) - 1;
  let alpha = Math.max(1e-9, tClamped * factor);
  let beta = Math.max(1e-9, (1 - tClamped) * factor);
  // Fallback if numerical issue (flat / extreme mode)
  if (!Number.isFinite(alpha) || !Number.isFinite(beta) || factor <= 0) {
    alpha = 1 + (4 * (mode - min)) / range;
    beta = 1 + (4 * (max - mode)) / range;
  }
  return {
    kind: "beta",
    min,
    max,
    alpha: Math.max(1e-9, alpha),
    beta: Math.max(1e-9, beta),
  };
}

function parseNums(s: string): number[] {
  const parts = s.split(/[,;/|\s]+/).map((p) => p.trim()).filter(Boolean);
  const nums: number[] = [];
  for (const p of parts) {
    const m = p.match(/^-?\d+(?:\.\d+)?/);
    if (m) nums.push(Number(m[0]));
  }
  if (nums.length < 2) {
    const range = s.match(/(-?\d+(?:\.\d+)?)\s*[-–to]+\s*(-?\d+(?:\.\d+)?)/i);
    if (range) return [Number(range[1]), Number(range[2])];
  }
  return nums;
}

function fromKindAndNums(kind: Kind, nums: number[]): DurationDist | null {
  switch (kind) {
    case "constant":
      if (!nums.length) return null;
      return { kind: "constant", value: Math.max(0, nums[0]!) };
    case "uniform": {
      if (nums.length < 2) {
        if (nums.length === 1) return { kind: "constant", value: nums[0]! };
        return null;
      }
      return {
        kind: "uniform",
        min: Math.min(nums[0]!, nums[1]!),
        max: Math.max(nums[0]!, nums[1]!),
      };
    }
    case "triangular": {
      if (nums.length >= 3) {
        const a = nums[0]!;
        const b = nums[1]!;
        const c = nums[2]!;
        const min = Math.min(a, c);
        const max = Math.max(a, c);
        const mode = Math.min(max, Math.max(min, b));
        return { kind: "triangular", min, mode, max };
      }
      if (nums.length === 2) {
        const min = Math.min(nums[0]!, nums[1]!);
        const max = Math.max(nums[0]!, nums[1]!);
        return { kind: "triangular", min, mode: (min + max) / 2, max };
      }
      if (nums.length === 1) return { kind: "constant", value: nums[0]! };
      return null;
    }
    case "normal": {
      if (nums.length < 1) return null;
      return {
        kind: "normal",
        mean: nums[0]!,
        sd: Math.max(0, nums[1] ?? 0),
      };
    }
    case "lognormal": {
      if (nums.length < 1) return null;
      return {
        kind: "lognormal",
        mean: Math.max(1e-9, nums[0]!),
        sd: Math.max(0, nums[1] ?? 0),
      };
    }
    case "beta": {
      // min, max, alpha, beta
      if (nums.length >= 4) {
        return {
          kind: "beta",
          min: nums[0]!,
          max: nums[1]!,
          alpha: Math.max(1e-9, nums[2]!),
          beta: Math.max(1e-9, nums[3]!),
        };
      }
      // 3 nums → treat as PERT a,m,b (field-friendly alias)
      if (nums.length === 3) {
        return pertToBeta(nums[0]!, nums[1]!, nums[2]!);
      }
      // alpha, beta on [0,1] then user forgot min max — default 0..1
      if (nums.length >= 2) {
        return {
          kind: "beta",
          min: 0,
          max: 1,
          alpha: Math.max(1e-9, nums[0]!),
          beta: Math.max(1e-9, nums[1]!),
        };
      }
      return null;
    }
    case "pert": {
      // a, m, b (optimistic, most likely, pessimistic)
      if (nums.length >= 3) {
        return pertToBeta(nums[0]!, nums[1]!, nums[2]!);
      }
      if (nums.length === 2) {
        // a, b → mode midpoint
        return pertToBeta(nums[0]!, (nums[0]! + nums[1]!) / 2, nums[1]!);
      }
      if (nums.length === 1) return { kind: "constant", value: Math.max(0, nums[0]!) };
      return null;
    }
    case "gamma": {
      // shape, scale
      if (nums.length >= 2) {
        return {
          kind: "gamma",
          shape: Math.max(1e-9, nums[0]!),
          scale: Math.max(0, nums[1]!),
        };
      }
      if (nums.length === 1) {
        return { kind: "gamma", shape: Math.max(1e-9, nums[0]!), scale: 1 };
      }
      return null;
    }
  }
}

/** Parse gamma from "gamma mean 8 sd 2" style in free text tokens */
export function parseGammaMeanSd(mean: number, sd: number): DurationDist | null {
  if (mean <= 0 || sd < 0) return null;
  if (sd === 0) return { kind: "constant", value: mean };
  const shape = (mean / sd) * (mean / sd);
  const scale = (sd * sd) / mean;
  return { kind: "gamma", shape, scale };
}

export function parseDurationBlock(text: string): Record<string, DurationDist> {
  const out: Record<string, DurationDist> = {};
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);

  let inBlock = false;
  for (const line of lines) {
    if (/^durations?\s*:?\s*$/i.test(line) || /^durasi\s*:?\s*$/i.test(line)) {
      inBlock = true;
      continue;
    }

    // gamma mean X sd Y for Task
    const gms = line.match(
      /^([A-Za-z][A-Za-z0-9 \/_-]{0,32}?)\s*:\s*gamma\s+mean\s+(\d+(?:\.\d+)?)\s+sd\s+(\d+(?:\.\d+)?)/i,
    );
    if (gms) {
      const d = parseGammaMeanSd(Number(gms[2]), Number(gms[3]));
      if (d) out[norm(gms[1]!)] = d;
      continue;
    }

    if (/\u2192|->|=>/.test(line) && !/\(.*\d/.test(line)) {
      if (
        !/:\s*(const|tri|unif|normal|norm|logn|beta-pert|betapert|pert|beta|gamma|constant|uniform|triangular)/i.test(
          line,
        )
      ) {
        continue;
      }
    }

    const m = line.match(/^(?:[-\u2022*]\s*)?([A-Za-z][A-Za-z0-9 \/_-]{0,32}?)\s*:\s*(.+)$/);
    if (!m) continue;
    const task = m[1]!.trim();
    if (/^\d/.test(task)) continue;
    if (
      /^(trucks|loader|crew|pump|resources?|seed|time|max)/i.test(task) &&
      !inBlock &&
      !looksLikeDuration(m[2]!)
    ) {
      continue;
    }
    const dist = parseDurationToken(m[2]!);
    if (dist) out[norm(task)] = dist;
  }

  const oneLine = text.match(/durations?\s*:\s*([^\n]+)/i);
  if (oneLine) {
    const chunks = oneLine[1]!.split(/[;|]/).map((c) => c.trim()).filter(Boolean);
    for (const ch of chunks) {
      const m = ch.match(/^([A-Za-z][A-Za-z0-9 \/_-]*)\s*[=:]\s*(.+)$/);
      if (!m) continue;
      const dist = parseDurationToken(m[2]!);
      if (dist) out[norm(m[1]!)] = dist;
    }
  }

  return out;
}

function looksLikeDuration(rhs: string): boolean {
  return /const|tri|unif|normal|norm|logn|beta|pert|gamma|constant|uniform|triangular|\d/.test(
    rhs,
  );
}

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function parseStepsWithInlineDurations(stepChunk: string): {
  labels: string[];
  durations: Record<string, DurationDist>;
} {
  const parts = stepChunk
    .split(/\s*(?:\u2192|-->|->|=>|\u2014)\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  const labels: string[] = [];
  const durations: Record<string, DurationDist> = {};

  for (const part of parts) {
    const m = part.match(/^(.+?)\s*[\(\[]\s*(.+?)\s*[\)\]]\s*$/);
    if (m) {
      const label = m[1]!.trim();
      const dist = parseDurationToken(m[2]!);
      labels.push(label);
      if (dist) durations[norm(label)] = dist;
    } else {
      labels.push(part.replace(/\s*[\(\[].*$/, "").trim());
    }
  }

  return {
    labels: labels.filter((l) => l.length > 0 && l.length < 40).slice(0, 12),
    durations,
  };
}

export function formatDuration(d: DurationDist): string {
  switch (d.kind) {
    case "constant":
      return `const ${d.value}`;
    case "uniform":
      return `unif ${d.min}\u2013${d.max}`;
    case "triangular":
      return `tri ${d.min}, ${d.mode}, ${d.max}`;
    case "normal":
      return `normal \u03bc=${d.mean}, \u03c3=${d.sd}`;
    case "lognormal":
      return `lognormal mean=${d.mean}, sd=${d.sd}`;
    case "beta":
      return `beta [${d.min},${d.max}] \u03b1=${d.alpha}, \u03b2=${d.beta}`;
    case "gamma":
      return `gamma shape=${d.shape}, scale=${d.scale}`;
    default:
      return "\u2014";
  }
}

export function formatDurationMap(
  map: Record<string, DurationDist>,
  labels?: string[],
): string {
  const keys = labels?.map((l) => norm(l)) ?? Object.keys(map);
  const lines: string[] = [];
  for (const k of keys) {
    const d = map[k] ?? map[norm(k)];
    if (!d) continue;
    const label = labels?.find((l) => norm(l) === k) ?? k;
    lines.push(`${label}: ${formatDuration(d)}`);
  }
  return lines.join("\n");
}
