/**
 * Deterministic Physics Engine — Internal Types
 *
 * Self-contained: defines its own SimulationResult to avoid circular imports
 * with lib/types/index.ts. The public lib/types/index.ts re-exports this.
 */

export type ComponentKind =
  | "battery"
  | "bulb"
  | "switch"
  | "resistor"
  | "capacitor"
  | "ammeter"
  | "voltmeter";

export type TerminalId = "in" | "out" | "positive" | "negative";

export type SimulationResult =
  | "VALID_CIRCUIT"
  | "OPEN_CIRCUIT"
  | "SHORT_CIRCUIT"
  | "IDLE";

/* ─── Terminal / Node / Edge models ─── */

export interface EngineTerminal {
  id: string;
  nodeId: string;
  kind: ComponentKind;
  terminal: TerminalId;
}

export interface EngineEdge {
  id: string;
  from: string;
  to: string;
}

export interface EngineNode {
  id: string;
  kind: ComponentKind;
  terminals: EngineTerminal[];
  isOpen?: boolean;
}

export interface CircuitGraph {
  nodes: EngineNode[];
  edges: EngineEdge[];
  adjacency: Map<string, Set<string>>;
  reverseAdjacency: Map<string, Set<string>>;
  nodesById: Map<string, EngineNode>;
  terminalsById: Map<string, EngineTerminal>;
}

export interface DiscoveredPath {
  terminals: string[];
  nodeIds: string[];
  passesThroughBulb: boolean;
  passesThroughClosedSwitch: boolean;
}

export interface EngineResult {
  result: SimulationResult;
  message: string;
  paths: DiscoveredPath[];
  activeEdgeIds: string[];
  computedAt: number;
  traversalCount: number;
}

/* ─── Builder input — strictly typed ─── */

export interface CircuitInputNode {
  id: string;
  type?: string;
  data: {
    kind: ComponentKind;
    isOpen?: boolean;
  };
}

export interface CircuitInputEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  data?: {
    sourceTerminal?: TerminalId;
    targetTerminal?: TerminalId;
  };
}

export interface CircuitInput {
  nodes: CircuitInputNode[];
  edges: CircuitInputEdge[];
}