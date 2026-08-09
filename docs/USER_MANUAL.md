# Neo-CYCLONE User Manual

**AI-Assisted Construction Operation Simulation**  
**AI-agent of Daniel W. Halpin's CYCLONE**  
Manual version **1.6**

---

# Part I — Getting oriented

## Chapter 1 — Introduction

### 1.1 Purpose

Neo-CYCLONE is **AI-Assisted Construction Operation Simulation** — an **educational web app** for modeling and simulating **repetitive construction operations** in the spirit of Professor **Daniel W. Halpin’s CYCLONE** (*CYCLic Operations NEtwork*).

It is meant for first contact with construction operations as flow, measuring idleness, connecting process design to Lean Construction / Project Production Management, and learning classic MicroCYCLONE ideas without old desktop software.

It is **not** a special-purpose industrial factory controller. It is a **teaching studio**.

### 1.2 Why this exists (dedication)

This product is a **tribute to Professor Daniel W. Halpin**.

Through his teaching and work, many students first met flow, idleness, and CYCLONE as a simple network language for cyclic construction work.

Historical line: **CYCLONE** (methodology), **MicroCYCLONE** (early computer tool), then DISCO, PROSIDYC, COST, WebCYCLONE, Simphony / Symphony.Net, and related systems.

Halpin’s foundation is not obsolete in the age of AI — it is the **grammar** that lets us describe an operation clearly enough that a machine can build a model and run a simulation.

### 1.3 Approach — is this an “AI agent”?

| Term | Meaning |
|------|--------|
| **Product term** | **AI-Assisted Construction Operation Simulation** |
| **Dedication** | AI-agent of Daniel W. Halpin's CYCLONE |
| **Practice** | Prompt-first → **Draw Model** → check network → **Simulate** → optional **AI Assistant** |

You need only a browser (the live app on Vercel). No local install for normal use.

### 1.4 Studio layout

- **Left:** Prompt · Example · Draw Model · Format Prompt
- **Right:** CYCLONE Model · network logic · run parameters
- **Below:** Results — Simulation · Sensitivity Analysis · AI Assistant

---

# Part II — How to use

## Chapter 2 — How-to

1. Select an Example (fills prompt only) or write a Format Prompt.
2. Click **Draw Model** — inspect cycles, meetings, counter.
3. Set max cycles (default 100, max 500) and seed (default 12345).
4. Click **Simulate** — productivity, waste, cost.
5. Optional Sensitivity tab, AI Assistant, and Excel / PNG export.

---

# Part III — Teaching examples

## Chapter 3 — Six Examples

1. Earthmoving — classic fleet; cost; steady state
2. Asphalt Paving — branch probability
3. Loading Dump Truck — GEN / CON
4. Tower Crane — multi-demand, Priority, multi-counter
5. Masonry — face stocks; sensitivity intro
6. Precast Plant — Halpin Ch.14-style + complex SA

---

# Part IV — Format Prompt & rules

## Chapter 4 — Format Prompt

Block order: **Network → Durations → Priority → Branch → Cost → Sensitivity**. Comments `#`/`//` ignored. Time: minutes. Cost: USD/h.

```
Trucks: Load → Haul → Dump → Return
Loader: Load
5 trucks, 1 loader
Counter after: Dump
production = 12 m3

Durations:
Load: tri 1.2, 1.8, 2.5
Haul: normal 8, 1.2

Cost:
Trucks: 85
Loader: 120

Sensitivity:
Trucks: 2..12
Loader: 1..3
```

- Sequence: `→` `->` `-->` `=>`
- Multi-demand: `A | B | C` + optional Priority (lower = higher)
- Inline GEN/CON: `Trucks: GEN 5 → Scoop → CON 5 TruckFull → …`
- Branch: `After X: OutA p=0.9, OutB p=0.1`

### Duration distributions (minutes)

| Kind | Syntax | Notes |
|------|--------|--------|
| constant | `const 1.2` | fixed |
| uniform | `unif 2, 5` | min, max |
| triangular | `tri 1.5, 2, 3` | min, mode, max (expert 3-point) |
| normal | `normal 8, 1.5` | mean, sd |
| lognormal | `lognormal 8, 1.5` | mean, sd of duration |
| **beta** | `beta 1, 5, 2, 5` | **min, max, α, β** (4-param) |
| **pert** | `pert 4, 6, 10` | **a, m, b** → classic PERT-beta on [a,b] |
| gamma | `gamma 4, 1.2` | shape, scale |

