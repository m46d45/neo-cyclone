import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CycloneModel, SimResult } from "@/lib/cyclone/types";
import { formatNum, formatPct } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CostReportSection } from "@/components/cyclone/CostSensitivityPanels";
import { ChartDownloadFrame } from "@/components/cyclone/ChartDownload";

/** Relative change between consecutive cycle rates must stay under this. */
const SS_REL_EPS = 0.05;
/** Minimum consecutive stable cycles (user: 10, not 5). */
const SS_MIN_STREAK = 10;

type CyclePoint = {
  t: number;
  cycle: number;
  production: number;
  rate: number;
  unitsPerHour: number;
  byCounter?: Record<string, number>;
  hitCounter?: string;
};

function detectSteadyState(series: CyclePoint[]): {
  startCycle: number;
  level: number;
  method: "5%-streak" | "tail-fallback";
  stable: boolean;
} | null {
  if (series.length < 3) return null;
  const rates = series.map((p) => p.unitsPerHour);
  let startIdx = -1;
  for (let i = 1; i < rates.length; i++) {
    let ok = true;
    let steps = 0;
    for (let j = i; j < rates.length; j++) {
      const prev = rates[j - 1]!;
      const cur = rates[j]!;
      const base = Math.max(Math.abs(prev), 1e-9);
      if (Math.abs(cur - prev) / base >= SS_REL_EPS) {
        ok = false;
        break;
      }
      steps += 1;
    }
    if (ok && steps >= SS_MIN_STREAK) {
      startIdx = i - 1;
      break;
    }
  }
  if (startIdx >= 0) {
    const region = rates.slice(startIdx);
    const level = region.reduce((s, x) => s + x, 0) / region.length;
    return {
      startCycle: series[startIdx]!.cycle,
      level: Math.round(level * 1000) / 1000,
      method: "5%-streak",
      stable: true,
    };
  }
  const n = Math.max(SS_MIN_STREAK, Math.ceil(series.length * 0.3));
  const from = Math.max(0, series.length - n);
  const region = rates.slice(from);
  const level = region.reduce((s, x) => s + x, 0) / region.length;
  return {
    startCycle: series[from]!.cycle,
    level: Math.round(level * 1000) / 1000,
    method: "tail-fallback",
    stable: false,
  };
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-primary/20 bg-primary/5 px-2 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display text-lg font-semibold tabular-nums text-foreground">{value}</p>
      {unit && <p className="text-[10px] text-muted-foreground">{unit}</p>}
    </div>
  );
}

