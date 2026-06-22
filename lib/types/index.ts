import type { Node, Edge } from "reactflow";
import type { SimulationResult, TerminalId } from "../engine/types";

/* ─── Re-export engine types ─── */

export type { SimulationResult, TerminalId } from "../engine/types";
export type { CircuitInput, CircuitInputNode, CircuitInputEdge } from "../engine/types";
export type { EngineResult } from "../engine/types";  // ← ADD THIS LINE

/* ─── Re-export NCERT type ─── */

export type { NCERTExplanation } from "../rules/ncertMap";

/* ─── Component kinds ─── */

export type ComponentKind =
  | "battery"
  | "bulb"
  | "switch"
  | "resistor"
  | "capacitor"
  | "ammeter"
  | "voltmeter";

/* ─── UI-short state ─── */

export type SimulationStateShort = "IDLE" | "VALID" | "OPEN" | "SHORT";

export function toShortState(result: SimulationResult): SimulationStateShort {
  switch (result) {
    case "VALID_CIRCUIT":
      return "VALID";
    case "OPEN_CIRCUIT":
      return "OPEN";
    case "SHORT_CIRCUIT":
      return "SHORT";
    default:
      return "IDLE";
  }
}

/* ─── React Flow data ─── */

export interface TerminalHandle {
  id: TerminalId;
  position: "left" | "right" | "top" | "bottom";
}

export interface CircuitComponentData {
  kind: ComponentKind;
  label: string;
  description: string;
  isOpen?: boolean;
  locked?: boolean;
}

export type CircuitNode = Node<CircuitComponentData>;

export interface CircuitEdgeData {
  isActive?: boolean;
  sourceTerminal: TerminalId;
  targetTerminal: TerminalId;
}

export type CircuitEdge = Edge<CircuitEdgeData>;

/* ─── Simulation output ─── */

export interface PhysicsPath {
  nodes: string[];
  passesThroughBulb: boolean;
  length: number;
}

export interface SimulationOutput {
  result: SimulationResult;
  paths: PhysicsPath[];
  activeEdgeIds: string[];
  message: string;
  computedAt: number;
}

/* ─── Analytics ─── */

export interface MisconceptionCounters {
  shortCircuitAttempts: number;
  openCircuitAttempts: number;
  validCircuitSuccesses: number;
  totalAttempts: number;
}

export interface StudentAnalytics {
  studentId: string;
  studentName: string;
  counters: MisconceptionCounters;
  masteryScore: number;
  lastResult: SimulationResult;
  joinedAt: number;
  lastActiveAt: number;
}

/* ─── Socket payloads ─── */

export interface CircuitUpdatePayload {
  studentId: string;
  studentName: string;
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  simulation: SimulationOutput;
  analytics: StudentAnalytics;
  timestamp: number;
}

export interface AnnotationPoint {
  x: number;
  y: number;
}

export interface AnnotationPayload {
  teacherId: string;
  studentId: string;
  points: AnnotationPoint[];
  color?: string;
  timestamp: number;
}

export interface StudentJoinedPayload {
  studentId: string;
  studentName: string;
  joinedAt: number;
}

export interface FullStatePayload {
  roomId: string;
  students: StudentAnalytics[];
  circuits: Record<string, CircuitUpdatePayload>;
}