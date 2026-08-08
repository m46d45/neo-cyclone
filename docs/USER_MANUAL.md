# Neo-CYCLONE — User Manual

**Version:** 0.5  
**Language:** English  
**Tagline:** AI-agent of Daniel W. Halpin's CYCLONE

---

## 1. Workflow

1. Write the **prompt** for your construction operation.  
2. **Draw Model** → inspect the **CYCLONE Model** diagram.  
3. Refine the prompt and redraw until the network is correct.  
4. Set **max cycles**, **seed** (default **12345**), and **max time**.  
5. **Simulate** → read **Results**.

---

## 2. Time unit

**Default: minutes** for all activity durations.  
Model field: `time_unit: min` unless overridden in the DSL.

---

## 3. Prompt format (general)

```text
Resource1: Task1 → Task2 → Task3 → …
Resource2: Task1

n Resource1 = …, n Resource2 = …
production = … <unit>

Durations:   # minutes
Task1: <dist> <params>
…
```

Notes: lines starting with `#` or `//` are ignored.

### Distributions

| Dist | Parameters |
|------|------------|
| const | value |
| unif | min, max |
| tri | min, mode, max |
| normal | mean, sd |
| lognormal | mean, sd (of duration) |
| beta | min, max, alpha, beta |
| gamma | shape, scale · or `gamma mean M sd S` |

---

## 4. Run parameters (before Simulate)

| Parameter | Default | Notes |
|-----------|---------|--------|
| Max cycles | model default | Stop when COUNTER reaches this (or max time) |
| Seed | **12345** | RNG reproducibility |
| Max time | e.g. 480 | Minutes |

---

## 5. Results

Summary: cycles completed, production, productivity, average cycle, seed, simulation time.

Tabs:

- **Utilization** — bar chart with % labels  
- **Cycles & production** — cumulative production vs cycle  
- **Productivity** — rate vs time (minutes)  
- **Queues** — avg / max length  

---

## 6. Modeling rule (Halpin)

Each resource has a home QUEUE, works through its tasks, and returns home.  
Shared first tasks are COMBI meetings; later tasks are NORMAL.

---

## 7. Notation

QUEUE = Q-circle · COMBI = cut corner · NORMAL = rectangle · COUNTER = golf flag · return arcs = curved gold dashed.
