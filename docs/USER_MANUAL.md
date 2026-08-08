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
4. Max cycles · Seed (**12345**) · Max time.  
5. **Simulate**.  
6. Optional: **Report .md / .txt**, diagram/chart **PNG**, sensitivity tab.

---

## 3. Prompt format

Resource cycles, counts, production unit, durations (minutes).  
Optional: `Cost USD/h:`, `Sensitivity: Resource: low..high`.  
`#` / `//` = notes only.

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
- Classic pair: GEN multiplies work units; CON reunites them for one production unit (see Example *GEN and CON Scale*).  
- Do **not** put `probability` on COMBI multi-out used only for resource return fan-out.

### 6.4 Probabilistic branch

```yaml
- from: c_inspect
  to: ctr
  probability: 0.9
- from: c_inspect
  to: n_rework
  probability: 0.1
```

Results → **Branches**: declared vs empirical.

### 6.5 Consistency checklist

- [ ] Visible **arrowhead** on every arc  
- [ ] Solid black = forward; dashed gold into QUEUE = return  
- [ ] GEN only on QUEUE; CON only CONSOLIDATE  
- [ ] Resource cycles readable end-to-end  

---

## 7. Teaching examples

1. Earthmoving fleet (cost + sensitivity)  
2. Asphalt paving  
3. Concrete placing (crane + trucks)  
4. Precast forms  
5. Masonry (pairwise sensitivity)  
6. Inspect and rework (**branch p**)  
7. GEN and CON scale (**GEN 4 + CON 4**)

---

## 8. Zoom & export

Diagram and charts: + / − / reset · **PNG**.  
Report: full MicroCYCLONE-style markdown/text download.

---

## 9. Deploy note

GitHub `main` → Vercel production. Grok Build preview may differ until changes are **pushed**.

---

*AI-agent of Daniel W. Halpin's CYCLONE*
