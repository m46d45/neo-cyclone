import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DEFAULT_EXAMPLE_PROMPT,
  DIST_TABLE,
  GENERAL_TEMPLATE,
  PRODUCT_TAGLINE,
} from "@/lib/cyclone/prompt-template";

export const Route = createFileRoute("/manual")({ component: ManualPage });

function ManualPage() {
  return (
    <div className="halpin-shell min-h-dvh text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md pt-[var(--grok-banner-h,0px)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            <h1 className="font-display text-base font-semibold">Neo-CYCLONE Manual</h1>
            <Badge variant="secondary" className="border-primary/25 bg-primary/10 text-primary">
              v0.5
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

      <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
            {PRODUCT_TAGLINE}
          </p>
          <h2 className="font-display mt-2 text-xl font-semibold text-foreground">
            English product · Halpin CYCLONE methodology
          </h2>
          <p className="mt-3">
            Write a general cyclic construction operation, draw the model, set cycles and seed, then
            simulate. All UI and documentation are in English.
          </p>
        </section>

        <Section title="1. Workflow">
          <pre className="rounded-[var(--radius-md)] border border-border bg-background p-3 font-mono text-[11px] text-foreground">
            {`Prompt → Draw Model → refine
       → Max cycles / Seed / Max time
       → Simulate → Results`}
          </pre>
        </Section>

        <Section title="2. Prompt format">
          <pre className="overflow-x-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[11px] text-foreground">
            {GENERAL_TEMPLATE}
          </pre>
        </Section>

        <Section title="3. Distributions (minutes)">
          <pre className="overflow-x-auto rounded-[var(--radius-md)] border border-border bg-background p-3 font-mono text-[11px] text-foreground">
            {DIST_TABLE}
          </pre>
        </Section>

        <Section title="4. Default example (replace me)">
          <pre className="overflow-x-auto rounded-[var(--radius-md)] border border-border bg-background p-3 font-mono text-[11px] text-foreground">
            {DEFAULT_EXAMPLE_PROMPT}
          </pre>
        </Section>

        <Section title="5. Run defaults">
          <ul className="list-disc space-y-1 pl-5 text-xs">
            <li>Seed: <strong className="text-foreground">12345</strong></li>
            <li>Durations: minutes</li>
            <li>Max cycles & max time: set under the diagram before Simulate</li>
          </ul>
        </Section>
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
