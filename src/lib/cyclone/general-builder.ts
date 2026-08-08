import type { CycloneLink, CycloneModel, CycloneNode, DurationDist } from "./types";
import {
  parseDurationBlock,
  parseStepsWithInlineDurations,
  parseDurationToken,
} from "./duration-format";
import { stripPromptComments } from "./prompt-template";
import {
  parseCostAndSensitivity,
  applyCostsToModel,
} from "./sensitivity";

export type ResourceCycle = {
  id: string;
  label: string;
  count: number;
  itinerary: string[];
};

export type OperationSpec = {
  name: string;
  description?: string;
  timeUnit?: string;
  productionUnit?: string;
  productionPerCycle?: number;
  maxTime?: number;
  maxCycles?: number;
  resources: ResourceCycle[];
  durations?: Record<string, DurationDist>;
  productionResourceId?: string;
};

const DEFAULT_DUR: DurationDist = { kind: "triangular", min: 2, mode: 4, max: 6 };

function slug(s: string): string {
  const x = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 28);
  return x && /^[a-z]/.test(x) ? x : `n_${x || "x"}`;
}

function uniqueId(base: string, used: Set<string>): string {
  let id = slug(base);
  if (!used.has(id)) {
    used.add(id);
    return id;
  }
  let i = 2;
  while (used.has(`${id}_${i}`)) i++;
  const out = `${id}_${i}`;
  used.add(out);
  return out;
}

function titleCase(s: string): string {
  return s.replace(/(^|[\s-_])(\w)/g, (_, a, b) => a + String(b).toUpperCase());
}

