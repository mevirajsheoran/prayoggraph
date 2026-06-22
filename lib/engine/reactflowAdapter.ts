/**
 * reactflowAdapter.ts
 *
 * Converts React Flow's Node[]/Edge[] into the CircuitInput format
 * the deterministic physics engine expects.
 *
 * The React Flow nodes carry:
 *   - id: string
 *   - data.kind: ComponentKind (battery, bulb, switch, etc.)
 *   - data.isOpen?: boolean (for switches)
 *
 * The React Flow edges carry:
 *   - source/target: node IDs
 *   - sourceHandle/targetHandle: terminal IDs ("positive", "in", "out", etc.)
 *
 * This adapter is the ONLY place that needs to know about React Flow —
 * the engine itself stays pure.
 */

import type { Node, Edge } from "reactflow";
import type {
  CircuitInput,
  CircuitInputNode,
  CircuitInputEdge,
  ComponentKind,
} from "./types";

/**
 * Safely extract the ComponentKind from a React Flow node.
 * Falls back to node.type if data.kind is missing.
 */
function getNodeKind(node: Node): ComponentKind | null {
  const kind = node.data?.kind as string | undefined;
  if (kind && isValidKind(kind)) return kind as ComponentKind;

  // Fallback: derive from node.type
  const type = node.type as string | undefined;
  if (type === "battery" || type === "bulb" || type === "switch") {
    return type;
  }

  return null;
}

function isValidKind(kind: string): kind is ComponentKind {
  return [
    "battery",
    "bulb",
    "switch",
    "resistor",
    "capacitor",
    "ammeter",
    "voltmeter",
  ].includes(kind);
}

/**
 * Convert React Flow nodes/edges into the engine's CircuitInput format.
 *
 * Skips locked components (they're visual placeholders, not real parts).
 */
export function reactFlowToCircuitInput(
  nodes: Node[],
  edges: Edge[]
): CircuitInput {
  // Build nodes — skip invalid/locked ones
  const engineNodes: CircuitInputNode[] = [];
  for (const node of nodes) {
    const kind = getNodeKind(node);
    if (!kind) continue;
    if (node.data?.locked) continue;
    if (node.type === "locked") continue;

    engineNodes.push({
      id: node.id,
      type: kind,
      data: {
        kind,
        isOpen: node.data?.isOpen as boolean | undefined,
      },
    });
  }

  // Build edges — skip invalid ones (missing handles)
  const engineEdges: CircuitInputEdge[] = [];
  for (const edge of edges) {
    const sourceHandle =
      (edge.sourceHandle as string | null | undefined) ||
      (edge.data?.sourceTerminal as string | null | undefined);
    const targetHandle =
      (edge.targetHandle as string | null | undefined) ||
      (edge.data?.targetTerminal as string | null | undefined);

    // Skip edges with missing handles — engine requires both
    if (!sourceHandle || !targetHandle) continue;

    engineEdges.push({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle,
      targetHandle,
    });
  }

  return {
    nodes: engineNodes,
    edges: engineEdges,
  };
}