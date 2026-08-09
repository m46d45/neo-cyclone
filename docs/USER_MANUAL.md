# Neo-CYCLONE — User Manual

| | |
|--|--|
| **Version** | 1.6.1 |
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
| **AI Assistant (Ch. 7)** | Studio-bound co-pilot: explain results, bottleneck, propose prompt edits (Apply required) | Autonomous agent that runs simulations without you |
| **Product term** | **AI-Assisted Construction Operation Simulation** | Black-box industrial controller |
| **Dedication** | “AI-agent of Daniel W. Halpin's CYCLONE” | Substitute for Halpin’s methodology |

**In practice:** (1) structured prompt (2) **Draw Model** (3) inspect cycles (4) **Simulate** (5) optional AI Assistant under Results.

### 1.5 Studio layout

| Area | Role |
|------|------|
| **Left** | Prompt · Example · Draw Model · Format Prompt |
| **Right** | CYCLONE Model · network logic · run parameters |
| **Below** | Results: Simulation · Sensitivity Analysis · **AI Assistant** |

---

# Part II — How to use

## Chapter 2 — How-to

### 2.1 Fast path
1. Example → e.g. Earthmoving. 2. **Draw Model**. 3. Check QUEUEs / tasks / counter. 4. Max cycles (default 100, max 500), seed 12345. 5. **Simulate**. 6. Optional Excel / PNG. 7. Optional **AI Assistant** questions.

### 2.2 Own operation
Write Format Prompt (Chapter 4) → Draw → fix → Simulate → optional Cost / Sensitivity → optional AI Assistant.

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

The studio includes an **AI Assistant** panel (below Results after you work with a model). It is an **educational co-pilot**, not an autonomous simulator.

### 7.1 Purpose

| Goal | Meaning |
|------|---------|
| **Stay grounded** | Answers refer to the *current* Format Prompt, drawn CYCLONE network, and last simulation / sensitivity results |
| **Teach Halpin ideas** | Flow, home-QUEUE idleness (waste), steady state, unit cost, GEN/CON, priority |
| **Propose safe edits** | Suggest a full updated Format Prompt; **you** Apply → Draw Model → Simulate |
| **Reduce friction** | Quick checks (fleet counts, bottleneck, productivity) without leaving the studio |

The assistant does **not** replace the deterministic CYCLONE engine. Simulation always runs in local code after **Simulate**.

### 7.2 Technology

| Mode | When | Behavior |
|------|------|----------|
| **AI mode** | Environment variable `XAI_API_KEY` is set on the host (e.g. Vercel) | Calls an xAI chat model with a **studio context snapshot** (prompt summary, network stats, last-run metrics). Returns structured JSON: `reply`, optional `proposedPrompt`, `suggestSimulate` |
| **Local mode** | No API key (or API failure) | Rule-based intent matching (English-first). Understands common intents; replies in **English** |

**Language policy (international product):** UI, Manual, Format Prompt keywords, and local-mode replies are **English-first**. With AI mode, the model *prefers English* and may follow the user’s language only when it is clearly written in another language.

**Context bound to the studio:** the assistant receives a compact snapshot of prompt, model readiness, cycles, productivity, idleness, and cost—not the whole internet and not a different operation unless you ask to draft a new one.

### 7.3 What it can do

- Explain the current model’s resource cycles, COMBI vs NORMAL, counter placement, GEN/CON, branch probability
- Report fleet counts from the Format Prompt (e.g. `5 trucks, 1 loader`)
- Interpret **last-run** productivity, steady state, unit cost, and **resource idleness / busy**
- Identify a likely **bottleneck** (high idle vs high busy) from simulation stats
- **Propose** Format Prompt edits (fleet size, durations, cost, sensitivity ranges)—only applied after **Apply prompt**
- Answer teaching questions about CYCLONE concepts *in the context of the open model*

### 7.4 What it cannot / must not do

| Out of scope | Why |
|--------------|-----|
| Claim a simulation already re-ran after an edit | You must **Draw Model** and **Simulate** |
| Invent a different operation as if it were the current one | Context is the open prompt/network |
| Replace CYCLONE logic with a black-box “AI simulation” | Engine is deterministic discrete-event code |
| Answer unrelated topics (general coding, legal, safety certification, etc.) | Studio co-pilot only |
| Apply prompt changes without your confirmation | Educational control: **Apply** is explicit |
| Guarantee optimal fleet design without runs | Suggestions are guidance; numbers come from Simulate / Sensitivity |

### 7.5 Recommended questions

Use questions like these so answers stay useful and on-topic.

**Model understanding**
- Explain this model’s resource cycles.
- Which tasks are COMBI and which are NORMAL?
- Where is the production counter, and what does one cycle mean?
- How do GEN and CON work in this model?
- Is there a branch / probability path? What does it represent?

**Fleet & resources**
- How many of each resource are in the Format Prompt?
- Which resource has the highest idleness (waste)?
- Which resource is the busiest?
- What is the likely bottleneck resource?

**Simulation results**
- What was last-run productivity (units/hour)?
- Has the system reached steady state?
- What is the unit cost (USD)?
- Show resource idleness / busy percentages.

