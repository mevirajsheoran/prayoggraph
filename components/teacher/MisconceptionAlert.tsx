"use client";

import { memo, useMemo } from "react";
import { AlertTriangle, Lightbulb, Zap } from "lucide-react";
import type { StudentCircuitView } from "./TeacherDashboard";

interface MisconceptionAlertProps {
  students: StudentCircuitView[];
  threshold?: number; // 0-1, default 0.6 (60%)
}

interface Alert {
  type: "SHORT_CIRCUIT" | "OPEN_CIRCUIT" | "IDLE";
  count: number;
  percentage: number;
  message: string;
  suggestion: string;
  icon: "zap" | "triangle" | "lightbulb";
}

export const MisconceptionAlert = memo(function MisconceptionAlert({
  students,
  threshold = 0.6,
}: MisconceptionAlertProps) {
  const alert = useMemo<Alert | null>(() => {
    if (students.length === 0) return null;

    const shortCount = students.filter(
      (s) => s.simulationResult === "SHORT_CIRCUIT"
    ).length;
    const openCount = students.filter(
      (s) => s.simulationResult === "OPEN_CIRCUIT"
    ).length;
    const idleCount = students.filter((s) => s.simulationResult === "IDLE").length;

    const total = students.length;
    const shortPct = shortCount / total;
    const openPct = openCount / total;
    const idlePct = idleCount / total;

    // Priority order: SHORT > OPEN > IDLE
    if (shortPct >= threshold) {
      return {
        type: "SHORT_CIRCUIT",
        count: shortCount,
        percentage: Math.round(shortPct * 100),
        message: `${shortCount} of ${total} students attempted short circuits`,
        suggestion:
          "Review battery terminal connections. Remind students that current must pass through a load (bulb) before returning to the battery.",
        icon: "zap",
      };
    }

    if (openPct >= threshold) {
      return {
        type: "OPEN_CIRCUIT",
        count: openCount,
        percentage: Math.round(openPct * 100),
        message: `${openCount} of ${total} students have open circuits`,
        suggestion:
          "Check that all switches are closed and wires connect to the correct terminals (positive/negative, in/out).",
        icon: "triangle",
      };
    }

    if (idlePct >= threshold) {
      return {
        type: "IDLE",
        count: idleCount,
        percentage: Math.round(idlePct * 100),
        message: `${idleCount} of ${total} students haven't started yet`,
        suggestion:
          "Encourage students to drag components onto the canvas. Start with Battery → Switch → Bulb.",
        icon: "lightbulb",
      };
    }

    return null;
  }, [students, threshold]);

  if (!alert) {
    return (
      <div className="rounded-lg border border-neon-green/30 bg-neon-green/5 p-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-neon-green" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neon-green">
            Class on track — no common misconception detected
          </span>
        </div>
      </div>
    );
  }

  const Icon =
    alert.icon === "zap" ? Zap : alert.icon === "triangle" ? AlertTriangle : Lightbulb;

  const colorMap = {
    SHORT_CIRCUIT: {
      border: "border-neon-red/50",
      bg: "bg-neon-red/10",
      text: "text-neon-red",
      iconColor: "text-neon-red",
    },
    OPEN_CIRCUIT: {
      border: "border-neon-yellow/50",
      bg: "bg-neon-yellow/10",
      text: "text-neon-yellow",
      iconColor: "text-neon-yellow",
    },
    IDLE: {
      border: "border-neon-cyan/50",
      bg: "bg-neon-cyan/10",
      text: "text-neon-cyan",
      iconColor: "text-neon-cyan",
    },
  };
  const colors = colorMap[alert.type];

  return (
    <div
      className={`animate-fade-in-scale relative overflow-hidden rounded-lg border ${colors.border} ${colors.bg} p-4 backdrop-blur-md`}
      style={{
        animation: "fadeInScale 0.4s ease-out",
      }}
    >
      {/* Background pulse */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 0% 50%, currentColor 0%, transparent 50%)`,
          color:
            alert.type === "SHORT_CIRCUIT"
              ? "rgba(239, 68, 68, 0.3)"
              : alert.type === "OPEN_CIRCUIT"
              ? "rgba(234, 179, 8, 0.3)"
              : "rgba(0, 255, 255, 0.3)",
        }}
      />

      <div className="relative flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-current">
          <Icon className={`h-4 w-4 ${colors.iconColor} animate-pulse`} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`font-mono text-[9px] font-bold uppercase tracking-widest ${colors.text}`}>
              ⚠ Class Alert
            </span>
            <span className="rounded border border-current bg-bg-primary/50 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest">
              {alert.percentage}%
            </span>
          </div>

          <div className={`mt-1 font-mono text-sm font-bold uppercase tracking-wide ${colors.text}`}>
            {alert.message}
          </div>

          <div className="mt-2 flex items-start gap-2 rounded border border-current/30 bg-bg-primary/40 p-2">
            <Lightbulb className={`mt-0.5 h-3 w-3 shrink-0 ${colors.iconColor}`} />
            <p className="font-mono text-[10px] leading-relaxed text-text-primary">
              <span className="font-bold uppercase tracking-widest">Suggest:</span>{" "}
              {alert.suggestion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});