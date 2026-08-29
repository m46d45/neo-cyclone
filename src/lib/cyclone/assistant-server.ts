import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { checkAiRateLimit, clientKeyFromHeaders } from "./ai-rate-limit";
import {
  ASSISTANT_MAX_REPLY_LINES,
  localAssistant as runLocalAssistant,
} from "./assistant-local";

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

export { ASSISTANT_MAX_REPLY_LINES };

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
      return finalizeLocal(runLocalAssistant(message, data.prompt, context));
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
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM },
            ...historyMsgs.slice(-6),
            { role: "user", content: `CONTEXT:\n${context}\n\nUSER:\n${message}` },
          ],
        }),
      });

      if (!res.ok) {
        return finalizeLocal(runLocalAssistant(message, data.prompt, context));
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
    } catch {
      return finalizeLocal(runLocalAssistant(message, data.prompt, context));
    }
  });

function finalizeLocal(r: {
  reply: string;
  proposedPrompt: string | null;
  suggestSimulate: boolean;
}): AssistantResponse {
  return {
    ok: true,
    reply: clampAssistantReply(r.reply),
    proposedPrompt: r.proposedPrompt,
    suggestSimulate: r.suggestSimulate,
    source: "local",
    error: null,
  };
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
