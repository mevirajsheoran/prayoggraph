/**
 * Socket type definitions shared between client and server.
 * Mirrors server/src/types.ts but kept separate to avoid coupling.
 */

import type {
  CircuitNode,
  CircuitEdge,
  SimulationResult,
} from "../types";

/* ─── Event name constants ─── */

export const SERVER_EVENTS = {
  JOIN_ROOM: "join_room",
  STUDENT_JOINED: "student_joined",
  STUDENT_DISCONNECTED: "student_disconnected",
  CIRCUIT_UPDATE: "circuit_update",
  ANNOTATION_START: "annotation_start",
  ANNOTATION_DRAW: "annotation_draw",
  ANNOTATION_END: "annotation_end",
  ANNOTATION_CLEAR: "annotation_clear",
  REQUEST_STATE: "request_state",
  FULL_STATE: "full_state",
  ERROR: "error",
} as const;

/* ─── Payload shapes ─── */

export interface JoinRoomPayload {
  roomId: string;
  studentId: string;
  studentName: string;
  role: "student" | "teacher";
}

export interface StudentJoinedEvent {
  studentId: string;
  studentName: string;
  joinedAt: number;
}

export interface StudentDisconnectedEvent {
  studentId: string;
  studentName: string;
  timestamp: number;
}

export interface CircuitUpdatePayload {
  studentId: string;
  studentName: string;
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

export interface AnnotationStartPayload {
  roomId: string;
  teacherId: string;
  studentId: string;
  color?: string;
  timestamp: number;
}

export interface AnnotationDrawPayload {
  roomId: string;
  teacherId: string;
  studentId: string;
  point: { x: number; y: number };
  timestamp: number;
}

export interface AnnotationEndPayload {
  roomId: string;
  teacherId: string;
  studentId: string;
  timestamp: number;
}

export interface AnnotationClearPayload {
  roomId: string;
  studentId?: string;
  timestamp: number;
}

export interface FullStatePayload {
  roomId: string;
  students: Array<{
    studentId: string;
    studentName: string;
    simulationResult: SimulationResult;
    joinedAt: number;
    lastActiveAt: number;
  }>;
  circuits: Record<string, CircuitUpdatePayload>;
}

export interface AnnotationPayload {
  teacherId: string;
  studentId: string;
  points: Array<{ x: number; y: number }>;
  color?: string;
  timestamp: number;
}