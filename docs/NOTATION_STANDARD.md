# Neo-CYCLONE Notation Standard

**Status:** canonical for this product (v1.1+)  
**Language:** English  
**Principle:** Consistent teaching notation inspired by Halpin CYCLONE / MicroCYCLONE.  
**Where it differs from Halpin print figures, Neo-CYCLONE wins for this app** — as long as we stay consistent.

Use this document when drawing diagrams, writing prompts, writing DSL, or updating the AI system prompt.

---

## 1. Purpose

1. Make **flow** and **resource cycles** obvious at a glance.  
2. Keep Halpin’s building blocks (QUEUE, COMBI, NORMAL, COUNTER, function nodes).  
3. Prefer **clarity for learners** over exact historical glyph matching.

---

## 2. Nodes (shapes)

| Element | Shape (diagram) | Role |
|---------|-----------------|------|
| **QUEUE** | Circle with lower-right slash (like a **Q**) | Idle resource / waiting pool (home of a resource) |
| **COMBI** | Square with **top-left corner cut** | Constrained work: needs one unit from each predecessor QUEUE; may run concurrent instances |
| **NORMAL** | Rectangle | Unconstrained work: starts when a unit arrives |
| **COUNTER** | **Golf flag** (pole + triangular flag) | Production counter — records cycles / output |
| **CONSOLIDATE (CON)** | **Upright triangle** | Function node: gather N units, release 1 (duration 0) |

### Labels under the shape

| Node | Subtitle |
|------|----------|
| QUEUE | `n = <initial>` and/or **`GEN k`** if generate is set |
| COMBI / NORMAL | Duration text (e.g. `tri 1.5, 2, 3`) |
| COUNTER | `+<production amount>` |
| CONSOLIDATE | **`CON n`** (n = consolidate count) |

---

## 3. Arrows (mandatory direction tips)

**Every arc is a directed arrow** (line **and** arrowhead). Never a plain undirected segment.

| Style | Appearance | Meaning | Rule |
|-------|------------|---------|------|
| **Forward** | **Solid black** stroke + **black arrowhead** | Work progresses toward production | Default for arcs that are **not** returning home |
| **Return** | **Dashed gold** stroke + **gold arrowhead** (often curved) | Resource closing its cycle | **Any arc whose target is a QUEUE** |
| **Branch** | Forward style, or brown stroke + label **`p=…`** | Probabilistic choice among multi-outs | Only when link has `probability` |

### Flow intuition

- Resource leaves **QUEUE** → works along **solid black** path → typically reaches **COUNTER** (production).  
- After work (and often after COUNTER), the path that **re-enters a QUEUE** is **dashed gold** = cyclic return.  
- Shared resources (e.g. loader after Load) also return on **dashed gold** into their idle QUEUE.

### Geometry

- Forward arcs: straight line, endpoints **outside** node bodies so the tip is visible.  
- Return arcs: curved bow + dashed gold + tip.  
- Diagram footer legend: Forward vs Return.

---

## 4. Structural modeling rules

1. Every resource has a **home QUEUE**.  
2. First task after leaving a QUEUE is usually **COMBI** (meeting / constrained).  
3. Later unconstrained steps are **NORMAL**.  
4. **QUEUE may only link to COMBI** (engine / validation rule).  
5. COMBI multi-out without probabilities: **entity i → arc i** (resource fan-out) — deterministic.  
6. COMBI may run **multiple concurrent** instances when resources allow.

---

## 5. Function nodes (independent)

GEN, CON, and probabilistic branches are **optional** and **independent**. Use only when unit-measurement logic needs them.

### 5.1 GENERATE — **GEN k**

| Item | Standard |
|------|----------|
| **Where** | On a **QUEUE** only |
| **Diagram** | Subtitle **`GEN k`** under the Q-circle (with `n = …` if any) |
| **DSL** | `generate: k` with integer **k ≥ 2** |
| **Engine** | Each **arrival** during the run becomes **k** units in that QUEUE |
| **Does not** | Multiply `initial` / starting units |
| **Typical use** | One truck arrival → k bucket loads in a work pool |

