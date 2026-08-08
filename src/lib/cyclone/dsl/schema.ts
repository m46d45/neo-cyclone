import { z } from "zod";

/** Neo-CYCLONE DSL v0.1 — zod schema (canonical) */

export const DSL_VERSION = "neo-cyclone/v0.1" as const;

const idSchema = z
  .string()
  .min(1)
  .regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/, "id must start with a letter");

const durationSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("constant"),
    value: z.number().nonnegative(),
  }),
  z.object({
    kind: z.literal("uniform"),
    min: z.number().nonnegative(),
    max: z.number().nonnegative(),
  }),
  z.object({
    kind: z.literal("triangular"),
    min: z.number().nonnegative(),
    mode: z.number().nonnegative(),
    max: z.number().nonnegative(),
  }),
  z.object({
    kind: z.literal("normal"),
    mean: z.number(),
    sd: z.number().nonnegative(),
  }),
  z.object({
    kind: z.literal("lognormal"),
    mean: z.number().positive(),
    sd: z.number().nonnegative(),
  }),
  z.object({
    kind: z.literal("beta"),
    min: z.number().nonnegative(),
    max: z.number().nonnegative(),
    alpha: z.number().positive(),
    beta: z.number().positive(),
  }),
  z.object({
    kind: z.literal("gamma"),
    shape: z.number().positive(),
    scale: z.number().nonnegative(),
  }),
]);

const nodeSchema = z
  .object({
    id: idSchema,
    type: z.enum(["QUEUE", "COMBI", "NORMAL", "COUNTER", "CONSOLIDATE"]),
    label: z.string().min(1),
    x: z.number().optional(),
    y: z.number().optional(),
    initial: z.number().int().nonnegative().optional(),
    /** Hourly cost USD (home QUEUE resources). */
    cost_usd_h: z.number().nonnegative().optional(),
    duration: durationSchema.optional(),
    production: z.number().nonnegative().optional(),
    consolidate: z.number().int().min(2).optional(),
    /** Halpin GENERATE: arrivals multiplied to this many units (QUEUE only). */
    generate: z.number().int().min(2).optional(),
  })
  .superRefine((node, ctx) => {
    if (node.type === "QUEUE") {
      if (node.duration !== undefined) {
        ctx.addIssue({ code: "custom", message: "QUEUE must not have duration", path: ["duration"] });
      }
      if (node.production !== undefined) {
        ctx.addIssue({ code: "custom", message: "QUEUE must not have production", path: ["production"] });
      }
    }
    if (node.type === "COMBI" || node.type === "NORMAL") {
      if (!node.duration) {
        ctx.addIssue({ code: "custom", message: `${node.type} requires duration`, path: ["duration"] });
      }
    }
    if (node.type === "COUNTER" && node.duration !== undefined) {
      ctx.addIssue({ code: "custom", message: "COUNTER must not have duration", path: ["duration"] });
    }
    if (node.type !== "QUEUE" && node.cost_usd_h !== undefined) {
      ctx.addIssue({ code: "custom", message: "cost_usd_h is only valid on QUEUE", path: ["cost_usd_h"] });
    }
    if (node.type !== "QUEUE" && node.initial !== undefined) {
      ctx.addIssue({ code: "custom", message: "initial is only valid on QUEUE", path: ["initial"] });
    }
    if (node.type !== "COUNTER" && node.production !== undefined) {
      ctx.addIssue({ code: "custom", message: "production is only valid on COUNTER", path: ["production"] });
    }
    if (node.type !== "CONSOLIDATE" && node.consolidate !== undefined) {
      ctx.addIssue({
        code: "custom",
        message: "consolidate is only valid on CONSOLIDATE",
        path: ["consolidate"],
      });
    }
    if (node.type !== "QUEUE" && node.generate !== undefined) {
      ctx.addIssue({
        code: "custom",
        message: "generate is only valid on QUEUE",
        path: ["generate"],
      });
    }
    if (node.duration?.kind === "uniform" && node.duration.min > node.duration.max) {
      ctx.addIssue({ code: "custom", message: "uniform min must be ≤ max", path: ["duration"] });
    }
    if (node.duration?.kind === "triangular") {
      const { min, mode, max } = node.duration;
      if (!(min <= mode && mode <= max)) {
        ctx.addIssue({
          code: "custom",
          message: "triangular requires min ≤ mode ≤ max",
          path: ["duration"],
        });
      }
    }
    if (node.duration?.kind === "beta" && node.duration.min > node.duration.max) {
      ctx.addIssue({ code: "custom", message: "beta min must be ≤ max", path: ["duration"] });
    }
  });

const linkSchema = z.object({
  id: z.string().min(1).optional(),
  from: idSchema,
  to: idSchema,
  /** Halpin probabilistic branch weight (0–1). Optional. */
  probability: z.number().min(0).max(1).optional(),
});

export const neoCycloneDocumentSchema = z.object({
  dsl: z.literal(DSL_VERSION),
  model: z.object({
    id: idSchema,
    name: z.string().min(1),
    description: z.string().optional(),
    time_unit: z.string().min(1),
    production_unit: z.string().min(1),
    nodes: z.array(nodeSchema).min(1),
    links: z.array(linkSchema),
  }),
  run: z
    .object({
      seed: z.number().int().optional(),
      max_time: z.number().positive().optional(),
      max_cycles: z.number().int().positive().optional(),
    })
    .optional(),
});

export type NeoCycloneDocument = z.infer<typeof neoCycloneDocumentSchema>;
export type DslNode = z.infer<typeof nodeSchema>;
export type DslLink = z.infer<typeof linkSchema>;
export type DslDuration = z.infer<typeof durationSchema>;
