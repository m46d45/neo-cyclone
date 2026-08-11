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
          <h2 className="font-display text-xl font-semibold text-foreground">Prologue</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            Halpin’s <strong>CYCLONE</strong> made waiting and cyclic work visible. Neo-CYCLONE is a browser{" "}
            <strong>teaching studio</strong> in that tradition: discrete-event engine first, AI as co-pilot. Habit:{" "}
            <strong>draw cycles until they tell the truth, then run the numbers</strong>. Bibliography is at the{" "}
            <strong>end</strong> (References).
          </p>
        </section>

        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part I</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 1 — Operations, flow, and idleness
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            An operation is a repeatable production process (units/hour), not the whole Gantt. Resources that are
            not working usually sit in a <strong>queue</strong>—that <strong>idleness</strong> is measurable waste.
            Networks force clarity about meetings, order, and what one production unit means. The right-hand{" "}
            <strong>CYCLONE Model</strong> is the picture of that logic (Chapter 4).
          </p>
        </section>

        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part II</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 2 — Fifteen minutes (Earthmoving)
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ol className="list-decimal space-y-1.5 pl-5 text-xs">
            <li>Load Example 1; read Operation, cycles, counter, cost, durations.</li>
            <li>
              Draw Model; check QUEUEs, COMBI Load, NORMAL hauls, golf-flag COUNTER, black forward / gold return.
            </li>
            <li>Simulate; Process Report → productivity chart → idleness → cost.</li>
            <li>Export once; optional AI chips; Apply → Draw → Simulate for any prompt edit.</li>
          </ol>
        </section>

        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part III — Prompt & diagram</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 3 — Format Prompt language
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-xs leading-relaxed">
            <code className="text-foreground">#</code> notes ignored. Then{" "}
            <code className="text-foreground">Operation:</code>, resource cycles, counts,{" "}
            <code className="text-foreground">Counter after:</code>, durations (minutes), optional Priority,
            Branch p, GEN/CON, Cost USD/h, Sensitivity last. Multi-demand:{" "}
            <code className="text-foreground">A | B | C</code>.
          </p>
          <pre className="mt-3 max-h-48 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[10px] text-foreground">
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

        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Parts IV–VII</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapters 5–8 — Results, examples, AI, limits
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ul className="list-disc space-y-1.5 pl-5 text-xs">
            <li>
              <strong className="text-foreground">Ch.5 Results:</strong> Process Report, units/hour + steady state
              (5%, ≥10 cycles), idleness, cost, Sensitivity tab, export
            </li>
            <li>
              <strong className="text-foreground">Ch.6 Examples:</strong> 1 spine → 2 branch → 3 GEN/CON → 4
              multi-demand → 5–6 SA
            </li>
            <li>
              <strong className="text-foreground">Ch.7 AI:</strong> co-pilot only; Apply → Draw → Simulate; ≤20
              lines; ~30 req/h/IP
            </li>
            <li>
              <strong className="text-foreground">Ch.8 Limits:</strong> cycles 100/500, seed 12345, SA caps, cite
              version
            </li>
          </ul>
        </section>

        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part VIII</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">Chapter 9 — FAQ</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <dl className="space-y-2.5 text-xs">
            <div>
              <dt className="font-semibold text-foreground">Example but no diagram?</dt>
              <dd>Draw Model.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Diagram ≠ book figure?</dt>
              <dd>Same logic; Neo-CYCLONE teaching notation (Chapter 4).</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Gold dashed arrows?</dt>
              <dd>Return to home QUEUE. Black solid = forward.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">COMBI vs NORMAL?</dt>
              <dd>≥2 resources meet → COMBI; alone → NORMAL.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">AI text changed but numbers did not?</dt>
              <dd>Apply → Draw Model → Simulate.</dd>
            </div>
          </dl>
        </section>

        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">Part IX</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-foreground">
            Chapter 10 — Notes for instructors
          </h2>
          <div className="gold-rule my-3 max-w-xs" />
          <ul className="list-disc space-y-1.5 pl-5 text-xs">
            <li>Baseline: Example 1, seed 12345, cycles 100</li>
            <li>Exercise: label diagram symbols (Ch.4) + idleness + one fleet change</li>
            <li>AI may draft; grades need engine results after Apply</li>
            <li>Rubric: model truth · waste literacy · reproducibility · decision · integrity</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Epilogue</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            See the operation. Honor CYCLONE logic; learn this studio’s legend; run the engine. Seed 12345 as
            shared baseline; change one idea at a time; watch idleness and unit cost.
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
            {PRODUCT_DEDICATION} · Manual v{PRODUCT_VERSION}
          </p>
        </footer>
      </main>
    </div>
  );
}
