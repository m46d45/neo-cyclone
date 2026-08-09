# Neo-CYCLONE — User Manual

| | |
|--|--|
| **Version** | 1.5 |
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

| Layer | What it is | What it is *not* |
|-------|------------|------------------|
| **Structured Format Prompt** | The **primary** way to define a model: resource cycles, durations, priority, branch, cost, sensitivity | Free chat that “guesses” a site plan |
| **Local builder / engine** | Deterministic code: prompt → CYCLONE network → discrete-event simulation | A black-box neural simulator |
| **Optional AI assist** | Free-text → draft DSL when not already structured | Multi-agent planner replacing judgment |
| **Product term** | **AI-Assisted Construction Operation Simulation** | Black-box industrial controller |
| **Dedication** | “AI-agent of Daniel W. Halpin's CYCLONE” | Substitute for Halpin’s methodology |

**In practice:** (1) structured prompt (2) **Draw Model** (3) inspect cycles (4) **Simulate**.

### 1.5 Studio layout

| Area | Role |
|------|------|
| **Left** | Prompt · Example · Draw Model · Format Prompt |
| **Right** | CYCLONE Model · network logic · run parameters |
| **Below** | Results: Simulation · Sensitivity Analysis |

---

# Part II — How to use

## Chapter 2 — How-to

### 2.1 Fast path
1. Example → e.g. Earthmoving. 2. **Draw Model**. 3. Check QUEUEs / tasks / counter. 4. Max cycles (default 100, max 500), seed 12345. 5. **Simulate**. 6. Optional Excel / PNG.

### 2.2 Own operation
Write Format Prompt (Chapter 4) → Draw → fix → Simulate → optional Cost / Sensitivity.

### 2.3 Iterate before Simulate
Home QUEUE per resource? Multi-resource → COMBI? `Counter after:` exact? GEN/CON on scaling chain? Branch rejoins?

### 2.4 Sensitivity
When `Sensitivity:` present → Results → Sensitivity Analysis → pair charts + idleness tab.

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

## Chapter 5 — Modeling rules
1. Home QUEUE per resource. 2. ≥2 resources → COMBI; one → NORMAL. 3. Return (dashed gold) only to home QUEUE. 4. Forward = solid black. 5. GEN/CON on scaling chain. 6. Grid layout: tasks ordered, then queues, counter at end.

## Chapter 6 — Results
Production by cycle · steady state (5%, ≥10 cycles) · idleness · cost · sensitivity · Excel/PNG.

## Chapter 7 — Limits & deploy
Max cycles default 100 / max 500 · seed 12345 · GitHub main → Vercel.

---

## Chapter 8 — References

Selected literature on **CYCLONE**, **MicroCYCLONE**, and applications by **Daniel W. Halpin**, students, and collaborators.

### 8.1 Foundations
1. **Halpin, D. W.** (1973). *An Investigation of the Use of Simulation Networks for Modeling Construction Operations*. Ph.D., University of Illinois at Urbana–Champaign.
2. **Halpin, D. W.** (1977). “CYCLONE: Method for Modeling of Job Site Processes.” *J. Constr. Div.*, ASCE, 103(3), 489–499.
3. **Halpin, D. W., & Riggs, L. S.** (1992). *Planning and Analysis of Construction Operations*. Wiley. ISBN 0-471-55510-X.

### 8.2 MicroCYCLONE
4. **Lluch, J., & Halpin, D. W.** (1982). “Construction Operations and Microcomputers.” *J. Constr. Div.*, ASCE, 108(1), 129–145.
5. **Halpin, D. W.** (1990). *MicroCYCLONE User’s Manual*. Purdue University.
6. **Halpin, D. W.** (1990). *MicroCYCLONE System Manual*. Purdue University.
7. **Halpin, D. W.** (1992). *MicroCYCLONE Users Manual for Construction Operations*. Learning Systems / Purdue.

