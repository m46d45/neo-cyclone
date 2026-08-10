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

/** Hard cap for assistant replies (teaching UI). */
export const ASSISTANT_MAX_REPLY_LINES = 20;

const SYSTEM = `You are the Neo-CYCLONE AI Assistant — educational co-pilot for Halpin CYCLONE simulation.
Product: AI-Assisted Construction Operation Simulation (international, English-first).
LANGUAGE: Prefer English. If the user clearly writes in another language, you may reply in that language; otherwise use English. Keep task/resource names as in CONTEXT.
RULES:
1. Ground answers in CONTEXT (especially last-run idleness for bottleneck questions).
2. For edits, return FULL Format Prompt in proposedPrompt (not in reply body).
3. Do not invent a different operation.
4. COMBI only if >=2 resources.
5. suggestSimulate=true after prompt changes.
6. REPLY LENGTH: the "reply" field must be at most ${ASSISTANT_MAX_REPLY_LINES} short lines (prefer bullets). No long essays. No full prompt dump in reply.
RESPONSE — ONLY JSON:
{"reply":"...","proposedPrompt":null,"suggestSimulate":false}`;

export function clampAssistantReply(text: string, maxLines = ASSISTANT_MAX_REPLY_LINES): string {
  const normalized = String(text ?? "")
    .replace(/\r\n/g, "\n")
    .trim();
  if (!normalized) return normalized;
  const lines = normalized.split("\n");
  if (lines.length <= maxLines) return normalized;
  const kept = lines.slice(0, maxLines - 1);
  kept.push("… (truncated for brevity)");
  return kept.join("\n");
}

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
      return finalizeLocal(localAssistant(message, data.prompt, context));
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
          max_tokens: 900,
          temperature: 0.25,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: `CONTEXT:\n${context}\n\nUSER:\n${message}` },
            ...historyMsgs.slice(0, 6),
          ],
        }),
      });

      if (!res.ok) {
        const local = finalizeLocal(localAssistant(message, data.prompt, context));
        local.error = `xAI API ${res.status}`;
        return local;
      }

      const body = (await res.json()) as { choices: { message: { content: string } }[] };
      const raw = body.choices[0]?.message?.content ?? "";
      const parsed = parseAssistantJson(raw);
      if (parsed) {
        return {
          ok: true,
          reply: clampAssistantReply(parsed.reply || "Done."),
          proposedPrompt: parsed.proposedPrompt,
          suggestSimulate: Boolean(parsed.suggestSimulate),
          source: "ai",
          error: null,
        };
      }
      return {
        ok: true,
        reply: clampAssistantReply(stripFences(raw) || "No response."),
        proposedPrompt: null,
        suggestSimulate: false,
        source: "ai",
        error: null,
      };
    } catch (e) {
      const local = finalizeLocal(localAssistant(message, data.prompt, context));
      local.error = e instanceof Error ? e.message : "request failed";
      return local;
    }
  });

function finalizeLocal(r: AssistantResponse): AssistantResponse {
  return { ...r, reply: clampAssistantReply(r.reply) };
}

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