function normLabel(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function lookupDur(
  map: Record<string, DurationDist> | undefined,
  key: string,
): DurationDist | undefined {
  if (!map) return undefined;
  if (map[key]) return map[key];
  const found = Object.entries(map).find(([k]) => normLabel(k) === normLabel(key));
  return found?.[1];
}

export function buildFromSpec(spec: OperationSpec): CycloneModel {
  if (!spec.resources.length) throw new Error("Need at least one resource");
  for (const r of spec.resources) {
    if (!r.itinerary.length) {
      throw new Error(`Resource "${r.label}" needs at least one task in its cycle`);
    }
  }

  const used = new Set<string>();
  const nodes: CycloneNode[] = [];
  const links: CycloneLink[] = [];
  let linkN = 0;
  const linkSet = new Set<string>();
  const addLink = (from: string, to: string) => {
    const key = `${from}->${to}`;
    if (linkSet.has(key)) return;
    linkSet.add(key);
    links.push({ id: `l${++linkN}`, from, to });
  };

  const homeQueue = new Map<string, string>();
  spec.resources.forEach((r, i) => {
    const id = uniqueId(`q_${r.id}`, used);
    homeQueue.set(r.id, id);
    nodes.push({
      id,
      type: "QUEUE",
      label: /idle|antrian|wait/i.test(r.label) ? r.label : `${r.label} Idle`,
      x: 60,
      y: 90 + i * 140,
      initialUnits: Math.max(0, Math.floor(r.count)),
    });
  });

  const firstLabels = new Set(spec.resources.map((r) => normLabel(r.itinerary[0]!)));
  const activityId = new Map<string, string>();
  const activityType = new Map<string, "COMBI" | "NORMAL">();

  for (const r of spec.resources) {
    for (const lab of r.itinerary) {
      const key = normLabel(lab);
      if (activityId.has(key)) continue;
      const isCombi = firstLabels.has(key);
      const id = uniqueId(isCombi ? `c_${key}` : `n_${key}`, used);
      activityId.set(key, id);
      activityType.set(key, isCombi ? "COMBI" : "NORMAL");
      const dur =
        lookupDur(spec.durations, lab) ?? lookupDur(spec.durations, key) ?? DEFAULT_DUR;
      nodes.push({
        id,
        type: isCombi ? "COMBI" : "NORMAL",
        label: lab.trim(),
        x: 0,
        y: 0,
        duration: dur,
      });
    }
  }

  const prodRes =
    spec.resources.find((r) => r.id === spec.productionResourceId) ?? spec.resources[0]!;
  const counterId = uniqueId("ctr", used);
  nodes.push({
    id: counterId,
    type: "COUNTER",
    label: "Production",
    x: 0,
    y: 0,
    productionAmount: spec.productionPerCycle ?? 1,
  });

  for (const r of spec.resources) {
    const home = homeQueue.get(r.id)!;
    const steps = r.itinerary.map((lab) => ({
      key: normLabel(lab),
      id: activityId.get(normLabel(lab))!,
      type: activityType.get(normLabel(lab))!,
      label: lab,
    }));

    addLink(home, steps[0]!.id);

    for (let i = 0; i < steps.length - 1; i++) {
      const a = steps[i]!;
      const b = steps[i + 1]!;
      if (b.type === "COMBI") {
        const stagId = uniqueId(`q_${r.id}_${b.key}`, used);
        nodes.push({
          id: stagId,
          type: "QUEUE",
          label: `${r.label} @ ${b.label}`,
          x: 0,
          y: 0,
          initialUnits: 0,
        });
        addLink(a.id, stagId);
        addLink(stagId, b.id);
      } else {
        addLink(a.id, b.id);
      }
    }

    const last = steps[steps.length - 1]!;
    if (r.id === prodRes.id) {
      addLink(last.id, counterId);
      addLink(counterId, home);
    } else {
      addLink(last.id, home);
    }
  }

  layoutNodes(nodes, spec.resources, homeQueue, activityId, counterId);

  return {
    id: uniqueId(slug(spec.name) || "operation", new Set()),
    name: spec.name,
    description:
      spec.description ??
      "Per-resource CYCLONE cycles with task durations.",
    timeUnit: spec.timeUnit ?? "min",
    productionUnit: spec.productionUnit ?? "unit",
    defaultRuns: 1,
    defaultMaxTime: spec.maxTime ?? 480,
    defaultMaxCycles: spec.maxCycles ?? 500,
    nodes,
    links,
  };
}

function layoutNodes(
  nodes: CycloneNode[],
  resources: ResourceCycle[],
  homeQueue: Map<string, string>,
  activityId: Map<string, string>,
  counterId: string,
): void {
  const byId = new Map(nodes.map((n) => [n.id, n]));

  resources.forEach((r, i) => {
    const q = byId.get(homeQueue.get(r.id)!)!;
    q.x = 60;
    q.y = 90 + i * 140;
  });

  let col = 0;
  const primary = resources[0]!;
  primary.itinerary.forEach((lab) => {
    const n = byId.get(activityId.get(normLabel(lab))!)!;
    n.x = 260 + col * 150;
    n.y = 90;
    col++;
  });

  for (const n of nodes) {
    if (n.type === "QUEUE" && n.x === 0 && n.y === 0) {
      n.x = 200;
      n.y = 220;
    }
    if ((n.type === "COMBI" || n.type === "NORMAL") && n.x === 0) {
      n.x = 300;
      n.y = 250;
    }
  }

  const ctr = byId.get(counterId)!;
  const lastLab = primary.itinerary[primary.itinerary.length - 1]!;
  const last = byId.get(activityId.get(normLabel(lastLab))!)!;
  ctr.x = last.x + 160;
  ctr.y = Math.max(40, last.y - 30);
}

export function parseExplicitResourceCycles(text: string): {
  resources: ResourceCycle[];
  inlineDurations: Record<string, DurationDist>;
} | null {
  const cycles: ResourceCycle[] = [];
  const inlineDurations: Record<string, DurationDist> = {};
  const seen = new Set<string>();

  const bracket = [
    ...text.matchAll(/(\d+)\s*([A-Za-z][A-Za-z0-9 \-]{1,28}?)\s*\[\s*([^\]]+?)\s*\]/g),
  ];
  for (const m of bracket) {
    const count = Math.max(1, Math.floor(Number(m[1])));
    const label = titleCase(m[2]!.trim());
    const { labels, durations } = parseStepsWithInlineDurations(m[3]!.replace(/,/g, " → "));
    const itinerary = labels.length > 1 ? labels : splitSteps(m[3]!);
    Object.assign(inlineDurations, durations);
    if (!itinerary.length) continue;
    const id = slug(label);
    if (seen.has(id)) continue;
    seen.add(id);
    cycles.push({ id, label, count, itinerary });
  }

  const lines = text.split(/\n|;/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    if (/^durations?\s*:/i.test(line) || /^durasi\s*:/i.test(line)) continue;
    const m = line.match(/^(?:(\d+)\s+)?([A-Za-z][A-Za-z0-9 \-]{1,28}?)\s*:\s*(.+)$/);
    if (!m) continue;
    const label = titleCase(m[2]!.trim());
    if (/^(http|https|min|note|phase|load|haul|dump|return|work|travel|pour)/i.test(label)) {
      if (parseDurationToken(m[3]!) && !/→|->|=>/.test(m[3]!)) continue;
    }
    if (!/→|->|=>|—/.test(m[3]!) && !/\[/.test(m[3]!)) {
      if (parseDurationToken(m[3]!) && /const|tri|unif|normal|norm|logn|beta|gamma|uniform|triangular/i.test(m[3]!)) {
        if (!/trucks?|loader|crew|pump|crane|mixer/i.test(label)) continue;
      }
    }
    if (/^(http|https|min|note|phase)/i.test(label)) continue;

    let itinerary: string[];
    if (/→|->|=>|—/.test(m[3]!) || /\(.*\d/.test(m[3]!)) {
      const parsed = parseStepsWithInlineDurations(m[3]!);
      itinerary = parsed.labels;
      Object.assign(inlineDurations, parsed.durations);
    } else {
      itinerary = splitSteps(m[3]!);
    }
    if (!itinerary.length) continue;
    if (
      itinerary.length === 1 &&
      parseDurationToken(m[3]!) &&
      /const|tri|unif|normal|logn|beta|gamma|uniform|triangular/i.test(m[3]!)
    ) {
      continue;
    }

    const id = slug(label);
    if (seen.has(id)) continue;
    seen.add(id);
    const count = m[1] ? Math.max(1, Math.floor(Number(m[1]))) : guessCount(text, label);
    cycles.push({ id, label, count, itinerary });
  }

  return cycles.length ? { resources: cycles, inlineDurations } : null;
}

function splitSteps(s: string): string[] {
  return s
    .split(/\s*(?:→|->|=>|—|,|;|\|)\s*/)
    .map((x) => x.trim().replace(/\s*[\(\[].*$/, ""))
    .filter((x) => x.length > 0 && x.length < 40)
    .slice(0, 12);
}

function guessCount(text: string, label: string): number {
  const re = new RegExp(`(\\d+)\\s*${label.replace(/\s+/g, "\\s*")}\\b`, "i");
  const m = text.match(re);
  if (m?.[1]) return Math.max(1, Math.floor(Number(m[1])));
  const word = label.split(/\s+/)[0] ?? label;
  const re2 = new RegExp(`(\\d+)\\s*${word}s?\\b`, "i");
  const m2 = text.match(re2);
  return m2?.[1] ? Math.max(1, Math.floor(Number(m2[1]))) : 1;
}

const RESOURCE_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /(\d+)\s*mixer\s*trucks?\b/i, label: "Mixer trucks" },
  { re: /(\d+)\s*(dump\s*)?trucks?\b/i, label: "Trucks" },
  { re: /(\d+)\s*truk\b/i, label: "Trucks" },
  { re: /(\d+)\s*haulers?\b/i, label: "Haulers" },
  { re: /(\d+)\s*mixers?\b/i, label: "Mixers" },
  { re: /(\d+)\s*loaders?\b/i, label: "Loader" },
  { re: /(\d+)\s*excavators?\b/i, label: "Excavator" },
  { re: /(\d+)\s*cranes?\b/i, label: "Crane" },
  { re: /(\d+)\s*pumps?\b/i, label: "Pump" },
  { re: /(\d+)\s*pompa\b/i, label: "Pump" },
  { re: /(\d+)\s*crews?\b/i, label: "Crew" },
  { re: /(\d+)\s*(workers?|pekerja|tukang)\b/i, label: "Workers" },
  { re: /(\d+)\s*scaffolds?\b/i, label: "Scaffold" },
  { re: /(\d+)\s*dozers?\b/i, label: "Dozer" },
  { re: /(\d+)\s*rollers?\b/i, label: "Roller" },
  { re: /(\d+)\s*pavers?\b/i, label: "Paver" },
  { re: /(\d+)\s*barges?\b/i, label: "Barge" },
  { re: /(\d+)\s*forms?\b/i, label: "Formwork" },
];

function extractResources(text: string): { id: string; label: string; count: number }[] {
  const found: { id: string; label: string; count: number; index: number }[] = [];
  const consumed: [number, number][] = [];
  const overlaps = (start: number, end: number) =>
    consumed.some(([a, b]) => start < b && end > a);

  for (const { re, label } of RESOURCE_PATTERNS) {
    const global = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    let m: RegExpExecArray | null;
    while ((m = global.exec(text)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      if (overlaps(start, end)) continue;
      const id = slug(label);
      if (found.some((f) => f.id === id)) continue;
      consumed.push([start, end]);
      found.push({
        id,
        label,
        count: Math.max(1, Math.floor(Number(m[1]))),
        index: start,
      });
    }
  }

  if (!found.length) {
    const gen = text.matchAll(/(\d+)\s+([a-z][a-z-]{2,18})s?\b/gi);
    for (const m of gen) {
      const lab = titleCase(m[2] ?? "Unit");
      if (/^(min|minute|hour|sec|cycle|unit|m3|ton|step|load|haul|dump)$/i.test(lab)) continue;
      const id = slug(lab);
      if (found.some((f) => f.id === id)) continue;
      found.push({
        id,
        label: lab,
        count: Math.max(1, Math.floor(Number(m[1]))),
        index: m.index ?? 0,
      });
      if (found.length >= 5) break;
    }
  }

  if (!found.length) return [{ id: "units", label: "Units", count: 3 }];
  found.sort((a, b) => a.index - b.index);
  return found.map(({ id, label, count }) => ({ id, label, count }));
}

function extractStepLabels(text: string): string[] {
  const arrow = text.match(
    /([A-Za-z][A-Za-z0-9_/ -]{1,24})\s*(?:→|->|=>|—)\s*([A-Za-z0-9_/ →\->,-]{3,140})/,
  );
  if (arrow) {
    return parseStepsWithInlineDurations(`${arrow[1]} → ${arrow[2]}`).labels;
  }
  if (/earthmov|haul|loader|excav/i.test(text)) return ["Load", "Haul", "Dump", "Return"];
  if (/concrete|pour|mixer|pump|beton/i.test(text)) return ["Load", "Travel", "Pour", "Return"];
  if (/trench|pipe/i.test(text)) return ["Excavate", "Place", "Backfill"];
  if (/crane|lift|erect|steel/i.test(text)) return ["Hook", "Lift", "Place", "Return"];
  if (/pave|asphalt/i.test(text)) return ["Pave", "Compact", "Return"];
  if (/mason|brick|bata/i.test(text)) return ["Lay", "Tool", "Move"];
  return ["Work", "Return"];
}

export function buildOperationFromText(text: string): CycloneModel | null {
  const raw = stripPromptComments(text);
  if (!raw) return null;

  const explicit = parseExplicitResourceCycles(raw);
  let resources: ResourceCycle[];
  let durations: Record<string, DurationDist> = {
    ...parseDurationBlock(raw),
    ...(explicit?.inlineDurations ?? {}),
  };

  if (explicit?.resources.length) {
    resources = explicit.resources;
  } else {
    const resInfo = extractResources(raw);
    const steps = extractStepLabels(raw);
    const meet = steps[0] ?? "Work";
    resources = resInfo.map((r, i) => ({
      id: r.id,
      label: r.label,
      count: r.count,
      itinerary: i === 0 ? [...steps] : [meet],
    }));
  }

  for (const lab of resources.flatMap((r) => r.itinerary)) {
    const key = normLabel(lab);
    if (durations[key]) continue;
    const re = new RegExp(
      `${lab.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^\\n]{0,20}?((?:const|tri|unif|normal|norm|logn|beta|gamma|constant|uniform|triangular)\\s+[\\d.,\\s/-]+|\\d+(?:\\.\\d+)?(?:\\s*[,/-]\\s*\\d+(?:\\.\\d+)?){0,2})`,
      "i",
    );
    const m = raw.match(re);
    if (m?.[1]) {
      const d = parseDurationToken(m[1]);
      if (d) durations[key] = d;
    }
  }

  let productionUnit = "cycle";
  if (/m3|m³|cubic/i.test(raw)) productionUnit = "m3";
  else if (/ton/i.test(raw)) productionUnit = "ton";
  else if (/m2|m²/i.test(raw)) productionUnit = "m2";
  else if (/joint|pipe/i.test(raw)) productionUnit = "joint";
  else if (/lift|panel/i.test(raw)) productionUnit = "lift";

  const prodAmt = (() => {
    const m = raw.match(/(\d+(?:\.\d+)?)\s*(m3|m³|ton|m2|units?)\b/i);
    return m ? Number(m[1]) : 1;
  })();

  const allSteps = [...new Set(resources.flatMap((r) => r.itinerary))];
  const nameLine =
    raw
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l && /:/.test(l) && /→|->|=>/.test(l)) ?? allSteps.join(" · ");
  const name = nameLine.slice(0, 56) || "Custom operation";

  try {
    let model = buildFromSpec({
      name,
      description: raw.slice(0, 400),
      productionUnit,
      productionPerCycle: prodAmt,
      resources,
      durations,
      productionResourceId: resources[0]!.id,
    });
    const { costs, sensitivity } = parseCostAndSensitivity(raw);
    model = applyCostsToModel(model, costs);
    if (sensitivity.length) {
      model = { ...model, sensitivity };
    }
    return model;
  } catch {
    return null;
  }
}

export { normLabel };
