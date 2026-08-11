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
        </footer>
      </main>
    </div>
  );
}
