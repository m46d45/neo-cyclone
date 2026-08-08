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
  DEFAULT_EXAMPLE_PROMPT,
  DIST_TABLE,
  GENERAL_TEMPLATE,
  PRODUCT_TAGLINE,
} from "@/lib/cyclone/prompt-template";
import { parseCostAndSensitivity, applyCostsToModel } from "@/lib/cyclone/sensitivity";
import { t } from "@/lib/cyclone/agent/i18n";

export function AIAssist() {
  const agent = useCycloneStore((s) => s.agent);
  const setBrief = useCycloneStore((s) => s.setBrief);
  const applyAgentDraft = useCycloneStore((s) => s.applyAgentDraft);
  const markModelReady = useCycloneStore((s) => s.markModelReady);
  const clearResult = useCycloneStore((s) => s.clearResult);

  const [input, setInput] = useState(DEFAULT_EXAMPLE_PROMPT);
  const [loading, setLoading] = useState(false);

  const c = t();

  async function buildModel(prompt: string): Promise<boolean> {
    const ai = await generateCycloneDsl({ data: { prompt } });
    if (ai.ok && ai.dsl) {
      const checked = parseDsl(ai.dsl);
      if (checked.ok && applyAgentDraft(ai.dsl, "draft")) {
        // Attach Cost USD/h + Sensitivity plan from the prompt (DSL omits them).
        const { costs, sensitivity } = parseCostAndSensitivity(prompt);
        if (Object.keys(costs).length || sensitivity.length) {
          const st = useCycloneStore.getState();
          let m = st.model;
          if (Object.keys(costs).length) m = applyCostsToModel(m, costs);
          if (sensitivity.length) m = { ...m, sensitivity };
          st.setModel(m);
          st.markModelReady(true);
        }
        return true;
      }
    }
    const local = parseOperationDescription(prompt);
    if (local && applyAgentDraft(local, "local draft")) {
      return true;
    }
    return false;
  }

  async function onBuildModel() {
    const prompt = input.trim() || agent.brief;
    if (!prompt) {
      toast.message(c.needPrompt);
      return;
    }

    setLoading(true);
    setBrief(prompt);
    clearResult();

    try {
      const built = await buildModel(prompt);
      if (!built) {
        toast.error(c.simFail);
        markModelReady(false);
        return;
      }
      markModelReady(true);
      toast.success(c.modelDrawn);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-base">{c.title}</CardTitle>
        <CardDescription className="text-xs leading-snug">{PRODUCT_TAGLINE}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
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
              <code className="text-foreground">//</code> = notes (not commands).{" "}
              <a href="/manual" className="text-primary hover:underline">
                Manual
              </a>
            </p>
          </div>
        </details>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-foreground">
            {c.promptLabel}
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            placeholder={GENERAL_TEMPLATE}
            className="min-h-[220px] font-mono text-xs leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                void onBuildModel();
              }
            }}
          />
        </div>

        <Button
          className="w-full gap-2"
          size="lg"
          disabled={loading}
          onClick={() => void onBuildModel()}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Layers className="size-4" />}
          {loading ? c.drawing : c.drawModel}
        </Button>
        <p className="text-center text-[10px] text-muted-foreground">{c.drawHint}</p>
      </CardContent>
    </Card>
  );
}
