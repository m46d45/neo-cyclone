# Neo-CYCLONE: An AI-assisted web studio for Halpin-style construction operation simulation

**Journal:** Software Impacts (Elsevier)  
**Article type:** Original Software Publication  
**Status:** Final draft for paste into the official Elsevier OSP template  
**Software version:** v1.6.2.1  
**DOI:** https://doi.org/10.5281/zenodo.21864969  

---

## Authors

**Muhamad Abduh**  
Faculty of Civil and Environmental Engineering  
Institut Teknologi Bandung  
Bandung, Indonesia  
ORCID: https://orcid.org/0000-0001-6926-6665  
Email: abduh@itb.ac.id

---

## Abstract

Neo-CYCLONE is open educational software for **AI-Assisted Construction Operation Simulation** grounded in Daniel W. Halpin’s CYCLONE methodology and the MicroCYCLONE lineage. Users specify cyclic construction operations through a structured English **Format Prompt**, obtain a Halpin-style activity-cycle diagram (QUEUE, COMBI, NORMAL, COUNTER, with optional GEN, CON, priority, and probabilistic branches), and execute a browser-side discrete-event simulation. Reported outputs include production by cycle, productivity, steady-state indication, resource idleness and utilization, unit cost, and multi-resource sensitivity comparisons. An optional **AI Assistant** remains bound to the current model and last results: it can explain outcomes and propose prompt edits, but simulation itself is deterministic and user-triggered. Neo-CYCLONE is intended for first-contact teaching of flow, idleness (waste), and process design in construction operations, without legacy desktop installation.

**Keywords:** construction operations; discrete-event simulation; CYCLONE; MicroCYCLONE; educational software; sensitivity analysis

---

## Code metadata

| Nr | Code metadata description | Please fill in this column |
|----|---------------------------|----------------------------|
| C1 | Current code version | v1.6.2.1 |
| C2 | Permanent link to code/repository used for this code version | https://github.com/m46d45/neo-cyclone |
| C3 | Permanent link to Reproducible Capsule | https://doi.org/10.5281/zenodo.21864969 |
| C4 | Legal Code License | MIT License |
| C5 | Code versioning system used | git |
| C6 | Software code languages, tools, and services used | TypeScript; React 19; Vite; TanStack Start; Zustand; Recharts; optional xAI chat API; Vercel hosting |
| C7 | Compilation requirements, operating environments & dependencies | Node.js 20+ for development/build; modern evergreen browser for end users; `npm install`, `npm run build` |
| C8 | If available Link to developer documentation/manual | https://neo-cyclone.vercel.app/manual ; https://github.com/m46d45/neo-cyclone/blob/main/docs/USER_MANUAL.md |
| C9 | Support email for questions | abduh@itb.ac.id |

---

## 1. Motivation and significance

Repetitive construction work—earthmoving fleets, paving trains, crane service to multiple crews, masonry supply, precast lines—is naturally described as **cyclic resource flow**. Daniel W. Halpin’s **CYCLONE** (*CYCLic Operations NEtwork*) provided a compact graphical language (queues, work tasks, counters, and later generation/consolidation and probabilistic branching) and a discrete-event interpretation that made **productivity**, **idleness**, and **resource interaction** teachable and measurable [1–3]. MicroCYCLONE and subsequent systems (e.g., DISCO, PROSIDYC, COST, WebCYCLONE, and related simulation environments) extended that foundation [4–8].

Despite this lineage, many construction engineering programs still give students limited **hands-on** exposure to operation-level simulation. Barriers include proprietary or aging desktop tools, steep modeling syntax, and the gap between “draw a network” and “interpret waste and unit cost under uncertainty.” At the same time, general-purpose AI systems can draft text freely but do not, by themselves, enforce Halpin-consistent cycles or reproducible discrete-event metrics.

