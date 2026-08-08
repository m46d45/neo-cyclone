import { stringify } from "yaml";
import type { CycloneModel, DurationDist } from "../types";
import { DSL_VERSION, type NeoCycloneDocument } from "./schema";

export type SerializeOptions = {
  seed?: number;
  maxTime?: number;
  maxCycles?: number;
  format?: "yaml" | "json";
};

export function serializeDsl(model: CycloneModel, options: SerializeOptions = {}): string {
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

  if (options.format === "json") {
    return JSON.stringify(doc, null, 2);
  }

  return stringify(doc, {
    lineWidth: 100,
    defaultStringType: "PLAIN",
  });
}

function fromDuration(
  d: DurationDist,
): NonNullable<NeoCycloneDocument["model"]["nodes"][0]["duration"]> {
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
      return { kind: "beta", min: d.min, max: d.max, alpha: d.alpha, beta: d.beta };
    case "gamma":
      return { kind: "gamma", shape: d.shape, scale: d.scale };
  }
}

function sanitizeId(id: string): string {
  const s = id.replace(/[^a-zA-Z0-9_-]/g, "_");
  if (/^[a-zA-Z]/.test(s)) return s;
  return `n_${s}`;
}
