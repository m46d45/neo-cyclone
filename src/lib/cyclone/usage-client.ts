import { getUsageStats, recordUsage, type UsageKind, type UsageStats } from "./usage-server";

const KEYS: Record<UsageKind, string> = {
  draw: "neo-cyclone-usage-draw",
  simulate: "neo-cyclone-usage-simulate",
};
const VISITOR_FLAG = "neo-cyclone-usage-visitor";

export const USAGE_CHANGED = "neo-cyclone-usage";

function readLocal(kind: UsageKind): number {
  if (typeof window === "undefined") return 0;
  const n = Number(window.localStorage.getItem(KEYS[kind]));
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

function writeLocal(kind: UsageKind, n: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS[kind], String(n));
}

export function localUsage(): { models: number; simulations: number } {
  return { models: readLocal("draw"), simulations: readLocal("simulate") };
}

export function recordStudioUse(kind: UsageKind) {
  writeLocal(kind, readLocal(kind) + 1);
  let newVisitor = false;
  if (typeof window !== "undefined") {
    if (!window.localStorage.getItem(VISITOR_FLAG)) {
      window.localStorage.setItem(VISITOR_FLAG, "1");
      newVisitor = true;
    }
    window.dispatchEvent(new Event(USAGE_CHANGED));
  }
  void recordUsage({ data: { kind, newVisitor } })
    .then(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(USAGE_CHANGED));
      }
    })
    .catch(() => {
      /* local count still stands */
    });
}

export async function fetchUsageStats(): Promise<UsageStats | null> {
  try {
    return await getUsageStats();
  } catch {
    return null;
  }
}
