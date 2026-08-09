# Neo-CYCLONE — User Manual

| | |
|--|--|
| **Version** | 1.4 |
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

---

# Part III — Teaching examples

## Chapter 3 — Six Examples

Use **Example** in this order for learning:

| # | Name | What you learn |
|---|------|----------------|
| **1** | **Earthmoving** | Classic loader + trucks; cost; steady-state productivity |
| **2** | **Asphalt Paving** | Branch probability (e.g. breakdown) and detour markers on charts |
| **3** | **Loading Dump Truck** | Inline **GEN / CON** (excavator scoops → truck full) |
| **4** | **Tower Crane** | Multi-demand `\|`, **Priority**, multiple counters |
| **5** | **Masonry** | Face stocks; GEN/CON on mortar place; **sensitivity** intro |
| **6** | **Precast Plant** | Halpin **Ch.14**-style multi-resource plant + **complex SA** |

Tips:

- Always **Draw Model** after selecting an example.  
- Read `#` comment lines in the prompt — they are notes only (ignored by the engine).  
- Compare diagram resource cycles to the Network logic panel under the model.

---

# Part IV — Format Prompt & modeling rules

## Chapter 4 — Format Prompt (structured text)

### 4.1 Block order (top → bottom)

| Order | Block | Required? |
|-------|--------|-----------|
| 1 | **Network** — resource cycles, counts, `Counter after:`, `production =` | Yes |
| 2 | **Durations** — every named task | Yes |
| 3 | **Priority** | Optional (shared resource contention) |
| 4 | **Branch** / optional Functions aliases | Optional |
| 5 | **Cost** (USD per resource-hour) | Optional |
| 6 | **Sensitivity** | Optional — usually **last** |

Comments: lines or tails with `#` or `//` are **ignored**.

Default time unit: **minutes**. Currency for cost: **USD**.

### 4.2 Resource cycles (network)

```
Trucks: Load → Haul → Dump → Return
Loader: Load
5 trucks, 1 loader

Counter after: Dump
production = 12 m3
```

| Syntax | Meaning |
|--------|---------|
| `A → B → C` | **Sequence** (same unit, in order) |
| `->` `-->` `=>` `→` | All accepted as arrows |
| `A \| B \| C` | **Multi-demand** — one home QUEUE may start A **or** B **or** C |
| `n Trucks = 5` or `5 trucks` | Initial units at home QUEUE |

### 4.3 Multi-demand `|` (standard)

```
1 Crane: LiftAtA | LiftAtB | LiftAtC
3 Helpers: ReceiveBrick | ReceiveMortar
```

Use **Priority:** when several demands wait (**lower number = higher priority**, MicroCYCLONE tradition).

### 4.4 GEN / CON (prefer **inline** on the chain)

```
Trucks: GEN 5 → Scoop → CON 5 TruckFull → Haul&Return
Excavator: Scoop
```

| Token | Meaning | Diagram |
|-------|---------|---------|
| `GEN 5` | 1 arrival → **5** units | Inverted triangle ▽ |
| `CON 5` or `CON 5 Name` | Gather **5** → release 1 | Upright triangle △ |

Optional legacy block:

```
Functions:
GEN PartsPool = 4
CON AssembleKit = 4
```

GEN and CON are **independent** and **optional** — use only when production logic needs scaling.

### 4.5 Branch (probability)

```
Branch:
After DumpToPaver: RefillAsphalt p=0.85, Breakdown p=0.15
```

Detours should rejoin the main path (e.g. Breakdown → RefillAsphalt).

### 4.6 Durations

```
Durations:
Load: tri 1.2, 1.8, 2.5
Haul: normal 8, 1.2
Dump: const 1
```

Distributions: **const · unif · tri · normal · lognormal · beta · gamma**.

### 4.7 Cost & sensitivity

```
Cost:
Trucks: 85
Loader: 120

Sensitivity:
Trucks: 2..12
Loader: 1..3
```

