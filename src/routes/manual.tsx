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
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-primary">{PRODUCT_TAGLINE}</p>
          <p className="mt-4 text-[13px] leading-relaxed text-foreground/90">
            For students, instructors, and practitioners who want to understand construction operations as{" "}
            <em>flow</em>. Includes diagram literacy (how Neo-CYCLONE draws CYCLONE).{" "}
            <strong>References at the end</strong>. Full source text:{" "}
            <code className="text-foreground">docs/USER_MANUAL.md</code>.
          </p>
        </div>

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
              Read units/hour and <strong>idleness</strong>, then Chapter 4 to read the diagram legend.
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
              Construction work is full of <strong>repetition</strong>. Between busy moments, resources wait. That
              waiting is often <strong>the structure of the process</strong>, not mere laziness.
            </p>
            <p>
              Professor <strong>Daniel W. Halpin</strong> made that structure visible with <strong>CYCLONE</strong> (
              <em>CYCLic Operations NEtwork</em>). From it grew MicroCYCLONE, DISCO, PROSIDYC, COST, WebCYCLONE, and
              related systems (see References at the end).
            </p>
            <p>
              <strong>Neo-CYCLONE</strong> is a browser <strong>teaching studio</strong> in that tradition: a
              discrete-event CYCLONE-style engine first, with an AI Assistant as co-pilot. You remain responsible for
              Draw Model, Simulate, and judgment.
            </p>
            <p className="rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[13px] text-foreground">
              One habit: <strong>draw the cycles until they tell the truth, then run the numbers</strong>.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Chapter 1 — Operations, flow, and idleness
          </h2>
          <div className="gold-rule my-3 max-w-xs" />

          <h3 className="font-display text-base font-semibold text-foreground">
            1.1 What we mean by “construction operation”
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            An <em>operation</em> is a <strong>repeatable production process</strong>—often measured in units per
            hour—not the whole project Gantt chart. Earthmoving, paving, crane service, masonry stocking, precast form
            cycles: each has resources, tasks, and waiting. Thinking at this level matters for Lean Construction and
            Project Production Management.
          </p>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            1.2 Flow and idleness (waste you can measure)
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            A resource that is not working is usually <strong>in a queue</strong>. That <strong>idleness</strong> is a
            signal: too few trucks → loader idle; too many trucks → truck queue grows; wrong crane priority → a zone
            starves. Neo-CYCLONE reports idle % and busy % so waste is hard to ignore.
          </p>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.3 Why a network language?</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
            Networks force clarity: which resources exist, work order, waiting places, where resources{" "}
            <strong>meet</strong>, and what counts as one production unit. Neo-CYCLONE keeps that CYCLONE logic; glyphs
            and arrow colors are tuned for the screen (Chapter 4).
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
                  <td className="px-2 py-1.5">Browser teaching studio for cyclic operations</td>
                  <td className="px-2 py-1.5">Project ERP</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-2 py-1.5">Prompt → diagram → discrete-event simulation</td>
                  <td className="px-2 py-1.5">Black-box “AI simulation” without a model</td>
                </tr>
                <tr>
                  <td className="px-2 py-1.5">MicroCYCLONE-style reports + classroom limits</td>
                  <td className="px-2 py-1.5">Pixel-perfect reprint of old book figures</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed">
            <strong className="text-foreground">Studio:</strong> left = Example / Format Prompt / Draw Model; right =
            CYCLONE Model / cycles & seed / Simulate; below = Results then AI Assistant. No sign-in required for
            teaching. Cite footer version in homework.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Chapter 2 — Fifteen minutes that stick (Earthmoving)
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            Do this once with Example 1 even if you already “know trucks.”
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-xs leading-relaxed">
            <li>
              Example → <strong className="text-foreground">1. Earthmoving</strong>. Read notes,{" "}
              <code className="text-foreground">Operation: Earthmoving</code>, truck cycle, loader at Load (COMBI),{" "}
              <code className="text-foreground">Counter after: Dump</code>, cost, durations in minutes.
            </li>
            <li>
              Click <strong className="text-foreground">Draw Model</strong> (examples do not auto-draw). Confirm home
              QUEUEs, COMBI Load, NORMAL hauls, golf-flag COUNTER, solid black forward and dashed gold return arcs.
            </li>
            <li>
              Max cycles default <strong className="text-foreground">100</strong> (cap 500); seed default{" "}
              <strong className="text-foreground">12345</strong>. Same seed + model + cycles → identical stochastic
              results.
            </li>
            <li>
              <strong className="text-foreground">Simulate</strong>: Process Report → units/hour by cycle (steady state
              ~5% / ≥10 cycles) → idleness → Cost Report if rates exist.
            </li>
            <li>
              Optional Excel/PNG and AI chips. Prompt edits need{" "}
              <strong className="text-foreground">Apply → Draw Model → Simulate</strong>.
            </li>
          </ol>
          <p className="mt-4 text-xs">
            <strong className="text-foreground">Quick path:</strong> Prompt → Draw Model → check diagram (Ch.4) →
            Simulate → Sensitivity (if planned) → AI (optional) → Export.
          </p>
          <p className="mt-3 text-xs font-medium text-foreground">Common first-session mistakes</p>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-xs">
            <li>Expecting a diagram from Example alone</li>
            <li>Simulating before the diagram matches the story</li>
            <li>Assuming chat edits changed the engine without Apply</li>
            <li>Comparing runs with different seeds</li>
            <li>Reading only total production, ignoring idleness</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Chapter 3 — How to talk so the studio can build a network
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            You describe <strong>resource cycles</strong>; the builder creates queues, tasks, and arcs.
          </p>
          <p className="mt-3 text-xs leading-relaxed">
            <code className="text-foreground">#</code> / <code className="text-foreground">//</code> = notes only.
            After notes, optional <code className="text-foreground">Operation: Name</code> (aliases Model / Title /
            Op) for title and Excel filename. Then resource cycles and counts (e.g.{" "}
            <code className="text-foreground">5 trucks, 1 loader</code>); arrows → · {"->"} · {"-->"} · {"=>"};
            multi-demand <code className="text-foreground">A | B | C</code>; Priority (lower = first);{" "}
            <code className="text-foreground">Counter after:</code> exact task name(s).
          </p>
          <p className="mt-3 text-xs leading-relaxed">
            Durations in minutes (const, unif, tri, normal, lognormal, beta, pert, gamma). Optional Branch{" "}
            <code className="text-foreground">p=</code> and inline GEN/CON when unit logic needs them. Cost USD/h;
            Sensitivity last (≤5 resources; ~150 combos). Order:{" "}
            <strong className="text-foreground">
              Operation → Network → Durations → Priority → Branch → Cost → Sensitivity
            </strong>
            .
          </p>
          <p className="mt-4 text-xs font-medium text-foreground">Live Format Prompt template</p>
          <pre className="mt-2 max-h-64 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[10px] leading-snug text-foreground">
            {GENERAL_TEMPLATE}
          </pre>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Chapter 4 — Reading the model: how Neo-CYCLONE draws CYCLONE
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            The <strong>CYCLONE Model</strong> panel is not decoration. Workflow: Format Prompt →{" "}
            <strong>Draw Model</strong> → inspect → fix → Simulate.
          </p>
          <p className="mt-3 text-xs leading-relaxed">
            <strong className="text-foreground">Shapes:</strong> QUEUE (Q-slash circle); COMBI (cut square, ≥2
            resources); NORMAL (rectangle); COUNTER (golf flag); GEN ▽; CON △.{" "}
            <strong className="text-foreground">Arrows:</strong> solid black = forward; dashed gold = return to home
            QUEUE; branch may show <code className="text-foreground">p=…</code>.
          </p>
          <p className="mt-4 text-xs font-medium text-foreground">Same spirit as CYCLONE — different surface</p>
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
                  <td className="px-2 py-1.5">Q-slash · cut square · golf flag</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-2 py-1.5 font-medium">Arrows</td>
                  <td className="px-2 py-1.5">Usually black linework</td>
                  <td className="px-2 py-1.5">Black solid forward · gold dashed return</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="px-2 py-1.5 font-medium">GEN / CON · AI</td>
                  <td className="px-2 py-1.5">Function nodes; no AI historically</td>
                  <td className="px-2 py-1.5">▽ / △ inline; context-bound Assistant</td>
                </tr>
                <tr>
                  <td className="px-2 py-1.5 font-medium">If figures disagree</td>
                  <td className="px-2 py-1.5">Book / original software</td>
                  <td className="px-2 py-1.5">This app’s legend + engine</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed">
            <strong className="text-foreground">Must stay CYCLONE:</strong> queues, timed work, meetings, closed
            cycles, counters. <strong className="text-foreground">May look different:</strong> colors, icons, auto
            layout, prompt-first authoring (
            <code className="text-foreground">docs/NOTATION_STANDARD.md</code>). Before Simulate: home QUEUE per
            resource; true meetings → COMBI; matching counter names; gold returns only to home idles.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 5 — Simulation results</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            After <strong>Simulate</strong>, start with the <strong>Process Report</strong> (run length, production
            events, units per event, total production, first unit time, average time between units).
          </p>
          <p className="mt-3 text-xs leading-relaxed">
            <strong className="text-foreground">Units/hour by cycle</strong> from 0; early noise is normal. Steady
            state (teaching): ~5% over ≥10 cycles—old-gold dashed line. Idle % and busy % are both labeled. With{" "}
            <code className="text-foreground">Cost:</code> rates, unit cost ≈ total ÷ production. Sensitivity tab when
            the prompt has <code className="text-foreground">Sensitivity:</code> (pairwise charts; caps apply). Export
            Excel/PNG; record Operation, seed, cycles.
          </p>
          <p className="mt-3 text-xs leading-relaxed">
            <strong className="text-foreground">One-minute discussion:</strong> steady-state units/hour → highest idle
            % → unit cost → what if we add one scarce resource?
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Chapter 6 — Six Examples as a learning path
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-xs mb-3">
            Selecting an Example only fills the prompt. <strong className="text-foreground">You</strong> click Draw
            Model. Use Chapter 4 while you look at each diagram.
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-xs leading-relaxed">
            <li>
              <strong className="text-foreground">Earthmoving</strong> — two home QUEUEs; COMBI Load; gold returns;
              cost; steady state
            </li>
            <li>
              <strong className="text-foreground">Asphalt Paving</strong> — meeting + branch probability
            </li>
            <li>
              <strong className="text-foreground">Loading Dump Truck</strong> — inline GEN / CON
            </li>
            <li>
              <strong className="text-foreground">Tower Crane</strong> — multi-demand, priority, multi-counter
            </li>
            <li>
              <strong className="text-foreground">Masonry</strong> — face stocks; sensitivity intro
            </li>
            <li>
              <strong className="text-foreground">Precast Plant</strong> — longer line; richer SA
            </li>
          </ol>
          <p className="mt-3 text-xs">Path: 1→2→3 mechanics; 4 shared resources; 5–6 decisions under sensitivity.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Chapter 7 — What “AI-assisted” should mean here
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            A co-pilot under Results—not a search engine. Explains <em>this</em> model and the <em>last</em> run; may
            propose Format Prompt edits; replies ≤20 lines. Must not silently re-simulate or invent another operation.
            AI mode uses compact CONTEXT when <code className="text-foreground">XAI_API_KEY</code> is set; otherwise
            local English-first helper (~30 requests / hour / IP).
          </p>
          <p className="mt-3 rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[13px] text-foreground">
            Bound to the <strong>current</strong> prompt, network, and last results. Propose →{" "}
            <strong>Apply</strong> → <strong>Draw Model</strong> → <strong>Simulate</strong>.
          </p>
          <p className="mt-3 text-xs leading-relaxed">
            Prefer “Which resource has the highest idle %?” over “Make it better.” Prefer named fleet edits over
            “Optimize everything.”
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Chapter 8 — Limits, deploy, and integrity
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-xs leading-relaxed">
            Max cycles default 100 / cap 500; seed default 12345; minutes; Sensitivity ≤5 resources / ~150 combos. AI:
            ~30 Assistant / hour / IP; replies ≤20 lines. Deploy: GitHub{" "}
            <code className="text-foreground">main</code> → Vercel (
            <a
              className="text-primary hover:underline"
              href="https://neo-cyclone.vercel.app/"
              target="_blank"
              rel="noreferrer"
            >
              neo-cyclone.vercel.app
            </a>
            ). No sign-in for teaching. Cite product + version, URL, Operation, seed, max cycles.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 9 — FAQ</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <dl className="space-y-3 text-xs leading-relaxed">
            <div>
              <dt className="font-semibold text-foreground">Example selected, nothing drew?</dt>
              <dd className="mt-0.5">Click Draw Model.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Diagram ≠ book figure?</dt>
              <dd className="mt-0.5">Same CYCLONE logic; Neo-CYCLONE teaching notation (Chapter 4).</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Gold dashed arrows?</dt>
              <dd className="mt-0.5">Return to a home QUEUE. Solid black = forward work.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">COMBI vs NORMAL?</dt>
              <dd className="mt-0.5">≥2 resources meet → COMBI; alone → NORMAL.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Classmate got different productivity?</dt>
              <dd className="mt-0.5">Match seed, max cycles, and the full Format Prompt.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Steady-state line?</dt>
              <dd className="mt-0.5">~5% band over ≥10 cycles—old-gold dashed on units/hour.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Sensitivity empty?</dt>
              <dd className="mt-0.5">
                Need a <code className="text-foreground">Sensitivity:</code> block (Examples 5–6).
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Ugly Excel name?</dt>
              <dd className="mt-0.5">
                <code className="text-foreground">Operation: ShortName</code> after # notes.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">AI text changed but numbers did not?</dt>
              <dd className="mt-0.5">Apply → Draw Model → Simulate.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Bibliography?</dt>
              <dd className="mt-0.5">References at the end of this manual.</dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Chapter 10 — Notes for instructors
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            Baseline for the class: Example 1, seed 12345, max cycles 100. Everyone matches once—then change one
            variable per exercise.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs">
            <li>See waste: baseline idleness + who waits?</li>
            <li>Read the diagram: label QUEUE / COMBI / NORMAL / COUNTER / gold return</li>
            <li>Fleet change: trucks 3 vs 8, same seed → unit cost table</li>
            <li>AI may draft; graded claims need engine runs after Apply</li>
            <li>Rubric: model truth · waste literacy · reproducibility · decision · integrity</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Epilogue</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            When the diagram is clean and the numbers are stable, you <strong>see the operation</strong>. Honor
            CYCLONE logic; learn this studio’s legend; run the engine. Seed 12345 as shared baseline; change one idea
            at a time; watch idleness and unit cost.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">References</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mb-3 text-xs">
            Placed <strong className="text-foreground">last</strong>. Selected works by Halpin, students, and
            collaborators.
          </p>
          <ol className="list-decimal space-y-1.5 pl-5 text-xs">
            <li>Halpin, D. W. (1973). Ph.D. dissertation, University of Illinois at Urbana–Champaign.</li>
            <li>
              Halpin, D. W. (1977). “CYCLONE: Method for Modeling of Job Site Processes.” J. Constr. Div., ASCE,
              103(3), 489–499.
            </li>
            <li>Halpin, D. W., & Riggs, L. S. (1992). Planning and Analysis of Construction Operations. Wiley.</li>
            <li>Lluch, J., & Halpin, D. W. (1982). J. Constr. Div., ASCE, 108(1), 129–145. MicroCYCLONE manuals.</li>
            <li>Huang, R.-Y., & Halpin, D. W. (1993–1995). DISCO; Huang (1994) Ph.D. Purdue.</li>
            <li>PROSIDYC (1999); COST (2000); WebCYCLONE (2003).</li>
            <li>Related: UM-CYCLONE; STROBOSCOPE; Simphony / Simphony.NET.</li>
          </ol>
          <p className="mt-3 text-xs leading-relaxed">
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
