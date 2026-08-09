# Neo-CYCLONE — User Manual

| | |
|--|--|
| **Version** | 1.6.2 |
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

This product is a **tribute to Professor Daniel W. Halpin**. Through his teaching and work, many students first met **flow**, **idleness**, and **CYCLONE** as a simple network language for cyclic construction work.

Historical line (see Chapter 9): **CYCLONE** (methodology) → **MicroCYCLONE** (early computer tool) → DISCO, PROSIDYC, COST, WebCYCLONE, Simphony / Symphony.Net, and related systems.

Halpin’s foundation is not obsolete in the age of AI — it is the **grammar** that lets us describe an operation clearly enough that a machine can help build a model and run a simulation.

### 1.3 Approach — is this an “AI agent”?

| Term | Meaning in Neo-CYCLONE |
|------|------------------------|
| **Product** | AI-Assisted Construction Operation Simulation |
| **Dedication line** | AI-agent of Daniel W. Halpin's CYCLONE |
| **Practice** | Prompt-first → **Draw Model** → check network → **Simulate** |
| **AI Assistant (Ch. 7)** | Studio-bound co-pilot: explain results, bottleneck, propose prompt edits (Apply required) | Autonomous agent that runs simulations without you |

**In practice:** (1) structured prompt (2) **Draw Model** (3) inspect cycles (4) **Simulate** (5) optional AI Assistant under Results.

### 1.4 Studio layout

| Area | Content |
|------|--------|
| **Left** | Prompt · Example · Draw Model · Format Prompt |
| **Right** | CYCLONE Model · network logic · run parameters |
| **Below** | Results: Simulation · Sensitivity Analysis · **AI Assistant** |

---

# Part II — How to use

## Chapter 2 — How-to

1. Example → e.g. Earthmoving. 2. **Draw Model**. 3. Check QUEUEs / tasks / counter. 4. Max cycles (default 100, max 500), seed 12345. 5. **Simulate**. 6. Optional Excel / PNG. 7. Optional **AI Assistant** questions.

Write Format Prompt (Chapter 4) → Draw → fix → Simulate → optional Cost / Sensitivity → optional AI Assistant.

**Iterate before Simulate:** home QUEUE per resource? Multi-resource meetings → COMBI? Exact `Counter after:` names? GEN/CON only when unit logic needs them?

---

# Part III — Teaching examples

## Chapter 3 — Six Examples

1. **Earthmoving** — classic fleet; cost; steady state  
2. **Asphalt Paving** — branch probability  
3. **Loading Dump Truck** — GEN / CON  
4. **Tower Crane** — multi-demand, Priority, multi-counter  
5. **Masonry** — face stocks; sensitivity intro  
6. **Precast Plant** — Halpin Ch.14-style + complex SA  

---

# Part IV — Format Prompt & rules

## Chapter 4 — Format Prompt

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

## Chapter 5 — Modeling rules

1. Every resource has a home QUEUE.  
2. ≥2 resources meet → COMBI; one resource → NORMAL.  
3. Return arcs (dashed gold) only to home QUEUE; forward = solid black.  
4. GEN ▽ / CON △ optional and independent.  
5. `Counter after:` exact task name(s).  
6. Grid layout: ordered tasks, queues; counter near the end.

## Chapter 6 — Results

Production by cycle · steady state (5%, ≥10 cycles) · idleness · cost · sensitivity · Excel/PNG.

## Chapter 7 — AI Assistant

The studio includes an **AI Assistant** panel (below Results after you work with a model). It is an **educational co-pilot**, not an autonomous simulator.

### 7.1 Purpose

| Goal | Meaning |
|------|--------|
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

**Context bound to the studio:** the browser builds a **compact CONTEXT string** (Format Prompt excerpt, network summary, last-run productivity / idleness / cost, sensitivity summary) and sends only that snapshot to the server—not the full simulation object graph and not the whole internet.

**Rate limits (protects xAI cost and host stability):**

| Endpoint | Limit | Notes |
|----------|-------|--------|
| AI Assistant (`chatAssistant`) | **30 requests / hour / client IP** | Applies on the server path |
| AI DSL draft (`generateCycloneDsl`) | **20 requests / hour / client IP** | Only meaningful when `XAI_API_KEY` is set |

When a limit is hit, the Assistant returns a clear **rate-limited** message (and a short toast in the UI). Limits are enforced in-memory per serverless isolate (best-effort on multi-instance hosts). Classroom use at normal pace is fine; automated spam is not.

### 7.3 What it can do

- Explain the current model’s resource cycles, COMBI vs NORMAL, counter placement, GEN/CON, branch probability
- Report fleet counts from the Format Prompt (e.g. `5 trucks, 1 loader`)
- Interpret **last-run** productivity, steady state, unit cost, and **resource idleness / busy**
- Identify a likely **bottleneck** (high idle vs high busy) from simulation stats
- **Propose** Format Prompt edits (fleet size, durations, cost, sensitivity ranges)—only applied after **Apply prompt**
- Answer teaching questions about CYCLONE concepts in the context of the open model

