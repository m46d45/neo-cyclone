import { createServerFn } from "@tanstack/react-start";
import { parseDsl, serializeDsl, DSL_VERSION } from "./dsl";
import { buildOperationFromText } from "./general-builder";
import { stripPromptComments } from "./prompt-template";

export const generateCycloneDsl = createServerFn({ method: "POST" })
  .validator((input: { prompt: string }) => ({
    prompt: String(input?.prompt ?? "").slice(0, 2000),
  }))
  .handler(async ({ data }) => {
    return draftDslFromPrompt(data.prompt);
  });

async function draftDslFromPrompt(prompt: string): Promise<{
  ok: boolean;
  error: string | null;
  dsl: string | null;
  source: "ai" | "none";
}> {
  // Comments are notes for humans — strip before AI / local build
  const cleaned = stripPromptComments(prompt);
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "AI unavailable", dsl: null, source: "none" };
  }

  const system = `You are Neo-CYCLONE, expert in Halpin CYCLONE simulation using the Neo-CYCLONE notation standard (docs/NOTATION_STANDARD.md).

User prompts may contain notes on lines starting with # or // — those are already removed when present; ignore leftover commentary.

Honor per-resource cycles when listed:
  Resource: Task1 → Task2 → …
  counts and production unit
  Durations: Task: dist params
  Optional: Cost USD/h, Sensitivity: Resource: low..high

CORE RULES:
- Every resource has a home QUEUE; returns to the same QUEUE.
- First activity after QUEUE is COMBI; later steps NORMAL.
- QUEUE may only link to COMBI.
- Any construction domain. Do not force earthmoving unless described.

NOTATION / DSL (canonical Neo-CYCLONE):
- QUEUE: initial, optional generate (GEN k, k≥2) multiplies each *arrival* only (not initial).
- COMBI / NORMAL: duration required.
- COUNTER: production amount.
- CONSOLIDATE: consolidate n (CON n, n≥2) — buffer n arrivals, release 1 (time 0).
- GEN and CON are independent; use only when unit logic needs them.
- Links: optional probability (0–1) for stochastic multi-out. Sum ~1. Do NOT put probability on COMBI multi-out used only for resource return fan-out.
- Layout hint: forward flow toward COUNTER; arcs into QUEUE are resource returns (diagram shows dashed gold).
- Priority: COMBI field priority (positive int). Lower = higher priority when shared resources contend (tower crane). Prompt block Priority: Task: n. Default = declaration order.
- Multi-demand shared resource: one QUEUE feeding several COMBIs (DSL links). Prompt: Resource: TaskA | TaskB | TaskC

Return ONLY YAML Neo-CYCLONE DSL ${DSL_VERSION}. No markdown.

dsl: "${DSL_VERSION}"
model: { id, name, description, time_unit, production_unit, nodes, links }
run: { seed, max_time, max_cycles }

QUEUE fields: initial, generate, cost_usd_h
COMBI/NORMAL: duration, priority
CONSOLIDATE: consolidate
links: from, to, probability
Duration kinds: constant, uniform, triangular, normal, lognormal, beta, gamma.`;

  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 2800,
        messages: [
          { role: "system", content: system },
          { role: "user", content: cleaned || prompt },
        ],
      }),
    });
    if (!res.ok) {
      return { ok: false, error: `xAI API error ${res.status}`, dsl: null, source: "none" };
    }
    const body = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    let raw = stripFences(body.choices[0]?.message.content ?? "");

    const asDsl = parseDsl(raw);
    if (asDsl.ok) {
      return {
        ok: true,
        dsl: serializeDsl(asDsl.model, {
          seed: asDsl.run?.seed,
          maxTime: asDsl.run?.maxTime,
          maxCycles: asDsl.run?.maxCycles,
        }),
        error: null,
        source: "ai",
      };
    }

    const local = buildOperationFromText(cleaned || prompt);
    if (local) {
      return { ok: true, dsl: serializeDsl(local), error: null, source: "ai" };
    }

    return {
      ok: false,
      error: asDsl.errors[0] ?? "Invalid AI DSL",
      dsl: null,
      source: "none",
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "AI request failed",
      dsl: null,
      source: "none",
    };
  }
}

function stripFences(text: string): string {
  const fence = text.match(/```(?:ya?ml|json)?\s*([\s\S]*?)```/i);
  return (fence?.[1] ?? text).trim();
}
