import { parse as parseYaml } from "yaml";
import type { CycloneModel, DurationDist, SimConfig } from "../types";
import { neoCycloneDocumentSchema, type NeoCycloneDocument } from "./schema";
import { hasBlockingErrors, validateHalpinRules, type DslIssue } from "./validate";

export type ParseDslResult =
  | {
      ok: true;
      document: NeoCycloneDocument;
      model: CycloneModel;
      run: SimConfig;
      warnings: DslIssue[];
    }
  | {
      ok: false;
      errors: string[];
      issues: DslIssue[];
    };

export function parseDsl(source: string): ParseDslResult {
  const trimmed = source.trim();
  if (!trimmed) {
    return { ok: false, errors: ["Empty document"], issues: [] };
  }

  let raw: unknown;
  try {
    if (trimmed.startsWith("{")) {
      raw = JSON.parse(trimmed);
    } else {
      raw = parseYaml(trimmed);
    }
  } catch (e) {
    return {
      ok: false,
      errors: [`Syntax error: ${e instanceof Error ? e.message : "invalid YAML/JSON"}`],
      issues: [],
    };
  }

  const parsed = neoCycloneDocumentSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((i) => {
      const path = i.path.length ? i.path.join(".") : "(root)";
      return `${path}: ${i.message}`;
    });
    return { ok: false, errors, issues: [] };
  }

  const document = parsed.data;
  const issues = validateHalpinRules(document);
  if (hasBlockingErrors(issues)) {
    return {
      ok: false,
      errors: issues.filter((i) => i.level === "error").map((i) => i.message),
      issues,
    };
  }

  const model = documentToModel(document);
  const run: SimConfig = {
    seed: document.run?.seed ?? 42,
    maxTime: document.run?.max_time ?? 480,
    maxCycles: document.run?.max_cycles ?? 500,
  };

  return {
    ok: true,
    document,
    model,
    run,
    warnings: issues.filter((i) => i.level === "warning"),
  };
}

export function documentToModel(doc: NeoCycloneDocument): CycloneModel {
  const { model } = doc;
  return {
    id: model.id,
    name: model.name,
    description: model.description ?? "",
    timeUnit: model.time_unit,
    productionUnit: model.production_unit,
    defaultRuns: 1,
    defaultMaxTime: doc.run?.max_time ?? 480,
    defaultMaxCycles: doc.run?.max_cycles ?? 500,
    nodes: model.nodes.map((n, i) => ({
      id: n.id,
      type: n.type,
      label: n.label,
      x: n.x ?? 80 + (i % 4) * 160,
      y: n.y ?? 80 + Math.floor(i / 4) * 120,
      initialUnits: n.type === "QUEUE" ? (n.initial ?? 0) : undefined,
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

function toDuration(d: NonNullable<NeoCycloneDocument["model"]["nodes"][0]["duration"]>): DurationDist {
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
