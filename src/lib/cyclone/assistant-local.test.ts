import assert from "node:assert/strict";
import { test } from "node:test";
import {
  applyAddAfter,
  applyCountAssignments,
  localAssistant,
  parseAddAfter,
  parseCountAssignments,
} from "./assistant-local.ts";

const ASPHALT = `# Example 2 — Asphalt paving

Operation: Asphalt Paving

Trucks: DumpToPaver → RefillAsphalt
Paver: DumpToPaver → Pave
4 trucks, 1 paver

Counter after: Pave
production = 1 load

Cost:
Trucks: 95
Paver: 180

Durations:
DumpToPaver: tri 0.8, 1.2, 1.8
RefillAsphalt: tri 8, 12, 18
Pave: normal 3.5, 0.6
`;

const CONTEXT = `model: Asphalt Paving
cyclesCompleted: 100
last unitsPerHour: 12.5
idle Paver Idle: idlePct=0.5 busyPct=99.5 n=1
idle Trucks Idle: idlePct=42.0 busyPct=58.0 n=4
cost totalUsd=1234.56 unitCostUsd=0.4321
  cost Trucks: 800.00 USD
  cost Paver: 434.56 USD
`;

test("parses Propose trucks = 8; keep paver = 1", () => {
  const a = parseCountAssignments("Propose trucks = 8; keep paver = 1. I will re-simulate.");
  assert.equal(a.length, 2);
  assert.equal(a[0]!.name.toLowerCase(), "trucks");
  assert.equal(a[0]!.n, 8);
  assert.equal(a[1]!.name.toLowerCase(), "paver");
  assert.equal(a[1]!.n, 1);
});

test("applies fleet counts without touching Cost: rates", () => {
  const r = applyCountAssignments(ASPHALT, [
    { name: "trucks", n: 8 },
    { name: "paver", n: 1 },
  ]);
  assert.equal(r.applied.length, 2);
  assert.match(r.next, /8 trucks, 1 paver/);
  assert.match(r.next, /Trucks:\s*95/);
  assert.doesNotMatch(r.next, /8 trucks, 8 paver/);
});

test("parses add slump-test after Discharge", () => {
  const p = parseAddAfter("Add a slump-test activity of 5 minutes after Discharge.");
  assert.ok(p);
  assert.equal(p!.name, "SlumpTest");
  assert.equal(p!.after, "Discharge");
  assert.equal(p!.minutes, 5);
});

test("inserts task after DumpToPaver and duration", () => {
  const r = applyAddAfter(ASPHALT, "SlumpTest", "DumpToPaver", 5);
  assert.equal(r.ok, true);
  assert.match(r.next, /Trucks: DumpToPaver → SlumpTest → RefillAsphalt/);
  assert.match(r.next, /SlumpTest: const 5/);
});

test("local assistant answers the two screenshot messages", () => {
  const fleet = localAssistant(
    "Propose trucks = 8; keep paver = 1. I will re-simulate.",
    ASPHALT,
    CONTEXT,
  );
  assert.ok(fleet.proposedPrompt);
  assert.match(fleet.proposedPrompt!, /8 trucks, 1 paver/);
  assert.equal(fleet.suggestSimulate, true);
  assert.doesNotMatch(fleet.reply, /XAI_API_KEY/i);
  assert.match(fleet.reply, /8/);

  const add = localAssistant(
    "Add a slump-test activity of 5 minutes after Discharge.",
    ASPHALT,
    CONTEXT,
  );
  assert.doesNotMatch(add.reply, /XAI_API_KEY/i);
  assert.match(add.reply, /DumpToPaver|Discharge|Known tasks/i);

  const withDump = localAssistant(
    "Add a slump-test activity of 5 minutes after DumpToPaver.",
    ASPHALT,
    CONTEXT,
  );
  assert.ok(withDump.proposedPrompt);
  assert.match(withDump.proposedPrompt!, /SlumpTest/);
});

test("unit cost and bottleneck and no API-key fallback", () => {
  const cost = localAssistant("What is the unit cost?", ASPHALT, CONTEXT);
  assert.match(cost.reply, /0\.4321/);
  assert.doesNotMatch(cost.reply, /XAI_API_KEY/);

  const bn = localAssistant("Which resource is the bottleneck?", ASPHALT, CONTEXT);
  assert.match(bn.reply, /Trucks Idle/);
  assert.match(bn.reply, /42\.0%/);

  const unknown = localAssistant("Can you write a poem about pavers?", ASPHALT, CONTEXT);
  assert.doesNotMatch(unknown.reply, /XAI_API_KEY/);
  assert.match(unknown.reply, /Asphalt|Fleet|Propose/i);
});
