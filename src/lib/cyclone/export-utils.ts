import type { CycloneModel, SimResult } from "./types";
import { summarizeResourceCycles } from "./cycle-summary";

/** Trigger browser download of a Blob or string. */
export function downloadBlob(filename: string, data: Blob | string, mime: string) {
  const blob = typeof data === "string" ? new Blob([data], { type: mime }) : data;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function safeFilename(base: string, ext: string): string {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const clean = base.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 48) || "neo-cyclone";
  return `${clean}_${stamp}.${ext}`;
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return Number(n.toPrecision(6)).toString();
}

/**
 * Full text report (MicroCYCLONE-style summary for teaching).
 */
export function buildSimulationReport(model: CycloneModel, result: SimResult): string {
  const unit = model.timeUnit || "min";
  const pu = model.productionUnit || "unit";
  const primary = result.counterStats[0];
  const cycles = summarizeResourceCycles(model);
  const lines: string[] = [];

  lines.push(`# Neo-CYCLONE Simulation Report`);
  lines.push(``);
  lines.push(`**AI-agent of Daniel W. Halpin's CYCLONE**`);
  lines.push(``);
  lines.push(`## Model`);
  lines.push(``);
  lines.push(`| Field | Value |`);
  lines.push(`|-------|-------|`);
  lines.push(`| Name | ${model.name} |`);
  lines.push(`| Id | ${model.id} |`);
  lines.push(`| Description | ${model.description || "—"} |`);
  lines.push(`| Time unit | ${unit} |`);
  lines.push(`| Production unit | ${pu} |`);
  lines.push(``);

  if (cycles.length) {
    lines.push(`### Network logic (resource cycles)`);
    lines.push(``);
    for (const c of cycles) lines.push(`- ${c}`);
    lines.push(``);
  }

  lines.push(`## Run parameters`);
  lines.push(``);
  lines.push(`| Parameter | Value |`);
  lines.push(`|-----------|-------|`);
  lines.push(`| Seed | ${result.seed} |`);
  lines.push(`| Max cycles requested | ${result.maxCyclesRequested} |`);
  lines.push(`| Cycles completed | ${result.cyclesCompleted} |`);
  lines.push(`| Simulation time | ${fmt(result.simTime)} ${unit} |`);
  lines.push(``);

  lines.push(`## Process report (COUNTER)`);
  lines.push(``);
  if (primary) {
    lines.push(`| Metric | Value |`);
    lines.push(`|--------|-------|`);
    lines.push(`| Counter | ${primary.label} |`);
    lines.push(`| Cycles | ${primary.count} |`);
    lines.push(`| Units per cycle | ${fmt(primary.unitsPerCycle)} ${pu} |`);
    lines.push(`| Production | ${fmt(primary.production)} ${pu} |`);
    lines.push(`| Units / hour | ${fmt(primary.unitsPerHour)} ${pu}/h |`);
    lines.push(`| Avg cycle time | ${fmt(primary.avgCycleTime)} ${unit} |`);
    lines.push(`| First passage | ${fmt(primary.firstPassageTime)} ${unit} |`);
  } else {
    lines.push(`_No COUNTER in model._`);
  }
  lines.push(``);

  if (result.cost) {
    const c = result.cost;
    lines.push(`## Cost report (USD)`);
    lines.push(``);
    lines.push(`| Resource | n | USD/h | Total USD |`);
    lines.push(`|----------|---|-------|-----------|`);
    for (const r of c.resources) {
      lines.push(
        `| ${r.label} | ${r.count} | ${fmt(r.costPerHourUsd)} | ${fmt(r.totalCostUsd)} |`,
      );
    }
    lines.push(``);
    lines.push(`- Run hours: ${fmt(c.runHours)}`);
    lines.push(`- Total cost: ${fmt(c.totalCostUsd)} USD`);
    lines.push(`- Unit cost: ${fmt(c.unitCostUsd)} USD / ${c.productionUnit}`);
    lines.push(``);
  }

  lines.push(`## Activity utilization`);
  lines.push(``);
  lines.push(`| Activity | Type | % time in op | Starts | Avg duration (${unit}) |`);
  lines.push(`|----------|------|--------------|--------|------------------------|`);
  for (const a of result.activityStats) {
    lines.push(
      `| ${a.label} | ${a.type} | ${(a.utilization * 100).toFixed(1)}% | ${a.starts} | ${fmt(a.avgDuration)} |`,
    );
  }
  lines.push(``);

  lines.push(`## Queue statistics`);
  lines.push(``);
  lines.push(`| Queue | Avg length | Max | % occupied | Departures | Avg wait |`);
  lines.push(`|-------|------------|-----|------------|------------|----------|`);
  for (const q of result.queueStats) {
    lines.push(
      `| ${q.label} | ${fmt(q.avgLength)} | ${q.maxLength} | ${(q.percentOccupied * 100).toFixed(1)}% | ${q.departures} | ${fmt(q.avgWaitTime)} |`,
    );
  }
  lines.push(``);

  if (result.branchStats?.length) {
    lines.push(`## Probabilistic branches`);
    lines.push(``);
    lines.push(`| From → To | Declared p | Times taken | Empirical share |`);
    lines.push(`|-----------|------------|-------------|-----------------|`);
    for (const b of result.branchStats) {
      lines.push(
        `| ${b.fromLabel} → ${b.toLabel} | ${b.probability ?? "—"} | ${b.timesTaken} | ${(b.empiricalShare * 100).toFixed(1)}% |`,
      );
    }
    lines.push(``);
  }

  if (result.productivitySeries.length > 1) {
    lines.push(`## Productivity series (sample)`);
    lines.push(``);
    lines.push(`| Cycle | t (${unit}) | Production | Units/h |`);
    lines.push(`|-------|------------|------------|---------|`);
    const series = result.productivitySeries;
    const step = Math.max(1, Math.floor(series.length / 40));
    for (let i = 0; i < series.length; i += step) {
      const p = series[i]!;
      lines.push(
        `| ${p.cycle} | ${fmt(p.t)} | ${fmt(p.production)} | ${fmt(p.unitsPerHour)} |`,
      );
    }
    const last = series[series.length - 1]!;
    if ((series.length - 1) % step !== 0) {
      lines.push(
        `| ${last.cycle} | ${fmt(last.t)} | ${fmt(last.production)} | ${fmt(last.unitsPerHour)} |`,
      );
    }
    lines.push(``);
  }

  lines.push(`## Event log (first ${Math.min(200, result.timeline.length)} events)`);
  lines.push(``);
  for (const ev of result.timeline) {
    lines.push(`- t=${fmt(ev.t)} · ${ev.event}`);
  }
  lines.push(``);
  lines.push(`---`);
  lines.push(`*Generated by Neo-CYCLONE · AI-agent of Daniel W. Halpin's CYCLONE*`);
  lines.push(``);

  return lines.join("\n");
}

