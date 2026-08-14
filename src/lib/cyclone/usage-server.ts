import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { dbSource, getSql } from "@/lib/db";
import { checkAiRateLimit, clientKeyFromHeaders } from "./ai-rate-limit";
import { ABACUS_KEYS, abacusGet, abacusHit } from "./usage-abacus";

export type UsageKind = "draw" | "simulate";

export type UsageStats = {
  ok: boolean;
  persistent: boolean;
  simulations: number;
  models: number;
  visitors: number;
};

function visitorFromClientKey(key: string): string {
  let h = 2166136261;
  const s = `neo-cyclone-usage:${key}`;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function requestVisitor(): string {
  try {
    const req = getRequest();
    return visitorFromClientKey(clientKeyFromHeaders(req?.headers ?? null));
  } catch {
    return visitorFromClientKey("anon");
  }
}

function emptyStats(): UsageStats {
  return {
    ok: false,
    persistent: false,
    simulations: 0,
    models: 0,
    visitors: 0,
  };
}

async function recordNeon(kind: UsageKind, visitor: string): Promise<boolean> {
  const sql = await getSql();
  await sql`
    insert into studio_usage (kind, visitor)
    values (${kind}, ${visitor})
  `;
  return true;
}

async function recordAbacus(kind: UsageKind, newVisitor: boolean): Promise<boolean> {
  const key = kind === "draw" ? ABACUS_KEYS.draw : ABACUS_KEYS.simulate;
  await abacusHit(key);
  if (newVisitor) await abacusHit(ABACUS_KEYS.visitor);
  return true;
}

async function statsNeon(): Promise<UsageStats> {
  const sql = await getSql();
  const rows = await sql<{
    simulations: number;
    models: number;
    visitors: number;
  }>`
    select
      coalesce(sum(case when kind = 'simulate' then 1 else 0 end), 0)::int as simulations,
      coalesce(sum(case when kind = 'draw' then 1 else 0 end), 0)::int as models,
      count(distinct visitor)::int as visitors
    from studio_usage
  `;
  const row = rows[0];
  return {
    ok: true,
    persistent: true,
    simulations: Number(row?.simulations ?? 0),
    models: Number(row?.models ?? 0),
    visitors: Number(row?.visitors ?? 0),
  };
}

async function statsAbacus(): Promise<UsageStats> {
  const [simulations, models, visitors] = await Promise.all([
    abacusGet(ABACUS_KEYS.simulate),
    abacusGet(ABACUS_KEYS.draw),
    abacusGet(ABACUS_KEYS.visitor),
  ]);
  return { ok: true, persistent: true, simulations, models, visitors };
}

export const recordUsage = createServerFn({ method: "POST" })
  .validator((input: { kind?: string; newVisitor?: boolean }) => {
    const kind: UsageKind | null =
      input?.kind === "draw" || input?.kind === "simulate" ? input.kind : null;
    return { kind, newVisitor: Boolean(input?.newVisitor) };
  })
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    if (!data.kind) return { ok: false };
    const kind = data.kind;
    const visitor = requestVisitor();
    const rl = checkAiRateLimit(`usage:${visitor}`, { max: 60, windowMs: 60 * 60 * 1000 });
    if (!rl.allowed) return { ok: false };
    try {
      if (dbSource === "neon") {
        await recordNeon(kind, visitor);
      } else {
        await recordAbacus(kind, data.newVisitor);
      }
      return { ok: true };
    } catch {
      return { ok: false };
    }
  });

export const getUsageStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<UsageStats> => {
    try {
      return dbSource === "neon" ? await statsNeon() : await statsAbacus();
    } catch {
      return emptyStats();
    }
  },
);
