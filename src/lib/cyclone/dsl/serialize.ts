import type { CycloneModel, DurationSpec } from "../types";
import { DSL_VERSION, type NeoCycloneDocument, type DslDuration } from "./schema";

function sanitizeId(id: string): string {
  const s = id.replace(/[^a-zA-Z0-9_-]/g, "_");
  return /^[a-zA-Z]/.test(s) ? s : `n_${s}`;
}

function fromDuration(d: DurationSpec): DslDuration {
  const p = d.params;
  switch (d.type) {
    case "CONSTANT":
      return { kind: "constant", value: p[0] ?? 1 };
    case "UNIFORM":
      return { kind: "uniform", min: p[0] ?? 0, max: p[1] ?? 1 };
    case "TRIANGULAR":
      return { kind: "triangular", min: p[0] ?? 0, mode: p[1] ?? 1, max: p[2] ?? 2 };
    case "NORMAL":
      return { kind: "normal", mean: p[0] ?? 1, sd: p[1] ?? 0.1 };
    case "LOGNORMAL":
      return { kind: "lognormal", mean: p[0] ?? 1, sd: p[1] ?? 0.1 };
    case "BETA":
      return {
        kind: "beta",
        min: p[0] ?? 0,
        max: p[1] ?? 1,
        alpha: p[2] ?? 2,
        beta: p[3] ?? 2,
      };
    case "GAMMA":
      return { kind: "gamma", shape: p[0] ?? 1, scale: p[1] ?? 1 };
    default:
      return { kind: "constant", value: 1 };
  }
}

/** Serialize CycloneModel to Neo-CYCLONE DSL JSON string. */
export function serializeDsl(
  model: CycloneModel,
  options: { seed?: number; maxTime?: number; maxCycles?: number } = {},
): string {
  const doc: NeoCycloneDocument = {
    dsl: DSL_VERSION,
    model: {
      id: sanitizeId(model.id),
      name: model.name,
      description: model.description || undefined,
      time_unit: model.timeUnit,
      production_unit: model.productionUnit,
      nodes: model.nodes.map((n) => {
        const base: NeoCycloneDocument["model"]["nodes"][0] = {
          id: sanitizeId(n.id),
          type: n.type,
          label: n.label,
          x: n.x,
          y: n.y,
        };
        if (n.type === "QUEUE") {
          base.initial = n.initialUnits ?? 0;
          if (n.generateCount != null && n.generateCount >= 2) {
            base.generate = n.generateCount;
          }
          if (n.costPerHourUsd != null && n.costPerHourUsd > 0) {
            base.cost_usd_h = n.costPerHourUsd;
          }
        }
        if ((n.type === "COMBI" || n.type === "NORMAL") && n.duration) {
          base.duration = fromDuration(n.duration);
        }
        if (n.type === "COUNTER") base.production = n.productionAmount ?? 1;
        if (n.type === "CONSOLIDATE") base.consolidate = n.consolidateCount ?? 2;
        return base;
      }),
      links: model.links.map((l) => ({
        id: l.id,
        from: sanitizeId(l.from),
        to: sanitizeId(l.to),
      })),
    },
    run: {
      seed: options.seed ?? 42,
      max_time: options.maxTime ?? model.defaultMaxTime,
      max_cycles: options.maxCycles ?? model.defaultMaxCycles,
    },
  };
  return JSON.stringify(doc, null, 2);
}
