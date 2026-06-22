"use client";

import { memo } from "react";
import { TrendingUp, Target, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { MisconceptionCounters } from "@/lib/types";

interface LearningAnalyticsProps {
  counters: MisconceptionCounters;
  masteryScore: number;
}

export const LearningAnalytics = memo(function LearningAnalytics({
  counters,
  masteryScore,
}: LearningAnalyticsProps) {
  const total = Math.max(counters.totalAttempts, 1);
  const validPct = Math.round((counters.validCircuitSuccesses / total) * 100);
  const openPct = Math.round((counters.openCircuitAttempts / total) * 100);
  const shortPct = Math.round((counters.shortCircuitAttempts / total) * 100);

  // Mastery score color tier
  const masteryColor =
    masteryScore >= 80
      ? "text-neon-green"
      : masteryScore >= 50
      ? "text-neon-yellow"
      : masteryScore === 0
      ? "text-text-muted"
      : "text-neon-red";

  return (
    <div className="space-y-3">
      {/* Mastery Score — big display */}
      <div className="rounded-lg border border-border-default bg-bg-card/40 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-neon-cyan" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              Mastery Score
            </span>
          </div>
          <span className={`font-mono text-2xl font-bold leading-none ${masteryColor}`}
                style={{
                  textShadow:
                    masteryScore >= 80
                      ? "0 0 10px rgba(34, 197, 94, 0.5)"
                      : masteryScore >= 50
                      ? "0 0 10px rgba(234, 179, 8, 0.5)"
                      : undefined,
                }}>
            {masteryScore}
            <span className="text-sm text-text-muted">%</span>
          </span>
        </div>

        {/* Mastery bar */}
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated">
          <div
            className={`h-full transition-all duration-500 ${
              masteryScore >= 80
                ? "bg-neon-green shadow-neon-green"
                : masteryScore >= 50
                ? "bg-neon-yellow"
                : masteryScore === 0
                ? "bg-text-muted"
                : "bg-neon-red"
            }`}
            style={{ width: `${masteryScore}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-lg border border-border-default bg-bg-card/40 p-3">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-neon-purple" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            Attempt Breakdown
          </span>
        </div>

        <ProgressRow
          label="Valid Circuit"
          count={counters.validCircuitSuccesses}
          percent={validPct}
          color="bg-neon-green"
          textColor="text-neon-green"
          icon={<CheckCircle2 className="h-3 w-3" />}
        />
        <ProgressRow
          label="Open Circuit"
          count={counters.openCircuitAttempts}
          percent={openPct}
          color="bg-neon-yellow"
          textColor="text-neon-yellow"
          icon={<AlertTriangle className="h-3 w-3" />}
        />
        <ProgressRow
          label="Short Circuit"
          count={counters.shortCircuitAttempts}
          percent={shortPct}
          color="bg-neon-red"
          textColor="text-neon-red"
          icon={<Zap className="h-3 w-3" />}
        />

        {/* Total */}
        <div className="mt-3 flex items-center justify-between border-t border-border-default pt-2 font-mono text-[9px] uppercase tracking-widest text-text-muted">
          <span>Total Attempts</span>
          <span className="text-text-primary">{counters.totalAttempts}</span>
        </div>
      </div>
    </div>
  );
});

interface ProgressRowProps {
  label: string;
  count: number;
  percent: number;
  color: string;
  textColor: string;
  icon: React.ReactNode;
}

const ProgressRow = memo(function ProgressRow({
  label,
  count,
  percent,
  color,
  textColor,
  icon,
}: ProgressRowProps) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={textColor}>{icon}</span>
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-text-primary">
            {label}
          </span>
        </div>
        <span className={`font-mono text-[10px] font-bold ${textColor}`}>
          {count} <span className="text-text-muted">({percent}%)</span>
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-bg-elevated">
        <div
          className={`h-full transition-all duration-500 ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
});