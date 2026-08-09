import { runSensitivity } from "./sensitivity";
import type { CycloneModel, SensitivityRange, SensitivityResult, SimConfig } from "./types";
import type { SensitivityWorkerResponse } from "./sensitivity.worker";

let worker: Worker | null = null;
let seq = 1;
const pending = new Map<
  number,
  {
    resolve: (r: SensitivityResult) => void;
    reject: (e: Error) => void;
  }
>();

function getWorker(): Worker | null {
  if (typeof window === "undefined" || typeof Worker === "undefined") return null;
  if (worker) return worker;
  try {
    worker = new Worker(new URL("./sensitivity.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.onmessage = (ev: MessageEvent<SensitivityWorkerResponse>) => {
      const data = ev.data;
      const slot = pending.get(data.id);
      if (!slot) return;
      pending.delete(data.id);
      if (data.ok) slot.resolve(data.result);
      else slot.reject(new Error(data.error));
    };
    worker.onerror = () => {
      try {
        worker?.terminate();
      } catch {
        /* ignore */
      }
      worker = null;
      for (const [, slot] of pending) {
        slot.reject(new Error("Sensitivity worker error"));
      }
      pending.clear();
    };
    return worker;
  } catch {
    worker = null;
    return null;
  }
}

/**
 * Run sensitivity off the main thread when Workers are available;
 * otherwise fall back to synchronous runSensitivity (same numbers).
 */
export function runSensitivityAsync(
  model: CycloneModel,
  config: SimConfig,
  ranges?: SensitivityRange[],
): Promise<SensitivityResult> {
  const plan = ranges ?? model.sensitivity ?? [];
  if (!plan.length) {
    return Promise.resolve({
      rows: [],
      bestProductivityLabel: null,
      bestUnitCostLabel: null,
      mode: "factorial",
      pairs: [],
    });
  }

  const w = getWorker();
  if (!w) {
    return Promise.resolve(runSensitivity(model, config, plan));
  }

  const id = seq++;
  return new Promise<SensitivityResult>((resolve, reject) => {
    pending.set(id, { resolve, reject });
    try {
      w.postMessage({ id, model, config, ranges: plan });
    } catch (e) {
      pending.delete(id);
      try {
        resolve(runSensitivity(model, config, plan));
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    }
  }).catch(() => runSensitivity(model, config, plan));
}
