import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { useCycloneStore } from "@/lib/cyclone/store";
import {
  buildSimulationReport,
  downloadBlob,
  safeFilename,
} from "@/lib/cyclone/export-utils";
import { Badge } from "@/components/ui/badge";
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

  function downloadReport(ext: "md" | "txt") {
    const body = buildSimulationReport(model, result!);
    const mime = ext === "md" ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8";
    downloadBlob(safeFilename(`report_${model.id}`, ext), body, mime);
    toast.success(`Report downloaded (.${ext})`);
  }

  return (
    <Card id="results" className="border-primary/15">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="font-display">Results</CardTitle>
              <Badge variant="outline" className="border-primary/30 text-primary">
                MicroCYCLONE-style
              </Badge>
            </div>
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
              className="h-8 gap-1.5 text-xs"
              onClick={() => downloadReport("md")}
            >
              <FileText className="size-3.5" />
              Report .md
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => downloadReport("txt")}
            >
              <Download className="size-3.5" />
              Report .txt
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="simulation">
          <TabsList className="flex h-auto w-full flex-wrap gap-1">
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
