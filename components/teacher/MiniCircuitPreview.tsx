"use client";

import { memo } from "react";
import type { Node, Edge } from "reactflow";
import { Battery, Lightbulb, ToggleLeft, Circle } from "lucide-react";

interface MiniCircuitPreviewProps {

  nodes?: Node[];   // ← Make optional
  edges?: Edge[];
  size?: number;
}

/**
 * MiniCircuitPreview
 *
 * A simplified icon-based representation of a student's circuit.
 * Shows colored dots for each component type — much faster to parse
 * visually than a full React Flow render.
 */
export const MiniCircuitPreview = memo(function MiniCircuitPreview({
  nodes = [],   // ← ADD DEFAULT
  edges = [],
  size = 64,
}: MiniCircuitPreviewProps) {
  const batteryCount = nodes.filter((n) => n?.type === "battery").length;
  const bulbCount = nodes.filter((n) => n?.type === "bulb").length;
  const switchCount = nodes.filter((n) => n?.type === "switch").length;

  const isEmpty = nodes.length === 0;

  return (
    <div
      className="flex items-center justify-center gap-1 rounded border border-border-default bg-bg-primary/60 p-2"
      style={{ width: size, height: size * 0.6 }}
    >
      {isEmpty ? (
        <div className="flex flex-col items-center gap-1 text-text-muted">
          <Circle className="h-3 w-3" />
          <span className="font-mono text-[7px] uppercase tracking-widest">Empty</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {batteryCount > 0 && (
            <div className="flex items-center gap-0.5">
              <Battery className="h-3 w-3 text-neon-cyan" />
              <span className="font-mono text-[8px] text-neon-cyan">{batteryCount}</span>
            </div>
          )}
          <div className="h-px w-2 bg-neon-cyan/40" />
          {switchCount > 0 && (
            <div className="flex items-center gap-0.5">
              <ToggleLeft className="h-3 w-3 text-neon-purple" />
              <span className="font-mono text-[8px] text-neon-purple">{switchCount}</span>
            </div>
          )}
          <div className="h-px w-2 bg-neon-cyan/40" />
          {bulbCount > 0 && (
            <div className="flex items-center gap-0.5">
              <Lightbulb className="h-3 w-3 text-neon-green" />
              <span className="font-mono text-[8px] text-neon-green">{bulbCount}</span>
            </div>
          )}
        </div>
      )}
      <div className="mt-1 flex items-center gap-1 border-t border-border-default pt-1">
        <span className="font-mono text-[7px] uppercase tracking-widest text-text-muted">
          {nodes.length}N · {edges.length}E
        </span>
      </div>
    </div>
  );
});