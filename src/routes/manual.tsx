import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GENERAL_TEMPLATE,
  PRODUCT_DEDICATION,
  PRODUCT_TAGLINE,
  PRODUCT_VERSION,
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
              v{PRODUCT_VERSION}
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

      <main className="mx-auto max-w-3xl space-y-14 px-4 py-8 text-sm leading-relaxed text-muted-foreground">
        {/* Title card */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">{PRODUCT_TAGLINE}</p>
          <p className="mt-1 text-xs text-muted-foreground">{PRODUCT_DEDICATION}</p>
          <p className="mt-4 text-[13px] leading-relaxed text-foreground/90">
            This manual is written for students, instructors, and practitioners who want to{" "}
            <em>understand</em> construction operations as flow—not only to click buttons. Read it
            top to bottom (~25–40 minutes) or jump by chapter. Keep the studio open beside you when
            you reach the first hands-on chapter.
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Canonical source also lives in <code className="text-foreground">docs/USER_MANUAL.md</code>.
            Notation detail: <code className="text-foreground">docs/NOTATION_STANDARD.md</code>.
          </p>
        </div>

        {/* Prologue */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Prologue — Why this studio exists</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <div className="space-y-3 text-[13px] leading-relaxed text-foreground/90">
            <p>
              Construction work is full of <strong>repetition</strong>: load and haul, pour and return,
              lift and place. Between those busy moments, resources wait. A truck queues at a loader. A
              crane sits while a crew finishes tying rebar. That waiting is not always “laziness”; it is
              often <strong>the structure of the process</strong>.
            </p>
            <p>
              Professor <strong>Daniel W. Halpin</strong> spent a career making that structure{" "}
              <em>visible</em>. His <strong>CYCLONE</strong> language (<em>CYCLic Operations NEtwork</em>)
              gave operations a simple network grammar: resources cycle through queues and work, meet when
              they must, and count completed production. From that grammar grew tools—MicroCYCLONE, then
              DISCO, PROSIDYC, COST, WebCYCLONE, and a wider family of construction simulation systems
              (Chapter 9).
            </p>
            <p>
              <strong>Neo-CYCLONE</strong> is not a replacement for those research systems. It is a{" "}
              <strong>teaching studio</strong>: a place to meet Halpin’s ideas again, with a modern browser
              interface and an AI Assistant that stays tied to <em>your</em> model. The product name is
              deliberate:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
              <li>
                <strong className="text-foreground">{PRODUCT_TAGLINE}</strong> — the honest product description
              </li>
              <li>
                <strong className="text-foreground">{PRODUCT_DEDICATION}</strong> — the dedication line
              </li>
            </ul>
            <p>
              AI here does not invent a new physics of construction. The <strong>engine</strong> is still a
              discrete-event CYCLONE-style simulator. AI helps you phrase, inspect, and question the model.
              You remain responsible for Draw Model, Simulate, and judgment.
            </p>
            <p className="rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[13px] text-foreground">
              If you leave this manual with one habit, let it be this:{" "}
              <strong>draw the cycles until they tell the truth, then run the numbers</strong>.
            </p>
          </div>
        </section>

        {/* Chapter 1 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part I — Ideas before buttons</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 1 — Operations, flow, and idleness
          </h2>
          <div className="gold-rule my-3 max-w-xs" />

          <h3 className="font-display text-base font-semibold text-foreground">1.1 What we mean by “construction operation”</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            An <em>operation</em> here is a <strong>repeatable production process</strong>—often measured in
            units per hour—not the whole project Gantt chart. Earthmoving a cut, paving a lane, loading dump
            trucks, serving three zones with one crane, stocking brick and mortar, or cycling forms in a
            precast yard: each has resources, tasks, and waiting.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            Thinking at the operation level matters for <strong>Lean Construction</strong> and{" "}
            <strong>Project Production Management</strong>. Before you optimize a schedule bar, you need to
            see whether the <em>process</em> itself produces flow or waste.
          </p>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.2 Flow and idleness</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            In CYCLONE thinking, a resource that is not working is usually <strong>in a queue</strong>—waiting
            for a partner, a space, or a task to open. That waiting time is <strong>idleness</strong>. It is
            not a moral failure; it is a signal: too few trucks → loader idle; too many trucks → truck queue
            grows; shared crane with wrong priority → one zone starves.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            Neo-CYCLONE reports <strong>idle %</strong> and <strong>busy %</strong> so those signals are hard
            to ignore. When you later hear “waste” in Lean language, you already have a picture for it.
          </p>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.3 Why a network language?</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            Paragraphs of natural language can describe an operation. Networks force clarity: which resources
            exist, in what order they work, where they wait, where two resources <strong>meet</strong>, and
            what counts as <strong>one unit of production</strong>. CYCLONE answered those questions with a
            small set of node types. Neo-CYCLONE keeps that spirit—even when diagram styling (solid black
            forward arcs, dashed gold returns) is tuned for teaching clarity.
          </p>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.4 What Neo-CYCLONE is — and is not</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>
              <strong className="text-foreground">Is:</strong> browser teaching studio; prompt → diagram →
              discrete-event simulation; MicroCYCLONE-style reports; English-first classroom limits
            </li>
            <li>
              <strong className="text-foreground">Is not:</strong> project ERP; black-box “AI that simulates
              without a model”; unlimited free chat API; a system that requires sign-in to learn
            </li>
          </ul>
        </section>

        {/* Chapter 2 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part II — Your first hour</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 2 — Fifteen minutes that stick (Earthmoving)
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            A guided first run. Do it once with Example 1 even if you already “know trucks.”
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.1 Open the studio</h3>
          <p className="mt-2 text-xs leading-relaxed">
            Left: prompt, Example dropdown, <strong className="text-foreground">Draw Model</strong>. Right:
            CYCLONE Model (empty until you draw). Later below: Results and AI Assistant. Header: Manual.
            Footer: product, version, year.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.2 Load Example 1 — Earthmoving</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed">
            <li>
              Example → <strong className="text-foreground">1. Earthmoving</strong>. Read the prompt: notes,{" "}
              <code className="text-foreground">Operation: Earthmoving</code>, truck cycle, loader at Load,
              counter after Dump, cost, durations in minutes.
            </li>
            <li>
              In plain language: trucks load–haul–dump–return; loader meets trucks at Load (COMBI); production
              counts after Dump (e.g. 12 m³).
            </li>
            <li>
              Click <strong className="text-foreground">Draw Model</strong> (examples do not auto-draw).
            </li>
            <li>
              Confirm home QUEUEs, COMBI Load, truck tasks, COUNTER, solid black forward arcs and dashed gold
              returns. Fix and re-draw until the picture matches the story—then Simulate.
            </li>
          </ol>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.3 Run parameters</h3>
          <p className="mt-2 text-xs leading-relaxed">
            <strong className="text-foreground">Max cycles</strong>: default 100, hard max 500.{" "}
            <strong className="text-foreground">Seed</strong>: default 12345 — same seed + same model + same
            limit → identical stochastic results. Dice picks another seed on purpose. Seed is for
            reproducibility (homework, papers), not a fleet decision.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.4 Simulate and read</h3>
          <p className="mt-2 text-xs leading-relaxed">
            Open <strong className="text-foreground">Simulation</strong>: Process Report first, then units/hour
            by cycle (from cycle 0). Does productivity settle? The steady-state guide (~5% over ≥10 cycles)
            appears as an old-gold dashed line. Then idleness: who waits, who works—often the best classroom
            discussion. Cost Report appears when rates exist (unit cost = total ÷ production).
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.5 Export once</h3>
          <p className="mt-2 text-xs leading-relaxed">
            Report Excel (name prefers Operation:), chart PNG, diagram PNG. For assignments record seed, max
            cycles, and Operation name.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.6 Optional AI Assistant</h3>
          <p className="mt-2 text-xs leading-relaxed">
            Guidance lives in the input <strong className="text-foreground">placeholder</strong>. Try general
            chips: resources, bottleneck, productivity, unit cost. Replies ≤20 lines; bound to this model and
            last run. Proposed prompts need <strong className="text-foreground">Apply</strong> → Draw Model →
            Simulate.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.7 Quick path</h3>
          <p className="mt-2 text-xs">
            Example or Format Prompt → Draw Model → check cycles → cycles & seed → Simulate → Sensitivity
            (if planned) → AI Assistant (optional) → Export.
          </p>
        </section>

        {/* Chapter 3 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part III — Format Prompt</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 3 — How to talk so the studio can build a network
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            You do not draw QUEUE circles by hand. You describe <strong>resource cycles</strong>; the builder
            creates queues, tasks, and arcs. Students learn the logic of cycles, not pixel-pushing.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">3.1–3.2 Comments and Operation</h3>
          <p className="mt-2 text-xs leading-relaxed">
            <code className="text-foreground">#</code> / <code className="text-foreground">//</code> = notes
            only. First data line after notes:{" "}
            <code className="text-foreground">Operation: Earthmoving</code> (aliases Model / Title / Op) for
            report title and Excel filename. Examples place it after their comment block.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">3.3 Network</h3>
          <p className="mt-2 text-xs leading-relaxed">
            One sequence per resource; supporting resources share meeting tasks. Counts like{" "}
            <code className="text-foreground">5 trucks, 1 loader</code>. Arrows: → · {"->"} · {"-->"} · {"=>"}.
            Multi-demand: <code className="text-foreground">Crane: LiftAtA | LiftAtB | LiftAtC</code>. Priority:
            lower number = higher priority when several demands wait.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">3.4 Counter, durations, branch, GEN/CON</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>
              <code className="text-foreground">Counter after:</code> exact task name(s); multi-counter allowed
            </li>
            <li>
              Durations in <strong className="text-foreground">minutes</strong>: const, unif, tri, normal,
              lognormal, beta (min,max,α,β), pert (a,m,b), gamma
            </li>
            <li>Branch p for forks (breakdown, rework)—probabilities should sum sensibly</li>
            <li>
              Inline GEN/CON when unit logic needs scaling:{" "}
              <code className="text-foreground">GEN 5 → Scoop → CON 5 TruckFull → …</code>
            </li>
          </ul>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">3.5 Cost, sensitivity, order</h3>
          <p className="mt-2 text-xs leading-relaxed">
            Cost in USD per resource-hour. Sensitivity last (e.g. <code className="text-foreground">Trucks:
            2..10</code>). Caps: ≤5 SA resources; ~150 combinations by stepping ranges. Recommended order:{" "}
            <strong className="text-foreground">
              Operation → Network → Durations → Priority → Branch → Cost → Sensitivity
            </strong>
            .
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">Live template</h3>
          <pre className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[10px] leading-snug text-foreground">
            {GENERAL_TEMPLATE}
          </pre>
        </section>

        {/* Chapter 4 */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Chapter 4 — Modeling rules that keep diagrams honest
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ol className="list-decimal space-y-1.5 pl-5 text-xs leading-relaxed">
            <li>Every resource has a home QUEUE—idleness lives there.</li>
            <li>≥2 resources meet → COMBI; one resource alone → NORMAL.</li>
            <li>Forward arcs solid black; return home dashed gold (teaching convention).</li>
            <li>GEN / CON only when unit logic needs them.</li>
            <li>
              <code className="text-foreground">Counter after:</code> must match real task names.
            </li>
            <li>Prefer ordered tasks, queues beside cycles, counter toward the end.</li>
            <li>Describe cycles in text; the builder draws queues and arcs.</li>
          </ol>
          <p className="mt-2 text-xs">
            Graphic detail: <code className="text-foreground">docs/NOTATION_STANDARD.md</code>.
          </p>
        </section>

        {/* Chapter 5 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part IV — Reading results</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 5 — Simulation, cost, and sensitivity
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <div className="space-y-3 text-[13px] leading-relaxed text-foreground/90">
            <p>
              <strong>Process Report</strong> answers: did we produce what we thought, at what overall pace?
              (run length, cycles, units per event, first unit time, average time between units.)
            </p>
            <p>
              <strong>Productivity by cycle</strong> starts at 0. Early noise is normal. Steady state uses a
              practical teaching rule (~5% band, window ≥10 cycles) shown as an old-gold dashed line—so class
              can quote a settled productivity, not the first spike.
            </p>
            <p>
              <strong>Idleness / busy</strong> both carry labels so tiny idle bars still tell a story. High
              idle on a costly resource is a design smell; high idle on a cheap buffer may be intentional.
            </p>
            <p>
              <strong>Cost Report</strong> (when rates exist): resource cost ≈ count × (USD/h) × run hours;
              unit cost ≈ total ÷ production—the bridge from “how busy?” to “how expensive per unit?”
            </p>
            <p>
              <strong>Sensitivity</strong> tab appears with <code className="text-foreground">Sensitivity:</code>{" "}
              in the prompt: pairwise productivity and unit-cost charts, best markers, idleness tables.
              Batches prefer a Web Worker; same engine on main-thread fallback. Single Simulate stays on the
              main thread.
            </p>
            <p className="text-xs text-muted-foreground">
              Export Excel / PNG for homework; always note Operation, seed, max cycles, and SA ranges.
            </p>
          </div>
        </section>

        {/* Chapter 6 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part V — Curriculum</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 6 — Six Examples as a learning path
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-xs mb-3">
            Selecting an Example only fills the prompt. <strong className="text-foreground">You</strong> click
            Draw Model.
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-xs leading-relaxed">
            <li>
              <strong className="text-foreground">Earthmoving</strong> — classic two-resource cycle; cost;
              steady state. No branch, no SA—learn the spine first.
            </li>
            <li>
              <strong className="text-foreground">Asphalt Paving</strong> — meeting at dump-to-paver; branch
              breakdown then refill; count after pave.
            </li>
            <li>
              <strong className="text-foreground">Loading Dump Truck</strong> — inline GEN/CON before haul-return.
            </li>
            <li>
              <strong className="text-foreground">Tower Crane</strong> — multi-demand, priority, multi-counter
              across zones.
            </li>
            <li>
              <strong className="text-foreground">Masonry</strong> — face stocks; helper multi-demand; sensitivity
              introduction.
            </li>
            <li>
              <strong className="text-foreground">Precast Plant</strong> — Halpin Ch.14-style line; richer SA.
            </li>
          </ol>
          <p className="mt-3 text-xs">
            Suggested path: 1→2→3 for mechanics; 4 for shared resources; 5–6 for decisions under sensitivity.
            Rewrite any example. Change one idea at a time.
          </p>
        </section>

        {/* Chapter 7 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part VI — AI Assistant</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 7 — What “AI-assisted” should mean here
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            The Assistant should feel like a teaching assistant who has read your board—not like a search
            engine. It explains <em>this</em> model, points at bottleneck and idleness from the{" "}
            <em>last run</em>, proposes Format Prompt edits when asked, and stays short (≤20 lines). It must
            not silently re-simulate, invent another operation, or replace CYCLONE with a mystery model.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">7.1 Technology (honest)</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>
              <strong className="text-foreground">AI mode</strong> when <code className="text-foreground">XAI_API_KEY</code>{" "}
              is set — compact CONTEXT snapshot only
            </li>
            <li>
              <strong className="text-foreground">Local mode</strong> without a key — English-first intent helper
            </li>
            <li>Product language English-first (international classroom)</li>
            <li>Chat: gold user bubbles (right), light assistant (left); guidance in placeholder</li>
            <li>General chips: resources · bottleneck · productivity · unit cost</li>
            <li>Limits: Assistant ~30/h/IP; AI DSL draft ~20/h/IP; replies ≤20 lines</li>
          </ul>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">7.2 Recommended questions</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Explain resource cycles; COMBI vs NORMAL; counter; GEN/CON; branch p</li>
            <li>Fleet counts; highest idleness; likely bottleneck</li>
            <li>Productivity, steady state, unit cost, idle/busy %</li>
            <li>Edits using <em>your</em> resource names (Apply → Draw → Simulate)</li>
            <li>SA: best unit cost / highest productivity combination</li>
            <li>Teaching: why home-QUEUE idleness is waste; why every resource needs a queue</li>
          </ul>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">7.3 Boundary</h3>
          <p className="mt-2 rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[13px] leading-relaxed text-foreground">
            Answers only about the <strong>current</strong> Format Prompt, drawn network, and{" "}
            <strong>last</strong> results. May <strong>propose</strong> edits; you must <strong>Apply</strong>,{" "}
            <strong>Draw Model</strong>, and <strong>Simulate</strong>.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">7.4 Workflow</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs">
            <li>Build and simulate a model you understand.</li>
            <li>Ask focused questions.</li>
            <li>If a prompt is proposed → Apply → Draw Model → Simulate.</li>
            <li>Compare numbers; do not accept quantitative claims without a run.</li>
          </ol>
        </section>

        {/* Chapter 8 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part VII — Guardrails</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 8 — Limits, deploy, and integrity
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed">
            <li>
              Max cycles default <strong className="text-foreground">100</strong>, hard cap{" "}
              <strong className="text-foreground">500</strong>; seed default{" "}
              <strong className="text-foreground">12345</strong>; time in minutes
            </li>
            <li>Sensitivity: max 5 resources; ~150 combinations (ranges step up)</li>
            <li>SA prefers Web Worker; Simulate on main thread</li>
            <li>AI limits as in Chapter 7; no API key → local helper still works</li>
            <li>
              Deploy: GitHub <code className="text-foreground">main</code> → Vercel; live{" "}
              <a
                className="text-primary hover:underline"
                href="https://neo-cyclone.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                neo-cyclone.vercel.app
              </a>
            </li>
            <li>Teaching does not require sign-in; cite footer version in reports</li>
          </ul>
          <p className="mt-3 text-xs">
            These limits do not change CYCLONE rules or Halpin-style interpretation—they protect shared hosting
            and API cost.
          </p>
        </section>

        {/* Chapter 9 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part VIII — Lineage</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 9 — References</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90 mb-3">
            Neo-CYCLONE stands on published work by Daniel W. Halpin, his students, and collaborators. This is
            a starting map, not an exhaustive bibliography.
          </p>
          <h3 className="font-display text-sm font-semibold text-foreground">9.1 Foundations</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs">
            <li>Halpin, D. W. (1973). Ph.D. dissertation, University of Illinois at Urbana–Champaign.</li>
            <li>
              Halpin, D. W. (1977). “CYCLONE: Method for Modeling of Job Site Processes.” J. Constr. Div., ASCE,
              103(3), 489–499.
            </li>
            <li>Halpin, D. W., & Riggs, L. S. (1992). Planning and Analysis of Construction Operations. Wiley.</li>
          </ol>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">9.2 MicroCYCLONE</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs" start={4}>
            <li>Lluch, J., & Halpin, D. W. (1982). J. Constr. Div., ASCE, 108(1), 129–145.</li>
            <li>Halpin, D. W. (1990–1992). MicroCYCLONE user / system manuals. Purdue / Learning Systems.</li>
          </ol>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">9.3 DISCO</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs" start={6}>
            <li>
              Huang, R.-Y., & Halpin, D. W. (1993–1995). DISCO papers (ISARC; Microcomputers in Civil
              Engineering; J. Constr. Eng. Manage.).
            </li>
            <li>Huang, R.-Y. (1994). Ph.D., Purdue (advisor: Halpin).</li>
          </ol>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">9.4 PROSIDYC · COST · WebCYCLONE</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs" start={8}>
            <li>Halpin, D. W., & Martinez, L.-H. (1999). PROSIDYC. Winter Simulation Conference.</li>
            <li>Cheng, T.-M., et al. (2000). COST. 17th ISARC.</li>
            <li>Halpin, D. W., Jen, H., & Kim, J. (2003). WebCYCLONE. Winter Simulation Conference.</li>
          </ol>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">9.5–9.6 Circle and related systems</h3>
          <p className="mt-2 text-xs leading-relaxed">
            Halpin circle and peers (AbouRizk & Halpin; Hijazi; Lutz; Gonzalez-Quevedo; Abraham; project-level
            CYCLONE; AbouRizk et al., 2011). Related lineage: UM-CYCLONE (Ioannou), STROBOSCOPE (Martinez),
            Simphony / Simphony.NET (AbouRizk et al.).
          </p>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">9.7 Relation</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            Neo-CYCLONE does <strong>not</strong> claim to supersede research simulators. It is{" "}
            <strong>{PRODUCT_TAGLINE}</strong>—a studio for first principles: flow, idleness, cyclic networks,
            and responsible use of AI beside a transparent engine.
          </p>
        </section>

        {/* Epilogue */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Epilogue — A request to the reader</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <div className="space-y-3 text-[13px] leading-relaxed text-foreground/90">
            <p>
              When the diagram is clean and the numbers are stable, you have done what Halpin asked of a
              generation of students: <strong>see the operation</strong>. AI can speed the typing; it cannot
              replace that seeing.
            </p>
            <p>
              If you teach with Neo-CYCLONE, keep one run with seed <strong>12345</strong> as a shared baseline,
              then change one idea at a time—fleet, duration, branch, or priority—and ask what happened to{" "}
              <strong>idleness</strong> and <strong>unit cost</strong>. That discipline matters more than any
              single feature.
            </p>
          </div>
        </section>

        <footer className="border-t border-border pt-6 text-center text-[11px] text-muted-foreground">
          <p className="text-xs text-foreground/80">
            <strong>Quick path:</strong> Example or Format Prompt → Draw Model → Simulate → Sensitivity (if
            planned) → AI Assistant (optional) → Export Excel / PNG.
          </p>
          <p className="mt-3">
            {PRODUCT_TAGLINE}
            <span className="mx-1.5">·</span>
            {PRODUCT_DEDICATION} · Manual v{PRODUCT_VERSION}
          </p>
        </footer>
      </main>
    </div>
  );
}
