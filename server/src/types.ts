/**
 * Server-side type definitions.
 * Mirrors the client types where appropriate but kept independent
 * to avoid cross-project coupling.
 */

import type {
  CircuitNode,
  CircuitEdge,
  SimulationResult,
} from "../../lib/types";

export interface ServerCircuitPayload {
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  simulation: {
    result: SimulationResult;
    message: string;
    activeEdgeIds: string[];
    computedAt: number;
  };
  timestamp: number;
}

export interface ServerStudentRecord {
  studentId: string;
  studentName: string;
  joinedAt: number;
  lastActiveAt: number;
  currentCircuit?: ServerCircuitPayload;
  simulationResult: SimulationResult;
}

export interface ServerRoomState {
  roomId: string;
  students: Map<string, ServerStudentRecord>;
  createdAt: number;
  lastActivityAt: number;
}

/* ─── Event name constants (shared contract with client) ─── */

export const SERVER_EVENTS = {
  // Connection lifecycle
  JOIN_ROOM: "join_room",
  STUDENT_JOINED: "student_joined",
  STUDENT_DISCONNECTED: "student_disconnected",

  // Circuit sync
  CIRCUIT_UPDATE: "circuit_update",

  // Teacher ↔ Student
  ANNOTATION_START: "annotation_start",
  ANNOTATION_DRAW: "annotation_draw",
  ANNOTATION_END: "annotation_end",
  ANNOTATION_CLEAR: "annotation_clear",

  // State queries
  REQUEST_STATE: "request_state",
  FULL_STATE: "full_state",

  // Errors
  ERROR: "error",
} as const;