**Neo-CYCLONE** addresses that pedagogical and accessibility gap. It is a **web studio** that (i) accepts a structured natural-language **Format Prompt**, (ii) draws a Halpin-inspired network with explicit home queues and forward/return logic, (iii) runs a local discrete-event engine, and (iv) optionally offers a **studio-bound AI Assistant** that explains results and proposes prompt edits without replacing the simulator. The product positioning is deliberately educational: *AI-Assisted Construction Operation Simulation* and *AI-agent of Daniel W. Halpin’s CYCLONE*—an agent in the sense of a co-pilot for modeling practice, not an autonomous industrial controller.

---

## 2. Software description

### 2.1 High-level functionality

End users open a browser (deployed instance: https://neo-cyclone.vercel.app/). Typical workflow:

1. **Select an Example** or write a **Format Prompt** (network chains per resource, durations with common distributions, optional cost, priority, branch probabilities, and sensitivity ranges).  
2. **Draw Model** — inspect QUEUE / COMBI / NORMAL / COUNTER structure, GEN/CON marks, and arc semantics (solid forward arcs; dashed gold return arcs to home queues).  
3. **Simulate** — choose maximum cycles (default 100, hard cap 500) and seed (default 12345) for reproducibility.  
4. **Results** — production by cycle, productivity (units/hour), steady-state indication (≤5% variation over ≥10 consecutive cycles), resource idleness/busy percentages, cost and unit cost when cost data are provided.  
5. **Sensitivity Analysis** (when ranges are declared) — pairwise fleet comparisons for productivity and unit cost, with combination limits suitable for teaching.  
6. **AI Assistant** (optional) — questions grounded in the current prompt, network, and last run; proposed prompt changes require explicit **Apply**, then Draw and Simulate again.

Six progressive examples ship with the studio: Earthmoving; Asphalt paving (branch); Loading dump truck (GEN/CON); Tower crane (multi-demand, priority, multi-counter); Masonry (stocks / sensitivity intro); Precast plant (line-style complexity and richer sensitivity).

### 2.2 Architecture (concise)

The client builds the model from the Format Prompt and runs discrete-event simulation in the browser. Sensitivity batches use a **Web Worker** when available (main-thread fallback). Optional server routes support an AI Assistant and DSL drafting when `XAI_API_KEY` is configured; payloads are restricted to a **compact context snapshot**, with per-IP rate limits to protect shared hosting. Documentation is available in-app and in-repository (`docs/USER_MANUAL.md`, notation standard). Source and archived releases are public under the MIT License [10].

### 2.3 Design choices relevant to impact

- **Prompt-first modeling** lowers the entry barrier while still requiring the user to validate the drawn CYCLONE network.  
- **Deterministic engine after Simulate** keeps metrics auditable for coursework.  
- **Halpin-aligned concepts** (home queue per resource; COMBI when multiple resources meet; counter placement; optional GEN/CON) remain central.  
- **English-first** UI and manual support international classroom use.

---

## 3. Illustrative examples

**Earthmoving (baseline fleet).** Trucks and loaders with load / haul / dump / return cycles, cost rates, and productivity-by-cycle charts illustrate steady state and unit cost.

**Loading with GEN/CON.** An excavator scoop cycle generates multiple fill units consolidated into a truck load, showing generation and consolidation without requiring a full industrial model library.

**Tower crane / masonry / precast presets.** Multi-demand priority, face stocks, and line-oriented sensitivity demonstrate that the same prompt→network→simulate loop scales from two-resource fleets to richer teaching cases.

Users can replace any example prompt with their own operation description, subject to modeling rules documented in the manual (home queues, counter after named tasks, optional functions only when unit logic requires them).

---

## 4. Impact

### 4.1 Enabling questions and learning outcomes

Neo-CYCLONE makes it practical, in a single lab session, to ask: which resource is idle (waste) versus busy; whether productivity has approached steady state; how unit cost moves when fleet mixes change; and how GEN/CON or breakdown branches affect measured production. These questions sit at the core of Halpin-style operation analysis and connect forward to Lean Construction and Project Production Management discussions of flow and waste [3].

### 4.2 Relation to prior software

The software does **not** claim to replace research-grade environments such as STROBOSCOPE, Simphony, or specialized commercial simulators [7–9]. Its contribution is **access and pedagogy**: Halpin-consistent teaching loops in a shareable web app, with modern sensitivity and cost views and an optional AI co-pilot that cannot silently overwrite simulation logic.

### 4.3 Practice in teaching and open use

The intended primary impact is **classroom and self-study use**: structured examples, a full user manual, notation conventions, export of tabular results and charts, and reproducible seeds. A deployed public instance and open GitHub repository allow instructors to assign the same environment without local installs. Deployment in construction-operations teaching at Institut Teknologi Bandung is planned from **24 August 2026**.

### 4.4 Limitations (for reviewer trust)

Simulation is capped for teaching (e.g., maximum cycles and sensitivity combination bounds). The AI Assistant is rate-limited and context-bound; local rule-based mode applies when no API key is present. Neo-CYCLONE is not a project-level scheduler or a certified planning system for contractual claims.

---

## 5. Conclusions

Neo-CYCLONE packages Halpin’s CYCLONE ideas as **AI-Assisted Construction Operation Simulation** for the browser: structured prompting, explicit activity-cycle networks, discrete-event metrics, cost and sensitivity, and a constrained AI co-pilot. By lowering installation and syntax barriers while preserving educational control of modeling and runs, it aims to keep foundational operation-simulation literacy alive for the next cohort of construction engineers and researchers.

Future work includes broader example libraries, stronger archival packaging of classroom datasets, and empirical evaluation of learning outcomes once course deployments accumulate evidence.

---

## Acknowledgments

The author thanks the intellectual lineage of Professor Daniel W. Halpin and subsequent CYCLONE-family tools. Development assistance from modern AI coding tools is acknowledged; all modeling rules, simulation behavior, and manuscript claims remain the responsibility of the author.

---

## Declaration of competing interest

The author declares that he has no known competing financial interests or personal relationships that could have appeared to influence the work reported in this paper.

## Funding

This research did not receive any specific grant from funding agencies in the public, commercial, or not-for-profit sectors.

## Data / software availability

Source code and documentation are available at https://github.com/m46d45/neo-cyclone under the MIT License. Archived release: https://doi.org/10.5281/zenodo.21864969. Live demonstration: https://neo-cyclone.vercel.app/.

---

## References

[1] Halpin, D.W., 1977. CYCLONE: Method for modeling of job site processes. Journal of the Construction Division, ASCE, 103 (3), 489–499.

[2] Halpin, D.W., Riggs, L.S., 1992. Planning and Analysis of Construction Operations. Wiley, New York.

[3] Halpin, D.W., 1990–1992. MicroCYCLONE user/system manuals. Purdue University / Learning Systems.

[4] Lluch, J., Halpin, D.W., 1982. Construction operations and microcomputers. Journal of the Construction Division, ASCE, 108 (1), 129–145.

[5] Huang, R.-Y., Halpin, D.W., 1994. Visual construction operation simulation: The DISCO approach. Microcomputers in Civil Engineering, 9 (3), 175–184.

[6] Halpin, D.W., Jen, H., Kim, J., 2003. A construction process simulation web service. Proceedings of the Winter Simulation Conference, 1503–1509. (WebCYCLONE)

[7] Martinez, J.C., 1996. STROBOSCOPE: State and resource based simulation of construction processes. Ph.D. dissertation, University of Michigan.

[8] Hajjar, D., AbouRizk, S.M., 1999. Simphony: An environment for building special purpose construction simulation tools. Proceedings of the Winter Simulation Conference, 998–1006.

[9] AbouRizk, S., Halpin, D., Mohamed, Y., 2011. Research in modeling and simulation for improving construction engineering operations. Journal of Construction Engineering and Management, 137 (10), 843–852.

[10] Abduh, M., 2026. Neo-CYCLONE (Version 1.6.2.1) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.21864969