export function SimulationResults({
  result,
  model,
  unit,
}: {
  result: SimResult;
  model: CycloneModel;
  unit: string;
}) {
  const primary = result.counterStats[0];
  const multiCounter = result.counterStats.length > 1;
  const totalProduction = result.counterStats.reduce((s, c) => s + c.production, 0);
  const totalCount = result.counterStats.reduce((s, c) => s + c.count, 0);
  const lastSeries = result.productivitySeries.at(-1);
  const totalUnitsPerHour = lastSeries?.unitsPerHour ?? primary?.unitsPerHour ?? 0;
  const avgUnitsPerCycle =
    totalCount > 0 ? totalProduction / totalCount : primary?.unitsPerCycle ?? 0;

  const utilData = result.activityStats.map((a) => ({
    name: a.label,
    util: Math.round(a.utilization * 1000) / 10,
    starts: a.starts,
  }));

  const idleStats = result.resourceIdleStats ?? [];
  const idleData = idleStats.map((r) => ({
    name: r.resourceLabel,
    idle: r.idlePct,
    busy: r.busyPct,
    n: r.n,
  }));

  const COUNTER_COLORS = [
    "#1a1a1a",
    "#8b6914",
    "#4a7c59",
    "#3d5a80",
    "#9b2226",
    "#6a4c93",
  ];
  const counterLineKeys = multiCounter
    ? result.counterStats.map((c, i) => ({
        key: `ctr_${i}`,
        label: c.label.replace(/^Prod\s+/i, ""),
        full: c.label,
        color: COUNTER_COLORS[i % COUNTER_COLORS.length]!,
      }))
    : [];

  const series = (result.productivitySeries as CyclePoint[]).map((p) => {
    const row: CyclePoint & { [k: string]: number | string | undefined | Record<string, number> } = {
      ...p,
    };
    if (multiCounter && p.byCounter) {
      for (const ck of counterLineKeys) {
        const v = p.byCounter[ck.full] ?? p.byCounter[ck.label];
        if (v != null) row[ck.key] = v;
      }
    }
    return row;
  });
  const cycleTable = series;
  const xMax = Math.max(
    result.maxCyclesRequested || 0,
    series.length ? series[series.length - 1]!.cycle : 0,
  );
  const stoppedEarly =
    result.cyclesCompleted < result.maxCyclesRequested && result.maxCyclesRequested > 0;
  const ss = detectSteadyState(series.filter((p) => p.cycle > 0));
  const branches = result.branchStats ?? [];
  const hasBranches = branches.length > 0;
  const branchEvents = result.branchEvents ?? [];
  const detourEvents = branchEvents.filter((e) => e.isDetour);
  // One marker per cycle that had a detour (e.g. Breakdown)
  const detourMarks = (() => {
    const byCycle = new Map<number, { cycle: number; y: number; labels: string[] }>();
    for (const ev of detourEvents) {
      const pt = series.find((s) => s.cycle === ev.cycle);
      const y = pt?.unitsPerHour ?? series.filter((s) => s.cycle > 0).at(-1)?.unitsPerHour ?? 0;
      const row = byCycle.get(ev.cycle) ?? { cycle: ev.cycle, y, labels: [] };
      if (!row.labels.includes(ev.toLabel)) row.labels.push(ev.toLabel);
      if (pt) row.y = pt.unitsPerHour;
      byCycle.set(ev.cycle, row);
    }
    return [...byCycle.values()].sort((a, b) => a.cycle - b.cycle);
  })();

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <h3 className="font-display text-sm font-semibold text-foreground">Process Report</h3>
        <p className="text-[11px] text-muted-foreground">
          Classic MicroCYCLONE process summary (run length, cycles, production, units per hour).
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Run length" value={formatNum(result.simTime)} unit={unit} />
          <Stat
            label={multiCounter ? "Production events (all counters)" : "Number of cycles"}
            value={String(result.cyclesCompleted)}
          />
          <Stat
            label="Units per event"
            value={totalCount ? formatNum(avgUnitsPerCycle) : "—"}
            unit={model.productionUnit}
          />
          <Stat
            label="Total production"
            value={totalCount ? formatNum(totalProduction) : "—"}
            unit={model.productionUnit}
          />
          <Stat
            label="Units produced per hour"
            value={totalCount ? formatNum(totalUnitsPerHour) : "—"}
            unit={`${model.productionUnit}/h`}
          />
          <Stat
            label="Avg cycle time"
            value={primary ? formatNum(primary.avgCycleTime) : "—"}
            unit={unit}
          />
        </div>
        {multiCounter && (
          <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-primary/20 bg-primary/5 px-2 py-2">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              By counter (compare zones / products)
            </p>
            <table className="w-full min-w-[360px] text-left text-xs">
              <thead className="text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="px-1.5 py-0.5 font-medium">Counter</th>
                  <th className="px-1.5 py-0.5 font-medium">Hits</th>
                  <th className="px-1.5 py-0.5 font-medium">Production</th>
                  <th className="px-1.5 py-0.5 font-medium">Share</th>
                  <th className="px-1.5 py-0.5 font-medium">Units/h</th>
                </tr>
              </thead>
              <tbody>
                {result.counterStats.map((c) => (
                  <tr key={c.nodeId} className="border-t border-border/50">
                    <td className="px-1.5 py-1 font-medium text-foreground">{c.label}</td>
                    <td className="px-1.5 py-1 tabular-nums">{c.count}</td>
                    <td className="px-1.5 py-1 tabular-nums">
                      {formatNum(c.production)} {model.productionUnit}
                    </td>
                    <td className="px-1.5 py-1 tabular-nums">
                      {totalProduction > 0
                        ? formatPct(c.production / totalProduction)
                        : "—"}
                    </td>
                    <td className="px-1.5 py-1 tabular-nums">{formatNum(c.unitsPerHour)}</td>
                  </tr>
                ))}
                <tr className="border-t border-border font-semibold">
                  <td className="px-1.5 py-1">Total</td>
                  <td className="px-1.5 py-1 tabular-nums">{totalCount}</td>
                  <td className="px-1.5 py-1 tabular-nums">
                    {formatNum(totalProduction)} {model.productionUnit}
                  </td>
                  <td className="px-1.5 py-1">100%</td>
                  <td className="px-1.5 py-1 tabular-nums">{formatNum(totalUnitsPerHour)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {primary && !multiCounter && (
          <p className="text-[11px] text-muted-foreground">
            First unit at t = {formatNum(primary.firstPassageTime)} {unit} · avg time between units ={" "}
            {formatNum(primary.avgTimeBetweenUnits)} {unit}
          </p>
        )}
      </section>

      {result.cost && <CostReportSection cost={result.cost} />}

      <Tabs defaultValue="cycle">
        <TabsList className="flex h-auto w-full flex-wrap gap-1 p-1.5">
          <TabsTrigger value="cycle" className="flex-1 text-xs">
            Production by Cycle
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex-1 text-xs">
            Charts
          </TabsTrigger>
          <TabsTrigger value="element" className="flex-1 text-xs">
            Report by Element
          </TabsTrigger>
          {hasBranches && (
            <TabsTrigger value="branch" className="flex-1 text-xs">
              Branches
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="element" className="mt-3 space-y-4">
          <div>
            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Work tasks (COMBI / NORMAL)
            </h4>
            <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-border">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                  <tr>
                    <th className="px-2 py-1.5 font-medium">Element</th>
                    <th className="px-2 py-1.5 font-medium">Type</th>
                    <th className="px-2 py-1.5 font-medium">Times activated</th>
                    <th className="px-2 py-1.5 font-medium">Mean duration</th>
                    <th className="px-2 py-1.5 font-medium">Avg inter-arrival</th>
                    <th className="px-2 py-1.5 font-medium">Avg units at task</th>
                    <th className="px-2 py-1.5 font-medium">% time in operation</th>
                  </tr>
                </thead>
                <tbody>
                  {result.activityStats.map((a) => (
                    <tr key={a.nodeId} className="border-b border-border/60">
                      <td className="px-2 py-1.5 font-medium text-foreground">{a.label}</td>
                      <td className="px-2 py-1.5">{a.type}</td>
                      <td className="px-2 py-1.5 tabular-nums">{a.starts}</td>
                      <td className="px-2 py-1.5 tabular-nums">
                        {formatNum(a.avgDuration)} {unit}
                      </td>
                      <td className="px-2 py-1.5 tabular-nums">
                        {formatNum(a.avgInterArrival)} {unit}
                      </td>
                      <td className="px-2 py-1.5 tabular-nums">{formatNum(a.avgUnitsAtTask)}</td>
                      <td className="px-2 py-1.5 tabular-nums">{formatPct(a.utilization)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Queues
            </h4>
            <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-border">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                  <tr>
                    <th className="px-2 py-1.5 font-medium">Queue</th>
                    <th className="px-2 py-1.5 font-medium">Initial units</th>
                    <th className="px-2 py-1.5 font-medium">Avg wait time</th>
                    <th className="px-2 py-1.5 font-medium">Avg units</th>
                    <th className="px-2 py-1.5 font-medium">Max units</th>
                    <th className="px-2 py-1.5 font-medium">Units at end</th>
                    <th className="px-2 py-1.5 font-medium">% occupied</th>
                    <th className="px-2 py-1.5 font-medium">Departures</th>
                  </tr>
                </thead>
                <tbody>
                  {result.queueStats.map((q) => (
                    <tr key={q.nodeId} className="border-b border-border/60">
                      <td className="px-2 py-1.5 font-medium text-foreground">{q.label}</td>
                      <td className="px-2 py-1.5 tabular-nums">{q.initialUnits}</td>
                      <td className="px-2 py-1.5 tabular-nums">
                        {formatNum(q.avgWaitTime)} {unit}
                      </td>
                      <td className="px-2 py-1.5 tabular-nums">{formatNum(q.avgLength)}</td>
                      <td className="px-2 py-1.5 tabular-nums">{q.maxLength}</td>
                      <td className="px-2 py-1.5 tabular-nums">{q.unitsAtEnd}</td>
                      <td className="px-2 py-1.5 tabular-nums">{formatPct(q.percentOccupied)}</td>
                      <td className="px-2 py-1.5 tabular-nums">{q.departures}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {result.counterStats.length > 0 && (
            <div>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Counters (FUNCTION)
              </h4>
              <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-border">
                <table className="w-full min-w-[480px] text-left text-xs">
                  <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                    <tr>
                      <th className="px-2 py-1.5 font-medium">Counter</th>
                      <th className="px-2 py-1.5 font-medium">Units through</th>
                      <th className="px-2 py-1.5 font-medium">Total production</th>
                      <th className="px-2 py-1.5 font-medium">Avg time between</th>
                      <th className="px-2 py-1.5 font-medium">First passage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.counterStats.map((c) => (
                      <tr key={c.nodeId} className="border-b border-border/60">
                        <td className="px-2 py-1.5 font-medium text-foreground">{c.label}</td>
                        <td className="px-2 py-1.5 tabular-nums">{c.count}</td>
                        <td className="px-2 py-1.5 tabular-nums">
                          {formatNum(c.production)} {model.productionUnit}
                        </td>
                        <td className="px-2 py-1.5 tabular-nums">
                          {formatNum(c.avgTimeBetweenUnits)} {unit}
                        </td>
                        <td className="px-2 py-1.5 tabular-nums">
                          {formatNum(c.firstPassageTime)} {unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cycle" className="mt-3 space-y-3">
          <p className="text-[11px] text-muted-foreground">
            <strong className="text-foreground">Units per hour</strong> by production event (cycle index).
            {multiCounter ? (
              <>
                {" "}
                <strong className="text-foreground">Bold total</strong> = all counters combined; other
                lines = cumulative units/h for each counter (same X so you can compare zones).
              </>
            ) : null}{" "}
            Steady state (total): consecutive changes under <strong className="text-foreground">5%</strong>{" "}
            for ≥{SS_MIN_STREAK} cycles. Dark gold dashed = steady-state level.
            {detourEvents.length > 0 && (
              <>
                {" "}
                <strong className="text-destructive">Red dots</strong> mark cycles where a detour
                branch was taken (e.g. Breakdown) — compare productivity around those cycles.
              </>
            )}
          </p>
          {detourEvents.length > 0 && (
            <div className="rounded-[var(--radius-sm)] border border-destructive/25 bg-destructive/5 px-3 py-2 text-[11px]">
              <span className="font-medium text-foreground">Detour branch events: </span>
              <span className="text-muted-foreground">
                {detourMarks
                  .slice(0, 24)
                  .map((m) => `cycle ${m.cycle} → ${m.labels.join("/")}`)
                  .join(" · ")}
                {detourMarks.length > 24 ? ` · … +${detourMarks.length - 24} more` : ""}
              </span>
              <span className="mt-1 block text-muted-foreground">
                Total detours: {detourEvents.length}
                {branchEvents.length > detourEvents.length
                  ? ` · main-path samples also recorded (${branchEvents.length} branch takes)`
                  : ""}
              </span>
            </div>
          )}
          {ss && (
            <div className="rounded-[var(--radius-sm)] border border-[#8b6914]/40 bg-[#8b6914]/10 px-3 py-2 text-xs">
              <span className="font-medium text-foreground">Steady-state productivity: </span>
              <span className="font-display text-base font-semibold tabular-nums text-[#8b6914]">
                {formatNum(ss.level)}
              </span>{" "}
              <span className="text-muted-foreground">{model.productionUnit}/h</span>
              <span className="text-muted-foreground">
                {" · from cycle "}{ss.startCycle}
                {ss.stable
                  ? " (5% · ≥10 cycles)"
                  : " (approx. — curve did not fully stabilize; last ~30% of cycles)"}
              </span>
            </div>
          )}
          {stoppedEarly && (
            <p className="rounded-[var(--radius-sm)] border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-[11px] text-foreground">
              Stopped at cycle {result.cyclesCompleted} of {result.maxCyclesRequested} (max time reached).
              Raise <strong>Max time</strong> or keep the auto horizon so the chart can fill to your cycle target.
            </p>
          )}
          {series.length > 1 && (
            <ChartDownloadFrame
              title="Units per hour by cycle"
              filename="chart_units_per_hour_by_cycle"
              chartClassName="h-[28rem] sm:h-[32rem]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 16, right: 56, left: 12, bottom: 28 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="cycle"
                    type="number"
                    domain={[0, xMax > 0 ? xMax : "dataMax"]}
                    allowDecimals={false}
                    interval="preserveStartEnd"
                    tickCount={xMax > 200 ? 11 : 9}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Cycle #",
                      position: "insideBottom",
                      offset: -14,
                      style: { fontSize: 11, fill: "var(--muted-foreground)" },
                    }}
                  />
                  <YAxis
                    domain={[0, "auto"]}
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    width={52}
                    tickCount={10}
                    label={{
                      value: `${model.productionUnit}/h`,
                      angle: -90,
                      position: "insideLeft",
                      offset: 4,
                      style: { fontSize: 11, fill: "var(--muted-foreground)" },
                    }}
                  />
                  <Tooltip
                    formatter={(v) => [`${v}`, "Units / hour"]}
                    labelFormatter={(c) => {
                      const marks = detourMarks.find((m) => m.cycle === Number(c));
                      return marks
                        ? `Cycle ${c} · DETOUR: ${marks.labels.join(", ")}`
                        : `Cycle ${c}`;
                    }}
                  />
                  {ss && (
                    <ReferenceLine
                      y={ss.level}
                      stroke="#8b6914"
                      strokeDasharray="6 4"
                      strokeWidth={1.75}
                      label={{
                        value: `${formatNum(ss.level)} /h`,
                        position: "right",
                        fill: "#8b6914",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                  )}
                  {ss && (
                    <ReferenceLine
                      x={ss.startCycle}
                      stroke="#8b6914"
                      strokeDasharray="3 3"
                      strokeOpacity={0.55}
                      label={{
                        value: "SS start",
                        position: "insideTopLeft",
                        fill: "#8b6914",
                        fontSize: 10,
                      }}
                    />
                  )}
                  {detourMarks.map((m) => (
                    <ReferenceDot
                      key={`detour-${m.cycle}`}
                      x={m.cycle}
                      y={m.y}
                      r={5}
                      fill="#c41e3a"
                      stroke="#c41e3a"
                      strokeWidth={0}
                      ifOverflow="extendDomain"
                    />
                  ))}
                  <Line
                    type="monotone"
                    dataKey="unitsPerHour"
                    stroke="var(--chart-2)"
                    strokeWidth={2.5}
                    dot={series.length > 120 ? false : { r: 2 }}
                    activeDot={{ r: 4 }}
                    name={multiCounter ? "Total (all counters)" : "Units / hour"}
                    isAnimationActive={false}
                  />
                  {counterLineKeys.map((ck) => (
                    <Line
                      key={ck.key}
                      type="monotone"
                      dataKey={ck.key}
                      stroke={ck.color}
                      strokeWidth={1.75}
                      strokeDasharray="4 3"
                      dot={false}
                      name={ck.label}
                      isAnimationActive={false}
                      connectNulls
                    />
                  ))}
                  {multiCounter && (
                    <Legend
                      wrapperStyle={{ fontSize: 11 }}
                      verticalAlign="top"
                      height={28}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </ChartDownloadFrame>
          )}
          <div className="max-h-64 overflow-auto rounded-[var(--radius-sm)] border border-border">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 border-b border-border bg-muted/90 text-[10px] uppercase text-muted-foreground backdrop-blur">
                <tr>
                  <th className="px-2 py-1.5 font-medium">Cycle #</th>
                  <th className="px-2 py-1.5 font-medium">Sim time ({unit})</th>
                  <th className="px-2 py-1.5 font-medium">Units / hour</th>
                  {branchEvents.length > 0 && (
                    <th className="px-2 py-1.5 font-medium">Branch</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {cycleTable.length === 0 ? (
                  <tr>
                    <td
                      colSpan={branchEvents.length > 0 ? 4 : 3}
                      className="px-2 py-3 text-center text-muted-foreground"
                    >
                      No cycles completed
                    </td>
                  </tr>
                ) : (
                  cycleTable.map((row) => {
                    const inSs = ss != null && row.cycle >= ss.startCycle;
                    const rowEv = branchEvents.filter((e) => e.cycle === row.cycle);
                    const detour = rowEv.filter((e) => e.isDetour);
                    return (
                      <tr
                        key={row.cycle}
                        className={
                          detour.length
                            ? "border-b border-border/60 bg-destructive/10"
                            : inSs
                              ? "border-b border-border/60 bg-[#8b6914]/[0.06]"
                              : "border-b border-border/60"
                        }
                      >
                        <td className="px-2 py-1 tabular-nums">{row.cycle}</td>
                        <td className="px-2 py-1 tabular-nums">{formatNum(row.t)}</td>
                        <td className="px-2 py-1 tabular-nums font-medium text-foreground">
                          {formatNum(row.unitsPerHour)}
                        </td>
                        {branchEvents.length > 0 && (
                          <td className="px-2 py-1 text-[10px]">
                            {detour.length > 0 ? (
                              <span className="font-semibold text-destructive">
                                {detour.map((e) => e.toLabel).join(", ")}
                              </span>
                            ) : rowEv.length > 0 ? (
                              <span className="text-muted-foreground">
                                {rowEv.map((e) => e.toLabel).join(", ")}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="mt-3 space-y-4">
          <p className="text-[11px] text-muted-foreground">
            <strong className="text-foreground">Resource idleness</strong> ≈ waste at home QUEUE
            (fleet share idle).{" "}
            <strong className="text-foreground">% time in operation</strong> = activity busy share
            (COMBI/NORMAL).
          </p>
          {idleData.length > 0 && (
            <ChartDownloadFrame
              title="Resource idleness (waste at home)"
              filename="chart_resource_idleness"
              chartClassName="h-56"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={idleData} margin={{ top: 18, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} unit="%" domain={[0, 100]} />
                  <Tooltip
                    formatter={(v, name) => [`${v}%`, name === "idle" ? "Idle" : "Busy"]}
                    labelFormatter={(l) => String(l)}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="idle" fill="#c41e3a" name="Idle %" stackId="a" radius={[0, 0, 0, 0]}>
                    <LabelList
                      dataKey="idle"
                      position="center"
                      formatter={(v: number | string) => `${v}%`}
                      style={{ fontSize: 10, fill: "#fff" }}
                    />
                  </Bar>
                  <Bar dataKey="busy" fill="#4a7c59" name="Busy %" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartDownloadFrame>
          )}
          <ChartDownloadFrame
            title="% time in operation (activities)"
            filename="chart_time_in_operation"
            chartClassName="h-52"
          >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utilData} margin={{ top: 18, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} unit="%" domain={[0, 100]} />
                  <Tooltip
                    formatter={(v) => [`${v}%`, "% time in operation"]}
                    labelFormatter={(l) => String(l)}
                  />
                  <Bar dataKey="util" fill="var(--chart-1)" name="%" radius={4}>
                    <LabelList
                      dataKey="util"
                      position="top"
                      formatter={(v: number | string) => `${v}%`}
                      style={{ fontSize: 10, fill: "var(--foreground)" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          </ChartDownloadFrame>
        </TabsContent>

          {hasBranches && (
            <TabsContent value="branch" className="mt-3 space-y-3">
              <p className="text-[11px] text-muted-foreground">
                Halpin probabilistic arcs: declared p vs empirical share (seed {result.seed}).
              </p>
              <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-border">
                <table className="w-full min-w-[320px] text-left text-xs">
                  <thead className="border-b border-border bg-muted/40 text-[10px] uppercase text-muted-foreground">
                    <tr>
                      <th className="px-2 py-1.5 font-medium">From → To</th>
                      <th className="px-2 py-1.5 font-medium">p (model)</th>
                      <th className="px-2 py-1.5 font-medium">Times</th>
                      <th className="px-2 py-1.5 font-medium">Empirical</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map((b) => (
                      <tr key={b.linkId} className="border-b border-border/60">
                        <td className="px-2 py-1.5 text-foreground">
                          {b.fromLabel} → {b.toLabel}
                        </td>
                        <td className="px-2 py-1.5 tabular-nums">
                          {b.probability != null ? b.probability : "—"}
                        </td>
                        <td className="px-2 py-1.5 tabular-nums">{b.timesTaken}</td>
                        <td className="px-2 py-1.5 tabular-nums">{formatPct(b.empiricalShare)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          )}
      </Tabs>
    </div>
  );
}
