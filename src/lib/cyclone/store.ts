import { create } from "zustand";
import { runCyclone } from "./engine";
import { runSensitivity, parseCostAndSensitivity, applyCostsToModel } from "./sensitivity";
import { parseDsl, serializeDsl } from "./dsl";
import { cloneModel, earthmovingModel, PRESET_MODELS } from "./models/presets";
import type { CycloneModel, CycloneNode, SimResult, SensitivityResult } from "./types";
import {
  createAgentSession,
  uid,
  type AgentSession,
  type ChangelogEntry,
  type ChatMessage,
} from "./agent/session";
import type { AgentLang, PhaseId } from "./agent/i18n";
import { PHASE_ORDER } from "./agent/i18n";

export type DslDraftSource = "user" | "agent" | "preset" | null;

const DEFAULT_SEED = 12345;

interface CycloneStore {
  model: CycloneModel;
  result: SimResult | null;
  sensitivityResult: SensitivityResult | null;
  selectedNodeId: string | null;
  seed: number;
  maxTime: number;
  maxCycles: number;
  isRunning: boolean;
  lastError: string | null;

  dslText: string;
  dslSource: DslDraftSource;
  modelReady: boolean;

  agent: AgentSession;

  setModel: (model: CycloneModel) => void;
  loadPreset: (id: string) => void;
  selectNode: (id: string | null) => void;
  updateNode: (id: string, patch: Partial<CycloneNode>) => void;
  setSeed: (seed: number) => void;
  setMaxTime: (t: number) => void;
  setMaxCycles: (c: number) => void;
  run: () => void;
  clearResult: () => void;
  markModelReady: (v: boolean) => void;

  applyAgentDraft: (dslOrModel: string | CycloneModel, note?: string) => boolean;
  setAgentLang: (lang: AgentLang) => void;
  setAgentPhase: (phase: PhaseId, note?: string) => void;
  agentPush: (msg: Omit<ChatMessage, "id" | "at"> & { id?: string }) => void;
  agentLog: (text: string, phase?: PhaseId) => void;
  setStructureLocked: (v: boolean) => void;
  setParamsDone: (v: boolean) => void;
  setBrief: (brief: string) => void;
  simulateNow: () => { ok: boolean; error?: string };
}

const initialDsl = serializeDsl(earthmovingModel, {
  seed: DEFAULT_SEED,
  maxTime: earthmovingModel.defaultMaxTime,
  maxCycles: earthmovingModel.defaultMaxCycles,
});

