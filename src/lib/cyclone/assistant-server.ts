import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { checkAiRateLimit, clientKeyFromHeaders } from "./ai-rate-limit";

export type AssistantRequest = {
  message: string;
  prompt: string;
  context: string;
  history?: { role: "user" | "assistant"; text: string }[];
};

export type AssistantResponse = {
  ok: boolean;
  reply: string;
  proposedPrompt: string | null;
  suggestSimulate: boolean;
  source: "ai" | "local" | "none";
  error: string | null;
};

const SYSTEM = `You are the Neo-CYCLONE AI Assistant — educational co-pilot for Halpin CYCLONE simulation.
Product: AI-Assisted Construction Operation Simulation (international, English-first).
LANGUAGE: Prefer English. If the user clearly writes in another language, you may reply in that language; otherwise use English. Keep task/resource names as in CONTEXT.
RULES:
1. Ground answers in CONTEXT (especially last-run idleness for bottleneck questions).
2. For edits, return FULL Format Prompt in proposedPrompt.
3. Do not invent a different operation.
4. COMBI only if >=2 resources.
5. suggestSimulate=true after prompt changes.
RESPONSE — ONLY JSON:
{"reply":"...","proposedPrompt":null,"suggestSimulate":false}`;

export const chatAssistant = createServerFn({ method: "POST" })
  .validator((input: AssistantRequest) => ({
    message: String(input?.message ?? "").slice(0, 4000),
    prompt: String(input?.prompt ?? "").slice(0, 12000),
    context: String(input?.context ?? "").slice(0, 14000),
    history: Array.isArray(input?.history) ? input.history.slice(-8) : [],
  }))
  .handler(async ({ data }): Promise<AssistantResponse> => {
    const message = data.message.trim();
    if (!message) {
      return {
        ok: false,
        reply: "Please type a question or change request.",
        proposedPrompt: null,
        suggestSimulate: false,
        source: "none",
        error: "empty",
      };
    }

    let clientKey = "anon";
    try {
      const req = getRequest();
      clientKey = clientKeyFromHeaders(req?.headers ?? null);
    } catch {
      clientKey = "anon";
    }
    const rl = checkAiRateLimit(`assistant:${clientKey}`, { max: 30, windowMs: 60 * 60 * 1000 });
    if (!rl.allowed) {
      return {
        ok: false,
        reply: `Rate limit reached for AI Assistant (30 requests / hour). Try again in about ${rl.retryAfterSec}s.`,
        proposedPrompt: null,
        suggestSimulate: false,
        source: "none",
        error: "rate_limited",
      };
    }

    const context = data.context || "(no studio context)";
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return localAssistant(message, data.prompt, context);
    }

    try {
      const historyMsgs = (data.history ?? []).map((h) => ({
        role: h.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: h.text.slice(0, 2000),
      }));

      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 3200,
          temperature: 0.3,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: `CONTEXT:\n${context}\n\nUSER:\n${message}` },
            ...historyMsgs.slice(0, 6),
          ],
        }),
      });

      if (!res.ok) {
        const local = localAssistant(message, data.prompt, context);
        local.error = `xAI API ${res.status}`;
        return local;
      }

      const body = (await res.json()) as { choices: { message: { content: string } }[] };
      const raw = body.choices[0]?.message?.content ?? "";
      const parsed = parseAssistantJson(raw);
      if (parsed) {
        return {
          ok: true,
          reply: parsed.reply || "Done.",
          proposedPrompt: parsed.proposedPrompt,
          suggestSimulate: Boolean(parsed.suggestSimulate),
          source: "ai",
          error: null,
        };
      }
      return {
        ok: true,
        reply: stripFences(raw).slice(0, 8000) || "No response.",
        proposedPrompt: null,
        suggestSimulate: false,
        source: "ai",
        error: null,
      };
    } catch (e) {
      const local = localAssistant(message, data.prompt, context);
      local.error = e instanceof Error ? e.message : "request failed";
      return local;
    }
  });

function parseAssistantJson(raw: string): {
  reply: string;
  proposedPrompt: string | null;
  suggestSimulate: boolean;
} | null {
  const text = stripFences(raw);
  try {
    const j = JSON.parse(text) as {
      reply?: string;
      proposedPrompt?: string | null;
      suggestSimulate?: boolean;
    };
    return {
      reply: String(j.reply ?? ""),
      proposedPrompt:
        typeof j.proposedPrompt === "string" && j.proposedPrompt.trim()
          ? j.proposedPrompt
          : null,
      suggestSimulate: Boolean(j.suggestSimulate),
    };
  } catch {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try {
      const j = JSON.parse(m[0]) as {
        reply?: string;
        proposedPrompt?: string | null;
        suggestSimulate?: boolean;
      };
      return {
        reply: String(j.reply ?? ""),
        proposedPrompt:
          typeof j.proposedPrompt === "string" && j.proposedPrompt.trim()
            ? j.proposedPrompt
            : null,
        suggestSimulate: Boolean(j.suggestSimulate),
      };
    } catch {
      return null;
    }
  }
}

function stripFences(text: string): string {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fence?.[1] ?? text).trim();
}

function extractFleetCounts(prompt: string): { n: string; name: string }[] {
  const out: { n: string; name: string }[] = [];
  const seen = new Set<string>();
  for (const m of prompt.matchAll(
    /(\d+)\s+(trucks?|loaders?|cranes?|helpers?|masons?|excavators?|pavers?|crew|crews|forms?|buckets?)\b/gi,
  )) {
    const name = m[2]!.trim();
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ n: m[1]!, name });
  }
  return out.slice(0, 12);
}

