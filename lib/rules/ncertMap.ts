/**
 * ncertMap.ts
 *
 * Hardcoded, curated NCERT Class 10 Chapter 12 explanations for
 * each circuit state. These are ALWAYS available — no network,
 * no AI, no latency. The fallback layer of the Hybrid Rule Engine.
 *
 * Sources:
 *   - NCERT Class 10 Science, Chapter 12: Electricity
 *   - CBSE curriculum guidelines for practical physics
 */

import type { SimulationResult } from "../types";

export interface NCERTExplanation {
  /** Chapter heading shown in UI */
  chapter: string;
  /** Grade/class label */
  classLevel: string;
  /** Topic heading */
  topic: string;
  /** The actual textbook-aligned explanation */
  explanation: string;
  /** Optional safety or pedagogical warning */
  warning?: string;
}

export const NCERT_MAP: Record<SimulationResult, NCERTExplanation> = {
  VALID_CIRCUIT: {
    chapter: "Chapter 12 — Electricity",
    classLevel: "Class 10",
    topic: "Closed Circuit & Current Flow",
    explanation:
      "A closed circuit provides a continuous conducting path from the positive terminal of the battery, through the components, to the negative terminal. When the switch is closed, current flows through the circuit and the bulb lights up. This demonstrates Ohm's Law: V = IR, where the potential difference (V) drives current (I) through the resistance (R) of the bulb's filament.",
    warning:
      "In a real circuit, the brightness depends on the voltage and the bulb's resistance. Higher voltage or lower resistance means brighter light.",
  },

  OPEN_CIRCUIT: {
    chapter: "Chapter 12 — Electricity",
    classLevel: "Class 10",
    topic: "Open Circuit & Switches",
    explanation:
      "An open circuit occurs when the conducting path is broken. The most common cause is an open switch. When the switch is open, no current can flow, regardless of the battery's voltage. This is the principle behind every household switch — it breaks the circuit to stop current flow for safety.",
    warning:
      "An open circuit is safe — no current flows. Unlike a short circuit, it does not damage components.",
  },

  SHORT_CIRCUIT: {
    chapter: "Chapter 12 — Electricity",
    classLevel: "Class 10",
    topic: "Short Circuit & Safety",
    explanation:
      "A short circuit occurs when current flows from the battery's positive terminal directly back to its negative terminal through a path of negligible resistance, bypassing the load (bulb). According to Ohm's Law (I = V/R), when R approaches zero, I becomes very large. This excessive current generates heat that can melt wires, damage the battery, or start fires.",
    warning:
      "⚠ DANGER: Never connect a battery directly across its terminals without a load. Real circuits use fuses or circuit breakers that melt/break when current exceeds safe limits. Household MCBs protect you from short circuits every day.",
  },

  IDLE: {
    chapter: "Chapter 12 — Electricity",
    classLevel: "Class 10",
    topic: "Build Your First Circuit",
    explanation:
      "Drag a Battery, a Switch, and a Bulb onto the canvas. Connect them with wires to form a closed loop. Then click 'Run Simulation' to see if your circuit is complete. Start with the simplest case: Battery+ → Wire → Switch → Wire → Bulb → Wire → Battery-.",
  },
};

/**
 * Get the explanation for a given simulation result.
 * Pure function — guaranteed to never throw, never return null.
 */
export function getNCERTExplanation(
  result: SimulationResult
): NCERTExplanation {
  return NCERT_MAP[result] || NCERT_MAP.IDLE;
}