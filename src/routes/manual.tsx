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
              v1.5
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
              <strong className="text-foreground">AI-Assisted Construction Operation Simulation</strong>{" "}
              — an <strong className="text-foreground">educational web app</strong> for modeling and
              simulating <strong className="text-foreground">repetitive construction operations</strong>{" "}
              in the spirit of Professor{" "}
              <strong className="text-foreground">Daniel W. Halpin’s CYCLONE</strong>{" "}
              (<em>CYCLic Operations NEtwork</em>).
            </p>
            <p>
              It is meant for first contact with construction operations as flow, measuring idleness,
              connecting process design to Lean Construction / Project Production Management, and
              learning classic MicroCYCLONE ideas without old desktop software.
            </p>
            <p>
              It is <strong className="text-foreground">not</strong> a special-purpose industrial
              factory controller. It is a <strong className="text-foreground">teaching studio</strong>.
            </p>
          </div>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            1.2 Why this exists (dedication)
          </h3>
          <div className="mt-2 space-y-3 text-[15px] leading-[1.7]">
            <p>
              This product is a <strong className="text-foreground">tribute to Professor Daniel W.
              Halpin</strong>. Through his teaching and work, many students first met flow, idleness,
              and CYCLONE as a simple network language for cyclic construction work.
            </p>
            <p>
              Historical line: <strong className="text-foreground">CYCLONE</strong> (methodology),
              <strong className="text-foreground">MicroCYCLONE</strong> (early computer tool), then
              DISCO, PROSIDYC, COST, WebCYCLONE, Simphony / Symphony.Net, and related systems.
            </p>
            <p>
              Halpin’s foundation is not obsolete in the age of AI — it is the{" "}
              <strong className="text-foreground">grammar</strong> that lets us describe an operation
              clearly enough that a machine can build a model and run a simulation.
            </p>
          </div>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            1.3 Approach — is this an “AI agent”?
          </h3>
          <div className="mt-2 space-y-3 text-[15px] leading-[1.7]">
            <p className="rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[14px] text-foreground">
              <strong>Product term:</strong> {PRODUCT_TAGLINE}. <strong>Dedication:</strong>{" "}
              {PRODUCT_DEDICATION}. In practice: prompt-first → <strong>Draw Model</strong> → check
              network → <strong>Simulate</strong>. See Chapter 8 for the literature behind this tradition.
            </p>
          </div>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            1.4 Studio layout
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>
              <strong className="text-foreground">Left:</strong> Prompt · Example · Draw Model · Format
              Prompt
            </li>
            <li>
              <strong className="text-foreground">Right:</strong> CYCLONE Model · network logic · run
              parameters
            </li>
            <li>
              <strong className="text-foreground">Below:</strong> Results — Simulation · Sensitivity
              Analysis
            </li>
          </ul>
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
            <li>Select an Example (fills prompt only) or write a Format Prompt.</li>
            <li>
              Click <strong className="text-foreground">Draw Model</strong> — inspect cycles, meetings,
              counter.
            </li>
            <li>Set max cycles (default 100, limit 500) and seed (default 12345).</li>
            <li>
              Click <strong className="text-foreground">Simulate</strong> — productivity, waste, cost.
            </li>
            <li>Optional Sensitivity tab and Excel / PNG export.</li>
          </ol>
        </section>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Part III — Teaching examples
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 3 — Six Examples
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ol className="list-decimal space-y-1 pl-5 text-xs">
            <li>Earthmoving — classic fleet; cost; steady state</li>
            <li>Asphalt Paving — branch probability</li>
            <li>Loading Dump Truck — GEN / CON</li>
            <li>Tower Crane — multi-demand, Priority, multi-counter</li>
            <li>Masonry — face stocks; sensitivity intro</li>
            <li>Precast Plant — Halpin Ch.14-style + complex SA</li>
          </ol>
        </section>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Part IV — Format Prompt & rules
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 4 — Format Prompt
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mb-2 text-xs">
            Block order: Network → Durations → Priority → Branch → Cost → Sensitivity (last).
          </p>
          <pre className="overflow-x-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[11px] text-foreground">
            {GENERAL_TEMPLATE}
          </pre>
        </section>

        <Section title="Distributions (minutes)">
          <pre className="overflow-x-auto rounded-[var(--radius-md)] border border-border bg-background p-3 font-mono text-[11px] text-foreground">
            {DIST_TABLE}
          </pre>
        </Section>

        <Section title="Chapter 5–7 — Rules, results, limits">
          <ul className="list-disc space-y-1.5 pl-5 text-xs">
            <li>Home QUEUE per resource; COMBI if ≥2 resources meet; return only to home QUEUE.</li>
            <li>GEN ▽ / CON △ optional and independent; exact Counter after: names.</li>
            <li>Results: production by cycle, steady state, idleness, cost, sensitivity tabs.</li>
            <li>Max cycles 100 default / 500 max; seed 12345; deploy from GitHub main → Vercel.</li>
          </ul>
        </Section>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Literature
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 8 — References
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mb-4 text-xs">
            Selected works on <strong className="text-foreground">CYCLONE</strong>,{" "}
            <strong className="text-foreground">MicroCYCLONE</strong>, and applications from{" "}
            <strong className="text-foreground">Daniel W. Halpin</strong>, his students, and
            collaborators.
          </p>

          <h3 className="font-display text-sm font-semibold text-foreground">Foundations</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed">
            <li>
              <strong className="text-foreground">Halpin, D. W.</strong> (1973). Ph.D. dissertation,
              University of Illinois at Urbana–Champaign.
            </li>
            <li>
              <strong className="text-foreground">Halpin, D. W.</strong> (1977). “CYCLONE: Method for
              Modeling of Job Site Processes.” <em>J. Constr. Div.</em>, ASCE, 103(3), 489–499.
            </li>
            <li>
              <strong className="text-foreground">Halpin, D. W., & Riggs, L. S.</strong> (1992).{" "}
              <em>Planning and Analysis of Construction Operations</em>. Wiley.
            </li>
          </ol>

          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">MicroCYCLONE</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed" start={4}>
            <li>
              <strong className="text-foreground">Lluch, J., & Halpin, D. W.</strong> (1982).{" "}
              <em>J. Constr. Div.</em>, ASCE, 108(1), 129–145.
            </li>
            <li>
              <strong className="text-foreground">Halpin, D. W.</strong> (1990–1992). MicroCYCLONE
              User / System manuals. Purdue / Learning Systems.
            </li>
          </ol>

          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">DISCO</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed" start={6}>
            <li>
              <strong className="text-foreground">Huang, R.-Y., & Halpin, D. W.</strong> (1993–1995).
              DISCO papers (ISARC, <em>Microcomputers in Civil Engineering</em>, <em>J. Constr. Eng.
              Manage.</em>).
            </li>
            <li>
              <strong className="text-foreground">Huang, R.-Y.</strong> (1994). Ph.D., Purdue (advisor:
              Halpin).
            </li>
          </ol>

          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">
            PROSIDYC · COST · WebCYCLONE
          </h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed" start={8}>
            <li>
              <strong className="text-foreground">Halpin, D. W., & Martinez, L.-H.</strong> (1999).
              PROSIDYC. <em>WSC</em>.
            </li>
            <li>
              <strong className="text-foreground">Cheng, T.-M., et al.</strong> (2000). COST. <em>17th
              ISARC</em>.
            </li>
            <li>
              <strong className="text-foreground">Halpin, D. W., Jen, H., & Kim, J.</strong> (2003).
              WebCYCLONE. <em>WSC</em>.
            </li>
          </ol>

          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">
            Purdue circle & lineage
          </h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed" start={11}>
            <li>
              AbouRizk & Halpin; Hijazi; Lutz; Gonzalez-Quevedo; Abraham; Halpin et al. project-level
              CYCLONE; AbouRizk et al. (2011).
            </li>
            <li>UM-CYCLONE (Ioannou); STROBOSCOPE (Martinez); Simphony / Simphony.NET (AbouRizk et al.).</li>
          </ol>

          <p className="mt-4 rounded-[var(--radius-md)] border border-border bg-muted/20 px-3 py-2.5 text-xs">
            Neo-CYCLONE does <strong className="text-foreground">not</strong> replace those systems. It
            is <strong className="text-foreground">{PRODUCT_TAGLINE}</strong>. Full bibliography:{" "}
            <code className="text-foreground">docs/USER_MANUAL.md</code> in the repository.
          </p>
        </section>

        <section className="rounded-[var(--radius-md)] border border-border bg-muted/20 px-4 py-3">
          <p className="font-mono text-[11px] leading-relaxed text-foreground">
            1. Select Example OR write Format Prompt{"\n"}
            2. Draw Model → inspect cycles / meetings / counter{"\n"}
            3. Simulate → productivity, waste, cost{"\n"}
            4. Sensitivity → if Sensitivity: block present{"\n"}
            5. Export → Excel / PNG as needed
          </p>
        </section>

        <p className="text-center text-xs text-muted-foreground">
          {PRODUCT_TAGLINE}
          <span className="mx-1.5">·</span>
          {PRODUCT_DEDICATION} · Manual v1.5
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
