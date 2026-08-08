# Neo-CYCLONE — User Manual

**Version:** 0.8  
**Language:** English  
**Tagline:** AI-agent of Daniel W. Halpin's CYCLONE

---

## Preface — Why Neo-CYCLONE

This work is first of all a **tribute to Professor Daniel W. Halpin**.

I am a construction management educator and researcher who studied under Professor Halpin and also had the privilege of working for him. Through him I first met **construction operations** as a serious subject: the idea that production on site is a **flow**, and that **idleness** (waiting, waste) is not an accident but something we can see, model, and improve. That way of seeing construction shaped how I think about process design.

### CYCLONE as model, MicroCYCLONE as early application

In the literature, it is important to keep two layers distinct:

| Layer | What it is |
|-------|------------|
| **CYCLONE** | The **modeling methodology** — *CYCLic Operations NEtwork* (also written CYCLic Operation Networks) — introduced by Halpin in the 1970s (commonly cited from the mid‑1970s, including work with Woodhead and the 1977 job-site process paper). It defines the conceptual building blocks (queues, constrained and unconstrained work, counters, cyclic resource logic) for construction operations. |
| **MicroCYCLONE** | An early **computer application** of that methodology: a microcomputer-based discrete-event / Monte Carlo system (process-interaction style) with user manuals from Purdue (e.g. Halpin, *MicroCYCLONE System / User’s Manual*, ~1990). It made CYCLONE models runnable on personal computers and became a main teaching and research vehicle in academia. |

In short: **CYCLONE is the model; MicroCYCLONE was a principal early software embodiment.** Later systems did not replace the model so much as **extend platforms and interfaces** around the same cyclic-network idea—for example **DISCO** (graphical pre/post processing often used with MicroCYCLONE), **PROSIDYC**, **COST**, **WebCYCLONE**, and related teaching or industry-oriented environments such as **Symphony.Net**, among others developed with students and colleagues. Many other construction simulators (e.g. INSIGHT, UM-CYCLONE, COOPS, STROBOSCOPE) also employ CYCLONE or CYCLONE-like building blocks.

Those systems were hard-won: built when explaining operations, queues, and simulation to students and industry was already an uphill fight.

**Neo-CYCLONE is not a special-purpose industrial simulator** meant to replace research-grade or commercial engines. Its purpose is **education** and **first contact**:

- to introduce construction **operations**;
- to show why **simulation** belongs in the design of construction processes;
- to connect that design thinking to **Lean Construction** and **Project Production Management**, where flow, cycle time, utilization, and waste are central.

**What you should leave with:** after a short session, you can state one resource cycle (home queue → work → return), read idleness and utilization from the results, and see why process design matters before “optimizing” with more technology.

I know how scarce this literacy still is. Even today, the importance of operations and of simulation for high-performing construction is too little known, too little taught, and too rarely implemented. Looking back, one might even feel that the struggle of the 1970s and after—to put CYCLONE and MicroCYCLONE in front of students and practitioners—was somehow made obsolete by AI. **It was not wasted.**

That work laid a **foundation**. Without clear concepts of resources, queues, constrained work, cycles, and production, “AI for construction simulation” would have nothing solid to stand on. Halpin’s legacy is what makes it possible, now and in the future, to use AI **with** rigorous operations models rather than instead of them.

Neo-CYCLONE is my way of looking back with gratitude—and looking forward: an **AI-assisted** doorway into the same Halpin tradition—**the CYCLONE model**, first widely practiced through **MicroCYCLONE** and then through its descendants—so that the next generation can learn faster, go deeper, and still respect the craft of modeling construction as a production system.

### Selected literature anchors (for readers)

- Halpin, D. W. — CYCLONE methodology for job-site / cyclic construction operations (1970s; e.g. J. Constr. Div. / related publications).  
- Halpin, D. W., & Woodhead, R. W. — construction operations / planning texts of the same era.  
- Halpin, D. W. — *MicroCYCLONE* system / user’s manuals, Purdue University (c. 1990).  
- Halpin, D. W., & Riggs, L. S. — *Planning and Analysis of Construction Operations* (Wiley, 1992) — standard teaching reference for CYCLONE-style models.  
- Later CYCLONE-format tools and services: DISCO, PROSIDYC, COST, WebCYCLONE, and related systems in the construction simulation literature.

---

## 1. Workflow

1. Write the **prompt** for your construction operation.  
2. **Draw Model** → inspect the **CYCLONE Model** diagram.  
3. Refine the prompt and redraw until the network is correct.  
4. Set **max cycles**, **seed** (default **12345**), and **max time**.  
5. **Simulate** → read **Results**.

---

## 2. Time unit

**Default: minutes** for all activity durations.  
Model field: `time_unit: min` unless overridden in the DSL.

---

## 3. Prompt format (general)

```text
Resource1: Task1 → Task2 → Task3 → …
Resource2: Task1

n Resource1 = …, n Resource2 = …
production = … <unit>

Durations:   # minutes
Task1: <dist> <params>
…
```

Notes: lines starting with `#` or `//` are ignored.

### Distributions

| Dist | Parameters |
|------|------------|
| const | value |
| unif | min, max |
| tri | min, mode, max |
| normal | mean, sd |
| lognormal | mean, sd (of duration) |
| beta | min, max, alpha, beta |
| gamma | shape, scale · or `gamma mean M sd S` |

---

## 4. Run parameters (before Simulate)

| Parameter | Default | Notes |
|-----------|---------|--------|
| Max cycles | model default | Stop when COUNTER reaches this (or max time) |
| Seed | **12345** | RNG reproducibility |
| Max time | e.g. 480 | Minutes |

---

## 5. Results

Summary: cycles completed, production, productivity, average cycle, seed, simulation time.

Tabs:

- **Utilization** — bar chart with % labels  
- **Cycles & production** — cumulative production vs cycle  
- **Productivity** — rate vs time (minutes)  
- **Queues** — avg / max length  

---

## 6. Modeling rule (Halpin)

Each resource has a home QUEUE, works through its tasks, and returns home.  
Shared first tasks are COMBI meetings; later tasks are NORMAL.

---

## 7. Notation

QUEUE = Q-circle · COMBI = cut corner · NORMAL = rectangle · COUNTER = golf flag · return arcs = curved gold dashed.

---

## 8. Product intent (summary)

| This is | This is not |
|---------|-------------|
| Educational first contact with the **CYCLONE model** | A full special-purpose industrial simulator |
| AI-assisted heir to the **MicroCYCLONE** teaching tradition | A drop-in replacement of MicroCYCLONE / DISCO / WebCYCLONE |
| A tribute to Halpin’s methodology and teaching | AI without operations theory |

---

*AI-agent of Daniel W. Halpin's CYCLONE*
