# Neo-CYCLONE — User Manual

| | |
|--|--|
| **Version** | 1.3.1 |
| **Language** | English |
| **Tagline** | AI-agent of Daniel W. Halpin's CYCLONE |
| **Live app** | [neo-cyclone.vercel.app](https://neo-cyclone.vercel.app/) |
| **Notation reference** | [NOTATION_STANDARD.md](./NOTATION_STANDARD.md) |

---

# Part I — Getting oriented

## Chapter 1 — Introduction

### 1.1 Purpose

Neo-CYCLONE is an **educational web app** for modeling and simulating **repetitive construction operations** using the spirit of Professor **Daniel W. Halpin’s CYCLONE** (*CYCLic Operations NEtwork*).

It is meant for:

- **First contact** with construction operations as **flow**
- Seeing **idleness** (waiting) as something we can measure
- Connecting process design to ideas later used in Lean Construction and Project Production Management
- Learning classic MicroCYCLONE ideas (QUEUE, COMBI, NORMAL, COUNTER, GEN, CON, probability, sensitivity) without installing old desktop software

It is **not** a special-purpose industrial factory controller. It is a **teaching studio**.

### 1.2 Why this exists (dedication)

This product is a **tribute to Professor Daniel W. Halpin**.

Through his teaching and work, many students first met:

| Idea | Meaning in operations |
|------|------------------------|
| **Flow** | Resources move through tasks in cycles |
| **Idleness** | Time spent waiting is waste we can study |
| **CYCLONE** | A simple network language for cyclic construction work |

The historical line includes **CYCLONE** (methodology), **MicroCYCLONE** (early computer tool), then systems such as DISCO, PROSIDYC, COST, WebCYCLONE, Symphony.Net, and related tools.

Halpin’s foundation is **not obsolete** in the age of AI. It is the **grammar** that lets us describe an operation clearly enough that a machine can build a model and run a simulation.

### 1.3 What you need

| Need | How Neo-CYCLONE helps |
|------|------------------------|
| Describe an operation in plain structure | **Format Prompt** (resource cycles + durations) |
| See the CYCLONE network | **Draw Model** → diagram + network logic |
| Measure productivity & waste | **Simulate** → units/hour, utilization, idleness |
| Compare fleet mixes | **Sensitivity Analysis** (optional Cost block) |
| Keep Halpin-style reports | Results, Excel export, charts |

You need only a browser (the live app on Vercel). No local install for normal use.

### 1.4 Approach — is this an “AI agent”?

Be clear about what runs under the hood:

| Layer | What it is | What it is *not* |
|-------|------------|------------------|
| **Structured Format Prompt** | The **primary** way to define a model: resource cycles, durations, priority, branch, cost, sensitivity | Free chat that “guesses” a site plan |
| **Local builder / engine** | Deterministic code: prompt → CYCLONE network → discrete-event simulation | A black-box neural simulator |
| **Optional AI assist** | Free-text descriptions may be turned into a draft DSL when the text is *not* already structured | A multi-agent autonomous planner that replaces engineering judgment |
| **Product tagline** | “AI-agent of Daniel W. Halpin's CYCLONE” = **AI-assisted studio** for Halpin-style modeling | A substitute for Halpin’s methodology |

**In practice for learning:**

1. You (or an **Example**) write a **structured prompt**.  
2. You click **Draw Model** → the app builds QUEUE / COMBI / NORMAL / COUNTER / GEN / CON and links.  
3. You check the diagram (resource cycles, meetings, returns).  
4. You click **Simulate** → MicroCYCLONE-style results.  

So: **prompt-first, model-second, simulation-third**. The “agent” helps when text is free-form; **examples and Format Prompt are ordinary structured text**, not magic.

### 1.5 Studio layout (one screen)

| Area | Role |
|------|------|
| **Left** | Prompt · **Example** dropdown · **Draw Model** · Format Prompt (reference, collapsed) |
| **Right** | **CYCLONE Model** (empty until Draw) · network logic · run parameters |
| **Below** | **Results**: Simulation · Sensitivity Analysis |

On first open:

- Prompt is **empty** (placeholder asks you to select an example or write a prompt).  
- Diagram is **empty** until **Draw Model**.  
- Choosing an **Example** only **fills the prompt**; it does **not** draw until you click Draw Model.

---

# Part II — How to use Neo-CYCLONE

## Chapter 2 — How-to (step by step)

### 2.1 Fast path (recommended for first run)

1. Open the app.  
2. Open **Example** → choose e.g. **1. Earthmoving**.  
3. Read the prompt (network + durations + cost).  
4. Click **Draw Model**.  
5. Check the diagram: home QUEUEs on the left, tasks left→right, counter near production.  
6. Set **Max cycles** (default **100**, product limit **500**) and **Seed** (default **12345**).  
7. Click **Simulate**.  
8. Read **Results**: production by cycle, steady state, utilization, idleness, cost if present.  
9. Optional: **Excel** report, chart **PNG**, model **PNG**.

### 2.2 Your own operation (from scratch)

1. Leave Example on **— Select example —** or clear the idea.  
2. In the prompt box, write a **structured** model (see Chapter 4), or paste from Format Prompt.  
3. **Draw Model** → inspect / fix prompt → Draw again.  
4. **Simulate** when the network is right.  
5. Add **Cost** and **Sensitivity** blocks when you want unit cost and fleet comparisons.

### 2.3 Iterate the model (important)

Do **not** jump to Simulate until the **network logic** matches the story:

| Check | Question |
|-------|----------|
| Resource cycles | Does each resource return to a **home QUEUE**? |
| Meetings | Is every multi-resource task a **COMBI**? |
| Production | Is **Counter after:** the right task (exact name)? |
| GEN / CON | Are they **on the material/resource chain** that scales, not on a random helper? |
| Branches | Do detours **rejoin** the main path? |

Edit the prompt → **Draw Model** again → then Simulate.

### 2.4 Sensitivity Analysis (when the prompt has `Sensitivity:`)

1. Draw and Simulate as usual.  
2. Open Results → tab **Sensitivity Analysis**.  
3. If several resources vary: pick a **pair** (pairwise mode).  
4. Tab **Productivity & unit cost** — line charts + table.  
5. Tab **Idleness & utilization** — waste snapshot for the best productivity combo.

### 2.5 What you do *not* need to draw by hand

You **never** type QUEUE circles or arrow lists in the prompt.  
**Resource cycles** imply home QUEUEs, staging, forward arcs, and return arcs.  
GEN / CON / `p=` / Priority only **annotate** special behavior.

### 2.6 Random seed (reproducibility)

| Topic | Rule |
|-------|------|
| **What it is** | Starting value for the random-number stream used for stochastic durations (`tri`, `normal`, `pert`, …) and probabilistic branches |
| **Default** | **12345** — use this for classroom demos, homework, and fair fleet comparisons |
| **Same seed + same model + same max cycles/time** | **Identical** results (productivity, unit cost, charts) |
| **Different seed** | Same model structure, **another random path** (durations / branches realize differently) |
| **When seed barely matters** | All durations are `const` and there is **no** probability branch |
| **UI** | Seed field under the CYCLONE Model; dice button **randomizes** a new seed (still fully visible) |
| **Reporting** | Results and Excel always record the seed used — cite it in assignments/papers |

**Do not** treat seed as an operational parameter (it is not fleet size or cost). Prefer the default for teaching; change seed only when you intentionally want another sample path.

---

# Part III — Teaching examples

## Chapter 3 — Six Examples

1. **Earthmoving** — classic fleet; cost; steady state  
2. **Asphalt Paving** — branch probability  
3. **Loading Dump Truck** — GEN / CON  
4. **Tower Crane** — multi-demand, Priority, multi-counter  
5. **Masonry** — face stocks; sensitivity intro  
6. **Precast Plant** — line-style + richer sensitivity  

(Open each from the studio **Example** dropdown; Draw Model before Simulate.)

---

# Part IV — Format Prompt & rules

## Chapter 4 — Format Prompt (structured text)

Block order: **Network → Durations → Priority → Branch → Cost → Sensitivity** (last).  
`#` / `//` = notes only. Time in **minutes**. Cost in **USD / resource-hour**.

See the Format Prompt panel in the studio for the live template. Sequence arrows: `→` · `->` · `-->` · `=>`. Multi-demand: `A | B | C` + Priority. Inline GEN/CON preferred on the resource chain.

### Duration distributions (minutes)

| Kind | Parameters |
|------|------------|
| `const` | fixed value |
| `unif` | min, max |
| `tri` | min, mode, max |
| `normal` | mean, sd |
| `lognormal` | mean, sd of duration |
| `beta` | **min, max, α, β** (4-param) |
| `pert` | **a, m, b** → classic PERT-beta on [a,b] |
| `gamma` | shape, scale |

Aliases: `pert` = `beta-pert` = `betapert`. `beta` with three numbers is treated as PERT.

## Chapter 5 — Modeling rules (Neo-CYCLONE)

1. Every resource has a home QUEUE.  
2. ≥2 resources meet → COMBI; one resource → NORMAL.  
3. Return arcs (dashed gold) only to home QUEUE; forward = solid black.  
4. GEN ▽ / CON △ optional and independent.  
5. `Counter after:` exact task name(s).  
6. Grid layout: ordered tasks, queues; counter near the end.

## Chapter 6 — Results & exports

### 6.1 Simulation tab

| Block | Content |
|-------|---------|
| **Production by cycle** | Units/hour vs cycle; **dark gold** steady-state (5% rule, **≥10** consecutive cycles); **red** dots = branch detours |
| **Charts** | Utilization, idleness (busy vs idle %) |
| **Report by element** | Queues, activities (MicroCYCLONE-style teaching fields) |
| **Cost** | Per resource, total, unit cost (if Cost block present) |
| **Branches** | Declared vs empirical probability |
| **Seed** | Shown in Results header and Excel process report |

Y-axis on units/hour charts **scales to the data** (no empty tall chart when rates are small).

### 6.2 Sensitivity tab

| Sub-tab | Content |
|---------|---------|
| **Productivity & unit cost** | Pair charts + best markers + detail table |
| **Idleness & utilization** | Snapshot for best productivity combination |

### 6.3 Downloads

- **Excel** multi-sheet report (includes seed)  
- Chart **PNG**  
- Model diagram **PNG**  
- Zoom on diagram (+ / − / reset)

---

## Chapter 7 — Run limits & deploy

| Parameter | Default / limit |
|-----------|-----------------|
| Max cycles | Default **100**, product max **500** |
| Seed | Default **12345** (see §2.6 Random seed) |
| Max time | Auto-raised with cycle horizon (minutes) |
| Time unit in prompt | Minutes |

**Deploy:** GitHub `main` → Vercel production ([neo-cyclone.vercel.app](https://neo-cyclone.vercel.app/)).

---

## Quick reference card

```text
1. Select Example  OR  write Format Prompt
2. Draw Model      → inspect cycles / meetings / counter
3. Seed (default 12345) · Max cycles · Simulate
4. Sensitivity     → if Sensitivity: block present
5. Export          → Excel / PNG as needed (seed is logged)
```

**Tagline:** AI-agent of Daniel W. Halpin's CYCLONE  
**Method:** structured prompt → CYCLONE network → discrete-event simulation  
**Spirit:** educational, Halpin-first, clear flow and idleness

---

*End of User Manual v1.3.1*
