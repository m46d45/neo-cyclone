/**
 * Lightweight in-memory rate limiter for AI server functions.
 * Per-isolate on serverless (not global across all Vercel instances) but
 * still blocks naive abuse from a single client / warm instance.
 */

type Bucket = { timestamps: number[] };

const globalRef = globalThis as typeof globalThis & {
  __neoCycloneAiBuckets__?: Map<string, Bucket>;
};

function buckets(): Map<string, Bucket> {
  globalRef.__neoCycloneAiBuckets__ ??= new Map();
  return globalRef.__neoCycloneAiBuckets__;
}

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterSec: number; remaining: 0 };

/** Default: 30 requests / 60 minutes per key (IP or anonymous). */
export function checkAiRateLimit(
  key: string,
  opts?: { max?: number; windowMs?: number },
): RateLimitResult {
  const max = opts?.max ?? 30;
  const windowMs = opts?.windowMs ?? 60 * 60 * 1000;
  const now = Date.now();
  const map = buckets();
  const b = map.get(key) ?? { timestamps: [] };
  b.timestamps = b.timestamps.filter((t) => now - t < windowMs);
  if (b.timestamps.length >= max) {
    const oldest = b.timestamps[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    map.set(key, b);
    return { allowed: false, retryAfterSec, remaining: 0 };
  }
  b.timestamps.push(now);
  map.set(key, b);
  return { allowed: true, remaining: Math.max(0, max - b.timestamps.length) };
}

/** Best-effort client key from request headers when available. */
export function clientKeyFromHeaders(headers?: Headers | null): string {
  if (!headers) return "anon";
  const xf = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (xf) return `ip:${xf}`;
  const real = headers.get("x-real-ip")?.trim();
  if (real) return `ip:${real}`;
  return "anon";
}
