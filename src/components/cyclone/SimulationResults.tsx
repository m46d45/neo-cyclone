import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
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
  const utilData = result.activityStats.map((a) => ({
    name: a.label,
    util: Math.round(a.utilization * 1000) / 10,
    starts: a.starts,
  }));
  const series = result.productivitySeries as CyclePoint[];
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

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <h3 className="font-display text-sm font-semibold text-foreground">Process Report</h3>
        <p className="text-[11px] text-muted-foreground">
          Classic MicroCYCLONE process summary (run length, cycles, production, units per hour).
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Run length" value={formatNum(result.simTime)} unit={unit} />
          <Stat label="Number of cycles" value={String(result.cyclesCompleted)} />
          <Stat
            label="Units per cycle"
            value={primary ? formatNum(primary.unitsPerCycle) : "—"}
            unit={model.productionUnit}
          />
          <Stat
            label="Total production"
            value={primary ? formatNum(primary.production) : "—"}
            unit={model.productionUnit}
          />
          <Stat
            label="Units produced per hour"
            value={primary ? formatNum(primary.unitsPerHour) : "—"}
            unit={`${model.productionUnit}/h`}
          />
          <Stat
            label="Avg cycle time"
            value={primary ? formatNum(primary.avgCycleTime) : "—"}
            unit={unit}
          />
        </div>
        {primary && (
          <p className="text-[11px] text-muted-foreground">
            First unit at t = {formatNum(primary.firstPassageTime)} {unit} · avg time between units ={" "}
            {formatNum(primary.avgTimeBetweenUnits)} {unit}
          </p>
        )}
      </section>

      {result.cost && <CostReportSection cost={result.cost} />}

      <Tabs defaultValue="element">
        <TabsList className="flex h-auto w-full flex-wrap gap-1 p-1.5">
          <TabsTrigger value="element" className="flex-1 text-xs">
            Report by Element
          </TabsTrigger>
          <TabsTrigger value="cycle" className="flex-1 text-xs">
            Production by Cycle
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex-1 text-xs">
            Charts
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
            <strong className="text-foreground">Units per hour</strong> by cycle. Steady state is
            declared when consecutive changes stay under <strong className="text-foreground">5%</strong>{" "}
            for at least {SS_MIN_STREAK} consecutive cycles (5% rule; teaching heuristic). The red dashed line is the
            steady-state productivity level.
          </p>
          {ss && (
            <div className="rounded-[var(--radius-sm)] border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs">
              <span className="font-medium text-foreground">Steady-state productivity: </span>
              <span className="font-display text-base font-semibold tabular-nums text-destructive">
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
            <div className="h-56 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 12, right: 52, left: 8, bottom: 22 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="cycle"
                    type="number"
                    domain={[0, xMax > 0 ? xMax : "dataMax"]}
                    allowDecimals={false}
                    interval="preserveStartEnd"
                    tickCount={xMax > 200 ? 11 : 9}
                    tick={{ fontSize: 10 }}
                    label={{
                      value: "Cycle #",
                      position: "insideBottom",
                      offset: -12,
                      style: { fontSize: 10, fill: "var(--muted-foreground)" },
                    }}
                  />
                  <YAxis
                    domain={[0, "auto"]}
                    allowDecimals={false}
                    tick={{ fontSize: 10 }}
                    width={42}
                    label={{
                      value: `${model.productionUnit}/h`,
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 10, fill: "var(--muted-foreground)" },
                    }}
                  />
                  <Tooltip
                    formatter={(v) => [`${v}`, "Units / hour"]}
                    labelFormatter={(c) => `Cycle ${c}`}
                  />
                  {ss && (
                    <ReferenceLine
                      y={ss.level}
                      stroke="#c41e3a"
                      strokeDasharray="6 4"
                      strokeWidth={1.75}
                      label={{
                        value: `${formatNum(ss.level)} /h`,
                        position: "right",
                        fill: "#c41e3a",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                  )}
                  {ss && (
                    <ReferenceLine
                      x={ss.startCycle}
                      stroke="#c41e3a"
                      strokeDasharray="3 3"
                      strokeOpacity={0.45}
                      label={{
                        value: "SS start",
                        position: "insideTopLeft",
                        fill: "#c41e3a",
                        fontSize: 10,
                      }}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="unitsPerHour"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    dot={series.length > 120 ? false : { r: 2 }}
                    activeDot={{ r: 4 }}
                    name="Units / hour"
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="max-h-64 overflow-auto rounded-[var(--radius-sm)] border border-border">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 border-b border-border bg-muted/90 text-[10px] uppercase text-muted-foreground backdrop-blur">
                <tr>
                  <th className="px-2 py-1.5 font-medium">Cycle #</th>
                  <th className="px-2 py-1.5 font-medium">Sim time ({unit})</th>
                  <th className="px-2 py-1.5 font-medium">Units / hour</th>
                </tr>
              </thead>
              <tbody>
                {cycleTable.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-2 py-3 text-center text-muted-foreground">
                      No cycles completed
                    </td>
                  </tr>
                ) : (
                  cycleTable.map((row) => {
                    const inSs = ss != null && row.cycle >= ss.startCycle;
                    return (
                      <tr
                        key={row.cycle}
                        className={
                          inSs
                            ? "border-b border-border/60 bg-destructive/[0.04]"
                            : "border-b border-border/60"
                        }
                      >
                        <td className="px-2 py-1 tabular-nums">{row.cycle}</td>
                        <td className="px-2 py-1 tabular-nums">{formatNum(row.t)}</td>
                        <td className="px-2 py-1 tabular-nums font-medium text-foreground">
                          {formatNum(row.unitsPerHour)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="mt-3 space-y-4">
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              % time in operation
            </h4>
            <div className="h-52 w-full min-w-0">
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
            </div>
          </div>
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
