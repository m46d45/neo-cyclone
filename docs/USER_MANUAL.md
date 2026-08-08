# Neo-CYCLONE — User Manual

**Version:** 1.1  
**Language:** English  
**Tagline:** AI-agent of Daniel W. Halpin's CYCLONE  
**Live app:** https://neo-cyclone.vercel.app/ (deploys from GitHub `main`)  
**Canonical notation:** [NOTATION_STANDARD.md](./NOTATION_STANDARD.md) — use this as the ongoing reference for shapes, arrows, GEN, CON, and branches.

---

## Preface — Why Neo-CYCLONE

This work is a **tribute to Professor Daniel W. Halpin**.

I studied under Professor Halpin and worked for him. Through him I first met **construction operations** as flow, and **idleness** as something we can model and improve.

| Layer | What it is |
|-------|------------|
| **CYCLONE** | Modeling methodology (*CYCLic Operations NEtwork*), 1970s. |
| **MicroCYCLONE** | Early computer application (Purdue, c. 1990). |

Later: DISCO, PROSIDYC, COST, WebCYCLONE, Symphony.Net, and related systems.

**Neo-CYCLONE** is for **education** and **first contact**—not a special-purpose industrial simulator. It connects process design to Lean Construction and Project Production Management. Halpin’s foundation makes AI-assisted operations modeling possible.

Where our **diagram notation** differs slightly from some Halpin print figures, we keep **one consistent Neo-CYCLONE standard** (see §6 and [NOTATION_STANDARD.md](./NOTATION_STANDARD.md)).

---

## 1. Studio layout

| Area | Contents |
|------|----------|
| **Left** | Format Prompt · operation text · Example presets · **Draw Model** |
| **Right** | CYCLONE Model (zoom / PNG) · Network logic · run params · Simulate |
| **Below** | **Results** full width: Simulation tab · Sensitivity Analysis tab |

---

## 2. Workflow

1. Prompt or **Example** preset.  
2. **Draw Model** → diagram + Network logic.  
3. Refine until the network is right.  
4. **Max cycles** (default **100**, product limit **500**) · Seed (**12345**) · Max time (auto-raised with cycles so charts can fill).  
5. **Simulate**.  
6. Optional: **Report .md / .txt**, diagram/chart **PNG**, sensitivity tab.

---

## 3. Prompt format (structured)

Order in **Format Prompt** (top → bottom):

1. **Network** — resource cycles, counts, **`Counter after:`** + `production =` (required for clear counting)  
2. **Durations** — minutes (required)  
3. **Priority** — optional; lower number = higher priority  
4. **Functions & Branch** — optional GEN / CON / p (by **name**, not hand-drawn Q/arcs)  
5. **Cost** — optional; rates in **USD**/resource-hour (`Cost:`)  
6. **Sensitivity** — optional; usually **last**  

`#` / `//` = notes only (ignored).

**Important:** the Format Prompt never lists QUEUE shapes or arrows. Resource cycles imply home queues and forward/return arcs. To place GEN, CON, or probability:

```
Functions:
GEN PartsPool = 4
CON AssembleKit = 4

Branch:
After Inspect: Pass p=0.9, Rework p=0.1
```

Put `PartsPool` / `AssembleKit` / `Inspect` in the network cycle; the app creates the correct node types and `p=` arcs.

### Distributions

const · unif · tri · normal · lognormal · beta · gamma

---

## 4. Results (MicroCYCLONE-style)

- Process report: run length, cycles, units/cycle, production, units/hour, avg cycle  
- Cost report (USD) when `cost_usd_h` / Cost block present  
- Report by Element · Production by Cycle · Charts · **Branches** (if p-arcs)  
- **Download Report .md / .txt**  
- Sensitivity tab: productivity & unit cost vs fleet mix (pairwise when 3–5 resources)

---

## 4b. Production COUNTER (important)

| | |
|--|--|
| **What** | Golf-flag node — counts **one production unit / completed cycle** |
| **Prompt** | `Counter after: Dump` then `production = 12 m3` |
| **Default** | If omitted: after the **last task of the first resource** cycle |
| **Earthmoving** | Always prefer `Counter after: Dump` (not after Return) |
| **With branch p** | Count first, then branch return (e.g. Dump → Counter → Return / Breakdown) |