export const useCycloneStore = create<CycloneStore>((set, get) => ({
  model: cloneModel(earthmovingModel),
  result: null,
  sensitivityResult: null,
  selectedNodeId: null,
  seed: DEFAULT_SEED,
  maxTime: earthmovingModel.defaultMaxTime,
  maxCycles: earthmovingModel.defaultMaxCycles,
  isRunning: false,
  lastError: null,

  dslText: initialDsl,
  dslSource: "preset",
  modelReady: false,

  agent: createAgentSession("en"),

  setModel: (model) =>
    set({
      model: cloneModel(model),
      result: null,
      sensitivityResult: null,
      selectedNodeId: null,
      maxTime: model.defaultMaxTime,
      maxCycles: model.defaultMaxCycles,
      lastError: null,
      dslText: serializeDsl(model, {
        seed: get().seed,
        maxTime: model.defaultMaxTime,
        maxCycles: model.defaultMaxCycles,
      }),
    }),

  loadPreset: (id) => {
    const p = PRESET_MODELS.find((m) => m.id === id);
    if (!p) return;
    get().setModel(p);
    get().agentLog(`Preset: ${p.name}`, get().agent.phase);
  },

  selectNode: (id) => set({ selectedNodeId: id }),

  updateNode: (id, patch) => {
    const model = cloneModel(get().model);
    const idx = model.nodes.findIndex((n) => n.id === id);
    if (idx < 0) return;
    model.nodes[idx] = { ...model.nodes[idx]!, ...patch, id };
    set({
      model,
      result: null,
      sensitivityResult: null,
      dslText: serializeDsl(model, {
        seed: get().seed,
        maxTime: get().maxTime,
        maxCycles: get().maxCycles,
      }),
    });
  },

  setSeed: (seed) => set({ seed: Number.isFinite(seed) ? Math.floor(seed) : DEFAULT_SEED }),
  setMaxTime: (maxTime) => set({ maxTime: Math.max(1, maxTime) }),
  setMaxCycles: (maxCycles) => set({ maxCycles: Math.max(1, Math.floor(maxCycles)) }),

  run: () => {
    let { model, seed, maxTime, maxCycles, agent } = get();
    // Re-apply Cost USD/h + Sensitivity plan from prompt (DSL does not carry them).
    let sensPlan = model.sensitivity ?? [];
    if (agent.brief) {
      const { costs, sensitivity } = parseCostAndSensitivity(agent.brief);
      if (Object.keys(costs).length) {
        model = applyCostsToModel(model, costs);
      }
      if (sensitivity.length) {
        sensPlan = sensitivity;
        model = { ...model, sensitivity };
      }
      set({ model });
    }
    set({ isRunning: true, lastError: null, sensitivityResult: null });
    try {
      const result = runCyclone(model, { seed, maxTime, maxCycles });
      let sensitivityResult: SensitivityResult | null = null;
      if (sensPlan.length > 0) {
        try {
          sensitivityResult = runSensitivity(
            model,
            { seed, maxTime, maxCycles },
            sensPlan,
          );
        } catch {
          // optional teaching feature — do not fail the base run
        }
      }
      set({ result, sensitivityResult, isRunning: false });
    } catch (e) {
      set({
        isRunning: false,
        lastError: e instanceof Error ? e.message : "Simulation failed",
      });
    }
  },

  clearResult: () => set({ result: null, sensitivityResult: null }),

  markModelReady: (v) => set({ modelReady: v }),

  applyAgentDraft: (dslOrModel, note) => {
    if (typeof dslOrModel === "string") {
      const parsed = parseDsl(dslOrModel);
      if (!parsed.ok) return false;
      set({
        model: cloneModel(parsed.model),
        dslText: dslOrModel,
        dslSource: "agent",
        maxTime: parsed.run?.maxTime ?? parsed.model.defaultMaxTime,
        maxCycles: parsed.run?.maxCycles ?? parsed.model.defaultMaxCycles,
        result: null,
        sensitivityResult: null,
        selectedNodeId: null,
        lastError: null,
      });
    } else {
      const dsl = serializeDsl(dslOrModel, {
        seed: get().seed,
        maxTime: dslOrModel.defaultMaxTime,
        maxCycles: dslOrModel.defaultMaxCycles,
      });
      set({
        model: cloneModel(dslOrModel),
        dslText: dsl,
        dslSource: "agent",
        maxTime: dslOrModel.defaultMaxTime,
        maxCycles: dslOrModel.defaultMaxCycles,
        result: null,
        sensitivityResult: null,
        selectedNodeId: null,
        lastError: null,
      });
    }
    if (note) get().agentLog(note, get().agent.phase);
    return true;
  },

  setAgentLang: () => {
    // English-only product
  },

  setAgentPhase: (phase, note) => {
    const prev = get().agent.phase;
    set((s) => ({ agent: { ...s.agent, phase } }));
    if (note) get().agentLog(note, phase);
    else if (prev !== phase) get().agentLog(`→ ${phase}`, phase);
  },

  agentPush: (msg) =>
    set((s) => ({
      agent: {
        ...s.agent,
        messages: [
          ...s.agent.messages,
          { id: msg.id ?? uid("m"), at: Date.now(), role: msg.role, text: msg.text },
        ],
      },
    })),

  agentLog: (text, phase) => {
    const entry: ChangelogEntry = {
      id: uid("c"),
      at: Date.now(),
      phase: phase ?? get().agent.phase,
      text,
    };
    set((s) => ({
      agent: { ...s.agent, changelog: [entry, ...s.agent.changelog].slice(0, 40) },
    }));
  },

  setStructureLocked: (v) => set((s) => ({ agent: { ...s.agent, structureLocked: v } })),
  setParamsDone: (v) => set((s) => ({ agent: { ...s.agent, paramsDone: v } })),
  setBrief: (brief) => set((s) => ({ agent: { ...s.agent, brief } })),

  simulateNow: () => {
    if (!get().modelReady) {
      return { ok: false, error: "Draw the model first" };
    }
    const { model, dslText } = get();
    const parsed = parseDsl(dslText);
    if (parsed.ok) {
      set({
        model: cloneModel(parsed.model),
        modelReady: true,
      });
    } else if (!model.nodes.length) {
      return { ok: false, error: "No model" };
    }
    get().run();
    if (get().lastError) return { ok: false, error: get().lastError ?? "Run failed" };
    get().agentLog("Simulate", "ready");
    return { ok: true };
  },
}));

export { PHASE_ORDER, DEFAULT_SEED };
