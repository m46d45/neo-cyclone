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
            <span className="font-display text-base font-semibold tracking-tight sm:text-lg">Neo-CYCLONE Manual</span>
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

      <main className="mx-auto max-w-3xl space-y-14 px-4 py-10 text-muted-foreground">
        <header className="space-y-3">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Neo-CYCLONE Manual
          </h1>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary">{PRODUCT_TAGLINE}</p>
          <p className="max-w-2xl text-[15px] leading-[1.75] text-foreground/90">
            Written for people who want to understand construction operations as flow. Read it with the studio open.
            Sub-chapters are kept where the idea needs room—not as empty labels. 
            <strong className="text-foreground">References</strong> are at the end.{" "}
            <a
              className="font-medium text-primary hover:underline"
              href="/Neo-CYCLONE-User-Manual.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Download PDF
            </a>
            .
          </p>
        </header>


        <section className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Prologue — Why this studio exists</h2>
          <div className="gold-rule my-4 max-w-xs" />
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Construction work is full of <strong className="text-foreground">repetition</strong>: load and haul, pour and return, lift and place. Between those busy moments, resources wait. A truck sits at a loader. A crane waits while a crew finishes tying rebar. That waiting is not always “laziness.” Very often it is <strong className="text-foreground">the structure of the process</strong>—how work and idle time are braided together on a real site.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Professor <strong className="text-foreground">Daniel W. Halpin</strong> spent a career making that structure <em>visible</em>. His <strong className="text-foreground">CYCLONE</strong> language (<em>CYCLic Operations NEtwork</em>) gave construction operations a small, honest network grammar: resources wait in queues, they work for a duration, they meet when they must, and a counter records completed production. From that grammar grew a family of tools—<strong className="text-foreground">MicroCYCLONE</strong>, then DISCO, PROSIDYC, COST, WebCYCLONE, and related systems. The full reading list sits in <strong className="text-foreground">References</strong> at the end of this manual.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90"><strong className="text-foreground">Neo-CYCLONE</strong> does not claim to replace those research systems. It is a <strong className="text-foreground">teaching studio</strong>: a browser place to meet Halpin’s ideas again, with a modern interface and an AI Assistant that stays tied to <em>your</em> model. The product name is plain on purpose: <strong className="text-foreground">AI-Assisted Construction Operation Simulation</strong>.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">AI here does not invent a new physics of construction. The <strong className="text-foreground">engine</strong> is still a discrete-event, CYCLONE-style simulator. AI helps you phrase a model, inspect a diagram, and ask questions about the last run. <strong className="text-foreground">You</strong> still click Draw Model, still Simulate, still judge whether the story is true.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">If you leave with one habit, make it this:</p>
          <blockquote className="mt-4 rounded-[var(--radius-md)] border border-primary/30 bg-primary/5 px-4 py-3 text-[14px] leading-relaxed text-foreground"><strong className="text-foreground">Draw the cycles until they tell the truth, then run the numbers.</strong></blockquote>
        </section>

        <section className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Chapter 1 — Operations, flow, and idleness</h2>
          <div className="gold-rule my-4 max-w-xs" />
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">1.1 What we mean by a construction operation</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">An <em>operation</em> in this studio is a <strong className="text-foreground">repeatable production process</strong>—often measured in units per hour—not the whole project Gantt chart. Earthmoving a cut, paving a lane, loading dump trucks, serving three zones with one crane, stocking brick and mortar for masons, cycling forms in a precast yard: each is an operation with <strong className="text-foreground">resources</strong>, <strong className="text-foreground">tasks</strong>, and <strong className="text-foreground">waiting</strong>.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Thinking at the operation level matters for <strong className="text-foreground">Lean Construction</strong> and <strong className="text-foreground">Project Production Management</strong>. Before you “optimize” a schedule bar, you need to see whether the <em>process</em> itself produces flow or waste. Neo-CYCLONE is built for that first, stubborn look.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">1.2 Flow and idleness — waste you can measure</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">In CYCLONE thinking, a resource that is not working is usually <strong className="text-foreground">in a queue</strong>—waiting for a partner, a space, or a task to open. That waiting time is <strong className="text-foreground">idleness</strong>. It is not a moral failure; it is a signal:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[13px] leading-relaxed text-foreground/90"><li>Too few trucks → the loader sits idle.</li><li>Too many trucks → the truck queue grows and money burns in the line.</li><li>A shared crane with the wrong priority → one zone starves while another looks busy.</li></ul>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Neo-CYCLONE reports <strong className="text-foreground">idle %</strong> and <strong className="text-foreground">busy %</strong> side by side so those signals are hard to ignore. When you later hear “waste” in Lean language, you already have a picture for it—not a slogan.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">1.3 Why a network language?</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">You could describe an operation in paragraphs of natural language. Networks force the questions that paragraphs hide:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[13px] leading-relaxed text-foreground/90"><li>Which resources exist?</li><li>In what order do they work?</li><li>Where do they wait when they are not working?</li><li>Where do two or more resources <strong className="text-foreground">meet</strong> (for example truck and loader)?</li><li>What counts as <strong className="text-foreground">one unit of production</strong>?</li></ul>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">CYCLONE answered those questions with a small set of node types. Neo-CYCLONE keeps that spirit in the <strong className="text-foreground">logic</strong>, even when some <strong className="text-foreground">glyphs</strong> and <strong className="text-foreground">arrow colors</strong> are tuned for a screen (Chapter 4). Logic first; ink second.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">1.4 What Neo-CYCLONE is — and is not</h3>
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-border shadow-sm">
            <table className="w-full min-w-[520px] text-left text-[12px] leading-relaxed text-foreground/90">
              <thead className="border-b border-border bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-2.5 py-2 font-medium">It is</th><th className="px-2.5 py-2 font-medium">It is not</th></tr>
              </thead>
              <tbody className="bg-card/40">
                                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">A browser teaching studio for cyclic construction operations</td><td className="px-2.5 py-2 align-top">A full project-controls ERP</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Prompt → diagram → discrete-event simulation</td><td className="px-2.5 py-2 align-top">A black-box “AI that simulates for you” without a model</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">MicroCYCLONE-style reports (process, elements, cost, sensitivity)</td><td className="px-2.5 py-2 align-top">A pixel-perfect reprint of 1970s or 1990s paper figures</td></tr>
                <tr><td className="px-2.5 py-2 align-top">English-first, classroom-friendly limits</td><td className="px-2.5 py-2 align-top">An unlimited free chat API</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">You do <strong className="text-foreground">not</strong> need to sign in to learn. Teaching use stands alone.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">1.5 The studio at a glance</h3>
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-border shadow-sm">
            <table className="w-full min-w-[520px] text-left text-[12px] leading-relaxed text-foreground/90">
              <thead className="border-b border-border bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-2.5 py-2 font-medium">Area</th><th className="px-2.5 py-2 font-medium">What you do there</th></tr>
              </thead>
              <tbody className="bg-card/40">
                                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Left</strong></td><td className="px-2.5 py-2 align-top">Choose an Example or write a Format Prompt, then <strong className="text-foreground">Draw Model</strong></td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Right</strong></td><td className="px-2.5 py-2 align-top">Inspect the <strong className="text-foreground">CYCLONE Model</strong> diagram; set cycles and seed; <strong className="text-foreground">Simulate</strong></td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Below</strong></td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Results</strong> — Simulation and Sensitivity Analysis</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Lower</strong></td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">AI Assistant</strong> (optional co-pilot)</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Header</strong></td><td className="px-2.5 py-2 align-top">This Manual</td></tr>
                <tr><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Footer</strong></td><td className="px-2.5 py-2 align-top">Product name, version, year — cite the version in homework</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">The right-hand diagram is not decoration. Chapter 4 is the legend for that panel.</p>
        </section>

        <section className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Chapter 2 — Fifteen minutes that stick (Earthmoving)</h2>
          <div className="gold-rule my-4 max-w-xs" />
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">This chapter is a guided first run. Do it once with Example 1 even if you already “know trucks.” Muscle memory for the studio matters more than cleverness on day one.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">2.1 Open the studio</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Go to the live app. You should see a prompt area and Example dropdown on the left, an empty <strong className="text-foreground">CYCLONE Model</strong> on the right until you draw, and later—after a run—Results and the AI Assistant below. The footer shows product name, version, and year.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">2.2 Load Example 1 and draw the model</h3>
          <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[13px] leading-relaxed text-foreground/90"><li>Open <strong className="text-foreground">Example → 1. Earthmoving</strong>.</li><li>Read the prompt top to bottom. Notice the shape:</li></ol>
          <pre className="mt-3 max-h-80 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-4 font-mono text-[11px] leading-relaxed text-foreground">
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
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">In plain language: trucks cycle load → haul → dump → return. The loader only joins at <strong className="text-foreground">Load</strong>, so Load is a <strong className="text-foreground">meeting</strong> (COMBI). Production is counted after <strong className="text-foreground">Dump</strong> (for example 12 m³). Costs are dollars per resource-hour. Durations are in <strong className="text-foreground">minutes</strong>.</p>
          <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[13px] leading-relaxed text-foreground/90"><li>Click <strong className="text-foreground">Draw Model</strong>. Selecting an example does <strong className="text-foreground">not</strong> draw by itself.</li><li>On the right, confirm what Chapter 4 will name carefully:</li></ol>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[13px] leading-relaxed text-foreground/90"><li>Home <strong className="text-foreground">QUEUE</strong> circles for trucks and loader (often with <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">n = …</code>).</li><li><strong className="text-foreground">Load</strong> as COMBI (square with a top-left cut).</li><li>Haul, Dump, Return as NORMAL rectangles (truck alone).</li><li><strong className="text-foreground">COUNTER</strong> as a golf-flag after Dump.</li><li><strong className="text-foreground">Solid black</strong> arrows forward; <strong className="text-foreground">dashed gold</strong> arrows returning resources home.</li></ul>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">If something looks wrong, fix the prompt and <strong className="text-foreground">Draw Model</strong> again. Do not Simulate until the picture matches the story. That pause is the point of the studio.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">2.3 Cycles, seed, and a fair comparison</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[13px] leading-relaxed text-foreground/90"><li><strong className="text-foreground">Max cycles</strong> — default <strong className="text-foreground">100</strong>, hard maximum <strong className="text-foreground">500</strong> (a teaching cap).</li><li><strong className="text-foreground">Seed</strong> — default <strong className="text-foreground">12345</strong>. Same seed, same model, same cycle limit → <strong className="text-foreground">identical</strong> stochastic results. The dice button picks another seed when you <em>want</em> a different random path.</li></ul>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Seed is for <strong className="text-foreground">reproducibility</strong>—homework, papers, fair classroom comparison—not a fleet decision variable. If your classmate “got different productivity,” check seed and max cycles before you rewrite the model.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">2.4 Simulate and read the first results</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Click <strong className="text-foreground">Simulate</strong>. Open the <strong className="text-foreground">Simulation</strong> tab and walk the story in order:</p>
          <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[13px] leading-relaxed text-foreground/90"><li><strong className="text-foreground">Process Report</strong> — run length, cycles, production pace.</li><li><strong className="text-foreground">Units per hour by cycle</strong> — does productivity settle? The steady-state guide (~5% over at least 10 cycles) appears as an old-gold dashed line.</li><li><strong className="text-foreground">Resource idleness</strong> — who waits? who works? Often the best classroom discussion in the whole app.</li><li><strong className="text-foreground">Cost Report</strong> (if you entered rates) — unit cost bridges “how busy?” to “how expensive per unit?”</li></ol>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Chapter 5 expands each of these without turning them into a checklist of empty headings.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">2.5 Export and the AI Assistant</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Export <strong className="text-foreground">Report Excel</strong> (the filename prefers <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">Operation: …</code>), chart PNG, and diagram PNG when you need evidence for homework. Record seed, max cycles, and the operation name.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">If you open the <strong className="text-foreground">AI Assistant</strong>, try the general chips: resources, bottleneck, productivity, unit cost. Answers stay short. If the assistant proposes a new prompt, nothing changes in the engine until you <strong className="text-foreground">Apply</strong>, then <strong className="text-foreground">Draw Model</strong>, then <strong className="text-foreground">Simulate</strong>. That three-step gate is intentional.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">2.6 Mistakes that waste a first session</h3>
          <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[13px] leading-relaxed text-foreground/90"><li>Expecting a diagram after only selecting an Example.</li><li>Simulating before the diagram matches the story.</li><li>Changing fleet size in chat and assuming the engine already changed.</li><li>Comparing runs with different seeds.</li><li>Reading only total production and ignoring <strong className="text-foreground">idleness</strong>.</li><li>Assuming every rectangle must match a photocopy of a 1992 book figure (see Chapter 4).</li></ol>
        </section>

        <section className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Chapter 3 — How to talk so the studio can build a network</h2>
          <div className="gold-rule my-4 max-w-xs" />
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">You do not draw QUEUE circles freehand in the prompt. You describe <strong className="text-foreground">resource cycles</strong>. The builder creates queues, tasks, and arcs. Students learn the <em>logic</em> of cycles—not pixel-pushing.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">3.1 Notes, operation name, and resource cycles</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Lines that start with <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">#</code> or <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">//</code> are <strong className="text-foreground">notes only</strong>. Use them for teaching context; the engine ignores them.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">After the notes, the first data line may be:</p>
          <pre className="mt-3 max-h-80 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-4 font-mono text-[11px] leading-relaxed text-foreground">
Operation: Earthmoving
          </pre>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Aliases: <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">Model:</code>, <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">Title:</code>, <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">Op:</code>. That name titles reports and Excel files. All six built-in Examples place <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">Operation:</code> after their comment block.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Then state the network:</p>
          <pre className="mt-3 max-h-80 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-4 font-mono text-[11px] leading-relaxed text-foreground">
Trucks: Load → Haul → Dump → Return
Loader: Load
5 trucks, 1 loader
          </pre>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[13px] leading-relaxed text-foreground/90"><li>One primary sequence per resource.</li><li>Supporting resources often share a meeting task (here, Load).</li><li>Arrows may be written <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">→</code>, <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">-{'>'}</code>, <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">--{'>'}</code>, or <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">={'>'}</code>.</li><li>Multi-demand (one resource serves several tasks): <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">Crane: LiftAtA | LiftAtB | LiftAtC</code>.</li><li>Priority (lower number = higher priority when several demands wait) follows MicroCYCLONE tradition:</li></ul>
          <pre className="mt-3 max-h-80 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-4 font-mono text-[11px] leading-relaxed text-foreground">
Priority:
LiftAtA: 1
LiftAtB: 2
LiftAtC: 3
          </pre>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">3.2 Production counter</h3>
          <pre className="mt-3 max-h-80 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-4 font-mono text-[11px] leading-relaxed text-foreground">
Counter after: Dump
production = 12 m3
          </pre>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Name the task (or tasks) that mean “one production unit finished.” Multiple counters are allowed—for example lifts at three tower-crane zones. Explicit counters are safer for teaching than silent defaults. If production “disappears,” check this line first.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">3.3 Durations (minutes)</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Every named task needs a distribution. Time in this studio is <strong className="text-foreground">minutes</strong> unless you deliberately document otherwise.</p>
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-border shadow-sm">
            <table className="w-full min-w-[520px] text-left text-[12px] leading-relaxed text-foreground/90">
              <thead className="border-b border-border bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-2.5 py-2 font-medium">Kind</th><th className="px-2.5 py-2 font-medium">Parameters</th><th className="px-2.5 py-2 font-medium">Typical use</th></tr>
              </thead>
              <tbody className="bg-card/40">
                                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">const</code></td><td className="px-2.5 py-2 align-top">value</td><td className="px-2.5 py-2 align-top">Deterministic demo</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">unif</code></td><td className="px-2.5 py-2 align-top">min, max</td><td className="px-2.5 py-2 align-top">Flat uncertainty</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">tri</code></td><td className="px-2.5 py-2 align-top">min, mode, max</td><td className="px-2.5 py-2 align-top">Common field estimate</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">normal</code></td><td className="px-2.5 py-2 align-top">mean, sd</td><td className="px-2.5 py-2 align-top">Symmetric scatter</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">lognormal</code></td><td className="px-2.5 py-2 align-top">mean, sd</td><td className="px-2.5 py-2 align-top">Skewed positive times</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">beta</code></td><td className="px-2.5 py-2 align-top">min, max, α, β</td><td className="px-2.5 py-2 align-top">Four-parameter beta</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">pert</code></td><td className="px-2.5 py-2 align-top">a, m, b</td><td className="px-2.5 py-2 align-top">Classic PERT-beta on [a, b]</td></tr>
                <tr><td className="px-2.5 py-2 align-top"><code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">gamma</code></td><td className="px-2.5 py-2 align-top">shape, scale</td><td className="px-2.5 py-2 align-top">Flexible positive skew</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Aliases: <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">pert</code> ≈ beta-PERT. A three-number <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">beta</code> is treated as PERT.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">3.4 Branch probability, GEN, and CON</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">When the story forks—breakdown, rework, inspection fail—use a branch:</p>
          <pre className="mt-3 max-h-80 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-4 font-mono text-[11px] leading-relaxed text-foreground">
Branch:
After DumpToPaver: RefillAsphalt p=0.85, Breakdown p=0.15
          </pre>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Probabilities should look like a split of the real world, not decoration.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90"><strong className="text-foreground">GENERATE</strong> multiplies entities (one truck arrival becomes five scoop-sized loads). <strong className="text-foreground">CONSOLIDATE</strong> gathers <em>n</em> into one (truck becomes full). Prefer the <strong className="text-foreground">inline</strong> form on the cycle:</p>
          <pre className="mt-3 max-h-80 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-4 font-mono text-[11px] leading-relaxed text-foreground">
Trucks: GEN 5 → Scoop → CON 5 TruckFull → Haul&Return
          </pre>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Not every model needs GEN/CON—only when the production unit logic requires scaling. Their independence is intentional: you may have one without the other.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">3.5 Cost, sensitivity, and block order</h3>
          <pre className="mt-3 max-h-80 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-4 font-mono text-[11px] leading-relaxed text-foreground">
Cost:
Trucks: 85
Loader: 120

Sensitivity:
Trucks: 2..10
Loader: 1..2
          </pre>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Costs are <strong className="text-foreground">USD per resource-hour</strong>. Sensitivity varies counts for comparison runs (productivity, unit cost, idleness). Teaching caps: up to <strong className="text-foreground">five</strong> resources in SA; combinations limited (~150) by stepping ranges, not by silently dropping mid-axis points.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Recommended order for humans and for the assistant:</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90"><strong className="text-foreground">Operation → Network → Durations → Priority → Branch → Cost → Sensitivity (last).</strong></p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">3.6 A minimal custom prompt you can rewrite</h3>
          <pre className="mt-3 max-h-80 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-4 font-mono text-[11px] leading-relaxed text-foreground">
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
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Replace the names with <em>your</em> operation. Draw Model. If the diagram lies, the prompt is incomplete—not “the AI failed.” The live <strong className="text-foreground">Format Prompt</strong> panel in the studio shows the canonical template; prefer that order so people and software read the same story.</p>
        
          <p className="mt-6 text-[13px] font-medium text-foreground">Live Format Prompt template (same text the studio shows)</p>
          <pre className="mt-2 max-h-72 overflow-auto rounded-[var(--radius-md)] border border-primary/20 bg-card p-4 font-mono text-[11px] leading-relaxed text-foreground">
            {GENERAL_TEMPLATE}
          </pre>
</section>

        <section className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Chapter 4 — Reading the model: how Neo-CYCLONE draws CYCLONE</h2>
          <div className="gold-rule my-4 max-w-xs" />
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Users spend a long time staring at the <strong className="text-foreground">CYCLONE Model</strong> panel. This chapter is the legend for that panel: how we model, what each symbol means, and where we deliberately differ from textbook Halpin figures while keeping the same <em>ideas</em>.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">4.1 Modeling idea (the same spirit as Halpin)</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Neo-CYCLONE still models a <strong className="text-foreground">cyclic construction operation</strong> as:</p>
          <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[13px] leading-relaxed text-foreground/90"><li><strong className="text-foreground">Resources</strong> that wait in <strong className="text-foreground">queues</strong> when idle.</li><li><strong className="text-foreground">Work</strong> that consumes resource units for a duration.</li><li><strong className="text-foreground">Meetings</strong> when two or more resources must be present to start work.</li><li><strong className="text-foreground">Returns</strong> of each resource to its home idle pool so the cycle can repeat.</li><li>A <strong className="text-foreground">counter</strong> (or counters) that record completed production units.</li><li>Optional <strong className="text-foreground">functions</strong> that scale entities (GEN / CON) and optional <strong className="text-foreground">probabilistic branches</strong>.</li></ol>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">You never draw that by hand in the prompt. You state resource cycles in text; the studio <strong className="text-foreground">builds</strong> the network:</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90"><strong className="text-foreground">story in Format Prompt → Draw Model → inspect diagram → fix story → Simulate.</strong></p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">4.2 Node shapes on screen</h3>
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-border shadow-sm">
            <table className="w-full min-w-[520px] text-left text-[12px] leading-relaxed text-foreground/90">
              <thead className="border-b border-border bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-2.5 py-2 font-medium">Element</th><th className="px-2.5 py-2 font-medium">Shape in Neo-CYCLONE</th><th className="px-2.5 py-2 font-medium">Meaning</th></tr>
              </thead>
              <tbody className="bg-card/40">
                                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><strong className="text-foreground">QUEUE</strong></td><td className="px-2.5 py-2 align-top">Circle with a lower-right slash (reads like a <strong className="text-foreground">Q</strong>)</td><td className="px-2.5 py-2 align-top">Waiting / idle pool. <strong className="text-foreground">Home</strong> queues hold initial units (<code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">n = …</code>)</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><strong className="text-foreground">COMBI</strong></td><td className="px-2.5 py-2 align-top">Square with <strong className="text-foreground">top-left corner cut</strong></td><td className="px-2.5 py-2 align-top">Work that needs <strong className="text-foreground">≥2 resources</strong> meeting</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><strong className="text-foreground">NORMAL</strong></td><td className="px-2.5 py-2 align-top">Plain rectangle</td><td className="px-2.5 py-2 align-top">Work that needs <strong className="text-foreground">one</strong> resource unit stream</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><strong className="text-foreground">COUNTER</strong></td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Golf flag</strong> (pole + triangle flag)</td><td className="px-2.5 py-2 align-top">Production count (+units when the flag is passed)</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><strong className="text-foreground">GEN</strong></td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Inverted triangle</strong> (point down)</td><td className="px-2.5 py-2 align-top">On arrival, create <strong className="text-foreground">k</strong> units (scale up)</td></tr>
                <tr><td className="px-2.5 py-2 align-top"><strong className="text-foreground">CON</strong></td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Upright triangle</strong> (point up)</td><td className="px-2.5 py-2 align-top">Gather <strong className="text-foreground">n</strong> units, release 1 (scale down)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Labels under shapes typically show initial <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">n</code>, duration text, <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">GEN k</code>, <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">CON n</code>, or <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">+production</code>.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">4.3 Arrows — direction always matters</h3>
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-border shadow-sm">
            <table className="w-full min-w-[520px] text-left text-[12px] leading-relaxed text-foreground/90">
              <thead className="border-b border-border bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-2.5 py-2 font-medium">Style</th><th className="px-2.5 py-2 font-medium">Appearance</th><th className="px-2.5 py-2 font-medium">Meaning</th></tr>
              </thead>
              <tbody className="bg-card/40">
                                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Forward</strong></td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Solid black</strong> line + black arrowhead</td><td className="px-2.5 py-2 align-top">Work progresses (including into staging queues before a COMBI)</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Return</strong></td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Dashed gold</strong> line + gold arrowhead (often curved)</td><td className="px-2.5 py-2 align-top">Resource closes its cycle into a <strong className="text-foreground">home</strong> QUEUE only</td></tr>
                <tr><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Branch</strong></td><td className="px-2.5 py-2 align-top">Forward style, often with <strong className="text-foreground"><code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">p=…</code></strong></td><td className="px-2.5 py-2 align-top">Probabilistic choice among outs</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">When you read a diagram: follow <strong className="text-foreground">black</strong> to see how production moves; follow <strong className="text-foreground">gold dashed</strong> to see how each resource <strong className="text-foreground">goes home</strong> to wait again. If gold dashed points at something that is not an idle home pool, the model is suspicious—re-draw after fixing the prompt.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">4.4 COMBI versus NORMAL</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Ask one question: <em>Do two or more distinct resources have to be present for this task to start?</em></p>
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-border shadow-sm">
            <table className="w-full min-w-[520px] text-left text-[12px] leading-relaxed text-foreground/90">
              <thead className="border-b border-border bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-2.5 py-2 font-medium">Situation</th><th className="px-2.5 py-2 font-medium">Node</th></tr>
              </thead>
              <tbody className="bg-card/40">
                                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Truck <strong className="text-foreground">and</strong> loader both needed at Load</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">COMBI</strong></td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Truck alone hauls or returns</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">NORMAL</strong></td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Crane lift that also needs a crew at the hook</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">COMBI</strong></td></tr>
                <tr><td className="px-2.5 py-2 align-top">Crew works alone after material is placed</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">NORMAL</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">If the diagram shows COMBI for a solo task, your prompt probably listed two resources on the same step by accident—or the reverse if a true meeting was written as a single-resource line.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">4.5 A resource cycle as a mental picture</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">For a truck in earthmoving, the diagram encodes roughly:</p>
          <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[13px] leading-relaxed text-foreground/90"><li>Sit in <strong className="text-foreground">Trucks Idle</strong> (QUEUE, <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">n = 5</code>).</li><li>Enter <strong className="text-foreground">Load</strong> (COMBI) with a loader unit.</li><li><strong className="text-foreground">Haul → Dump → Return</strong> (NORMAL steps).</li><li>Pass <strong className="text-foreground">COUNTER</strong> after Dump when production is counted.</li><li><strong className="text-foreground">Gold dashed</strong> arc back to <strong className="text-foreground">Trucks Idle</strong>.</li></ol>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">The loader has a shorter cycle: idle → Load (COMBI) → gold return home. Once you can tell that story out loud while pointing at the screen, you understand the model.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">4.6 Same spirit as CYCLONE — different surface</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Neo-CYCLONE is <strong className="text-foreground">loyal to Halpin’s logic</strong>, not always to the <strong className="text-foreground">exact ink</strong> of every textbook figure. Users who open Halpin & Riggs (or MicroCYCLONE printouts) side by side with the studio will notice differences. That is intentional for <strong className="text-foreground">screen teaching</strong>.</p>
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-border shadow-sm">
            <table className="w-full min-w-[520px] text-left text-[12px] leading-relaxed text-foreground/90">
              <thead className="border-b border-border bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-2.5 py-2 font-medium">Topic</th><th className="px-2.5 py-2 font-medium">Classic CYCLONE / MicroCYCLONE (typical print)</th><th className="px-2.5 py-2 font-medium">Neo-CYCLONE (this studio)</th></tr>
              </thead>
              <tbody className="bg-card/40">
                                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Purpose</td><td className="px-2.5 py-2 align-top">Methodology + desktop / research tools</td><td className="px-2.5 py-2 align-top">Browser <strong className="text-foreground">teaching</strong> studio + AI co-pilot</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">How you build</td><td className="px-2.5 py-2 align-top">Often node/link editors, cards, or input files</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Format Prompt</strong> (resource cycles) → auto layout</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">QUEUE look</td><td className="px-2.5 py-2 align-top">Circle (sometimes plain)</td><td className="px-2.5 py-2 align-top">Circle with <strong className="text-foreground">Q-like slash</strong></td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">COMBI look</td><td className="px-2.5 py-2 align-top">Square / constrained conventions vary by book era</td><td className="px-2.5 py-2 align-top">Square with <strong className="text-foreground">top-left cut</strong></td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">COUNTER look</td><td className="px-2.5 py-2 align-top">Flag-like or marked node in teaching materials</td><td className="px-2.5 py-2 align-top">Explicit <strong className="text-foreground">golf-flag</strong> icon</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">GEN / CON</td><td className="px-2.5 py-2 align-top">Function nodes in full systems</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">▽ GEN</strong> / <strong className="text-foreground">△ CON</strong>; prefer <strong className="text-foreground">inline</strong> in the prompt</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Arrows</td><td className="px-2.5 py-2 align-top">Usually black linework; returns not always color-coded</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Black solid = forward</strong>, <strong className="text-foreground">gold dashed = return home</strong></td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Layout</td><td className="px-2.5 py-2 align-top">Author-drawn publication figures</td><td className="px-2.5 py-2 align-top">Automatic teaching grid</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">AI</td><td className="px-2.5 py-2 align-top">None historically</td><td className="px-2.5 py-2 align-top">Context-bound Assistant (<strong className="text-foreground">Apply</strong> required)</td></tr>
                <tr><td className="px-2.5 py-2 align-top">If figures disagree</td><td className="px-2.5 py-2 align-top">Printed book / original software</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">This app’s legend + engine</strong> (<code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">NOTATION_STANDARD.md</code>)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90"><strong className="text-foreground">What must stay the same for the model to still “be CYCLONE”:</strong> resources wait in queues; work takes time and holds units; meetings need all required resources; cycles close so production can repeat; counters define the production unit.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90"><strong className="text-foreground">What may look different on purpose:</strong> colors and dashes on return arcs; exact corner cuts and flag art; automatic layout; prompt-first authoring.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">If you write a paper, say you used <strong className="text-foreground">Neo-CYCLONE’s teaching notation</strong> inspired by Halpin CYCLONE—not that a screenshot is a facsimile of Figure X in the 1992 book.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">4.7 Checklist before you Simulate</h3>
          <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[13px] leading-relaxed text-foreground/90"><li>Every resource has a visible <strong className="text-foreground">home QUEUE</strong>.</li><li>True meetings are <strong className="text-foreground">COMBI</strong>; solo work is <strong className="text-foreground">NORMAL</strong>.</li><li><strong className="text-foreground">Counter after:</strong> names match real tasks.</li><li>Gold dashed returns only into home idles.</li><li>GEN/CON only if unit logic needs them.</li><li>Branch probabilities look like a real split of the world.</li><li><code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">Operation:</code> is set if you care about Excel and report names.</li></ol>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Full geometric rules live in <a className="text-primary hover:underline" href="./NOTATION_STANDARD.md" target="_blank" rel="noreferrer"><code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">docs/NOTATION_STANDARD.md</code></a>.</p>
        </section>

        <section className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Chapter 5 — Simulation results</h2>
          <div className="gold-rule my-4 max-w-xs" />
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">After <strong className="text-foreground">Simulate</strong>, the Results area is for process literacy—not only a green checkmark. Walk the panels in the order below the first few times; later you will jump to the question you care about.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">5.1 Process Report</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">This is the MicroCYCLONE-flavored summary: how long the run lasted, how many production events occurred, units per event, total production, when the first unit appeared, and the average time between units. Use it to answer, in plain language: <em>Did we produce what we thought, at what overall pace?</em></p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">5.2 Productivity by cycle and steady state</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">The units-per-hour chart starts at cycle <strong className="text-foreground">0</strong>. Early cycles are often noisy—the system is “filling.” <strong className="text-foreground">Steady state</strong> in Neo-CYCLONE is a practical teaching rule, not a theorem: productivity stays within about <strong className="text-foreground">5%</strong> across a window of at least <strong className="text-foreground">10</strong> cycles. The guide appears as an <strong className="text-foreground">old-gold dashed</strong> line with a readable value so a class can say, “We would quote about <em>this</em> productivity,” not the wild first spike.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">5.3 Idleness and busy time</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">For each resource, idle % and busy % are both labeled so a tiny idle bar still has a story (busy may sit near 100%). High idle on a costly resource is a design smell. High idle on a cheap buffer may be intentional. If you only remember one chart from the studio, remember this pair.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">5.4 Cost Report</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">When you supply hourly rates:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[13px] leading-relaxed text-foreground/90"><li>cost per resource ≈ count × (USD/h) × run hours  </li><li><strong className="text-foreground">unit cost</strong> ≈ total cost ÷ production  </li></ul>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Unit cost is often the decision metric students remember—especially next to sensitivity charts. No <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">Cost:</code> block means no cost report; that is expected, not a bug.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">5.5 Sensitivity Analysis</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">When the prompt defines <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">Sensitivity:</code>, the Sensitivity tab compares combinations (for example trucks versus loaders): productivity and unit cost side by side, best markers, and idleness views. Pairwise comparison supports more than two resources within teaching caps. Detail tables can be hidden so the story stays visual.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Sensitivity batches prefer a <strong className="text-foreground">Web Worker</strong> so the interface stays responsive; if Workers fail, the same engine runs on the main thread (same numbers, possible brief pause). Single <strong className="text-foreground">Simulate</strong> stays on the main thread—it is fast enough for classroom sizes.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">5.6 Export and a one-minute discussion</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Export Excel and PNG when you need figures for slides or homework. Always note Operation name, seed, max cycles, and any sensitivity ranges.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">In one minute of class discussion:</p>
          <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[13px] leading-relaxed text-foreground/90"><li>What is steady-state <strong className="text-foreground">units/hour</strong>?</li><li>Which resource has the highest <strong className="text-foreground">idle %</strong>?</li><li>What is <strong className="text-foreground">unit cost</strong> (if costs were entered)?</li><li>If we add one unit of the scarce resource, what do we <em>expect</em>—then test with Sensitivity or a re-run.</li></ol>
        </section>

        <section className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Chapter 6 — Six Examples as a learning path</h2>
          <div className="gold-rule my-4 max-w-xs" />
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Selecting an Example only fills the prompt. <strong className="text-foreground">You</strong> click Draw Model. Keep Chapter 4 open in your mind while you look at each diagram.</p>
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-border shadow-sm">
            <table className="w-full min-w-[520px] text-left text-[12px] leading-relaxed text-foreground/90">
              <thead className="border-b border-border bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-2.5 py-2 font-medium">#</th><th className="px-2.5 py-2 font-medium">Name</th><th className="px-2.5 py-2 font-medium">What you should notice</th></tr>
              </thead>
              <tbody className="bg-card/40">
                                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">1</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Earthmoving</strong></td><td className="px-2.5 py-2 align-top">Classic two-resource cycle; cost; steady state. No branch, no SA—learn the spine first.</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">2</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Asphalt Paving</strong></td><td className="px-2.5 py-2 align-top">Meeting at dump-to-paver; <strong className="text-foreground">branch</strong> breakdown then refill; count after pave.</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">3</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Loading Dump Truck</strong></td><td className="px-2.5 py-2 align-top">Inline <strong className="text-foreground">GEN/CON</strong>: excavator scoops fill a truck before haul-return.</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">4</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Tower Crane</strong></td><td className="px-2.5 py-2 align-top">Multi-demand `</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">5</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Masonry</strong></td><td className="px-2.5 py-2 align-top">Face stocks; helper multi-demand; <strong className="text-foreground">sensitivity</strong> introduction.</td></tr>
                <tr><td className="px-2.5 py-2 align-top">6</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Precast Plant</strong></td><td className="px-2.5 py-2 align-top">Longer line production; richer SA—systems thinking.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90"><strong className="text-foreground">Suggested path:</strong> 1 → 2 → 3 for mechanics; 4 for shared resources; 5–6 for decisions under sensitivity. Rewrite any example. Change counts. Break a duration. Re-draw. That is the point.</p>
        </section>

        <section className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Chapter 7 — What “AI-assisted” should mean here</h2>
          <div className="gold-rule my-4 max-w-xs" />
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">The Assistant sits under Results. It should feel like a teaching assistant who has read your board—not like a search engine that invents another project.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">7.1 Purpose and honest technology</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">The Assistant should:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[13px] leading-relaxed text-foreground/90"><li>Explain <em>this</em> model’s cycles, COMBI versus NORMAL, counter, GEN/CON, and branch.</li><li>Point at bottleneck and idleness from the <em>last run</em>.</li><li>Propose a full Format Prompt edit when you ask to change fleet or durations.</li><li>Stay short (about ≤20 lines) so the studio remains the focus.</li></ul>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">It must <strong className="text-foreground">not</strong> silently re-simulate, invent another operation, or replace CYCLONE with a mystery model.</p>
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-border shadow-sm">
            <table className="w-full min-w-[520px] text-left text-[12px] leading-relaxed text-foreground/90">
              <thead className="border-b border-border bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-2.5 py-2 font-medium">Mode</th><th className="px-2.5 py-2 font-medium">When</th><th className="px-2.5 py-2 font-medium">Behavior</th></tr>
              </thead>
              <tbody className="bg-card/40">
                                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top"><strong className="text-foreground">AI mode</strong></td><td className="px-2.5 py-2 align-top">Host has <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">XAI_API_KEY</code> (for example on Vercel)</td><td className="px-2.5 py-2 align-top">Chat model sees a <strong className="text-foreground">compact CONTEXT</strong> snapshot only</td></tr>
                <tr><td className="px-2.5 py-2 align-top"><strong className="text-foreground">Local mode</strong></td><td className="px-2.5 py-2 align-top">No key or API failure</td><td className="px-2.5 py-2 align-top">English-first intent helper for common studio questions</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Product UI, Manual, and keywords are English-first for an international classroom. Rate limits on the shared host (about <strong className="text-foreground">30</strong> Assistant requests per hour per IP) protect classroom use from abuse; normal class pace is fine.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">7.2 How the chat behaves</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[13px] leading-relaxed text-foreground/90"><li><strong className="text-foreground">You</strong> — gold bubble, right-aligned, compact (WhatsApp-style).</li><li><strong className="text-foreground">Assistant</strong> — light bubble, left-aligned.</li><li>System guidance lives in the <strong className="text-foreground">placeholder</strong> of the input box, not as a permanent chat bubble.</li><li>Quick chips are <strong className="text-foreground">general</strong> (no truck-only assumptions): resources, bottleneck, productivity, unit cost.</li></ul>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">7.3 Boundary, workflow, and better questions</h3>
          <blockquote className="mt-4 rounded-[var(--radius-md)] border border-primary/30 bg-primary/5 px-4 py-3 text-[14px] leading-relaxed text-foreground">The AI Assistant answers only about the <strong className="text-foreground">current</strong> Format Prompt, drawn CYCLONE network, and <strong className="text-foreground">last</strong> simulation or sensitivity results. It may <strong className="text-foreground">propose</strong> Format Prompt edits; you must <strong className="text-foreground">Apply</strong>, <strong className="text-foreground">Draw Model</strong>, and <strong className="text-foreground">Simulate</strong> for changes to take effect.</blockquote>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Workflow: build and simulate a model you understand → ask focused questions → if a new prompt is proposed, Apply → Draw → Simulate → compare numbers. Do not accept a quantitative claim without a run.</p>
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-border shadow-sm">
            <table className="w-full min-w-[520px] text-left text-[12px] leading-relaxed text-foreground/90">
              <thead className="border-b border-border bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-2.5 py-2 font-medium">Weaker</th><th className="px-2.5 py-2 font-medium">Stronger</th></tr>
              </thead>
              <tbody className="bg-card/40">
                                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">“Make it better.”</td><td className="px-2.5 py-2 align-top">“Which resource has the highest idle % after this run?”</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">“Optimize everything.”</td><td className="px-2.5 py-2 align-top">“Propose trucks = 8; keep loader = 1; I will re-simulate.”</td></tr>
                <tr><td className="px-2.5 py-2 align-top">“What is CYCLONE?” with an empty model</td><td className="px-2.5 py-2 align-top">Draw Example 1 first, then “Explain this model’s resource cycles.”</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Chapter 8 — Limits, deploy, and integrity</h2>
          <div className="gold-rule my-4 max-w-xs" />
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Teaching studios need guardrails so a shared host stays fair and numbers stay interpretable.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">8.1 Simulation and sensitivity caps</h3>
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-border shadow-sm">
            <table className="w-full min-w-[520px] text-left text-[12px] leading-relaxed text-foreground/90">
              <thead className="border-b border-border bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-2.5 py-2 font-medium">Parameter</th><th className="px-2.5 py-2 font-medium">Default</th><th className="px-2.5 py-2 font-medium">Hard limit</th><th className="px-2.5 py-2 font-medium">Notes</th></tr>
              </thead>
              <tbody className="bg-card/40">
                                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Max cycles</td><td className="px-2.5 py-2 align-top">100</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">500</strong></td><td className="px-2.5 py-2 align-top">Teaching cap; the UI clamps higher values</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Seed</td><td className="px-2.5 py-2 align-top">12345</td><td className="px-2.5 py-2 align-top">—</td><td className="px-2.5 py-2 align-top">Reproducibility; dice for alternate paths</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Time unit</td><td className="px-2.5 py-2 align-top">minutes</td><td className="px-2.5 py-2 align-top">—</td><td className="px-2.5 py-2 align-top">Stated in the Format Prompt header</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">SA resources</td><td className="px-2.5 py-2 align-top">—</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">5</strong></td><td className="px-2.5 py-2 align-top">Extra ranges ignored with a note</td></tr>
                <tr><td className="px-2.5 py-2 align-top">SA combinations</td><td className="px-2.5 py-2 align-top">—</td><td className="px-2.5 py-2 align-top"><strong className="text-foreground">~150</strong></td><td className="px-2.5 py-2 align-top">Step increases; not a silent mid-axis cut</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">8.2 Performance, AI, and deploy</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Sensitivity prefers a <strong className="text-foreground">Web Worker</strong>; fallback is the main thread with the same engine. Single Simulate runs on the main thread—appropriate for teaching sizes.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">AI limits: about 30 Assistant requests / hour / IP; about 20 AI DSL draft requests / hour / IP; compact CONTEXT only; replies short. Without an API key, the local English helper still works. These limits do <strong className="text-foreground">not</strong> change CYCLONE rules; they protect hosting and API cost.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Source of truth: <strong className="text-foreground">GitHub <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">main</code></strong> auto-deploys to <strong className="text-foreground">Vercel</strong> at <a className="text-primary hover:underline" href="https://neo-cyclone.vercel.app/" target="_blank" rel="noreferrer">neo-cyclone.vercel.app</a>. Teaching does not require sign-in. Always cite the footer <strong className="text-foreground">version</strong> after a deploy.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">The footer can show how many times <strong className="text-foreground">Draw Model</strong> and <strong className="text-foreground">Simulate</strong> have been used. Counts are anonymous (no prompt text). Worldwide totals are stored in a durable counter (or your own Neon database if configured). You also see counts for <em>this device</em>.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">8.3 Citing Neo-CYCLONE in homework or papers</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Include:</p>
          <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[13px] leading-relaxed text-foreground/90"><li>Product name and version (footer).</li><li>URL of the live app.</li><li>Operation name, seed, and max cycles.</li><li>Whether results came from Simulation only or also Sensitivity.</li><li>Optional: software DOI if your course requires a formal software citation.</li></ol>
        </section>

        <section className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Chapter 9 — FAQ from real studio use</h2>
          <div className="gold-rule my-4 max-w-xs" />
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">Drawing and the model diagram</h3>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: I selected an Example but nothing drew.</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: Click <strong className="text-foreground">Draw Model</strong>. Examples only paste the prompt.</p>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: Why does the diagram not match the book figure exactly?</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: Same CYCLONE <em>logic</em>; Neo-CYCLONE teaching <em>notation</em> (Chapter 4). Black and gold arrows and some shapes are intentional—not a bug.</p>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: What do gold dashed arrows mean?</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: Resource <strong className="text-foreground">return</strong> to a <strong className="text-foreground">home QUEUE</strong>. Solid black means forward work (including into staging before a COMBI).</p>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: COMBI versus NORMAL looks wrong.</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: COMBI only when <strong className="text-foreground">two or more resources</strong> must meet to start the task. Solo work → NORMAL.</p>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: Where is the production counter?</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: Golf-flag node. Set with <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">Counter after: TaskName</code>. Multiple flags are allowed.</p>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: GEN and CON look like random triangles.</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: ▽ GEN multiplies units on arrival; △ CON gathers <em>n</em> → 1. Prefer inline form on the cycle. Not required in every model.</p>
          </div>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">Simulation and results</h3>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: Why is Simulate not useful yet?</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: Draw a model you trust first. Numbers without a truthful diagram are noise.</p>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: My classmate got different productivity.</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: Compare <strong className="text-foreground">seed</strong>, <strong className="text-foreground">max cycles</strong>, and whether the Format Prompt is identical—including durations and branches.</p>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: What is the steady-state line?</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: Teaching guide: productivity within about <strong className="text-foreground">5%</strong> over at least <strong className="text-foreground">10</strong> cycles—old-gold dashed on the units/hour chart. Quote that band, not the first spike.</p>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: Sensitivity tab is empty.</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: Add a <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">Sensitivity:</code> block (Examples 5–6). Without ranges there is nothing to sweep.</p>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: Where is cost?</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: Only if the prompt has <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">Cost:</code> rates (USD per resource-hour). Then the Cost Report shows totals and <strong className="text-foreground">unit cost</strong>.</p>
          </div>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">Prompt, language, AI, and access</h3>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: Excel file name looks ugly.</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: Add <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">Operation: ShortName</code> after <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">#</code> notes, before resource cycles.</p>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: Can I write the prompt in Indonesian?</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">#</code> notes may be any language. Keep <strong className="text-foreground">network keywords</strong>, task names used in counters, and distribution keywords in <strong className="text-foreground">English</strong> for reliable parsing.</p>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: The AI proposed a prompt but numbers did not change.</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: Click <strong className="text-foreground">Apply</strong>, then <strong className="text-foreground">Draw Model</strong>, then <strong className="text-foreground">Simulate</strong>. Nothing silent updates the engine.</p>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: Is sign-in required?</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: No for teaching use.</p>
          </div>
          <div className="mt-4 rounded-[var(--radius-md)] border border-border/80 bg-card/50 px-3 py-2.5">
            <p className="text-[13px] font-semibold text-foreground"><strong className="text-foreground">Q: Where is the bibliography?</strong>  </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">A: <strong className="text-foreground">References</strong> at the <strong className="text-foreground">end</strong> of this manual, after the Epilogue.</p>
          </div>
        </section>

        <section className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Chapter 10 — Notes for instructors and peer mentors</h2>
          <div className="gold-rule my-4 max-w-xs" />
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">With many concurrent learners, small conventions prevent chaos.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">10.1 Baseline and exercise patterns</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Agree once for the whole class:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[13px] leading-relaxed text-foreground/90"><li>Example <strong className="text-foreground">1. Earthmoving</strong> (or a course-specific prompt),</li><li>Seed <strong className="text-foreground">12345</strong>,</li><li>Max cycles <strong className="text-foreground">100</strong> (or 200 if you prefer longer settling).</li></ul>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Everyone’s first Process Report should match. Then change <strong className="text-foreground">one</strong> thing per exercise.</p>
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-border shadow-sm">
            <table className="w-full min-w-[520px] text-left text-[12px] leading-relaxed text-foreground/90">
              <thead className="border-b border-border bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-2.5 py-2 font-medium">Pattern</th><th className="px-2.5 py-2 font-medium">Ask students</th><th className="px-2.5 py-2 font-medium">What they submit</th></tr>
              </thead>
              <tbody className="bg-card/40">
                                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">See waste</td><td className="px-2.5 py-2 align-top">Run baseline; screenshot idleness</td><td className="px-2.5 py-2 align-top">Which resource waits? Why?</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Read the diagram</td><td className="px-2.5 py-2 align-top">Label QUEUE / COMBI / NORMAL / COUNTER / gold return</td><td className="px-2.5 py-2 align-top">Screenshot + five labels</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Fleet change</td><td className="px-2.5 py-2 align-top">Apply trucks 3 vs 8; same seed</td><td className="px-2.5 py-2 align-top">Unit cost + productivity table</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Branch</td><td className="px-2.5 py-2 align-top">Example 2</td><td className="px-2.5 py-2 align-top">Effect of the breakdown path</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Shared resource</td><td className="px-2.5 py-2 align-top">Example 4; swap priorities</td><td className="px-2.5 py-2 align-top">Who starves?</td></tr>
                <tr><td className="px-2.5 py-2 align-top">Sensitivity</td><td className="px-2.5 py-2 align-top">Examples 5–6</td><td className="px-2.5 py-2 align-top">Best unit-cost combo + a caution</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">10.2 AI policy and a light rubric</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Allow the Assistant for <strong className="text-foreground">explanation</strong> and <strong className="text-foreground">prompt drafts</strong>. Require <strong className="text-foreground">Apply → Draw → Simulate</strong> before any graded claim. Remind labs that a shared NAT may share one IP against rate limits.</p>
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-border shadow-sm">
            <table className="w-full min-w-[520px] text-left text-[12px] leading-relaxed text-foreground/90">
              <thead className="border-b border-border bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-2.5 py-2 font-medium">Criterion</th><th className="px-2.5 py-2 font-medium">Strong looks like</th></tr>
              </thead>
              <tbody className="bg-card/40">
                                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Model truth</td><td className="px-2.5 py-2 align-top">Diagram matches the narrative (Chapter 4 checklist)</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Waste literacy</td><td className="px-2.5 py-2 align-top">Idle/busy and bottleneck—not only total production</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Reproducibility</td><td className="px-2.5 py-2 align-top">Seed, cycles, and version cited</td></tr>
                <tr className="border-b border-border/70"><td className="px-2.5 py-2 align-top">Decision</td><td className="px-2.5 py-2 align-top">Unit cost or SA-informed recommendation</td></tr>
                <tr><td className="px-2.5 py-2 align-top">Integrity</td><td className="px-2.5 py-2 align-top">Engine results primary; AI optional</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">No install is required: a modern browser and the Manual in the header are enough. After a deploy, hard refresh if styles look missing.</p>
        </section>

        <section className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Epilogue</h2>
          <div className="gold-rule my-4 max-w-xs" />
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">When the diagram is clean and the numbers are stable, you have done what Halpin asked of a generation of students: <strong className="text-foreground">see the operation</strong>. AI can speed the typing; it cannot replace that seeing.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Keep one run with seed <strong className="text-foreground">12345</strong> as a shared baseline. Change one idea at a time—fleet, duration, branch, or priority—and ask what happened to <strong className="text-foreground">idleness</strong> and <strong className="text-foreground">unit cost</strong>. That discipline matters more than any single feature.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">If the on-screen model looks slightly different from a photocopy of a 1992 figure, return to Chapter 4: honor the <strong className="text-foreground">logic</strong>, learn this studio’s <strong className="text-foreground">legend</strong>, then run the engine.</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Thank you for using Neo-CYCLONE with care.</p>
        </section>

        <section className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">References</h2>
          <div className="gold-rule my-4 max-w-xs" />
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Selected literature on <strong className="text-foreground">CYCLONE</strong>, <strong className="text-foreground">MicroCYCLONE</strong>, and applications by <strong className="text-foreground">Daniel W. Halpin</strong>, students, and collaborators. Placed <strong className="text-foreground">last</strong> so teaching chapters stay in front.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">Foundations</h3>
          <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[13px] leading-relaxed text-foreground/90"><li><strong className="text-foreground">Halpin, D. W.</strong> (1973). Ph.D. dissertation, University of Illinois at Urbana–Champaign.</li><li><strong className="text-foreground">Halpin, D. W.</strong> (1977). “CYCLONE: Method for Modeling of Job Site Processes.” <em>Journal of the Construction Division</em>, ASCE, 103(3), 489–499.</li><li><strong className="text-foreground">Halpin, D. W., & Riggs, L. S.</strong> (1992). <em>Planning and Analysis of Construction Operations</em>. Wiley.</li></ol>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">MicroCYCLONE</h3>
          <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[13px] leading-relaxed text-foreground/90"><li><strong className="text-foreground">Lluch, J., & Halpin, D. W.</strong> (1982). <em>Journal of the Construction Division</em>, ASCE, 108(1), 129–145.</li><li><strong className="text-foreground">Halpin, D. W.</strong> (1990–1992). MicroCYCLONE user and system manuals (Purdue / Learning Systems).</li></ol>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">DISCO</h3>
          <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[13px] leading-relaxed text-foreground/90"><li><strong className="text-foreground">Huang, R.-Y., & Halpin, D. W.</strong> (1993–1995). DISCO-related papers (ISARC; <em>Microcomputers in Civil Engineering</em>; <em>Journal of Construction Engineering and Management</em>).</li><li><strong className="text-foreground">Huang, R.-Y.</strong> (1994). Ph.D., Purdue University (advisor: Halpin).</li></ol>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">PROSIDYC · COST · WebCYCLONE</h3>
          <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[13px] leading-relaxed text-foreground/90"><li><strong className="text-foreground">Halpin, D. W., & Martinez, L.-H.</strong> (1999). PROSIDYC. <em>Winter Simulation Conference</em>.</li><li><strong className="text-foreground">Cheng, T.-M., et al.</strong> (2000). COST. <em>17th ISARC</em>.</li><li><strong className="text-foreground">Halpin, D. W., Jen, H., & Kim, J.</strong> (2003). WebCYCLONE. <em>Winter Simulation Conference</em>.</li></ol>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">Related lineage</h3>
          <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[13px] leading-relaxed text-foreground/90"><li>Work in the Halpin circle and peers: AbouRizk & Halpin; Hijazi; Lutz; Gonzalez-Quevedo; Abraham; project-level CYCLONE studies; AbouRizk et al. (2011) and related synthesis.</li><li>Related systems students may meet later: <strong className="text-foreground">UM-CYCLONE</strong> (Ioannou), <strong className="text-foreground">STROBOSCOPE</strong> (Martinez), <strong className="text-foreground">Simphony / Simphony.NET</strong> (AbouRizk et al.).</li></ol>
          <h3 className="font-display mt-8 text-lg font-semibold text-foreground">How Neo-CYCLONE relates</h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/90">Neo-CYCLONE does <strong className="text-foreground">not</strong> claim to supersede research simulators. It is <strong className="text-foreground">AI-Assisted Construction Operation Simulation</strong>—a studio for first principles: flow, idleness, cyclic networks, transparent discrete-event logic, and responsible AI beside that engine. Diagram notation follows this product’s standard (Chapter 4; <code className="rounded bg-muted px-1 py-0.5 text-[12px] text-foreground">NOTATION_STANDARD.md</code>) while remaining in Halpin’s tradition.</p>
        </section>

        <footer className="border-t border-border pt-8 pb-4 text-center text-[12px] text-muted-foreground">
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
