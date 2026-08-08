import { useMemo } from "react";
import { useCycloneStore } from "@/lib/cyclone/store";
import { summarizeResourceCycles } from "@/lib/cyclone/cycle-summary";
import { Badge } from "@/components/ui/badge";

/**
 * Compact network logic report under the diagram (Halpin teaching).
 */
export function NetworkLogic() {
  const model = useCycloneStore((s) => s.model);
  const modelReady = useCycloneStore((s) => s.modelReady);

  const cycles = useMemo(() => summarizeResourceCycles(model), [model]);
  const features = useMemo(() => {
    const tags: string[] = [];
    if (model.nodes.some((n) => n.type === "QUEUE" && (n.generateCount ?? 0) >= 2)) {
      tags.push("GEN");
    }
    if (model.nodes.some((n) => n.type === "CONSOLIDATE")) {
      tags.push("CON");
    }
    if (model.links.some((l) => l.probability != null)) {
      tags.push("Branch p");
    }
    if (model.nodes.some((n) => n.type === "COUNTER")) {
      tags.push("COUNTER");
    }
    return tags;
  }, [model]);

  if (!modelReady && cycles.length === 0) return null;

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-muted/20 px-3 py-2.5">
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        <p className="text-[11px] font-semibold text-foreground">Network logic</p>
        {features.map((t) => (
          <Badge key={t} variant="outline" className="h-5 border-primary/30 text-[10px] text-primary">
            {t}
          </Badge>
        ))}
      </div>
      {cycles.length > 0 ? (
        <ul className="space-y-1 font-mono text-[10px] leading-relaxed text-muted-foreground">
          {cycles.map((line) => (
            <li key={line} className="text-foreground/90">
              {line}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[10px] text-muted-foreground">
          Resource cycles appear once home QUEUEs with initial units are defined.
        </p>
      )}
      <p className="mt-1.5 text-[10px] text-muted-foreground">
        Each resource: home QUEUE → work → return. GEN multiplies arrivals; CON gathers N → 1;
        branch p samples arcs.
      </p>
    </div>
  );
}
