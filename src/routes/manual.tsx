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
              v1.1
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
              This work is a{" "}
              <strong className="text-foreground">tribute to Professor Daniel W. Halpin</strong>.
            </p>
            <p>
              I am a construction management educator and researcher who studied under Professor
              Halpin and also worked for him. Through him I first met{" "}
              <strong className="text-foreground">construction operations</strong> as a serious
              subject: production on site as a <strong className="text-foreground">flow</strong>, and{" "}
              <strong className="text-foreground">idleness</strong> (waiting, waste) as something we
              can see, model, and improve.
            </p>

            <h3 className="font-display pt-1 text-base font-semibold text-foreground">
              CYCLONE as model, MicroCYCLONE as early application
            </h3>
            <p>
              <strong className="text-foreground">CYCLONE</strong> (
              <em>CYCLic Operations NEtwork</em>) is the{" "}
              <strong className="text-foreground">modeling methodology</strong> Halpin introduced in
              the 1970s: queues, constrained and unconstrained work, counters, and cyclic resource
              logic. <strong className="text-foreground">MicroCYCLONE</strong> is an early{" "}
              <strong className="text-foreground">computer application</strong> of that methodology—a
              microcomputer discrete-event / Monte Carlo system (Purdue, c. 1990) that made the
              models runnable on personal computers and became a main teaching vehicle.
            </p>
            <p>
              Later systems—<strong className="text-foreground">DISCO</strong>,{" "}
              <strong className="text-foreground">PROSIDYC</strong>,{" "}
              <strong className="text-foreground">COST</strong>,{" "}
              <strong className="text-foreground">WebCYCLONE</strong>,{" "}
              <strong className="text-foreground">Symphony.Net</strong>, and others—extended platforms
              around the same idea rather than replacing the model.
            </p>
            <p>
              <strong className="text-foreground">Neo-CYCLONE</strong> is for{" "}
              <strong className="text-foreground">education</strong> and{" "}
              <strong className="text-foreground">first contact</strong>, not a special-purpose
              industrial simulator: introduce construction operations; show why simulation belongs
              in process design; and connect to{" "}
              <strong className="text-foreground">Lean Construction</strong> and{" "}
              <strong className="text-foreground">Project Production Management</strong>.
            </p>
            <p className="rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[14px] text-foreground">
              <strong>What you should leave with:</strong> one clear resource cycle (home queue →
              work → return), a reading of idleness and utilization, and a sense that process design
              matters before “optimizing” with more technology.
            </p>
            <p>
              This literacy is still scarce. The long effort to teach CYCLONE and MicroCYCLONE was
              not made obsolete by AI—it laid the{" "}
              <strong className="text-foreground">foundation</strong>. Without resources, queues,
              constrained work, cycles, and production as clear concepts, AI for construction
              simulation would have little to stand on. Neo-CYCLONE is an{" "}
              <strong className="text-foreground">AI-assisted</strong> doorway into that tradition:
              learn faster, go deeper, and keep modeling construction as a production system.
            </p>
            <p className="text-xs text-muted-foreground">
              Literature: Halpin (1970s CYCLONE); Halpin & Woodhead; Halpin MicroCYCLONE manuals
              (Purdue, c. 1990); Halpin & Riggs,{" "}
              <em>Planning and Analysis of Construction Operations</em> (Wiley, 1992); later tools
              (DISCO, PROSIDYC, COST, WebCYCLONE).
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
              CYCLONE model; AI-assisted heir to the MicroCYCLONE teaching tradition
            </li>
            <li>
              <strong className="text-foreground">Is not:</strong> a drop-in replacement of
              MicroCYCLONE / DISCO / WebCYCLONE
            </li>
          </ul>
        </Section>

        <Section title="Results, cost, sensitivity, export">
          <ul className="list-disc space-y-1.5 pl-5 text-xs">
            <li>
              MicroCYCLONE-style process report, element tables, production-by-cycle, charts.
            </li>
            <li>
              Optional <strong className="text-foreground">cost (USD/h)</strong> and{" "}
              <strong className="text-foreground">Sensitivity:</strong> block in the prompt.
            </li>
            <li>
              <strong className="text-foreground">Report .md / .txt</strong> download after Simulate.
            </li>
            <li>
              Diagram and charts: zoom +/− and <strong className="text-foreground">PNG</strong> export.
            </li>
            <li>
              Function nodes: <strong className="text-foreground">GEN</strong> on QUEUE,{" "}
              <strong className="text-foreground">CON</strong>, probabilistic{" "}
              <strong className="text-foreground">branch p</strong> (Results → Branches).
            </li>
          </ul>
        </Section>

        <Section title="Deploy">
          <p className="text-xs">
            Production site is built from GitHub <code className="text-foreground">main</code> (Vercel).
            Preview work in Grok Build is only live on the public site after a successful push/deploy.
          </p>
        </Section>

        <Section title="Notation standard (canonical)">
          <p className="mb-2 text-xs">
            Neo-CYCLONE keeps one consistent teaching notation. Where it differs from some
            Halpin print figures, <strong className="text-foreground">this standard wins</strong>{" "}
            for the app. Full reference in the repo:{" "}
            <code className="text-foreground">docs/NOTATION_STANDARD.md</code>.
          </p>

          <h4 className="mb-1 text-xs font-semibold text-foreground">Node shapes</h4>
          <div className="mb-3 overflow-x-auto">
            <table className="w-full min-w-[280px] text-left text-xs">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-wide">
                  <th className="py-1.5 pr-3 font-medium text-foreground">Element</th>
                  <th className="py-1.5 font-medium text-foreground">Drawing / label</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-3 text-foreground">QUEUE</td>
                  <td className="py-1.5">Q-circle · n=… · optional <strong className="text-foreground">GEN k</strong></td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-3 text-foreground">COMBI</td>
                  <td className="py-1.5">Cut-corner square · duration</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-3 text-foreground">NORMAL</td>
                  <td className="py-1.5">Rectangle · duration</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-3 text-foreground">COUNTER</td>
                  <td className="py-1.5">Golf flag · +production</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-3 text-foreground">CONSOLIDATE</td>
                  <td className="py-1.5">Upright triangle · <strong className="text-foreground">CON n</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="mb-1 text-xs font-semibold text-foreground">Arrows (always with tip)</h4>
          <div className="mb-3 overflow-x-auto">
            <table className="w-full min-w-[280px] text-left text-xs">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-wide">
                  <th className="py-1.5 pr-3 font-medium text-foreground">Style</th>
                  <th className="py-1.5 font-medium text-foreground">Meaning</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-3 text-foreground">Solid black + tip</td>
                  <td className="py-1.5">
                    <strong className="text-foreground">Forward</strong> — work toward production
                    (COUNTER)
                  </td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-3 text-foreground">Dashed gold + tip</td>
                  <td className="py-1.5">
                    <strong className="text-foreground">Return</strong> — into a QUEUE (resource
                    cycle)
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-3 text-foreground">p=… label</td>
                  <td className="py-1.5">Probabilistic branch on multi-out</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-3 text-xs">
            Every arc is a directed <strong className="text-foreground">arrow</strong>, never a
            plain line. Legend appears on the diagram canvas.
          </p>

          <h4 className="mb-1 text-xs font-semibold text-foreground">Priority (shared resource)</h4>
          <ul className="mb-3 list-disc space-y-1.5 pl-5 text-xs">
            <li>
              Prompt block <code className="text-foreground">Priority:</code> then{" "}
              <code className="text-foreground">Task: 1</code> —{" "}
              <strong className="text-foreground">lower number = higher priority</strong>{" "}
              (MicroCYCLONE node-number tradition).
            </li>
            <li>
              Stored on COMBI as <code className="text-foreground">priority</code>; diagram shows{" "}
              <code className="text-foreground">P1</code>, <code className="text-foreground">P2</code>…
            </li>
            <li>
              Multi-demand shared pool:{" "}
              <code className="text-foreground">Crane: Lift A | Lift B | Lift C</code>
            </li>
            <li>Example preset: Tower crane multi-demand (priority).</li>
          </ul>
          <h4 className="mb-1 text-xs font-semibold text-foreground">GEN and CON (writing standard)</h4>
          <ul className="list-disc space-y-1.5 pl-5 text-xs">
            <li>
              <strong className="text-foreground">GEN k</strong> — only on QUEUE. Diagram:{" "}
              <code className="text-foreground">GEN k</code>. DSL:{" "}
              <code className="text-foreground">generate: k</code> (k≥2). Each{" "}
              <em>arrival</em> becomes k units; does not multiply initial.
            </li>
            <li>
              <strong className="text-foreground">CON n</strong> — CONSOLIDATE triangle. Diagram:{" "}
              <code className="text-foreground">CON n</code>. DSL:{" "}
              <code className="text-foreground">consolidate: n</code> (n≥2). Buffer n → release 1
              (time 0).
            </li>
            <li>
              GEN and CON are <strong className="text-foreground">independent</strong> — use one,
              both, or neither. Classic pair multiplies then reunites production units.
            </li>
            <li>
              Do not put probability on COMBI multi-out used only for resource return.
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