### 7.4 What it cannot / must not do

| It must not… | Why |
|--------------|-----|
| Auto-run Simulate after an edit | You control Draw Model and Simulate |
| Invent a different operation as if it were the current one | Context is the open prompt/network |
| Replace CYCLONE logic with a black-box “AI simulation” | Engine is deterministic discrete-event code |
| Answer unrelated topics (general coding, legal, safety certification, etc.) | Studio co-pilot only |
| Apply prompt changes without your confirmation | Educational control: **Apply** is explicit |
| Guarantee optimal fleet design without runs | Suggestions are guidance; numbers come from Simulate / Sensitivity |
| Bypass rate limits or use the Assistant as a free unlimited chat API | Educational quota protects the shared deployment |

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

### 8.1 Simulation limits

| Parameter | Default | Hard limit | Notes |
|-----------|---------|------------|--------|
| Max cycles | 100 | **500** | Product teaching cap; form clamps higher values |
| Seed | 12345 | — | Reproducible runs for class comparison |
| Time unit | minutes | — | Documented in Format Prompt header |
| Sensitivity resources | — | **5** | Extra ranges ignored with a note |
| Sensitivity combinations | — | **~150** | Ranges are down-sampled (step increased), not cut mid-axis |

### 8.2 Sensitivity performance

- Sensitivity batches run in a **Web Worker** when the browser supports it, so the studio UI stays responsive during many combination runs.
- If Workers are unavailable or fail, the same engine falls back to the **main thread** (same numerical results; UI may pause briefly on large SA).
- Base **Simulate** (single trajectory) always runs on the main thread—it is fast enough for teaching cycles.

### 8.3 AI Assistant & API limits

| Item | Limit / behavior |
|------|------------------|
| Assistant requests | **30 / hour / IP** |
| AI DSL draft requests | **20 / hour / IP** |
| Payload to server | **Compact CONTEXT** only (not full `SimResult` / model graph) |
| Full free-form chat | Requires `XAI_API_KEY` on the host |
| Without API key | **Local mode** (English-first intent helper) still works |

These limits do **not** change CYCLONE modeling rules, production metrics, or Halpin-style interpretation. They only protect shared hosting and API cost.

### 8.4 Deploy

- Source of truth: **GitHub `main`** → **Vercel** auto-deploy.
- Optional env: `XAI_API_KEY` for AI mode; auth/database vars only if you enable sign-in.
- Live app: [neo-cyclone.vercel.app](https://neo-cyclone.vercel.app/)

---

## Chapter 9 — References

Selected literature on **CYCLONE**, **MicroCYCLONE**, and applications by **Daniel W. Halpin**, students, and collaborators.

### 9.1 Foundations

1. **Halpin, D. W.** (1973). Ph.D. dissertation, University of Illinois at Urbana–Champaign.
2. **Halpin, D. W.** (1977). “CYCLONE: Method for Modeling of Job Site Processes.” *J. Constr. Div.*, ASCE, 103(3), 489–499.
3. **Halpin, D. W., & Riggs, L. S.** (1992). *Planning and Analysis of Construction Operations*. Wiley.

### 9.2 MicroCYCLONE

4. **Lluch, J., & Halpin, D. W.** (1982). *J. Constr. Div.*, ASCE, 108(1), 129–145.
5. **Halpin, D. W.** (1990–1992). MicroCYCLONE User / System manuals. Purdue / Learning Systems.

### 9.3 DISCO

6. **Huang, R.-Y., & Halpin, D. W.** (1993–1995). DISCO papers (ISARC, *Microcomputers in Civil Engineering*, *J. Constr. Eng. Manage.*).
7. **Huang, R.-Y.** (1994). Ph.D., Purdue (advisor: Halpin).

### 9.4 PROSIDYC · COST · WebCYCLONE

8. **Halpin, D. W., & Martinez, L.-H.** (1999). PROSIDYC. *WSC*.
9. **Cheng, T.-M., et al.** (2000). COST. *17th ISARC*.
10. **Halpin, D. W., Jen, H., & Kim, J.** (2003). WebCYCLONE. *WSC*.

### 9.5 Purdue / Halpin-circle

11. AbouRizk & Halpin; Hijazi; Lutz; Gonzalez-Quevedo; Abraham; Halpin et al. project-level CYCLONE; AbouRizk et al. (2011).

### 9.6 Related lineage

12. UM-CYCLONE (Ioannou); STROBOSCOPE (Martinez); Simphony / Simphony.NET (AbouRizk et al.).

### 9.7 Relation

Neo-CYCLONE does **not** replace those systems. It is **AI-Assisted Construction Operation Simulation** — a teaching studio in Halpin’s tradition.

---

**Quick path:** 1. Example or Format Prompt → 2. Draw Model → 3. Simulate → 4. Sensitivity (if planned) → 5. AI Assistant (optional) → 6. Export Excel / PNG.

AI-Assisted Construction Operation Simulation · AI-agent of Daniel W. Halpin's CYCLONE · Manual v1.6.2
