# Neo-CYCLONE — User Manual

| | |
|--|--|
| **Version** | 1.6.14 |
| **Product** | AI-Assisted Construction Operation Simulation |
| **Dedication** | AI-agent of Daniel W. Halpin's CYCLONE |
| **Language** | English (product & teaching surface) |
| **Live app** | [https://neo-cyclone.vercel.app/](https://neo-cyclone.vercel.app/) |
| **Audience** | Students · instructors · practitioners |
| **Notation detail** | [NOTATION_STANDARD.md](./NOTATION_STANDARD.md) |
| **Engine notes (developers)** | [NEO_CYCLONE_DSL_v0.1.md](./NEO_CYCLONE_DSL_v0.1.md) |

This manual is for people who want to *understand* construction operations as **flow**—not only to click buttons. You can:

- **3 minutes:** [Start here](#start-here--3-minutes)  
- **15 minutes:** [Chapter 2](#chapter-2--fifteen-minutes-that-stick-earthmoving) with Example 1 open  
- **Diagram literacy:** [Chapter 4](#chapter-4--reading-the-model-how-neocyclone-draws-cyclone) (shapes, arrows, vs classic CYCLONE)  
- **Full read:** ~35–50 minutes top to bottom  

**References** are at the **end** of this manual. Keep the [live studio](https://neo-cyclone.vercel.app/) open when you practice.

---

## Start here — 3 minutes

If you only do one thing today:

1. Open [neo-cyclone.vercel.app](https://neo-cyclone.vercel.app/).  
2. **Example** → **1. Earthmoving**.  
3. Click **Draw Model** (the diagram does **not** appear until you click).  
4. Leave **max cycles = 100**, **seed = 12345**.  
5. Click **Simulate**.  
6. Look at **units/hour by cycle** and **resource idleness** (who waits? who works?).  

That is the whole loop: **prompt → draw → simulate → read waste and productivity**. Everything else deepens that loop.

### If something feels “broken”

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Empty diagram after choosing Example | Examples only fill the prompt | Click **Draw Model** |
| Simulate disabled / no results | No network drawn yet | Draw Model first |
| Excel name looks like resource spaghetti | No `Operation:` line | Add `Operation: MyName` after `#` notes |
| No Sensitivity tab charts | Prompt has no `Sensitivity:` block | Add ranges (Examples 5–6) or skip SA |
| AI answers only in English / short | Product policy | English-first; replies ≤20 lines; edit only after **Apply** |
| Different numbers than a classmate | Different seed or cycles | Use seed **12345** and same max cycles |
| Page looks unstyled | Browser cache after deploy | Hard refresh or incognito |

### Map of this manual

| Section | Chapters | When to read |
|------|----------|--------------|
| Ideas | Ch. 1 | Before inventing your own model |
| First run | 2 | Always, once |
| Prompt language | 3 | When writing your own operation |
| **Diagram & modeling** | **4** | **When you look at the CYCLONE Model panel** |
| Results literacy | 5 | After first Simulate — **Simulation results** |
| Curriculum | 6 | Course design / self-study path |
| AI Assistant | 7 | When you use the co-pilot |
| Limits & deploy | 8 | Homework rules, citations |
| FAQ | 9 | Stuck mid-studio |
| Classroom | 10 | Teaching with many students |
| Closing | Epilogue | Habit to keep |
| **Bibliography** | **References** | **Always last** — papers & lineage |

---

# Prologue — Why this studio exists

Construction work is full of **repetition**: load and haul, pour and return, lift and place. Between those busy moments, resources wait. A truck queues at a loader. A crane sits while a crew finishes tying rebar. That waiting is not always “laziness”; it is often **the structure of the process**.

Professor **Daniel W. Halpin** spent a career making that structure *visible*. His **CYCLONE** language (*CYCLic Operations NEtwork*) gave operations a simple network grammar: resources cycle through queues and work, meet when they must, and count completed production. From that grammar grew tools—**MicroCYCLONE**, then DISCO, PROSIDYC, COST, WebCYCLONE, and a wider family of construction simulation systems (see **References** at the end).

**Neo-CYCLONE** is not a replacement for those research systems. It is a **teaching studio**: a place to meet Halpin’s ideas again, with a modern browser interface and an **AI Assistant** that stays tied to *your* model. The product name is deliberate: **AI-Assisted Construction Operation Simulation**.

AI here does not invent a new physics of construction. The **engine** is still a discrete-event CYCLONE-style simulator. AI helps you **phrase**, **inspect**, and **question** the model. You remain responsible for Draw Model, Simulate, and judgment.

If you leave this manual with one habit, let it be this: **draw the cycles until they tell the truth, then run the numbers**.

---

## Chapter 1 — Operations, flow, and idleness

### 1.1 What we mean by “construction operation”

An *operation* here is a **repeatable production process**—often measured in units per hour—not the whole project Gantt chart. Earthmoving a cut, paving a lane, loading dump trucks, serving three zones with one crane, stocking brick and mortar for masons, or cycling forms in a precast yard: each is an operation with **resources**, **tasks**, and **waiting**.

Thinking at the operation level matters for **Lean Construction** and **Project Production Management**. Before you optimize a schedule bar, you need to see whether the *process* itself produces flow or waste.

### 1.2 Flow and idleness (waste you can measure)

In CYCLONE thinking, a resource that is not working is usually **in a queue**—waiting for a partner, a space, or a task to open. That waiting time is **idleness**. It is not a moral failure; it is a signal:

- Too few trucks → loader idle  
- Too many trucks → truck queue grows  
- Shared crane, wrong priority → one zone starves  

Neo-CYCLONE reports **idle %** and **busy %** so those signals are hard to ignore. When you later hear “waste” in Lean language, you already have a picture for it.

### 1.3 Why a network language?

You could describe an operation in paragraphs of natural language. Networks force clarity:

- Which resources exist?  
- In what order do they work?  
- Where do they wait?  
- Where do two resources **meet** (e.g. truck + loader)?  
- What counts as **one unit of production**?  

CYCLONE answered those questions with a small set of node types. Neo-CYCLONE keeps that spirit in the **logic**, even when some **glyphs** and **arrow colors** are tuned for screen teaching (Chapter 4).

### 1.4 What Neo-CYCLONE is — and is not

| It is | It is not |
|-------|-----------|
| A browser teaching studio for cyclic construction operations | A full project controls ERP |
| Prompt → diagram → discrete-event simulation | A black-box “AI that simulates for you” without a model |
| MicroCYCLONE-style reports (process, elements, cost, sensitivity) | A pixel-perfect reprint of 1970s/1990s paper figures |
| English-first, classroom-friendly limits | An unlimited free chat API |

You do **not** need to sign in to learn. Teaching use stands alone.

### 1.5 The studio at a glance

| Area | What you do there |
|------|-------------------|
| **Left** | Choose Example or write Format Prompt → **Draw Model** |
| **Right** | Inspect **CYCLONE Model** diagram; set cycles & seed → **Simulate** |
| **Below** | **Results**: Simulation · Sensitivity Analysis |
| **Lower** | **AI Assistant** (optional co-pilot) |
| **Header** | Manual (this text) |
| **Footer** | Product name · version · year — cite the version in homework |

The right-hand diagram is not decoration. Chapter 4 teaches you how to **read** it.

---

## Chapter 2 — Fifteen minutes that stick (Earthmoving)

This chapter is a **guided first run**. Do it once with Example 1 even if you already “know trucks.”

### 2.1 Open the studio

Go to the live app. You should see:

- **Left:** prompt area, Example dropdown, **Draw Model**  
- **Right:** empty CYCLONE Model until you draw  
- **Below (later):** Results and AI Assistant  

### 2.2 Load Example 1 — Earthmoving

1. Open **Example** → choose **1. Earthmoving**.  
2. Read the prompt top to bottom. Notice the shape:

```text
# notes (ignored by the engine) …

Operation: Earthmoving

Trucks: Load → Haul → Dump → Return
Loader: Load
5 trucks, 1 loader

Counter after: Dump
production = 12 m3

Cost: …
Durations: …
```

**Plain language:** trucks cycle load → haul → dump → return. The loader only participates at **Load**—so Load is a **meeting** (COMBI). Production is counted after **Dump** (e.g. 12 m³). Costs are USD per resource-hour. Durations are in **minutes**.

3. Click **Draw Model** (selecting an example does **not** draw by itself).  
4. On the right, confirm (see Chapter 4 for shapes):

- Home **QUEUE** circles for trucks and loader (often with `n = …`)  
- **Load** as COMBI (square with top-left cut)  
- Haul, Dump, Return as NORMAL rectangles (truck alone)  
- **COUNTER** as a golf-flag after Dump  
- **Solid black** arrows forward; **dashed gold** arrows returning resources home  

If something looks wrong, fix the prompt and **Draw Model** again. Do not Simulate until the picture matches the story.

### 2.3 Run parameters

- **Max cycles** — default **100**, hard maximum **500**.  
- **Seed** — default **12345**. Same seed + same model + same cycle limit → **identical** stochastic results. **Dice** picks another seed on purpose.

Seed is for **reproducibility**, not a fleet decision variable.

### 2.4 Simulate and read the first results

Click **Simulate**. Open the **Simulation** tab.

1. **Process Report** — run length, cycles, production pace.  
2. **Units per hour by cycle** — does productivity settle? Steady-state guide (~5% over ≥10 cycles) as old-gold dashed line.  
3. **Resource idleness** — who waits? who works? Often the best classroom discussion.  
4. **Cost Report** (if rates exist) — unit cost bridges “how busy?” to “how expensive per unit?”

### 2.5 Export once

- **Report Excel** — name prefers `Operation: …`  
- **Chart PNG** / diagram PNG  

Record **seed**, **max cycles**, and **Operation** name in assignments.

### 2.6 Optional: AI Assistant

Try chips: resources · bottleneck · productivity · unit cost. Replies ≤20 lines. Proposed prompts need **Apply → Draw Model → Simulate**.

### 2.7 Quick path

Example or Format Prompt → **Draw Model** → check diagram (Ch.4) → cycles & seed → **Simulate** → Sensitivity (if planned) → AI Assistant (optional) → Export.

### 2.8 Common first-session mistakes

1. Expecting the diagram after only selecting an Example.  
2. Simulating before the diagram matches the story.  
3. Changing fleet size in chat without **Apply → Draw → Simulate**.  
4. Comparing results with another seed.  
5. Reading only total production and ignoring **idleness**.  
6. Assuming every rectangle is “the same as Halpin’s book figure” without checking Neo-CYCLONE’s legend (Chapter 4).

---

## Chapter 3 — How to talk so the studio can build a network

You do not draw QUEUE circles by hand in the prompt. You describe **resource cycles**. The builder creates queues, tasks, and arcs.

Lines with `#` or `//` are notes only. After notes, first data line may be `Operation: Name` (aliases Model / Title / Op) for title and Excel filename.

### 3.1 Network — resource cycles

```text
Trucks: Load → Haul → Dump → Return
Loader: Load
5 trucks, 1 loader
```

- One primary sequence per resource.  
- Supporting resources often share a meeting task.  
- Arrows: `→` · `->` · `-->` · `=>`.  
- **Multi-demand:** `Crane: LiftAtA | LiftAtB | LiftAtC`  
- **Priority** (lower number = higher priority): MicroCYCLONE tradition.

### 3.2 Production counter

```text
Counter after: Dump
production = 12 m3
```

Name the task(s) that mean “one production unit finished.” Multiple counters are allowed. Explicit is safer than relying on defaults.

### 3.3 Durations (minutes)

| Kind | Parameters | Typical use |
|------|------------|-------------|
| `const` | value | Deterministic demo |
| `unif` | min, max | Flat uncertainty |
| `tri` | min, mode, max | Common field estimate |
| `normal` | mean, sd | Symmetric scatter |
| `lognormal` | mean, sd | Skewed positive times |
| `beta` | min, max, α, β | Four-parameter beta |
| `pert` | a, m, b | Classic PERT-beta on [a,b] |
| `gamma` | shape, scale | Flexible positive skew |

### 3.4 Branch probability

```text
Branch:
After DumpToPaver: RefillAsphalt p=0.85, Breakdown p=0.15
```

### 3.5 GEN and CON

Prefer **inline** form:

```text
Trucks: GEN 5 → Scoop → CON 5 TruckFull → Haul&Return
```

Only when unit logic needs scaling—not every model.

### 3.6 Cost and sensitivity

```text
Cost:
Trucks: 85
Loader: 120

Sensitivity:
Trucks: 2..10
Loader: 1..2
```

USD per resource-hour. SA caps: ≤5 resources; ~150 combinations (ranges step up).

### 3.7 Recommended block order

**Operation → Network → Durations → Priority → Branch → Cost → Sensitivity (last).**

### 3.8 Minimal custom prompt

```text
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
```

If the diagram lies, the prompt is incomplete—not “the AI failed.”

---

## Chapter 4 — Reading the model: how Neo-CYCLONE draws CYCLONE

Users spend a lot of time staring at the **CYCLONE Model** panel. This chapter is the legend for that panel: **how we model**, **what each symbol means**, and **where we deliberately differ from textbook Halpin figures** while keeping the same *ideas*.

### 4.1 Modeling idea (same as Halpin)

Neo-CYCLONE still models a **cyclic construction operation** as:

1. **Resources** that wait in **queues** when idle.  
2. **Work** that consumes resource units for a duration.  
3. **Meetings** when two or more resources must be present to start work.  
4. **Returns** of each resource to its home idle pool so the cycle can repeat.  
5. A **counter** (or counters) that record completed production units.  
6. Optional **functions** that scale entities (GEN / CON) and optional **probabilistic branches**.  

You never draw that by hand in the prompt. You state **resource cycles** in text; the studio **builds** the network. That is the modeling workflow:

**story in Format Prompt → Draw Model → inspect diagram → fix story → Simulate.**

### 4.2 Node shapes (what you see on screen)

| Element | Shape in Neo-CYCLONE | Meaning |
|---------|----------------------|---------|
| **QUEUE** | Circle with a lower-right slash (reads like a **Q**) | Waiting / idle pool. **Home** queues hold initial units (`n = …`) |
| **COMBI** | Square with **top-left corner cut** | Work that needs **≥2 resources** meeting |
| **NORMAL** | Plain rectangle | Work that needs **one** resource unit stream |
| **COUNTER** | **Golf flag** (pole + triangle flag) | Production count (+units when the flag is passed) |
| **GEN** | **Inverted triangle** (point down) | On arrival, create **k** units (scale up) |
| **CON** | **Upright triangle** (point up) | Gather **n** units, release 1 (scale down) |

Labels under shapes typically show initial `n`, duration text, `GEN k`, `CON n`, or `+production`.

### 4.3 Arrows (direction always matters)

| Style | Appearance | Meaning |
|-------|------------|---------|
| **Forward** | **Solid black** line + black arrowhead | Work progresses (including into staging queues before a COMBI) |
| **Return** | **Dashed gold** line + gold arrowhead (often curved) | Resource closes its cycle into a **home** QUEUE only |
| **Branch** | Forward style, often with **`p=…`** | Probabilistic choice among outs |

**Rule of thumb when reading a diagram:**

- Follow **black** to see how production moves.  
- Follow **gold dashed** to see how each resource **goes home** to wait again.  
- If gold dashed points at something that is not an idle home pool, the model is suspicious—re-draw after fixing the prompt.

### 4.4 COMBI vs NORMAL (the question everyone asks)

Ask: *Do two or more distinct resources have to be present for this task to start?*

| Situation | Node |
|-----------|------|
| Truck **and** loader both needed at Load | **COMBI** |
| Truck alone hauls or returns | **NORMAL** |
| Crane lift that also needs a crew at the hook | **COMBI** |
| Crew works alone after material is placed | **NORMAL** |

### 4.5 How a resource cycle looks (mental picture)

For a truck in earthmoving, the diagram encodes roughly:

1. Sit in **Trucks Idle** (QUEUE, `n = 5`).  
2. Enter **Load** (COMBI) with a loader unit.  
3. **Haul → Dump → Return** (NORMAL steps).  
4. Pass **COUNTER** after Dump when production is counted.  
5. **Gold dashed** arc back to **Trucks Idle**.  

The loader has a shorter cycle: idle → Load (COMBI) → gold return home.

### 4.6 Same spirit as CYCLONE — different surface (important)

Neo-CYCLONE is **loyal to Halpin’s logic**, not always to the **exact ink** of every textbook figure. Users who open Halpin & Riggs (or MicroCYCLONE printouts) side by side with the studio will notice differences. That is intentional for **screen teaching**.

| Topic | Classic CYCLONE / MicroCYCLONE (typical print) | Neo-CYCLONE (this studio) |
|-------|-----------------------------------------------|---------------------------|
| **Purpose** | Methodology + desktop / research tools | Browser **teaching** studio + AI co-pilot |
| **How you build** | Often node/link editors, cards, or input files | **Format Prompt** (resource cycles) → auto layout |
| **QUEUE look** | Circle (sometimes plain) | Circle with **Q-like slash** |
| **COMBI look** | Square / constrained node conventions vary by book era | Square with **top-left cut** (clear “meeting” glyph) |
| **NORMAL look** | Rectangle | Rectangle |
| **COUNTER look** | Often a flag-like or marked node in teaching materials | Explicit **golf-flag** icon |
| **GEN / CON** | Function nodes (historically paired with queues / consolidate logic) | **▽ GEN** / **△ CON** triangles; prefer **inline** in the prompt |
| **Arrows** | Usually black linework; returns not always color-coded | **Black solid = forward**, **gold dashed = return home** |
| **Layout** | Author-drawn, publication layouts | Automatic grid: tasks ordered, queues beside cycles, counter near end |
| **Probability** | Branch logic in full systems | `Branch:` + `p=` on arcs |
| **Priority** | Often implied by numbering / system rules | Explicit `Priority:` block (lower = first) |
| **Time unit default** | Varies by study | **Minutes** in Format Prompt |
| **Cost** | MicroCYCLONE-style process costing in the lineage | Optional USD/h → unit cost report |
| **Sensitivity** | Manual multi-runs or dedicated modules | `Sensitivity:` block + charts (teaching caps) |
| **AI** | None historically | Context-bound Assistant (Apply required) |
| **Where “truth” lives if figures disagree** | Printed book / original software | **This app’s legend + engine** (and `NOTATION_STANDARD.md`) |

**What must stay the same for the model to still “be CYCLONE”:**

- Resources wait in queues.  
- Work takes time and holds units.  
- Meetings need all required resources.  
- Cycles close so production can repeat.  
- Counters define the production unit.  

**What may look different on purpose:**

- Colors and dashes on return arcs.  
- Exact corner cuts, flag art, triangle GEN/CON.  
- Automatic layout (not a scanned textbook page).  
- Prompt-first authoring instead of only dragging nodes.

If you write a paper, say you used **Neo-CYCLONE’s teaching notation** inspired by Halpin CYCLONE—not that the screenshot is a facsimile of Figure X in the 1992 book.

### 4.7 Modeling checklist before Simulate

1. Every resource has a visible **home QUEUE**.  
2. True meetings are **COMBI**; solo work is **NORMAL**.  
3. **Counter after:** names match real tasks.  
4. Gold dashed returns only into home idles.  
5. GEN/CON only if unit logic needs them.  
6. Branch probabilities look like a real split of the world.  
7. `Operation:` set if you care about Excel/report names.

Full geometric rules: [`docs/NOTATION_STANDARD.md`](./NOTATION_STANDARD.md).

---

## Chapter 5 — Simulation results

After **Simulate**, the **Results** area is the place for process literacy—not only a green checkmark.

### 5.1 Process Report

MicroCYCLONE-style summary: how long the run lasted, how many production events occurred, units per event, total production, when the first unit appeared, and average time between units. Use it to answer: *Did we produce what we thought, at what overall pace?*

### 5.2 Productivity by cycle and steady state

The units/hour chart starts at cycle **0**. Early cycles are often noisy (the system is filling). **Steady state** in Neo-CYCLONE is a practical teaching rule: productivity stays within about **5%** across a window of at least **10** cycles. The guide appears as an **old-gold dashed** line—so class can quote settled productivity, not the first spike.

### 5.3 Idleness and busy time

For each resource, **idle %** and **busy %** are both labeled so a tiny idle bar still has a story. High idle on a costly resource is a design smell; high idle on a cheap buffer may be intentional. This is often the best classroom discussion in the whole app.

### 5.4 Cost Report

When you supply hourly rates (USD per resource-hour): resource cost ≈ count × (USD/h) × run hours; **unit cost** ≈ total cost ÷ production. Unit cost bridges “how busy?” to “how expensive per unit produced?”—especially next to sensitivity charts.

### 5.5 Sensitivity Analysis tab

Appears when the prompt defines `Sensitivity:`. Compare combinations (e.g. trucks vs loaders): productivity and unit cost side by side, best markers, and idleness views. Pairwise comparison supports more than two resources within teaching caps (≤5 resources; ~150 combinations by stepping ranges). Batches prefer a **Web Worker** so the UI stays responsive; fallback is the main thread (same numbers). Single Simulate stays on the main thread.

### 5.6 Export discipline

Report Excel (multi-sheet; name prefers `Operation:`), chart PNG, diagram PNG. For homework note Operation name, seed, max cycles, and any SA ranges.

### 5.7 How to discuss results in one minute

1. What is steady-state units/hour?  
2. Which resource has the highest idle %?  
3. What is unit cost (if costs were entered)?  
4. If I add one unit of the scarce resource, what do I expect—then test with SA or a re-run.

## Chapter 6 — Six Examples as a learning path

Selecting an Example fills the prompt only. **You** click Draw Model. Use Chapter 4 while you look at each diagram.

| # | Name | What you should notice on the diagram |
|---|------|----------------------------------------|
| 1 | **Earthmoving** | Two home QUEUEs; COMBI Load; gold returns; single counter |
| 2 | **Asphalt Paving** | Meeting + **branch** arcs with `p=` |
| 3 | **Loading Dump Truck** | **GEN ▽** and **CON △** on the truck path |
| 4 | **Tower Crane** | Multi-demand crane; priorities; multi-counter flags |
| 5 | **Masonry** | Face-position queues; helper multi-demand; SA later |
| 6 | **Precast Plant** | Longer line; several resource homes; complex SA |

**Path:** 1→2→3 mechanics; 4 shared resources; 5–6 decisions under sensitivity.

---

## Chapter 7 — What “AI-assisted” should mean here

The Assistant sits under Results. It should feel like a teaching assistant who has read your board—not a search engine.

### 7.1 Purpose

- Explain *this* model’s cycles, COMBI/NORMAL, counter, GEN/CON, branch  
- Point at bottleneck and idleness from the *last run*  
- Propose a full Format Prompt edit when you ask to change fleet or durations  
- Stay short (≤20 lines) so the studio remains the focus  

It must **not** silently re-simulate, invent another operation, or replace CYCLONE with a mystery model.

### 7.2 Technology (honest)

| Mode | When | Behavior |
|------|------|----------|
| **AI mode** | `XAI_API_KEY` on host | Compact CONTEXT snapshot only |
| **Local mode** | No key / failure | English-first intent helper |

Product UI, Manual, and keywords are English-first (international classroom). Rate limits: ~30 Assistant requests / hour / IP; ~20 AI DSL draft / hour / IP.

### 7.3 Chat UX

Gold **You** bubbles (right, compact); light Assistant (left). System guidance lives in the input **placeholder**. Quick chips are general: resources · bottleneck · productivity · unit cost.

### 7.4 Recommended questions

- Explain resource cycles; COMBI vs NORMAL; where is the counter?  
- How do GEN/CON or branch p work in this model?  
- Fleet counts; highest idleness; likely bottleneck  
- Last productivity; steady state yet; unit cost; idle vs busy %  
- Edits using *your* resource names (then Apply → Draw → Simulate)  
- SA: best unit cost / highest productivity combination  
- Why home-QUEUE idleness is waste; why every resource needs a queue  

### 7.5 Boundary

Answers only about the **current** Format Prompt, drawn network, and **last** results. May **propose** edits; you must **Apply**, **Draw Model**, and **Simulate**.

### 7.6 Workflow

Build & simulate → ask → if a new prompt is proposed, Apply → Draw → Simulate → compare numbers.

### 7.7 Weak vs strong questions

| Weak | Stronger |
|------|----------|
| “Make it better” | “Which resource has the highest idle % after this run?” |
| “Optimize everything” | “Propose trucks = 8; keep loader = 1; I will re-simulate.” |
| “What is CYCLONE?” with empty model | Draw Example 1, then “Explain this model’s cycles.” |

## Chapter 8 — Guardrails

### 8.1 Simulation limits

| Parameter | Default | Hard limit |
|-----------|---------|------------|
| Max cycles | 100 | **500** |
| Seed | 12345 | — (dice = another path) |
| Time unit | minutes | — |
| SA resources | — | **5** |
| SA combinations | — | **~150** (ranges step up) |

Same seed + same model + same cycle limit → **identical** stochastic results. Seed is for reproducibility (homework, papers), not a fleet decision.

### 8.2 Performance

Sensitivity prefers a Web Worker; fallback main thread (same numbers, possible brief UI pause). Single Simulate on main thread—fast enough for teaching sizes.

### 8.3 AI & API

- Assistant: ~30 / hour / IP  
- AI DSL draft: ~20 / hour / IP  
- Payload: compact CONTEXT only; replies ≤20 lines  
- Without API key: local English helper still works  

These limits do not change CYCLONE rules—they protect shared hosting and API cost.

### 8.4 Deploy and versions

GitHub `main` → Vercel · [neo-cyclone.vercel.app](https://neo-cyclone.vercel.app/). No sign-in required for teaching. Always cite the footer product version after a deploy.

### 8.5 Citing Neo-CYCLONE

Product + version · URL · Operation · seed · max cycles · Simulation and/or Sensitivity · optional software DOI if your course requires it.

## Chapter 9 — FAQ (from real studio use)

### Drawing and the model diagram

**Q: I selected an Example but nothing drew.**  
A: Click **Draw Model**. Examples only paste the prompt.

**Q: Why does the diagram not match the book figure exactly?**  
A: Same CYCLONE *logic*; Neo-CYCLONE teaching *notation* (Chapter 4). Black/gold arrows and some shapes are intentional—not a bug.

**Q: What do gold dashed arrows mean?**  
A: Resource **return** to a **home QUEUE**. Solid black = forward work (including into staging before a COMBI).

**Q: COMBI vs NORMAL looks wrong.**  
A: COMBI only when **two or more resources** must meet to start the task. Solo work → NORMAL. Re-read which resources list that task.

**Q: Where is the production counter?**  
A: Golf-flag node. Set with `Counter after: TaskName`. Multiple flags are allowed (e.g. tower crane zones).

**Q: GEN and CON look like random triangles.**  
A: ▽ GEN multiplies units on arrival; △ CON gathers n→1. Prefer inline on the cycle: `GEN 5 → Scoop → CON 5 TruckFull → …`. Not required in every model.

### Simulation and results

**Q: Why is Simulate not useful yet?**  
A: Draw a model you trust first. Numbers without a truthful diagram are noise.

**Q: My classmate got different productivity.**  
A: Compare **seed**, **max cycles**, and whether the Format Prompt is identical (durations, branches, counts).

**Q: What is the steady-state line?**  
A: Teaching guide: productivity within about **5%** over a window of at least **10** cycles—old-gold dashed line on the units/hour chart. Quote that band in class, not the first noisy spike.

**Q: Sensitivity tab is empty / boring.**  
A: Add a `Sensitivity:` block (see Examples 5–6). Without ranges, there is nothing to sweep.

**Q: Charts stop before my max cycles.**  
A: Series follow completed production events; if the run hits time/logic limits earlier, the chart ends earlier. Check Process Report run length and cycle count.

**Q: Where is cost?**  
A: Only if the prompt has `Cost:` rates (USD per resource-hour). Then Cost Report shows totals and **unit cost**.

### Prompt, Excel, language

**Q: Excel file name looks like resource spaghetti.**  
A: Add `Operation: ShortName` after `#` notes (before resource cycles).

**Q: Can I write the prompt in Indonesian?**  
A: `#` notes may be any language. Keep **network keywords**, task names used in counters, and distribution keywords in **English** for reliable parsing.

**Q: AI proposed a prompt but numbers did not change.**  
A: Click **Apply**, then **Draw Model**, then **Simulate**. Nothing silent updates the engine.

**Q: AI only answers in English / very short.**  
A: Product policy: English-first; replies capped (≤20 lines) so the studio stays primary.

### Access and limits

**Q: Is sign-in required?**  
A: No for teaching use.

**Q: Max cycles 500 still feels short.**  
A: Teaching cap protects shared hosts and keeps charts readable. For research-scale work, use a research tool or discuss with the course owner.

**Q: Rate limit on AI Assistant?**  
A: About 30 requests / hour / IP on the shared host. Normal class pace is fine; lab NATs may share one IP.

**Q: Who is this dedicated to?**  
A: Professor Daniel W. Halpin and the CYCLONE tradition—see Prologue and References.

**Q: Where is the full bibliography?**  
A: **References** section at the **end** of this manual (after the Epilogue).


## Chapter 10 — Notes for instructors (and peer mentors)

### 10.1 Baseline run for the whole class

Example **1**, seed **12345**, max cycles **100**. Everyone matches once—then change **one** thing per exercise.

### 10.2 Exercise patterns

| Pattern | Ask students | Submit |
|---------|--------------|--------|
| See waste | Baseline idleness | Who waits? Why? |
| Read the diagram | Label QUEUE / COMBI / NORMAL / COUNTER / gold return | Screenshot + 5 labels |
| Fleet change | Trucks 3 vs 8, same seed | Unit cost + productivity |
| Branch | Example 2 | Effect of breakdown path |
| Shared resource | Example 4, swap priority | Who starves? |
| Sensitivity | Examples 5–6 | Best unit-cost combo + caution |

### 10.3 AI in class

Explain & draft allowed; graded claims need engine runs after Apply. Watch shared-IP rate limits in labs.

### 10.4 Lightweight rubric

| Criterion | Strong looks like |
|-----------|-------------------|
| Model truth | Diagram matches narrative (Ch.4 checklist) |
| Waste literacy | Idle/busy + bottleneck, not only total production |
| Reproducibility | Seed, cycles, version cited |
| Decision | Unit cost or SA-informed recommendation |
| Integrity | Engine results primary; AI optional |

### 10.5 Access

No install; modern browser; Manual in header; hard refresh after deploys if CSS looks missing.

---

# Epilogue — A request to the reader

When the diagram is clean and the numbers are stable, you have done what Halpin asked of a generation of students: **see the operation**. AI can speed the typing; it cannot replace that seeing.

Keep one run with seed **12345** as a shared baseline. Change one idea at a time—fleet, duration, branch, or priority—and ask what happened to **idleness** and **unit cost**.

If the on-screen model looks slightly different from a photocopy of a 1992 figure, use Chapter 4: honor the **logic**, learn this studio’s **legend**, then run the engine.

Thank you for using Neo-CYCLONE with care.

---

**Quick path:** Example or Format Prompt → Draw Model → read the diagram (Ch.4) → Simulate → Sensitivity (if planned) → AI Assistant (optional) → Export.

---

# References

Selected literature on **CYCLONE**, **MicroCYCLONE**, and applications by **Daniel W. Halpin**, students, and collaborators. Placed **last** so teaching chapters stay in front; use this section for papers, theses, and course bibliographies.

### Foundations

1. **Halpin, D. W.** (1973). Ph.D. dissertation, University of Illinois at Urbana–Champaign.  
2. **Halpin, D. W.** (1977). “CYCLONE: Method for Modeling of Job Site Processes.” *Journal of the Construction Division*, ASCE, 103(3), 489–499.  
3. **Halpin, D. W., & Riggs, L. S.** (1992). *Planning and Analysis of Construction Operations*. Wiley.  

### MicroCYCLONE

4. **Lluch, J., & Halpin, D. W.** (1982). *Journal of the Construction Division*, ASCE, 108(1), 129–145.  
5. **Halpin, D. W.** (1990–1992). MicroCYCLONE user and system manuals (Purdue / Learning Systems).  

### DISCO

6. **Huang, R.-Y., & Halpin, D. W.** (1993–1995). DISCO-related papers (ISARC; *Microcomputers in Civil Engineering*; *Journal of Construction Engineering and Management*).  
7. **Huang, R.-Y.** (1994). Ph.D., Purdue University (advisor: Halpin).  

### PROSIDYC · COST · WebCYCLONE

8. **Halpin, D. W., & Martinez, L.-H.** (1999). PROSIDYC. *Winter Simulation Conference*.  
9. **Cheng, T.-M., et al.** (2000). COST. *17th ISARC*.  
10. **Halpin, D. W., Jen, H., & Kim, J.** (2003). WebCYCLONE. *Winter Simulation Conference*.  

### Purdue circle and related systems

11. Work in the Halpin circle and peers: AbouRizk & Halpin; Hijazi; Lutz; Gonzalez-Quevedo; Abraham; project-level CYCLONE studies; AbouRizk et al. (2011) and related synthesis.  
12. Related lineage: **UM-CYCLONE** (Ioannou), **STROBOSCOPE** (Martinez), **Simphony / Simphony.NET** (AbouRizk et al.).  

### How Neo-CYCLONE relates

Neo-CYCLONE does **not** claim to supersede research simulators. It is **AI-Assisted Construction Operation Simulation**—a studio for first principles: flow, idleness, cyclic networks, transparent discrete-event logic, and responsible AI beside that engine. Diagram notation follows this product’s standard (Chapter 4; `NOTATION_STANDARD.md`) while remaining in Halpin’s tradition.

---

*AI-Assisted Construction Operation Simulation · Manual v1.6.14*
