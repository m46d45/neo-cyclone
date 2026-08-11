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

      <main className="mx-auto max-w-3xl space-y-12 px-4 py-8 text-sm leading-relaxed text-muted-foreground">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Neo-CYCLONE Manual
          </h1>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-primary">{PRODUCT_TAGLINE}</p>
          <p className="mt-4 text-[13px] leading-relaxed text-foreground/90">
            Full teaching manual. Keep the studio open while you practice. Source also in 
            <code className="text-foreground">docs/USER_MANUAL.md</code>. <strong className="text-foreground">References</strong> are at the end.
          </p>
        </div>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Start here — 3 minutes</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">If you only do one thing today:</p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed"><li>Open <a className="text-primary hover:underline" href="https://neo-cyclone.vercel.app/" target="_blank" rel="noreferrer">neo-cyclone.vercel.app</a>.  </li><li><strong className="text-foreground">Example</strong> → <strong className="text-foreground">1. Earthmoving</strong>.  </li><li>Click <strong className="text-foreground">Draw Model</strong> (the diagram does <strong className="text-foreground">not</strong> appear until you click).  </li><li>Leave <strong className="text-foreground">max cycles = 100</strong>, <strong className="text-foreground">seed = 12345</strong>.  </li><li>Click <strong className="text-foreground">Simulate</strong>.  </li><li>Look at <strong className="text-foreground">units/hour by cycle</strong> and <strong className="text-foreground">resource idleness</strong> (who waits? who works?).  </li></ol>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">That is the whole loop: <strong className="text-foreground">prompt → draw → simulate → read waste and productivity</strong>. Everything else deepens that loop.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">If something feels “broken”</h3>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px] text-foreground/90">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-2 py-1.5 font-medium">Symptom</th><th className="px-2 py-1.5 font-medium">Likely cause</th><th className="px-2 py-1.5 font-medium">Fix</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Empty diagram after choosing Example</td><td className="px-2 py-1.5">Examples only fill the prompt</td><td className="px-2 py-1.5">Click <strong className="text-foreground">Draw Model</strong></td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Simulate disabled / no results</td><td className="px-2 py-1.5">No network drawn yet</td><td className="px-2 py-1.5">Draw Model first</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Excel name looks like resource spaghetti</td><td className="px-2 py-1.5">No <code className="text-foreground">Operation:</code> line</td><td className="px-2 py-1.5">Add <code className="text-foreground">Operation: MyName</code> after <code className="text-foreground">#</code> notes</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">No Sensitivity tab charts</td><td className="px-2 py-1.5">Prompt has no <code className="text-foreground">Sensitivity:</code> block</td><td className="px-2 py-1.5">Add ranges (Examples 5–6) or skip SA</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">AI answers only in English / short</td><td className="px-2 py-1.5">Product policy</td><td className="px-2 py-1.5">English-first; replies ≤20 lines; edit only after <strong className="text-foreground">Apply</strong></td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Different numbers than a classmate</td><td className="px-2 py-1.5">Different seed or cycles</td><td className="px-2 py-1.5">Use seed <strong className="text-foreground">12345</strong> and same max cycles</td></tr>
                <tr><td className="px-2 py-1.5">Page looks unstyled</td><td className="px-2 py-1.5">Browser cache after deploy</td><td className="px-2 py-1.5">Hard refresh or incognito</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">Map of this manual</h3>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px] text-foreground/90">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-2 py-1.5 font-medium">Section</th><th className="px-2 py-1.5 font-medium">Chapters</th><th className="px-2 py-1.5 font-medium">When to read</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Ideas</td><td className="px-2 py-1.5">Ch. 1</td><td className="px-2 py-1.5">Before inventing your own model</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">First run</td><td className="px-2 py-1.5">2</td><td className="px-2 py-1.5">Always, once</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Prompt language</td><td className="px-2 py-1.5">3</td><td className="px-2 py-1.5">When writing your own operation</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Diagram & modeling</strong></td><td className="px-2 py-1.5"><strong className="text-foreground">4</strong></td><td className="px-2 py-1.5"><strong className="text-foreground">When you look at the CYCLONE Model panel</strong></td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Results literacy</td><td className="px-2 py-1.5">5</td><td className="px-2 py-1.5">After first Simulate — <strong className="text-foreground">Simulation results</strong></td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Curriculum</td><td className="px-2 py-1.5">6</td><td className="px-2 py-1.5">Course design / self-study path</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">AI Assistant</td><td className="px-2 py-1.5">7</td><td className="px-2 py-1.5">When you use the co-pilot</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Limits & deploy</td><td className="px-2 py-1.5">8</td><td className="px-2 py-1.5">Homework rules, citations</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">FAQ</td><td className="px-2 py-1.5">9</td><td className="px-2 py-1.5">Stuck mid-studio</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Classroom</td><td className="px-2 py-1.5">10</td><td className="px-2 py-1.5">Teaching with many students</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Closing</td><td className="px-2 py-1.5">Epilogue</td><td className="px-2 py-1.5">Habit to keep</td></tr>
                <tr><td className="px-2 py-1.5"><strong className="text-foreground">Bibliography</strong></td><td className="px-2 py-1.5"><strong className="text-foreground">References</strong></td><td className="px-2 py-1.5"><strong className="text-foreground">Always last</strong> — papers & lineage</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Prologue — Why this studio exists</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Construction work is full of <strong className="text-foreground">repetition</strong>: load and haul, pour and return, lift and place. Between those busy moments, resources wait. A truck queues at a loader. A crane sits while a crew finishes tying rebar. That waiting is not always “laziness”; it is often <strong className="text-foreground">the structure of the process</strong>.</p>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Professor <strong className="text-foreground">Daniel W. Halpin</strong> spent a career making that structure <em>visible</em>. His <strong className="text-foreground">CYCLONE</strong> language (<em>CYCLic Operations NEtwork</em>) gave operations a simple network grammar: resources cycle through queues and work, meet when they must, and count completed production. From that grammar grew tools—<strong className="text-foreground">MicroCYCLONE</strong>, then DISCO, PROSIDYC, COST, WebCYCLONE, and a wider family of construction simulation systems (see <strong className="text-foreground">References</strong> at the end).</p>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90"><strong className="text-foreground">Neo-CYCLONE</strong> is not a replacement for those research systems. It is a <strong className="text-foreground">teaching studio</strong>: a place to meet Halpin’s ideas again, with a modern browser interface and an <strong className="text-foreground">AI Assistant</strong> that stays tied to <em>your</em> model. The product name is deliberate: <strong className="text-foreground">AI-Assisted Construction Operation Simulation</strong>.</p>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">AI here does not invent a new physics of construction. The <strong className="text-foreground">engine</strong> is still a discrete-event CYCLONE-style simulator. AI helps you <strong className="text-foreground">phrase</strong>, <strong className="text-foreground">inspect</strong>, and <strong className="text-foreground">question</strong> the model. You remain responsible for Draw Model, Simulate, and judgment.</p>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">If you leave this manual with one habit, let it be this: <strong className="text-foreground">draw the cycles until they tell the truth, then run the numbers</strong>.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 1 — Operations, flow, and idleness</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.1 What we mean by “construction operation”</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">An <em>operation</em> here is a <strong className="text-foreground">repeatable production process</strong>—often measured in units per hour—not the whole project Gantt chart. Earthmoving a cut, paving a lane, loading dump trucks, serving three zones with one crane, stocking brick and mortar for masons, or cycling forms in a precast yard: each is an operation with <strong className="text-foreground">resources</strong>, <strong className="text-foreground">tasks</strong>, and <strong className="text-foreground">waiting</strong>.</p>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Thinking at the operation level matters for <strong className="text-foreground">Lean Construction</strong> and <strong className="text-foreground">Project Production Management</strong>. Before you optimize a schedule bar, you need to see whether the <em>process</em> itself produces flow or waste.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.2 Flow and idleness (waste you can measure)</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">In CYCLONE thinking, a resource that is not working is usually <strong className="text-foreground">in a queue</strong>—waiting for a partner, a space, or a task to open. That waiting time is <strong className="text-foreground">idleness</strong>. It is not a moral failure; it is a signal:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed"><li>Too few trucks → loader idle  </li><li>Too many trucks → truck queue grows  </li><li>Shared crane, wrong priority → one zone starves  </li></ul>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Neo-CYCLONE reports <strong className="text-foreground">idle %</strong> and <strong className="text-foreground">busy %</strong> so those signals are hard to ignore. When you later hear “waste” in Lean language, you already have a picture for it.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.3 Why a network language?</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">You could describe an operation in paragraphs of natural language. Networks force clarity:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed"><li>Which resources exist?  </li><li>In what order do they work?  </li><li>Where do they wait?  </li><li>Where do two resources <strong className="text-foreground">meet</strong> (e.g. truck + loader)?  </li><li>What counts as <strong className="text-foreground">one unit of production</strong>?  </li></ul>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">CYCLONE answered those questions with a small set of node types. Neo-CYCLONE keeps that spirit in the <strong className="text-foreground">logic</strong>, even when some <strong className="text-foreground">glyphs</strong> and <strong className="text-foreground">arrow colors</strong> are tuned for screen teaching (Chapter 4).</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.4 What Neo-CYCLONE is — and is not</h3>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px] text-foreground/90">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-2 py-1.5 font-medium">It is</th><th className="px-2 py-1.5 font-medium">It is not</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">A browser teaching studio for cyclic construction operations</td><td className="px-2 py-1.5">A full project controls ERP</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Prompt → diagram → discrete-event simulation</td><td className="px-2 py-1.5">A black-box “AI that simulates for you” without a model</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">MicroCYCLONE-style reports (process, elements, cost, sensitivity)</td><td className="px-2 py-1.5">A pixel-perfect reprint of 1970s/1990s paper figures</td></tr>
                <tr><td className="px-2 py-1.5">English-first, classroom-friendly limits</td><td className="px-2 py-1.5">An unlimited free chat API</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">You do <strong className="text-foreground">not</strong> need to sign in to learn. Teaching use stands alone.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">1.5 The studio at a glance</h3>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px] text-foreground/90">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-2 py-1.5 font-medium">Area</th><th className="px-2 py-1.5 font-medium">What you do there</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Left</strong></td><td className="px-2 py-1.5">Choose Example or write Format Prompt → <strong className="text-foreground">Draw Model</strong></td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Right</strong></td><td className="px-2 py-1.5">Inspect <strong className="text-foreground">CYCLONE Model</strong> diagram; set cycles & seed → <strong className="text-foreground">Simulate</strong></td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Below</strong></td><td className="px-2 py-1.5"><strong className="text-foreground">Results</strong>: Simulation · Sensitivity Analysis</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Lower</strong></td><td className="px-2 py-1.5"><strong className="text-foreground">AI Assistant</strong> (optional co-pilot)</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Header</strong></td><td className="px-2 py-1.5">Manual (this text)</td></tr>
                <tr><td className="px-2 py-1.5"><strong className="text-foreground">Footer</strong></td><td className="px-2 py-1.5">Product name · version · year — cite the version in homework</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">The right-hand diagram is not decoration. Chapter 4 teaches you how to <strong className="text-foreground">read</strong> it.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 2 — Fifteen minutes that stick (Earthmoving)</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">This chapter is a <strong className="text-foreground">guided first run</strong>. Do it once with Example 1 even if you already “know trucks.”</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">2.1 Open the studio</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Go to the live app. You should see:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed"><li><strong className="text-foreground">Left:</strong> prompt area, Example dropdown, <strong className="text-foreground">Draw Model</strong>  </li><li><strong className="text-foreground">Right:</strong> empty CYCLONE Model until you draw  </li><li><strong className="text-foreground">Below (later):</strong> Results and AI Assistant  </li></ul>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">2.2 Load Example 1 — Earthmoving</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed"><li>Open <strong className="text-foreground">Example</strong> → choose <strong className="text-foreground">1. Earthmoving</strong>.  </li><li>Read the prompt top to bottom. Notice the shape:</li></ol>
          <pre className="mt-2 max-h-72 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[10px] leading-snug text-foreground">
