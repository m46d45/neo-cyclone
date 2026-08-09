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
            { role: "user", content: `CONTEXT:\n${context}\n\nUSER:\n${message}` },
            ...historyMsgs.slice(0, 6),
          ],
        }),
      });

      if (!res.ok) {
        const local = localAssistant(message, data.prompt, data.result, context);
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

/** Only fleet counts like "5 trucks, 1 loader" — not costs, durations, m3. */
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
  for (const m of prompt.matchAll(
    /\b(trucks?|loaders?|cranes?|helpers?|masons?|excavators?|pavers?|crew|crews)\s*=\s*(\d+)/gi,
  )) {
    const name = m[1]!.trim();
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ n: m[2]!, name });
  }
  return out.slice(0, 12);
}

/** Local helper — English-first replies; still recognizes common ID intent phrases. */
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

  const asksBottleneck =
    /bermasalah|bottleneck|paling (parah|jelek|rendah|tinggi|sibuk|idle)|most (problem|critical|idle|busy)|which resource|resource apa|siapa yang|waste (paling|tertinggi)|utilisasi (rendah|tinggi)/i.test(
      q,
    ) || /paling.*resource|resource.*paling/i.test(q);

  if (asksBottleneck) {
    if (result?.resourceIdleStats?.length) {
      const sorted = [...result.resourceIdleStats].sort((a, b) => b.idlePct - a.idlePct);
      const worstIdle = sorted[0]!;
      const sortedBusy = [...result.resourceIdleStats].sort((a, b) => b.busyPct - a.busyPct);
      const busiest = sortedBusy[0]!;
      reply =
        `From the last run, home-QUEUE idleness (waste):\n` +
        sorted
          .map(
            (r) =>
              `• **${r.resourceLabel}**: idle ${r.idlePct.toFixed(1)}% · busy ${r.busyPct.toFixed(1)}% (n=${r.n})`,
          )
          .join("\n") +
        `\n\n**Highest idle (waste):** ${worstIdle.resourceLabel} (${worstIdle.idlePct.toFixed(1)}% idle).` +
        `\n**Busiest:** ${busiest.resourceLabel} (${busiest.busyPct.toFixed(1)}% busy).` +
        `\n\nNote: “most problematic” often means high idle (over-fleeted / waiting) or a severe util imbalance.`;
      if (result.activityStats?.length) {
        const acts = [...result.activityStats].sort((a, b) => a.utilization - b.utilization);
        const low = acts[0]!;
        reply += `\nLowest activity utilization: **${low.label}** (${(low.utilization * 100).toFixed(1)}%).`;
      }
    } else {
      reply =
        "Run **Simulate** first so idleness data exists, then ask again about the bottleneck resource.";
    }
  }

  const asksCount =
    !asksBottleneck &&
    (/berapa\s+(jumlah\s+)?(truk|truck|loader|crane|resource|sumber)|how many|jumlah\s+(truk|truck|loader|resource)|fleet size/i.test(
      q,
    ) ||
      (/berapa|how many|jumlah/.test(q) && /truk|truck|loader|crane|resource|fleet/.test(q)));

  if (asksCount && prompt) {
    const counts = extractFleetCounts(prompt);
    if (counts.length) {
      reply +=
        (reply ? "\n\n" : "") +
        "Fleet counts in Format Prompt:\n" +
        counts.map((c) => `• ${c.n} × ${c.name}`).join("\n");
    } else {
      reply +=
        (reply ? "\n\n" : "") +
        "Could not find clear fleet count lines (e.g. `5 trucks, 1 loader`).";
    }
  }

  if (/jelaskan|explain|ringkas|summary|model (ini|saya)|what is|describe|siklus|cycle/.test(q)) {
    const lines = prompt.trim() ? prompt.trim().split(/\n/).length : 0;
    const counts = extractFleetCounts(prompt);
    reply +=
      (reply ? "\n\n" : "") +
      `Summary: prompt ${lines ? lines + " lines" : "empty"}.` +
      (counts.length ? " Fleet: " + counts.map((c) => `${c.n} ${c.name}`).join(", ") + "." : "") +
      (result ? ` Last run ${result.cyclesCompleted} cycles.` : " Not simulated yet.");
  }

  if (/productiv|produktiv|unit\/hour|units per|steady|hasil|result|kinerja/.test(q) && result) {
    const last = result.productivitySeries[result.productivitySeries.length - 1];
    reply +=
      (reply ? "\n\n" : "") +
      `Last run: ${result.cyclesCompleted} cycles, ${result.simTime.toFixed(1)} min.` +
      (last ? ` units/hour ≈ ${last.unitsPerHour.toFixed(3)}.` : "") +
      (result.cost ? ` unit cost ≈ ${result.cost.unitCostUsd.toFixed(4)} USD.` : "");
  } else if (/productiv|produktiv|hasil|result|steady/.test(q) && !result) {
    reply += (reply ? "\n\n" : "") + "No results yet. Draw Model, then Simulate.";
  }

  if (
    !asksBottleneck &&
    /idle|waste|util|antrian|menganggur|sibuk|busy/.test(q) &&
    result?.resourceIdleStats?.length
  ) {
    reply +=
      (reply ? "\n\n" : "") +
      "Resource idleness (home QUEUE waste):\n" +
      result.resourceIdleStats
        .map((r) => `• ${r.resourceLabel}: idle ${r.idlePct.toFixed(1)}% / busy ${r.busyPct.toFixed(1)}%`)
        .join("\n");
  }

  const setMatch =
    message.match(
      /(?:set|change|make|naikkan|turunkan|ubah|ganti|atur)\s+(\w+)\s+(?:to|jadi|menjadi|ke|=)?\s*(\d+)/i,
    ) ||
    message.match(/(\w+)\s+(?:jadi|menjadi|=)\s*(\d+)/i) ||
    message.match(/(\d+)\s+(trucks?|loaders?|cranes?|helpers?|masons?|truk|loader|crane)/i);

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
    const map: Record<string, string> = { truk: "truck", truks: "truck" };
    const mapped = map[name.toLowerCase()] ?? name;
    const re = new RegExp(`(\\d+)(\\s+)(${escapeRe(mapped)}s?)\\b`, "i");
    if (re.test(prompt)) {
      proposedPrompt = prompt.replace(re, `${n}$2$3`);
      const re2 = new RegExp(`(${escapeRe(mapped)}s?)(\\s*=\\s*)\\d+`, "i");
      proposedPrompt = proposedPrompt.replace(re2, `$1$2${n}`);
      reply +=
        (reply ? "\n\n" : "") +
        `I can set **${name}** to **${n}**. Click **Apply prompt**, then Draw Model + Simulate.`;
      suggestSimulate = true;
    }
  }

  if (/bantuan|help|cara|command|perintah|keyword/.test(q)) {
    reply +=
      (reply ? "\n\n" : "") +
      "Examples: Explain this model · How many trucks? · Which resource is the bottleneck? · What was productivity? · Set trucks to 8.\n" +
      "For free-form multilingual chat, set XAI_API_KEY on Vercel.";
  }

  if (!reply) {
    reply =
      "Local mode (no XAI_API_KEY). Try: Explain this model / How many trucks? / Bottleneck resource? / Productivity / Set trucks to 8.\n" +
      "For natural multilingual chat, set XAI_API_KEY on Vercel.\n\n" +
      context.slice(0, 800);
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
