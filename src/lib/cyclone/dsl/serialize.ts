import type { CycloneModel, DurationDist } from "../types";
import { DSL_VERSION, type NeoCycloneDocument, type DslDuration } from "./schema";

export type SerializeOptions = {
  seed?: number;
  maxTime?: number;
  maxCycles?: number;
};

function sanitizeId(id: string): string {
  const s = id.replace(/[^a-zA-Z0-9_-]/g, "_");
  return /^[a-zA-Z]/.test(s) ? s : `n_${s}`;
}

function fromDuration(d: DurationDist): DslDuration {
  switch (d.kind) {
    case "constant":
      return { kind: "constant", value: d.value };
    case "uniform":
      return { kind: "uniform", min: d.min, max: d.max };
    case "triangular":
      return { kind: "triangular", min: d.min, mode: d.mode, max: d.max };
    case "normal":
      return { kind: "normal", mean: d.mean, sd: d.sd };
    case "lognormal":
      return { kind: "lognormal", mean: d.mean, sd: d.sd };
    case "beta":
      return {
        kind: "beta",
        min: d.min,
        max: d.max,
        alpha: d.alpha,
        beta: d.beta,
      };
    case "gamma":
      return { kind: "gamma", shape: d.shape, scale: d.scale };
  }
}

/** Serialize CycloneModel to Neo-CYCLONE DSL JSON string. */
export function serializeDsl(
  model: CycloneModel,
  options: SerializeOptions = {},
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
        if (
          (n.type === "COMBI" || n.type === "NORMAL") &&
          n.priority != null &&
          n.priority > 0
        ) {
          base.priority = n.priority;
        }
        if (n.type === "COUNTER") base.production = n.productionAmount ?? 1;
        if (n.type === "CONSOLIDATE") base.consolidate = n.consolidateCount ?? 2;
        return base;
      }),
      links: model.links.map((l) => {
        const link: NeoCycloneDocument["model"]["links"][0] = {
          id: l.id,
          from: sanitizeId(l.from),
          to: sanitizeId(l.to),
        };
        if (l.probability != null && l.probability >= 0 && l.probability <= 1) {
          link.probability = l.probability;
        }
        return link;
      }),
    },
    run: {
      seed: options.seed ?? 42,
      max_time: options.maxTime ?? model.defaultMaxTime,
      max_cycles: options.maxCycles ?? model.defaultMaxCycles,
    },
  };
  return JSON.stringify(doc, null, 2);
}
