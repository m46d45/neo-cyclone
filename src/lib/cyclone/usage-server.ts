import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { dbSource, getSql } from "@/lib/db";
import { checkAiRateLimit, clientKeyFromHeaders } from "./ai-rate-limit";

export type UsageKind = "draw" | "simulate";

export type UsageStats = {
  ok: boolean;
  persistent: boolean;
  simulations: number;
  models: number;
  visitors: number;
};

function visitorFromClientKey(key: string): string {
  // FNV-1a — no node:crypto so this module can be imported by the client stub.
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
    persistent: dbSource === "neon",
    simulations: 0,
    models: 0,
    visitors: 0,
  };
}

export const recordUsage = createServerFn({ method: "POST" })
  .validator((input: { kind?: string }) => {
    const kind = input?.kind === "draw" || input?.kind === "simulate" ? input.kind : null;
    return { kind };
  })
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    if (!data.kind) return { ok: false };
    const visitor = requestVisitor();
    const rl = checkAiRateLimit(`usage:${visitor}`, { max: 60, windowMs: 60 * 60 * 1000 });
    if (!rl.allowed) return { ok: false };
    try {
      const sql = await getSql();
      await sql`
        insert into studio_usage (kind, visitor)
        values (${data.kind}, ${visitor})
      `;
      return { ok: true };
    } catch {
      return { ok: false };
    }
  });

export const getUsageStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<UsageStats> => {
    try {
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
        persistent: dbSource === "neon",
        simulations: Number(row?.simulations ?? 0),
        models: Number(row?.models ?? 0),
        visitors: Number(row?.visitors ?? 0),
      };
    } catch {
      return emptyStats();
    }
  },
);
