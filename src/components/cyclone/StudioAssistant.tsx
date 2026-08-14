import { useEffect, useRef, useState } from "react";
import { Loader2, MessageSquare, Send, Sparkles, Check, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCycloneStore } from "@/lib/cyclone/store";
import { chatAssistant, clampAssistantReply } from "@/lib/cyclone/assistant-server";
import { buildAssistantContext } from "@/lib/cyclone/assistant-context";
import { uid } from "@/lib/cyclone/agent/session";
import { PRODUCT_TAGLINE } from "@/lib/cyclone/prompt-template";
import { recordStudioUse } from "@/lib/cyclone/usage-client";

type UiMsg = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  proposedPrompt?: string | null;
  suggestSimulate?: boolean;
};

/** Short chips only — answers capped to ≤20 lines. */
const QUICK = [
  "How many resources?",
  "Which resource is the bottleneck?",
  "What was productivity?",
  "What is the unit cost?",
];

export function StudioAssistant() {
  const prompt = useCycloneStore((s) => s.agent.brief);
  const setBrief = useCycloneStore((s) => s.setBrief);
  const model = useCycloneStore((s) => s.model);
  const modelReady = useCycloneStore((s) => s.modelReady);
  const result = useCycloneStore((s) => s.result);
  const sensitivityResult = useCycloneStore((s) => s.sensitivityResult);
  const seed = useCycloneStore((s) => s.seed);
  const maxCycles = useCycloneStore((s) => s.maxCycles);
  const agentPush = useCycloneStore((s) => s.agentPush);
  const simulateNow = useCycloneStore((s) => s.simulateNow);
  const markModelReady = useCycloneStore((s) => s.markModelReady);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<UiMsg[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const message = (text ?? input).trim();
    if (!message || loading) return;
    setInput("");
    const userMsg: UiMsg = { id: uid("u"), role: "user", text: message };
    setMessages((m) => [...m, userMsg]);
    agentPush({ role: "user", text: message });
    setLoading(true);
    try {
      const history = messages
        .filter((x) => x.role === "user" || x.role === "assistant")
        .slice(-6)
        .map((x) => ({
          role: x.role as "user" | "assistant",
          text: x.text,
        }));

      const context = buildAssistantContext({
        prompt: prompt || "",
        model,
        modelReady,
        seed,
        maxCycles,
        result,
        sensitivityResult,
      });

      const res = await chatAssistant({
        data: {
          message,
          prompt: prompt || "",
          context,
          history,
        },
      });

      const assistantMsg: UiMsg = {
        id: uid("a"),
        role: "assistant",
        text: clampAssistantReply(res.reply || res.error || "No reply."),
        proposedPrompt: res.proposedPrompt,
        suggestSimulate: res.suggestSimulate,
      };
      setMessages((m) => [...m, assistantMsg]);
      agentPush({ role: "agent", text: assistantMsg.text });
      if (res.error === "rate_limited") {
        toast.message("Rate limit", { description: res.reply });
      } else if (res.source === "local") {
        toast.message("Assistant: local mode", {
          description: "Set XAI_API_KEY on Vercel for full free-form chat",
        });
      }
    } catch (e) {
      const err = e instanceof Error ? e.message : "Assistant failed";
      setMessages((m) => [
        ...m,
        { id: uid("e"), role: "assistant", text: `Error: ${err}` },
      ]);
      toast.error(err);
    } finally {
      setLoading(false);
    }
  }

  function applyPrompt(next: string) {
    setBrief(next);
    markModelReady(false);
    toast.success("Prompt updated — click Draw Model, then Simulate");
    setMessages((m) => [
      ...m,
      {
        id: uid("s"),
        role: "system",
        text: "Format Prompt applied. Use Draw Model, then Simulate.",
      },
    ]);
  }

  function applyAndSimulate(next: string) {
    applyPrompt(next);
    const { ok, error } = simulateNow();
    if (!ok) {
      toast.message("Prompt applied", {
        description: error || "Draw Model first, then Simulate.",
      });
    } else {
      recordStudioUse("simulate");
      toast.success("Simulation re-run with current network");
    }
  }

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-primary" />
            <CardTitle className="font-display text-base">AI Assistant</CardTitle>
          </div>
          <CardDescription className="text-[10px]">{PRODUCT_TAGLINE}</CardDescription>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {modelReady ? "Model drawn" : "No model drawn yet"}
          {" · "}
          {result ? `Last run: ${result.cyclesCompleted} cycles` : "Not simulated yet"}
          {" · "}
          prompt {prompt?.trim() ? "loaded" : "empty"}
          {" · "}
          replies ≤20 lines
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex max-h-[320px] min-h-[180px] flex-col gap-2.5 overflow-y-auto rounded-[var(--radius-md)] border border-border bg-muted/40 p-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={
                m.role === "user"
                  ? "flex w-full justify-end"
                  : m.role === "system"
                    ? "flex w-full justify-center"
                    : "flex w-full justify-start"
              }
            >
            <div
              className={
                m.role === "user"
                  ? "max-w-[min(78%,22rem)] rounded-2xl rounded-br-sm border border-primary/50 bg-primary px-2.5 py-1.5 text-xs text-primary-foreground shadow-sm"
                  : m.role === "system"
                    ? "w-full max-w-full rounded-lg border border-dashed border-border bg-background/90 px-3 py-2 text-[11px] text-muted-foreground"
                    : "max-w-[min(85%,28rem)] rounded-2xl rounded-bl-sm border border-border bg-background px-2.5 py-1.5 text-xs text-foreground shadow-sm"
              }
            >
              {m.role !== "system" ? (
                <p
                  className={
                    m.role === "user"
                      ? "mb-0.5 text-right text-[9px] font-semibold uppercase tracking-wide text-primary-foreground/80"
                      : "mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary"
                  }
                >
                  {m.role === "user" ? "You" : "Assistant"}
                </p>
              ) : null}
              <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
              {m.proposedPrompt ? (
                <div className="mt-2 space-y-2 border-t border-border pt-2">
                  <p className="text-[10px] font-medium text-primary">Proposed Format Prompt</p>
                  <pre className="max-h-40 overflow-auto rounded border border-border bg-muted/40 p-2 font-mono text-[10px] leading-snug text-foreground">
                    {m.proposedPrompt}
                  </pre>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-1.5"
                      onClick={() => applyPrompt(m.proposedPrompt!)}
                    >
                      <Check className="size-3.5" />
                      Apply prompt
                    </Button>
                    {m.suggestSimulate ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() => applyAndSimulate(m.proposedPrompt!)}
                      >
                        <Play className="size-3.5" />
                        Apply + try Simulate
                      </Button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
            </div>
          ))}
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Thinking with studio context…
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {QUICK.map((q) => (
            <Button
              key={q}
              type="button"
              size="sm"
              variant="outline"
              className="h-auto max-w-full whitespace-normal px-2 py-1 text-[10px] leading-snug"
              disabled={loading}
              onClick={() => void send(q)}
            >
              <Sparkles className="mr-1 size-3 shrink-0 text-primary" />
              {q}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={2}
            placeholder="Ask about the model or results, or request a prompt change. Bound to Format Prompt, network, and last results. English preferred. Answers stay short (≤20 lines). Prompt edits apply only after Apply."
            className="min-h-[64px] flex-1 resize-y text-xs"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
          />
          <Button
            className="shrink-0 gap-1.5 self-end"
            disabled={loading || !input.trim()}
            onClick={() => void send()}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
