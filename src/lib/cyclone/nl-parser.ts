import type { CycloneModel } from "./types";
import { buildOperationFromText } from "./general-builder";
import { stripPromptComments } from "./prompt-template";

/**
 * Natural language / structured prompt → CYCLONE model.
 * Comment lines (# … / // …) are stripped first.
 */
export function parseOperationDescription(text: string): CycloneModel | null {
  return buildOperationFromText(stripPromptComments(text));
}
