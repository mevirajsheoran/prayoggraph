"use client";

import { memo } from "react";
import { Lock } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";

interface LockedNodeData {
  kind: "resistor" | "capacitor" | "ammeter" | "voltmeter";
  isOpen?: boolean;
}

interface LockedNodeProps {
  data: LockedNodeData;
  selected?: boolean;
}

const SYMBOL_MAP: Record<LockedNodeData["kind"], string> = {
  resistor: "Resistor",
  capacitor: "Capacitor",
  ammeter: "Ammeter",
  voltmeter: "Voltmeter",
};

/**
 * LockedNode
 *
 * Placeholder for components not yet implemented. Shows a desaturated icon
 * with a lock badge. Communicates roadmap depth to judges without requiring
 * implementation.
 */
export const LockedNode = memo(function LockedNode({
  data,
  selected,
}: LockedNodeProps) {
  const label = SYMBOL_MAP[data.kind] || data.kind;

  return (
    <NodeWrapper
      label={label}
      sublabel="Locked"
      state="IDLE"
      selected={selected}
      width={88}
      height={64}
    >
      <div className="relative flex flex-col items-center gap-1 opacity-40">
        {/* Generic resistor-like squiggle for all locked */}
        <svg width="48" height="20" viewBox="0 0 48 20">
          <line
            x1={0}
            y1={10}
            x2={4}
            y2={10}
            stroke="#9ca3af"
            strokeWidth={1.5}
          />
          <polyline
            points="4,10 8,4 12,16 16,4 20,16 24,4 28,16 32,4 36,16 40,4 44,10"
            fill="none"
            stroke="#9ca3af"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <line
            x1={44}
            y1={10}
            x2={48}
            y2={10}
            stroke="#9ca3af"
            strokeWidth={1.5}
          />
        </svg>
      </div>

      {/* Lock badge */}
      <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full border border-text-muted bg-bg-primary">
        <Lock className="h-2.5 w-2.5 text-text-muted" />
      </div>

      {/* SOON badge */}
      <div className="absolute -right-2 -top-2 rounded border border-neon-yellow/60 bg-neon-yellow/20 px-1 py-0.5 font-mono text-[7px] font-bold uppercase tracking-widest text-neon-yellow">
        SOON
      </div>
    </NodeWrapper>
  );
});