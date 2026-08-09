import { create } from "zustand";
import { runCyclone } from "./engine";
import { parseCostAndSensitivity, applyCostsToModel } from "./sensitivity";
import { runSensitivityAsync } from "./sensitivity-async";
import { parsePriorityBlock, applyPrioritiesToModel } from "./priority";
import { parseDsl, serializeDsl } from "./dsl";
import { cloneModel, emptyModel, earthmovingModel, PRESET_MODELS } from "./models/presets"
import { ensureReadableLayout } from "./auto-layout";
import {
  DEFAULT_MAX_CYCLES,
  MAX_CYCLES_LIMIT,
  clampMaxCycles,
  horizonForCycles,
} from "./run-limits";
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

const initialMaxCycles = DEFAULT_MAX_CYCLES;
const initialMaxTime = horizonForCycles(initialMaxCycles, emptyModel.defaultMaxTime);

export const useCycloneStore = create<CycloneStore>((set, get) => ({
  model: cloneModel(emptyModel),
  result: null,
  sensitivityResult: null,
  selectedNodeId: null,
  seed: DEFAULT_SEED,
  maxTime: initialMaxTime,
  maxCycles: initialMaxCycles,
  isRunning: false,
  lastError: null,

  dslText: "",
  dslSource: null,
  modelReady: false,

  agent: createAgentSession("en"),

  setModel: (model) => {
    const maxCycles = DEFAULT_MAX_CYCLES;
    const maxTime = horizonForCycles(maxCycles, model.defaultMaxTime);
    set({
      model: ensureReadableLayout(cloneModel(model)),
      result: null,
      sensitivityResult: null,
      selectedNodeId: null,
      maxTime,
      maxCycles,
      lastError: null,
      dslText: serializeDsl(model, {
        seed: get().seed,
        maxTime,
        maxCycles,
      }),
    });
  },

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
  setMaxCycles: (raw) => {
    const maxCycles = clampMaxCycles(raw);
    set((s) => ({
      maxCycles,
      // Keep charts able to reach the requested cycle count
      maxTime: horizonForCycles(maxCycles, s.maxTime),
    }));
  },

  run: () => {
    let { model, seed, maxTime, maxCycles, agent } = get();
    maxCycles = clampMaxCycles(maxCycles);
    maxTime = horizonForCycles(maxCycles, maxTime);
    // Re-apply Cost + Sensitivity + Priority plan from prompt (DSL does not carry them).
    let sensPlan = model.sensitivity ?? [];
    if (agent.brief) {
      const { costs, sensitivity } = parseCostAndSensitivity(agent.brief);
      if (Object.keys(costs).length) {
        model = applyCostsToModel(model, costs);
      }
      const pri = parsePriorityBlock(agent.brief);
      if (Object.keys(pri).length) {
        model = applyPrioritiesToModel(model, pri);
      }
      if (sensitivity.length) {
        sensPlan = sensitivity;
        model = { ...model, sensitivity };
      }
      set({ model });
    }
    set({ isRunning: true, lastError: null, sensitivityResult: null });
    try {
      // Base run stays on main thread (fast for a single trajectory).
      const result = runCyclone(model, { seed, maxTime, maxCycles });
      set({ result });
      if (sensPlan.length > 0) {
        // Sensitivity off main thread when Workers are available.
        const modelSnap = model;
        const cfg = { seed, maxTime, maxCycles };
        const plan = sensPlan;
        void runSensitivityAsync(modelSnap, cfg, plan)
          .then((sensitivityResult) => {
            // Ignore stale completions if another run started.
            if (get().result !== result) return;
            set({ sensitivityResult, isRunning: false });
          })
          .catch(() => {
            if (get().result !== result) return;
            set({ isRunning: false });
          });
      } else {
        set({ isRunning: false });
      }
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
        model: ensureReadableLayout(cloneModel(parsed.model)),
        dslText: dslOrModel,
        dslSource: "agent",
        maxTime: horizonForCycles(
          clampMaxCycles(parsed.run?.maxCycles ?? DEFAULT_MAX_CYCLES),
          parsed.run?.maxTime ?? parsed.model.defaultMaxTime,
        ),
        maxCycles: clampMaxCycles(parsed.run?.maxCycles ?? DEFAULT_MAX_CYCLES),
        result: null,
        sensitivityResult: null,
        selectedNodeId: null,
        lastError: null,
      });
    } else {
      const dsl = serializeDsl(dslOrModel, {
        seed: get().seed,
        maxTime: horizonForCycles(DEFAULT_MAX_CYCLES, dslOrModel.defaultMaxTime),
        maxCycles: DEFAULT_MAX_CYCLES,
      });
      set({
        model: ensureReadableLayout(cloneModel(dslOrModel)),
        dslText: dsl,
        dslSource: "agent",
        maxTime: horizonForCycles(DEFAULT_MAX_CYCLES, dslOrModel.defaultMaxTime),
        maxCycles: DEFAULT_MAX_CYCLES,
        result: null,
        sensitivityResult: null,
        selectedNodeId: null,
        lastError: null,
      });
    }
    if (note) get().agentLog(note, get().agent.phase);
    return true;
  },

  setAgentLang: (lang) =>
    set((s) => ({
      agent: { ...s.agent, lang },
    })),

  setAgentPhase: (phase, note) => {
    set((s) => ({
      agent: { ...s.agent, phase },
    }));
    if (note) get().agentLog(note, phase);
  },

  agentPush: (msg) => {
    const entry: ChatMessage = {
      id: msg.id ?? uid("m"),
      role: msg.role,
      text: msg.text,
      at: Date.now(),
    };
    set((s) => ({
      agent: { ...s.agent, messages: [...s.agent.messages, entry] },
    }));
  },

  agentLog: (text, phase) => {
    const entry: ChangelogEntry = {
      id: uid("log"),
      text,
      at: Date.now(),
      phase: phase ?? get().agent.phase,
    };
    set((s) => ({
      agent: { ...s.agent, changelog: [...s.agent.changelog, entry] },
    }));
  },

  setStructureLocked: (v) =>
    set((s) => ({
      agent: { ...s.agent, structureLocked: v },
    })),

  setParamsDone: (v) =>
    set((s) => ({
      agent: { ...s.agent, paramsDone: v },
    })),

  setBrief: (brief) =>
    set((s) => ({
      agent: { ...s.agent, brief },
    })),

  simulateNow: () => {
    const { modelReady, model } = get();
    if (!modelReady || !model.nodes.length) {
      return { ok: false, error: "Draw Model first" };
    }
    get().run();
    return { ok: true };
  },
}));
