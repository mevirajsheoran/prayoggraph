"use client";

import { memo, useMemo } from "react";
import { Users, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import type { SimulationResult } from "@/lib/types";

interface ClassSummaryBarProps {
  totalStudents: number;
  validCount: number;
  errorCount: number;
  idleCount: number;
}

export const ClassSummaryBar = memo(function ClassSummaryBar({
  totalStudents,
  validCount,
  errorCount,
  idleCount,
}: ClassSummaryBarProps) {
  const validPct = totalStudents > 0 ? Math.round((validCount / totalStudents) * 100) : 0;
  const errorPct = totalStudents > 0 ? Math.round((errorCount / totalStudents) * 100) : 0;
  const idlePct = totalStudents > 0 ? Math.round((idleCount / totalStudents) * 100) : 0;

  return (
    <div className="grid grid-cols-4 gap-3">
      <StatCard
        label="Total"
        value={totalStudents}
        icon={<Users className="h-4 w-4" />}
        accent="cyan"
      />
      <StatCard
        label="Valid"
        value={validCount}
        subtext={`${validPct}%`}
        icon={<CheckCircle2 className="h-4 w-4" />}
        accent="green"
      />
      <StatCard
        label="Errors"
        value={errorCount}
        subtext={`${errorPct}%`}
        icon={<AlertTriangle className="h-4 w-4" />}
        accent="red"
      />
      <StatCard
        label="Idle"
        value={idleCount}
        subtext={`${idlePct}%`}
        icon={<Clock className="h-4 w-4" />}
        accent="yellow"
      />
    </div>
  );
});

interface StatCardProps {
  label: string;
  value: number;
  subtext?: string;
  icon: React.ReactNode;
  accent: "cyan" | "green" | "red" | "yellow";
}

const StatCard = memo(function StatCard({ label, value, subtext, icon, accent }: StatCardProps) {
  const colors = {
    cyan: { text: "text-neon-cyan", border: "border-neon-cyan/40", bg: "bg-neon-cyan/10" },
    green: { text: "text-neon-green", border: "border-neon-green/40", bg: "bg-neon-green/10" },
    red: { text: "text-neon-red", border: "border-neon-red/40", bg: "bg-neon-red/10" },
    yellow: { text: "text-neon-yellow", border: "border-neon-yellow/40", bg: "bg-neon-yellow/10" },
  };
  const c = colors[accent];

  return (
    <div className={`relative overflow-hidden rounded-lg border ${c.border} ${c.bg} p-3 backdrop-blur-md`}>
      <div className="flex items-start justify-between">
        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-text-secondary">
          {label}
        </span>
        <span className={c.text}>{icon}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className={`font-mono text-2xl font-bold leading-none ${c.text}`}>
          {value}
        </span>
        {subtext && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
});