"use client";

import { memo } from "react";
import { useDragSource } from "@/lib/hooks";
import type { ComponentMeta } from "@/lib/constants";
import { PaletteSymbol } from "./PaletteSymbol";
import { Lock } from "lucide-react";

interface PaletteCardProps {
  meta: ComponentMeta;
}

const ACCENT_STYLES = {
  cyan: {
    border: "border-neon-cyan/30 hover:border-neon-cyan",
    text: "group-hover:text-neon-cyan",
    glow: "hover:shadow-neon-cyan",
    bg: "from-neon-cyan/5",
    indicator: "bg-neon-cyan",
  },
  purple: {
    border: "border-neon-purple/30 hover:border-neon-purple",
    text: "group-hover:text-neon-purple",
    glow: "hover:shadow-neon-purple",
    bg: "from-neon-purple/5",
    indicator: "bg-neon-purple",
  },
  green: {
    border: "border-neon-green/30 hover:border-neon-green",
    text: "group-hover:text-neon-green",
    glow: "hover:shadow-neon-green",
    bg: "from-neon-green/5",
    indicator: "bg-neon-green",
  },
  yellow: {
    border: "border-text-muted/30 hover:border-neon-yellow",
    text: "group-hover:text-neon-yellow",
    glow: "hover:shadow-neon-yellow",
    bg: "from-neon-yellow/5",
    indicator: "bg-neon-yellow",
  },
  red: {
    border: "border-neon-red/30 hover:border-neon-red",
    text: "group-hover:text-neon-red",
    glow: "hover:shadow-neon-red",
    bg: "from-neon-red/5",
    indicator: "bg-neon-red",
  },
} as const;

export const PaletteCard = memo(function PaletteCard({ meta }: PaletteCardProps) {
  const { onDragStart } = useDragSource();
  const accent = ACCENT_STYLES[meta.accent];

  return (
    <div
      draggable={meta.unlocked}
      onDragStart={(e) => onDragStart(e, meta)}
      className={`
        group relative flex cursor-grab items-center gap-3 rounded-md
        border bg-gradient-to-r ${accent.bg} to-transparent p-2.5
        transition-all duration-200 no-select
        ${meta.unlocked ? `${accent.border} ${accent.glow} hover:-translate-y-px active:cursor-grabbing` : "border-text-muted/20 opacity-50 cursor-not-allowed"}
      `}
    >
      {/* Symbol preview */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-bg-elevated bg-bg-primary">
        <PaletteSymbol symbol={meta.symbol} accent={meta.accent} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div
          className={`font-mono text-[11px] font-bold uppercase tracking-widest text-text-primary transition-colors ${accent.text}`}
        >
          {meta.label}
        </div>
        <div className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
          {meta.description}
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center">
        {meta.unlocked ? (
          <div className={`h-1.5 w-1.5 rounded-full ${accent.indicator} opacity-60 group-hover:opacity-100 group-hover:shadow-current`} />
        ) : (
          <div className="flex h-5 w-5 items-center justify-center rounded border border-text-muted/40 bg-bg-primary">
            <Lock className="h-2.5 w-2.5 text-text-muted" />
          </div>
        )}
      </div>

      {/* SOON badge for locked */}
      {!meta.unlocked && (
        <div className="absolute -right-1 -top-1 rounded border border-neon-yellow/60 bg-neon-yellow/20 px-1 py-0.5 font-mono text-[7px] font-bold uppercase tracking-widest text-neon-yellow">
          SOON
        </div>
      )}

      {/* Hover hint glow */}
      {meta.unlocked && (
        <div className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity group-hover:opacity-100"
             style={{
               background: `radial-gradient(circle at center, ${
                 meta.accent === "cyan" ? "rgba(0, 255, 255, 0.08)" :
                 meta.accent === "purple" ? "rgba(168, 85, 247, 0.08)" :
                 meta.accent === "green" ? "rgba(34, 197, 94, 0.08)" :
                 "rgba(234, 179, 8, 0.08)"
               } 0%, transparent 70%)`,
             }}
        />
      )}
    </div>
  );
});