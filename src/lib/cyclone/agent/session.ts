import type { AgentLang, PhaseId } from "./i18n";

export type ChatRole = "agent" | "user" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  at: number;
}

export interface ChangelogEntry {
  id: string;
  at: number;
  phase: PhaseId;
  text: string;
}

export interface AgentSession {
  lang: AgentLang;
  phase: PhaseId;
  structureLocked: boolean;
  paramsDone: boolean;
  brief: string;
  messages: ChatMessage[];
  changelog: ChangelogEntry[];
}

export function createAgentSession(_lang: AgentLang = "en"): AgentSession {
  return {
    lang: "en",
    phase: "brief",
    structureLocked: false,
    paramsDone: false,
    brief: "",
    messages: [],
    changelog: [],
  };
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
