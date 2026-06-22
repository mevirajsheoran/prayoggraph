"use client";

import { memo } from "react";

type Tone = "cyan" | "green" | "red" | "yellow" | "purple" | "gray";

interface BadgeProps {
  tone?: Tone;
  label: string;
  pulse?: boolean;
  icon?: React.ReactNode;
}

const TONES = {
  cyan: "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan",
  green: "border-neon-green/40 bg-neon-green/10 text-neon-green",
  red: "border-neon-red/40 bg-neon-red/10 text-neon-red",
  yellow: "border-neon-yellow/40 bg-neon-yellow/10 text-neon-yellow",
  purple: "border-neon-purple/40 bg-neon-purple/10 text-neon-purple",
  gray: "border-text-muted/40 bg-bg-card text-text-secondary",
} as const;

const DOT_TONES = {
  cyan: "bg-neon-cyan",
  green: "bg-neon-green",
  red: "bg-neon-red",
  yellow: "bg-neon-yellow",
  purple: "bg-neon-purple",
  gray: "bg-text-muted",
} as const;

export const Badge = memo(function Badge({
  tone = "cyan",
  label,
  pulse = false,
  icon,
}: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 ${TONES[tone]}`}
    >
      {icon ? (
        <span className="flex h-3 w-3 items-center justify-center">{icon}</span>
      ) : (
        <span
          className={`h-1.5 w-1.5 rounded-full ${DOT_TONES[tone]} ${
            pulse ? "animate-pulse" : ""
          }`}
        />
      )}
      <span className="font-mono text-[9px] font-bold uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
});