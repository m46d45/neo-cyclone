/**
 * Prompt syntax for GEN / CON / Branch without drawing QUEUE or arcs by hand.
 *
 * Resource cycles still name the steps; these blocks annotate special nodes/arcs.
 * The builder maps names → QUEUE (GEN), CONSOLIDATE (CON), or link probability (p).
 */

export type GenSpec = { label: string; k: number };
export type ConSpec = { label: string; n: number };
export type BranchArm = { toLabel: string; p: number };
export type BranchSpec = { afterLabel: string; arms: BranchArm[] };

export type FunctionsPrompt = {
  gens: GenSpec[];
  cons: ConSpec[];
  branches: BranchSpec[];
};

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/**
 * Parse optional blocks:
 *
 * ```
 * Functions:
 * GEN PartsPool = 4
 * CON AssembleKit = 4
 *
 * Branch:
 * After Inspect: Pass p=0.9, Rework p=0.1
 * ```
 *
 * Also accepts one-liners:
 *   GEN PartsPool: 4
 *   CON AssembleKit: 4
 */
export function parseFunctionsAndBranch(text: string): FunctionsPrompt {
  const gens: GenSpec[] = [];
  const cons: ConSpec[] = [];
  const branches: BranchSpec[] = [];
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);

  let mode: "none" | "functions" | "branch" = "none";

  for (const line of lines) {
    if (/^#/.test(line) || /^\/\//.test(line)) continue;

    if (/^functions?\s*:?\s*$/i.test(line)) {
      mode = "functions";
      continue;
    }
    if (/^branch(es)?\s*:?\s*$/i.test(line)) {
      mode = "branch";
      continue;
    }
    if (/^(durations?|cost|sensitivity|priority|resource|n\s|production)\b/i.test(line)) {
      mode = "none";
    }

    // Standalone GEN / CON lines anywhere
    const genLine = line.match(/^GEN\s+([A-Za-z][A-Za-z0-9 _/-]{0,40}?)\s*[=:]\s*(\d+)\s*$/i);
    if (genLine) {
      gens.push({ label: genLine[1]!.trim(), k: Math.max(2, Math.floor(Number(genLine[2]))) });
      continue;
    }
    const conLine = line.match(/^CON\s+([A-Za-z][A-Za-z0-9 _/-]{0,40}?)\s*[=:]\s*(\d+)\s*$/i);
    if (conLine) {
      cons.push({ label: conLine[1]!.trim(), n: Math.max(2, Math.floor(Number(conLine[2]))) });
      continue;
    }

    // Branch: After Inspect: Pass p=0.9, Rework p=0.1
    const br = line.match(
      /^After\s+([A-Za-z][A-Za-z0-9 _/-]{0,40}?)\s*:\s*(.+)$/i,
    );
    if (br || (mode === "branch" && /p\s*=/.test(line))) {
      const afterLabel = br ? br[1]!.trim() : "";
      const rhs = br ? br[2]! : line;
      const arms = parseBranchArms(rhs);
      if (arms.length >= 2 && afterLabel) {
        branches.push({ afterLabel, arms });
      } else if (arms.length >= 2 && mode === "branch") {
        // "Inspect: Pass p=0.9, Rework p=0.1"
        const m2 = line.match(/^([A-Za-z][A-Za-z0-9 _/-]{0,40}?)\s*:\s*(.+)$/);
        if (m2) {
          const arms2 = parseBranchArms(m2[2]!);
          if (arms2.length >= 2) {
            branches.push({ afterLabel: m2[1]!.trim(), arms: arms2 });
          }
        }
      }
      continue;
    }

    if (mode === "functions") {
      // Inside Functions: "PartsPool = 4" is ambiguous — require GEN/CON prefix
      continue;
    }
  }

  return { gens, cons, branches };
}

function parseBranchArms(rhs: string): BranchArm[] {
  const arms: BranchArm[] = [];
  // Pass p=0.9, Rework p=0.1  OR  Pass:0.9 / Rework:0.1
  const parts = rhs.split(/[,;]/).map((p) => p.trim()).filter(Boolean);
  for (const part of parts) {
    const m =
      part.match(/^([A-Za-z][A-Za-z0-9 _/-]{0,40}?)\s+p\s*=\s*(\d*\.?\d+)\s*$/i) ||
      part.match(/^([A-Za-z][A-Za-z0-9 _/-]{0,40}?)\s*[:=]\s*(\d*\.?\d+)\s*$/i);
    if (!m) continue;
    const p = Number(m[2]);
    if (!(p >= 0 && p <= 1)) continue;
    arms.push({ toLabel: m[1]!.trim(), p });
  }
  return arms;
}

export function matchGen(label: string, gens: GenSpec[]): GenSpec | undefined {
  const k = norm(label);
  // Exact normalized match only (avoid "Pour" matching "AssemblePour")
  return gens.find((g) => norm(g.label) === k);
}

export function matchCon(label: string, cons: ConSpec[]): ConSpec | undefined {
  const k = norm(label);
  return cons.find((c) => norm(c.label) === k);
}