- Cost = USD / resource-hour while the simulation clock runs.  
- Sensitivity varies counts (step 1 by default).  
- **1–2** resources: full factorial.  
- **3–5** resources: **pairwise** (others fixed at baseline).  
- More than 5: teaching cap (first 5).

### 4.8 Production COUNTER

| | |
|--|--|
| Shape | Golf flag |
| One | `Counter after: Dump` |
| Many | `Counter after: LiftAtA, LiftAtB, LiftAtC` |
| Default | Last task of **first** resource if omitted |
| Names | **Exact** match (`Pave` ≠ `DumpToPaver`) |
| Stop rule | Total hits across counters ≥ max cycles |

---

## Chapter 5 — Modeling rules (Neo-CYCLONE)

1. Every resource has a **home QUEUE** (idle pool).  
2. Task used by **≥2 resources** → **COMBI**; one resource only → **NORMAL**.  
3. **Return** (dashed gold) only into a **home** QUEUE — not into staging or GEN.  
4. **Forward** (solid black) = work advances (may be curved).  
5. Staging `Resource @ Task` is still **forward**.  
6. GEN/CON sit on the **chain that scales units**, not on an unrelated helper.  
7. Diagram layout places **tasks on a grid (ordered)**, then **queues**, then **counter at the end** of the flow.

Full shapes and arrow rules: **[NOTATION_STANDARD.md](./NOTATION_STANDARD.md)**.

### 5.1 Notation (summary)

| Element | Drawing |
|---------|---------|
| QUEUE | Q-circle (slash) |
| GEN | Inverted triangle ▽ + `GEN k` |
| CON | Upright triangle △ + `CON n` |
| COMBI | Cut-corner square |
| NORMAL | Rectangle |
| COUNTER | Golf flag |

| Arrow | Look |
|-------|------|
| Forward | Solid black + tip |
| Return home | Dashed gold + tip |
| Branch | Label `p=…` |

---

## Chapter 6 — Results & exports

### 6.1 Simulation tab

| Block | Content |
|-------|---------|
| **Production by cycle** | Units/hour vs cycle; **dark gold** steady-state (5% rule, **≥10** consecutive cycles); **red** dots = branch detours |
| **Charts** | Utilization, idleness (busy vs idle %) |
| **Report by element** | Queues, activities (MicroCYCLONE-style teaching fields) |
| **Cost** | Per resource, total, unit cost (if Cost block present) |
| **Branches** | Declared vs empirical probability |

Y-axis on units/hour charts **scales to the data** (no empty tall chart when rates are small).

### 6.2 Sensitivity tab

| Sub-tab | Content |
|---------|---------|
| **Productivity & unit cost** | Pair charts + best markers + detail table |
| **Idleness & utilization** | Snapshot for best productivity combination |

### 6.3 Downloads

- **Excel** multi-sheet report  
- Chart **PNG**  
- Model diagram **PNG**  
- Zoom on diagram (+ / − / reset)

---

## Chapter 7 — Run limits & deploy

| Parameter | Default / limit |
|-----------|-----------------|
| Max cycles | Default **100**, product max **500** |
| Seed | Default **12345** |
| Max time | Auto-raised with cycle horizon (minutes) |
| Time unit in prompt | Minutes |