Never leave this implicit in teaching materials — name `Counter after:` in the prompt.

## 5. Modeling rule (Halpin core)

Home QUEUE → work → return. COMBI for shared first tasks; NORMAL later. QUEUE only feeds COMBI. Concurrent COMBI allowed.

---

## 6. Neo-CYCLONE notation standard (summary)

Full detail: **[NOTATION_STANDARD.md](./NOTATION_STANDARD.md)**.

### 6.1 Node shapes

| Element | Drawing | Subtitle |
|---------|---------|----------|
| **QUEUE** | Q-circle (slash) | `n = …` · optional **`GEN k`** |
| **COMBI** | Cut-corner square | duration |
| **NORMAL** | Rectangle | duration |
| **COUNTER** | Golf flag | `+production` |
| **CONSOLIDATE** | Upright triangle | **`CON n`** |

### 6.2 Arrows — always with direction tip

| Style | Look | Meaning |
|-------|------|---------|
| **Forward** | **Solid black + black arrowhead** | Work flow toward production (toward COUNTER) |
| **Return** | **Dashed gold + gold arrowhead** (curved) | Resource home / cycle close — **target is a QUEUE** |
| **Branch** | Forward path + brown **`p=…`** label | Stochastic multi-out |

Never draw undirected segments: every arc is a **panah** (arrow).

### 6.3 GEN and CON (how we write them)

| Function | Diagram | DSL | Engine rule |
|----------|---------|-----|-------------|
| **GEN k** | On QUEUE: label **`GEN k`** | `generate: k` (k ≥ 2) | Each *arrival* → k units; **not** applied to initial |
| **CON n** | Triangle **`CON n`** | `type: CONSOLIDATE`, `consolidate: n` (n ≥ 2) | Collect n units → release 1 (time 0) |

- GEN and CON are **independent** — a model may use one, both, or neither.  
- Classic pair: GEN multiplies work units; CON reunites them for one production unit (see Example 3 Concrete placing).  
- Do **not** put `probability` on COMBI multi-out used only for resource return fan-out.

### 6.4 Priority (shared resources)

| | |
|--|--|
| Prompt | `Priority:` then `Task: 1` (lower = higher priority) |
| DSL | COMBI `priority: n` |
| Default | Model order if omitted |
| Diagram | **P1**, **P2**, … |
| Multi-demand | `Crane: Lift A \| Lift B \| Lift C` (pipe, not sequence) |

MicroCYCLONE used **smaller node numbers** first; Neo-CYCLONE makes that explicit in the prompt.

### 6.5 Probabilistic branch

```yaml
- from: c_inspect
  to: ctr
  probability: 0.9
- from: c_inspect
  to: n_rework
  probability: 0.1
```

Results → **Branches**: declared vs empirical.

### 6.6 Consistency checklist

- [ ] Visible **arrowhead** on every arc  
- [ ] Solid black = forward; dashed gold into QUEUE = return  
- [ ] GEN only on QUEUE; CON only CONSOLIDATE  
- [ ] Resource cycles readable end-to-end  

---

## 7. Teaching examples (6 presets)

1. **Earthmoving** — cost, sensitivity, steady-state, **branch p** (truck breakdown on return)  
2. **Asphalt paving** — paver + trucks  
3. **Concrete placing** — crane + trucks + **GEN/CON** bucket scale  
4. **Precast forms** — form cycle  
5. **Masonry** — 3 resources, pairwise sensitivity  
6. **Tower crane** — multi-demand `|` + **Priority**

Features are spread across cases (not every feature in every preset).

## 8. Zoom & export

Diagram and charts: + / − / reset · **PNG**.  
Report: full MicroCYCLONE-style markdown/text download.

---

## 9. Deploy note

GitHub `main` → Vercel production. Grok Build preview may differ until changes are **pushed**.

---

*AI-agent of Daniel W. Halpin's CYCLONE*
