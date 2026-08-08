import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { useCycloneStore } from "@/lib/cyclone/store";
import { formatNum, formatPct } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ResultsPanel() {
  const result = useCycloneStore((s) => s.result);
  const model = useCycloneStore((s) => s.model);
  const lastError = useCycloneStore((s) => s.lastError);
  const modelReady = useCycloneStore((s) => s.modelReady);
  const unit = model.timeUnit || "min";

  if (lastError) {
    return (
      <Card id="results" className="border-primary/15">
        <CardHeader>
          <CardTitle className="font-display">Simulation error</CardTitle>
          <CardDescription className="text-destructive">{lastError}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card id="results" className="border-primary/15">
        <CardHeader>
          <CardTitle className="font-display">Results</CardTitle>
          <CardDescription>
            {modelReady
              ? "Set max cycles & seed, then press Simulate."
              : "Draw the model first, refine if needed, then simulate."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const primary = result.counterStats[0];
  const utilData = result.activityStats.map((a) => ({
    name: a.label,
    util: Math.round(a.utilization * 1000) / 10,
    starts: a.starts,
  }));
  const series = result.productivitySeries.filter((p) => p.cycle > 0);
  const cycleTable = series;

  return (
    <Card id="results" className="border-primary/15">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="font-display">Results</CardTitle>
          <Badge variant="outline" className="border-primary/30 text-primary">
            MicroCYCLONE-style
          </Badge>
        </div>
        <CardDescription>
          {model.name} · seed <strong className="text-foreground">{result.seed}</strong> · time unit{" "}
          {unit}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* —— Process Report (Halpin / MicroCYCLONE summary) —— */}
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
              First unit at t = {formatNum(primary.firstPassageTime)} {unit} · avg time between
              units = {formatNum(primary.avgTimeBetweenUnits)} {unit}
            </p>
          )}
        </section>

        <Tabs defaultValue="element">
          <TabsList className="flex h-auto w-full flex-wrap">
            <TabsTrigger value="element" className="flex-1 text-xs">
              Report by Element
            </TabsTrigger>
            <TabsTrigger value="cycle" className="flex-1 text-xs">
              Production by Cycle
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex-1 text-xs">
              Charts
            </TabsTrigger>
          </TabsList>

          {/* —— Report by Element —— */}
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

          {/* —— Production by Cycle —— */}
          <TabsContent value="cycle" className="mt-3 space-y-3">
            <p className="text-[11px] text-muted-foreground">
              Cycle number, simulation time when the cycle completed, and cumulative productivity
              (startup → steady state).
            </p>
            <div className="max-h-64 overflow-auto rounded-[var(--radius-sm)] border border-border">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 border-b border-border bg-muted/90 text-[10px] uppercase text-muted-foreground backdrop-blur">
                  <tr>
                    <th className="px-2 py-1.5 font-medium">Cycle #</th>
                    <th className="px-2 py-1.5 font-medium">Sim time ({unit})</th>
                    <th className="px-2 py-1.5 font-medium">Cumulative production</th>
                    <th className="px-2 py-1.5 font-medium">Cumulative units/hour</th>
                  </tr>
                </thead>
                <tbody>
                  {cycleTable.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-2 py-3 text-center text-muted-foreground">
                        No cycles completed
                      </td>
                    </tr>
                  ) : (
                    cycleTable.map((row) => (
                      <tr key={row.cycle} className="border-b border-border/60">
                        <td className="px-2 py-1 tabular-nums">{row.cycle}</td>
                        <td className="px-2 py-1 tabular-nums">{formatNum(row.t)}</td>
                        <td className="px-2 py-1 tabular-nums">{formatNum(row.production)}</td>
                        <td className="px-2 py-1 tabular-nums">{formatNum(row.unitsPerHour)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {series.length > 1 && (
              <div className="h-44 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="cycle" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="unitsPerHour"
                      stroke="var(--chart-2)"
                      strokeWidth={2}
                      dot={false}
                      name="Units / hour (cumulative)"
                    />
                    <Line
                      type="monotone"
                      dataKey="production"
                      stroke="var(--chart-1)"
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                      dot={false}
                      name="Cumulative production"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>

          {/* —— Charts —— */}
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
        </Tabs>
      </CardContent>
    </Card>
  );
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