**Deploy:** GitHub `main` → Vercel production ([neo-cyclone.vercel.app](https://neo-cyclone.vercel.app/)).

---

## Chapter 8 — References

Selected literature on **CYCLONE**, **MicroCYCLONE**, and applications developed by **Daniel W. Halpin**, his students, and collaborators. Ordered roughly by lineage of tools and themes. This list is educational, not exhaustive.

### 8.1 Foundations — CYCLONE methodology

1. **Halpin, D. W.** (1973). *An Investigation of the Use of Simulation Networks for Modeling Construction Operations*. Ph.D. dissertation, University of Illinois at Urbana–Champaign.

2. **Halpin, D. W.** (1977). “CYCLONE: Method for Modeling of Job Site Processes.” *Journal of the Construction Division*, ASCE, 103(3), 489–499.

3. **Halpin, D. W., & Riggs, L. S.** (1992). *Planning and Analysis of Construction Operations*. New York: John Wiley & Sons. ISBN 0-471-55510-X.

### 8.2 MicroCYCLONE (microcomputer application)

4. **Lluch, J., & Halpin, D. W.** (1982). “Construction Operations and Microcomputers.” *Journal of the Construction Division*, ASCE, 108(1), 129–145.

5. **Halpin, D. W.** (1990). *MicroCYCLONE User’s Manual*. Division of Construction Engineering and Management, Purdue University, West Lafayette, IN.

6. **Halpin, D. W.** (1990). *MicroCYCLONE System Manual*. Division of Construction Engineering and Management, Purdue University, West Lafayette, IN.

7. **Halpin, D. W.** (1992). *MicroCYCLONE Users Manual for Construction Operations*. Learning Systems, Inc. / Purdue University, West Lafayette, IN.

### 8.3 DISCO — Dynamic Interface for Simulation of Construction Operations

8. **Huang, R.-Y., & Halpin, D. W.** (1993). “Dynamic Interface Simulation for Construction Operations (DISCO).” *Proceedings of the 10th ISARC*, Houston, USA, 503–510.

9. **Huang, R.-Y., & Halpin, D. W.** (1994). “Visual Construction Operation Simulation: The DISCO Approach.” *Microcomputers in Civil Engineering* (Computer-Aided Civil and Infrastructure Engineering), 9(3), 175–184.

10. **Huang, R.-Y.** (1994). *A Graphical-Based Method for Transient Evaluation of Construction Operations*. Ph.D. dissertation, Purdue University (advisor: D. W. Halpin).

11. **Huang, R.-Y., & Halpin, D. W.** (1995). “Graphical-Based Method for Transient Evaluation of Construction Operations.” *Journal of Construction Engineering and Management*, ASCE, 121(2), 222–229.

12. **Huang, R.-Y., Grigoriadis, A. M., & Halpin, D. W.** (1994). “Simulation of Cable-Stayed Bridges Using DISCO.” *Proceedings of the Winter Simulation Conference*, 1130–1136.

### 8.4 PROSIDYC — industrial CYCLONE application (Dragados / Purdue)

13. **Halpin, D. W., & Martinez, L.-H.** (1999). “Real World Applications of Construction Process Simulation.” *Proceedings of the 1999 Winter Simulation Conference*, 956–962. (Describes PROSIDYC — PROject SImulation Dragados Y Construcciones.)

### 8.5 COST — Construction Operation Simulation Tool

14. **Cheng, T.-M., Wu, H.-T., & Tseng, Y.-W.** (2000). “Construction Operation Simulation Tool — COST.” *Proceedings of the 17th ISARC*, 999–1004. (Windows-based CYCLONE engine; fuzzy duration support; successor spirit to MicroCYCLONE.)

15. **Cheng, T.-M., & Feng, C.-W.** (and related CYUT work). Papers integrating genetic algorithms with COST / CYCLONE for resource combination optimization (GACOST line of research).

### 8.6 WebCYCLONE

16. **Halpin, D. W., Jen, H., & Kim, J.** (2003). “A Construction Process Simulation Web Service.” *Proceedings of the Winter Simulation Conference*, Vol. 2, New Orleans, LA, 1503–1509. (WebCYCLONE — browser-based CYCLONE service from the Purdue tradition.)

### 8.7 Related Purdue / Halpin-circle modeling & analysis

17. **AbouRizk, S. M., & Halpin, D. W.** (1990). “Probabilistic Simulation Studies for Repetitive Construction Processes.” *Journal of Construction Engineering and Management*, ASCE, 116(4), 575–594.

18. **AbouRizk, S. M., Gonzalez-Quevedo, A., & Halpin, D. W.** (1990). “Application of Variance Reduction Techniques in Construction Simulation.” *Microcomputers in Civil Engineering*, 5, 299–306.

19. **Hijazi, A., AbouRizk, S. M., & Halpin, D. W.** (1992). “Modeling and Simulating Learning Development in Construction.” *Journal of Construction Engineering and Management*, ASCE, 118(4), 685–700.

20. **Lutz, J. D., Halpin, D. W., & Wilson, J. R.** (1994). “Simulation of Learning Development in Repetitive Construction.” *Journal of Construction Engineering and Management*, ASCE, 120(4), 753–773.

21. **Gonzalez-Quevedo, A. A.** (c. 1991). *Sensitivity Analysis of Construction Simulation*. Ph.D. dissertation, Purdue University (advisor: D. W. Halpin).

22. **Halpin, D. W., AbouRizk, S. M., & Hijazi, A. M.** (1989). “Sensitivity Analysis of Construction Operations.” *Proceedings of the 7th National Conference on Microcomputers in Civil Engineering*, Orlando, FL.

23. **Abraham, D. M., & Halpin, D. W.** (1998). “Simulation of the Construction of Cable-Stayed Bridges.” *Canadian Journal of Civil Engineering*, 25(3), 490–499.

24. **Halpin, D. W., Sawhney, A., & AbouRizk, S. M.** (1998). “Construction Project Simulation Using CYCLONE.” *Canadian Journal of Civil Engineering*, 25(1), 16–25.

25. **Halpin, D. W.** (1998). “Construction Simulation — A Status Report.” *Proceedings of the 5th Canadian Construction Research Forum*, Edmonton, Alberta, 33–41.

26. **AbouRizk, S., Halpin, D., Mohamed, Y., & Hermann, U.** (2011). “Research in Modeling and Simulation for Improving Construction Engineering Operations.” *Journal of Construction Engineering and Management*, ASCE, 137(10), 843–852.

### 8.8 Lineage systems often compared with CYCLONE (context)

These tools are not all “Halpin products,” but they are frequently cited together in the CYCLONE family tree and teaching literature:

27. **Ioannou, P. G.** (1989). UM-CYCLONE (University of Michigan implementation of CYCLONE-style modeling).

28. **Liu, L. Y., & Ioannou, P. G.** (1992). “Graphical Object-Oriented Discrete-Event Simulation System” (COOPS line).

29. **Martinez, J. C.** (1996). STROBOSCOPE — state- and resource-based construction process simulation (extends the discrete-event construction tradition).

30. **Hajjar, D., & AbouRizk, S. M.** (1999). “Simphony: An Environment for Building Special Purpose Construction Simulation Tools.” *Proceedings of the Winter Simulation Conference*, 998–1006. (Later **Simphony.NET** — University of Alberta; AbouRizk and colleagues, historically connected to Halpin’s research circle.)

31. **AbouRizk, S., Hague, S., Ekyalimpa, R., & Newstead, S.** (2016). “Simphony: A Next Generation Simulation Modelling Environment for the Construction Domain.” *Journal of Simulation*, 10(3), 207–215.

### 8.9 How Neo-CYCLONE relates

Neo-CYCLONE does **not** claim to replace MicroCYCLONE, DISCO, COST, WebCYCLONE, or Simphony. It is an **educational, AI-assisted studio** that keeps Halpin’s modeling grammar (QUEUE, COMBI, NORMAL, COUNTER, GEN, CON, probabilistic branch, sensitivity of resource counts) visible for first contact with construction operations as flow and idleness.

---

## Quick reference card

```text
1. Select Example  OR  write Format Prompt
2. Draw Model      → inspect cycles / meetings / counter
3. Simulate        → productivity, waste, cost
4. Sensitivity     → if Sensitivity: block present
5. Export          → Excel / PNG as needed
```

**Tagline:** AI-agent of Daniel W. Halpin's CYCLONE  
**Method:** structured prompt → CYCLONE network → discrete-event simulation  
**Spirit:** educational, Halpin-first, clear flow and idleness

---

*End of User Manual v1.4*
