import { FileSpreadsheet, Table2 } from "lucide-react";
import { toast } from "sonner";
import { useCycloneStore } from "@/lib/cyclone/store";
import {
  downloadSeedArchiveCsv,
  downloadSimulationReportExcel,
  downloadValidationCsv,
} from "@/lib/cyclone/export-utils";
import {
  fieldReferenceForModel,
  isRigidPavementModel,
  runPaperSeedArchive,
} from "@/lib/cyclone/paper-cases";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SensitivitySection } from "@/components/cyclone/CostSensitivityPanels";
import { SimulationResults } from "@/components/cyclone/SimulationResults";

export function ResultsPanel() {
  const result = useCycloneStore((s) => s.result);
  const sensitivityResult = useCycloneStore((s) => s.sensitivityResult);
  const model = useCycloneStore((s) => s.model);
  const lastError = useCycloneStore((s) => s.lastError);
  const modelReady = useCycloneStore((s) => s.modelReady);
  const unit = model.timeUnit || "min";
  const brief = useCycloneStore((s) => s.agent.brief);
  const maxCycles = useCycloneStore((s) => s.maxCycles);
  const maxTime = useCycloneStore((s) => s.maxTime);

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

  const hasSensitivity = !!sensitivityResult && sensitivityResult.rows.length > 0;

  function downloadExcel() {
    try {
      downloadSimulationReportExcel(model, result!, brief);
      toast.success("Excel report downloaded (.xls)");
    } catch {
      toast.error("Could not build Excel report");
    }
  }

  function downloadCsv() {
    try {
      downloadValidationCsv(model, result!);
      toast.success("Validation row downloaded (.csv)");
    } catch {
      toast.error("Could not build CSV");
    }
  }

  function downloadSeeds() {
    try {
      const rows = runPaperSeedArchive(model, maxCycles, maxTime);
      downloadSeedArchiveCsv(model, rows);
      toast.success("10-seed archive downloaded (.csv)");
    } catch {
      toast.error("Could not build the seed archive");
    }
  }

  const field = fieldReferenceForModel(model.name);
  const uph = result.counterStats[0]?.unitsPerHour;
  const showSeeds = isRigidPavementModel(model.name);

  return (
    <Card id="results" className="border-primary/15">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="font-display">Results</CardTitle>
            <CardDescription>
              {model.name} · seed <strong className="text-foreground">{result.seed}</strong> · time
              unit {unit}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-primary/40 text-xs font-medium text-foreground hover:bg-primary/10"
              onClick={downloadExcel}
            >
              <FileSpreadsheet className="size-3.5 text-primary" />
              Report Excel
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-primary/40 text-xs font-medium text-foreground hover:bg-primary/10"
              onClick={downloadCsv}
            >
              <Table2 className="size-3.5 text-primary" />
              Validation CSV
            </Button>
            {showSeeds ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-primary/40 text-xs font-medium text-foreground hover:bg-primary/10"
                onClick={downloadSeeds}
                title="Runs seeds 12345, 1, 7, 13, 21, 42, 99, 2024, 2026, 31415 on this pavement model"
              >
                <Table2 className="size-3.5 text-primary" />
                10-seed archive
              </Button>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {field && uph != null ? (
          <div className="rounded-[var(--radius-sm)] border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm">
            <p className="font-medium text-foreground">Field comparison · {field.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              This run{" "}
              <strong className="text-foreground tabular-nums">{uph.toFixed(2)}</strong> {model.productionUnit}/h
              <span className="mx-1.5 text-border">·</span>
              Field <strong className="text-foreground tabular-nums">{field.m3PerHour}</strong> m³/h
              <span className="mx-1.5 text-border">·</span>
              Ratio{" "}
              <strong className="text-foreground tabular-nums">
                {(uph / field.m3PerHour).toFixed(2)}
              </strong>
            </p>
          </div>
        ) : null}
        <Tabs defaultValue="simulation">
          <TabsList className="flex h-auto w-full flex-wrap gap-1 p-1.5">
            <TabsTrigger value="simulation" className="flex-1 text-sm">
              Simulation
            </TabsTrigger>
            <TabsTrigger value="sensitivity" className="flex-1 text-sm">
              Sensitivity Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulation" className="mt-4">
            <SimulationResults result={result} model={model} unit={unit} />
          </TabsContent>

          <TabsContent value="sensitivity" className="mt-4">
            {hasSensitivity ? (
              <SensitivitySection
                sensitivity={sensitivityResult!}
                productionUnit={model.productionUnit}
              />
            ) : (
              <div className="rounded-[var(--radius-sm)] border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                <p className="font-medium text-foreground">No sensitivity run yet</p>
                <p className="mt-2 text-xs leading-relaxed">
                  Add a <code className="text-foreground">Sensitivity:</code> block to the prompt
                  (e.g. <code className="text-foreground">Trucks: 2..8</code>), draw the model, then
                  Simulate. Batch comparison of productivity, utilization, and unit cost will appear
                  here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
