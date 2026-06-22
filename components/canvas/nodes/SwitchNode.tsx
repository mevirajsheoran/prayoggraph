"use client";

import { memo, useCallback } from "react";
import { Position } from "reactflow";
import { NodeWrapper } from "./NodeWrapper";
import { TerminalHandle } from "./TerminalHandle";
import type { SimulationResult } from "@/lib/types";

interface SwitchNodeData {
  kind: "switch";
  isOpen?: boolean;
}

interface SwitchNodeProps {
  data: SwitchNodeData;
  id: string;
  selected?: boolean;
  simulationState?: SimulationResult;
}

/**
 * SwitchNode
 *
 * IEEE standard single-pole switch symbol: two terminal dots connected by a line.
 * - OPEN:   line angled up at ~30°, red color
 * - CLOSED: line horizontal, green color
 *
 * Click anywhere on the node to toggle. The toggle is handled by the parent
 * canvas via the onNodeClick callback.
 */
export const SwitchNode = memo(function SwitchNode({
  data,
  id,
  selected,
  simulationState = "IDLE",
}: SwitchNodeProps) {
  const isOpen = data.isOpen ?? false;

  // Visual config based on state
  const strokeColor = isOpen
    ? "#ef4444"
    : simulationState === "VALID_CIRCUIT"
    ? "#22c55e"
    : "#00ffff";

  const label = isOpen ? "Open" : "Closed";
  const sublabel = "SPST";

  return (
    <div className="cursor-pointer" data-switch-id={id}>
      <NodeWrapper
        label={label}
        sublabel={sublabel}
        state={simulationState}
        selected={selected}
        width={96}
        height={48}
      >
        <TerminalHandle
          terminalId="in"
          position={Position.Left}
          variant="input"
        />
        <TerminalHandle
          terminalId="out"
          position={Position.Right}
          variant="output"
        />

        <svg
          width={64}
          height={32}
          viewBox="0 0 64 32"
          style={{ overflow: "visible" }}
        >
          {/* Left terminal dot */}
          <circle
            cx={6}
            cy={16}
            r={3}
            fill="#030712"
            stroke={strokeColor}
            strokeWidth={2}
            style={{
              filter: `drop-shadow(0 0 4px ${strokeColor})`,
            }}
          />

          {/* Right terminal dot */}
          <circle
            cx={58}
            cy={16}
            r={3}
            fill="#030712"
            stroke={strokeColor}
            strokeWidth={2}
            style={{
              filter: `drop-shadow(0 0 4px ${strokeColor})`,
            }}
          />

          {/* Switch arm — angled when open, flat when closed */}
          <line
            x1={6}
            y1={16}
            x2={isOpen ? 56 : 58}
            y2={isOpen ? 4 : 16}
            stroke={strokeColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 4px ${strokeColor})`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />

          {/* Hinge point on left terminal */}
          <circle
            cx={6}
            cy={16}
            r={1.5}
            fill={strokeColor}
          />
        </svg>
      </NodeWrapper>

      {/* Toggle hint */}
      <div className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-widest text-text-muted opacity-0 transition-opacity group-hover:opacity-100">
        Click to toggle
      </div>
    </div>
  );
});