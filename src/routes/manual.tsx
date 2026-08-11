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
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">{PRODUCT_TAGLINE}</p>
          <p className="mt-1 text-xs text-muted-foreground">{PRODUCT_DEDICATION}</p>
          <p className="mt-4 text-[13px] leading-relaxed text-foreground/90">
            Written for students, instructors, and practitioners who want to <em>understand</em> construction
            operations as flow—not only to click buttons. Early classroom use already includes dozens of active
            learners; this edition emphasizes a fast start, FAQ, and teaching notes.
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Full source: <code className="text-foreground">docs/USER_MANUAL.md</code>. Notation:{" "}
            <code className="text-foreground">docs/NOTATION_STANDARD.md</code>.
          </p>
        </div>

        {/* Start here */}
        <section className="rounded-[var(--radius-lg)] border border-primary/30 bg-primary/5 p-4 sm:p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Start here — 3 minutes</h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-foreground/90">
            <li>
              Open the studio (home). <strong>Example</strong> → <strong>1. Earthmoving</strong>.
            </li>
            <li>
              Click <strong>Draw Model</strong> (the diagram does <em>not</em> appear until you click).
            </li>
            <li>
              Leave max cycles <strong>100</strong>, seed <strong>12345</strong> → <strong>Simulate</strong>.
            </li>
            <li>
              Read <strong>units/hour by cycle</strong> and <strong>resource idleness</strong> (who waits? who
              works?).
            </li>
          </ol>
          <p className="mt-3 text-xs text-foreground/80">
            Loop to remember: <strong>prompt → draw → simulate → read waste and productivity</strong>.
          </p>

          <h3 className="font-display mt-5 text-sm font-semibold text-foreground">If something feels “broken”</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>
              Empty diagram after Example → click <strong className="text-foreground">Draw Model</strong>
            </li>
            <li>No useful Simulate → draw a trusted model first</li>
            <li>
              Excel name weird → add <code className="text-foreground">Operation: MyName</code> after # notes
            </li>
            <li>
              No Sensitivity story → add <code className="text-foreground">Sensitivity:</code> (Examples 5–6)
            </li>
            <li>Different numbers than a classmate → same seed (12345) and max cycles</li>
            <li>Unstyled page after deploy → hard refresh or incognito</li>
          </ul>
        </section>

        {/* Prologue */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Prologue — Why this studio exists</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <div className="space-y-3 text-[13px] leading-relaxed text-foreground/90">
            <p>
              Construction work is full of <strong>repetition</strong>. Between busy moments, resources wait. That
              waiting is often <strong>the structure of the process</strong>, not mere “laziness.”
            </p>
            <p>
              Professor <strong>Daniel W. Halpin</strong> made that structure visible with{" "}
              <strong>CYCLONE</strong> (<em>CYCLic Operations NEtwork</em>). From it grew MicroCYCLONE, DISCO,
              PROSIDYC, COST, WebCYCLONE, and related systems (Chapter 9).
            </p>
            <p>
              <strong>Neo-CYCLONE</strong> is a <strong>teaching studio</strong>, not a replacement for research
              simulators. The engine is discrete-event CYCLONE-style code. AI helps you phrase, inspect, and
              question—you still Draw, Simulate, and judge.
            </p>
            <p className="rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[13px] text-foreground">
              One habit: <strong>draw the cycles until they tell the truth, then run the numbers</strong>.
            </p>
          </div>
        </section>

        {/* Ch 1 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part I — Ideas before buttons</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 1 — Operations, flow, and idleness
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <div className="space-y-3 text-[13px] leading-relaxed text-foreground/90">
            <p>
              An <em>operation</em> is a <strong>repeatable production process</strong> (often units/hour), not the
              whole project Gantt. Earthmoving, paving, crane service, masonry stocking, precast form cycles—all
              have resources, tasks, and waiting. This lens matters for Lean Construction and Project Production
              Management.
            </p>
            <p>
              In CYCLONE thinking, a resource not working is usually in a <strong>queue</strong>. That{" "}
              <strong>idleness</strong> is a signal: too few trucks → loader idle; too many trucks → truck queue
              grows; wrong crane priority → a zone starves. Neo-CYCLONE reports idle % and busy % so waste is
              hard to ignore.
            </p>
            <p>
              Networks force clarity: resources, order of work, waiting places, meetings (e.g. truck + loader),
              and what counts as one production unit. Forward arcs are solid black; returns home are dashed gold
              (teaching convention).
            </p>
          </div>
          <h3 className="font-display mt-5 text-base font-semibold text-foreground">Studio at a glance</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>
              <strong className="text-foreground">Left:</strong> Example / Format Prompt → Draw Model
            </li>
            <li>
              <strong className="text-foreground">Right:</strong> CYCLONE Model → cycles, seed, Simulate
            </li>
            <li>
              <strong className="text-foreground">Below:</strong> Results (Simulation · Sensitivity) → AI Assistant
            </li>
            <li>
              <strong className="text-foreground">Footer:</strong> cite product version in homework
            </li>
          </ul>
        </section>

        {/* Ch 2 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part II — First hour</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 2 — Fifteen minutes that stick (Earthmoving)
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ol className="list-decimal space-y-2 pl-5 text-xs leading-relaxed">
            <li>
              Example → <strong className="text-foreground">1. Earthmoving</strong>. Read:{" "}
              <code className="text-foreground">Operation:</code>, truck cycle, loader at Load (meeting),{" "}
              <code className="text-foreground">Counter after: Dump</code>, cost, durations in minutes.
            </li>
            <li>
              <strong className="text-foreground">Draw Model</strong>. Confirm home QUEUEs, COMBI Load, COUNTER,
              black forward / gold return arcs. Fix and re-draw until the picture matches the story.
            </li>
            <li>
              Max cycles default 100 (cap 500). Seed default <strong className="text-foreground">12345</strong>{" "}
              (dice = another random path). Seed is for reproducibility, not fleet design.
            </li>
            <li>
              <strong className="text-foreground">Simulate</strong>. Process Report → units/hour chart (steady
              state ~5% over ≥10 cycles, old-gold dashed line) → idleness (best classroom discussion) → Cost
              Report if rates exist.
            </li>
            <li>Export Excel / PNG once; record Operation, seed, max cycles.</li>
            <li>
              Optional AI chips: resources, bottleneck, productivity, unit cost. Proposed prompts need{" "}
              <strong className="text-foreground">Apply → Draw → Simulate</strong>.
            </li>
          </ol>
          <h3 className="font-display mt-5 text-sm font-semibold text-foreground">Common first-session mistakes</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Expecting a diagram from Example alone</li>
            <li>Simulating before the diagram matches the story</li>
            <li>Assuming chat edits changed the engine without Apply</li>
            <li>Comparing runs with different seeds</li>
            <li>Reading only total production, ignoring idleness</li>
          </ul>
        </section>

        {/* Ch 3-4 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part III — Format Prompt</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 3 — How to talk so the studio can build a network
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            You describe <strong>resource cycles</strong>; the builder creates queues and arcs.{" "}
            <code className="text-foreground">#</code> notes are ignored. After notes:{" "}
            <code className="text-foreground">Operation: Name</code>. Then cycles, counts,{" "}
            <code className="text-foreground">Counter after:</code>, durations (minutes), optional Priority,
            Branch p, GEN/CON, Cost (USD/h), Sensitivity last.
          </p>
          <p className="mt-2 text-xs">
            Order:{" "}
            <strong className="text-foreground">
              Operation → Network → Durations → Priority → Branch → Cost → Sensitivity
            </strong>
            . Multi-demand: <code className="text-foreground">Crane: A | B | C</code>. Arrows: → · {"->"} ·{" "}
            {"-->"} · {"=>"}.
          </p>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">Minimal custom prompt</h3>
          <pre className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border bg-card p-3 font-mono text-[10px] text-foreground">{`Operation: My Operation Name

ResourceA: Task1 → Task2 → Task3
ResourceB: Task1
3 ResourceA, 1 ResourceB

Counter after: Task3
production = 1 unit

Durations:
Task1: tri 1, 2, 3
Task2: normal 8, 1.5
Task3: const 1

Cost:
ResourceA: 80
ResourceB: 120
`}</pre>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">Live Format Prompt template</h3>
          <pre className="mt-2 max-h-64 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[10px] leading-snug text-foreground">
            {GENERAL_TEMPLATE}
          </pre>

          <h2 className="font-display mt-10 text-xl font-semibold text-foreground">
            Chapter 4 — Modeling rules that keep diagrams honest
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ol className="list-decimal space-y-1.5 pl-5 text-xs">
            <li>Every resource has a home QUEUE (idleness lives there).</li>
            <li>≥2 resources meet → COMBI; one resource alone → NORMAL.</li>
            <li>Forward = solid black; return home = dashed gold.</li>
            <li>GEN / CON only when unit logic needs them.</li>
            <li>
              <code className="text-foreground">Counter after:</code> exact task names; multi-counter allowed.
            </li>
            <li>If the diagram lies, the prompt is incomplete—not “the AI failed.”</li>
          </ol>
        </section>

        {/* Ch 5 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part IV — Results</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 5 — Simulation, cost, and sensitivity
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed">
            <li>
              <strong className="text-foreground">Process Report</strong> — pace and production summary
            </li>
            <li>
              <strong className="text-foreground">Units/hour by cycle</strong> from 0; steady state ~5% over ≥10
              cycles (old-gold dashed)
            </li>
            <li>
              <strong className="text-foreground">Idleness / busy</strong> — both labeled; costly idle is a design
              smell
            </li>
            <li>
              <strong className="text-foreground">Cost</strong> — unit cost ≈ total ÷ production when rates exist
            </li>
            <li>
              <strong className="text-foreground">Sensitivity</strong> — when prompt has Sensitivity:; Web Worker
              preferred
            </li>
          </ul>
          <p className="mt-3 text-xs">
            One-minute discussion: steady-state units/hour → highest idle % → unit cost → what if we add one
            scarce resource?
          </p>
        </section>

        {/* Ch 6 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part V — Curriculum</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 6 — Six Examples as a learning path
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ol className="list-decimal space-y-1.5 pl-5 text-xs">
            <li>
              <strong className="text-foreground">Earthmoving</strong> — spine: cycles, cost, steady state
            </li>
            <li>
              <strong className="text-foreground">Asphalt Paving</strong> — branch probability
            </li>
            <li>
              <strong className="text-foreground">Loading Dump Truck</strong> — GEN / CON
            </li>
            <li>
              <strong className="text-foreground">Tower Crane</strong> — multi-demand, priority, multi-counter
            </li>
            <li>
              <strong className="text-foreground">Masonry</strong> — face stocks; sensitivity intro
            </li>
            <li>
              <strong className="text-foreground">Precast Plant</strong> — Halpin Ch.14-style + complex SA
            </li>
          </ol>
          <p className="mt-2 text-xs">Path: 1→2→3 mechanics; 4 shared resources; 5–6 decisions. Always Draw Model yourself.</p>
        </section>

        {/* Ch 7 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part VI — AI Assistant</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 7 — AI-assisted means co-pilot, not autopilot
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            Explains <em>this</em> model and <em>last</em> run; proposes Format Prompt edits; replies ≤20 lines.
            Does not silently re-simulate or invent another operation. English-first. Limits ~30 Assistant
            requests/hour/IP. Gold user bubbles (right), light assistant (left). Guidance in the input
            placeholder.
          </p>
          <p className="mt-3 rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[13px] text-foreground">
            Propose → <strong>Apply</strong> → <strong>Draw Model</strong> → <strong>Simulate</strong>. No silent
            engine changes.
          </p>
        </section>

        {/* Ch 8 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part VII — Guardrails</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 8 — Limits & deploy</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ul className="list-disc space-y-1 pl-5 text-xs">
            <li>Max cycles 100 default / 500 cap; seed 12345; minutes</li>
            <li>SA: ≤5 resources; ~150 combinations</li>
            <li>GitHub main → Vercel; no sign-in required for teaching</li>
            <li>Cite footer version, URL, Operation, seed, cycles in homework</li>
          </ul>
        </section>

        {/* Ch 9 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part VIII — Lineage</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 9 — References</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ol className="list-decimal space-y-1 pl-5 text-xs">
            <li>Halpin (1973) dissertation; Halpin (1977) CYCLONE ASCE; Halpin & Riggs (1992) Wiley book.</li>
            <li>MicroCYCLONE: Lluch & Halpin (1982); Halpin manuals (1990–92).</li>
            <li>DISCO: Huang & Halpin; Huang Ph.D. Purdue (1994).</li>
            <li>PROSIDYC (1999); COST (2000); WebCYCLONE (2003).</li>
            <li>Related: UM-CYCLONE, STROBOSCOPE, Simphony / Simphony.NET.</li>
          </ol>
          <p className="mt-2 text-xs">
            Neo-CYCLONE does not supersede research tools—it teaches first principles beside a transparent engine.
          </p>
        </section>

        {/* Ch 10 FAQ */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part IX — Stuck?</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 10 — FAQ</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <dl className="space-y-3 text-xs leading-relaxed">
            <div>
              <dt className="font-semibold text-foreground">Example selected, nothing drew?</dt>
              <dd className="mt-0.5">Click Draw Model.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Classmate got different productivity?</dt>
              <dd className="mt-0.5">Match seed, max cycles, and the full Format Prompt.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">COMBI vs NORMAL wrong?</dt>
              <dd className="mt-0.5">COMBI only when two+ resources must meet; solo work → NORMAL.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Black vs gold arrows?</dt>
              <dd className="mt-0.5">Black solid = forward; gold dashed = return to home QUEUE.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">AI edited text but numbers unchanged?</dt>
              <dd className="mt-0.5">Apply → Draw Model → Simulate.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Indonesian prompt?</dt>
              <dd className="mt-0.5">
                Notes in # can be any language; keep network keywords and distributions in English for reliable
                parsing.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Sign-in required?</dt>
              <dd className="mt-0.5">No for teaching use.</dd>
            </div>
          </dl>
        </section>

        {/* Ch 11 classroom */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part X — Teaching</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 11 — Notes for instructors
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            With dozens of concurrent learners, agree a <strong>baseline</strong>: Example 1, seed 12345, max
            cycles 100. Everyone matches once—then change one variable per exercise.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs">
            <li>
              <strong className="text-foreground">See waste:</strong> baseline idleness screenshot + who waits?
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
              decision (unit cost/SA) · integrity
            </li>
          </ul>
        </section>

        {/* Epilogue */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Epilogue</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            When the diagram is clean and the numbers are stable, you <strong>see the operation</strong>—what
            Halpin asked of a generation of students. AI can speed typing; it cannot replace that seeing. Keep
            seed 12345 as a shared baseline; change one idea at a time; watch idleness and unit cost.
          </p>
          <p className="mt-3 text-xs">
            If you are among the growing number of people using this studio: thank you. Confusing moments make
            the next manual better.
          </p>
        </section>

        <footer className="border-t border-border pt-6 text-center text-[11px] text-muted-foreground">
          <p className="text-xs text-foreground/80">
            <strong>Quick path:</strong> Example or Format Prompt → Draw Model → Simulate → Sensitivity (if
            planned) → AI Assistant (optional) → Export.
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
