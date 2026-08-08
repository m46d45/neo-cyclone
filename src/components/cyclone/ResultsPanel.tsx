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
  const series = result.productivitySeries;

  return (
    <Card id="results" className="border-primary/15">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="font-display">Results</CardTitle>
          <Badge variant="outline" className="border-primary/30 text-primary">
            CYCLONE
          </Badge>
        </div>
        <CardDescription>
          After <strong className="text-foreground">{result.cyclesCompleted}</strong> cycles (max
          requested {result.maxCyclesRequested}) · seed{" "}
          <strong className="text-foreground">{result.seed}</strong> · t ={" "}
          {formatNum(result.simTime)} {unit}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Cycles" value={String(result.cyclesCompleted)} />
          <Stat
            label="Production"
            value={primary ? formatNum(primary.production) : "—"}
            unit={model.productionUnit}
          />
          <Stat
            label="Productivity"
            value={primary ? formatNum(primary.productivity) : "—"}
            unit={`${model.productionUnit}/${unit}`}
          />
          <Stat
            label="Avg cycle"
            value={primary ? formatNum(primary.avgCycleTime) : "—"}
            unit={unit}
          />
        </div>

        <Tabs defaultValue="util">
          <TabsList className="flex h-auto w-full flex-wrap">
            <TabsTrigger value="util" className="flex-1 text-xs">
              Utilization
            </TabsTrigger>
            <TabsTrigger value="prod" className="flex-1 text-xs">
              Cycles & production
            </TabsTrigger>
            <TabsTrigger value="rate" className="flex-1 text-xs">
              Productivity
            </TabsTrigger>
            <TabsTrigger value="queues" className="flex-1 text-xs">
              Queues
            </TabsTrigger>
          </TabsList>

          <TabsContent value="util" className="mt-3 space-y-2">
            <div className="h-52 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utilData} margin={{ top: 18, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} unit="%" domain={[0, 100]} />
                  <Tooltip
                    formatter={(v) => [`${v}%`, "Utilization"]}
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
            <ul className="space-y-1 text-xs text-muted-foreground">
              {result.activityStats.map((a) => (
                <li
                  key={a.nodeId}
                  className="flex justify-between gap-2 border-b border-border/60 py-1"
                >
                  <span className="text-foreground">
                    {a.label}{" "}
                    <Badge variant="secondary" className="ml-1 text-[10px]">
                      {a.type}
                    </Badge>
                  </span>
                  <span>
                    {formatPct(a.utilization)} · {a.starts} starts · avg{" "}
                    {formatNum(a.avgDuration)} {unit}
                  </span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="prod" className="mt-3">
            <p className="mb-2 text-[11px] text-muted-foreground">
              Cumulative production per production cycle (COUNTER).
            </p>
            <div className="h-52 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="cycle" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="production"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    name="Cumulative production"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="rate" className="mt-3">
            <p className="mb-2 text-[11px] text-muted-foreground">
              Productivity vs time ({model.productionUnit}/{unit}).
            </p>
            <div className="h-52 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="t" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    dot={false}
                    name="Productivity"
                  />
                  <Line
                    type="monotone"
                    dataKey="production"
                    stroke="var(--chart-1)"
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    dot={false}
                    name="Production"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="queues" className="mt-3">
            <ul className="space-y-1 text-xs text-muted-foreground">
              {result.queueStats.map((q) => (
                <li
                  key={q.nodeId}
                  className="flex justify-between gap-2 border-b border-border/60 py-1"
                >
                  <span className="text-foreground">{q.label}</span>
                  <span>
                    avg {formatNum(q.avgLength)} · max {q.maxLength} · departures {q.departures}
                  </span>
                </li>
              ))}
            </ul>
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