/**
 * Rasterize an SVG element to PNG and download.
 */
export async function downloadSvgElementAsPng(
  svg: SVGSVGElement,
  filename: string,
  options?: { scale?: number; background?: string },
): Promise<void> {
  const scale = options?.scale ?? 2;
  const background = options?.background ?? "#ffffff";

  const clone = svg.cloneNode(true) as SVGSVGElement;
  const vb = svg.viewBox.baseVal;
  const w = vb?.width || svg.clientWidth || svg.getBoundingClientRect().width || 800;
  const h = vb?.height || svg.clientHeight || svg.getBoundingClientRect().height || 480;
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const ink =
    getComputedStyle(document.documentElement).getPropertyValue("--diagram-ink").trim() ||
    "#1a1a1a";
  const gold =
    getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() ||
    "#cfb991";
  const grid =
    getComputedStyle(document.documentElement).getPropertyValue("--diagram-grid").trim() ||
    "#e8e4dc";
  const muted =
    getComputedStyle(document.documentElement).getPropertyValue("--diagram-muted").trim() ||
    "#6b6b6b";
  const html = new XMLSerializer()
    .serializeToString(clone)
    .replaceAll("var(--diagram-ink)", ink)
    .replaceAll("var(--primary)", gold)
    .replaceAll("var(--diagram-grid)", grid)
    .replaceAll("var(--diagram-muted)", muted)
    .replaceAll("var(--diagram)", background)
    .replaceAll("var(--border)", "#d4d0c8")
    .replaceAll("var(--foreground)", ink)
    .replaceAll("var(--chart-1)", "#8b6914")
    .replaceAll("var(--chart-2)", "#3d5a40")
    .replaceAll("var(--chart-3)", "#8b5a2b");

  const svgBlob = new Blob([html], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const png = await canvasToBlob(canvas);
    downloadBlob(filename, png, "image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function downloadChartContainerAsPng(
  container: HTMLElement,
  filename: string,
): Promise<void> {
  const svg = container.querySelector("svg");
  if (!svg) throw new Error("No chart SVG found");
  await downloadSvgElementAsPng(svg as SVGSVGElement, filename, {
    scale: 2,
    background: "#ffffff",
  });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("PNG encode failed"))),
      "image/png",
    );
  });
}

