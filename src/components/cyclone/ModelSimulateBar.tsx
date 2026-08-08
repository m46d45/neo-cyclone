import { Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCycloneStore } from "@/lib/cyclone/store";
import { t } from "@/lib/cyclone/agent/i18n";

/**
 * Under CYCLONE Model: set seed + max cycles, then run simulation.
 * Durations are in minutes (default time unit). English UI.
 */
export function ModelSimulateBar() {
  const modelReady = useCycloneStore((s) => s.modelReady);
  const isRunning = useCycloneStore((s) => s.isRunning);
  const seed = useCycloneStore((s) => s.seed);
  const maxCycles = useCycloneStore((s) => s.maxCycles);
  const maxTime = useCycloneStore((s) => s.maxTime);
  const setSeed = useCycloneStore((s) => s.setSeed);
  const setMaxCycles = useCycloneStore((s) => s.setMaxCycles);
  const setMaxTime = useCycloneStore((s) => s.setMaxTime);
  const simulateNow = useCycloneStore((s) => s.simulateNow);
  const model = useCycloneStore((s) => s.model);
  const c = t();
  const unit = model.timeUnit || "min";

  if (!modelReady) {
    return (
      <p className="rounded-[var(--radius-sm)] border border-dashed border-border px-3 py-2.5 text-center text-xs text-muted-foreground">
        After the model is drawn and looks right, set cycles & seed here, then Simulate.
      </p>
    );
  }

  return (
    <div className="space-y-3 rounded-[var(--radius-md)] border border-primary/25 bg-card p-3">
      <p className="text-[11px] text-muted-foreground">
        Activity durations are in <strong className="text-foreground">minutes</strong> (default).
        Set run parameters, then Simulate.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <Label htmlFor="sim-cycles" className="text-[11px]">
            Max cycles
          </Label>
          <Input
            id="sim-cycles"
            type="number"
            min={1}
            step={1}
            value={maxCycles}
            onChange={(e) => setMaxCycles(Number(e.target.value) || 1)}
            className="h-9 font-mono text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="sim-seed" className="text-[11px]">
            Seed
          </Label>
          <Input
            id="sim-seed"
            type="number"
            step={1}
            value={seed}
            onChange={(e) => setSeed(Number(e.target.value) || 12345)}
            className="h-9 font-mono text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="sim-time" className="text-[11px]">
            Max time ({unit})
          </Label>
          <Input
            id="sim-time"
            type="number"
            min={1}
            step={1}
            value={maxTime}
            onChange={(e) => setMaxTime(Number(e.target.value) || 1)}
            className="h-9 font-mono text-sm"
          />
        </div>
      </div>
      <Button
        className="w-full gap-2"
        size="lg"
        disabled={isRunning}
        onClick={() => {
          const r = simulateNow();
          if (r.ok) {
            toast.success(c.simSuccess);
            document
              .getElementById("results")
              ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          } else {
            toast.error(r.error ?? c.simFail);
          }
        }}
      >
        {isRunning ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
        {isRunning ? c.simulating : c.simulate}
      </Button>
    </div>
  );
}
