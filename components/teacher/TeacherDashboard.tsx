"use client";

import { memo, useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, X } from "lucide-react";
import { AmbientBackground, Navbar } from "@/components/ui";
import { ClassSummaryBar } from "./ClassSummaryBar";
import { MisconceptionAlert } from "./MisconceptionAlert";
import { StudentGrid } from "./StudentGrid";
import { StudentDetailModal } from "./StudentDetailModal";
import {
  useJoinRoom,
  useFullState,
  useCircuitSubscription,
  useRoomEvents,
  useSocketStatus,
} from "@/lib/socket";
import { toShortState, type SimulationResult, type CircuitNode, type CircuitEdge } from "@/lib/types";
import { WEBSOCKET } from "@/lib/constants";

export interface StudentCircuitView {
  studentId: string;
  studentName: string;
  simulationResult: SimulationResult;
  masteryScore: number;
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  lastActiveAt: number;
  joinedAt: number;
}

const TEACHER_ID = `teacher-${Date.now()}`;

export const TeacherDashboard = memo(function TeacherDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState<Map<string, StudentCircuitView>>(new Map());
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [annotationStrokes, setAnnotationStrokes] = useState<
    Array<{ points: Array<{ x: number; y: number }>; color: string; timestamp: number }>
  >([]);

  // Socket connection
  const socketStatus = useSocketStatus();
  useJoinRoom(WEBSOCKET.defaultRoom, TEACHER_ID, "Teacher", "teacher");

  // Handle full state on join
    // Handle full state on join
  useFullState(WEBSOCKET.defaultRoom, (state) => {
    setStudents((prev) => {
      const next = new Map(prev);
      for (const s of state.students) {
        // Type guard: ensure result is a valid SimulationResult
        const validResults = ["VALID_CIRCUIT", "OPEN_CIRCUIT", "SHORT_CIRCUIT", "IDLE"];
        const simulationResult: SimulationResult = validResults.includes(
          s.simulationResult as string
        )
          ? (s.simulationResult as SimulationResult)
          : "IDLE";

        next.set(s.studentId, {
          studentId: s.studentId,
          studentName: s.studentName,
          simulationResult,
          masteryScore: 0,
          nodes: [],
          edges: [],
          lastActiveAt: s.lastActiveAt,
          joinedAt: s.joinedAt,
        });
      }
      return next;
    });
  });

  // Handle incoming circuit updates
  useCircuitSubscription(WEBSOCKET.defaultRoom, (update) => {
    setStudents((prev) => {
      const next = new Map(prev);
      const existing = next.get(update.studentId);
      next.set(update.studentId, {
        studentId: update.studentId,
        studentName: update.studentName,
        simulationResult: update.simulation.result,
        masteryScore: existing?.masteryScore ?? 0,
        nodes: update.nodes as CircuitNode[],
        edges: update.edges as CircuitEdge[],
        lastActiveAt: update.timestamp,
        joinedAt: existing?.joinedAt ?? update.timestamp,
      });
      return next;
    });
  });

  // Handle student join/leave
  useRoomEvents(WEBSOCKET.defaultRoom, {
        onStudentJoined: (e) => {
      setStudents((prev) => {
        if (prev.has(e.studentId)) return prev;
        const next = new Map(prev);
        const joinedAt = e.joinedAt ?? e.timestamp ?? Date.now();
        next.set(e.studentId, {
          studentId: e.studentId,
          studentName: e.studentName,
          simulationResult: "IDLE",
          masteryScore: 0,
          nodes: [],
          edges: [],
          lastActiveAt: joinedAt,
          joinedAt,
        });
        return next;
      });
    },
    onStudentDisconnected: (e) => {
      setStudents((prev) => {
        const next = new Map(prev);
        next.delete(e.studentId);
        return next;
      });
    },
  });

  const studentList = useMemo(() => Array.from(students.values()), [students]);

  const stats = useMemo(() => {
    const valid = studentList.filter((s) => s.simulationResult === "VALID_CIRCUIT").length;
    const error = studentList.filter(
      (s) => s.simulationResult === "SHORT_CIRCUIT" || s.simulationResult === "OPEN_CIRCUIT"
    ).length;
    const idle = studentList.filter((s) => s.simulationResult === "IDLE").length;
    return {
      total: studentList.length,
      valid,
      error,
      idle,
    };
  }, [studentList]);

  const selectedStudent = selectedStudentId ? students.get(selectedStudentId) : null;

  const handleSendAnnotation = useCallback(
    (annotation: { points: Array<{ x: number; y: number }>; color?: string }) => {
      // For demo: just display locally
      setAnnotationStrokes((prev) => [
        ...prev,
        {
          points: annotation.points,
          color: annotation.color || "#ef4444",
          timestamp: Date.now(),
        },
      ]);
      // TODO: emit via WebSocket when annotation wiring is added
    },
    []
  );

  const handleClearAnnotations = useCallback(() => {
    setAnnotationStrokes([]);
  }, []);

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden">
      <AmbientBackground />
      <Navbar
        viewType="TEACHER VIEW"
        simulationState="IDLE"
        roomCode={WEBSOCKET.defaultRoom}
        studentCount={stats.total}
      />

      <div className="relative flex flex-1 flex-col overflow-y-auto p-6">
        <div className="mx-auto w-full max-w-7xl space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-neon-purple" />
                <h1 className="font-mono text-2xl font-bold uppercase tracking-widest text-neon-purple text-glow-cyan">
                  God Mode
                </h1>
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                Real-time class visibility · Live annotation · Misconception analytics
              </p>
            </div>

            <button
              onClick={() => router.push("/")}
              className="rounded border border-border-default bg-bg-card px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary transition-colors hover:border-neon-cyan hover:text-neon-cyan"
            >
              ← Back to Student
            </button>
          </div>

          {/* Summary bar */}
          <ClassSummaryBar
            totalStudents={stats.total}
            validCount={stats.valid}
            errorCount={stats.error}
            idleCount={stats.idle}
          />

          {/* Misconception alert */}
          <MisconceptionAlert students={studentList} threshold={0.6} />

          {/* Student grid */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                Student Status
              </h2>
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
                {studentList.length} connected · Updates in real-time
              </span>
            </div>
            <StudentGrid
              students={studentList}
              selectedStudentId={selectedStudentId}
              onStudentClick={setSelectedStudentId}
            />
          </div>
        </div>
      </div>

      {/* Connection status pill */}
      <div className="absolute bottom-4 left-4 z-10">
        <div
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-md ${
            socketStatus === "connected"
              ? "border-neon-green/40 bg-neon-green/10"
              : socketStatus === "connecting"
              ? "border-neon-yellow/40 bg-neon-yellow/10"
              : "border-neon-red/40 bg-neon-red/10"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              socketStatus === "connected"
                ? "bg-neon-green animate-pulse"
                : socketStatus === "connecting"
                ? "bg-neon-yellow animate-pulse"
                : "bg-neon-red"
            }`}
          />
          <span
            className={`font-mono text-[9px] font-bold uppercase tracking-widest ${
              socketStatus === "connected"
                ? "text-neon-green"
                : socketStatus === "connecting"
                ? "text-neon-yellow"
                : "text-neon-red"
            }`}
          >
            {socketStatus === "connected" ? "WS Connected" : socketStatus === "connecting" ? "Connecting…" : "Offline"}
          </span>
        </div>
      </div>

      {/* Student detail modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudentId(null)}
          onSendAnnotation={handleSendAnnotation}
          onClearAnnotations={handleClearAnnotations}
          incomingStrokes={annotationStrokes}
        />
      )}
    </main>
  );
});