/** Compact model summary from CONTEXT network section (≤ ~12 bullets). */
function compactModelSummary(prompt: string, context: string): string {
  const out: string[] = [];
  const name = context.match(/model:\s*(.+)/i)?.[1]?.trim();
  if (name && name !== "unnamed") out.push(`Model: ${name}`);

  const combis = [...context.matchAll(/- COMBI:([^\n]+)/g)].map((m) => m[1]!.trim().split(" ")[0]!);
  const normals = [...context.matchAll(/- NORMAL:([^\n]+)/g)].map((m) => m[1]!.trim().split(" ")[0]!);
  const queues = [...context.matchAll(/- QUEUE:([^\n]+)/g)].map((m) => m[1]!.trim().split(" ")[0]!);
  const counters = [...context.matchAll(/- COUNTER:([^\n]+)/g)].map((m) => m[1]!.trim().split(" ")[0]!);

  const fleet = extractFleetCounts(prompt);
  if (fleet.length) {
    out.push("Fleet: " + fleet.map((c) => `${c.n}× ${c.name}`).join(", "));
  }
  if (queues.length) out.push(`Queues: ${queues.slice(0, 6).join(", ")}${queues.length > 6 ? "…" : ""}`);
  if (combis.length) out.push(`COMBI: ${combis.slice(0, 5).join(", ")}${combis.length > 5 ? "…" : ""}`);
  if (normals.length) out.push(`NORMAL: ${normals.slice(0, 5).join(", ")}${normals.length > 5 ? "…" : ""}`);
  if (counters.length) out.push(`Counter: ${counters.join(", ")}`);

  if (hasSimResults(context)) {
    const hint = parseProductivityHint(context);
    if (hint) out.push(`Last run: ${hint}`);
  } else {
    out.push("Not simulated yet — Draw Model then Simulate for metrics.");
  }

  if (out.length === 0) {
    const lines = prompt.trim() ? prompt.trim().split(/\n/).filter(Boolean).length : 0;
    out.push(lines ? `Prompt loaded (${lines} lines). Draw Model for network summary.` : "No prompt yet.");
  }
  return out.slice(0, ASSISTANT_MAX_REPLY_LINES).join("\n");
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
        "Home-QUEUE idleness (waste):\n" +
        sorted
          .slice(0, 8)
          .map((r) => `• ${r.resourceLabel}: idle ${r.idlePct.toFixed(1)}% · busy ${r.busyPct.toFixed(1)}%`)
          .join("\n") +
        `\nHighest idle: ${worst.resourceLabel} (${worst.idlePct.toFixed(1)}%).`;
    } else {
      reply = "Run Simulate first, then ask about the bottleneck.";
    }
  }

  if (/how many|fleet|jumlah|berapa|resources\?/.test(q) && prompt) {
    const counts = extractFleetCounts(prompt);
    if (counts.length) {
      reply += (reply ? "\n" : "") + "Fleet:\n" + counts.map((c) => `• ${c.n} × ${c.name}`).join("\n");
    } else {
      reply += (reply ? "\n" : "") + "No clear fleet counts in the Format Prompt.";
    }
  }

  if (/explain|summary|describe|jelaskan|model/.test(q)) {
    reply = compactModelSummary(prompt, context);
  }

  if (/productiv|produktiv|units per|steady|hasil/.test(q)) {
    if (hasSimResults(context)) {
      const hint = parseProductivityHint(context);
      reply += (reply ? "\n" : "") + (hint ? `Productivity: ${hint}.` : "Last run metrics are in context.");
    } else {
      reply += (reply ? "\n" : "") + "No results yet. Draw Model, then Simulate.";
    }
  }

  if (!asksBottleneck && /idle|waste|util|busy/.test(q)) {
    const idleStats = parseIdleFromContext(context);
    if (idleStats.length) {
      reply +=
        (reply ? "\n" : "") +
        "Idleness:\n" +
        idleStats
          .slice(0, 8)
          .map((r) => `• ${r.resourceLabel}: idle ${r.idlePct.toFixed(1)}% / busy ${r.busyPct.toFixed(1)}%`)
          .join("\n");
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
      reply += (reply ? "\n" : "") + `Propose: set ${name} → ${n}. Click Apply, then Draw + Simulate.`;
      suggestSimulate = true;
    }
  }

  if (/help|keyword|command/.test(q)) {
    reply +=
      (reply ? "\n" : "") +
      "Try: Resources? · Bottleneck? · Productivity? · Set trucks to 8.";
  }

  if (!reply) {
    reply =
      "Local mode (no XAI_API_KEY). Short chips: Resources? · Bottleneck? · Productivity? · Set trucks to 8.";
  }

  return { ok: true, reply, proposedPrompt, suggestSimulate, source: "local", error: null };
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
