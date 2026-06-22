"use client";

import { memo, useState, useEffect } from "react";
import { X, Eye, Pencil, Trash2, MessageSquare } from "lucide-react";
import { Canvas } from "@/components/canvas/Canvas";
import { Button, Badge } from "@/components/ui";
import { AnnotationLayer } from "./AnnotationLayer";
import type { StudentCircuitView } from "./TeacherDashboard";

interface StudentDetailModalProps {
  student: StudentCircuitView;
  onClose: () => void;
  onSendAnnotation: (annotation: { points: Array<{ x: number; y: number }>; color?: string }) => void;
  onClearAnnotations: () => void;
  incomingStrokes?: Array<{ points: Array<{ x: number; y: number }>; color: string; timestamp: number }>;
}

export const StudentDetailModal = memo(function StudentDetailModal({
  student,
  onClose,
  onSendAnnotation,
  onClearAnnotations,
  incomingStrokes = [],
}: StudentDetailModalProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<typeof incomingStrokes>([]);
  const [currentStroke, setCurrentStroke] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    setStrokes(incomingStrokes);
  }, [incomingStrokes]);

  const handleDrawStart = () => {
    setIsDrawing(true);
    setCurrentStroke([]);
  };

  const handleDrawPoint = (point: { x: number; y: number }) => {
    setCurrentStroke((prev) => [...prev, point]);
  };

  const handleDrawEnd = () => {
    if (currentStroke.length > 0) {
      onSendAnnotation({ points: currentStroke, color: "#ef4444" });
    }
    setIsDrawing(false);
    setCurrentStroke([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="relative flex h-full max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-neon-purple/40 bg-bg-primary shadow-neon-purple">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default bg-bg-secondary/60 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Eye className="h-4 w-4 text-neon-purple" />
            <div>
              <div className="font-mono text-sm font-bold text-text-primary">
                Observing: {student.studentName}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
                {(student.nodes || []).length} nodes · {(student.edges || []).length} edges
              </div>
            </div>
            <Badge
              tone={
                student.simulationResult === "VALID_CIRCUIT"
                  ? "green"
                  : student.simulationResult === "OPEN_CIRCUIT"
                    ? "yellow"
                    : student.simulationResult === "SHORT_CIRCUIT"
                      ? "red"
                      : "gray"
              }
              label={student.simulationResult.replace("_", " ")}
              pulse
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isDrawing ? "danger" : "purple"}
              size="sm"
              onClick={() => setIsDrawing(!isDrawing)}
              icon={<Pencil className="h-3 w-3" />}
            >
              {isDrawing ? "Stop Drawing" : "Annotate"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAnnotations}
              icon={<Trash2 className="h-3 w-3" />}
            >
              Clear
            </Button>
            <button
              onClick={onClose}
              className="rounded p-1 text-text-muted transition-colors hover:bg-bg-card hover:text-neon-red"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative flex-1 overflow-hidden">
          <Canvas
            nodes={student.nodes || []}
            edges={student.edges || []}

            onNodesChange={() => { }}
            onEdgesChange={() => { }}
            onConnect={() => { }}
            onSimulate={() => { }}
            onClear={() => { }}
            simulationState={student.simulationResult}
            activeEdgeIds={[]}
            readOnly
            showMiniMap={false}
          />

          {/* Annotation overlay */}
          <AnnotationLayer
            width={1200}
            height={800}
            isDrawing={isDrawing}
            onDrawStart={handleDrawStart}
            onDrawPoint={handleDrawPoint}
            onDrawEnd={handleDrawEnd}
            strokes={strokes}
          />

          {/* Drawing mode indicator */}
          {isDrawing && (
            <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border border-neon-red/60 bg-neon-red/10 px-3 py-1 backdrop-blur-md">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neon-red animate-pulse">
                ✏ Drawing — student will see this in real-time
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border-default bg-bg-secondary/60 px-4 py-2 backdrop-blur-md">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-text-muted">
            <span>Read-only view · Updates in real-time</span>
            <span>{student.studentId}</span>
          </div>
        </div>
      </div>
    </div>
  );
});