/* -------------------------------------------------------------------------- */
/* Excel report (SpreadsheetML — opens in Excel / LibreOffice as .xls)        */
/* -------------------------------------------------------------------------- */

function xmlEscape(s: string | number | null | undefined): string {
  // Build entities without embedding raw &...; sequences that tools may mangle
  const amp = String.fromCharCode(38) + "amp;";
  const lt = String.fromCharCode(38) + "lt;";
  const gt = String.fromCharCode(38) + "gt;";
  const quot = String.fromCharCode(38) + "quot;";
  return String(s ?? "")
    .replace(/&/g, amp)
    .replace(/</g, lt)
    .replace(/>/g, gt)
    .replace(/"/g, quot);
}

type ExcelCell = string | number | null | undefined;

function sheetXml(name: string, rows: ExcelCell[][]): string {
  const safeName = name.replace(/[\\/*?:\[\]]/g, " ").slice(0, 31) || "Sheet";
  const rowXml = rows
    .map((row) => {
      const cells = row
        .map((v) => {
          if (v == null || v === "") {
            return `<Cell><Data ss:Type="String"></Data></Cell>`;
          }
          if (typeof v === "number" && Number.isFinite(v)) {
            return `<Cell><Data ss:Type="Number">${v}</Data></Cell>`;
          }
          return `<Cell><Data ss:Type="String">${xmlEscape(v)}</Data></Cell>`;
        })
        .join("");
      return `<Row>${cells}</Row>`;
    })
    .join("\n");
  return `
 <Worksheet ss:Name="${xmlEscape(safeName)}">
  <Table>
${rowXml}
  </Table>
 </Worksheet>`;
}

/**
 * Multi-sheet Excel workbook (SpreadsheetML / .xls) from a simulation run.
 * Opens in Microsoft Excel and imports cleanly into Google Sheets.
 */
export function buildSimulationReportExcel(
  model: CycloneModel,
  result: SimResult,
): string {
  const unit = model.timeUnit || "min";
  const pu = model.productionUnit || "unit";
  const primary = result.counterStats[0];
  const cycles = summarizeResourceCycles(model);

  const summary: ExcelCell[][] = [
    ["Neo-CYCLONE Simulation Report"],
    ["AI-agent of Daniel W. Halpin's CYCLONE"],
    [],
    ["Model", model.name],
    ["Model id", model.id],
    ["Description", model.description || ""],
    ["Time unit", unit],
    ["Production unit", pu],
    [],
    ["Seed", result.seed],
    ["Max cycles requested", result.maxCyclesRequested],
    ["Cycles completed", result.cyclesCompleted],
    ["Simulation time", result.simTime],
    ["Simulation time unit", unit],
    [],
  ];
  if (primary) {
    summary.push(
      ["Process report (COUNTER)"],
      ["Counter", primary.label],
      ["Cycles (counter hits)", primary.count],
      ["Units per cycle", primary.unitsPerCycle],
      ["Total production", primary.production],
      ["Units per hour", primary.unitsPerHour],
      ["Avg cycle time", primary.avgCycleTime],
      ["First passage time", primary.firstPassageTime],
      [],
    );
  }
  if (cycles.length) {
    summary.push(["Network logic (resource cycles)"]);
    for (const c of cycles) summary.push([c]);
    summary.push([]);
  }

  const costSheet: ExcelCell[][] = [
    ["Resource", "Count", "USD/h", "Total cost (USD)"],
  ];
  if (result.cost) {
    for (const r of result.cost.resources) {
      costSheet.push([r.label, r.count, r.costPerHourUsd, r.totalCostUsd]);
    }
    costSheet.push([]);
    costSheet.push(["Run hours", result.cost.runHours]);
    costSheet.push(["Total cost (USD)", result.cost.totalCostUsd]);
    costSheet.push([
      "Unit cost (USD / " + result.cost.productionUnit + ")",
      result.cost.unitCostUsd,
    ]);
    costSheet.push(["Production", result.cost.production]);
  } else {
    costSheet.push(["(no cost data — add Cost: block in prompt)"]);
  }

  const actSheet: ExcelCell[][] = [
    [
      "Activity",
      "Type",
      "% time in operation",
      "Starts",
      `Avg duration (${unit})`,
      "Avg units at task",
    ],
  ];
  for (const a of result.activityStats) {
    actSheet.push([
      a.label,
      a.type,
      a.utilization * 100,
      a.starts,
      a.avgDuration,
      a.avgUnitsAtTask,
    ]);
  }

  const qSheet: ExcelCell[][] = [
    [
      "Queue",
      "Initial n",
      "Avg length",
      "Max length",
      "% occupied",
      "Departures",
      `Avg wait (${unit})`,
      "Units at end",
    ],
  ];
  for (const q of result.queueStats) {
    qSheet.push([
      q.label,
      q.initialUnits,
      q.avgLength,
      q.maxLength,
      q.percentOccupied * 100,
      q.departures,
      q.avgWaitTime,
      q.unitsAtEnd,
    ]);
  }

  const seriesSheet: ExcelCell[][] = [
    ["Cycle", `t (${unit})`, "Production", `Units/h (${pu}/h)`],
  ];
  for (const pt of result.productivitySeries) {
    seriesSheet.push([pt.cycle, pt.t, pt.production, pt.unitsPerHour]);
  }

  const branchSheet: ExcelCell[][] = [
    ["From", "To", "Declared p", "Times taken", "Empirical share %"],
  ];
  if (result.branchStats?.length) {
    for (const b of result.branchStats) {
      branchSheet.push([
        b.fromLabel,
        b.toLabel,
        b.probability ?? "",
        b.timesTaken,
        b.empiricalShare * 100,
      ]);
    }
  } else {
    branchSheet.push(["(no probabilistic branches)"]);
  }

  const logSheet: ExcelCell[][] = [["t", "Event"]];
  const logN = Math.min(500, result.timeline.length);
  for (let i = 0; i < logN; i++) {
    const ev = result.timeline[i]!;
    logSheet.push([ev.t, ev.event]);
  }
  if (result.timeline.length > logN) {
    logSheet.push([
      "",
      `… ${result.timeline.length - logN} more events not exported`,
    ]);
  }

  const sheets = [
    sheetXml("Summary", summary),
    sheetXml("Cost", costSheet),
    sheetXml("Activities", actSheet),
    sheetXml("Queues", qSheet),
    sheetXml("Productivity", seriesSheet),
    sheetXml("Branches", branchSheet),
    sheetXml("Event log", logSheet),
  ].join("\n");

  return (
    `<?xml version="1.0"?>\n` +
    `<?mso-application progid="Excel.Sheet"?>\n` +
    `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n` +
    ` xmlns:o="urn:schemas-microsoft-com:office:office"\n` +
    ` xmlns:x="urn:schemas-microsoft-com:office:excel"\n` +
    ` xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n` +
    ` xmlns:html="http://www.w3.org/TR/REC-html40">\n` +
    ` <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">\n` +
    `  <Title>Neo-CYCLONE Report — ${xmlEscape(model.name)}</Title>\n` +
    `  <Author>Neo-CYCLONE</Author>\n` +
    ` </DocumentProperties>\n` +
    sheets +
    `\n</Workbook>\n`
  );
}

/** Download simulation report as Excel (.xls SpreadsheetML). */
export function downloadSimulationReportExcel(
  model: CycloneModel,
  result: SimResult,
) {
  const xml = buildSimulationReportExcel(model, result);
  downloadBlob(
    safeFilename(`report_${model.name || model.id}`, "xls"),
    xml,
    "application/vnd.ms-excel;charset=utf-8",
  );
}
