import { useState } from "react";
import { Loader2, Layers } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCycloneStore } from "@/lib/cyclone/store";
import { parseOperationDescription } from "@/lib/cyclone/nl-parser";
import { parseDsl } from "@/lib/cyclone/dsl";
import { generateCycloneDsl } from "@/lib/cyclone/ai-server";
import {
  DIST_TABLE,
  GENERAL_TEMPLATE,
  PRODUCT_TAGLINE,
} from "@/lib/cyclone/prompt-template";
import { EXAMPLE_PROMPTS } from "@/lib/cyclone/example-prompts";
import { parseCostAndSensitivity, applyCostsToModel } from "@/lib/cyclone/sensitivity";
import { parsePriorityBlock, applyPrioritiesToModel } from "@/lib/cyclone/priority";
import { t } from "@/lib/cyclone/agent/i18n";

function looksStructuredPrompt(prompt: string): boolean {
  return /[A-Za-z][A-Za-z0-9 _/-]{0,40}\s*:\s*.+(→|->|=>|\|)/m.test(prompt);
}

function applyPromptMeta(prompt: string) {
  const { costs, sensitivity } = parseCostAndSensitivity(prompt);
  const pri = parsePriorityBlock(prompt);
  const st = useCycloneStore.getState();
  let m = st.model;
  let changed = false;
  if (Object.keys(costs).length) {
    m = applyCostsToModel(m, costs);
    changed = true;
  }
  if (Object.keys(pri).length) {
    m = applyPrioritiesToModel(m, pri);
    changed = true;
  }
  if (sensitivity.length) {
    m = { ...m, sensitivity };
    changed = true;
  }
  if (changed) st.setModel(m);
  st.markModelReady(true);
}

export function AIAssist() {
  const agent = useCycloneStore((s) => s.agent);
  const setBrief = useCycloneStore((s) => s.setBrief);
  const applyAgentDraft = useCycloneStore((s) => s.applyAgentDraft);
  const markModelReady = useCycloneStore((s) => s.markModelReady);
  const clearResult = useCycloneStore((s) => s.clearResult);

  const [exampleId, setExampleId] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const c = t();

  /**
   * Structured Format Prompt → local builder first (deterministic presets).
   * Free text → AI, then local fallback.
   */
  async function buildModel(prompt: string): Promise<boolean> {
    if (looksStructuredPrompt(prompt)) {
      const local = parseOperationDescription(prompt);
      if (local && applyAgentDraft(local, "local structured")) {
        applyPromptMeta(prompt);
        return true;
      }
    }

    const ai = await generateCycloneDsl({ data: { prompt } });
    if (ai.ok && ai.dsl) {
      const checked = parseDsl(ai.dsl);
      if (checked.ok && applyAgentDraft(ai.dsl, "draft")) {
        applyPromptMeta(prompt);
        return true;
      }
    }

    const local = parseOperationDescription(prompt);
    if (local && applyAgentDraft(local, "local draft")) {
      applyPromptMeta(prompt);
      return true;
    }
    return false;
  }

  async function runBuild(prompt: string, opts?: { quiet?: boolean }) {
    if (!prompt.trim()) {
      toast.message(c.needPrompt);
      return false;
    }
    setLoading(true);
    setBrief(prompt);
    clearResult();
    try {
      const built = await buildModel(prompt);
      if (!built) {
        toast.error(c.simFail);
        markModelReady(false);
        return false;
      }
      markModelReady(true);
      if (!opts?.quiet) toast.success(c.modelDrawn);
      return true;
    } finally {
      setLoading(false);
    }
  }

  /** Example only fills the prompt — user must click Draw Model. */
  function loadExample(id: string) {
    if (!id) {
      setExampleId("");
      setInput("");
      return;
    }
    const ex = EXAMPLE_PROMPTS.find((x) => x.id === id);
    if (!ex) return;
    setExampleId(id);
    setInput(ex.prompt);
    // Do not draw yet — wait for Draw Model
  }

  return (
    <Card className="flex h-full min-h-[520px] flex-col border-primary/20 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-base">{c.title}</CardTitle>
        <CardDescription className="text-xs leading-snug">{PRODUCT_TAGLINE}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-3">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <label className="text-[11px] font-medium text-foreground" htmlFor="op-prompt">
              {c.promptLabel}
            </label>
            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="whitespace-nowrap">Example</span>
              <select
                className="max-w-[240px] rounded-[var(--radius-sm)] border border-border bg-background px-1.5 py-1 text-[10px] text-foreground"
                value={exampleId}
                disabled={loading}
                onChange={(e) => loadExample(e.target.value)}
              >
                <option value="">— Select example —</option>
                {EXAMPLE_PROMPTS.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Textarea
            id="op-prompt"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={22}
            placeholder="Please select an Example above, or paste / write your operation prompt here."
            className="min-h-[420px] flex-1 resize-y font-mono text-xs leading-relaxed lg:min-h-[480px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                void runBuild(input.trim() || agent.brief);
              }
            }}
          />
        </div>

        <Button
          className="w-full gap-2"
          size="lg"
          disabled={loading}
          onClick={() => void runBuild(input.trim() || agent.brief)}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Layers className="size-4" />}
          {loading ? c.drawing : c.drawModel}
        </Button>
        <p className="text-center text-[10px] text-muted-foreground">{c.drawHint}</p>

        {/* Format Prompt reference — below Draw Model so the prompt box can match model height */}
        <details className="rounded-[var(--radius-sm)] border border-border bg-muted/30 text-[11px]">
          <summary className="cursor-pointer px-2.5 py-1.5 font-medium text-foreground">
            {c.formatPrompt}
          </summary>
          <div className="space-y-2.5 border-t border-border px-2.5 py-2 text-muted-foreground">
            <pre className="whitespace-pre-wrap font-mono text-[10px] text-foreground/90">
              {GENERAL_TEMPLATE}
            </pre>
            <pre className="whitespace-pre-wrap font-mono text-[10px] text-foreground/90">
              {DIST_TABLE}
            </pre>
            <p className="text-[10px] leading-relaxed">
              <code className="text-foreground">#</code> /{" "}
              <code className="text-foreground">//</code> = notes (not commands). Full reference:{" "}
              <a href="/manual" className="text-primary hover:underline">
                Manual
              </a>
              {" · "}
              <a href="/manual#notation" className="text-primary hover:underline">
                Notation
              </a>
            </p>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
