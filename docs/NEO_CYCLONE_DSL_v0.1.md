# Neo-CYCLONE internal model format (v0.1)

**Status:** internal only — **not** a user-facing product surface.  
**Product UI (2026):** single studio — **Format Prompt → Draw Model → Simulate → Results**, plus **AI Assistant**.  
There is no separate Syntax editor, Network builder studio, or “Neo-CYCLONE Go” command.

## Role

The browser engine represents a CYCLONE network as a validated object graph (and optional YAML/JSON for tests). Users never hand-edit this format; the Format Prompt builder and diagram are the teaching surface.

| Field | Rule |
|-------|------|
| `dsl` | `"neo-cyclone/v0.1"` |
| Nodes | QUEUE, COMBI, NORMAL, COUNTER, CONSOLIDATE (GEN as QUEUE attribute) |
| Links | Forward (solid black) / return (dashed gold); optional branch `p` |
| Run | `seed` (default 12345), `max_cycles` (default 100, cap 500), time unit minutes |

Sample YAML (developers/tests): `examples/earthmoving.ncyc.yaml` if present.

## Product rules (current)

1. One UI path: Format Prompt + CYCLONE Model + Results (Simulation / Sensitivity).  
2. **English** product language (teaching tribute to Halpin).  
3. Run control: **Simulate** (not a special “Go” keyword).  
4. Reports: MicroCYCLONE-style process, element, cost, productivity, idleness; optional sensitivity.  
5. Optional first data line after `#` notes: `Operation: <name>` (reports / Excel filename).

See `docs/USER_MANUAL.md` and `docs/NOTATION_STANDARD.md` for user-facing rules.
