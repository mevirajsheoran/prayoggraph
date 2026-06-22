"use client";

import { memo } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Circle, Eye } from "lucide-react";
import type { SimulationResult } from "@/lib/types";
import type { StudentCircuitView } from "./TeacherDashboard";
import { MiniCircuitPreview } from "./MiniCircuitPreview";

interface StudentCardProps {
  student: StudentCircuitView;
  onClick?: () => void;
  selected?: boolean;
}

const STATE_CONFIG = {
  IDLE: {
    label: "IDLE",
    color: "text-text-muted",
    bg: "bg-text-muted/10",
    border: "border-text-muted/40",
    icon: Circle,
    dotColor: "bg-text-muted",
  },
  VALID_CIRCUIT: {
    label: "VALID",
    color: "text-neon-green",
    bg: "bg-neon-green/10",
    border: "border-neon-green/60",
    icon: CheckCircle2,
    dotColor: "bg-neon-green",
  },
  OPEN_CIRCUIT: {
    label: "OPEN",
    color: "text-neon-yellow",
    bg: "bg-neon-yellow/10",
    border: "border-neon-yellow/60",
    icon: AlertTriangle,
    dotColor: "bg-neon-yellow",
  },
  SHORT_CIRCUIT: {
    label: "SHORT",
    color: "text-neon-red",
    bg: "bg-neon-red/10",
    border: "border-neon-red/60",
    icon: XCircle,
    dotColor: "bg-neon-red",
  },
} as const;

export const StudentCard = memo(function StudentCard({
  student,
  onClick,
  selected = false,
}: StudentCardProps) {
  const config = STATE_CONFIG[student.simulationResult];
  const Icon = config.icon;

  const lastActiveSeconds = Math.floor((Date.now() - student.lastActiveAt) / 1000);
  const lastActiveText =
    lastActiveSeconds < 5
      ? "Just now"
      : lastActiveSeconds < 60
      ? `${lastActiveSeconds}s ago`
      : lastActiveSeconds < 3600
      ? `${Math.floor(lastActiveSeconds / 60)}m ago`
      : "Inactive";

  return (
    <button
      onClick={onClick}
      className={`
        group relative w-full overflow-hidden rounded-lg border p-3 text-left
        backdrop-blur-md transition-all duration-200
        ${config.border} ${config.bg}
        ${selected ? "shadow-neon-cyan scale-[1.02]" : "hover:border-neon-cyan/40 hover:-translate-y-px"}
        ${student.simulationResult === "SHORT_CIRCUIT" ? "animate-pulse-slow" : ""}
      `}
    >
      {/* Top row: status badge + view icon */}
      <div className="flex items-start justify-between">
        <div
          className={`inline-flex items-center gap-1.5 rounded-full border ${config.border} ${config.bg} px-2 py-0.5`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${config.dotColor} ${
              student.simulationResult !== "IDLE" ? "animate-pulse" : ""
            }`}
          />
          <span className={`font-mono text-[9px] font-bold uppercase tracking-widest ${config.color}`}>
            {config.label}
          </span>
        </div>

        <Eye className="h-3 w-3 text-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Student name */}
      <div className="mt-2 truncate font-mono text-sm font-bold text-text-primary">
        {student.studentName}
      </div>

      {/* Mini circuit preview */}
      <div className="mt-2 flex justify-center">
        <MiniCircuitPreview nodes={student.nodes} edges={student.edges} size={120} />
      </div>

      {/* Bottom row: timestamp + mastery */}
      <div className="mt-2 flex items-center justify-between border-t border-border-default pt-2">
        <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">
          {lastActiveText}
        </span>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">
            M:
          </span>
          <span
            className={`font-mono text-[10px] font-bold ${
              student.masteryScore >= 80
                ? "text-neon-green"
                : student.masteryScore >= 50
                ? "text-neon-yellow"
                : student.masteryScore === 0
                ? "text-text-muted"
                : "text-neon-red"
            }`}
          >
            {student.masteryScore}%
          </span>
        </div>
      </div>

      {/* Error indicator corner */}
      {student.simulationResult === "SHORT_CIRCUIT" && (
        <div className="absolute right-1 top-1">
          <span className="flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-red opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-red" />
          </span>
        </div>
      )}
    </button>
  );
});