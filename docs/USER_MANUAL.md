# Neo-CYCLONE — User Manual

**Version:** 0.7  
**Language:** English  
**Tagline:** AI-agent of Daniel W. Halpin's CYCLONE

---

## Preface — Why Neo-CYCLONE

This work is first of all a **tribute to Professor Daniel W. Halpin**.

I am a construction management educator and researcher who studied under Professor Halpin and also had the privilege of working for him. Through him I first met **construction operations** as a serious subject: the idea that production on site is a **flow**, and that **idleness** (waiting, waste) is not an accident but something we can see, model, and improve. That way of seeing construction shaped how I think about process design.

Professor Halpin did not stop at a single program. His long effort to make cyclic simulation practical—and the work continued with students and colleagues—grew into a family of tools and teaching systems. At the core stands **CYCLONE**, with later and related lines of development such as **MicroCYCLONE**, **DISCO**, **Symphony.Net**, **PROSIDYC**, **COST**, and **WebCYCLONE**. Those systems were hard-won: built in an era when explaining operations, queues, and simulation to students and industry was already an uphill fight.

**Neo-CYCLONE is not a special-purpose industrial simulator** meant to replace research-grade or commercial engines. Its purpose is **education** and **first contact**:

- to introduce construction **operations**;
- to show why **simulation** belongs in the design of construction processes;
- to connect that design thinking to **Lean Construction** and **Project Production Management**, where flow, cycle time, utilization, and waste are central.

**What you should leave with:** after a short session, you can state one resource cycle (home queue → work → return), read idleness and utilization from the results, and see why process design matters before “optimizing” with more technology.

I know how scarce this literacy still is. Even today, the importance of operations and of simulation for high-performing construction is too little known, too little taught, and too rarely implemented. Looking back, one might even feel that the struggle of the 1970s and after—to put CYCLONE and its descendants in front of students and practitioners—was somehow made obsolete by AI. **It was not wasted.**

That work laid a **foundation**. Without clear concepts of resources, queues, constrained work, cycles, and production, “AI for construction simulation” would have nothing solid to stand on. Halpin’s legacy is what makes it possible, now and in the future, to use AI **with** rigorous operations models rather than instead of them.

Neo-CYCLONE is my way of looking back with gratitude—and looking forward: an **AI-assisted** doorway into the same Halpin tradition, so that the next generation can learn faster, go deeper, and still respect the craft of modeling construction as a production system.

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
| Educational first contact with construction operations & CYCLONE | A full special-purpose industrial simulator |
| A tribute to Halpin’s methodology and teaching | A replacement of MicroCYCLONE / DISCO / WebCYCLONE / research-grade engines |
| AI-assisted modeling on a clear conceptual foundation | AI without operations theory |

---

*AI-agent of Daniel W. Halpin's CYCLONE*
