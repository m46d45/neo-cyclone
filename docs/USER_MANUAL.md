# Neo-CYCLONE — User Manual

**Version:** 1.1  
**Language:** English  
**Tagline:** AI-agent of Daniel W. Halpin's CYCLONE  
**Live app:** https://neo-cyclone.vercel.app/ (deploys from GitHub `main`)

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

## 5. Modeling rule (Halpin)

Home QUEUE → work → return. COMBI for shared first tasks; NORMAL later. QUEUE only feeds COMBI. Concurrent COMBI allowed.

---

## 6. Notation

QUEUE (Q-circle, optional GEN k) · COMBI (cut corner) · NORMAL · COUNTER (golf flag) · CONSOLIDATE (triangle CON n) · return arcs gold dashed · branch arcs brown **p=…**

---

## 7. Function nodes (independent)

| Function | Where | Behavior |
|----------|--------|----------|
| **GEN k** | QUEUE `generate: k` | Each *arrival* → k units (not initial) |
| **CON n** | CONSOLIDATE `consolidate: n` | Buffer n → release 1 (time 0) |
| **Branch p** | link `probability` | Sample one multi-out arc; normalize if needed |

Do not put probability on COMBI multi-out **resource return** arcs.

---

## 8. Teaching examples

1. Earthmoving fleet (cost + sensitivity)  
2. Asphalt paving  
3. Concrete placing (crane + trucks)  
4. Precast forms  
5. Masonry (pairwise sensitivity)  
6. Inspect and rework (**branch p**)  
7. GEN and CON scale (**GEN 4 + CON 4**)

---

## 9. Zoom & export

Diagram and charts: + / − / reset · **PNG**.  
Report: full MicroCYCLONE-style markdown/text download.

---

## 10. Deploy note

GitHub `main` → Vercel production. The in-browser Grok Build preview may temporarily differ until changes are **pushed** to GitHub.

---

*AI-agent of Daniel W. Halpin's CYCLONE*
