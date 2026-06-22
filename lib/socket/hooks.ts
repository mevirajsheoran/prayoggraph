"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getSocket, connectSocket } from "./client";
import {
  SERVER_EVENTS,
  JoinRoomPayload,
  CircuitUpdatePayload,
  AnnotationPayload,
} from "./types";

/* ─── Connection status ─── */

export type SocketStatus = "disconnected" | "connecting" | "connected" | "error";

export function useSocketStatus(): SocketStatus {
  const [status, setStatus] = useState<SocketStatus>("disconnected");

  useEffect(() => {
    const socket = getSocket();
    setStatus(socket.connected ? "connected" : "connecting");

    const onConnect = () => setStatus("connected");
    const onDisconnect = () => setStatus("disconnected");
    const onError = () => setStatus("error");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
    };
  }, []);

  return status;
}

/* ─── Join a room ─── */

export function useJoinRoom(
  roomId: string,
  studentId: string,
  studentName: string,
  role: "student" | "teacher" = "student"
) {
  const [studentCount, setStudentCount] = useState(0);
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!roomId || !studentId || joinedRef.current) return;

    let cancelled = false;

    const join = async () => {
      try {
        const socket = await connectSocket();
        if (cancelled) return;

        const payload: JoinRoomPayload = {
          roomId,
          studentId,
          studentName,
          role,
        };

        socket.emit(SERVER_EVENTS.JOIN_ROOM, payload);
        joinedRef.current = true;

        socket.on("joined", (data: { studentCount: number }) => {
          if (!cancelled) setStudentCount(data.studentCount);
        });
      } catch (err) {
        console.warn("[useJoinRoom] Failed to join:", err);
      }
    };

    join();

    return () => {
      cancelled = true;
    };
  }, [roomId, studentId, studentName, role]);

  return { studentCount };
}

/* ─── Broadcast circuit updates ─── */

export function useCircuitBroadcast(
  roomId: string,
  studentId: string,
  payload: CircuitUpdatePayload | null
) {
  const lastSentRef = useRef<string>("");

  useEffect(() => {
    if (!payload || !roomId || !studentId) return;

    // Debounce: only send if payload actually changed
    const key = JSON.stringify({
      result: payload.simulation.result,
      edges: payload.edges.length,
      activeEdges: payload.simulation.activeEdgeIds,
    });

    if (key === lastSentRef.current) return;
    lastSentRef.current = key;

    const socket = getSocket();
    socket.emit(SERVER_EVENTS.CIRCUIT_UPDATE, {
      ...payload,
      roomId,
      studentId,
    });
  }, [payload, roomId, studentId]);
}

/* ─── Listen for circuit updates from other students ─── */

export function useCircuitSubscription(
  roomId: string,
  callback: (update: CircuitUpdatePayload) => void
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!roomId) return;

    const socket = getSocket();

    const handler = (update: CircuitUpdatePayload) => {
      callbackRef.current(update);
    };

    socket.on(SERVER_EVENTS.CIRCUIT_UPDATE, handler);

    return () => {
      socket.off(SERVER_EVENTS.CIRCUIT_UPDATE, handler);
    };
  }, [roomId]);
}

/* ─── Listen for student join/leave events ─── */

export interface StudentEvent {
  studentId: string;
  studentName: string;
  timestamp?: number;
  joinedAt?: number;  
}

export function useRoomEvents(
  roomId: string,
  callbacks: {
    onStudentJoined?: (e: StudentEvent) => void;
    onStudentDisconnected?: (e: StudentEvent) => void;
  }
) {
  const { onStudentJoined, onStudentDisconnected } = callbacks;

  useEffect(() => {
    if (!roomId) return;

    const socket = getSocket();

    const joinedHandler = (e: StudentEvent) => onStudentJoined?.(e);
    const leftHandler = (e: StudentEvent) => onStudentDisconnected?.(e);

    if (onStudentJoined) socket.on(SERVER_EVENTS.STUDENT_JOINED, joinedHandler);
    if (onStudentDisconnected)
      socket.on(SERVER_EVENTS.STUDENT_DISCONNECTED, leftHandler);

    return () => {
      socket.off(SERVER_EVENTS.STUDENT_JOINED, joinedHandler);
      socket.off(SERVER_EVENTS.STUDENT_DISCONNECTED, leftHandler);
    };
  }, [roomId, onStudentJoined, onStudentDisconnected]);
}

/* ─── Listen for full state snapshot ─── */

export interface FullState {
  roomId: string;
  students: Array<{
    studentId: string;
    studentName: string;
    simulationResult: string;
    joinedAt: number;
    lastActiveAt: number;
  }>;
}

export function useFullState(roomId: string, callback: (state: FullState) => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!roomId) return;

    const socket = getSocket();

    const handler = (state: FullState) => callbackRef.current(state);

    socket.on(SERVER_EVENTS.FULL_STATE, handler);

    return () => {
      socket.off(SERVER_EVENTS.FULL_STATE, handler);
    };
  }, [roomId]);
}