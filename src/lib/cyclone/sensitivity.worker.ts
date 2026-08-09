/// <reference lib="webworker" />
/**
 * Runs sensitivity batches off the main thread so the studio UI stays responsive.
 */
import { runSensitivity } from "./sensitivity";
import type { CycloneModel, SensitivityRange, SensitivityResult, SimConfig } from "./types";

export type SensitivityWorkerRequest = {
  id: number;
  model: CycloneModel;
  config: SimConfig;
  ranges: SensitivityRange[];
};

export type SensitivityWorkerResponse =
  | { id: number; ok: true; result: SensitivityResult }
  | { id: number; ok: false; error: string };

self.onmessage = (ev: MessageEvent<SensitivityWorkerRequest>) => {
  const { id, model, config, ranges } = ev.data;
  try {
    const result = runSensitivity(model, config, ranges);
    const msg: SensitivityWorkerResponse = { id, ok: true, result };
    self.postMessage(msg);
  } catch (e) {
    const msg: SensitivityWorkerResponse = {
      id,
      ok: false,
      error: e instanceof Error ? e.message : "Sensitivity worker failed",
    };
    self.postMessage(msg);
  }
};

export {};
