import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
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
              v1.3
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
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
          {PRODUCT_TAGLINE}
        </p>

        {/* —— Part I —— */}
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
              Neo-CYCLONE is an <strong className="text-foreground">educational web app</strong> for
              modeling and simulating <strong className="text-foreground">repetitive construction
              operations</strong> in the spirit of Professor{" "}
              <strong className="text-foreground">Daniel W. Halpin’s CYCLONE</strong>{" "}
              (<em>CYCLic Operations NEtwork</em>).
            </p>
            <p>It is meant for first contact with construction operations as flow, measuring
              idleness, connecting process design to Lean Construction / Project Production
              Management, and learning classic MicroCYCLONE ideas without old desktop software.</p>
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
              DISCO, PROSIDYC, COST, WebCYCLONE, Symphony.Net, and related systems.
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
            <div className="overflow-x-auto">
              <table className="w-full min-w-[280px] text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-[10px] uppercase tracking-wide">
                    <th className="py-1.5 pr-3 font-medium text-foreground">Layer</th>
                    <th className="py-1.5 font-medium text-foreground">What it is</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/60">
                    <td className="py-1.5 pr-3 text-foreground">Structured Format Prompt</td>
                    <td className="py-1.5">Primary way to define a model (cycles, durations, cost…)</td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <td className="py-1.5 pr-3 text-foreground">Local builder / engine</td>
                    <td className="py-1.5">Deterministic: prompt → network → discrete-event simulation</td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <td className="py-1.5 pr-3 text-foreground">Optional AI assist</td>
                    <td className="py-1.5">Free text → draft when not already structured</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pr-3 text-foreground">Product tagline</td>
                    <td className="py-1.5">AI-assisted studio for Halpin-style modeling</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-3 py-2.5 text-[14px] text-foreground">
              <strong>In practice:</strong> prompt-first → <strong>Draw Model</strong> → check
              network → <strong>Simulate</strong>. Examples and Format Prompt are ordinary structured
              text, not magic.
            </p>
          </div>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            1.4 Studio layout
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>
              <strong className="text-foreground">Left:</strong> Prompt · Example · Draw Model · Format
              Prompt reference
            </li>
            <li>
              <strong className="text-foreground">Right:</strong> CYCLONE Model (empty until Draw) ·
              network logic · run parameters
            </li>
            <li>
              <strong className="text-foreground">Below:</strong> Results — Simulation · Sensitivity
              Analysis
            </li>
          </ul>
          <p className="mt-2 text-xs">
            On first open the prompt is empty and the diagram is empty until you select an Example
            (fills prompt only) and click <strong className="text-foreground">Draw Model</strong>.
          </p>
        </section>

        {/* —— Part II —— */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Part II — How to use
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 2 — How-to
          </h2>
          <div className="gold-rule my-3 max-w-xs" />

          <h3 className="font-display text-base font-semibold text-foreground">
            2.1 Fast path (first run)
          </h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs">
            <li>Open the app.</li>
            <li>
              Example → e.g. <strong className="text-foreground">1. Earthmoving</strong>.
            </li>
            <li>Read the prompt.</li>
            <li>
              Click <strong className="text-foreground">Draw Model</strong>.
            </li>
            <li>Check home QUEUEs, tasks left→right, counter.</li>
            <li>
              Max cycles (default <strong className="text-foreground">100</strong>, limit 500) · Seed{" "}
              (<strong className="text-foreground">12345</strong>).
            </li>
            <li>
              Click <strong className="text-foreground">Simulate</strong>.
            </li>
            <li>Read Results (productivity, steady state, utilization, cost).</li>
            <li>Optional: Excel report, chart PNG, model PNG.</li>
          </ol>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            2.2 Your own operation
          </h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs">
            <li>Write or paste a structured Format Prompt (Chapter 4).</li>
            <li>
              <strong className="text-foreground">Draw Model</strong> → inspect / fix → Draw again.
            </li>
            <li>
              <strong className="text-foreground">Simulate</strong> when the network is right.
            </li>
            <li>Add Cost / Sensitivity blocks when needed.</li>
          </ol>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            2.3 Iterate before Simulate
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>Each resource returns to a home QUEUE?</li>
            <li>Multi-resource tasks are COMBI?</li>
            <li>
              <code className="text-foreground">Counter after:</code> exact task name?
            </li>
            <li>GEN/CON on the chain that scales units?</li>
            <li>Branch detours rejoin the main path?</li>
          </ul>

          <h3 className="font-display mt-6 text-base font-semibold text-foreground">
            2.4 Sensitivity Analysis
          </h3>
          <p className="mt-2 text-xs">
            When the prompt has a <code className="text-foreground">Sensitivity:</code> block: Simulate
            → Results → <strong className="text-foreground">Sensitivity Analysis</strong>. Pick a pair
            if pairwise. Tabs: <strong className="text-foreground">Productivity & unit cost</strong> and{" "}
            <strong className="text-foreground">Idleness & utilization</strong>.
          </p>
        </section>

        {/* —— Part III —— */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Part III — Teaching examples
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 3 — Six Examples
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[280px] text-left text-xs">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-wide">
                  <th className="py-1.5 pr-2 font-medium text-foreground">#</th>
                  <th className="py-1.5 pr-2 font-medium text-foreground">Name</th>
                  <th className="py-1.5 font-medium text-foreground">You learn</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-2 text-foreground">1</td>
                  <td className="py-1.5 pr-2 text-foreground">Earthmoving</td>
                  <td className="py-1.5">Classic fleet; cost; steady state</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-2 text-foreground">2</td>
                  <td className="py-1.5 pr-2 text-foreground">Asphalt Paving</td>
                  <td className="py-1.5">Branch probability (breakdown)</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-2 text-foreground">3</td>
                  <td className="py-1.5 pr-2 text-foreground">Loading Dump Truck</td>
                  <td className="py-1.5">Inline GEN / CON</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-2 text-foreground">4</td>
                  <td className="py-1.5 pr-2 text-foreground">Tower Crane</td>
                  <td className="py-1.5">Multi-demand | , Priority, multi-counter</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-2 text-foreground">5</td>
                  <td className="py-1.5 pr-2 text-foreground">Masonry</td>
                  <td className="py-1.5">Face stocks; GEN/CON; sensitivity intro</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-2 text-foreground">6</td>
                  <td className="py-1.5 pr-2 text-foreground">Precast Plant</td>
                  <td className="py-1.5">Halpin Ch.14-style plant + complex SA</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs">
            Always <strong className="text-foreground">Draw Model</strong> after selecting an example.
            Lines starting with <code className="text-foreground">#</code> are notes only.
          </p>
        </section>

        {/* —— Part IV —— */}
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
            Comments <code className="text-foreground">#</code> / <code className="text-foreground">//</code>{" "}
            ignored. Time unit: minutes. Cost: USD/h.
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

        <Section title="Chapter 5 — Modeling rules">
          <ol className="list-decimal space-y-1.5 pl-5 text-xs">
            <li>Every resource has a home QUEUE (idle pool).</li>
            <li>≥2 resources on a task → COMBI; one resource → NORMAL.</li>
            <li>Return (dashed gold) only into a home QUEUE.</li>
            <li>Forward (solid black) = work advances.</li>
            <li>GEN/CON on the chain that scales units.</li>
            <li>Layout: tasks on a grid (ordered), then queues, counter at end of flow.</li>
          </ol>
        </Section>

        <Section title="Notation (summary)">
          <div className="mb-3 overflow-x-auto">
            <table className="w-full min-w-[280px] text-left text-xs">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-wide">
                  <th className="py-1.5 pr-3 font-medium text-foreground">Element</th>
                  <th className="py-1.5 font-medium text-foreground">Drawing</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-3 text-foreground">QUEUE</td>
                  <td className="py-1.5">Q-circle (slash)</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-3 text-foreground">GEN</td>
                  <td className="py-1.5">Inverted triangle ▽ · GEN k</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-3 text-foreground">CON</td>
                  <td className="py-1.5">Upright triangle △ · CON n</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-3 text-foreground">COMBI</td>
                  <td className="py-1.5">Cut-corner square</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-3 text-foreground">NORMAL</td>
                  <td className="py-1.5">Rectangle</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-3 text-foreground">COUNTER</td>
                  <td className="py-1.5">Golf flag</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs">
            Forward = solid black + tip · Return home = dashed gold + tip · Branch = p=… label.
            Full detail in repo: <code className="text-foreground">docs/NOTATION_STANDARD.md</code>.
          </p>
        </Section>

        <Section title="Chapter 6 — Results & export">
          <ul className="list-disc space-y-1.5 pl-5 text-xs">
            <li>
              <strong className="text-foreground">Production by cycle</strong> — units/h; dark gold
              steady-state (5%, ≥10 cycles); red dots = branch detours
            </li>
            <li>Utilization / idleness charts</li>
            <li>Cost report when Cost block present</li>
            <li>
              Sensitivity: productivity & unit cost · idleness snapshot
            </li>
            <li>Excel multi-sheet · chart PNG · model PNG</li>
          </ul>
        </Section>

        <Section title="Chapter 7 — Limits & deploy">
          <ul className="list-disc space-y-1 pl-5 text-xs">
            <li>
              Max cycles: default <strong className="text-foreground">100</strong>, product max{" "}
              <strong className="text-foreground">500</strong>
            </li>
            <li>
              Seed default <strong className="text-foreground">12345</strong>
            </li>
            <li>
              Production: GitHub <code className="text-foreground">main</code> →{" "}
              <a className="text-primary hover:underline" href="https://neo-cyclone.vercel.app/">
                neo-cyclone.vercel.app
              </a>
            </li>
          </ul>
        </Section>

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
          {PRODUCT_TAGLINE} · Manual v1.3
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
