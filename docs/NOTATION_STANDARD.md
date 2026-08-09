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
| **COMBI** | Square with **top-left corner cut** | **Meeting work**: ≥2 resources required (one unit from each predecessor QUEUE). Single-resource work is NORMAL |
| **NORMAL** | Rectangle | **One-resource work**: starts from a single unit (home QUEUE or previous task). No second resource needed |
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
| **Forward** | **Solid black** stroke + **black arrowhead** | Work progresses toward production / next task | Default — including arcs into **staging** QUEUEs |
| **Return** | **Dashed gold** stroke + **gold arrowhead** (curved) | Resource closes its cycle | Target is a **home QUEUE** only |
| **Branch** | Forward style, or brown stroke + label **`p=…`** | Probabilistic choice among multi-outs | Only when link has `probability` |

### What is a home QUEUE?

| Home QUEUE (return = gold dashed) | Not home — still **forward** (solid black) |
|-----------------------------------|--------------------------------------------|
| Resource idle pool (`Trucks Idle`, `n ≥ 1`) | Staging before COMBI (`Trucks @ DumpToPaver`, `n = 0`) |
| Label contains Idle / Home with initial units | GEN pool / work buffer (`BucketPool`, `GEN k`) |
| After COUNTER / last work → idle pool | Any non-QUEUE target (COMBI, NORMAL, CON, COUNTER) |

### Flow intuition

- Leave **home QUEUE** → **solid black** along the work path (staging queues stay black).  
- Reach **COUNTER** on solid black when production is counted.  
- Only the arc that **returns into the home idle QUEUE** is **dashed gold**.  
- Shared resources (loader after Load, crane after lift) return gold into their own idle QUEUE.  
- Rule is **global in code** (`isHomeQueue` / `isReturnLink`) — not special-cased per model.

### Geometry

- Forward arcs: **straight or curved** (quadratic). Curve when the hop is long, multi-out, or would pass through another symbol.  
- Return arcs: curved bow + dashed gold + tip into home QUEUE.  
- Endpoints stay **outside** node bodies so the tip is visible.  
- Layout: one row per resource; staging QUEUE on-row before COMBI; COUNTER beside its predecessor.  
- Diagram footer legend: Forward vs Return.

---

## 4. Structural modeling rules

1. Every resource has a **home QUEUE**.  
2. A task used by **≥2 resources** is **COMBI** (they meet).  
3. A task used by **only one resource** is **NORMAL** (e.g. LoadAtPlant with trucks only).  
4. Home QUEUE may feed **COMBI or NORMAL**; staging QUEUE feeds the COMBI it precedes.  
5. COMBI multi-out without probabilities: **entity i → arc i** (resource fan-out) — deterministic.  
6. COMBI may run **multiple concurrent** instances when resources allow.

---

## 5. Function nodes (independent)

GEN, CON, and probabilistic branches are **optional** and **independent**. Use only when unit-measurement logic needs them.

### Prompt form — chain first (preferred)

```
Trucks: GEN 5 → Scoop → CON 5 TruckFull → Haul&Return
Excavator: Scoop
```

| Token in chain | Meaning |
|----------------|---------|
| `GEN 5` | GENERATE queue, k=5 (1 arrival → 5 units) |
| `CON 5 Name` | CONSOLIDATE Name, n=5 |
| `Name CON 5` | same |

Home QUEUE (`Trucks Idle`) is automatic. Do not invent a second idle; GEN is the load-zone scale node.

### Prompt form (no hand-drawn QUEUE)

In Format Prompt §4, name the step in the resource cycle, then:

```
Functions:
GEN PartsPool = 4
CON AssembleKit = 4

Branch:
After Inspect: Pass p=0.9, Rework p=0.1
```

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
