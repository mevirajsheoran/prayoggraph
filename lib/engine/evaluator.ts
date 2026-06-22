/**
 * evaluator.ts
 *
 * The single entry point for "what is the state of this circuit?"
 *
 * Decision tree (evaluated in this order):
 *
 *   1. No battery?             → IDLE
 *   2. Battery+ → Battery-     → examine all discovered paths
 *        a. Any complete path  → continue
 *        b. No complete path   → OPEN_CIRCUIT
 *        c. Complete path, no bulb visited → SHORT_CIRCUIT
 *        d. Complete path, bulb visited   → VALID_CIRCUIT
 *
 * The order matters. We check for SHORT before VALID because if
 * BOTH exist (e.g. parallel branches), the short is the dangerous
 * condition and must take priority in the UI.
 *
 * Returns an EngineResult with:
 *   - result: the classification
 *   - paths: all paths found (for visualization)
 *   - activeEdgeIds: which wire edges should glow as "current flowing"
 *   - message: human-readable explanation
 */

import type {
  CircuitInput,
  CircuitGraph,
  EngineResult,
  DiscoveredPath,
} from "./types";
import {
  buildCircuitGraph,
  findBatteryTerminals,
  findEdgeBetweenTerminals,
} from "./circuitGraph";
import { depthFirstSearch, findValidPath } from "./dfs";
import { detectShortCircuit } from "./shortCircuit";

export function evaluateCircuit(input: CircuitInput): EngineResult {
  const startTime =
    typeof performance !== "undefined" ? performance.now() : Date.now();

  // Default result if circuit is essentially empty
  if (!input.nodes || input.nodes.length === 0) {
    return {
      result: "IDLE",
      message: "Empty circuit. Drag components onto the canvas to begin.",
      paths: [],
      activeEdgeIds: [],
      computedAt: 0,
      traversalCount: 0,
    };
  }

  // Step 1: Build the graph
  const graph = buildCircuitGraph(input);
  const { positive, negative } = findBatteryTerminals(graph);

  // No battery? Can't classify.
  if (!positive || !negative) {
    return makeResult({
      result: "IDLE",
      message:
        "Circuit requires a Battery to evaluate. Drag a Battery onto the canvas.",
      graph,
      paths: [],
      activeEdgeIds: [],
      startTime,
      traversalCount: 0,
    });
  }

  // Step 2: Find all paths from positive to negative
  const allPaths = depthFirstSearch(graph, {
    start: positive,
    target: negative,
    maxDepth: 24,
    maxPaths: 32,
  });

  // Step 3: Classify
  // 3a. No complete paths at all → OPEN
  if (allPaths.length === 0) {
    return makeResult({
      result: "OPEN_CIRCUIT",
      message:
        "No complete path from Battery+ to Battery-. The circuit is open — no current can flow. Check that all switches are closed and all wires are connected to valid terminals.",
      graph,
      paths: [],
      activeEdgeIds: [],
      startTime,
      traversalCount: countTraversal(graph),
    });
  }

  // 3b. Detect short circuit (path exists that bypasses bulb)
  const shortAnalysis = detectShortCircuit(graph, positive, negative);

  if (shortAnalysis.isShort) {
    const activeEdges = extractActiveEdges(
      graph,
      shortAnalysis.shortestPath!
    );
    return makeResult({
      result: "SHORT_CIRCUIT",
      message: shortAnalysis.explanation,
      graph,
      paths: shortAnalysis.allShortPaths,
      activeEdgeIds: activeEdges,
      startTime,
      traversalCount: countTraversal(graph),
    });
  }

  // 3c. All complete paths pass through a bulb → VALID
  const validPath = findValidPath(graph, positive, negative);
  if (validPath) {
    const activeEdges = extractActiveEdges(graph, validPath);
    return makeResult({
      result: "VALID_CIRCUIT",
      message: `Complete path found from Battery+ to Battery- passing through a Bulb (${validPath.terminals.length - 1} step(s)). The bulb is now lit. Current flows through the closed circuit.`,
      graph,
      paths: [validPath],
      activeEdgeIds: activeEdges,
      startTime,
      traversalCount: countTraversal(graph),
    });
  }

  // Fallback — shouldn't normally reach here
  return makeResult({
    result: "OPEN_CIRCUIT",
    message: "Circuit could not be classified. Verify all connections.",
    graph,
    paths: allPaths,
    activeEdgeIds: [],
    startTime,
    traversalCount: countTraversal(graph),
  });
}

/* ─── Helpers ─── */

interface MakeResultInput {
  result: EngineResult["result"];
  message: string;
  graph: CircuitGraph;
  paths: DiscoveredPath[];
  activeEdgeIds: string[];
  startTime: number;
  traversalCount: number;
}

function makeResult(input: MakeResultInput): EngineResult {
  const endTime =
    typeof performance !== "undefined" ? performance.now() : Date.now();
  return {
    result: input.result,
    message: input.message,
    paths: input.paths,
    activeEdgeIds: input.activeEdgeIds,
    computedAt: Math.round((endTime - input.startTime) * 100) / 100,
    traversalCount: input.traversalCount,
  };
}

/**
 * Given a path of terminal IDs, return the React Flow edge IDs that
 * should be highlighted as "active" (current flowing through them).
 */
function extractActiveEdges(
  graph: CircuitGraph,
  path: DiscoveredPath
): string[] {
  const edgeIds: string[] = [];

  // Walk pairs of adjacent terminals in the path
  for (let i = 0; i < path.terminals.length - 1; i++) {
    const t1 = path.terminals[i];
    const t2 = path.terminals[i + 1];
    const edgeId = findEdgeBetweenTerminals(graph, t1, t2);
    if (edgeId) edgeIds.push(edgeId);

    // Also try the reverse pair (wires are stored bidirectionally)
    const edgeIdRev = findEdgeBetweenTerminals(graph, t2, t1);
    if (edgeIdRev && !edgeIds.includes(edgeIdRev)) edgeIds.push(edgeIdRev);
  }

  return edgeIds;
}

function countTraversal(graph: CircuitGraph): number {
  let count = 0;
  for (const set of graph.adjacency.values()) count += set.size;
  return count;
}

/* ─── Public re-exports for convenience ─── */

export { buildCircuitGraph, findBatteryTerminals };
export type { EngineResult, DiscoveredPath } from "./types";