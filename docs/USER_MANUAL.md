# Neo-CYCLONE — User Manual

| | |
|--|--|
| **Version** | 1.6.6 |
| **Product** | AI-Assisted Construction Operation Simulation |
| **Dedication** | AI-agent of Daniel W. Halpin's CYCLONE |
| **Language** | English (product & teaching surface) |
| **Live app** | [https://neo-cyclone.vercel.app/](https://neo-cyclone.vercel.app/) |
| **Audience** | Students · instructors · practitioners (50+ active users in early classroom use) |
| **Notation detail** | [NOTATION_STANDARD.md](./NOTATION_STANDARD.md) |
| **Engine notes (developers)** | [NEO_CYCLONE_DSL_v0.1.md](./NEO_CYCLONE_DSL_v0.1.md) |

This manual is for people who want to *understand* construction operations as **flow**—not only to click buttons. You can:

- **3 minutes:** [Start here](#start-here--3-minutes)  
- **15 minutes:** [Chapter 2](#chapter-2--fifteen-minutes-that-stick-earthmoving) with Example 1 open  
- **Full read:** ~30–45 minutes top to bottom  

Keep the [live studio](https://neo-cyclone.vercel.app/) open in another tab when you practice.

---

## Start here — 3 minutes

If you only do one thing today:

1. Open [neo-cyclone.vercel.app](https://neo-cyclone.vercel.app/).  
2. **Example** → **1. Earthmoving**.  
3. Click **Draw Model** (the diagram does **not** appear until you click).  
4. Leave **max cycles = 100**, **seed = 12345**.  
5. Click **Simulate**.  
6. Look at **units/hour by cycle** and **resource idleness** (who waits? who works?).  

That is the whole loop: **prompt → draw → simulate → read waste and productivity**. Everything else in this manual deepens that loop.

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

| Part | Chapters | When to read |
|------|----------|--------------|
| Ideas | 1 | Before inventing your own model |
| First run | 2 | Always, once |
| Prompt language | 3–4 | When writing your own operation |
| Results literacy | 5 | After first Simulate |
| Curriculum | 6 | Course design / self-study path |
| AI Assistant | 7 | When you use the co-pilot |
| Limits & deploy | 8 | Homework rules, citations |
| Lineage | 9 | Papers, history, respect |
| FAQ | 10 | Stuck mid-studio |
| Classroom | 11 | Teaching with 10–50 students |

---

# Prologue — Why this studio exists

Construction work is full of **repetition**: load and haul, pour and return, lift and place. Between those busy moments, resources wait. A truck queues at a loader. A crane sits while a crew finishes tying rebar. That waiting is not always “laziness”; it is often **the structure of the process**.

Professor **Daniel W. Halpin** spent a career making that structure *visible*. His **CYCLONE** language (*CYCLic Operations NEtwork*) gave operations a simple network grammar: resources cycle through queues and work, meet when they must, and count completed production. From that grammar grew tools—**MicroCYCLONE**, then DISCO, PROSIDYC, COST, WebCYCLONE, and a wider family of construction simulation systems (see Chapter 9).

**Neo-CYCLONE** is not a replacement for those research systems. It is a **teaching studio**: a place to meet Halpin’s ideas again, with a modern browser interface and an **AI Assistant** that stays tied to *your* model. The product name is deliberate:

- **AI-Assisted Construction Operation Simulation** — the honest product description  
- **AI-agent of Daniel W. Halpin's CYCLONE** — the dedication line  

AI here does not invent a new physics of construction. The **engine** is still a discrete-event CYCLONE-style simulator. AI helps you **phrase**, **inspect**, and **question** the model. You remain responsible for Draw Model, Simulate, and judgment.

If you leave this manual with one habit, let it be this: **draw the cycles until they tell the truth, then run the numbers**.

---

# Part I — Ideas before buttons

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

CYCLONE answered those questions with a small set of node types. Neo-CYCLONE keeps that spirit, even when the diagram styling (solid black forward arcs, dashed gold returns) is tuned for teaching clarity.

### 1.4 What Neo-CYCLONE is — and is not

| It is | It is not |
|-------|-----------|
| A browser teaching studio for cyclic construction operations | A full project controls ERP |
| Prompt → diagram → discrete-event simulation | A black-box “AI that simulates for you” without a model |
| MicroCYCLONE-style reports (process, elements, cost, sensitivity) | A multiplayer game engine |
| English-first, classroom-friendly limits | An unlimited free chat API |

You do **not** need to sign in to learn. Teaching use stands alone.

### 1.5 The studio at a glance

| Area | What you do there |
|------|-------------------|
| **Left** | Choose Example or write Format Prompt → **Draw Model** |
| **Right** | Inspect CYCLONE Model; set cycles & seed → **Simulate** |
| **Below** | **Results**: Simulation · Sensitivity Analysis |
| **Lower** | **AI Assistant** (optional co-pilot) |
| **Header** | Manual (this text) |
| **Footer** | Product name · version · year — cite the version in homework |

---

# Part II — Your first hour in the studio

## Chapter 2 — Fifteen minutes that stick (Earthmoving)

This chapter is a **guided first run**. Do it once with Example 1 even if you already “know trucks.”

### 2.1 Open the studio

Go to the live app. You should see:

- **Left:** prompt area, Example dropdown, **Draw Model**  
- **Right:** empty CYCLONE Model until you draw  
- **Below (later):** Results and AI Assistant  

Footer shows product name, version, and year. Header offers **Manual**.

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

**What this is saying in plain language:** trucks cycle through load, haul, dump, return. The loader only participates at **Load**—so Load is a **meeting** (COMBI). Production is counted after **Dump**, twelve cubic meters per count. Costs are dollars per resource-hour. Durations are in **minutes**.

3. Click **Draw Model** (selecting an example does **not** draw by itself).  
4. On the right, confirm:

- A home **QUEUE** for trucks and for the loader  
- **Load** as a combined work step  
- Haul, Dump, Return as truck work  
- A **COUNTER** after Dump  
- Solid black arcs forward; dashed gold arcs returning resources home  

If something looks wrong, fix the prompt and **Draw Model** again. Do not Simulate yet until the picture matches the story.

### 2.3 Run parameters

Under the diagram:

- **Max cycles** — default **100**, hard maximum **500** (teaching cap).  
- **Seed** — default **12345**. Same seed + same model + same cycle limit → **identical** stochastic results. The **dice** button picks another seed when you want a different random path on purpose.

Seed is for **reproducibility** (homework, papers, fair comparisons). It is not a fleet decision variable.

### 2.4 Simulate and read the first results

Click **Simulate**. Open the **Simulation** tab.

Start with the **Process Report**: run length, number of cycles, production, rough pace of output. Then look at **units per hour by cycle**. Ask:

- Does productivity bounce wildly at the start, then settle?  
- Does the **steady-state** guide (about 5% stability over at least **10** cycles) appear as an old-gold dashed line?  

Then open **resource idleness**. Who waits? Who works? That pair of numbers is often the best classroom discussion in the whole app.

If you entered **Cost** rates, the **Cost Report** shows resource cost, total cost, and **unit cost**—the bridge from “how busy?” to “how expensive per unit produced?”

### 2.5 Export once, so you know you can

- **Report Excel** — multi-sheet workbook; file name prefers `Operation: Earthmoving`.  
- **Chart PNG** — on chart frames.  
- Diagram export — from the model tools.  

For assignments, always record **seed**, **max cycles**, and **Operation** name.

### 2.6 Optional: ask the AI Assistant

Scroll to **AI Assistant**. Guidance text sits in the **input placeholder** (not as a permanent chat bubble). Try a general chip:

- *How many resources?*  
- *Which resource is the bottleneck?*  
- *What was productivity?*  
- *What is the unit cost?*  

Answers stay short (≤20 lines) and stay bound to **this** prompt, network, and last run. If the assistant proposes a new prompt, you must **Apply**, then **Draw Model**, then **Simulate**—nothing silent happens behind your back.

### 2.7 Quick path (cheat sheet)

1. Example or write Format Prompt → 2. **Draw Model** → 3. Check cycles → 4. Cycles & seed → 5. **Simulate** → 6. Sensitivity (if planned) → 7. AI Assistant (optional) → 8. Export.

### 2.8 Common first-session mistakes

1. Expecting the diagram after only selecting an Example.  
2. Simulating before the diagram matches the story.  
3. Changing fleet size in chat and assuming the engine already changed (must **Apply** → Draw → Simulate).  
4. Comparing results with a friend who used another seed.  
5. Reading only total production and ignoring **idleness**.  

---

# Part III — The Format Prompt as a design language

## Chapter 3 — How to talk so the studio can build a network

You do not draw QUEUE circles by hand in the prompt. You describe **resource cycles**. The builder creates queues, tasks, and arcs. That is intentional: students learn the *logic of cycles*, not pixel-pushing.

### 3.1 Comments vs data

Lines starting with `#` or `//` are **notes only**. Use them for teaching context. The engine ignores them.

### 3.2 Operation name (first data line after notes)

```text
Operation: Earthmoving
```

Aliases: `Model:`, `Title:`, `Op:`.  
This names the model for reports and Excel files. All six built-in Examples place `Operation:` **after** their `#` comment block.

### 3.3 Network — resource cycles

```text
Trucks: Load → Haul → Dump → Return
Loader: Load
5 trucks, 1 loader
```

- One primary sequence per resource.  
- Supporting resources often share a meeting task (here, Load).  
- Counts: `5 trucks, 1 loader` (or `n Trucks = 5` style where accepted).  
- Arrows may be written `→`, `->`, `-->`, or `=>`.

**Multi-demand** (one resource serves several tasks, not in a fixed sequence):

```text
Crane: LiftAtA | LiftAtB | LiftAtC
```

**Priority** (lower number = higher priority when several demands wait)—MicroCYCLONE tradition:

```text
Priority:
LiftAtA: 1
LiftAtB: 2
LiftAtC: 3
```

### 3.4 Production counter

```text
Counter after: Dump
production = 12 m3
```

Name the task(s) that mean “one production unit finished.” Multiple counters are allowed (e.g. tower crane lifts at A, B, and C). If you omit placement, the studio uses a default—but **explicit is safer** for teaching and for you.

### 3.5 Durations (minutes)

Every named task needs a distribution:

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

Aliases: `pert` ≈ `beta-pert`. A three-number `beta` is treated as PERT.

### 3.6 Branch probability

```text
Branch:
After DumpToPaver: RefillAsphalt p=0.85, Breakdown p=0.15
```

Use when the story forks (breakdown, rework, inspection fail). Probabilities should make sense as a split of reality, not decoration.

### 3.7 GEN and CON

**GENERATE** multiplies entities (e.g. one truck arrival becomes five scoop-sized loads). **CONSOLIDATE** gathers N into one (truck becomes full). Prefer **inline** form on the cycle:

```text
Trucks: GEN 5 → Scoop → CON 5 TruckFull → Haul&Return
```

Not every model needs GEN/CON—only when the production unit logic requires scaling.

### 3.8 Cost and sensitivity

```text
Cost:
Trucks: 85
Loader: 120

Sensitivity:
Trucks: 2..10
Loader: 1..2
```

Costs are **USD per resource-hour**. Sensitivity varies counts for comparison runs (productivity, unit cost, idleness). Teaching caps: up to **5** resources in SA; combinations limited (~150) by stepping ranges, not by silently dropping mid-axis points.

### 3.9 Recommended block order

**Operation → Network → Durations → Priority → Branch → Cost → Sensitivity (last).**

The live **Format Prompt** panel in the studio shows the canonical template. Prefer that order so humans and the assistant parse the same story.

### 3.10 Minimal custom prompt (template you can copy)

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

Replace names with *your* operation. Draw Model. If the diagram lies, the prompt is incomplete—not “the AI failed.”

---

## Chapter 4 — Modeling rules that keep diagrams honest

1. **Every resource has a home QUEUE.** That is where idleness lives.  
2. **Meeting of ≥2 resources → COMBI.** One resource working alone → **NORMAL**.  
3. **Forward** arcs: solid **black**. **Return** home: dashed **gold** (Neo-CYCLONE teaching convention).  
4. **GEN / CON** only when unit logic needs them; they are independent features.  
5. **`Counter after:`** must match real task names.  
6. Layout aims for ordered tasks, queues beside cycles, counter toward the end—not a spaghetti of convenience.  
7. You describe cycles in text; the builder draws queues and arcs.

Graphic shapes and edge rules in detail: `docs/NOTATION_STANDARD.md`.

### 4.1 “Does this need COMBI?”

Ask: *Do two (or more) distinct resources have to be present for this task to start?*  
- Truck **and** loader at Load → **COMBI**  
- Truck alone hauling → **NORMAL**  

If the diagram shows COMBI for a solo task, your prompt probably listed two resources on the same step by accident—or the reverse if a true meeting was written as a single-resource line.

---

# Part IV — Reading results like an engineer

## Chapter 5 — Simulation, cost, and sensitivity

### 5.1 Process Report

This is the MicroCYCLONE-flavored summary: how long the run lasted, how many production events occurred, units per event, total production, when the first unit appeared, average time between units. Use it to answer: *Did we produce what we thought, at what overall pace?*

### 5.2 Productivity by cycle and steady state

The units/hour chart starts at cycle **0**. Early cycles are often noisy (the system is “filling”). **Steady state** in Neo-CYCLONE is a practical teaching rule: productivity stays within about **5%** across a window of at least **10** cycles. The guide appears as an **old-gold dashed** line with a readable value—so you can say in class, “We would quote about *this* productivity,” not the wild first spike.

### 5.3 Idleness and busy time

For each resource, idle % and busy % are both shown so a tiny idle bar still has a story (busy may be near 100%). High idle on a costly resource is a design smell. High idle on a cheap buffer may be intentional.

### 5.4 Cost Report

When you supply hourly rates:

- cost per resource ≈ count × (USD/h) × run hours  
- **unit cost** ≈ total cost ÷ production  

Unit cost is often the decision metric students remember—especially next to sensitivity charts.

### 5.5 Sensitivity Analysis tab

Appears when the prompt defines `Sensitivity:`. You compare combinations (e.g. trucks vs loaders): productivity and unit cost side by side, best markers, and idleness views. Pairwise comparison supports more than two resources within the teaching caps. The detail table can be hidden to keep the story visual.

Sensitivity batches prefer a **Web Worker** so the UI stays responsive; if Workers fail, the same engine runs on the main thread (same numbers, possible brief UI pause). Single **Simulate** stays on the main thread—it is fast enough for classroom cycles.

### 5.6 Export discipline

For homework and papers, export Excel and note: Operation name, seed, max cycles, and any sensitivity ranges. Charts and diagrams as PNG support figure-ready slides.

### 5.7 How to discuss results in one minute

1. What is steady-state **units/hour**?  
2. Which resource has the highest **idle %**?  
3. What is **unit cost** (if costs were entered)?  
4. If I add one unit of the busiest scarce resource, what do I *expect* to happen—then test with Sensitivity or a re-run.

---

# Part V — A small curriculum of examples

## Chapter 6 — Six Examples as a learning path

Selecting an Example fills the prompt only. **You** click Draw Model.

| # | Name | What you should notice |
|---|------|-------------------------|
| 1 | **Earthmoving** | Classic two-resource cycle; cost; steady state. No branch, no SA—learn the spine first. |
| 2 | **Asphalt Paving** | Meeting at dump-to-paver; **branch** breakdown then refill; count after pave. |
| 3 | **Loading Dump Truck** | Inline **GEN/CON**: excavator scoops fill a truck before haul-return. |
| 4 | **Tower Crane** | Multi-demand `\|`, **priority**, multi-counter production across zones. |
| 5 | **Masonry** | Face stocks (brick/mortar places); helper multi-demand; **sensitivity** introduction. |
| 6 | **Precast Plant** | Halpin Ch.14-style line production; richer SA—systems thinking. |

**Suggested course path:** 1 → 2 → 3 for mechanics; 4 for shared resources; 5–6 for decisions under sensitivity.

**Self-study weekend:** Day 1: Examples 1–3 + Chapter 5. Day 2: Example 4 + your own operation. Day 3: Examples 5–6 + one sensitivity recommendation in writing.

Rewrite any example. Change counts. Break a duration. Re-draw. That is the point.

---

# Part VI — The AI Assistant as a classroom co-pilot

## Chapter 7 — What “AI-assisted” should mean here

### 7.1 Purpose

The Assistant sits under Results. It should feel like a **teaching assistant who has read your board**, not like a search engine:

- Explain *this* model’s cycles and counter  
- Point at bottleneck and idleness from *last run*  
- Propose a full Format Prompt edit when you ask to change fleet or durations  
- Stay short (≤20 lines) so the studio remains the focus  

It must **not** silently re-simulate, invent another operation, or replace CYCLONE with a mystery model.

### 7.2 Technology (honest version)

| Mode | When | Behavior |
|------|------|----------|
| **AI mode** | Host has `XAI_API_KEY` (e.g. Vercel) | Chat model sees a **compact CONTEXT** snapshot only—not the whole internet, not the full raw engine dump |
| **Local mode** | No key or API failure | English-first intent helper for common studio questions |

**Language policy:** product UI, Manual, and keywords are English-first (international classroom). AI mode prefers English; it may follow another language if you write clearly in that language—but teaching materials stay English.

**Rate limits (shared classroom host):** about **30** Assistant requests / hour / IP; about **20** AI DSL draft requests / hour / IP. Normal class use is fine; automated spam is not.

### 7.3 Chat UX (so you trust the thread)

- **You** — gold bubble, right-aligned, compact  
- **Assistant** — light bubble, left-aligned  
- System guidance lives in the **placeholder** of the input box  
- Quick chips are **general** (no truck-only assumptions): resources, bottleneck, productivity, unit cost  

### 7.4 Recommended questions

**Model understanding**  
Explain this model’s resource cycles. Which tasks are COMBI vs NORMAL? Where is the counter? How do GEN/CON work here? Is there a branch?

**Fleet & waste**  
How many of each resource? Highest idleness? Likely bottleneck?

**Results**  
Last productivity (units/hour)? Steady state yet? Unit cost? Idle vs busy %?

**Edits (propose → Apply)**  
Use *your* resource names: increase a fleet count; change a duration; adjust Cost or Sensitivity ranges.

**Sensitivity**  
Best unit cost combination? Highest productivity combination?

**Teaching**  
Why home-QUEUE idleness is waste. Why every resource needs a queue in a CYCLONE cycle.

### 7.5 Boundary (memorize this)

> The AI Assistant answers only about the **current** Format Prompt, drawn CYCLONE network, and **last** simulation/sensitivity results. It may **propose** Format Prompt edits; you must **Apply**, **Draw Model**, and **Simulate** for changes to take effect.

### 7.6 Workflow with the Assistant

1. Build and simulate a model you understand.  
2. Ask focused questions.  
3. If a new prompt is proposed → **Apply** → **Draw Model** → **Simulate**.  
4. Compare numbers; do not accept a suggestion without a run when the question is quantitative.

### 7.7 What good vs weak questions look like

| Weak | Stronger |
|------|----------|
| “Make it better” | “Which resource has the highest idle % after this run?” |
| “Optimize everything” | “Propose trucks = 8; keep loader = 1; I will re-simulate.” |
| “What is CYCLONE?” (with empty model) | Draw Example 1 first, then “Explain this model’s resource cycles.” |

---

# Part VII — Limits, deploy, and integrity

## Chapter 8 — Guardrails (features stay; abuse is limited)

### 8.1 Simulation

| Parameter | Default | Hard limit | Notes |
|-----------|---------|------------|--------|
| Max cycles | 100 | **500** | Teaching cap; UI clamps higher values |
| Seed | 12345 | — | Reproducibility; dice for alternate paths |
| Time unit | minutes | — | Stated in Format Prompt header |
| SA resources | — | **5** | Extra ranges ignored with a note |
| SA combinations | — | **~150** | Step increases; not a silent mid-axis cut |

### 8.2 Performance

- Sensitivity prefers **Web Worker**; fallback main thread.  
- Single Simulate on main thread (appropriate for teaching sizes).  

### 8.3 AI & API

| Item | Behavior |
|------|----------|
| Assistant | 30 / hour / IP |
| AI DSL draft | 20 / hour / IP |
| Payload | Compact CONTEXT only |
| Replies | ≤20 lines |
| No API key | Local English helper still works |

These limits do **not** change CYCLONE rules or Halpin-style interpretation. They protect shared hosting and API cost.

### 8.4 Deploy and versions

- Source of truth: **GitHub `main`** → **Vercel** auto-deploy.  
- Live: [https://neo-cyclone.vercel.app/](https://neo-cyclone.vercel.app/)  
- Optional env: `XAI_API_KEY` for AI mode.  
- Teaching does **not** require sign-in.  
- Footer shows **version** (e.g. 1.6.6) and year—cite them in reports.

### 8.5 Citing Neo-CYCLONE in homework or papers

Suggested elements:

1. Product name and version (footer).  
2. URL of the live app.  
3. Operation name, seed, max cycles.  
4. Whether results came from Simulation only or also Sensitivity.  
5. Optional: Zenodo / GitHub release DOI if your course requires software citation.

---

# Part VIII — Lineage and further reading

## Chapter 9 — References (selected)

Neo-CYCLONE stands on published work by **Daniel W. Halpin**, his students, and collaborators. This list is a starting map, not an exhaustive bibliography.

### 9.1 Foundations

1. **Halpin, D. W.** (1973). Ph.D. dissertation, University of Illinois at Urbana–Champaign.  
2. **Halpin, D. W.** (1977). “CYCLONE: Method for Modeling of Job Site Processes.” *Journal of the Construction Division*, ASCE, 103(3), 489–499.  
3. **Halpin, D. W., & Riggs, L. S.** (1992). *Planning and Analysis of Construction Operations*. Wiley.  

### 9.2 MicroCYCLONE

4. **Lluch, J., & Halpin, D. W.** (1982). *Journal of the Construction Division*, ASCE, 108(1), 129–145.  
5. **Halpin, D. W.** (1990–1992). MicroCYCLONE user and system manuals (Purdue / Learning Systems).  

### 9.3 DISCO

6. **Huang, R.-Y., & Halpin, D. W.** (1993–1995). DISCO-related papers (ISARC; *Microcomputers in Civil Engineering*; *Journal of Construction Engineering and Management*).  
7. **Huang, R.-Y.** (1994). Ph.D., Purdue University (advisor: Halpin).  

### 9.4 PROSIDYC · COST · WebCYCLONE

8. **Halpin, D. W., & Martinez, L.-H.** (1999). PROSIDYC. *Winter Simulation Conference*.  
9. **Cheng, T.-M., et al.** (2000). COST. *17th ISARC*.  
10. **Halpin, D. W., Jen, H., & Kim, J.** (2003). WebCYCLONE. *Winter Simulation Conference*.  

### 9.5 Purdue circle and related systems

11. Work in the Halpin circle and peers: AbouRizk & Halpin; Hijazi; Lutz; Gonzalez-Quevedo; Abraham; project-level CYCLONE studies; AbouRizk et al. (2011) and related synthesis.  
12. Related lineage students may meet later: **UM-CYCLONE** (Ioannou), **STROBOSCOPE** (Martinez), **Simphony / Simphony.NET** (AbouRizk et al.).  

### 9.6 How Neo-CYCLONE relates

Neo-CYCLONE does **not** claim to supersede research simulators. It is **AI-Assisted Construction Operation Simulation**—a studio for first principles: flow, idleness, cyclic networks, and responsible use of AI beside a transparent engine.

---

# Part IX — When you are stuck

## Chapter 10 — FAQ (from real studio use)

**Q: I selected an Example but nothing drew.**  
A: Click **Draw Model**. Examples only paste the prompt.

**Q: Why is Simulate not useful yet?**  
A: Draw a model you trust first. Simulation without a truthful diagram is noise.

**Q: My classmate got different productivity.**  
A: Compare seed, max cycles, and whether the Format Prompt is identical (including durations and branches).

**Q: Where do I put the operation title for Excel?**  
A: `Operation: Name` after `#` notes, before resource cycles.

**Q: COMBI vs NORMAL looks wrong.**  
A: COMBI only when **two or more resources** must meet. Solo work → NORMAL. Re-read the resource lines.

**Q: Gold dashed vs black solid arrows?**  
A: Black solid = forward work flow. Gold dashed = resource return to home QUEUE (teaching convention in Neo-CYCLONE).

**Q: Sensitivity tab is empty / boring.**  
A: Add a `Sensitivity:` block (see Examples 5–6). Without it, there is nothing to sweep.

**Q: AI proposed a prompt but numbers did not change.**  
A: Click **Apply**, then **Draw Model**, then **Simulate**.

**Q: Can I write the prompt in Indonesian?**  
A: Keywords and teaching UI are English-first. Notes in `#` can be any language; for reliable parsing, keep network syntax and distribution keywords in English.

**Q: Max cycles 500 still feels short.**  
A: Teaching cap protects shared hosts and keeps charts readable. For research-scale runs, export logic and continue in a research tool—or discuss with the course owner.

**Q: Is sign-in required?**  
A: No for teaching use.

**Q: Who is this dedicated to?**  
A: Professor Daniel W. Halpin and the CYCLONE tradition—see Prologue and Chapter 9.

---

# Part X — Teaching with Neo-CYCLONE

## Chapter 11 — Notes for instructors (and peer mentors)

With **dozens of concurrent learners**, small conventions prevent chaos.

### 11.1 Baseline run for the whole class

Agree once:

- Example **1. Earthmoving** (or a course-specific prompt)  
- Seed **12345**  
- Max cycles **100** (or 200 if you prefer longer settling)  

Everyone’s first Process Report should match. Then change **one** thing per exercise.

### 11.2 Exercise patterns that work

| Pattern | Prompt to students | What they submit |
|---------|--------------------|------------------|
| See waste | Run baseline; screenshot idleness | Which resource waits? Why? |
| Fleet change | Apply trucks 3 vs 8; same seed | Unit cost + productivity table |
| Uncertainty | Switch one task from const → tri | How steady-state band moves |
| Branch | Example 2; mark a breakdown effect | Cycle markers / narrative |
| Shared resource | Example 4; swap priorities | Who starves? |
| Sensitivity | Example 5 or 6 | Best unit-cost combo + caution |

### 11.3 AI Assistant in class

- Allow Assistant for **explanation** and **prompt drafts**.  
- Require **Apply → Draw → Simulate** before any grade claim.  
- Remind rate limits if a lab shares one NAT/IP.  
- Prefer questions from Chapter 7.4 so answers stay on-model.

### 11.4 Assessment rubric (lightweight)

| Criterion | Weak | Strong |
|-----------|------|--------|
| Model truth | Diagram contradicts prompt story | Cycles, meetings, counter match narrative |
| Waste literacy | Only quotes total production | Discusses idle/busy and bottleneck |
| Reproducibility | No seed / cycles | Seed, cycles, version cited |
| Decision | “Looks good” | Unit cost or SA-informed recommendation |
| Integrity | AI text pasted as proof | AI optional; engine results primary |

### 11.5 Accessibility and access

- No install; modern browser; English UI.  
- Hard refresh if a deploy just landed and CSS looks missing.  
- Manual always available from the header.

---

# Epilogue — A request to the reader

When the diagram is clean and the numbers are stable, you have done what Halpin asked of a generation of students: **see the operation**. AI can speed the typing; it cannot replace that seeing.

If you teach with Neo-CYCLONE, keep one run with seed **12345** as a shared baseline, then change one idea at a time—fleet, duration, branch, or priority—and ask what happened to **idleness** and **unit cost**. That discipline matters more than any single feature.

If you are one of the growing number of people using this studio: thank you. Report confusing moments to your instructor or maintainer—the manual improves when real sessions leave fingerprints.

---

**Quick path:** Example or Format Prompt → Draw Model → Simulate → Sensitivity (if planned) → AI Assistant (optional) → Export Excel / PNG.

*AI-Assisted Construction Operation Simulation · AI-agent of Daniel W. Halpin's CYCLONE · Manual v1.6.6*
