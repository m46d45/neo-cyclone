import { createServerFn } from "@tanstack/react-start";
import { buildAssistantContext } from "./assistant-context";
import type { CycloneModel, SimResult, SensitivityResult } from "./types";

export type AssistantRequest = {
  message: string;
  prompt: string;
  model: CycloneModel;
  modelReady: boolean;
  seed: number;
  maxCycles: number;
  result: SimResult | null;
  sensitivityResult: SensitivityResult | null;
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

const SYSTEM = `You are the Neo-CYCLONE AI Assistant — an educational co-pilot for Daniel W. Halpin's CYCLONE-style construction operation simulation.

Product: AI-Assisted Construction Operation Simulation.
You help the user understand the CURRENT model (Format Prompt + network + last run results) and propose safe edits.

RULES:
1. Always ground answers in the provided CONTEXT. If something is unknown, say so.
2. When the user asks to change fleet size, durations, cost, sensitivity, branch probability, GEN/CON, priority, or counter — return a FULL updated Format Prompt in proposedPrompt (not a partial patch). Keep the same structure and comments when possible.
3. Never invent a different operation than the one in CONTEXT unless the user explicitly asks for a new model.
4. Prefer COMBI only when ≥2 resources meet; single-resource tasks are NORMAL.
5. GEN/CON only on the material/unit scaling chain. Counter after: names must match task names exactly.
6. Do not claim you already ran a simulation; suggestSimulate=true when they should re-Draw/Simulate after applying a prompt.
7. Teaching tone: flow, idleness (waste), steady state, unit cost — Halpin spirit.
8. Reply language: match the user (English preferred for this product).

RESPONSE FORMAT — return ONLY valid JSON (no markdown fences):
{
  "reply": "string — answer to the user",
  "proposedPrompt": null or "full Format Prompt text",
  "suggestSimulate": true/false
}`;

export const chatAssistant = createServerFn({ method: "POST" })
  .validator((input: AssistantRequest) => ({
    message: String(input?.message ?? "").slice(0, 4000),
    prompt: String(input?.prompt ?? "").slice(0, 12000),
    model: input?.model,
    modelReady: Boolean(input?.modelReady),
    seed: Number(input?.seed ?? 12345),
    maxCycles: Number(input?.maxCycles ?? 100),
    result: input?.result ?? null,
    sensitivityResult: input?.sensitivityResult ?? null,
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

    const context = buildAssistantContext({
      prompt: data.prompt,
      model: data.model,
      modelReady: data.modelReady,
      seed: data.seed,
      maxCycles: data.maxCycles,
      result: data.result,
      sensitivityResult: data.sensitivityResult,
    });

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return localAssistant(message, data.prompt, data.result, context);
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
            {
              role: "user",
              content: `CONTEXT:\n${context}\n\nUSER MESSAGE:\n${message}`,
            },
            ...historyMsgs.slice(0, 6),
          ],
        }),
      });

      if (!res.ok) {
        const local = localAssistant(message, data.prompt, data.result, context);
        local.error = `xAI API ${res.status}`;
        return local;
      }

      const body = (await res.json()) as {
        choices: { message: { content: string } }[];
      };
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
      const local = localAssistant(message, data.prompt, data.result, context);
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

function localAssistant(
  message: string,
  prompt: string,
  result: SimResult | null,
  context: string,
): AssistantResponse {
  const q = message.toLowerCase();
  let reply = "";
  let proposedPrompt: string | null = null;
  let suggestSimulate = false;

  if (/truck|loader|resource|berapa|how many|count/.test(q) && prompt) {
    const counts = [...prompt.matchAll(/(\d+)\s+([A-Za-z][A-Za-z0-9 _/-]*)/g)].slice(0, 12);
    if (counts.length) {
      reply =
        "From the current Format Prompt, resource counts look like:\n" +
        counts.map((m) => `• ${m[1]} × ${m[2].trim()}`).join("\n");
    }
  }

  if (/productiv|unit\/hour|units per|steady/.test(q) && result) {
    const last = result.productivitySeries[result.productivitySeries.length - 1];
    reply +=
      (reply ? "\n\n" : "") +
      `Last run: ${result.cyclesCompleted} cycles, sim time ${result.simTime.toFixed(1)} min.` +
      (last ? ` Last observed units/hour ≈ ${last.unitsPerHour.toFixed(3)}.` : "") +
      (result.cost?.unitCostUsd != null
        ? ` Unit cost ≈ ${result.cost.unitCostUsd.toFixed(4)} USD.`
        : "");
  }

  if (/idle|waste|util/.test(q) && result?.resourceIdleStats?.length) {
    reply +=
      (reply ? "\n\n" : "") +
      "Resource idleness (home QUEUE waste):\n" +
      result.resourceIdleStats
        .map((r) => `• ${r.resourceLabel}: idle ${r.idlePct.toFixed(1)}% / busy ${r.busyPct.toFixed(1)}%`)
        .join("\n");
  }

  const setMatch =
    message.match(/(?:set|change|make|naikkan|ubah|jadi)\s+(\w+)\s+(?:to|jadi|=)?\s*(\d+)/i) ||
    message.match(/(\d+)\s+(trucks?|loaders?|cranes?|helpers?|masons?)/i);
  if (setMatch && prompt) {
    const n = setMatch[2] && /^\d+$/.test(setMatch[2]) ? setMatch[2] : setMatch[1];
    const name = setMatch[2] && /^\d+$/.test(setMatch[2]) ? setMatch[1] : setMatch[2];
    if (n && name) {
      const re = new RegExp(`(\\d+)\\s*(${escapeRe(name)}s?)\\b`, "i");
      if (re.test(prompt)) {
        proposedPrompt = prompt.replace(re, `${n} $2`);
        const re2 = new RegExp(`(${escapeRe(name)}s?)\\s*=\\s*\\d+`, "i");
        proposedPrompt = proposedPrompt.replace(re2, `$1 = ${n}`);
        reply +=
          (reply ? "\n\n" : "") +
          `I can update the prompt so **${name}** becomes **${n}**. Click **Apply prompt**, then **Draw Model** and **Simulate**.`;
        suggestSimulate = true;
      }
    }
  }

  if (!reply) {
    reply =
      "AI Assistant is in local mode (no XAI_API_KEY). I can still summarize counts and last-run productivity when available.\n\n" +
      "Try: ask about productivity, idleness, or set trucks to 8. For richer edits, configure XAI_API_KEY on Vercel.\n\n" +
      "Context snapshot (truncated):\n" +
      context.slice(0, 1200);
  }

  return {
    ok: true,
    reply,
    proposedPrompt,
    suggestSimulate,
    source: "local",
    error: null,
  };
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
