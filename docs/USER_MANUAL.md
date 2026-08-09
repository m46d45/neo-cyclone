# Neo-CYCLONE — User Manual

**Version:** 1.2  
**Language:** English  
**Tagline:** AI-agent of Daniel W. Halpin's CYCLONE  
**Live app:** https://neo-cyclone.vercel.app/ (deploys from GitHub `main`)  
**Canonical notation:** [NOTATION_STANDARD.md](./NOTATION_STANDARD.md)

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

Where diagram notation differs slightly from some Halpin print figures, we keep **one consistent Neo-CYCLONE standard** (see §6 and [NOTATION_STANDARD.md](./NOTATION_STANDARD.md)).

---

## 1. Studio layout

| Area | Contents |
|------|----------|
| **Left** | Operation prompt (tall) · Example presets · **Draw Model** · Format Prompt (collapsed, **below** the button) |
| **Right** | CYCLONE Model (zoom / PNG) · Network logic · run params · Simulate |
| **Below** | **Results** full width: Simulation · Sensitivity Analysis |

---

## 2. Workflow

1. Edit the prompt or pick an **Example** preset (auto-redraws).  
2. **Draw Model** → diagram + Network logic.  
3. Refine until the network is right.  
4. **Max cycles** (default **100**, product limit **500**) · Seed (**12345**) · Max time (auto-raised with cycles).  
5. **Simulate**.  
6. Optional: **Report Excel**, chart/diagram **PNG**, sensitivity tab.

---

## 3. Prompt format (structured)

Order (top → bottom):

1. **Network** — resource cycles, counts, **`Counter after:`** + `production =`  
2. **Durations** — minutes  
3. **Priority** — optional (lower number = higher priority)  
4. **Branch** — optional `p=` arcs  
5. **Cost** — optional USD / resource-hour  
6. **Sensitivity** — optional; usually **last**  

`#` / `//` = notes only (ignored).

### 3.1 Resource cycles imply topology

You do **not** draw QUEUE circles or arrows in the prompt. Each resource line:

```
Trucks: TaskA → TaskB → TaskC
Loader: TaskA
5 trucks, 1 loader
```

creates a **home QUEUE** (`Trucks Idle`, `Loader Idle`) and work nodes.

### 3.2 GEN / CON — prefer **inline on the chain** (source of truth)

```
Trucks: GEN 5 → Scoop → CON 5 TruckFull → Haul&Return
Excavator: Scoop
4 trucks, 1 excavator
```

| Token | Meaning |
|-------|---------|
| `GEN 5` | GENERATE load-zone: 1 arrival → 5 units |
| `CON 5 TruckFull` | CONSOLIDATE name, n = 5 |
| `TruckFull CON 5` | same |

**Optional** (legacy alias if the name already appears in the cycle):

```
Functions:
GEN PartsPool = 4
CON AssembleKit = 4
```

### 3.3 Branch (probability)

```
Branch:
After DumpToPaver: RefillAsphalt p=0.85, Breakdown p=0.15
```

Detours rejoin the main next step (e.g. Breakdown → RefillAsphalt), not dump empty.

### 3.4 Distributions

const · unif · tri · normal · lognormal · beta · gamma  

Default time unit: **minutes**.

---

## 4. Results

| Tab / block | Content |
|-------------|---------|
| **Production by Cycle** | Units/hour by cycle; **dark gold** steady-state line (5% / 10-cycle rule); **red dots** = detour branch cycles |
| **Charts** | Utilization etc. |
| **Report by Element** | Queues, activities |
| **Cost** | When Cost block present (USD) |
| **Branches** | Declared vs empirical p |
| **Sensitivity** | Fleet mix vs productivity & unit cost (pairwise ≤ 5 resources) |

Downloads: **Excel** report · chart **PNG** · model **PNG**.

---

## 4b. Production COUNTER (one or many)

| | |
|--|--|
| Shape | Golf flag |
| One counter | `Counter after: Dump` · `production = 12 m3` |
| **Multiple** | `Counter after: LiftAtA, LiftAtB, LiftAtC` (comma-separated or multiple lines) |
| Default | Last task of first resource if omitted |
| Exact match | `Pave` does **not** match `DumpToPaver` |
| Run stop | **Total hits** across all counters ≥ max cycles |
| Chart cycle | Global production event index (sum of all counters) |
| Report | Each counter listed; cost uses **sum** of production |

Multi-counter teaches multi-demand (e.g. crane serving three zones): every productive service is counted, not only one zone.

---

## 5. Modeling rules (Neo-CYCLONE)

1. Every resource has a **home QUEUE** (Q-circle).  
2. Task used by **≥2 resources** → **COMBI**; one resource only → **NORMAL**.  
3. Home may feed COMBI or NORMAL. Staging `Resource @ Task` is still forward (solid black).  
4. **Return** (dashed gold) only into a **home** QUEUE, not into staging or GEN.  
5. GEN and CON are optional and independent.

---

## 6. Notation standard (summary)

Full detail: **[NOTATION_STANDARD.md](./NOTATION_STANDARD.md)**.

### 6.1 Node shapes

| Element | Drawing | Subtitle |
|---------|---------|----------|
| **QUEUE** (home / staging) | Q-circle (slash) | `n = …` |
| **GENERATE (GEN)** | **Inverted triangle ▽** | **`GEN k`** |
| **COMBI** | Cut-corner square | duration |
| **NORMAL** | Rectangle | duration |
| **COUNTER** | Golf flag | `+production` |
| **CONSOLIDATE (CON)** | **Upright triangle △** | **`CON n`** |

**GEN / CON pair:** ▽ multiplies (1→k) · △ gathers (n→1). GEN is **not** a Q-circle.

### 6.2 Arrows

| Style | Look | Meaning |
|-------|------|---------|
| **Forward** | Solid black + tip (may curve) | Work advances |
| **Return** | Dashed gold + tip (curved) | Into **home** QUEUE only |
| **Branch** | `p=…` label | Stochastic multi-out |

### 6.3 Checklist

- [ ] Arrowhead on every arc  
- [ ] Solid black = forward; dashed gold = return home  
- [ ] GEN = inverted triangle; CON = upright triangle  
- [ ] COMBI only where resources meet  

---

## 7. Teaching examples (6 presets)

1. **Earthmoving** — classic fleet; cost; steady-state  
2. **Asphalt paving** — branch **p** Breakdown → Refill  
3. **Excavator loading** — inline `GEN 5 → Scoop → CON 5 TruckFull → Haul&Return`  
4. **Tower crane** — multi-demand `|` + **Priority** (contention, no SA)  
5. **Masonry** — 2 brick stacks + 1 mortar place at face; helpers refill; GEN2/CON2 on **mortar place**; **only SA**  
6. **Precast forms** — longer form cycle (more complex; no SA)

---

## 8. Zoom & export

Diagram and charts: + / − / reset · **PNG**.  
Report: multi-sheet Excel (Summary, Cost, Activities, Queues, Productivity, Branches, Event log).

---

## 9. Deploy note

GitHub `main` → Vercel production. Preview and production match after push.

---

*AI-agent of Daniel W. Halpin's CYCLONE*
