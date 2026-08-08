import type { CycloneModel, DurationSpec, DistType } from "../types";
import {
  neoCycloneDocumentSchema,
  type NeoCycloneDocument,
  type DslDuration,
} from "./schema";

export type ParseResult =
  | { ok: true; model: CycloneModel; run?: NeoCycloneDocument["run"] }
  | { ok: false; errors: string[] };

function toDuration(d: DslDuration): DurationSpec {
  switch (d.kind) {
    case "constant":
      return { type: "CONSTANT", params: [d.value] };
    case "uniform":
      return { type: "UNIFORM", params: [d.min, d.max] };
    case "triangular":
      return { type: "TRIANGULAR", params: [d.min, d.mode, d.max] };
    case "normal":
      return { type: "NORMAL", params: [d.mean, d.sd] };
    case "lognormal":
      return { type: "LOGNORMAL", params: [d.mean, d.sd] };
    case "beta":
      return { type: "BETA", params: [d.min, d.max, d.alpha, d.beta] };
    case "gamma":
      return { type: "GAMMA", params: [d.shape, d.scale] };
    default:
      return { type: "CONSTANT", params: [1] };
  }
}

/** Parse Neo-CYCLONE DSL JSON string into CycloneModel. */
export function parseDsl(raw: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { ok: false, errors: [`Invalid JSON: ${(e as Error).message}`] };
  }
  const parsed = neoCycloneDocumentSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map(
        (i) => `${i.path.join(".") || "(root)"}: ${i.message}`,
      ),
    };
  }
  const doc = parsed.data;
  const model = docToModel(doc);
  return { ok: true, model, run: doc.run };
}

function docToModel(doc: NeoCycloneDocument): CycloneModel {
  const { model } = doc;
  return {
    id: model.id,
    name: model.name,
    description: model.description ?? "",
    timeUnit: model.time_unit,
    productionUnit: model.production_unit,
    defaultRuns: 1,
    defaultMaxTime: doc.run?.max_time ?? 480,
    defaultMaxCycles: doc.run?.max_cycles ?? 100,
    nodes: model.nodes.map((n, i) => ({
      id: n.id,
      type: n.type,
      label: n.label,
      x: n.x ?? 80 + (i % 4) * 160,
      y: n.y ?? 80 + Math.floor(i / 4) * 120,
      initialUnits: n.type === "QUEUE" ? (n.initial ?? 0) : undefined,
      generateCount:
        n.type === "QUEUE" && n.generate != null && n.generate >= 2
          ? n.generate
          : undefined,
      costPerHourUsd:
        n.type === "QUEUE" && n.cost_usd_h != null && n.cost_usd_h > 0
          ? n.cost_usd_h
          : undefined,
      duration: n.duration ? toDuration(n.duration) : undefined,
      productionAmount: n.type === "COUNTER" ? (n.production ?? 1) : undefined,
      consolidateCount: n.type === "CONSOLIDATE" ? (n.consolidate ?? 2) : undefined,
    })),
    links: model.links.map((l, i) => ({
      id: l.id ?? `l${i + 1}`,
      from: l.from,
      to: l.to,
    })),
  };
}
