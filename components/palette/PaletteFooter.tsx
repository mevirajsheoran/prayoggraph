"use client";

import { memo } from "react";
import { Activity } from "lucide-react";

export const PaletteFooter = memo(function PaletteFooter() {
  return (
    <div className="mt-auto border-t border-border-default px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-green opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-green" />
        </span>
        <Activity className="h-3 w-3 text-neon-green" />
        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-neon-green">
          All Systems Online
        </span>
      </div>
      <p className="mt-1 font-mono text-[8px] uppercase tracking-widest text-text-muted">
        Engine: DFS v2.0
      </p>
    </div>
  );
});