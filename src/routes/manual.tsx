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

      <main className="mx-auto max-w-3xl space-y-12 px-4 py-8 text-sm leading-relaxed text-muted-foreground">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">{PRODUCT_TAGLINE}</p>
          <p className="mt-1 text-xs text-muted-foreground">{PRODUCT_DEDICATION}</p>
          <p className="mt-3 text-xs">
            <strong className="text-foreground">Product:</strong> {PRODUCT_TAGLINE}.{" "}
            <strong className="text-foreground">Dedication:</strong> {PRODUCT_DEDICATION}.{" "}
            Full source text also in{" "}
            <code className="text-foreground">docs/USER_MANUAL.md</code> (same content family).
          </p>
        </div>

        {/* Chapter 1 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part I — Getting oriented</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 1 — Introduction</h2>
          <div className="gold-rule my-3 max-w-xs" />

          <h3 className="font-display text-base font-semibold text-foreground">1.1 Purpose</h3>
          <p className="mt-2 text-xs">
            Neo-CYCLONE is <strong className="text-foreground">AI-Assisted Construction Operation Simulation</strong> — an
            educational web app for modeling and simulating <strong className="text-foreground">repetitive construction
            operations</strong> in the spirit of Professor <strong className="text-foreground">Daniel W. Halpin's
            CYCLONE</strong> (CYCLic Operations NEtwork).
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>First contact with construction operations as <strong className="text-foreground">flow</strong></li>
            <li>Measure <strong className="text-foreground">idleness</strong> (waiting / waste)</li>
            <li>Bridge to Lean Construction and Project Production Management ideas</li>
            <li>Learn QUEUE, COMBI, NORMAL, COUNTER, GEN, CON, probability, sensitivity without old desktop installs</li>
          </ul>
          <p className="mt-2 text-xs">It is a <strong className="text-foreground">teaching studio</strong>, not a special-purpose industrial controller.</p>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.2 Why this exists (dedication)</h3>
          <p className="mt-2 text-xs">
            Tribute to Professor Daniel W. Halpin: flow, idleness, and CYCLONE as a network language for cyclic construction work.
            Lineage (Chapter 9): CYCLONE → MicroCYCLONE → DISCO, PROSIDYC, COST, WebCYCLONE, Simphony / Symphony.Net.
            Halpin's grammar still lets us describe an operation clearly enough for AI-assisted modeling today.
          </p>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.3 Approach</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li><strong className="text-foreground">Practice:</strong> Format Prompt → Draw Model → check network → Simulate</li>
            <li><strong className="text-foreground">AI Assistant:</strong> context-bound co-pilot (Apply required for prompt edits)</li>
            <li><strong className="text-foreground">Not:</strong> autonomous agent that runs simulations without you, or a black-box neural simulator</li>
          </ul>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.4 Studio layout</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li><strong className="text-foreground">Header:</strong> logo, tagline, Manual (no sign-in required for teaching)</li>
            <li><strong className="text-foreground">Left:</strong> Example · Format Prompt · Draw Model · Format Prompt template</li>
            <li><strong className="text-foreground">Right:</strong> CYCLONE Model · Simulate (cycles, seed, dice)</li>
            <li><strong className="text-foreground">Below:</strong> Results (Simulation · Sensitivity) then AI Assistant</li>
            <li><strong className="text-foreground">Footer:</strong> tagline · version · year</li>
          </ul>
        </section>

        {/* Chapter 2 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part II — How to use</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 2 — How-to</h2>
          <div className="gold-rule my-3 max-w-xs" />

          <h3 className="font-display text-base font-semibold text-foreground">2.1 Quick path (first run)</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs">
            <li>Select an <strong className="text-foreground">Example</strong> (or write your prompt).</li>
            <li><strong className="text-foreground">Draw Model</strong> — Examples do not auto-draw.</li>
            <li>Check QUEUEs, tasks, counter, solid black forward vs dashed gold return arcs.</li>
            <li>Max cycles (default 100, max 500); seed 12345 (dice optional).</li>
            <li><strong className="text-foreground">Simulate</strong>.</li>
            <li>Optional Excel / PNG exports.</li>
            <li>Optional AI Assistant questions.</li>
          </ol>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.2 From blank prompt</h3>
          <p className="mt-2 text-xs">
            Write Format Prompt (Chapter 4) → Draw Model → refine → Simulate → optional Cost / Sensitivity → optional AI Assistant.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.3 Iterate before Simulate</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Home QUEUE per resource?</li>
            <li>Multi-resource meetings → COMBI; single resource → NORMAL?</li>
            <li>Exact <code className="text-foreground">Counter after:</code> names?</li>
            <li>GEN/CON only when unit logic needs them?</li>
            <li>Branch probabilities sensible?</li>
            <li><code className="text-foreground">Operation:</code> set for Excel filename / title?</li>
          </ul>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.4 Results & export</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li><strong className="text-foreground">Simulation</strong> — Process Report, productivity chart, steady state, idleness, cost, Excel/PNG</li>
            <li><strong className="text-foreground">Sensitivity</strong> — when prompt has Sensitivity: ranges</li>
            <li>Excel name uses <code className="text-foreground">Operation:</code> when present</li>
          </ul>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.5 AI Assistant (overview)</h3>
          <p className="mt-2 text-xs">
            Bound to current prompt, network, and last results. English preferred. Replies ≤20 lines. Edits only after{" "}
            <strong className="text-foreground">Apply</strong> → Draw Model → Simulate. Details in Chapter 7.
          </p>

          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.6 Random seed (reproducibility)</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li><strong className="text-foreground">What:</strong> start of the RNG stream for stochastic durations and branch p</li>
            <li><strong className="text-foreground">Default 12345</strong> — demos, homework, fair comparisons</li>
            <li>Same seed + same model + same max cycles → <strong className="text-foreground">identical</strong> results</li>
            <li>Different seed → same network, another random path</li>
            <li>UI: seed field + <strong className="text-foreground">dice</strong> under the model; Excel logs the seed</li>
            <li>Seed is not an operational parameter (not fleet size or cost)</li>
          </ul>
        </section>

        {/* Chapter 3 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part III — Teaching examples</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 3 — Six Examples</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-xs mb-2">Each example: <code className="text-foreground">#</code> notes → <code className="text-foreground">Operation:</code> → network. Select does not auto-draw.</p>
          <ol className="list-decimal space-y-1.5 pl-5 text-xs">
            <li><strong className="text-foreground">Earthmoving</strong> — classic fleet; cost; steady state</li>
            <li><strong className="text-foreground">Asphalt Paving</strong> — branch probability</li>
            <li><strong className="text-foreground">Loading Dump Truck</strong> — GEN / CON</li>
            <li><strong className="text-foreground">Tower Crane</strong> — multi-demand, Priority, multi-counter</li>
            <li><strong className="text-foreground">Masonry</strong> — face stocks; sensitivity intro</li>
            <li><strong className="text-foreground">Precast Plant</strong> — Halpin Ch.14-style + complex SA</li>
          </ol>
        </section>

        {/* Chapter 4 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part IV — Format Prompt & rules</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 4 — Format Prompt</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mb-2 text-xs">
            Block order:{" "}
            <strong className="text-foreground">
              Operation (optional) → Network → Durations → Priority → Branch → Cost → Sensitivity
            </strong>
            . Comments <code className="text-foreground">#</code>/<code className="text-foreground">//</code> ignored. Time: minutes. Cost: USD/h.
          </p>
          <p className="mb-2 text-xs">
            After <code className="text-foreground">#</code> notes, first data line:{" "}
            <code className="text-foreground">Operation: Earthmoving</code> (aliases Model / Title / Op) — model title and Excel filename.
            Examples place it after their comment block.
          </p>
          <pre className="overflow-x-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[11px] text-foreground">
            {GENERAL_TEMPLATE}
          </pre>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs">
            <li>Sequence arrows: → · {"->"} · {"-->"} · {"=>"}</li>
            <li>
              Multi-demand: <code className="text-foreground">A | B | C</code> + Priority
            </li>
            <li>Inline GEN/CON preferred on the resource chain</li>
            <li>Home QUEUE automatic per resource</li>
          </ul>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">Duration distributions (minutes)</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li><code className="text-foreground">const</code> — fixed</li>
            <li><code className="text-foreground">unif</code> — min, max</li>
            <li><code className="text-foreground">tri</code> — min, mode, max</li>
            <li><code className="text-foreground">normal</code> / <code className="text-foreground">lognormal</code> — mean, sd</li>
            <li><code className="text-foreground">beta</code> — min, max, α, β (4-param)</li>
            <li><code className="text-foreground">pert</code> — a, m, b → PERT-beta</li>
            <li><code className="text-foreground">gamma</code> — shape, scale</li>
          </ul>
          <p className="mt-2 text-xs">Aliases: pert = beta-pert. Three-number beta is treated as PERT.</p>
        </section>

        {/* Chapter 5 */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 5 — Modeling rules</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ol className="list-decimal space-y-1.5 pl-5 text-xs">
            <li>Every resource has a home QUEUE (idleness measured there).</li>
            <li>≥2 resources meet → COMBI; one resource → NORMAL.</li>
            <li>Forward arcs = solid black; return to home QUEUE = dashed gold.</li>
            <li>GEN / CON optional and independent — only when unit logic needs them.</li>
            <li>
              <code className="text-foreground">Counter after:</code> exact task name(s); multi-counter allowed.
            </li>
            <li>Grid layout: ordered tasks, queues; counter near the end.</li>
            <li>Do not hand-draw QUEUE or arrows in the prompt — the builder creates them.</li>
          </ol>
          <p className="mt-2 text-xs">
            Full graphic notation: <code className="text-foreground">docs/NOTATION_STANDARD.md</code>.
          </p>
        </section>

        {/* Chapter 6 */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 6 — Results</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <h3 className="font-display text-base font-semibold text-foreground">6.1 Simulation tab</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Process Report — run length, cycles, production, time between units</li>
            <li>Production by cycle (units/hour from cycle 0); steady state 5% band, window ≥10 cycles (old-gold dashed)</li>
            <li>Resource idleness — idle % and busy % labels</li>
            <li>Activity / element stats (MicroCYCLONE-style)</li>
            <li>Cost Report when rates exist: per resource, total, unit cost (USD)</li>
          </ul>
          <h3 className="font-display mt-4 text-base font-semibold text-foreground">6.2 Sensitivity Analysis tab</h3>
          <p className="mt-2 text-xs">
            When prompt includes Sensitivity: pairwise productivity & unit-cost charts, best markers, idleness tables.
          </p>
          <h3 className="font-display mt-4 text-base font-semibold text-foreground">6.3 Export</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Report Excel (.xls) — multi-sheet; name from Operation:</li>
            <li>Chart PNG on each chart frame</li>
            <li>Diagram PNG from the model canvas</li>
          </ul>
        </section>

        {/* Chapter 7 — full */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">AI co-pilot</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 7 — AI Assistant</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-xs">
            Educational co-pilot below Results — not an autonomous simulator. Simulation always runs in local CYCLONE code after Simulate.
          </p>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.1 Purpose</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li><strong className="text-foreground">Stay grounded</strong> — current Format Prompt, network, last results</li>
            <li><strong className="text-foreground">Teach Halpin ideas</strong> — flow, idleness (waste), steady state, unit cost, GEN/CON</li>
            <li><strong className="text-foreground">Propose safe edits</strong> — Apply → Draw Model → Simulate</li>
            <li><strong className="text-foreground">Reduce friction</strong> — fleet counts, bottleneck, productivity checks</li>
          </ul>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.2 Technology</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li><strong className="text-foreground">AI mode</strong> — when <code className="text-foreground">XAI_API_KEY</code> is set; compact CONTEXT snapshot only</li>
            <li><strong className="text-foreground">Local mode</strong> — no key / API failure; English-first intent helper</li>
            <li><strong className="text-foreground">Language:</strong> English-first product (UI, Manual, keywords)</li>
            <li><strong className="text-foreground">Chat UI:</strong> gold user bubbles (right) vs white assistant (left); guidance in input placeholder</li>
            <li><strong className="text-foreground">Quick chips (general):</strong> How many resources? · Bottleneck? · Productivity? · Unit cost?</li>
            <li><strong className="text-foreground">Rate limits:</strong> Assistant 30/h/IP · DSL draft 20/h/IP</li>
            <li><strong className="text-foreground">Reply length:</strong> ≤20 lines</li>
          </ul>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.3 What it can do</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Explain cycles, COMBI vs NORMAL, counter, GEN/CON, branch p</li>
            <li>Report fleet counts from the Format Prompt</li>
            <li>Interpret last-run productivity, steady state, unit cost, idleness</li>
            <li>Suggest bottleneck from stats</li>
            <li>Propose Format Prompt edits (Apply required)</li>
          </ul>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.4 What it cannot do</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Auto-run Simulate or Apply without you</li>
            <li>Invent a different operation as if it were current</li>
            <li>Replace CYCLONE with black-box AI simulation</li>
            <li>Answer unrelated general topics</li>
            <li>Guarantee optimal fleets without runs</li>
            <li>Bypass rate limits as free unlimited chat</li>
          </ul>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.5 Recommended questions</h3>
          <p className="mt-2 text-xs font-medium text-foreground">Model understanding</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
            <li>Explain this model's resource cycles.</li>
            <li>Which tasks are COMBI and which are NORMAL?</li>
            <li>Where is the production counter?</li>
            <li>How do GEN and CON work in this model?</li>
            <li>Is there a branch / probability path?</li>
          </ul>
          <p className="mt-3 text-xs font-medium text-foreground">Fleet & results</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
            <li>How many of each resource are in the Format Prompt?</li>
            <li>Which resource has the highest idleness (waste)?</li>
            <li>What is the likely bottleneck resource?</li>
            <li>What was last-run productivity (units/hour)?</li>
            <li>Has the system reached steady state? What is the unit cost (USD)?</li>
          </ul>
          <p className="mt-3 text-xs font-medium text-foreground">Edits & teaching</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
            <li>Change a fleet count in the Format Prompt (use names from your model).</li>
            <li>What is the unit cost?</li>
            <li>What is home-QUEUE idleness and why is it waste?</li>
            <li>Why must every resource have a queue in a CYCLONE cycle?</li>
            <li>Which SA combination had best unit cost / highest productivity?</li>
          </ul>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.6 Boundary</h3>
          <p className="mt-2 rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[13px] leading-relaxed text-foreground">
            Answers only about the <strong>current</strong> Format Prompt, drawn network, and <strong>last</strong> results.
            May <strong>propose</strong> edits; you must <strong>Apply</strong>, <strong>Draw Model</strong>, and <strong>Simulate</strong>.
          </p>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.7 Workflow</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs">
            <li>Example or Format Prompt → Draw Model → Simulate.</li>
            <li>Open AI Assistant under Results.</li>
            <li>Ask about productivity, idleness, or bottleneck.</li>
            <li>If a prompt is proposed → Apply → Draw → Simulate again.</li>
            <li>Optional: Sensitivity tab for fleet comparisons.</li>
          </ol>
        </section>

        {/* Chapter 8 */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 8 — Limits & deploy</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <h3 className="font-display mt-4 text-base font-semibold text-foreground">8.1 Simulation</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>Max cycles: default <strong className="text-foreground">100</strong>, hard cap <strong className="text-foreground">500</strong></li>
            <li>Seed: default <strong className="text-foreground">12345</strong> (see §2.6); dice randomizes another path</li>
            <li>Time unit: <strong className="text-foreground">minutes</strong></li>
            <li>Sensitivity: max <strong className="text-foreground">5</strong> resources; ~150 combinations (ranges step up, not cut mid-axis)</li>
          </ul>
          <h3 className="font-display mt-4 text-base font-semibold text-foreground">8.2 Sensitivity performance</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Batches prefer a <strong className="text-foreground">Web Worker</strong> so the UI stays responsive</li>
            <li>Fallback: main thread (same numbers; UI may pause briefly)</li>
            <li>Single Simulate stays on the main thread (fast enough for teaching)</li>
          </ul>
          <h3 className="font-display mt-4 text-base font-semibold text-foreground">8.3 AI Assistant & API</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Assistant: <strong className="text-foreground">30 / hour / IP</strong></li>
            <li>AI DSL draft: <strong className="text-foreground">20 / hour / IP</strong></li>
            <li>Compact CONTEXT only; replies ≤20 lines</li>
            <li>Without API key: local English-first helper still works</li>
          </ul>
          <h3 className="font-display mt-4 text-base font-semibold text-foreground">8.4 Deploy</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Source of truth: GitHub <code className="text-foreground">main</code> → Vercel auto-deploy</li>
            <li>Optional: <code className="text-foreground">XAI_API_KEY</code> for AI mode</li>
            <li>Teaching use does not require sign-in</li>
            <li>
              Live:{" "}
              <a className="text-primary hover:underline" href="https://neo-cyclone.vercel.app/" target="_blank" rel="noreferrer">
                neo-cyclone.vercel.app
              </a>
            </li>
          </ul>
        </section>

        {/* Chapter 9 */}
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Literature</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 9 — References</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-xs mb-3">
            Selected literature on CYCLONE, MicroCYCLONE, and applications by Daniel W. Halpin, students, and collaborators.
          </p>
          <h3 className="font-display text-sm font-semibold text-foreground">9.1 Foundations</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs">
            <li>Halpin, D. W. (1973). Ph.D. dissertation, University of Illinois at Urbana–Champaign.</li>
            <li>Halpin, D. W. (1977). “CYCLONE: Method for Modeling of Job Site Processes.” J. Constr. Div., ASCE, 103(3), 489–499.</li>
            <li>Halpin, D. W., & Riggs, L. S. (1992). Planning and Analysis of Construction Operations. Wiley.</li>
          </ol>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">9.2 MicroCYCLONE</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs" start={4}>
            <li>Lluch, J., & Halpin, D. W. (1982). J. Constr. Div., ASCE, 108(1), 129–145.</li>
            <li>Halpin, D. W. (1990–1992). MicroCYCLONE User / System manuals. Purdue / Learning Systems.</li>
          </ol>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">9.3 DISCO</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs" start={6}>
            <li>Huang, R.-Y., & Halpin, D. W. (1993–1995). DISCO papers (ISARC; Microcomputers in Civil Engineering; J. Constr. Eng. Manage.).</li>
            <li>Huang, R.-Y. (1994). Ph.D., Purdue (advisor: Halpin).</li>
          </ol>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">9.4 PROSIDYC · COST · WebCYCLONE</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs" start={8}>
            <li>Halpin, D. W., & Martinez, L.-H. (1999). PROSIDYC. WSC.</li>
            <li>Cheng, T.-M., et al. (2000). COST. 17th ISARC.</li>
            <li>Halpin, D. W., Jen, H., & Kim, J. (2003). WebCYCLONE. WSC.</li>
          </ol>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">9.5–9.6 Purdue circle & related lineage</h3>
          <p className="mt-2 text-xs">
            AbouRizk & Halpin; Hijazi; Lutz; Gonzalez-Quevedo; Abraham; project-level CYCLONE; AbouRizk et al. (2011).
            Related: UM-CYCLONE (Ioannou); STROBOSCOPE (Martinez); Simphony / Simphony.NET (AbouRizk et al.).
          </p>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">9.7 Relation</h3>
          <p className="mt-2 text-xs">
            Neo-CYCLONE does <strong className="text-foreground">not</strong> replace those systems. It is{" "}
            <strong className="text-foreground">{PRODUCT_TAGLINE}</strong> — a teaching studio in Halpin's tradition.
          </p>
        </section>

        <footer className="border-t border-border pt-6 text-center text-[11px] text-muted-foreground">
          <p className="text-xs">
            <strong className="text-foreground">Quick path:</strong> Example or Format Prompt → Draw Model → Simulate →
            Sensitivity (if planned) → AI Assistant (optional) → Export Excel / PNG.
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
