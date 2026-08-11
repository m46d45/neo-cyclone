import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GENERAL_TEMPLATE,
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
            <h1 className="font-display text-lg font-semibold tracking-tight sm:text-xl">Neo-CYCLONE Manual</h1>
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
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Neo-CYCLONE Manual
          </h1>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
            {PRODUCT_TAGLINE}
          </p>
          <p className="mt-4 text-[13px] leading-relaxed text-foreground/90">
            For students, instructors, and practitioners who want to understand construction operations as{" "}
            <em>flow</em>. Includes diagram literacy (how Neo-CYCLONE draws CYCLONE) and places{" "}
            <strong>References at the end</strong>. Full text:{" "}
            <code className="text-foreground">docs/USER_MANUAL.md</code>.
          </p>
        </div>

        {/* Start here */}
        <section className="rounded-[var(--radius-lg)] border border-primary/30 bg-primary/5 p-4 sm:p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Start here — 3 minutes</h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-foreground/90">
            <li>
              Example → <strong>1. Earthmoving</strong> → click <strong>Draw Model</strong> (required).
            </li>
            <li>
              Cycles <strong>100</strong>, seed <strong>12345</strong> → <strong>Simulate</strong>.
            </li>
            <li>
              Read units/hour and <strong>idleness</strong> (who waits?). Then skim Chapter 4 to read the diagram.
            </li>
          </ol>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-xs">
            <li>Empty diagram after Example → Draw Model</li>
            <li>
              Ugly Excel name → <code className="text-foreground">Operation: MyName</code>
            </li>
            <li>Numbers differ from a classmate → same seed & cycles</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Prologue — Why this studio exists</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <div className="space-y-3 text-[13px] leading-relaxed text-foreground/90">
            <p>
              Construction work is full of <strong>repetition</strong>: load and haul, pour and return, lift and
              place. Between those busy moments, resources wait. A truck queues at a loader. A crane sits while a
              crew finishes tying rebar. That waiting is not always “laziness”; it is often{" "}
              <strong>the structure of the process</strong>.
            </p>
            <p>
              Professor <strong>Daniel W. Halpin</strong> spent a career making that structure <em>visible</em>. His{" "}
              <strong>CYCLONE</strong> language (<em>CYCLic Operations NEtwork</em>) gave operations a simple network
              grammar: resources cycle through queues and work, meet when they must, and count completed production.
              From that grammar grew tools—<strong>MicroCYCLONE</strong>, then DISCO, PROSIDYC, COST, WebCYCLONE, and
              a wider family of construction simulation systems (see <strong>References</strong> at the end of this
              manual).
            </p>
            <p>
              <strong>Neo-CYCLONE</strong> is not a replacement for those research systems. It is a{" "}
              <strong>teaching studio</strong>: a place to meet Halpin’s ideas again, with a modern browser interface
              and an AI Assistant that stays tied to <em>your</em> model. The product name is honest:{" "}
              <strong>AI-Assisted Construction Operation Simulation</strong>.
            </p>
            <p>
              AI here does not invent a new physics of construction. The <strong>engine</strong> is still a
              discrete-event CYCLONE-style simulator. AI helps you <strong>phrase</strong>, <strong>inspect</strong>,
              and <strong>question</strong> the model. You remain responsible for Draw Model, Simulate, and judgment.
            </p>
            <p className="rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[13px] text-foreground">
              If you leave this manual with one habit, let it be this:{" "}
              <strong>draw the cycles until they tell the truth, then run the numbers</strong>.
            </p>
          </div>
        </section>

        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
            Part I — Ideas before buttons
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 1 — Operations, flow, and idleness
          </h2>
          <div className="gold-rule my-3 max-w-xs" />

          <h3 className="font-display text-base font-semibold text-foreground">
            1.1 What we mean by “construction operation”
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            An <em>operation</em> here is a <strong>repeatable production process</strong>—often measured in units
            per hour—not the whole project Gantt chart. Earthmoving a cut, paving a lane, loading dump trucks,
            serving three zones with one crane, stocking brick and mortar for masons, or cycling forms in a precast
            yard: each is an operation with <strong>resources</strong>, <strong>tasks</strong>, and{" "}
            <strong>waiting</strong>.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            Thinking at the operation level matters for <strong>Lean Construction</strong> and{" "}
            <strong>Project Production Management</strong>. Before you optimize a schedule bar, you need to see
            whether the <em>process</em> itself produces flow or waste.
          </p>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            1.2 Flow and idleness (waste you can measure)
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            In CYCLONE thinking, a resource that is not working is usually <strong>in a queue</strong>—waiting for a
            partner, a space, or a task to open. That waiting time is <strong>idleness</strong>. It is not a moral
            failure; it is a signal:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Too few trucks → loader idle</li>
            <li>Too many trucks → truck queue grows</li>
            <li>Shared crane, wrong priority → one zone starves</li>
          </ul>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            Neo-CYCLONE reports <strong>idle %</strong> and <strong>busy %</strong> so those signals are hard to
            ignore. When you later hear “waste” in Lean language, you already have a picture for it.
          </p>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.3 Why a network language?</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            You could describe an operation in paragraphs of natural language. Networks force clarity:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Which resources exist?</li>
            <li>In what order do they work?</li>
            <li>Where do they wait?</li>
            <li>Where do two resources <strong className="text-foreground">meet</strong> (e.g. truck + loader)?</li>
            <li>What counts as <strong className="text-foreground">one unit of production</strong>?</li>
          </ul>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            CYCLONE answered those questions with a small set of node types. Neo-CYCLONE keeps that spirit in the{" "}
            <strong>logic</strong>, even when some glyphs and arrow colors are tuned for screen teaching (Chapter 4).
          </p>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            1.4 What Neo-CYCLONE is — and is not
          </h3>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px]">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="px-2 py-1.5 font-medium">It is</th>
                  <th className="px-2 py-1.5 font-medium">It is not</th>
                </tr>
              </thead>
              <tbody className="text-foreground/90">
                <tr className="border-b border-border/60">
                  <td className="px-2 py-1.5">Browser teaching studio for cyclic construction operations</td>
                  <td className="px-2 py-1.5">A full project controls ERP</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-2 py-1.5">Prompt → diagram → discrete-event simulation</td>
                  <td className="px-2 py-1.5">Black-box “AI that simulates for you” without a model</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-2 py-1.5">MicroCYCLONE-style reports (process, cost, sensitivity)</td>
                  <td className="px-2 py-1.5">A pixel-perfect reprint of 1970s/1990s paper figures</td>
                </tr>
                <tr>
                  <td className="px-2 py-1.5">English-first, classroom-friendly limits</td>
                  <td className="px-2 py-1.5">An unlimited free chat API</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs">You do not need to sign in to learn. Teaching use stands alone.</p>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.5 The studio at a glance</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>
              <strong className="text-foreground">Left:</strong> Example or Format Prompt → <strong className="text-foreground">Draw Model</strong>
            </li>
            <li>
              <strong className="text-foreground">Right:</strong> <strong className="text-foreground">CYCLONE Model</strong>{" "}
              diagram; cycles & seed → <strong className="text-foreground">Simulate</strong>
            </li>
            <li>
              <strong className="text-foreground">Below:</strong> Results (Simulation · Sensitivity Analysis)
            </li>
            <li>
              <strong className="text-foreground">Lower:</strong> AI Assistant (optional co-pilot)
            </li>
            <li>
              <strong className="text-foreground">Header / footer:</strong> Manual link; product name · version · year
              (cite version in homework)
            </li>
          </ul>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            The right-hand diagram is not decoration. Chapter 4 teaches you how to <strong>read</strong> it.
          </p>
        </section>

        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
            Part II — Your first hour in the studio
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 2 — Fifteen minutes that stick (Earthmoving)
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            A guided first run. Do it once with Example 1 even if you already “know trucks.”
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.1 Open the studio</h3>
          <p className="mt-2 text-xs leading-relaxed">
            Left: prompt, Example dropdown, <strong className="text-foreground">Draw Model</strong>. Right: empty
            CYCLONE Model until you draw. Later below: Results and AI Assistant. Header: Manual. Footer: product,
            version, year.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.2 Load Example 1 — Earthmoving</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed">
            <li>
              Example → <strong className="text-foreground">1. Earthmoving</strong>. Read top to bottom:{" "}
              <code className="text-foreground">#</code> notes, <code className="text-foreground">Operation:
              Earthmoving</code>, truck cycle, loader at Load, counter after Dump, cost, durations in minutes.
            </li>
            <li>
              <strong className="text-foreground">Plain language:</strong> trucks load–haul–dump–return; loader
              meets trucks at Load (<strong className="text-foreground">COMBI</strong>); production counts after
              Dump (e.g. 12 m³).
            </li>
            <li>
              Click <strong className="text-foreground">Draw Model</strong> (examples do not auto-draw).
            </li>
            <li>
              Confirm home <strong className="text-foreground">QUEUE</strong>s, COMBI Load, NORMAL hauls, golf-flag{" "}
              <strong className="text-foreground">COUNTER</strong>, solid black forward arcs and dashed gold
              returns. Fix and re-draw until the picture matches the story—then Simulate.
            </li>
          </ol>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.3 Run parameters</h3>
          <p className="mt-2 text-xs leading-relaxed">
            <strong className="text-foreground">Max cycles</strong>: default 100, hard max 500.{" "}
            <strong className="text-foreground">Seed</strong>: default 12345 — same seed + same model + same limit
            → identical stochastic results. Dice picks another seed on purpose. Seed is for reproducibility
            (homework, papers), not a fleet decision.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.4 Simulate and read</h3>
          <p className="mt-2 text-xs leading-relaxed">
            Open <strong className="text-foreground">Simulation</strong>: Process Report first, then units/hour by
            cycle (from cycle 0). Does productivity settle? Steady-state guide (~5% over ≥10 cycles) appears as an
            old-gold dashed line. Then idleness: who waits, who works—often the best classroom discussion. Cost
            Report appears when rates exist (unit cost = total ÷ production).
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.5 Export once</h3>
          <p className="mt-2 text-xs leading-relaxed">
            Report Excel (name prefers Operation:), chart PNG, diagram PNG. For assignments record seed, max cycles,
            and Operation name.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.6 Optional AI Assistant</h3>
          <p className="mt-2 text-xs leading-relaxed">
            Guidance lives in the input placeholder. Try general chips: resources, bottleneck, productivity, unit
            cost. Replies ≤20 lines; bound to this model and last run. Proposed prompts need{" "}
            <strong className="text-foreground">Apply → Draw Model → Simulate</strong>.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.7 Quick path</h3>
          <p className="mt-2 text-xs">
            Example or Format Prompt → Draw Model → check diagram (Ch.4) → cycles & seed → Simulate → Sensitivity
            (if planned) → AI Assistant (optional) → Export.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.8 Common first-session mistakes</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Expecting a diagram from Example alone</li>
            <li>Simulating before the diagram matches the story</li>
            <li>Assuming chat edits changed the engine without Apply</li>
            <li>Comparing runs with different seeds</li>
            <li>Reading only total production, ignoring idleness</li>
            <li>Assuming every rectangle matches a photocopy of a 1992 book figure (see Ch.4)</li>
          </ul>
        </section>

        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part III — Prompt & diagram</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 3 — How to talk so the studio can build a network
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            You do not draw QUEUE circles by hand. You describe <strong>resource cycles</strong>; the builder creates
            queues, tasks, and arcs. Students learn the logic of cycles, not pixel-pushing.
          </p>
          <h3 className="font-display mt-5 text-base font-semibold text-foreground">3.1–3.2 Comments and Operation</h3>
          <p className="mt-2 text-xs leading-relaxed">
            <code className="text-foreground">#</code> / <code className="text-foreground">//</code> = notes only.
            First data line after notes: <code className="text-foreground">Operation: Earthmoving</code> (aliases
            Model / Title / Op) for report title and Excel filename. Examples place it after their comment block.
          </p>
          <h3 className="font-display mt-5 text-base font-semibold text-foreground">3.3 Network</h3>
          <p className="mt-2 text-xs leading-relaxed">
            One sequence per resource; supporting resources share meeting tasks. Counts like{" "}
            <code className="text-foreground">5 trucks, 1 loader</code>. Arrows: → · {"->"} · {"-->"} · {"=>"}.
            Multi-demand: <code className="text-foreground">Crane: LiftAtA | LiftAtB | LiftAtC</code>. Priority:
            lower number = higher priority when several demands wait.
          </p>
          <h3 className="font-display mt-5 text-base font-semibold text-foreground">
            3.4 Counter, durations, branch, GEN/CON
          </h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>
              <code className="text-foreground">Counter after:</code> exact task name(s); multi-counter allowed
            </li>
            <li>
              Durations in <strong className="text-foreground">minutes</strong>: const, unif, tri, normal, lognormal,
              beta (min,max,α,β), pert (a,m,b), gamma
            </li>
            <li>Branch p for forks (breakdown, rework)—probabilities should sum sensibly</li>
            <li>
              Inline GEN/CON when unit logic needs scaling:{" "}
              <code className="text-foreground">GEN 5 → Scoop → CON 5 TruckFull → …</code>
            </li>
          </ul>
          <h3 className="font-display mt-5 text-base font-semibold text-foreground">3.5 Cost, sensitivity, order</h3>
          <p className="mt-2 text-xs leading-relaxed">
            Cost in USD per resource-hour. Sensitivity last. Caps: ≤5 SA resources; ~150 combinations. Recommended
            order:{" "}
            <strong className="text-foreground">
              Operation → Network → Durations → Priority → Branch → Cost → Sensitivity
            </strong>
            .
          </p>
          <h3 className="font-display mt-5 text-base font-semibold text-foreground">Live Format Prompt template</h3>
          <pre className="mt-2 max-h-64 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[10px] leading-snug text-foreground">
            {GENERAL_TEMPLATE}
          </pre>

          {/* CHAPTER 4 — modeling focus */}
          <h2 className="font-display mt-12 text-xl font-semibold text-foreground">
            Chapter 4 — Reading the model: how Neo-CYCLONE draws CYCLONE
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            Users stare at the <strong>CYCLONE Model</strong> panel. Same Halpin <em>ideas</em> (queues, work,
            meetings, returns, counters); some <em>glyphs and colors</em> are tuned for screen teaching.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">4.1 Modeling workflow</h3>
          <p className="mt-2 text-xs">
            Story in Format Prompt → <strong className="text-foreground">Draw Model</strong> → inspect diagram →
            fix story → Simulate. You do not hand-draw nodes in the prompt; you state resource cycles.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">4.2 Node shapes</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>
              <strong className="text-foreground">QUEUE</strong> — circle with Q-like slash; home idle pool (
              <code className="text-foreground">n = …</code>)
            </li>
            <li>
              <strong className="text-foreground">COMBI</strong> — square with top-left cut; ≥2 resources meet
            </li>
            <li>
              <strong className="text-foreground">NORMAL</strong> — rectangle; one-resource work
            </li>
            <li>
              <strong className="text-foreground">COUNTER</strong> — golf flag; production count
            </li>
            <li>
              <strong className="text-foreground">GEN</strong> — inverted triangle ▽ (scale up)
            </li>
            <li>
              <strong className="text-foreground">CON</strong> — upright triangle △ (scale down)
            </li>
          </ul>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">4.3 Arrows</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>
              <strong className="text-foreground">Solid black</strong> — forward work (toward production)
            </li>
            <li>
              <strong className="text-foreground">Dashed gold</strong> — return into a <em>home</em> QUEUE only
            </li>
            <li>
              Branch outs may show <code className="text-foreground">p=…</code>
            </li>
          </ul>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">4.4 COMBI vs NORMAL</h3>
          <p className="mt-2 text-xs">
            Two or more resources must be present → COMBI. One resource alone → NORMAL. Example: Load (truck +
            loader) is COMBI; Haul is NORMAL.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">
            4.5 Same spirit as CYCLONE — different surface
          </h3>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[520px] text-left text-[11px]">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="px-2 py-1.5 font-medium">Topic</th>
                  <th className="px-2 py-1.5 font-medium">Classic CYCLONE / MicroCYCLONE</th>
                  <th className="px-2 py-1.5 font-medium">Neo-CYCLONE studio</th>
                </tr>
              </thead>
              <tbody className="text-foreground/90">
                <tr className="border-b border-border/60">
                  <td className="px-2 py-1.5 font-medium">Build</td>
                  <td className="px-2 py-1.5">Node editors, cards, input files</td>
                  <td className="px-2 py-1.5">Format Prompt → auto layout</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-2 py-1.5 font-medium">QUEUE / COMBI / COUNTER</td>
                  <td className="px-2 py-1.5">Book-era glyphs vary</td>
                  <td className="px-2 py-1.5">Q-slash circle · cut square · golf flag</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-2 py-1.5 font-medium">GEN / CON</td>
                  <td className="px-2 py-1.5">Function nodes in full systems</td>
                  <td className="px-2 py-1.5">▽ / △; prefer inline in prompt</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-2 py-1.5 font-medium">Arrows</td>
                  <td className="px-2 py-1.5">Usually black linework</td>
                  <td className="px-2 py-1.5">Black solid forward · gold dashed return</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-2 py-1.5 font-medium">Layout</td>
                  <td className="px-2 py-1.5">Author-drawn publication figures</td>
                  <td className="px-2 py-1.5">Automatic teaching grid</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-2 py-1.5 font-medium">AI</td>
                  <td className="px-2 py-1.5">None historically</td>
                  <td className="px-2 py-1.5">Context-bound Assistant (Apply required)</td>
                </tr>
                <tr>
                  <td className="px-2 py-1.5 font-medium">If figures disagree</td>
                  <td className="px-2 py-1.5">Book / original software</td>
                  <td className="px-2 py-1.5">This app’s legend + engine</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs">
            <strong className="text-foreground">Must stay CYCLONE:</strong> wait in queues, work holds units,
            meetings need all parties, cycles close, counters define production.{" "}
            <strong className="text-foreground">May look different:</strong> colors, dashes, exact icons, auto
            layout, prompt-first authoring. Detail:{" "}
            <code className="text-foreground">docs/NOTATION_STANDARD.md</code>.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">4.6 Checklist before Simulate</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Home QUEUE per resource</li>
            <li>True meetings → COMBI; solo → NORMAL</li>
            <li>Counter names match tasks</li>
            <li>Gold dashed only into home idles</li>
            <li>GEN/CON only if unit logic needs them</li>
          </ul>
        </section>

        
        {/* Chapter 5 — full */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part IV — Reading results</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 5 — Simulation, cost, and sensitivity
          </h2>
          <div className="gold-rule my-3 max-w-xs" />

          <h3 className="font-display text-base font-semibold text-foreground">5.1 Process Report</h3>
          <p className="mt-2 text-xs leading-relaxed">
            MicroCYCLONE-style summary: how long the run lasted, how many production events occurred, units per
            event, total production, when the first unit appeared, and average time between units. Use it to
            answer: <em>Did we produce what we thought, at what overall pace?</em>
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">5.2 Productivity by cycle and steady state</h3>
          <p className="mt-2 text-xs leading-relaxed">
            The units/hour chart starts at cycle <strong className="text-foreground">0</strong>. Early cycles are
            often noisy (the system is filling). <strong className="text-foreground">Steady state</strong> in
            Neo-CYCLONE is a practical teaching rule: productivity stays within about{" "}
            <strong className="text-foreground">5%</strong> across a window of at least{" "}
            <strong className="text-foreground">10</strong> cycles. The guide appears as an{" "}
            <strong className="text-foreground">old-gold dashed</strong> line—so class can quote settled
            productivity, not the first spike.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">5.3 Idleness and busy time</h3>
          <p className="mt-2 text-xs leading-relaxed">
            For each resource, <strong className="text-foreground">idle %</strong> and{" "}
            <strong className="text-foreground">busy %</strong> are both labeled so a tiny idle bar still has a
            story. High idle on a costly resource is a design smell; high idle on a cheap buffer may be
            intentional. This is often the best classroom discussion in the whole app.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">5.4 Cost Report</h3>
          <p className="mt-2 text-xs leading-relaxed">
            When you supply hourly rates (USD per resource-hour): resource cost ≈ count × (USD/h) × run hours;
            <strong className="text-foreground"> unit cost</strong> ≈ total cost ÷ production. Unit cost bridges
            “how busy?” to “how expensive per unit produced?”—especially next to sensitivity charts.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">5.5 Sensitivity Analysis tab</h3>
          <p className="mt-2 text-xs leading-relaxed">
            Appears when the prompt defines <code className="text-foreground">Sensitivity:</code>. Compare
            combinations (e.g. trucks vs loaders): productivity and unit cost side by side, best markers, and
            idleness views. Pairwise comparison supports more than two resources within teaching caps (≤5
            resources; ~150 combinations by stepping ranges). Batches prefer a{" "}
            <strong className="text-foreground">Web Worker</strong> so the UI stays responsive; fallback is the
            main thread (same numbers). Single Simulate stays on the main thread.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">5.6 Export discipline</h3>
          <p className="mt-2 text-xs leading-relaxed">
            Report Excel (multi-sheet; name prefers <code className="text-foreground">Operation:</code>), chart
            PNG, diagram PNG. For homework note Operation name, seed, max cycles, and any SA ranges.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">5.7 Discuss results in one minute</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs">
            <li>What is steady-state units/hour?</li>
            <li>Which resource has the highest idle %?</li>
            <li>What is unit cost (if costs were entered)?</li>
            <li>If I add one unit of the scarce resource, what do I expect—then test with SA or a re-run.</li>
          </ol>
        </section>

        {/* Chapter 6 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part V — Curriculum</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 6 — Six Examples as a learning path
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-xs mb-3">
            Selecting an Example only fills the prompt. <strong className="text-foreground">You</strong> click Draw
            Model. Use Chapter 4 while you look at each diagram.
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-xs leading-relaxed">
            <li>
              <strong className="text-foreground">Earthmoving</strong> — two home QUEUEs; COMBI Load; gold
              returns; single counter; cost; steady state. No branch, no SA—learn the spine first.
            </li>
            <li>
              <strong className="text-foreground">Asphalt Paving</strong> — meeting at dump-to-paver;{" "}
              <strong className="text-foreground">branch</strong> breakdown then refill; count after pave;{" "}
              <code className="text-foreground">p=</code> on arcs.
            </li>
            <li>
              <strong className="text-foreground">Loading Dump Truck</strong> — inline{" "}
              <strong className="text-foreground">GEN ▽ / CON △</strong> so scoops fill a truck before haul-return.
            </li>
            <li>
              <strong className="text-foreground">Tower Crane</strong> — multi-demand{" "}
              <code className="text-foreground">|</code>, priority, multi-counter flags across zones.
            </li>
            <li>
              <strong className="text-foreground">Masonry</strong> — face stocks (brick/mortar places); helper
              multi-demand; <strong className="text-foreground">sensitivity</strong> introduction.
            </li>
            <li>
              <strong className="text-foreground">Precast Plant</strong> — Halpin Ch.14-style line production;
              longer resource set; richer SA—systems thinking.
            </li>
          </ol>
          <p className="mt-3 text-xs">
            <strong className="text-foreground">Suggested path:</strong> 1→2→3 mechanics; 4 shared resources; 5–6
            decisions under sensitivity. Self-study: Day 1 Examples 1–3 + Ch.5; Day 2 Example 4 + your own
            operation; Day 3 Examples 5–6 + one written SA recommendation.
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
            The Assistant sits under Results. It should feel like a teaching assistant who has read your
            board—not a search engine.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">7.1 Purpose</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Explain <em>this</em> model’s cycles, COMBI/NORMAL, counter, GEN/CON, branch</li>
            <li>Point at bottleneck and idleness from the <em>last run</em></li>
            <li>Propose a full Format Prompt edit when you ask to change fleet or durations</li>
            <li>Stay short (≤20 lines) so the studio remains the focus</li>
          </ul>
          <p className="mt-2 text-xs">
            It must <strong className="text-foreground">not</strong> silently re-simulate, invent another
            operation, or replace CYCLONE with a mystery model.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">7.2 Technology (honest)</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>
              <strong className="text-foreground">AI mode</strong> when{" "}
              <code className="text-foreground">XAI_API_KEY</code> is set — compact CONTEXT snapshot only
            </li>
            <li>
              <strong className="text-foreground">Local mode</strong> without a key — English-first intent helper
            </li>
            <li>Product UI, Manual, and keywords are English-first (international classroom)</li>
            <li>Rate limits: ~30 Assistant requests / hour / IP; ~20 AI DSL draft / hour / IP</li>
          </ul>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">7.3 Chat UX</h3>
          <p className="mt-2 text-xs">
            Gold <strong className="text-foreground">You</strong> bubbles (right, compact); light Assistant
            (left). System guidance lives in the input <strong className="text-foreground">placeholder</strong>.
            Quick chips are general: resources · bottleneck · productivity · unit cost.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">7.4 Recommended questions</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Explain resource cycles; COMBI vs NORMAL; where is the counter?</li>
            <li>How do GEN/CON or branch p work in this model?</li>
            <li>Fleet counts; highest idleness; likely bottleneck</li>
            <li>Last productivity; steady state yet; unit cost; idle vs busy %</li>
            <li>Edits using <em>your</em> resource names (then Apply → Draw → Simulate)</li>
            <li>SA: best unit cost / highest productivity combination</li>
            <li>Why home-QUEUE idleness is waste; why every resource needs a queue</li>
          </ul>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">7.5 Boundary</h3>
          <p className="mt-2 rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[13px] text-foreground">
            Answers only about the <strong>current</strong> Format Prompt, drawn network, and{" "}
            <strong>last</strong> results. May <strong>propose</strong> edits; you must <strong>Apply</strong>,{" "}
            <strong>Draw Model</strong>, and <strong>Simulate</strong>.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">7.6 Weak vs strong questions</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>
              Weak: “Make it better.” Stronger: “Which resource has the highest idle % after this run?”
            </li>
            <li>
              Weak: “Optimize everything.” Stronger: “Propose trucks = 8; keep loader = 1; I will re-simulate.”
            </li>
            <li>
              Weak: “What is CYCLONE?” with empty model. Stronger: Draw Example 1, then “Explain this model’s
              cycles.”
            </li>
          </ul>
        </section>

        {/* Chapter 8 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part VII — Guardrails</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 8 — Limits, deploy, and integrity
          </h2>
          <div className="gold-rule my-3 max-w-xs" />

          <h3 className="font-display text-base font-semibold text-foreground">8.1 Simulation limits</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>
              Max cycles: default <strong className="text-foreground">100</strong>, hard cap{" "}
              <strong className="text-foreground">500</strong>
            </li>
            <li>
              Seed: default <strong className="text-foreground">12345</strong> (dice = another path); same seed +
              same model + same cycles → identical stochastic results
            </li>
            <li>Time unit: minutes</li>
            <li>Sensitivity: max 5 resources; ~150 combinations (ranges step up, not cut mid-axis)</li>
          </ul>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">8.2 Performance</h3>
          <p className="mt-2 text-xs">
            Sensitivity prefers a Web Worker; fallback main thread (same numbers, possible brief UI pause). Single
            Simulate on main thread—fast enough for teaching sizes.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">8.3 AI & API</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Assistant: ~30 / hour / IP</li>
            <li>AI DSL draft: ~20 / hour / IP</li>
            <li>Payload: compact CONTEXT only; replies ≤20 lines</li>
            <li>Without API key: local English helper still works</li>
          </ul>
          <p className="mt-2 text-xs">
            These limits do not change CYCLONE rules—they protect shared hosting and API cost.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">8.4 Deploy & citing</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>
              GitHub <code className="text-foreground">main</code> → Vercel ·{" "}
              <a className="text-primary hover:underline" href="https://neo-cyclone.vercel.app/" target="_blank" rel="noreferrer">
                neo-cyclone.vercel.app
              </a>
            </li>
            <li>No sign-in required for teaching</li>
            <li>
              Cite: product + footer version · URL · Operation · seed · max cycles · Simulation and/or Sensitivity
            </li>
          </ul>
        </section>

        {/* Chapter 9 FAQ — detailed */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part VIII — Stuck?</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 9 — FAQ</h2>
          <div className="gold-rule my-3 max-w-xs" />

          <h3 className="font-display text-sm font-semibold text-foreground">Drawing and the model diagram</h3>
          <dl className="mt-2 space-y-2.5 text-xs leading-relaxed">
            <div>
              <dt className="font-semibold text-foreground">Example selected, nothing drew?</dt>
              <dd className="mt-0.5">Click Draw Model. Examples only paste the prompt.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Diagram ≠ book figure?</dt>
              <dd className="mt-0.5">
                Same CYCLONE logic; Neo-CYCLONE teaching notation (Chapter 4). Black/gold arrows and some shapes
                are intentional.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Gold dashed arrows?</dt>
              <dd className="mt-0.5">Return to a home QUEUE. Solid black = forward work.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">COMBI vs NORMAL wrong?</dt>
              <dd className="mt-0.5">
                COMBI only when two or more resources must meet. Solo work → NORMAL.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Where is the counter?</dt>
              <dd className="mt-0.5">
                Golf-flag node. Set with <code className="text-foreground">Counter after: TaskName</code>. Multiple
                flags allowed.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">GEN / CON triangles?</dt>
              <dd className="mt-0.5">
                ▽ GEN multiplies on arrival; △ CON gathers n→1. Prefer inline on the cycle. Not required in every
                model.
              </dd>
            </div>
          </dl>

          <h3 className="font-display mt-6 text-sm font-semibold text-foreground">Simulation and results</h3>
          <dl className="mt-2 space-y-2.5 text-xs leading-relaxed">
            <div>
              <dt className="font-semibold text-foreground">Simulate not useful yet?</dt>
              <dd className="mt-0.5">Draw a model you trust first. Numbers without a truthful diagram are noise.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Classmate got different productivity?</dt>
              <dd className="mt-0.5">Match seed, max cycles, and the full Format Prompt (including durations).</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">What is the steady-state line?</dt>
              <dd className="mt-0.5">
                ~5% band over ≥10 cycles—old-gold dashed on units/hour. Quote that, not the first spike.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Sensitivity empty?</dt>
              <dd className="mt-0.5">
                Need a <code className="text-foreground">Sensitivity:</code> block (Examples 5–6).
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Where is cost?</dt>
              <dd className="mt-0.5">
                Only if the prompt has <code className="text-foreground">Cost:</code> rates (USD/h). Then unit cost
                = total ÷ production.
              </dd>
            </div>
          </dl>

          <h3 className="font-display mt-6 text-sm font-semibold text-foreground">Prompt, Excel, language, AI</h3>
          <dl className="mt-2 space-y-2.5 text-xs leading-relaxed">
            <div>
              <dt className="font-semibold text-foreground">Ugly Excel name?</dt>
              <dd className="mt-0.5">
                <code className="text-foreground">Operation: ShortName</code> after # notes.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Indonesian prompt?</dt>
              <dd className="mt-0.5">
                # notes any language; keep network keywords and distributions in English for reliable parsing.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">AI proposed a prompt but numbers unchanged?</dt>
              <dd className="mt-0.5">Apply → Draw Model → Simulate.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">AI only English / very short?</dt>
              <dd className="mt-0.5">English-first product; replies capped (≤20 lines).</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Sign-in required?</dt>
              <dd className="mt-0.5">No for teaching use.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Where is the bibliography?</dt>
              <dd className="mt-0.5">
                <strong className="text-foreground">References</strong> at the <strong className="text-foreground">end</strong> of
                this manual (after Epilogue).
              </dd>
            </div>
          </dl>
        </section>

        {/* Chapter 10 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part IX — Teaching</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 10 — Notes for instructors
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            With many concurrent learners, agree a baseline: Example 1, seed 12345, max cycles 100. Everyone
            matches once—then change one variable per exercise.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs">
            <li>
              <strong className="text-foreground">See waste:</strong> baseline idleness + who waits?
            </li>
            <li>
              <strong className="text-foreground">Read the diagram:</strong> label QUEUE / COMBI / NORMAL / COUNTER /
              gold return (Ch.4)
            </li>
            <li>
              <strong className="text-foreground">Fleet change:</strong> trucks 3 vs 8, same seed → unit cost table
            </li>
            <li>
              <strong className="text-foreground">Branch / priority / SA:</strong> Examples 2, 4, 5–6
            </li>
            <li>
              <strong className="text-foreground">AI policy:</strong> explain & draft allowed; graded claims need
              engine runs after Apply
            </li>
            <li>
              <strong className="text-foreground">Rubric:</strong> model truth · waste literacy · reproducibility ·
              decision · integrity
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Epilogue</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            When the diagram is clean and the numbers are stable, you <strong>see the operation</strong>. Honor
            CYCLONE logic; learn this studio’s legend (Ch.4); run the engine. Seed 12345 as shared baseline; change
            one idea at a time; watch idleness and unit cost.
          </p>
        </section>


        {/* REFERENCES — always last */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Bibliography</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">References</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mb-3 text-xs">
            Placed <strong className="text-foreground">last</strong> so teaching chapters stay in front. Selected
            works by Halpin, students, and collaborators.
          </p>
          <h3 className="font-display text-sm font-semibold text-foreground">Foundations</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs">
            <li>Halpin, D. W. (1973). Ph.D. dissertation, University of Illinois at Urbana–Champaign.</li>
            <li>
              Halpin, D. W. (1977). “CYCLONE: Method for Modeling of Job Site Processes.” J. Constr. Div., ASCE,
              103(3), 489–499.
            </li>
            <li>Halpin, D. W., & Riggs, L. S. (1992). Planning and Analysis of Construction Operations. Wiley.</li>
          </ol>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">MicroCYCLONE</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs" start={4}>
            <li>Lluch, J., & Halpin, D. W. (1982). J. Constr. Div., ASCE, 108(1), 129–145.</li>
            <li>Halpin, D. W. (1990–1992). MicroCYCLONE manuals. Purdue / Learning Systems.</li>
          </ol>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">DISCO · PROSIDYC · COST · WebCYCLONE</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs" start={6}>
            <li>Huang, R.-Y., & Halpin, D. W. (1993–1995). DISCO papers; Huang (1994) Ph.D. Purdue.</li>
            <li>Halpin & Martinez (1999) PROSIDYC; Cheng et al. (2000) COST; Halpin, Jen & Kim (2003) WebCYCLONE.</li>
          </ol>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">Related lineage</h3>
          <p className="mt-2 text-xs">
            Halpin circle and peers; UM-CYCLONE (Ioannou); STROBOSCOPE (Martinez); Simphony / Simphony.NET
            (AbouRizk et al.).
          </p>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">How Neo-CYCLONE relates</h3>
          <p className="mt-2 text-xs leading-relaxed">
            Neo-CYCLONE does not supersede research simulators. It is {PRODUCT_TAGLINE}—first principles, teaching
            notation (Chapter 4), transparent discrete-event logic, and responsible AI beside that engine.
          </p>
        </section>

        <footer className="border-t border-border pt-6 text-center text-[11px] text-muted-foreground">
          <p className="text-xs text-foreground/80">
            <strong>Quick path:</strong> Prompt → Draw Model → read diagram (Ch.4) → Simulate → Export.
          </p>
          <p className="mt-3">
            {PRODUCT_TAGLINE}
            <span className="mx-1.5">·</span>
            Manual v{PRODUCT_VERSION}
          </p>
        </footer>
      </main>
    </div>
  );
}