# notes (ignored by the engine) …

Operation: Earthmoving

Trucks: Load → Haul → Dump → Return
Loader: Load
5 trucks, 1 loader

Counter after: Dump
production = 12 m3

Cost: …
Durations: …
          </pre>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90"><strong className="text-foreground">Plain language:</strong> trucks cycle load → haul → dump → return. The loader only participates at <strong className="text-foreground">Load</strong>—so Load is a <strong className="text-foreground">meeting</strong> (COMBI). Production is counted after <strong className="text-foreground">Dump</strong> (e.g. 12 m³). Costs are USD per resource-hour. Durations are in <strong className="text-foreground">minutes</strong>.</p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed"><li>Click <strong className="text-foreground">Draw Model</strong> (selecting an example does <strong className="text-foreground">not</strong> draw by itself).  </li><li>On the right, confirm (see Chapter 4 for shapes):</li></ol>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed"><li>Home <strong className="text-foreground">QUEUE</strong> circles for trucks and loader (often with <code className="text-foreground">n = …</code>)  </li><li><strong className="text-foreground">Load</strong> as COMBI (square with top-left cut)  </li><li>Haul, Dump, Return as NORMAL rectangles (truck alone)  </li><li><strong className="text-foreground">COUNTER</strong> as a golf-flag after Dump  </li><li><strong className="text-foreground">Solid black</strong> arrows forward; <strong className="text-foreground">dashed gold</strong> arrows returning resources home  </li></ul>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">If something looks wrong, fix the prompt and <strong className="text-foreground">Draw Model</strong> again. Do not Simulate until the picture matches the story.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">2.3 Run parameters</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed"><li><strong className="text-foreground">Max cycles</strong> — default <strong className="text-foreground">100</strong>, hard maximum <strong className="text-foreground">500</strong>.  </li><li><strong className="text-foreground">Seed</strong> — default <strong className="text-foreground">12345</strong>. Same seed + same model + same cycle limit → <strong className="text-foreground">identical</strong> stochastic results. <strong className="text-foreground">Dice</strong> picks another seed on purpose.</li></ul>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Seed is for <strong className="text-foreground">reproducibility</strong>, not a fleet decision variable.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">2.4 Simulate and read the first results</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Click <strong className="text-foreground">Simulate</strong>. Open the <strong className="text-foreground">Simulation</strong> tab.</p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed"><li><strong className="text-foreground">Process Report</strong> — run length, cycles, production pace.  </li><li><strong className="text-foreground">Units per hour by cycle</strong> — does productivity settle? Steady-state guide (~5% over ≥10 cycles) as old-gold dashed line.  </li><li><strong className="text-foreground">Resource idleness</strong> — who waits? who works? Often the best classroom discussion.  </li><li><strong className="text-foreground">Cost Report</strong> (if rates exist) — unit cost bridges “how busy?” to “how expensive per unit?”</li></ol>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">2.5 Export once</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed"><li><strong className="text-foreground">Report Excel</strong> — name prefers <code className="text-foreground">Operation: …</code>  </li><li><strong className="text-foreground">Chart PNG</strong> / diagram PNG  </li></ul>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Record <strong className="text-foreground">seed</strong>, <strong className="text-foreground">max cycles</strong>, and <strong className="text-foreground">Operation</strong> name in assignments.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">2.6 Optional: AI Assistant</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Try chips: resources · bottleneck · productivity · unit cost. Replies ≤20 lines. Proposed prompts need <strong className="text-foreground">Apply → Draw Model → Simulate</strong>.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">2.7 Common first-session mistakes</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed"><li>Expecting the diagram after only selecting an Example.  </li><li>Simulating before the diagram matches the story.  </li><li>Changing fleet size in chat without <strong className="text-foreground">Apply → Draw → Simulate</strong>.  </li><li>Comparing results with another seed.  </li><li>Reading only total production and ignoring <strong className="text-foreground">idleness</strong>.  </li><li>Assuming every rectangle is “the same as Halpin’s book figure” without checking Neo-CYCLONE’s legend (Chapter 4).</li></ol>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 3 — How to talk so the studio can build a network</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">You do not draw QUEUE circles by hand in the prompt. You describe <strong className="text-foreground">resource cycles</strong>. The builder creates queues, tasks, and arcs.</p>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Lines with <code className="text-foreground">#</code> or <code className="text-foreground">//</code> are notes only. After notes, first data line may be <code className="text-foreground">Operation: Name</code> (aliases Model / Title / Op) for title and Excel filename.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">3.1 Network — resource cycles</h3>
          <pre className="mt-2 max-h-72 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[10px] leading-snug text-foreground">
