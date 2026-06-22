/**
 * circuitGraph.ts
 *
 * Converts React Flow's Node[]/Edge[] into a pure adjacency-map
 * representation the DFS can traverse.
 *
 * Key responsibility: assign globally-unique terminal IDs and
 * build bidirectional routing based on component semantics.
 *
 * Battery routing:
 *   - The positive terminal is the DFS START.
 *   - The negative terminal is the DFS GOAL.
 *   - Inside the battery, the two are NOT internally connected
 *     (a battery is not a wire — it's a source).
 *
 * Switch routing:
 *   - If isOpen === true, no internal edge between in/out.
 *   - If isOpen === false, internal edge in↔out exists.
 *
 * Bulb routing:
 *   - Always bidirectional edge between in/out (filament).
 *
 * Wire routing:
 *   - Wires are the only place where external terminal↔terminal
 *     connections are stored.
 */

import type {
  CircuitGraph,
  CircuitInput,
  EngineEdge,
  EngineNode,
  EngineTerminal,
} from "./types";

/**
 * Build a globally unique terminal ID.
 * Format: `${nodeId}::${terminal}` — readable in logs and debugger.
 */
function makeTerminalId(nodeId: string, terminal: string): string {
  return `${nodeId}::${terminal}`;
}

/**
 * Determine the terminal layout for a component kind.
 * Every component has a fixed terminal structure per the spec.
 */
function getComponentTerminals(
  nodeId: string,
  kind: string
): EngineTerminal[] {
  switch (kind) {
    case "battery":
      return [
        {
          id: makeTerminalId(nodeId, "negative"),
          nodeId,
          kind: "battery",
          terminal: "negative",
        },
        {
          id: makeTerminalId(nodeId, "positive"),
          nodeId,
          kind: "battery",
          terminal: "positive",
        },
      ];

    case "bulb":
      return [
        {
          id: makeTerminalId(nodeId, "in"),
          nodeId,
          kind: "bulb",
          terminal: "in",
        },
        {
          id: makeTerminalId(nodeId, "out"),
          nodeId,
          kind: "bulb",
          terminal: "out",
        },
      ];

    case "switch":
      return [
        {
          id: makeTerminalId(nodeId, "in"),
          nodeId,
          kind: "switch",
          terminal: "in",
        },
        {
          id: makeTerminalId(nodeId, "out"),
          nodeId,
          kind: "switch",
          terminal: "out",
        },
      ];

    // Locked components — for completeness, defined but not used yet
    case "resistor":
    case "capacitor":
    case "ammeter":
    case "voltmeter":
      return [
        {
          id: makeTerminalId(nodeId, "in"),
          nodeId,
          kind: kind as EngineTerminal["kind"],
          terminal: "in",
        },
        {
          id: makeTerminalId(nodeId, "out"),
          nodeId,
          kind: kind as EngineTerminal["kind"],
          terminal: "out",
        },
      ];

    default:
      return [];
  }
}

/**
 * Build the complete CircuitGraph from React Flow input.
 * Pure function — no side effects, fully testable.
 */
