"use client";

import { memo } from "react";
import { Activity } from "lucide-react";

export const InspectorHeader = memo(function InspectorHeader() {
  return (
    <div className="border-b border-border-default px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-neon-cyan" />
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-neon-cyan text-glow-cyan">
            Graph Inspector
          </h2>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-2 py-0.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon-cyan" />
          </span>
          <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-neon-cyan">
            LIVE
          </span>
        </div>
      </div>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-text-muted">
        Real-time circuit state
      </p>
    </div>
  );
});