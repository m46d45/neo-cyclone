# Neo-CYCLONE — User Manual

**Version:** 0.11  
**Language:** English  
**Tagline:** AI-agent of Daniel W. Halpin's CYCLONE

---

## Preface — Why Neo-CYCLONE

This work is a **tribute to Professor Daniel W. Halpin**.

I am a construction management educator and researcher who studied under Professor Halpin and also worked for him. Through him I first met **construction operations** as a serious subject: production on site as a **flow**, and **idleness** (waiting, waste) as something we can see, model, and improve.

### CYCLONE as model, MicroCYCLONE as early application

| Layer | What it is |
|-------|------------|
| **CYCLONE** | The **modeling methodology** (*CYCLic Operations NEtwork*), introduced by Halpin in the 1970s. Building blocks: queues, constrained and unconstrained work, counters, cyclic resource logic. |
| **MicroCYCLONE** | An early **computer application** of that methodology: microcomputer discrete-event / Monte Carlo simulation (Purdue manuals, c. 1990). It made CYCLONE models runnable on personal computers and became a main teaching vehicle. |

Later systems extended platforms around the same idea—**DISCO**, **PROSIDYC**, **COST**, **WebCYCLONE**, **Symphony.Net**, and others developed with students and colleagues—rather than replacing the model itself.

**Neo-CYCLONE** is for **education** and **first contact**, not a special-purpose industrial simulator:

- introduce construction **operations**;
- show why **simulation** belongs in process design;
- connect to **Lean Construction** and **Project Production Management** (flow, cycle time, utilization, waste).

**What you should leave with:** one clear resource cycle (home queue → work → return), a reading of idleness and utilization, and a sense that process design matters before “optimizing” with more technology.

This literacy is still scarce. The long effort to teach CYCLONE and MicroCYCLONE was not made obsolete by AI—it laid the **foundation**. Without resources, queues, constrained work, cycles, and production as clear concepts, AI for construction simulation would have little to stand on. Neo-CYCLONE is an **AI-assisted** doorway into that same tradition: learn faster, go deeper, and keep modeling construction as a production system.

### Selected literature anchors

- Halpin, D. W. — CYCLONE methodology (1970s).  
- Halpin, D. W., & Woodhead, R. W. — construction operations texts of the same era.  
- Halpin, D. W. — *MicroCYCLONE* manuals, Purdue University (c. 1990).  
- Halpin, D. W., & Riggs, L. S. — *Planning and Analysis of Construction Operations* (Wiley, 1992).  
- Later CYCLONE-format tools: DISCO, PROSIDYC, COST, WebCYCLONE, and related systems.

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

## 5. Results (MicroCYCLONE-style)

Outputs follow the classic MicroCYCLONE report structure (Halpin / teaching tradition):

### Process Report

| Field | Meaning |
|-------|---------|
| Run length | Simulation clock at stop |
| Number of cycles | COUNTER completions |
| Units per cycle | Production amount per counter pass |
| Total production | Cumulative units produced |
| Units produced per hour | Productivity (Halpin summary form) |
| Avg cycle time | Mean time between counter passes |

### Report by Element

- **COMBI / NORMAL:** times activated, mean duration, avg inter-arrival, avg units at task, **% time in operation**
- **QUEUE:** initial units, avg wait time, avg/max units, units at end, **% occupied**, departures
- **COUNTER:** units through, total production, avg time between units, first passage time

### Production by Cycle

Table: cycle #, simulation time at completion, cumulative production, cumulative units/hour — to observe startup → steady state.

Charts: % time in operation; cumulative production / units per hour vs cycle.

---

## 6. Modeling rule (Halpin)

Each resource has a home QUEUE, works through its tasks, and returns home.  
Shared first tasks are COMBI meetings; later tasks are NORMAL.

---

## 7. Notation

QUEUE = Q-circle · COMBI = cut corner · NORMAL = rectangle · COUNTER = golf flag · return arcs = curved gold dashed.

---

## 8. Product intent

| This is | This is not |
|---------|-------------|
| Educational first contact with the **CYCLONE model** | A full special-purpose industrial simulator |
| AI-assisted heir to the **MicroCYCLONE** teaching tradition | A drop-in replacement of MicroCYCLONE / DISCO / WebCYCLONE |

---

## 9. Teaching examples (presets)

Five copy-paste prompts are built into the app (**Example** dropdown next to the prompt box).  
They are simplified Halpin / MicroCYCLONE-style operations for education and regression testing — not full textbook figures.

| # | Id | Goal | Notes |
|---|-----|------|--------|
| 1 | `earthmoving` | Loader + trucks; cost; sensitivity; steady state | Default preset |
| 2 | `asphalt-paving` | Paver + trucks | Multi-step haul |
| 3 | `concrete-crane` | Crane + trucks | Classic GEN/CON scale **later** (Phase B); simplified 1:1 pour cycle for now |
| 4 | `precast-forms` | Forms + crew | Longer form cycle |
| 5 | `masonry` | Masons + helpers + scaffold | **3 resources** → pairwise sensitivity |

### Modeling notes

- **GEN** and **CON** are independent Halpin functions. Use them only when production-unit logic requires multiplying or aggregating flow units. Many models need neither.
- **Example 3** comments document the classic truck↔bucket GEN/CON pair; the current engine runs the simplified cycle without GEN/CON.
- **Example 5** exercises pairwise sensitivity (3 resources in the `Sensitivity:` block).

### How to use

1. Choose an example from the dropdown (prompt fills automatically).  
2. **Draw Model** → check the CYCLONE diagram.  
3. Adjust counts, durations, or sensitivity ranges if desired.  
4. **Simulate** → compare Process / Element / cost / sensitivity reports.

Full prompt texts live in source: `src/lib/cyclone/example-prompts.ts`.

---

*AI-agent of Daniel W. Halpin's CYCLONE*
