# Neo-CYCLONE DSL v0.1 (internal)

**Status:** internal engine format (not a separate product UI)  
**UI product decision:** **single interface = AI agent only**  
Diagram + Results support the agent; users do not edit Syntax / Network / multi-surface studios.

The agent drafts models → diagram updates for verification → **Neo-CYCLONE Go** runs the engine.

Engine still uses this DSL (YAML/JSON) under the hood for parse/validate/serialize.

| Field | Rule |
|-------|------|
| `dsl` | `"neo-cyclone/v0.1"` |
| Nodes | QUEUE, COMBI, NORMAL, COUNTER, CONSOLIDATE |
| Links | Order defines COMBI multi-resource mapping |
| Run | seed, max_time, max_cycles |

See `examples/earthmoving.ncyc.yaml` for a full sample.

### Agent product rules

1. Phases may be skipped  
2. Bilingual ID / EN  
3. Run: **Neo-CYCLONE Go**  
4. Output: standard CYCLONE stats only  
