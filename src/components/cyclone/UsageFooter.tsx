import { useEffect, useState } from "react";
import { fetchUsageStats, localUsage, USAGE_CHANGED } from "@/lib/cyclone/usage-client";
import type { UsageStats } from "@/lib/cyclone/usage-server";

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

/**
 * Studio-use tally: worldwide Draw Model + Simulate, plus this-device.
 */
export function UsageFooter() {
  const [local, setLocal] = useState({ models: 0, simulations: 0 });
  const [global, setGlobal] = useState<UsageStats | null>(null);

  useEffect(() => {
    const refresh = () => {
      setLocal(localUsage());
      void fetchUsageStats().then((s) => {
        if (s) setGlobal(s);
      });
    };
    refresh();
    window.addEventListener(USAGE_CHANGED, refresh);
    return () => window.removeEventListener(USAGE_CHANGED, refresh);
  }, []);

  const showGlobal = Boolean(global?.ok && global.persistent);
  if (!showGlobal && local.simulations === 0 && local.models === 0) {
    return null;
  }

  return (
    <p className="mt-3 text-[11px] tabular-nums text-muted-foreground/90">
      {showGlobal && global ? (
        <>
          Studio use: <strong className="font-medium text-foreground/80">{fmt(global.simulations)}</strong>{" "}
          simulations
          <span className="mx-1.5 text-border">·</span>
          <strong className="font-medium text-foreground/80">{fmt(global.models)}</strong> models drawn
          {global.visitors > 0 ? (
            <>
              <span className="mx-1.5 text-border">·</span>~{fmt(global.visitors)} visitors
            </>
          ) : null}
        </>
      ) : null}
      {showGlobal && (local.simulations > 0 || local.models > 0) ? (
        <span className="mx-1.5 text-border">·</span>
      ) : null}
      {(local.simulations > 0 || local.models > 0) && (
        <>
          This device: {fmt(local.simulations)} sim
          {local.simulations === 1 ? "" : "s"}
          {local.models > 0 ? ` · ${fmt(local.models)} drawn` : ""}
        </>
      )}
    </p>
  );
}