**Prompt edits (propose → Apply)**
- Set trucks to 8.
- Increase loaders to 2.
- Change a task duration distribution.
- Adjust Cost or Sensitivity ranges.

**Sensitivity (after SA has been run)**
- Which fleet combination had the best unit cost?
- Which combination had the highest productivity?

**Teaching**
- What is home-QUEUE idleness and why is it waste?
- Why must every resource have a queue in a CYCLONE cycle?

### 7.6 Boundary (one line)

> The AI Assistant answers only about the **current** Format Prompt, drawn CYCLONE network, and **last** simulation/sensitivity results. It may **propose** Format Prompt edits; you must **Apply**, **Draw Model**, and **Simulate** for changes to take effect.

### 7.7 Typical workflow with the Assistant

1. Select Example or write Format Prompt → **Draw Model** → **Simulate**.
2. Open **AI Assistant** under Results.
3. Ask about productivity, idleness, or bottleneck.
4. If it proposes a new prompt → **Apply prompt** → **Draw Model** → **Simulate** again.
5. Optional: Sensitivity tab for fleet comparisons.

---

## Chapter 8 — Limits & deploy
Max cycles default 100 / max 500 · seed 12345 · GitHub main → Vercel. Optional `XAI_API_KEY` on Vercel for full AI Assistant mode.

---

## Chapter 9 — References

Selected literature on **CYCLONE**, **MicroCYCLONE**, and applications by **Daniel W. Halpin**, students, and collaborators.

### 9.1 Foundations
1. **Halpin, D. W.** (1973). *An Investigation of the Use of Simulation Networks for Modeling Construction Operations*. Ph.D., University of Illinois at Urbana–Champaign.
2. **Halpin, D. W.** (1977). “CYCLONE: Method for Modeling of Job Site Processes.” *J. Constr. Div.*, ASCE, 103(3), 489–499.
3. **Halpin, D. W., & Riggs, L. S.** (1992). *Planning and Analysis of Construction Operations*. Wiley. ISBN 0-471-55510-X.

### 9.2 MicroCYCLONE
4. **Lluch, J., & Halpin, D. W.** (1982). “Construction Operations and Microcomputers.” *J. Constr. Div.*, ASCE, 108(1), 129–145.
5. **Halpin, D. W.** (1990). *MicroCYCLONE User’s Manual*. Purdue University.
6. **Halpin, D. W.** (1990). *MicroCYCLONE System Manual*. Purdue University.
7. **Halpin, D. W.** (1992). *MicroCYCLONE Users Manual for Construction Operations*. Learning Systems / Purdue.

### 9.3 DISCO
8. **Huang, R.-Y., & Halpin, D. W.** (1993). “DISCO.” *10th ISARC*, Houston, 503–510.
9. **Huang, R.-Y., & Halpin, D. W.** (1994). “Visual Construction Operation Simulation: The DISCO Approach.” *Microcomputers in Civil Engineering*, 9(3), 175–184.
10. **Huang, R.-Y.** (1994). Ph.D. dissertation, Purdue (advisor: Halpin).
11. **Huang, R.-Y., & Halpin, D. W.** (1995). *J. Constr. Eng. Manage.*, ASCE, 121(2), 222–229.
12. **Huang, R.-Y., Grigoriadis, A. M., & Halpin, D. W.** (1994). “Simulation of Cable-Stayed Bridges Using DISCO.” *WSC*, 1130–1136.

### 9.4 PROSIDYC · COST · WebCYCLONE
13. **Halpin, D. W., & Martinez, L.-H.** (1999). “Real World Applications of Construction Process Simulation.” *WSC*, 956–962. (PROSIDYC)
14. **Cheng, T.-M., Wu, H.-T., & Tseng, Y.-W.** (2000). “COST.” *17th ISARC*, 999–1004.
15. **Halpin, D. W., Jen, H., & Kim, J.** (2003). “A Construction Process Simulation Web Service.” *WSC*, 1503–1509. (WebCYCLONE)

### 9.5 Purdue / Halpin-circle
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

### 9.6 Related lineage
26. **Ioannou, P. G.** (1989). UM-CYCLONE.
27. **Liu, L. Y., & Ioannou, P. G.** (1992). COOPS line.
28. **Martinez, J. C.** (1996). STROBOSCOPE.
29. **Hajjar, D., & AbouRizk, S. M.** (1999). Simphony. *WSC*, 998–1006.
30. **AbouRizk, S., Hague, S., Ekyalimpa, R., & Newstead, S.** (2016). *Journal of Simulation*, 10(3), 207–215.

### 9.7 Relation
Neo-CYCLONE does **not** replace MicroCYCLONE, DISCO, COST, WebCYCLONE, or Simphony. It is **AI-Assisted Construction Operation Simulation** — an educational studio that keeps Halpin’s modeling grammar visible.

---

**Product:** AI-Assisted Construction Operation Simulation  
**Dedication:** AI-agent of Daniel W. Halpin's CYCLONE  
**Method:** structured prompt → CYCLONE network → discrete-event simulation · optional AI Assistant co-pilot

*End of User Manual v1.6.1*
