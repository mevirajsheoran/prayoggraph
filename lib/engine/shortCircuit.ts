/**
 * shortCircuit.ts
 *
 * A short circuit is a complete path from Battery+ to Battery-
 * that does NOT pass through any Bulb (or any other load).
 *
 * The DFS in dfs.ts returns ALL paths; this module classifies them
 * into "valid" (through bulb) and "short" (bypassing bulb).
 *
 * Why a separate module? The evaluator's logic is cleaner when
 * short detection is isolated and has its own well-named function.
 */

import type { CircuitGraph, DiscoveredPath } from "./types";
import { depthFirstSearch } from "./dfs";

export interface ShortCircuitAnalysis {
  /** Was a short circuit detected? */
  isShort: boolean;
  /** The shortest short path found, if any (for diagnostic display) */
  shortestPath: DiscoveredPath | null;
  /** All short paths */
  allShortPaths: DiscoveredPath[];
  /** Human-readable explanation */
  explanation: string;
}

/**
 * Detect whether the circuit has any complete path from start to target
 * that bypasses all Bulb nodes.
 */
export function detectShortCircuit(
  graph: CircuitGraph,
  start: string,
  target: string
): ShortCircuitAnalysis {
  if (!start || !target) {
    return {
      isShort: false,
      shortestPath: null,
      allShortPaths: [],
      explanation: "No battery in circuit.",
    };
  }

  const allPaths = depthFirstSearch(graph, { start, target, maxDepth: 16 });

  // A short-circuit path: reaches target, length > 1, and never touched a bulb
  const shortPaths = allPaths.filter(
    (p) => !p.passesThroughBulb && p.terminals.length > 1
  );

  if (shortPaths.length === 0) {
    return {
      isShort: false,
      shortestPath: null,
      allShortPaths: [],
      explanation: "All complete paths pass through a bulb. No short circuit.",
    };
  }

  // Pick the shortest short path for display
  const shortest = shortPaths.reduce((a, b) =>
    a.terminals.length <= b.terminals.length ? a : b
  );

  const explanation = `Direct connection detected: Battery+ reaches Battery- in ${shortest.terminals.length - 1} step(s) without passing through a Bulb. This is a short circuit — current flows with no load, causing excessive current that can damage components.`;

  return {
    isShort: true,
    shortestPath: shortest,
    allShortPaths: shortPaths,
    explanation,
  };
}