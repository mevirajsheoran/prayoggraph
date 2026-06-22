"use client";

import { memo } from "react";
import { Boxes } from "lucide-react";

interface PaletteHeaderProps {
  activeCount: number;
  totalCount: number;
}

export const PaletteHeader = memo(function PaletteHeader({
  activeCount,
  totalCount,
}: PaletteHeaderProps) {
  return (
    <div className="border-b border-border-default px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Boxes className="h-3.5 w-3.5 text-neon-cyan" />
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-neon-cyan text-glow-cyan">
            Component Palette
          </h2>
        </div>
        <div className="rounded-full border border-neon-cyan/30 bg-neon-cyan/5 px-2 py-0.5">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-neon-cyan">
            {activeCount}/{totalCount}
          </span>
        </div>
      </div>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-text-muted">
        Drag onto canvas
      </p>
    </div>
  );
});