```yaml
- id: q_parts
  type: QUEUE
  label: Parts Pool
  initial: 0
  generate: 4
```

### 5.2 CONSOLIDATE — **CON n**

| Item | Standard |
|------|----------|
| **Where** | Node type **CONSOLIDATE** |
| **Diagram** | Upright **triangle** + subtitle **`CON n`** |
| **DSL** | `type: CONSOLIDATE`, `consolidate: n` with integer **n ≥ 2** |
| **Engine** | Buffer **n** arrivals, then release **one** unit (duration **0**) |
| **Typical use** | k bucket pours complete → one truck may leave |

```yaml
- id: con
  type: CONSOLIDATE
  label: Assemble Kit
  consolidate: 4
```

### 5.3 GEN + CON together

Classic teaching pair: **GEN k** on a mid-queue, **CON k** later to reassemble one production unit.  
Many models need **neither**. Prefer Example **GEN and CON Scale**.

### 5.4 Probabilistic branch — **p**

| Item | Standard |
|------|----------|
| **Where** | On a **link** (arc) after a work node with multi-out |
| **Diagram** | Label **`p=0.9`** near arc midpoint; forward tip still required |
| **DSL** | `probability: 0.9` (0–1) |
| **Engine** | If any out-arc has `probability`, sample one successor (weights normalized) |
| **Do not** | Put `probability` on COMBI multi-out used only for **resource return** fan-out |

```yaml
- from: c_inspect
  to: ctr
  probability: 0.9
- from: c_inspect
  to: n_rework
  probability: 0.1
```

Results → **Branches** tab: declared *p* vs empirical share.

---

## 6. Cost & sensitivity (prompt side)

Not graph glyphs, but part of the product standard:

| Block | Example |
|-------|---------|
| Cost | `Cost:` then `Trucks: 85` |
| Sensitivity | `Sensitivity:` then `Trucks: 2..12` |

Cost attaches to **home QUEUE** resources (`cost_usd_h` in DSL).

---

## 7. Checklist (before calling a diagram “standard”)

- [ ] Every arc has a **visible arrowhead**  
- [ ] Forward = solid black; return into QUEUE = dashed gold  
- [ ] QUEUE = Q-circle; COMBI = cut corner; NORMAL = rectangle; COUNTER = flag; CON = triangle  
- [ ] GEN only on QUEUE with label **GEN k**  
- [ ] CON only as CONSOLIDATE with label **CON n**  
- [ ] Branch multi-outs show **p=…** and sum ≈ 1  
- [ ] Each resource cycle readable: home QUEUE → work → (COUNTER) → return QUEUE  

---



---

## 6. Priority (shared resource contention)

| Item | Standard |
|------|----------|
| **Where stored** | On **COMBI** (and optionally NORMAL) as `priority: n` in DSL / node field |
| **Prompt** | Optional block `Priority:` then `TaskName: n` |
| **Rule** | **Lower number = higher priority** (MicroCYCLONE node-number tradition) |
| **Default** | If omitted, **model declaration order** (first declared COMBI wins ties) |
| **Engine** | When a shared QUEUE (e.g. crane idle) can start several COMBIs, scan in ascending priority |
| **Diagram** | Subtitle **`P1`**, **`P2`**, … next to duration |

### Prompt example (tower crane)

```
Crane: Lift Steel | Lift Forms | Lift Bucket

Priority:
Lift Steel: 1
Lift Forms: 2
Lift Bucket: 3
```

Pipe `|` on a resource line = multi-demand from one home QUEUE (not a sequence).

## 8. Relation to Halpin

| Keep from Halpin | Neo-CYCLONE choice |
|------------------|--------------------|
| Cyclic resource logic, QUEUE / COMBI / NORMAL / COUNTER | Same building blocks |
| GEN / CON as functions | Same ideas; explicit diagram labels **GEN k** / **CON n** |
| Print figures sometimes undirected or sparse arrows | **Always** directed arrows + forward/return color/dash |
| Classic MicroCYCLONE report fields | Process / element / cost reports in Results |

---

*AI-agent of Daniel W. Halpin's CYCLONE · Notation Standard v1.1*
