import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DIST_TABLE,
  GENERAL_TEMPLATE,
  PRODUCT_DEDICATION,
  PRODUCT_TAGLINE,
} from "@/lib/cyclone/prompt-template";

export const Route = createFileRoute("/manual")({
  component: ManualPage,
});

function ManualPage() {
  return (
    <div className="halpin-shell min-h-dvh text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md pt-[var(--grok-banner-h,0px)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            <h1 className="font-display text-base font-semibold">Neo-CYCLONE Manual</h1>
            <Badge variant="secondary" className="border-primary/25 bg-primary/10 text-primary">
              v1.6
            </Badge>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft className="size-3.5" />
              Studio
            </Link>
          </Button>
        </div>
        <div className="gold-rule" />
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-4 py-8 text-sm leading-relaxed text-muted-foreground">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
            {PRODUCT_TAGLINE}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{PRODUCT_DEDICATION}</p>
        </div>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Part I — Getting oriented
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 1 — Introduction
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <h3 className="font-display text-base font-semibold text-foreground">1.1 Purpose</h3>
          <div className="mt-2 space-y-3 text-[15px] leading-[1.7]">
            <p>
              Neo-CYCLONE is{" "}
              <strong className="text-foreground">AI-Assisted Construction Operation Simulation</strong> —
              an educational web app for modeling repetitive construction operations in the spirit of
              Professor <strong className="text-foreground">Daniel W. Halpin’s CYCLONE</strong>.
            </p>
          </div>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            1.3 Approach
          </h3>
          <p className="mt-2 rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[14px] text-foreground">
            Prompt-first → <strong>Draw Model</strong> → <strong>Simulate</strong> → optional{" "}
            <strong>AI Assistant</strong>. See Chapter 9 for literature.
          </p>
        </section>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Part II — How to use
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 2 — How-to
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs">
            <li>Select Example or write Format Prompt.</li>
            <li>Draw Model → inspect cycles.</li>
            <li>Simulate → productivity, waste, cost.</li>
            <li>Optional Sensitivity, AI Assistant, Excel / PNG.</li>
          </ol>
        </section>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Studio co-pilot
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 7 — AI Assistant
          </h2>
          <div className="gold-rule my-3 max-w-xs" />

          <p className="text-[15px] leading-[1.7]">
            Educational <strong className="text-foreground">co-pilot</strong> bound to the current
            Format Prompt, drawn network, and last simulation/sensitivity results—not a black-box
            simulator.
          </p>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.1 Purpose</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>
              <strong className="text-foreground">Stay grounded</strong> — current prompt, network,
              last-run metrics only
            </li>
            <li>
              <strong className="text-foreground">Teach Halpin ideas</strong> — flow, idleness
              (waste), steady state, unit cost, GEN/CON
            </li>
            <li>
              <strong className="text-foreground">Propose safe edits</strong> — you Apply → Draw →
              Simulate
            </li>
            <li>
              <strong className="text-foreground">Reduce friction</strong> — fleet counts,
              bottleneck, productivity checks
            </li>
          </ul>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            7.2 Technology
          </h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>
              <strong className="text-foreground">AI mode</strong> —{" "}
              <code className="text-foreground">XAI_API_KEY</code> on Vercel → xAI chat + studio
              context
            </li>
            <li>
              <strong className="text-foreground">Local mode</strong> — no key → English-first intent
              helper
            </li>
            <li>
              <strong className="text-foreground">Language</strong> — English-first (international
              product)
            </li>
          </ul>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            7.3 What it can do
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Explain cycles, COMBI/NORMAL, counter, GEN/CON, branch</li>
            <li>Report fleet counts from Format Prompt</li>
            <li>Interpret last-run productivity, steady state, unit cost, idleness</li>
            <li>Identify bottleneck (high idle vs high busy)</li>
            <li>Propose Format Prompt edits (Apply required)</li>
          </ul>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            7.4 What it cannot do
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Auto-run simulation after an edit</li>
            <li>Invent a different operation as “current”</li>
            <li>Replace the CYCLONE engine with black-box AI simulation</li>
            <li>Answer unrelated topics</li>
            <li>Apply prompt changes without confirmation</li>
          </ul>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            7.5 Recommended questions
          </h3>
          <p className="mt-2 text-xs font-medium text-foreground">Model</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
            <li>Explain this model’s resource cycles.</li>
            <li>Which tasks are COMBI and which are NORMAL?</li>
            <li>Where is the production counter?</li>
            <li>How do GEN and CON work in this model?</li>
          </ul>
          <p className="mt-3 text-xs font-medium text-foreground">Fleet & results</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
            <li>How many of each resource are in the Format Prompt?</li>
            <li>Which resource has the highest idleness (waste)?</li>
            <li>What is the likely bottleneck resource?</li>
            <li>What was last-run productivity (units/hour)?</li>
            <li>Has the system reached steady state?</li>
            <li>What is the unit cost (USD)?</li>
          </ul>
          <p className="mt-3 text-xs font-medium text-foreground">Edits</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
            <li>Set trucks to 8.</li>
            <li>Increase loaders to 2.</li>
            <li>Change a task duration distribution.</li>
          </ul>
          <p className="mt-3 text-xs font-medium text-foreground">Teaching</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
            <li>What is home-QUEUE idleness and why is it waste?</li>
            <li>Why must every resource have a queue in a CYCLONE cycle?</li>
          </ul>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.6 Boundary</h3>
          <p className="mt-2 rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[13px] leading-relaxed text-foreground">
            The AI Assistant answers only about the <strong>current</strong> Format Prompt, drawn
            network, and <strong>last</strong> results. It may <strong>propose</strong> edits; you must{" "}
            <strong>Apply</strong>, <strong>Draw Model</strong>, and <strong>Simulate</strong>.
          </p>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            7.7 Workflow
          </h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs">
            <li>Example or Format Prompt → Draw Model → Simulate.</li>
            <li>Open AI Assistant under Results.</li>
            <li>Ask about productivity, idleness, or bottleneck.</li>
            <li>If a prompt is proposed → Apply → Draw → Simulate again.</li>
          </ol>

          <p className="mt-4 text-[11px] text-muted-foreground">
            Full text also in <code className="text-foreground">docs/USER_MANUAL.md</code> Chapter 7.
          </p>
        </section>

        <Section title="Chapter 8 — Limits & deploy">
          <ul className="list-disc space-y-1.5 pl-5 text-xs">
            <li>Max cycles 100 default / 500 max; seed 12345.</li>
            <li>Deploy: GitHub main → Vercel. Optional XAI_API_KEY for full AI mode.</li>
          </ul>
        </Section>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Literature
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 9 — References
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mb-4 text-xs">
            Selected works on CYCLONE, MicroCYCLONE, and applications from Daniel W. Halpin and
            collaborators. Full bibliography:{" "}
            <code className="text-foreground">docs/USER_MANUAL.md</code>.
          </p>
          <ol className="list-decimal space-y-1 pl-5 text-xs">
            <li>Halpin (1973, 1977); Halpin & Riggs (1992).</li>
            <li>MicroCYCLONE manuals; DISCO; PROSIDYC; COST; WebCYCLONE.</li>
            <li>AbouRizk, STROBOSCOPE, Simphony lineage.</li>
          </ol>
        </section>

        <p className="text-center text-xs text-muted-foreground">
          {PRODUCT_TAGLINE}
          <span className="mx-1.5">·</span>
          {PRODUCT_DEDICATION} · Manual v1.6
        </p>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      <div className="gold-rule my-2 max-w-xs" />
      <div className="mt-2">{children}</div>
    </section>
  );
}
