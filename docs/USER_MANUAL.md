# Neo-CYCLONE — User Manual

| | |
|--|--|
| **Version** | 1.4.1 |
| **Language** | English |
| **Product** | AI-Assisted Construction Operation Simulation |
| **Dedication** | AI-agent of Daniel W. Halpin's CYCLONE |
| **Live app** | [neo-cyclone.vercel.app](https://neo-cyclone.vercel.app/) |
| **Notation reference** | [NOTATION_STANDARD.md](./NOTATION_STANDARD.md) |

---

# Part I — Getting oriented

## Chapter 1 — Introduction

### 1.1 Purpose

Neo-CYCLONE is **AI-Assisted Construction Operation Simulation** — an **educational web app** for modeling and simulating **repetitive construction operations** using the spirit of Professor **Daniel W. Halpin’s CYCLONE** (*CYCLic Operations NEtwork*).

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

The historical line includes **CYCLONE** (methodology), **MicroCYCLONE** (early computer tool), then systems such as DISCO, PROSIDYC, COST, WebCYCLONE, Simphony / Symphony.Net, and related tools.

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
| **Structured Format Prompt** | The **primary** way to define a model | Free chat that “guesses” a site plan |
| **Local builder / engine** | Deterministic: prompt → network → discrete-event simulation | A black-box neural simulator |
| **Optional AI assist** | Free text → draft DSL when not already structured | Autonomous planner replacing judgment |
| **Product term** | **AI-Assisted Construction Operation Simulation** | Industrial plant controller |
| **Dedication** | AI-agent of Daniel W. Halpin's CYCLONE | Substitute for Halpin’s methodology |

**In practice:** prompt-first → **Draw Model** → inspect → **Simulate**.

### 1.5 Studio layout

| Area | Role |
|------|------|
| **Left** | Prompt · Example · Draw Model · Format Prompt |
| **Right** | CYCLONE Model · network logic · run parameters |
| **Below** | Results: Simulation · Sensitivity Analysis |

---

# Part II — How to use

## Chapter 2 — How-to

1. Select **Example** or write Format Prompt.  
2. **Draw Model** → check cycles / meetings / counter.  
3. Max cycles (default **100**, max **500**), seed **12345**.  
4. **Simulate** → productivity, waste, cost.  
5. Optional Sensitivity + Excel / PNG export.

---

# Part III — Six Examples

| # | Name | Learn |
|---|------|-------|
| 1 | Earthmoving | Fleet, cost, steady state |
| 2 | Asphalt Paving | Branch probability |
| 3 | Loading Dump Truck | GEN / CON |
| 4 | Tower Crane | Multi-demand, Priority, multi-counter |
| 5 | Masonry | Face stocks; sensitivity |
| 6 | Precast Plant | Ch.14-style + complex SA |

---

# Part IV — Format Prompt & rules

Block order: **Network → Durations → Priority → Branch → Cost → Sensitivity**.  
Comments `#` / `//` ignored. Time: **minutes**. Cost: **USD**/h.

Full template: in-app Format Prompt and `GENERAL_TEMPLATE` in source.

Modeling rules: home QUEUE per resource; COMBI if ≥2 resources; return only to home QUEUE; GEN/CON optional on scaling chain.

---

## Chapter 6–7 — Results, limits, deploy

Production by cycle · steady state (5%, ≥10 cycles) · idleness · cost · sensitivity tabs.  
Deploy: GitHub `main` → [neo-cyclone.vercel.app](https://neo-cyclone.vercel.app/).

---

## Chapter 8 — References

### Foundations
1. Halpin, D. W. (1973). Ph.D. dissertation, University of Illinois.  
2. Halpin, D. W. (1977). “CYCLONE…” *J. Constr. Div.*, ASCE, 103(3), 489–499.  
3. Halpin, D. W., & Riggs, L. S. (1992). *Planning and Analysis of Construction Operations*. Wiley.

### MicroCYCLONE
4. Lluch, J., & Halpin, D. W. (1982). *J. Constr. Div.*, ASCE, 108(1), 129–145.  
5–7. Halpin MicroCYCLONE manuals (1990–1992), Purdue / Learning Systems.

### DISCO
8–12. Huang & Halpin (1993–1995); Huang Ph.D. (1994); cable-stayed DISCO (WSC 1994).

### PROSIDYC · COST · WebCYCLONE
13. Halpin & Martinez (1999). WSC — PROSIDYC.  
14. Cheng et al. (2000). ISARC — COST.  
15. Halpin, Jen & Kim (2003). WSC — WebCYCLONE.

### Purdue circle & lineage
16–26. AbouRizk & Halpin; Hijazi; Lutz; Gonzalez-Quevedo; Abraham; project-level CYCLONE; AbouRizk et al. (2011).  
27–31. UM-CYCLONE; STROBOSCOPE; Simphony / Simphony.NET.

### Relation
Neo-CYCLONE is **AI-Assisted Construction Operation Simulation** — educational, not a replacement for MicroCYCLONE, DISCO, COST, WebCYCLONE, or Simphony.

---

**Product:** AI-Assisted Construction Operation Simulation  
**Dedication:** AI-agent of Daniel W. Halpin's CYCLONE

*End of User Manual v1.4.1*
