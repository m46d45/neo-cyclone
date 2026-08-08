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
              v0.8
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
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
            {PRODUCT_TAGLINE}
          </p>
          <h2 className="font-display mt-2 text-xl font-semibold text-foreground">
            Preface — Why Neo-CYCLONE
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <div className="space-y-4 text-[15px] leading-[1.7]">
            <p>
              This work is first of all a{" "}
              <strong className="text-foreground">tribute to Professor Daniel W. Halpin</strong>.
            </p>
            <p>
              I am a construction management educator and researcher who studied under Professor
              Halpin and also had the privilege of working for him. Through him I first met{" "}
              <strong className="text-foreground">construction operations</strong> as a serious
              subject: the idea that production on site is a{" "}
              <strong className="text-foreground">flow</strong>, and that{" "}
              <strong className="text-foreground">idleness</strong> (waiting, waste) is not an
              accident but something we can see, model, and improve. That way of seeing construction
              shaped how I think about process design.
            </p>

            <h3 className="font-display pt-1 text-base font-semibold text-foreground">
              CYCLONE as model, MicroCYCLONE as early application
            </h3>
            <p>
              In the literature, two layers should stay distinct.{" "}
              <strong className="text-foreground">CYCLONE</strong> (
              <em>CYCLic Operations NEtwork</em> / CYCLic Operation Networks) is the{" "}
              <strong className="text-foreground">modeling methodology</strong> Halpin introduced in
              the 1970s: queues, constrained and unconstrained work, counters, and cyclic resource
              logic for construction operations.{" "}
              <strong className="text-foreground">MicroCYCLONE</strong> is an early{" "}
              <strong className="text-foreground">computer application</strong> of that methodology—a
              microcomputer discrete-event / Monte Carlo system (Purdue manuals, c. 1990) that made
              CYCLONE models runnable on personal computers and became a main teaching vehicle in
              academia.
            </p>
            <p className="rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[14px] text-foreground">
              <strong>In short:</strong> CYCLONE is the model; MicroCYCLONE was a principal early
              software embodiment. Later systems extended platforms and interfaces around the same
              cyclic-network idea—e.g. DISCO (often as graphical support for MicroCYCLONE), PROSIDYC,
              COST, WebCYCLONE, Symphony.Net, and others developed with students and colleagues.
            </p>
            <p>
              Those systems were hard-won: built when explaining operations, queues, and simulation
              to students and industry was already an uphill fight.
            </p>
            <p>
              <strong className="text-foreground">
                Neo-CYCLONE is not a special-purpose industrial simulator
              </strong>{" "}
              meant to replace research-grade or commercial engines. Its purpose is{" "}
              <strong className="text-foreground">education</strong> and{" "}
              <strong className="text-foreground">first contact</strong>: to introduce construction
              operations; to show why simulation belongs in the design of construction processes;
              and to connect that design thinking to{" "}
              <strong className="text-foreground">Lean Construction</strong> and{" "}
              <strong className="text-foreground">Project Production Management</strong>, where
              flow, cycle time, utilization, and waste are central.
            </p>
            <p className="rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[14px] text-foreground">
              <strong>What you should leave with:</strong> after a short session, you can state one
              resource cycle (home queue → work → return), read idleness and utilization from the
              results, and see why process design matters before “optimizing” with more technology.
            </p>
            <p>
              I know how scarce this literacy still is. Even today, the importance of operations and
              of simulation for high-performing construction is too little known, too little taught,
              and too rarely implemented. Looking back, one might even feel that the struggle of the
              1970s and after—to put CYCLONE and MicroCYCLONE in front of students and
              practitioners—was somehow made obsolete by AI.{" "}
              <strong className="text-foreground">It was not wasted.</strong>
            </p>
            <p>
              That work laid a <strong className="text-foreground">foundation</strong>. Without
              clear concepts of resources, queues, constrained work, cycles, and production, “AI for
              construction simulation” would have nothing solid to stand on. Halpin’s legacy is what
              makes it possible, now and in the future, to use AI{" "}
              <em className="text-foreground">with</em> rigorous operations models rather than
              instead of them.
            </p>
            <p>
              Neo-CYCLONE is my way of looking back with gratitude—and looking forward: an{" "}
              <strong className="text-foreground">AI-assisted</strong> doorway into the same
              tradition—the <strong className="text-foreground">CYCLONE model</strong>, first widely
              practiced through <strong className="text-foreground">MicroCYCLONE</strong> and then
              through its descendants—so that the next generation can learn faster, go deeper, and
              still respect the craft of modeling construction as a production system.
            </p>
            <p className="text-xs text-muted-foreground">
              Literature anchors: Halpin (1970s CYCLONE methodology); Halpin & Woodhead; Halpin
              MicroCYCLONE manuals (Purdue, c. 1990); Halpin & Riggs,{" "}
              <em>Planning and Analysis of Construction Operations</em> (Wiley, 1992); later
              CYCLONE-format tools (DISCO, PROSIDYC, COST, WebCYCLONE, and related systems).
            </p>
          </div>
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
            <li>
              Seed: <strong className="text-foreground">12345</strong>
            </li>
            <li>Durations: minutes</li>
            <li>Max cycles & max time: set under the diagram before Simulate</li>
          </ul>
        </Section>

        <Section title="6. Product intent">
          <ul className="list-disc space-y-1 pl-5 text-xs">
            <li>
              <strong className="text-foreground">Is:</strong> educational first contact with the
              CYCLONE <em>model</em>; AI-assisted heir to the MicroCYCLONE teaching tradition
            </li>
            <li>
              <strong className="text-foreground">Is not:</strong> a drop-in replacement of
              MicroCYCLONE / DISCO / WebCYCLONE / research-grade engines
            </li>
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
