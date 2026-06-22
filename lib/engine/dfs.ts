/**
 * dfs.ts
 *
 * Iterative depth-first search starting from a given terminal.
 * Used twice by the evaluator:
 *   1. From Battery+ to find complete paths back to Battery-
 *   2. From Battery+ to detect direct shorts (path that never visits a Bulb)
 *
 * Why iterative? Recursive DFS in JS can hit call-stack limits with
 * deep or cyclic circuits. Iterative with an explicit stack is safer.
 *
 * Returns ALL discovered paths (including those that don't reach the goal).
 * The caller decides what constitutes "success" — we just report everything.
 */

import type { CircuitGraph, DiscoveredPath } from "./types";

interface DFSOptions {
  start: string;
  /** Stop exploring past this depth to prevent infinite loops on cycles */
  maxDepth?: number;
  /** Optional target — if set, paths reaching it are marked */
  target?: string;
  /** Max paths to collect (defensive cap) */
  maxPaths?: number;
}

export function depthFirstSearch(
  graph: CircuitGraph,
  options: DFSOptions
): DiscoveredPath[] {
  const {
    start,
    target,
    maxDepth = 32,
    maxPaths = 64,
  } = options;

  const paths: DiscoveredPath[] = [];
  const visitedGlobal = new Set<string>(); // prevents exponential blow-up

  // Each stack frame: [currentTerminalId, pathSoFar, visitedSet]
  type Frame = {
    current: string;
    terminals: string[];
    nodes: string[];
    visited: Set<string>;
    passesBulb: boolean;
    passesClosedSwitch: boolean;
  };

  const stack: Frame[] = [
    {
      current: start,
      terminals: [start],
      nodes: [terminalToNodeId(graph, start)],
      visited: new Set([start]),
      passesBulb: false,
      passesClosedSwitch: false,
    },
  ];

  while (stack.length > 0 && paths.length < maxPaths) {
    const frame = stack.pop()!;

    // Reached the target? Record this path.
    if (target && frame.current === target && frame.terminals.length > 1) {
      paths.push({
        terminals: [...frame.terminals],
        nodeIds: [...frame.nodes],
        passesThroughBulb: frame.passesBulb,
        passesThroughClosedSwitch: frame.passesClosedSwitch,
      });
      // Don't return — we want all paths. But also keep exploring
      // branches that might lead to other valid completions.
    }

    if (frame.terminals.length >= maxDepth) continue;

    const neighbors = graph.adjacency.get(frame.current);
    if (!neighbors) continue;

    for (const next of neighbors) {
      // Don't revisit within the same path (cycle prevention)
      if (frame.visited.has(next)) continue;

      // Global visited guard prevents revisiting the same node from
      // multiple paths in exponential graphs. This is a deliberate
      // trade-off: we may miss some valid paths in highly connected
      // circuits, but the evaluator only needs *one* valid path for
      // VALID detection and *one* direct path for SHORT detection.
      // For our 3-component educational circuits this never matters.
      const pathKey = `${frame.current}→${next}`;
      if (visitedGlobal.has(pathKey)) continue;
      visitedGlobal.add(pathKey);

      const nextNodeId = terminalToNodeId(graph, next);
      const nextTerminalKind = graph.terminalsById.get(next)?.terminal;
      const nextNodeKind = graph.nodesById.get(nextNodeId)?.kind;

      const newVisited = new Set(frame.visited);
      newVisited.add(next);

      const newNodes = [...frame.nodes, nextNodeId];
      const passesBulb =
        frame.passesBulb || (nextNodeKind === "bulb" && !!nextTerminalKind);
      const passesClosedSwitch =
        frame.passesClosedSwitch || nextNodeKind === "switch";

      stack.push({
        current: next,
        terminals: [...frame.terminals, next],
        nodes: newNodes,
        visited: newVisited,
        passesBulb,
        passesClosedSwitch,
      });
    }
  }

  return paths;
}

/**
 * Helper: given a terminal id like "node-3::out", return "node-3".
 */
function terminalToNodeId(
  graph: CircuitGraph,
  terminalId: string
): string {
  const t = graph.terminalsById.get(terminalId);
  return t?.nodeId ?? terminalId.split("::")[0];
}

/**
 * Convenience: find any path from start to target that passes through
 * at least one Bulb. Returns null if no such path exists.
 *
 * This is the core "is the circuit valid?" check used by the evaluator.
 */
export function findValidPath(
  graph: CircuitGraph,
  start: string,
  target: string
): DiscoveredPath | null {
  const paths = depthFirstSearch(graph, { start, target, maxDepth: 32 });
  return paths.find((p) => p.passesThroughBulb) ?? null;
}

/**
 * Convenience: find any path from start to target that does NOT pass
 * through a Bulb. This is the short-circuit detection.
 */
export function findShortPath(
  graph: CircuitGraph,
  start: string,
  target: string
): DiscoveredPath | null {
  const paths = depthFirstSearch(graph, { start, target, maxDepth: 32 });
  return paths.find((p) => !p.passesThroughBulb && p.terminals.length > 1) ?? null;
}