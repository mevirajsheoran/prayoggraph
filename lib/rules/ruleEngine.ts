/**
 * ruleEngine.ts
 *
 * The Hybrid Rule Engine: combines the hardcoded NCERT map with
 * an optional Gemini enhancement.
 *
 * Strategy:
 *   1. ALWAYS return the NCERT explanation (never fails, never null).
 *   2. If Gemini responds quickly, ADD a personalized paragraph.
 *   3. The UI displays: NCERT base text, then a smaller "AI Insight"
 *      section if the enhancement was successful.
 *
 * The student always sees useful information immediately.
 */

// Add to lib/types/index.ts (append after existing exports)
export type { CircuitInput, EngineTerminal, EngineResult } from "../engine/types";
import type { SimulationResult } from "../engine/types";
import type { CircuitInput } from "../types";
import { getNCERTExplanation, type NCERTExplanation } from "./ncertMap";
import { enhanceExplanationWithGemini } from "./geminiClient";

export interface RuleEngineOutput {
  /** Always present — guaranteed NCERT explanation */
  base: NCERTExplanation;
  /** Optional AI-enhanced personalized text (may be null) */
  enhancement: string | null;
  /** Was the enhancement successful? */
  enhanced: boolean;
  /** Total time taken in ms */
  durationMs: number;
}

export async function runRuleEngine(
  result: SimulationResult,
  circuitInput: CircuitInput
): Promise<RuleEngineOutput> {
  const startTime =
    typeof performance !== "undefined" ? performance.now() : Date.now();

  // 1. Always fetch the base explanation
  const base = getNCERTExplanation(result);

  // 2. Try the optional enhancement in parallel
  //    (in case of slow network, this won't block anything visible)
  let enhancement: string | null = null;
  try {
    enhancement = await enhanceExplanationWithGemini(base, circuitInput, result);
  } catch {
    enhancement = null;
  }

  const endTime =
    typeof performance !== "undefined" ? performance.now() : Date.now();

  return {
    base,
    enhancement,
    enhanced: enhancement !== null,
    durationMs: Math.round((endTime - startTime) * 100) / 100,
  };
}

/**
 * Synchronous version — returns only the NCERT base, no AI attempt.
 * Used by the synchronous simulation flow before the enhancement completes.
 */
export function getBaseExplanation(result: SimulationResult): NCERTExplanation {
  return getNCERTExplanation(result);
}