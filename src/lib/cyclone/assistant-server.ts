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
Product: AI-Assisted Construction Operation Simulation.
LANGUAGE: Reply in the SAME language as the user (Indonesian or English). Keep task/resource names as in CONTEXT.
RULES:
1. Ground answers in CONTEXT. 2. For edits, return FULL Format Prompt in proposedPrompt. 3. Do not invent a different operation. 4. COMBI only if >=2 resources. 5. suggestSimulate=true after prompt changes.
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
        reply: "Ketik pertanyaan / Type a question.",
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

function isId(q: string): boolean {
  return /\b(yang|dengan|berapa|apakah|tolong|ubah|naikkan|turunkan|jelaskan|simulasi|hasil|produktivitas|truk|saya|bisa|untuk|dari|ini|ada|tidak|sudah|belum|kalau|kira)\b/i.test(
    q,
  );
}

function localAssistant(
  message: string,
  prompt: string,
  result: SimResult | null,
  context: string,
): AssistantResponse {
  const q = message.toLowerCase();
  const id = isId(q);
  let reply = "";
  let proposedPrompt: string | null = null;
  let suggestSimulate = false;

  // counts
  if (
    /truck|loader|resource|berapa|how many|count|jumlah|sumber|truk|fleet/.test(q) &&
    prompt
  ) {
    const counts = [...prompt.matchAll(/(\d+)\s+([A-Za-z][A-Za-z0-9 _/-]*)/g)].slice(0, 12);
    if (counts.length) {
      reply =
        (id ? "Jumlah resource di Format Prompt:\n" : "Resource counts in Format Prompt:\n") +
        counts.map((m) => `• ${m[1]} × ${m[2].trim()}`).join("\n");
    }
  }

  // explain
  if (/jelaskan|explain|ringkas|summary|model (ini|saya)|what is|describe|siklus|cycle/.test(q)) {
    const lines = prompt.trim() ? prompt.trim().split(/\n/).length : 0;
    reply +=
      (reply ? "\n\n" : "") +
      (id
        ? `Ringkasan: prompt ${lines ? lines + " baris" : "kosong"}.` +
          (result
            ? ` Simulasi terakhir ${result.cyclesCompleted} siklus.`
            : " Belum disimulasikan.")
        : `Summary: prompt ${lines ? lines + " lines" : "empty"}.` +
          (result
            ? ` Last run ${result.cyclesCompleted} cycles.`
            : " Not simulated yet."));
  }

  // productivity
  if (/productiv|produktiv|unit\/hour|units per|steady|hasil|result|kinerja/.test(q) && result) {
    const last = result.productivitySeries[result.productivitySeries.length - 1];
    reply +=
      (reply ? "\n\n" : "") +
      (id ? "Hasil simulasi: " : "Last run: ") +
      `${result.cyclesCompleted} cycles, ${result.simTime.toFixed(1)} min.` +
      (last ? ` units/hour ≈ ${last.unitsPerHour.toFixed(3)}.` : "") +
      (result.cost ? ` unit cost ≈ ${result.cost.unitCostUsd.toFixed(4)} USD.` : "");
  } else if (/productiv|produktiv|hasil|result|steady/.test(q) && !result) {
    reply +=
      (reply ? "\n\n" : "") +
      (id
        ? "Belum ada hasil. Draw Model lalu Simulate dulu."
        : "No results yet. Draw Model, then Simulate.");
  }

  // idle
  if (/idle|waste|util|antrian|menganggur|sibuk|busy/.test(q) && result?.resourceIdleStats?.length) {
    reply +=
      (reply ? "\n\n" : "") +
      (id ? "Idleness (waste di home QUEUE):\n" : "Resource idleness:\n") +
      result.resourceIdleStats
        .map((r) => `• ${r.resourceLabel}: idle ${r.idlePct.toFixed(1)}% / busy ${r.busyPct.toFixed(1)}%`)
        .join("\n");
  }

  // change count — EN + ID
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
        (id
          ? `Bisa ubah **${name}** jadi **${n}**. Klik **Apply prompt**, lalu Draw Model + Simulate.`
          : `I can set **${name}** to **${n}**. Click **Apply prompt**, then Draw Model + Simulate.`);
      suggestSimulate = true;
    }
  }

  if (/bantuan|help|cara|command|perintah|keyword/.test(q)) {
    reply +=
      (reply ? "\n\n" : "") +
      (id
        ? "Contoh: Jelaskan model ini · Berapa truk? · Hasil produktivitas · Ubah truk jadi 8. Chat bebas penuh butuh XAI_API_KEY di Vercel."
        : "Examples: Explain model · How many trucks? · Productivity · Set trucks to 8. Full free-form needs XAI_API_KEY on Vercel.");
  }

  if (!reply) {
    reply = id
      ? "Mode lokal (tanpa XAI_API_KEY). Coba: Jelaskan model ini / Berapa resource? / Hasil produktivitas / Ubah truk jadi 8. Atau set XAI_API_KEY di Vercel untuk bahasa natural penuh.\n\n" +
        context.slice(0, 800)
      : "Local mode (no XAI_API_KEY). Try: Explain this model / How many resources? / Productivity / Set trucks to 8. Or set XAI_API_KEY on Vercel.\n\n" +
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