Trucks: Load → Haul → Dump → Return
Loader: Load
5 trucks, 1 loader
          </pre>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed"><li>One primary sequence per resource.  </li><li>Supporting resources often share a meeting task.  </li><li>Arrows: <code className="text-foreground">→</code> · <code className="text-foreground">-></code> · <code className="text-foreground">--></code> · <code className="text-foreground">=></code>.  </li><li><strong className="text-foreground">Multi-demand:</strong> <code className="text-foreground">Crane: LiftAtA | LiftAtB | LiftAtC</code>  </li><li><strong className="text-foreground">Priority</strong> (lower number = higher priority): MicroCYCLONE tradition.</li></ul>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">3.2 Production counter</h3>
          <pre className="mt-2 max-h-72 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[10px] leading-snug text-foreground">
Counter after: Dump
production = 12 m3
          </pre>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Name the task(s) that mean “one production unit finished.” Multiple counters are allowed. Explicit is safer than relying on defaults.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">3.3 Durations (minutes)</h3>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px] text-foreground/90">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-2 py-1.5 font-medium">Kind</th><th className="px-2 py-1.5 font-medium">Parameters</th><th className="px-2 py-1.5 font-medium">Typical use</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><code className="text-foreground">const</code></td><td className="px-2 py-1.5">value</td><td className="px-2 py-1.5">Deterministic demo</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><code className="text-foreground">unif</code></td><td className="px-2 py-1.5">min, max</td><td className="px-2 py-1.5">Flat uncertainty</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><code className="text-foreground">tri</code></td><td className="px-2 py-1.5">min, mode, max</td><td className="px-2 py-1.5">Common field estimate</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><code className="text-foreground">normal</code></td><td className="px-2 py-1.5">mean, sd</td><td className="px-2 py-1.5">Symmetric scatter</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><code className="text-foreground">lognormal</code></td><td className="px-2 py-1.5">mean, sd</td><td className="px-2 py-1.5">Skewed positive times</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><code className="text-foreground">beta</code></td><td className="px-2 py-1.5">min, max, α, β</td><td className="px-2 py-1.5">Four-parameter beta</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><code className="text-foreground">pert</code></td><td className="px-2 py-1.5">a, m, b</td><td className="px-2 py-1.5">Classic PERT-beta on [a,b]</td></tr>
                <tr><td className="px-2 py-1.5"><code className="text-foreground">gamma</code></td><td className="px-2 py-1.5">shape, scale</td><td className="px-2 py-1.5">Flexible positive skew</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">3.4 Branch probability</h3>
          <pre className="mt-2 max-h-72 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[10px] leading-snug text-foreground">
Branch:
After DumpToPaver: RefillAsphalt p=0.85, Breakdown p=0.15
          </pre>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">3.5 GEN and CON</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Prefer <strong className="text-foreground">inline</strong> form:</p>
          <pre className="mt-2 max-h-72 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[10px] leading-snug text-foreground">
Trucks: GEN 5 → Scoop → CON 5 TruckFull → Haul&Return
          </pre>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Only when unit logic needs scaling—not every model.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">3.6 Cost and sensitivity</h3>
          <pre className="mt-2 max-h-72 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[10px] leading-snug text-foreground">
Cost:
Trucks: 85
Loader: 120

Sensitivity:
Trucks: 2..10
Loader: 1..2
          </pre>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">USD per resource-hour. SA caps: ≤5 resources; ~150 combinations (ranges step up).</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">3.7 Recommended block order</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90"><strong className="text-foreground">Operation → Network → Durations → Priority → Branch → Cost → Sensitivity (last).</strong></p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">3.8 Minimal custom prompt</h3>
          <pre className="mt-2 max-h-72 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[10px] leading-snug text-foreground">
