"use client";

import { memo, ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  accent?: "cyan" | "purple" | "green" | "red" | "yellow";
}

const ACCENT_COLORS = {
  cyan: "text-neon-cyan",
  purple: "text-neon-purple",
  green: "text-neon-green",
  red: "text-neon-red",
  yellow: "text-neon-yellow",
} as const;

export const MetricCard = memo(function MetricCard({
  label,
  value,
  icon,
  accent = "cyan",
}: MetricCardProps) {
  return (
    <div className="glass-card group p-3 transition-all duration-200 hover:border-neon-cyan/40">
      <div className="flex items-start justify-between">
        <span className="mono-label">{label}</span>
        {icon && (
          <span className={`opacity-50 transition-opacity group-hover:opacity-100 ${ACCENT_COLORS[accent]}`}>
            {icon}
          </span>
        )}
      </div>
      <div
        className={`mt-2 font-mono text-2xl font-bold leading-none ${ACCENT_COLORS[accent]}`}
        style={{
          textShadow:
            accent === "cyan"
              ? "0 0 10px rgba(0, 255, 255, 0.4)"
              : accent === "green"
              ? "0 0 10px rgba(34, 197, 94, 0.4)"
              : accent === "red"
              ? "0 0 10px rgba(239, 68, 68, 0.4)"
              : accent === "yellow"
              ? "0 0 10px rgba(234, 179, 8, 0.4)"
              : "0 0 10px rgba(168, 85, 247, 0.4)",
        }}
      >
        {value}
      </div>
    </div>
  );
});