function parseIdleFromContext(context: string): { resourceLabel: string; idlePct: number; busyPct: number; n: number }[] {
  const out: { resourceLabel: string; idlePct: number; busyPct: number; n: number }[] = [];
  for (const m of context.matchAll(
    /idle\s+([^:]+):\s*idlePct=([\d.]+)\s+busyPct=([\d.]+)\s+n=(\d+)/gi,
  )) {
    out.push({
      resourceLabel: m[1]!.trim(),
      idlePct: Number(m[2]),
      busyPct: Number(m[3]),
      n: Number(m[4]),
    });
  }
  return out;
}

function hasSimResults(context: string): boolean {
  return /cyclesCompleted:\s*\d+/i.test(context) && !/\(none — user has not simulated yet\)/i.test(context);
}

function parseProductivityHint(context: string): string {
  const uph = context.match(/last unitsPerHour:\s*([\d.]+)/i);
  const cycles = context.match(/cyclesCompleted:\s*(\d+)/i);
  const unitCost = context.match(/unitCostUsd=([\d.]+)/i);
  const bits: string[] = [];
  if (cycles) bits.push(`${cycles[1]} cycles`);
  if (uph) bits.push(`units/hour ≈ ${Number(uph[1]).toFixed(3)}`);
  if (unitCost) bits.push(`unit cost ≈ ${Number(unitCost[1]).toFixed(4)} USD`);
  return bits.join(", ");
}

function localAssistant(message: string, prompt: string, context: string): AssistantResponse {
  const q = message.toLowerCase();
  let reply = "";
  let proposedPrompt: string | null = null;
  let suggestSimulate = false;

  const asksBottleneck =
    /bottleneck|most (problem|critical|idle|busy)|which resource|waste|highest idle/i.test(q);

  if (asksBottleneck) {
    const idleStats = parseIdleFromContext(context);
    if (idleStats.length) {
      const sorted = [...idleStats].sort((a, b) => b.idlePct - a.idlePct);
      const worst = sorted[0]!;
      reply =
        "From the last run, home-QUEUE idleness (waste):\n" +
        sorted
          .map((r) => `• **${r.resourceLabel}**: idle ${r.idlePct.toFixed(1)}% · busy ${r.busyPct.toFixed(1)}% (n=${r.n})`)
          .join("\n") +
        `\n\n**Highest idle (waste):** ${worst.resourceLabel} (${worst.idlePct.toFixed(1)}% idle).`;
    } else {
      reply = "Run **Simulate** first so idleness data exists, then ask again about the bottleneck resource.";
    }
  }

  if (/how many|fleet|jumlah|berapa/.test(q) && prompt) {
    const counts = extractFleetCounts(prompt);
    if (counts.length) {
      reply += (reply ? "\n\n" : "") + "Fleet counts in Format Prompt:\n" + counts.map((c) => `• ${c.n} × ${c.name}`).join("\n");
    }
  }

  if (/explain|summary|describe|jelaskan|model/.test(q)) {
    const lines = prompt.trim() ? prompt.trim().split(/\n/).length : 0;
    reply += (reply ? "\n\n" : "") + `Summary: prompt ${lines ? lines + " lines" : "empty"}.` + (hasSimResults(context) ? " Last run available in context." : " Not simulated yet.");
  }

  if (/productiv|produktiv|units per|steady|hasil/.test(q)) {
    if (hasSimResults(context)) {
      const hint = parseProductivityHint(context);
      reply += (reply ? "\n\n" : "") + (hint ? `Last run: ${hint}.` : "Last run metrics are in studio context.");
    } else {
      reply += (reply ? "\n\n" : "") + "No results yet. Draw Model, then Simulate.";
    }
  }

  if (!asksBottleneck && /idle|waste|util|busy/.test(q)) {
    const idleStats = parseIdleFromContext(context);
    if (idleStats.length) {
      reply +=
        (reply ? "\n\n" : "") +
        "Resource idleness (home QUEUE waste):\n" +
        idleStats.map((r) => `• ${r.resourceLabel}: idle ${r.idlePct.toFixed(1)}% / busy ${r.busyPct.toFixed(1)}%`).join("\n");
    }
  }

  const setMatch =
    message.match(/(?:set|change|make)\s+(\w+)\s+(?:to|=)?\s*(\d+)/i) ||
    message.match(/(\d+)\s+(trucks?|loaders?|cranes?|helpers?|masons?)/i);
  if (setMatch && prompt) {
    let n: string;
    let name: string;
    if (/^\d+$/.test(setMatch[1]!) && setMatch[2]) {
      n = setMatch[1]!;
      name = setMatch[2]!;
    } else {
      name = setMatch[1]!;
      n = setMatch[2]!;
    }
    const re = new RegExp(`(\\d+)(\\s+)(${escapeRe(name)}s?)\\b`, "i");
    if (re.test(prompt)) {
      proposedPrompt = prompt.replace(re, `${n}$2$3`);
      reply += (reply ? "\n\n" : "") + `I can set **${name}** to **${n}**. Click **Apply prompt**, then Draw Model + Simulate.`;
      suggestSimulate = true;
    }
  }

  if (/help|keyword|command/.test(q)) {
    reply +=
      (reply ? "\n\n" : "") +
      "Examples: Explain this model · How many trucks? · Which resource is the bottleneck? · What was productivity? · Set trucks to 8.";
  }

  if (!reply) {
    reply =
      "Local mode (no XAI_API_KEY). Try: Explain this model / How many trucks? / Bottleneck resource? / Productivity / Set trucks to 8.\n\n" +
      context.slice(0, 800);
  }

  return { ok: true, reply, proposedPrompt, suggestSimulate, source: "local", error: null };
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
