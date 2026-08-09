import { createServerFn } from "@tanstack/react-start";
import { parseDsl, serializeDsl, DSL_VERSION } from "./dsl";
import { buildOperationFromText } from "./general-builder";
import { stripPromptComments } from "./prompt-template";

export const generateCycloneDsl = createServerFn({ method: "POST" })
  .inputValidator((data: { prompt: string }) => data)
  .handler(async ({ data }) => {
    const prompt = (data.prompt ?? "").trim();
    if (!prompt) {
      return {
        ok: false as const,
        error: "Empty prompt",
        dsl: "",
        version: DSL_VERSION,
      };
    }

    const cleaned = stripPromptComments(prompt);
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      // Local fallback: structured text → operation → DSL (no LLM)
      return localDsl(cleaned || prompt);
    }

    const system = `You are Neo-CYCLONE, expert in Halpin CYCLONE simulation using the Neo-CYCLONE notation standard (docs/NOTATION_STANDARD.md).
Convert the user Format Prompt into YAML-like DSL for a CYCLONE network.

Output ONLY the DSL (or fenced YAML). Fields:
  name, resources, tasks, links, production
Resource cycles: ResourceName: Task → Task → …
  Counter after: TaskName
  production = amount unit
  Durations: Task: dist params
  Prompt order: network → Durations → Priority → GEN/CON/branch → Cost (USD/h) → Sensitivity (last)

Rules:
- One home QUEUE per resource; COMBI when ≥2 resources meet; NORMAL for single resource.
- GEN/CON optional and independent.
- Honor the user's resource cycles, Counter after:, Durations, Cost, Sensitivity exactly.
- Time unit: minutes.

QUEUE fields: initial, generate, cost_usd_h
COMBI/NORMAL: duration, priority
CONSOLIDATE: consolidate
links: from, to, probability
Duration kinds: constant, uniform, triangular, normal, lognormal, beta (min,max,α,β), pert (a,m,b → PERT-beta), gamma.`;

  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3",
        messages: [
          { role: "system", content: system },
          { role: "user", content: cleaned || prompt },
        ],
        temperature: 0.2,
      }),
    });
    if (!res.ok) {
      return localDsl(cleaned || prompt);
    }
    const body = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    const raw = body.choices[0]?.message?.content ?? "";
    const text = stripFences(raw);
    const asDsl = parseDsl(raw);
    if (asDsl.ok) {
      return {
        ok: true as const,
        dsl: serializeDsl(asDsl.op),
        version: DSL_VERSION,
        source: "ai" as const,
      };
    }
    // Try local if AI output not parseable
    return localDsl(cleaned || prompt);
  } catch {
    return localDsl(cleaned || prompt);
  }
});

function localDsl(prompt: string) {
  try {
    const local = buildOperationFromText(cleanedPromptSafe(prompt));
    if (!local) {
      return {
        ok: false as const,
        error: "Could not build operation from prompt",
        dsl: "",
        version: DSL_VERSION,
      };
    }
    return {
      ok: true as const,
      dsl: serializeDsl(local),
      version: DSL_VERSION,
      source: "local" as const,
    };
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "local build failed",
      dsl: "",
      version: DSL_VERSION,
    };
  }
}

function cleanedPromptSafe(p: string) {
  return p;
}

function stripFences(text: string): string {
  const fence = text.match(/```(?:ya?ml|json)?\s*([\s\S]*?)```/i);
  return (fence?.[1] ?? text).trim();
}