Operation: My Operation Name

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
          </pre>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">If the diagram lies, the prompt is incomplete—not “the AI failed.”</p>
                  <p className="mt-5 text-xs font-medium text-foreground">Live Format Prompt template (from the studio)</p>
          <pre className="mt-2 max-h-64 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-3 font-mono text-[10px] leading-snug text-foreground">
            {GENERAL_TEMPLATE}
          </pre>
</section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 4 — Reading the model: how Neo-CYCLONE draws CYCLONE</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Users spend a lot of time staring at the <strong className="text-foreground">CYCLONE Model</strong> panel. This chapter is the legend for that panel: <strong className="text-foreground">how we model</strong>, <strong className="text-foreground">what each symbol means</strong>, and <strong className="text-foreground">where we deliberately differ from textbook Halpin figures</strong> while keeping the same <em>ideas</em>.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">4.1 Modeling idea (same as Halpin)</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Neo-CYCLONE still models a <strong className="text-foreground">cyclic construction operation</strong> as:</p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed"><li><strong className="text-foreground">Resources</strong> that wait in <strong className="text-foreground">queues</strong> when idle.  </li><li><strong className="text-foreground">Work</strong> that consumes resource units for a duration.  </li><li><strong className="text-foreground">Meetings</strong> when two or more resources must be present to start work.  </li><li><strong className="text-foreground">Returns</strong> of each resource to its home idle pool so the cycle can repeat.  </li><li>A <strong className="text-foreground">counter</strong> (or counters) that record completed production units.  </li><li>Optional <strong className="text-foreground">functions</strong> that scale entities (GEN / CON) and optional <strong className="text-foreground">probabilistic branches</strong>.  </li></ol>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">You never draw that by hand in the prompt. You state <strong className="text-foreground">resource cycles</strong> in text; the studio <strong className="text-foreground">builds</strong> the network. That is the modeling workflow:</p>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90"><strong className="text-foreground">story in Format Prompt → Draw Model → inspect diagram → fix story → Simulate.</strong></p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">4.2 Node shapes (what you see on screen)</h3>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px] text-foreground/90">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-2 py-1.5 font-medium">Element</th><th className="px-2 py-1.5 font-medium">Shape in Neo-CYCLONE</th><th className="px-2 py-1.5 font-medium">Meaning</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">QUEUE</strong></td><td className="px-2 py-1.5">Circle with a lower-right slash (reads like a <strong className="text-foreground">Q</strong>)</td><td className="px-2 py-1.5">Waiting / idle pool. <strong className="text-foreground">Home</strong> queues hold initial units (<code className="text-foreground">n = …</code>)</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">COMBI</strong></td><td className="px-2 py-1.5">Square with <strong className="text-foreground">top-left corner cut</strong></td><td className="px-2 py-1.5">Work that needs <strong className="text-foreground">≥2 resources</strong> meeting</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">NORMAL</strong></td><td className="px-2 py-1.5">Plain rectangle</td><td className="px-2 py-1.5">Work that needs <strong className="text-foreground">one</strong> resource unit stream</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">COUNTER</strong></td><td className="px-2 py-1.5"><strong className="text-foreground">Golf flag</strong> (pole + triangle flag)</td><td className="px-2 py-1.5">Production count (+units when the flag is passed)</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">GEN</strong></td><td className="px-2 py-1.5"><strong className="text-foreground">Inverted triangle</strong> (point down)</td><td className="px-2 py-1.5">On arrival, create <strong className="text-foreground">k</strong> units (scale up)</td></tr>
                <tr><td className="px-2 py-1.5"><strong className="text-foreground">CON</strong></td><td className="px-2 py-1.5"><strong className="text-foreground">Upright triangle</strong> (point up)</td><td className="px-2 py-1.5">Gather <strong className="text-foreground">n</strong> units, release 1 (scale down)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Labels under shapes typically show initial <code className="text-foreground">n</code>, duration text, <code className="text-foreground">GEN k</code>, <code className="text-foreground">CON n</code>, or <code className="text-foreground">+production</code>.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">4.3 Arrows (direction always matters)</h3>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px] text-foreground/90">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-2 py-1.5 font-medium">Style</th><th className="px-2 py-1.5 font-medium">Appearance</th><th className="px-2 py-1.5 font-medium">Meaning</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Forward</strong></td><td className="px-2 py-1.5"><strong className="text-foreground">Solid black</strong> line + black arrowhead</td><td className="px-2 py-1.5">Work progresses (including into staging queues before a COMBI)</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Return</strong></td><td className="px-2 py-1.5"><strong className="text-foreground">Dashed gold</strong> line + gold arrowhead (often curved)</td><td className="px-2 py-1.5">Resource closes its cycle into a <strong className="text-foreground">home</strong> QUEUE only</td></tr>
                <tr><td className="px-2 py-1.5"><strong className="text-foreground">Branch</strong></td><td className="px-2 py-1.5">Forward style, often with <strong className="text-foreground"><code className="text-foreground">p=…</code></strong></td><td className="px-2 py-1.5">Probabilistic choice among outs</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90"><strong className="text-foreground">Rule of thumb when reading a diagram:</strong></p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed"><li>Follow <strong className="text-foreground">black</strong> to see how production moves.  </li><li>Follow <strong className="text-foreground">gold dashed</strong> to see how each resource <strong className="text-foreground">goes home</strong> to wait again.  </li><li>If gold dashed points at something that is not an idle home pool, the model is suspicious—re-draw after fixing the prompt.</li></ul>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">4.4 COMBI vs NORMAL (the question everyone asks)</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Ask: <em>Do two or more distinct resources have to be present for this task to start?</em></p>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px] text-foreground/90">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-2 py-1.5 font-medium">Situation</th><th className="px-2 py-1.5 font-medium">Node</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Truck <strong className="text-foreground">and</strong> loader both needed at Load</td><td className="px-2 py-1.5"><strong className="text-foreground">COMBI</strong></td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Truck alone hauls or returns</td><td className="px-2 py-1.5"><strong className="text-foreground">NORMAL</strong></td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Crane lift that also needs a crew at the hook</td><td className="px-2 py-1.5"><strong className="text-foreground">COMBI</strong></td></tr>
                <tr><td className="px-2 py-1.5">Crew works alone after material is placed</td><td className="px-2 py-1.5"><strong className="text-foreground">NORMAL</strong></td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">4.5 How a resource cycle looks (mental picture)</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">For a truck in earthmoving, the diagram encodes roughly:</p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed"><li>Sit in <strong className="text-foreground">Trucks Idle</strong> (QUEUE, <code className="text-foreground">n = 5</code>).  </li><li>Enter <strong className="text-foreground">Load</strong> (COMBI) with a loader unit.  </li><li><strong className="text-foreground">Haul → Dump → Return</strong> (NORMAL steps).  </li><li>Pass <strong className="text-foreground">COUNTER</strong> after Dump when production is counted.  </li><li><strong className="text-foreground">Gold dashed</strong> arc back to <strong className="text-foreground">Trucks Idle</strong>.  </li></ol>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">The loader has a shorter cycle: idle → Load (COMBI) → gold return home.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">4.6 Same spirit as CYCLONE — different surface (important)</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Neo-CYCLONE is <strong className="text-foreground">loyal to Halpin’s logic</strong>, not always to the <strong className="text-foreground">exact ink</strong> of every textbook figure. Users who open Halpin & Riggs (or MicroCYCLONE printouts) side by side with the studio will notice differences. That is intentional for <strong className="text-foreground">screen teaching</strong>.</p>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px] text-foreground/90">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-2 py-1.5 font-medium">Topic</th><th className="px-2 py-1.5 font-medium">Classic CYCLONE / MicroCYCLONE (typical print)</th><th className="px-2 py-1.5 font-medium">Neo-CYCLONE (this studio)</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Purpose</strong></td><td className="px-2 py-1.5">Methodology + desktop / research tools</td><td className="px-2 py-1.5">Browser <strong className="text-foreground">teaching</strong> studio + AI co-pilot</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">How you build</strong></td><td className="px-2 py-1.5">Often node/link editors, cards, or input files</td><td className="px-2 py-1.5"><strong className="text-foreground">Format Prompt</strong> (resource cycles) → auto layout</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">QUEUE look</strong></td><td className="px-2 py-1.5">Circle (sometimes plain)</td><td className="px-2 py-1.5">Circle with <strong className="text-foreground">Q-like slash</strong></td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">COMBI look</strong></td><td className="px-2 py-1.5">Square / constrained node conventions vary by book era</td><td className="px-2 py-1.5">Square with <strong className="text-foreground">top-left cut</strong> (clear “meeting” glyph)</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">NORMAL look</strong></td><td className="px-2 py-1.5">Rectangle</td><td className="px-2 py-1.5">Rectangle</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">COUNTER look</strong></td><td className="px-2 py-1.5">Often a flag-like or marked node in teaching materials</td><td className="px-2 py-1.5">Explicit <strong className="text-foreground">golf-flag</strong> icon</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">GEN / CON</strong></td><td className="px-2 py-1.5">Function nodes (historically paired with queues / consolidate logic)</td><td className="px-2 py-1.5"><strong className="text-foreground">▽ GEN</strong> / <strong className="text-foreground">△ CON</strong> triangles; prefer <strong className="text-foreground">inline</strong> in the prompt</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Arrows</strong></td><td className="px-2 py-1.5">Usually black linework; returns not always color-coded</td><td className="px-2 py-1.5"><strong className="text-foreground">Black solid = forward</strong>, <strong className="text-foreground">gold dashed = return home</strong></td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Layout</strong></td><td className="px-2 py-1.5">Author-drawn, publication layouts</td><td className="px-2 py-1.5">Automatic grid: tasks ordered, queues beside cycles, counter near end</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Probability</strong></td><td className="px-2 py-1.5">Branch logic in full systems</td><td className="px-2 py-1.5"><code className="text-foreground">Branch:</code> + <code className="text-foreground">p=</code> on arcs</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Priority</strong></td><td className="px-2 py-1.5">Often implied by numbering / system rules</td><td className="px-2 py-1.5">Explicit <code className="text-foreground">Priority:</code> block (lower = first)</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Time unit default</strong></td><td className="px-2 py-1.5">Varies by study</td><td className="px-2 py-1.5"><strong className="text-foreground">Minutes</strong> in Format Prompt</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Cost</strong></td><td className="px-2 py-1.5">MicroCYCLONE-style process costing in the lineage</td><td className="px-2 py-1.5">Optional USD/h → unit cost report</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">Sensitivity</strong></td><td className="px-2 py-1.5">Manual multi-runs or dedicated modules</td><td className="px-2 py-1.5"><code className="text-foreground">Sensitivity:</code> block + charts (teaching caps)</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">AI</strong></td><td className="px-2 py-1.5">None historically</td><td className="px-2 py-1.5">Context-bound Assistant (Apply required)</td></tr>
                <tr><td className="px-2 py-1.5"><strong className="text-foreground">Where “truth” lives if figures disagree</strong></td><td className="px-2 py-1.5">Printed book / original software</td><td className="px-2 py-1.5"><strong className="text-foreground">This app’s legend + engine</strong> (and <code className="text-foreground">NOTATION_STANDARD.md</code>)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90"><strong className="text-foreground">What must stay the same for the model to still “be CYCLONE”:</strong></p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed"><li>Resources wait in queues.  </li><li>Work takes time and holds units.  </li><li>Meetings need all required resources.  </li><li>Cycles close so production can repeat.  </li><li>Counters define the production unit.  </li></ul>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90"><strong className="text-foreground">What may look different on purpose:</strong></p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed"><li>Colors and dashes on return arcs.  </li><li>Exact corner cuts, flag art, triangle GEN/CON.  </li><li>Automatic layout (not a scanned textbook page).  </li><li>Prompt-first authoring instead of only dragging nodes.</li></ul>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">If you write a paper, say you used <strong className="text-foreground">Neo-CYCLONE’s teaching notation</strong> inspired by Halpin CYCLONE—not that the screenshot is a facsimile of Figure X in the 1992 book.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">4.7 Modeling checklist before Simulate</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed"><li>Every resource has a visible <strong className="text-foreground">home QUEUE</strong>.  </li><li>True meetings are <strong className="text-foreground">COMBI</strong>; solo work is <strong className="text-foreground">NORMAL</strong>.  </li><li><strong className="text-foreground">Counter after:</strong> names match real tasks.  </li><li>Gold dashed returns only into home idles.  </li><li>GEN/CON only if unit logic needs them.  </li><li>Branch probabilities look like a real split of the world.  </li><li><code className="text-foreground">Operation:</code> set if you care about Excel/report names.</li></ol>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Full geometric rules: <a className="text-primary hover:underline" href="./NOTATION_STANDARD.md" target="_blank" rel="noreferrer"><code className="text-foreground">docs/NOTATION_STANDARD.md</code></a>.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 5 — Simulation results</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">After <strong className="text-foreground">Simulate</strong>, the <strong className="text-foreground">Results</strong> area is the place for process literacy—not only a green checkmark.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">5.1 Process Report</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">MicroCYCLONE-style summary: how long the run lasted, how many production events occurred, units per event, total production, when the first unit appeared, and average time between units. Use it to answer: <em>Did we produce what we thought, at what overall pace?</em></p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">5.2 Productivity by cycle and steady state</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">The units/hour chart starts at cycle <strong className="text-foreground">0</strong>. Early cycles are often noisy (the system is filling). <strong className="text-foreground">Steady state</strong> in Neo-CYCLONE is a practical teaching rule: productivity stays within about <strong className="text-foreground">5%</strong> across a window of at least <strong className="text-foreground">10</strong> cycles. The guide appears as an <strong className="text-foreground">old-gold dashed</strong> line—so class can quote settled productivity, not the first spike.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">5.3 Idleness and busy time</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">For each resource, <strong className="text-foreground">idle %</strong> and <strong className="text-foreground">busy %</strong> are both labeled so a tiny idle bar still has a story. High idle on a costly resource is a design smell; high idle on a cheap buffer may be intentional. This is often the best classroom discussion in the whole app.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">5.4 Cost Report</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">When you supply hourly rates (USD per resource-hour): resource cost ≈ count × (USD/h) × run hours; <strong className="text-foreground">unit cost</strong> ≈ total cost ÷ production. Unit cost bridges “how busy?” to “how expensive per unit produced?”—especially next to sensitivity charts.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">5.5 Sensitivity Analysis tab</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Appears when the prompt defines <code className="text-foreground">Sensitivity:</code>. Compare combinations (e.g. trucks vs loaders): productivity and unit cost side by side, best markers, and idleness views. Pairwise comparison supports more than two resources within teaching caps (≤5 resources; ~150 combinations by stepping ranges). Batches prefer a <strong className="text-foreground">Web Worker</strong> so the UI stays responsive; fallback is the main thread (same numbers). Single Simulate stays on the main thread.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">5.6 Export discipline</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Report Excel (multi-sheet; name prefers <code className="text-foreground">Operation:</code>), chart PNG, diagram PNG. For homework note Operation name, seed, max cycles, and any SA ranges.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">5.7 How to discuss results in one minute</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed"><li>What is steady-state units/hour?  </li><li>Which resource has the highest idle %?  </li><li>What is unit cost (if costs were entered)?  </li><li>If I add one unit of the scarce resource, what do I expect—then test with SA or a re-run.</li></ol>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 6 — Six Examples as a learning path</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Selecting an Example fills the prompt only. <strong className="text-foreground">You</strong> click Draw Model. Use Chapter 4 while you look at each diagram.</p>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px] text-foreground/90">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-2 py-1.5 font-medium">#</th><th className="px-2 py-1.5 font-medium">Name</th><th className="px-2 py-1.5 font-medium">What you should notice on the diagram</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">1</td><td className="px-2 py-1.5"><strong className="text-foreground">Earthmoving</strong></td><td className="px-2 py-1.5">Two home QUEUEs; COMBI Load; gold returns; single counter</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">2</td><td className="px-2 py-1.5"><strong className="text-foreground">Asphalt Paving</strong></td><td className="px-2 py-1.5">Meeting + <strong className="text-foreground">branch</strong> arcs with <code className="text-foreground">p=</code></td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">3</td><td className="px-2 py-1.5"><strong className="text-foreground">Loading Dump Truck</strong></td><td className="px-2 py-1.5"><strong className="text-foreground">GEN ▽</strong> and <strong className="text-foreground">CON △</strong> on the truck path</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">4</td><td className="px-2 py-1.5"><strong className="text-foreground">Tower Crane</strong></td><td className="px-2 py-1.5">Multi-demand crane; priorities; multi-counter flags</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">5</td><td className="px-2 py-1.5"><strong className="text-foreground">Masonry</strong></td><td className="px-2 py-1.5">Face-position queues; helper multi-demand; SA later</td></tr>
                <tr><td className="px-2 py-1.5">6</td><td className="px-2 py-1.5"><strong className="text-foreground">Precast Plant</strong></td><td className="px-2 py-1.5">Longer line; several resource homes; complex SA</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90"><strong className="text-foreground">Path:</strong> 1→2→3 mechanics; 4 shared resources; 5–6 decisions under sensitivity.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 7 — What “AI-assisted” should mean here</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">The Assistant sits under Results. It should feel like a teaching assistant who has read your board—not a search engine.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.1 Purpose</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed"><li>Explain <em>this</em> model’s cycles, COMBI/NORMAL, counter, GEN/CON, branch  </li><li>Point at bottleneck and idleness from the <em>last run</em>  </li><li>Propose a full Format Prompt edit when you ask to change fleet or durations  </li><li>Stay short (≤20 lines) so the studio remains the focus  </li></ul>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">It must <strong className="text-foreground">not</strong> silently re-simulate, invent another operation, or replace CYCLONE with a mystery model.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.2 Technology (honest)</h3>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px] text-foreground/90">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-2 py-1.5 font-medium">Mode</th><th className="px-2 py-1.5 font-medium">When</th><th className="px-2 py-1.5 font-medium">Behavior</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5"><strong className="text-foreground">AI mode</strong></td><td className="px-2 py-1.5"><code className="text-foreground">XAI_API_KEY</code> on host</td><td className="px-2 py-1.5">Compact CONTEXT snapshot only</td></tr>
                <tr><td className="px-2 py-1.5"><strong className="text-foreground">Local mode</strong></td><td className="px-2 py-1.5">No key / failure</td><td className="px-2 py-1.5">English-first intent helper</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Product UI, Manual, and keywords are English-first (international classroom). Rate limits: ~30 Assistant requests / hour / IP; ~20 AI DSL draft / hour / IP.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.3 Chat UX</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Gold <strong className="text-foreground">You</strong> bubbles (right, compact); light Assistant (left). System guidance lives in the input <strong className="text-foreground">placeholder</strong>. Quick chips are general: resources · bottleneck · productivity · unit cost.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.4 Recommended questions</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed"><li>Explain resource cycles; COMBI vs NORMAL; where is the counter?  </li><li>How do GEN/CON or branch p work in this model?  </li><li>Fleet counts; highest idleness; likely bottleneck  </li><li>Last productivity; steady state yet; unit cost; idle vs busy %  </li><li>Edits using <em>your</em> resource names (then Apply → Draw → Simulate)  </li><li>SA: best unit cost / highest productivity combination  </li><li>Why home-QUEUE idleness is waste; why every resource needs a queue  </li></ul>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.5 Boundary</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Answers only about the <strong className="text-foreground">current</strong> Format Prompt, drawn network, and <strong className="text-foreground">last</strong> results. May <strong className="text-foreground">propose</strong> edits; you must <strong className="text-foreground">Apply</strong>, <strong className="text-foreground">Draw Model</strong>, and <strong className="text-foreground">Simulate</strong>.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.6 Workflow</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Build & simulate → ask → if a new prompt is proposed, Apply → Draw → Simulate → compare numbers.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">7.7 Weak vs strong questions</h3>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px] text-foreground/90">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-2 py-1.5 font-medium">Weak</th><th className="px-2 py-1.5 font-medium">Stronger</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">“Make it better”</td><td className="px-2 py-1.5">“Which resource has the highest idle % after this run?”</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">“Optimize everything”</td><td className="px-2 py-1.5">“Propose trucks = 8; keep loader = 1; I will re-simulate.”</td></tr>
                <tr><td className="px-2 py-1.5">“What is CYCLONE?” with empty model</td><td className="px-2 py-1.5">Draw Example 1, then “Explain this model’s cycles.”</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 8 — Guardrails</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">8.1 Simulation limits</h3>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px] text-foreground/90">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-2 py-1.5 font-medium">Parameter</th><th className="px-2 py-1.5 font-medium">Default</th><th className="px-2 py-1.5 font-medium">Hard limit</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Max cycles</td><td className="px-2 py-1.5">100</td><td className="px-2 py-1.5"><strong className="text-foreground">500</strong></td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Seed</td><td className="px-2 py-1.5">12345</td><td className="px-2 py-1.5">— (dice = another path)</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Time unit</td><td className="px-2 py-1.5">minutes</td><td className="px-2 py-1.5">—</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">SA resources</td><td className="px-2 py-1.5">—</td><td className="px-2 py-1.5"><strong className="text-foreground">5</strong></td></tr>
                <tr><td className="px-2 py-1.5">SA combinations</td><td className="px-2 py-1.5">—</td><td className="px-2 py-1.5"><strong className="text-foreground">~150</strong> (ranges step up)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Same seed + same model + same cycle limit → <strong className="text-foreground">identical</strong> stochastic results. Seed is for reproducibility (homework, papers), not a fleet decision.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">8.2 Performance</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Sensitivity prefers a Web Worker; fallback main thread (same numbers, possible brief UI pause). Single Simulate on main thread—fast enough for teaching sizes.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">8.3 AI & API</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed"><li>Assistant: ~30 / hour / IP  </li><li>AI DSL draft: ~20 / hour / IP  </li><li>Payload: compact CONTEXT only; replies ≤20 lines  </li><li>Without API key: local English helper still works  </li></ul>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">These limits do not change CYCLONE rules—they protect shared hosting and API cost.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">8.4 Deploy and versions</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">GitHub <code className="text-foreground">main</code> → Vercel · <a className="text-primary hover:underline" href="https://neo-cyclone.vercel.app/" target="_blank" rel="noreferrer">neo-cyclone.vercel.app</a>. No sign-in required for teaching. Always cite the footer product version after a deploy.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">8.5 Citing Neo-CYCLONE</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Product + version · URL · Operation · seed · max cycles · Simulation and/or Sensitivity · optional software DOI if your course requires it.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 9 — FAQ (from real studio use)</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">Drawing and the model diagram</h3>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: I selected an Example but nothing drew.</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: Click <strong className="text-foreground">Draw Model</strong>. Examples only paste the prompt.</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: Why does the diagram not match the book figure exactly?</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: Same CYCLONE <em>logic</em>; Neo-CYCLONE teaching <em>notation</em> (Chapter 4). Black/gold arrows and some shapes are intentional—not a bug.</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: What do gold dashed arrows mean?</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: Resource <strong className="text-foreground">return</strong> to a <strong className="text-foreground">home QUEUE</strong>. Solid black = forward work (including into staging before a COMBI).</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: COMBI vs NORMAL looks wrong.</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: COMBI only when <strong className="text-foreground">two or more resources</strong> must meet to start the task. Solo work → NORMAL. Re-read which resources list that task.</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: Where is the production counter?</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: Golf-flag node. Set with <code className="text-foreground">Counter after: TaskName</code>. Multiple flags are allowed (e.g. tower crane zones).</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: GEN and CON look like random triangles.</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: ▽ GEN multiplies units on arrival; △ CON gathers n→1. Prefer inline on the cycle: <code className="text-foreground">GEN 5 → Scoop → CON 5 TruckFull → …</code>. Not required in every model.</p>
          </div>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">Simulation and results</h3>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: Why is Simulate not useful yet?</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: Draw a model you trust first. Numbers without a truthful diagram are noise.</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: My classmate got different productivity.</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: Compare <strong className="text-foreground">seed</strong>, <strong className="text-foreground">max cycles</strong>, and whether the Format Prompt is identical (durations, branches, counts).</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: What is the steady-state line?</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: Teaching guide: productivity within about <strong className="text-foreground">5%</strong> over a window of at least <strong className="text-foreground">10</strong> cycles—old-gold dashed line on the units/hour chart. Quote that band in class, not the first noisy spike.</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: Sensitivity tab is empty / boring.</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: Add a <code className="text-foreground">Sensitivity:</code> block (see Examples 5–6). Without ranges, there is nothing to sweep.</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: Charts stop before my max cycles.</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: Series follow completed production events; if the run hits time/logic limits earlier, the chart ends earlier. Check Process Report run length and cycle count.</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: Where is cost?</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: Only if the prompt has <code className="text-foreground">Cost:</code> rates (USD per resource-hour). Then Cost Report shows totals and <strong className="text-foreground">unit cost</strong>.</p>
          </div>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">Prompt, Excel, language</h3>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: Excel file name looks like resource spaghetti.</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: Add <code className="text-foreground">Operation: ShortName</code> after <code className="text-foreground">#</code> notes (before resource cycles).</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: Can I write the prompt in Indonesian?</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: <code className="text-foreground">#</code> notes may be any language. Keep <strong className="text-foreground">network keywords</strong>, task names used in counters, and distribution keywords in <strong className="text-foreground">English</strong> for reliable parsing.</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: AI proposed a prompt but numbers did not change.</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: Click <strong className="text-foreground">Apply</strong>, then <strong className="text-foreground">Draw Model</strong>, then <strong className="text-foreground">Simulate</strong>. Nothing silent updates the engine.</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: AI only answers in English / very short.</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: Product policy: English-first; replies capped (≤20 lines) so the studio stays primary.</p>
          </div>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">Access and limits</h3>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: Is sign-in required?</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: No for teaching use.</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: Max cycles 500 still feels short.</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: Teaching cap protects shared hosts and keeps charts readable. For research-scale work, use a research tool or discuss with the course owner.</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: Rate limit on AI Assistant?</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: About 30 requests / hour / IP on the shared host. Normal class pace is fine; lab NATs may share one IP.</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: Who is this dedicated to?</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: Professor Daniel W. Halpin and the CYCLONE tradition—see Prologue and References.</p>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground"><strong className="text-foreground">Q: Where is the full bibliography?</strong>  </p>
            <p className="mt-0.5 text-xs leading-relaxed">A: <strong className="text-foreground">References</strong> section at the <strong className="text-foreground">end</strong> of this manual (after the Epilogue).</p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Chapter 10 — Notes for instructors (and peer mentors)</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">10.1 Baseline run for the whole class</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Example <strong className="text-foreground">1</strong>, seed <strong className="text-foreground">12345</strong>, max cycles <strong className="text-foreground">100</strong>. Everyone matches once—then change <strong className="text-foreground">one</strong> thing per exercise.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">10.2 Exercise patterns</h3>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px] text-foreground/90">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-2 py-1.5 font-medium">Pattern</th><th className="px-2 py-1.5 font-medium">Ask students</th><th className="px-2 py-1.5 font-medium">Submit</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">See waste</td><td className="px-2 py-1.5">Baseline idleness</td><td className="px-2 py-1.5">Who waits? Why?</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Read the diagram</td><td className="px-2 py-1.5">Label QUEUE / COMBI / NORMAL / COUNTER / gold return</td><td className="px-2 py-1.5">Screenshot + 5 labels</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Fleet change</td><td className="px-2 py-1.5">Trucks 3 vs 8, same seed</td><td className="px-2 py-1.5">Unit cost + productivity</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Branch</td><td className="px-2 py-1.5">Example 2</td><td className="px-2 py-1.5">Effect of breakdown path</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Shared resource</td><td className="px-2 py-1.5">Example 4, swap priority</td><td className="px-2 py-1.5">Who starves?</td></tr>
                <tr><td className="px-2 py-1.5">Sensitivity</td><td className="px-2 py-1.5">Examples 5–6</td><td className="px-2 py-1.5">Best unit-cost combo + caution</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">10.3 AI in class</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Explain & draft allowed; graded claims need engine runs after Apply. Watch shared-IP rate limits in labs.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">10.4 Lightweight rubric</h3>
          <div className="mt-2 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-left text-[11px] text-foreground/90">
              <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                <tr><th className="px-2 py-1.5 font-medium">Criterion</th><th className="px-2 py-1.5 font-medium">Strong looks like</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Model truth</td><td className="px-2 py-1.5">Diagram matches narrative (Ch.4 checklist)</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Waste literacy</td><td className="px-2 py-1.5">Idle/busy + bottleneck, not only total production</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Reproducibility</td><td className="px-2 py-1.5">Seed, cycles, version cited</td></tr>
                <tr className="border-b border-border/60"><td className="px-2 py-1.5">Decision</td><td className="px-2 py-1.5">Unit cost or SA-informed recommendation</td></tr>
                <tr><td className="px-2 py-1.5">Integrity</td><td className="px-2 py-1.5">Engine results primary; AI optional</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">10.5 Access</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">No install; modern browser; Manual in header; hard refresh after deploys if CSS looks missing.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Epilogue — A request to the reader</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">When the diagram is clean and the numbers are stable, you have done what Halpin asked of a generation of students: <strong className="text-foreground">see the operation</strong>. AI can speed the typing; it cannot replace that seeing.</p>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Keep one run with seed <strong className="text-foreground">12345</strong> as a shared baseline. Change one idea at a time—fleet, duration, branch, or priority—and ask what happened to <strong className="text-foreground">idleness</strong> and <strong className="text-foreground">unit cost</strong>.</p>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">If the on-screen model looks slightly different from a photocopy of a 1992 figure, use Chapter 4: honor the <strong className="text-foreground">logic</strong>, learn this studio’s <strong className="text-foreground">legend</strong>, then run the engine.</p>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Thank you for using Neo-CYCLONE with care.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">References</h2>
          <div className="gold-rule my-3 max-w-xs" />
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Selected literature on <strong className="text-foreground">CYCLONE</strong>, <strong className="text-foreground">MicroCYCLONE</strong>, and applications by <strong className="text-foreground">Daniel W. Halpin</strong>, students, and collaborators. Placed <strong className="text-foreground">last</strong> so teaching chapters stay in front; use this section for papers, theses, and course bibliographies.</p>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">Foundations</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed"><li><strong className="text-foreground">Halpin, D. W.</strong> (1973). Ph.D. dissertation, University of Illinois at Urbana–Champaign.  </li><li><strong className="text-foreground">Halpin, D. W.</strong> (1977). “CYCLONE: Method for Modeling of Job Site Processes.” <em>Journal of the Construction Division</em>, ASCE, 103(3), 489–499.  </li><li><strong className="text-foreground">Halpin, D. W., & Riggs, L. S.</strong> (1992). <em>Planning and Analysis of Construction Operations</em>. Wiley.  </li></ol>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">MicroCYCLONE</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed"><li><strong className="text-foreground">Lluch, J., & Halpin, D. W.</strong> (1982). <em>Journal of the Construction Division</em>, ASCE, 108(1), 129–145.  </li><li><strong className="text-foreground">Halpin, D. W.</strong> (1990–1992). MicroCYCLONE user and system manuals (Purdue / Learning Systems).  </li></ol>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">DISCO</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed"><li><strong className="text-foreground">Huang, R.-Y., & Halpin, D. W.</strong> (1993–1995). DISCO-related papers (ISARC; <em>Microcomputers in Civil Engineering</em>; <em>Journal of Construction Engineering and Management</em>).  </li><li><strong className="text-foreground">Huang, R.-Y.</strong> (1994). Ph.D., Purdue University (advisor: Halpin).  </li></ol>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">PROSIDYC · COST · WebCYCLONE</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed"><li><strong className="text-foreground">Halpin, D. W., & Martinez, L.-H.</strong> (1999). PROSIDYC. <em>Winter Simulation Conference</em>.  </li><li><strong className="text-foreground">Cheng, T.-M., et al.</strong> (2000). COST. <em>17th ISARC</em>.  </li><li><strong className="text-foreground">Halpin, D. W., Jen, H., & Kim, J.</strong> (2003). WebCYCLONE. <em>Winter Simulation Conference</em>.  </li></ol>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">Purdue circle and related systems</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs leading-relaxed"><li>Work in the Halpin circle and peers: AbouRizk & Halpin; Hijazi; Lutz; Gonzalez-Quevedo; Abraham; project-level CYCLONE studies; AbouRizk et al. (2011) and related synthesis.  </li><li>Related lineage: <strong className="text-foreground">UM-CYCLONE</strong> (Ioannou), <strong className="text-foreground">STROBOSCOPE</strong> (Martinez), <strong className="text-foreground">Simphony / Simphony.NET</strong> (AbouRizk et al.).  </li></ol>
          <h3 className="font-display mt-6 text-base font-semibold text-foreground">How Neo-CYCLONE relates</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">Neo-CYCLONE does <strong className="text-foreground">not</strong> claim to supersede research simulators. It is <strong className="text-foreground">AI-Assisted Construction Operation Simulation</strong>—a studio for first principles: flow, idleness, cyclic networks, transparent discrete-event logic, and responsible AI beside that engine. Diagram notation follows this product’s standard (Chapter 4; <code className="text-foreground">NOTATION_STANDARD.md</code>) while remaining in Halpin’s tradition.</p>
        </section>

        <footer className="border-t border-border pt-6 text-center text-[11px] text-muted-foreground">
          <p>
            {PRODUCT_TAGLINE}
            <span className="mx-1.5">·</span>
            Manual v{PRODUCT_VERSION}
          </p>
        </footer>
      </main>
    </div>
  );
}
