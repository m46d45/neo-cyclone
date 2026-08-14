/**
 * Durable public tally when DATABASE_URL is not set.
 * Abacus is a free counting API (no auth). Prefer Neon for a self-owned store.
 */
const ABACUS = "https://abacus.jasoncameron.dev";
const NS = "neocyclone-studio";

export const ABACUS_KEYS = {
  simulate: "simulations",
  draw: "models",
  visitor: "visitors",
} as const;

async function abacusJson(path: string): Promise<{ value?: number }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 4000);
  try {
    const r = await fetch(`${ABACUS}${path}`, {
      cache: "no-store",
      signal: ctrl.signal,
    });
    return (await r.json()) as { value?: number };
  } catch {
    return {};
  } finally {
    clearTimeout(t);
  }
}

export async function abacusGet(key: string): Promise<number> {
  const j = await abacusJson(`/get/${NS}/${key}`);
  return typeof j.value === "number" && Number.isFinite(j.value) ? j.value : 0;
}

export async function abacusHit(key: string): Promise<number> {
  const j = await abacusJson(`/hit/${NS}/${key}`);
  return typeof j.value === "number" && Number.isFinite(j.value) ? j.value : 0;
}
