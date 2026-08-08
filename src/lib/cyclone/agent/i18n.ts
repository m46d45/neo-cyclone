/** English-only product copy (Halpin tribute). */

export type AgentLang = "en";

export type PhaseId = "brief" | "structure" | "diagram" | "params" | "review" | "ready";

export const PHASE_ORDER: PhaseId[] = [
  "brief",
  "structure",
  "diagram",
  "params",
  "review",
  "ready",
];

const copy = {
  title: "Neo-CYCLONE",
  subtitle: "AI-agent of Daniel W. Halpin's CYCLONE",
  simulate: "Simulate",
  simulating: "Running…",
  drawModel: "Draw Model",
  drawing: "Building model…",
  drawHint: "Refine the prompt and redraw until the model is correct.",
  promptLabel: "Prompt for Construction Operation Model:",
  formatPrompt: "Format Prompt",
  simSuccess: "Simulation complete — see Results below.",
  simFail: "Could not build or run the model.",
  needPrompt: "Enter a prompt first",
  modelDrawn: "Model drawn — refine the prompt if needed, then Simulate under the diagram.",
} as const;

export type AgentCopy = typeof copy;

export function t(_lang?: AgentLang): AgentCopy {
  return copy;
}

export function phaseTitle(_lang: AgentLang, phase: PhaseId): string {
  const map: Record<PhaseId, string> = {
    brief: "Brief",
    structure: "Structure",
    diagram: "Diagram",
    params: "Parameters",
    review: "Review",
    ready: "Ready",
  };
  return map[phase];
}

export function phaseHint(_lang: AgentLang, _phase: PhaseId): string {
  return "";
}