Aliases: `pert` = `beta-pert` = `betapert`. Writing `beta` with only three numbers is also treated as PERT (a, m, b).

## Chapter 5 — Modeling rules
1. Home QUEUE per resource. 2. ≥2 resources → COMBI; one → NORMAL. 3. Return (dashed gold) only to home QUEUE. 4. Forward = solid black. 5. GEN/CON on scaling chain. 6. Grid layout: tasks ordered, then queues, counter at end.

## Chapter 6 — Results
Production by cycle · steady state (5%, ≥10 cycles) · idleness · cost · sensitivity · Excel/PNG.

## Chapter 7 — AI Assistant

Educational **co-pilot** bound to the current Format Prompt, drawn network, and last simulation/sensitivity results—not a black-box simulator.

### 7.1 Purpose
- Stay grounded — current prompt, network, last-run metrics only
- Teach Halpin ideas — flow, home-QUEUE idleness (waste), steady state, unit cost, GEN/CON, priority
- Propose safe edits — full Format Prompt suggestion; **you** Apply → Draw Model → Simulate
- Reduce friction — fleet counts, bottleneck, productivity without leaving the studio

The assistant does **not** replace the deterministic CYCLONE engine. Simulation always runs in local code after **Simulate**.

### 7.2 Technology
- **AI mode** — when `XAI_API_KEY` is set (e.g. on Vercel): xAI chat model with a studio context snapshot
- **Local mode** — no API key: rule-based intent matching; **English-first** replies
- **Language** — UI, Manual, Format Prompt keywords, and local replies are English-first

### 7.3 What it can do
- Explain resource cycles, COMBI vs NORMAL, counter, GEN/CON, branch probability
- Report fleet counts from the Format Prompt
- Interpret last-run productivity, steady state, unit cost, idleness / busy
- Identify a likely bottleneck
- Propose Format Prompt edits — applied only after Apply prompt

### 7.4 What it cannot do
- Claim a simulation already re-ran after an edit
- Invent a different operation as “current”
- Replace CYCLONE logic with black-box AI simulation
- Answer unrelated topics
- Apply prompt changes without confirmation

### 7.5 Recommended questions
- Explain this model’s resource cycles.
- How many of each resource are in the Format Prompt?
- Which resource is the bottleneck?
- What was last-run productivity (units/hour)?
- Set trucks to 8.

### 7.6 Boundary
Answers only about the **current** Format Prompt, drawn network, and **last** results. May **propose** edits; you must **Apply**, **Draw Model**, and **Simulate**.

### 7.7 Typical workflow
1. Example or Format Prompt → Draw Model → Simulate.
2. Open AI Assistant under Results.
3. Ask about productivity, idleness, or bottleneck.
4. If a prompt is proposed → Apply → Draw → Simulate again.

## Chapter 8 — Limits & deploy
Max cycles 100 default / 500 max; seed 12345. Deploy: GitHub main → Vercel. Optional `XAI_API_KEY` for full AI Assistant mode.

## Chapter 9 — References

Selected works on **CYCLONE**, **MicroCYCLONE**, and applications from **Daniel W. Halpin**, his students, and collaborators.

1. Halpin, D. W. (1973). Ph.D. dissertation, University of Illinois at Urbana–Champaign.
2. Halpin, D. W. (1977). “CYCLONE: Method for Modeling of Job Site Processes.” *J. Constr. Div.*, ASCE, 103(3), 489–499.
3. Halpin, D. W., & Riggs, L. S. (1992). *Planning and Analysis of Construction Operations*. Wiley.
4. Lluch, J., & Halpin, D. W. (1982). MicroCYCLONE. *J. Constr. Div.*, ASCE.
5. Huang, R.-Y., & Halpin, D. W. DISCO papers.
6. Halpin, D. W., Jen, H., & Kim, J. (2003). WebCYCLONE. *WSC*.
7. AbouRizk, STROBOSCOPE, Simphony lineage.

Neo-CYCLONE does **not** replace those systems. Full bibliography may be expanded in the repository.
