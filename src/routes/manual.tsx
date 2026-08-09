import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
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
              v1.6.2
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
        </div>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Part I — Getting oriented</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 1 — Introduction</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <h3 className="font-display text-base font-semibold text-foreground">1.1 Purpose</h3>
          <div className="mt-2 space-y-3 text-[15px] leading-[1.7]">
            <p>
              Neo-CYCLONE is <strong className="text-foreground">AI-Assisted Construction Operation Simulation</strong> —
              an educational web app for modeling repetitive construction operations in the spirit of Professor{" "}
              <strong className="text-foreground">Daniel W. Halpin’s CYCLONE</strong> (<em>CYCLic Operations NEtwork</em>).
            </p>
            <p>It is meant for first contact with construction operations as flow, measuring idleness, connecting process design to Lean Construction / Project Production Management, and learning classic MicroCYCLONE ideas (QUEUE, COMBI, NORMAL, COUNTER, GEN, CON, probability, sensitivity) without old desktop software.</p>
            <p>It is <strong className="text-foreground">not</strong> a special-purpose industrial factory controller. It is a <strong className="text-foreground">teaching studio</strong>.</p>
          </div>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.2 Why this exists (dedication)</h3>
          <div className="mt-2 space-y-3 text-[15px] leading-[1.7]">
            <p>This product is a <strong className="text-foreground">tribute to Professor Daniel W. Halpin</strong>. Students first met flow, idleness (waste), and CYCLONE as a network language for cyclic construction work.</p>
            <p>Historical line: <strong className="text-foreground">CYCLONE</strong>, <strong className="text-foreground">MicroCYCLONE</strong>, DISCO, PROSIDYC, COST, WebCYCLONE, Simphony / Symphony.Net.</p>
            <p>Halpin’s foundation is not obsolete in the age of AI — it is the <strong className="text-foreground">grammar</strong> that lets us describe an operation clearly enough for modeling and simulation.</p>
          </div>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.3 Approach</h3>
          <p className="mt-2 rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[14px] text-foreground">
            <strong>Product:</strong> {PRODUCT_TAGLINE}. <strong>Dedication:</strong> {PRODUCT_DEDICATION}.
            Practice: Format Prompt → <strong>Draw Model</strong> → <strong>Simulate</strong> → optional <strong>AI Assistant</strong>.
            Simulation runs in local deterministic code — not a black-box neural simulator.
          </p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.4 Studio layout</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li><strong className="text-foreground">Left:</strong> Prompt · Example · Draw Model · Format Prompt</li>
            <li><strong className="text-foreground">Right:</strong> CYCLONE Model · network logic · run parameters</li>
            <li><strong className="text-foreground">Below:</strong> Results — Simulation · Sensitivity Analysis · AI Assistant</li>
          </ul>
        </section>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Part II — How to use</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 2 — How-to</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs">
            <li>Select an Example or write a Format Prompt.</li>
            <li>Click <strong className="text-foreground">Draw Model</strong> — inspect cycles, meetings, counter.</li>
            <li>Set max cycles (default 100, max 500) and seed (default 12345).</li>
            <li>Click <strong className="text-foreground">Simulate</strong> — productivity, waste, cost.</li>
            <li>Optional Sensitivity, AI Assistant, Excel / PNG export.</li>
          </ol>
          <h3 className="font-display mt-5 text-base font-semibold text-foreground">2.3 Iterate before Simulate</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Home QUEUE per resource? Multi-resource → COMBI; single → NORMAL?</li>
            <li><code className="text-foreground">Counter after:</code> exact task name?</li>
            <li>GEN/CON only when unit logic needs them? Branch paths rejoin?</li>
          </ul>
        </section>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Part III — Teaching examples</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 3 — Six Examples</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ol className="list-decimal space-y-1.5 pl-5 text-xs">
            <li><strong className="text-foreground">Earthmoving</strong> — fleet, cost, steady state</li>
            <li><strong className="text-foreground">Asphalt Paving</strong> — branch probability</li>
            <li><strong className="text-foreground">Loading Dump Truck</strong> — GEN / CON</li>
            <li><strong className="text-foreground">Tower Crane</strong> — multi-demand, Priority, multi-counter</li>
            <li><strong className="text-foreground">Masonry</strong> — face stocks; sensitivity intro</li>
            <li><strong className="text-foreground">Precast Plant</strong> — Halpin Ch.14-style + complex SA</li>
          </ol>
        </section>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Part IV — Format Prompt & rules</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 4 — Format Prompt</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mb-2 text-xs">
            Block order: <strong className="text-foreground">Network → Durations → Priority → Branch → Cost → Sensitivity</strong>.
            Comments <code className="text-foreground">#</code>/<code className="text-foreground">//</code> ignored. Time: minutes. Cost: USD/h.
          </p>
          <pre className="overflow-x-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[11px] text-foreground">{GENERAL_TEMPLATE}</pre>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs">
            <li>
              Sequence arrows: → · {"->"} · {"-->"} · {"=>"}
            </li>
            <li>Multi-demand: <code className="text-foreground">A | B | C</code> + Priority (lower = higher)</li>
            <li>Inline GEN/CON on the resource chain</li>
            <li>Branch: <code className="text-foreground">After X: OutA p=0.9, OutB p=0.1</code></li>
          </ul>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">Duration distributions (minutes)</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li><code className="text-foreground">const 1.2</code> — fixed</li>
            <li><code className="text-foreground">unif 2, 5</code> — min, max</li>
            <li><code className="text-foreground">tri 1.5, 2, 3</code> — min, mode, max</li>
            <li><code className="text-foreground">normal 8, 1.5</code> — mean, sd</li>
            <li><code className="text-foreground">lognormal 8, 1.5</code> — mean, sd of duration</li>
            <li><code className="text-foreground">beta 1, 5, 2, 5</code> — <strong className="text-foreground">min, max, α, β</strong> (4-param)</li>
            <li><code className="text-foreground">pert 4, 6, 10</code> — <strong className="text-foreground">a, m, b</strong> → classic PERT-beta on [a,b]</li>
            <li><code className="text-foreground">gamma 4, 1.2</code> — shape, scale</li>
          </ul>
          <p className="mt-2 text-[11px]">Aliases: pert = beta-pert = betapert. <code className="text-foreground">beta</code> with three numbers is treated as PERT.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 5 — Modeling rules</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ol className="list-decimal space-y-1.5 pl-5 text-xs">
            <li>Every resource has a home QUEUE.</li>
            <li>≥2 resources meet → COMBI; one resource → NORMAL.</li>
            <li>Return arcs (dashed gold) only to home QUEUE; forward = solid black.</li>
            <li>GEN ▽ / CON △ optional and independent.</li>
            <li><code className="text-foreground">Counter after:</code> exact task name(s).</li>
            <li>Grid layout: ordered tasks, queues; counter near the end.</li>
          </ol>
          <h2 className="font-display mt-8 text-xl font-semibold text-foreground">Chapter 6 — Results</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ul className="list-disc space-y-1.5 pl-5 text-xs">
            <li>Production by cycle; productivity (units/hour)</li>
            <li>Steady state: ≤5% variation over ≥10 consecutive cycles (gold dashed line)</li>
            <li>Resource idleness / busy percentages</li>
            <li>Cost: per resource, total, unit cost (USD)</li>
            <li>Sensitivity: pairwise charts + idleness tab</li>
            <li>Download: Excel report; PNG for charts and model</li>
          </ul>
        </section>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Studio co-pilot</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 7 — AI Assistant</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[15px] leading-[1.7]">
            Educational <strong className="text-foreground">co-pilot</strong> bound to the current Format Prompt, drawn network, and last simulation/sensitivity results — not a black-box simulator.
          </p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.1 Purpose</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li><strong className="text-foreground">Stay grounded</strong> — current prompt, network, last-run metrics only</li>
            <li><strong className="text-foreground">Teach Halpin ideas</strong> — flow, idleness (waste), steady state, unit cost, GEN/CON</li>
            <li><strong className="text-foreground">Propose safe edits</strong> — you Apply → Draw Model → Simulate</li>
            <li><strong className="text-foreground">Reduce friction</strong> — fleet counts, bottleneck, productivity checks</li>
          </ul>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.2 Technology</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li><strong className="text-foreground">AI mode</strong> — <code className="text-foreground">XAI_API_KEY</code> on Vercel → xAI chat + studio context</li>
            <li><strong className="text-foreground">Local mode</strong> — no key → English-first intent helper</li>
            <li><strong className="text-foreground">Language</strong> — English-first (international product)</li>
            <li><strong className="text-foreground">Compact CONTEXT</strong> — browser builds a snapshot (prompt, network summary, last-run metrics); server does not receive the full simulation object graph</li>
            <li><strong className="text-foreground">Rate limits</strong> — Assistant <strong>30 / hour / IP</strong>; AI DSL draft <strong>20 / hour / IP</strong> (protects shared host & API cost)</li>
          </ul>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.3 What it can do</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Explain cycles, COMBI/NORMAL, counter, GEN/CON, branch</li>
            <li>Report fleet counts; last-run productivity, steady state, unit cost, idleness</li>
            <li>Identify bottleneck; propose Format Prompt edits (Apply required)</li>
          </ul>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.4 What it cannot do</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Auto-run simulation after an edit</li>
            <li>Invent a different operation as “current”</li>
            <li>Replace the CYCLONE engine with black-box AI simulation</li>
            <li>Answer unrelated topics; apply changes without confirmation</li>
            <li>Bypass rate limits or act as an unlimited free chat API</li>
          </ul>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.5 Recommended questions</h3>
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
            <li>Has the system reached steady state? What is the unit cost (USD)?</li>
          </ul>
          <p className="mt-3 text-xs font-medium text-foreground">Edits & teaching</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
            <li>Set trucks to 8. / Increase loaders to 2.</li>
            <li>What is home-QUEUE idleness and why is it waste?</li>
            <li>Why must every resource have a queue in a CYCLONE cycle?</li>
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
          </ol>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 8 — Limits & deploy</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <h3 className="font-display mt-4 text-base font-semibold text-foreground">8.1 Simulation</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>Max cycles: default <strong className="text-foreground">100</strong>, hard cap <strong className="text-foreground">500</strong></li>
            <li>Seed default <strong className="text-foreground">12345</strong> (reproducible classroom runs)</li>
            <li>Sensitivity: max <strong className="text-foreground">5</strong> resources; ~<strong className="text-foreground">150</strong> combinations (ranges down-sampled)</li>
          </ul>
          <h3 className="font-display mt-4 text-base font-semibold text-foreground">8.2 Sensitivity performance</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>SA batches run in a <strong className="text-foreground">Web Worker</strong> when available (UI stays responsive)</li>
            <li>Fallback to main thread if Workers fail — same numbers, possible brief UI pause</li>
            <li>Single-run Simulate stays on the main thread (fast for teaching cycles)</li>
          </ul>
          <h3 className="font-display mt-4 text-base font-semibold text-foreground">8.3 AI Assistant & API</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>Assistant: <strong className="text-foreground">30 requests / hour / IP</strong></li>
            <li>AI DSL draft: <strong className="text-foreground">20 requests / hour / IP</strong></li>
            <li>Server receives compact CONTEXT only (not full result objects)</li>
            <li>Full free-form chat needs <code className="text-foreground">XAI_API_KEY</code>; otherwise local English-first mode</li>
          </ul>
          <h3 className="font-display mt-4 text-base font-semibold text-foreground">8.4 Deploy</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs">
            <li>GitHub <code className="text-foreground">main</code> → Vercel auto-deploy</li>
            <li>Optional <code className="text-foreground">XAI_API_KEY</code> for AI mode</li>
          </ul>
          <p className="mt-3 text-[11px] text-muted-foreground">
            These limits protect shared hosting and API cost. They do not change CYCLONE modeling rules or Halpin-style metrics.
          </p>
        </section>

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Literature</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 9 — References</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mb-4 text-xs">Selected works on CYCLONE, MicroCYCLONE, and applications from Daniel W. Halpin and collaborators.</p>
          <h3 className="font-display text-sm font-semibold text-foreground">Foundations</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed">
            <li><strong className="text-foreground">Halpin, D. W.</strong> (1973). Ph.D., University of Illinois at Urbana–Champaign.</li>
            <li><strong className="text-foreground">Halpin, D. W.</strong> (1977). “CYCLONE: Method for Modeling of Job Site Processes.” <em>J. Constr. Div.</em>, ASCE, 103(3), 489–499.</li>
            <li><strong className="text-foreground">Halpin, D. W., & Riggs, L. S.</strong> (1992). <em>Planning and Analysis of Construction Operations</em>. Wiley.</li>
          </ol>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">MicroCYCLONE · DISCO · WebCYCLONE</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed" start={4}>
            <li><strong className="text-foreground">Lluch & Halpin</strong> (1982); Halpin MicroCYCLONE manuals (1990–1992).</li>
            <li><strong className="text-foreground">Huang & Halpin</strong> DISCO (1993–1995); Huang Ph.D. Purdue (1994).</li>
            <li>PROSIDYC (1999); COST (2000); <strong className="text-foreground">WebCYCLONE</strong> (2003).</li>
          </ol>
          <h3 className="font-display mt-4 text-sm font-semibold text-foreground">Lineage</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed" start={7}>
            <li>AbouRizk, STROBOSCOPE, Simphony / Simphony.NET, UM-CYCLONE.</li>
          </ol>
          <p className="mt-4 rounded-[var(--radius-md)] border border-border bg-muted/20 px-3 py-2.5 text-xs">
            Neo-CYCLONE does <strong className="text-foreground">not</strong> replace those systems. It is{" "}
            <strong className="text-foreground">{PRODUCT_TAGLINE}</strong>. Full text also in{" "}
            <code className="text-foreground">docs/USER_MANUAL.md</code>.
          </p>
        </section>

        <section className="rounded-[var(--radius-md)] border border-border bg-muted/20 px-4 py-3">
          <p className="font-mono text-[11px] leading-relaxed text-foreground">
            1. Select Example OR write Format Prompt{"\n"}
            2. Draw Model → inspect cycles / meetings / counter{"\n"}
            3. Simulate → productivity, waste, cost{"\n"}
            4. Sensitivity → if Sensitivity: block present{"\n"}
            5. AI Assistant → optional Q&A / propose prompt edits{"\n"}
            6. Export → Excel / PNG as needed
          </p>
        </section>

        <p className="text-center text-xs text-muted-foreground">
          {PRODUCT_TAGLINE}<span className="mx-1.5">·</span>{PRODUCT_DEDICATION} · Manual v1.6.2
        </p>
      </main>
    </div>
  );
}