export function buildCircuitGraph(input: CircuitInput): CircuitGraph {
  const nodes: EngineNode[] = [];
  const edges: EngineEdge[] = [];
  const nodesById = new Map<string, EngineNode>();
  const terminalsById = new Map<string, EngineTerminal>();
  const adjacency = new Map<string, Set<string>>();
  const reverseAdjacency = new Map<string, Set<string>>();

  // Helper to add a directed edge to the adjacency maps
  const addDirected = (from: string, to: string) => {
    if (!adjacency.has(from)) adjacency.set(from, new Set());
    if (!reverseAdjacency.has(to)) reverseAdjacency.set(to, new Set());
    adjacency.get(from)!.add(to);
    reverseAdjacency.get(to)!.add(from);
  };

  // 1. Convert React Flow nodes → EngineNodes
  for (const node of input.nodes) {
    const kind = (node.data?.kind || node.type || "unknown") as string;
    const terminals = getComponentTerminals(node.id, kind);

    const engineNode: EngineNode = {
      id: node.id,
      kind: kind as EngineNode["kind"],
      terminals,
      isOpen: node.data?.isOpen,
    };

    nodes.push(engineNode);
    nodesById.set(node.id, engineNode);
    for (const t of terminals) {
      terminalsById.set(t.id, t);
      adjacency.set(t.id, new Set());
      reverseAdjacency.set(t.id, new Set());
    }
  }

  // 2. Add component-internal routing based on semantics
  for (const node of nodes) {
    switch (node.kind) {
      case "bulb": {
        // Bulb: bidirectional in↔out (current can flow either way through filament)
        const inT = node.terminals.find((t) => t.terminal === "in")!;
        const outT = node.terminals.find((t) => t.terminal === "out")!;
        addDirected(inT.id, outT.id);
        addDirected(outT.id, inT.id);
        break;
      }

      case "switch": {
        // Switch: only conduct when closed
        if (!node.isOpen) {
          const inT = node.terminals.find((t) => t.terminal === "in")!;
          const outT = node.terminals.find((t) => t.terminal === "out")!;
          addDirected(inT.id, outT.id);
          addDirected(outT.id, inT.id);
        }
        break;
      }

      case "battery": {
        // Battery: NO internal connection.
        // The two terminals are NOT joined internally — that's the whole
        // point of an EMF source. The DFS starts at positive and looks
        // for negative through the EXTERNAL circuit.
        break;
      }

      // Locked components for now: assume pass-through like bulb
      case "resistor":
      case "capacitor":
      case "ammeter":
      case "voltmeter": {
        const inT = node.terminals.find((t) => t.terminal === "in");
        const outT = node.terminals.find((t) => t.terminal === "out");
        if (inT && outT) {
          addDirected(inT.id, outT.id);
          addDirected(outT.id, inT.id);
        }
        break;
      }
    }
  }

  // 3. Add wire edges (these are the EXTERNAL connections drawn by user)
  for (const edge of input.edges) {
    // Determine which terminal on source/target was used
    const sourceTerminalId =
      edge.sourceHandle ||
      edge.data?.sourceTerminal ||
      inferDefaultTerminal(edge.source, nodesById);

    const targetTerminalId =
      edge.targetHandle ||
      edge.data?.targetTerminal ||
      inferDefaultTerminal(edge.target, nodesById);

    if (!sourceTerminalId || !targetTerminalId) continue;

    const sourceFull = makeTerminalId(edge.source, sourceTerminalId);
    const targetFull = makeTerminalId(edge.target, targetTerminalId);

    // Wires are bidirectional (current flows both ways through a wire)
    addDirected(sourceFull, targetFull);
    addDirected(targetFull, sourceFull);

    edges.push({
      id: edge.id,
      from: sourceFull,
      to: targetFull,
    });
  }

  return {
    nodes,
    edges,
    adjacency,
    reverseAdjacency,
    nodesById,
    terminalsById,
  };
}

/**
 * Fallback: if user dragged from a handle without explicit id, pick the
 * first available terminal on that component.
 */
function inferDefaultTerminal(
  nodeId: string,
  nodesById: Map<string, EngineNode>
): string | null {
  const node = nodesById.get(nodeId);
  if (!node || node.terminals.length === 0) return null;
  return node.terminals[0].id;
}

/**
 * Sanity helper used in tests — given a graph, find the battery's
 * positive and negative terminal IDs. Returns null if no battery exists.
 */
export function findBatteryTerminals(graph: CircuitGraph): {
  positive: string | null;
  negative: string | null;
} {
  let positive: string | null = null;
  let negative: string | null = null;

  for (const node of graph.nodes) {
    if (node.kind !== "battery") continue;
    for (const t of node.terminals) {
      if (t.terminal === "positive") positive = t.id;
      if (t.terminal === "negative") negative = t.id;
    }
  }

  return { positive, negative };
}

/**
 * Edge id lookup: given two terminal IDs, find the React Flow edge id.
 * Used to highlight active wires during simulation.
 */
export function findEdgeBetweenTerminals(
  graph: CircuitGraph,
  t1: string,
  t2: string
): string | null {
  // t1 ↔ t2 is bidirectional in the graph but stored as one React Flow edge
  for (const edge of graph.edges) {
    if (
      (edge.from === t1 && edge.to === t2) ||
      (edge.from === t2 && edge.to === t1)
    ) {
      return edge.id;
    }
  }
  return null;
}