### 8.3 DISCO
8. **Huang, R.-Y., & Halpin, D. W.** (1993). “DISCO.” *10th ISARC*, Houston, 503–510.
9. **Huang, R.-Y., & Halpin, D. W.** (1994). “Visual Construction Operation Simulation: The DISCO Approach.” *Microcomputers in Civil Engineering*, 9(3), 175–184.
10. **Huang, R.-Y.** (1994). Ph.D. dissertation, Purdue (advisor: Halpin).
11. **Huang, R.-Y., & Halpin, D. W.** (1995). *J. Constr. Eng. Manage.*, ASCE, 121(2), 222–229.
12. **Huang, R.-Y., Grigoriadis, A. M., & Halpin, D. W.** (1994). “Simulation of Cable-Stayed Bridges Using DISCO.” *WSC*, 1130–1136.

### 8.4 PROSIDYC · COST · WebCYCLONE
13. **Halpin, D. W., & Martinez, L.-H.** (1999). “Real World Applications of Construction Process Simulation.” *WSC*, 956–962. (PROSIDYC)
14. **Cheng, T.-M., Wu, H.-T., & Tseng, Y.-W.** (2000). “COST.” *17th ISARC*, 999–1004.
15. **Halpin, D. W., Jen, H., & Kim, J.** (2003). “A Construction Process Simulation Web Service.” *WSC*, 1503–1509. (WebCYCLONE)

### 8.5 Purdue / Halpin-circle
16. **AbouRizk, S. M., & Halpin, D. W.** (1990). *J. Constr. Eng. Manage.*, 116(4), 575–594.
17. **AbouRizk, S. M., Gonzalez-Quevedo, A., & Halpin, D. W.** (1990). *Microcomputers in Civil Engineering*, 5, 299–306.
18. **Hijazi, A., AbouRizk, S. M., & Halpin, D. W.** (1992). *J. Constr. Eng. Manage.*, 118(4), 685–700.
19. **Lutz, J. D., Halpin, D. W., & Wilson, J. R.** (1994). *J. Constr. Eng. Manage.*, 120(4), 753–773.
20. **Gonzalez-Quevedo, A. A.** (c. 1991). *Sensitivity Analysis of Construction Simulation*. Ph.D., Purdue.
21. **Halpin, D. W., AbouRizk, S. M., & Hijazi, A. M.** (1989). Microcomputers in Civil Engineering conference, Orlando.
22. **Abraham, D. M., & Halpin, D. W.** (1998). *Can. J. Civ. Eng.*, 25(3), 490–499.
23. **Halpin, D. W., Sawhney, A., & AbouRizk, S. M.** (1998). *Can. J. Civ. Eng.*, 25(1), 16–25.
24. **Halpin, D. W.** (1998). Canadian Construction Research Forum, 33–41.
25. **AbouRizk, S., Halpin, D., Mohamed, Y., & Hermann, U.** (2011). *J. Constr. Eng. Manage.*, 137(10), 843–852.

### 8.6 Related lineage
26. **Ioannou, P. G.** (1989). UM-CYCLONE.
27. **Liu, L. Y., & Ioannou, P. G.** (1992). COOPS line.
28. **Martinez, J. C.** (1996). STROBOSCOPE.
29. **Hajjar, D., & AbouRizk, S. M.** (1999). Simphony. *WSC*, 998–1006.
30. **AbouRizk, S., Hague, S., Ekyalimpa, R., & Newstead, S.** (2016). *Journal of Simulation*, 10(3), 207–215.

### 8.7 Relation
Neo-CYCLONE does **not** replace MicroCYCLONE, DISCO, COST, WebCYCLONE, or Simphony. It is **AI-Assisted Construction Operation Simulation** — an educational studio that keeps Halpin’s modeling grammar visible.

---

**Product:** AI-Assisted Construction Operation Simulation  
**Dedication:** AI-agent of Daniel W. Halpin's CYCLONE  
**Method:** structured prompt → CYCLONE network → discrete-event simulation

*End of User Manual v1.5*
