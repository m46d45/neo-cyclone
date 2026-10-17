/**
 * Locks ITcon v1.7.5 productivity (seed 12345) on the current engine.
 * Written and run before the v1.8.0 branch-statistic edit.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { EXAMPLE_PROMPTS } from "./example-prompts.ts";
import { runCyclone } from "./engine.ts";
import { parseOperationDescription } from "./nl-parser.ts";
import {
  GIRDER_PROMPT,
  PAPER_SEED,
  PAVEMENT_CASES,
  pavementPrompt,
} from "./paper-cases.ts";

const MAX_CYCLES = 100;
const MAX_TIME = 6000;

function near(actual: number, expected: number, tol: number, label: string) {
  assert.ok(
    Number.isFinite(actual) && Math.abs(actual - expected) <= tol,
    `${label}: expected ${expected} ± ${tol}, got ${actual}`,
  );
}

test("pavement Sc 1–7 seed 12345 match the v1.7.5 archive productivities", () => {
  for (const c of PAVEMENT_CASES) {
    const model = parseOperationDescription(pavementPrompt(c));
    assert.ok(model, `parse ${c.operation}`);
    assert.equal(model!.name, c.operation);
    const result = runCyclone(model!, {
      seed: PAPER_SEED,
      maxCycles: MAX_CYCLES,
      maxTime: MAX_TIME,
    });
    assert.equal(result.cyclesCompleted, 100, c.operation);
    const uph = result.counterStats[0]?.unitsPerHour ?? Number.NaN;
    near(uph, c.unitsPerHour12345, 0.02, c.operation);
  }
});

test("pavement Sc 1 seed 12345 keeps archived truck wait and paver idle", () => {
  const sc1 = PAVEMENT_CASES[0]!;
  const model = parseOperationDescription(pavementPrompt(sc1));
  assert.ok(model);
  const result = runCyclone(model!, {
    seed: PAPER_SEED,
    maxCycles: MAX_CYCLES,
    maxTime: MAX_TIME,
  });
  const discharge = result.queueStats.find((q) => q.label === "Trucks @ Discharge");
  assert.ok(discharge, "waiting queue before Discharge");
  near(discharge!.avgWaitTime, 28.4, 0.05, "truck wait");
  const paver = result.resourceIdleStats.find((r) => r.resourceLabel === "Paver");
  assert.ok(paver);
  near(paver!.idlePct, 0.5, 0.05, "paver idle");
});

test("asphalt branch empirical share uses declared-p arcs only and keeps productivity", () => {
  const prompt = EXAMPLE_PROMPTS.find((e) => e.id === "asphalt-paving")?.prompt;
  assert.ok(prompt);
  const model = parseOperationDescription(prompt!);
  assert.ok(model);
  const result = runCyclone(model!, {
    seed: PAPER_SEED,
    maxCycles: MAX_CYCLES,
    maxTime: MAX_TIME,
  });
  near(result.counterStats[0]?.unitsPerHour ?? Number.NaN, 9.997136212309913, 1e-9, "asphalt uph");
  const probs = result.branchStats.map((b) => b.probability);
  assert.ok(probs.every((p) => p != null), "fan-out without p is not a branch row");
  const refill = result.branchStats.find((b) => b.toLabel === "RefillAsphalt");
  const breakdown = result.branchStats.find((b) => b.toLabel === "Breakdown");
  assert.ok(refill && breakdown);
  assert.equal(refill!.timesTaken, 80);
  assert.equal(breakdown!.timesTaken, 20);
  near(refill!.empiricalShare, 0.8, 1e-9, "refill share");
  near(breakdown!.empiricalShare, 0.2, 1e-9, "breakdown share");
  near(refill!.probability ?? Number.NaN, 0.85, 1e-9, "refill p");
  near(breakdown!.probability ?? Number.NaN, 0.15, 1e-9, "breakdown p");
});

test("girder seed 12345 matches the v1.7.5 archive (60 cycles, 0.600 girder/h)", () => {
  const model = parseOperationDescription(GIRDER_PROMPT);
  assert.ok(model);
  assert.equal(model!.name, "PCI_Girder_Cinapel");
  const result = runCyclone(model!, {
    seed: PAPER_SEED,
    maxCycles: MAX_CYCLES,
    maxTime: MAX_TIME,
  });
  assert.equal(result.cyclesCompleted, 60);
  const uph = result.counterStats[0]?.unitsPerHour ?? Number.NaN;
  near(uph, 0.6, 0.002, "girder units/h");
});
