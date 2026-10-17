import assert from "node:assert/strict";
import { test } from "node:test";
import { EXAMPLE_PROMPTS } from "./example-prompts.ts";
import { buildSeedArchiveCsv, buildSimulationReportExcel, buildValidationCsv } from "./export-utils.ts";
import { runCyclone } from "./engine.ts";
import { parseOperationDescription } from "./nl-parser.ts";
import { PRODUCT_VERSION } from "./prompt-template.ts";
import { PAPER_SEEDS, PAVEMENT_CASES, pavementPrompt, runPaperSeedArchive } from "./paper-cases.ts";

test("example menu includes the three paper prompts", () => {
  const ids = ["paper-earthmoving", "paper-pavement-sc1", "paper-pavement-sc6"];
  for (const id of ids) {
    const ex = EXAMPLE_PROMPTS.find((e) => e.id === id);
    assert.ok(ex, id);
    const model = parseOperationDescription(ex!.prompt);
    assert.ok(model, `parse ${id}`);
  }
  const earth = parseOperationDescription(
    EXAMPLE_PROMPTS.find((e) => e.id === "paper-earthmoving")!.prompt,
  );
  assert.equal(earth!.name, "Earthmoving_Validation");
  const sc1 = parseOperationDescription(
    EXAMPLE_PROMPTS.find((e) => e.id === "paper-pavement-sc1")!.prompt,
  );
  assert.equal(sc1!.name, "RigidPavement_Baseline10");
  const sc6 = parseOperationDescription(
    EXAMPLE_PROMPTS.find((e) => e.id === "paper-pavement-sc6")!.prompt,
  );
  assert.equal(sc6!.name, "RigidPavement_SSC");
});

test("validation CSV is one data row with version, seed, waits, and idle", () => {
  const sc1 = PAVEMENT_CASES[0]!;
  const model = parseOperationDescription(pavementPrompt(sc1));
  assert.ok(model);
  const result = runCyclone(model!, { seed: 12345, maxCycles: 100, maxTime: 6000 });
  const csv = buildValidationCsv(model!, result);
  const lines = csv.trim().split("\n");
  assert.equal(lines.length, 2);
  const header = lines[0]!;
  assert.match(header, /^version,scenario,seed,cycles,time,unitsPerHour,/);
  assert.match(header, /wait: Trucks @ Discharge/);
  assert.match(header, /idle: Paver/);
  assert.match(header, /fieldM3PerHour,simOverField/);
  const cells = lines[1]!.split(",");
  assert.equal(cells[0], PRODUCT_VERSION);
  assert.equal(cells[1], "RigidPavement_Baseline10");
  assert.equal(cells[2], "12345");
  assert.equal(cells[3], "100");
  assert.equal(PRODUCT_VERSION, "1.8.1");
});

test("10-seed archive has one row per paper seed", () => {
  const sc6 = PAVEMENT_CASES[5]!;
  const model = parseOperationDescription(pavementPrompt(sc6));
  assert.ok(model);
  const results = runPaperSeedArchive(model!, 100, 6000);
  assert.equal(results.length, PAPER_SEEDS.length);
  const csv = buildSeedArchiveCsv(model!, results);
  const lines = csv.trim().split("\n");
  assert.equal(lines.length, 1 + PAPER_SEEDS.length);
  assert.match(lines[1]!, /67/);
  const seeds = lines.slice(1).map((line) => line.split(",")[2]);
  assert.deepEqual(seeds, PAPER_SEEDS.map(String));
});

test("Excel report carries version and prompt text", () => {
  const model = parseOperationDescription(pavementPrompt(PAVEMENT_CASES[5]!));
  assert.ok(model);
  const result = runCyclone(model!, { seed: 12345, maxCycles: 100, maxTime: 6000 });
  const prompt = "Operation: RigidPavement_SSC\nproduction = 10 m3";
  const xml = buildSimulationReportExcel(model!, result, prompt);
  assert.match(xml, /1\.8\.1/);
  assert.match(xml, /RigidPavement_SSC/);
  assert.match(xml, /production = 10 m3/);
  assert.match(xml, /Browser-Based Open CYCLONE Framework/);
});
