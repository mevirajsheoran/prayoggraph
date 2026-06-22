"use client";

import { memo } from "react";
import { Position } from "reactflow";
import { NodeWrapper } from "./NodeWrapper";
import { TerminalHandle } from "./TerminalHandle";
import type { SimulationResult } from "@/lib/types";

interface BulbNodeData {
  kind: "bulb";
  isOpen?: boolean;
}

interface BulbNodeProps {
  data: BulbNodeData;
  selected?: boolean;
  simulationState?: SimulationResult;
}

/**
 * BulbNode
 *
 * IEEE standard lamp symbol: circle with X (filament) inside.
 *
 * State-dependent visuals:
 *   - IDLE         : cyan stroke, dim
 *   - VALID_CIRCUIT: green stroke, pulsing bloom animation (lit)
 *   - OPEN_CIRCUIT : yellow stroke, dim
 *   - SHORT_CIRCUIT: red stroke, rapid flash animation
 */
export const BulbNode = memo(function BulbNode({
  data,
  selected,
  simulationState = "IDLE",
}: BulbNodeProps) {
  const size = 44;
  const radius = size / 2;

  // Color and animation based on state
  const colorMap = {
    IDLE: { stroke: "#00ffff", animClass: "" },
    VALID_CIRCUIT: { stroke: "#22c55e", animClass: "animate-bulb-on" },
    OPEN_CIRCUIT: { stroke: "#eab308", animClass: "" },
    SHORT_CIRCUIT: { stroke: "#ef4444", animClass: "animate-bulb-short" },
  };

  const { stroke, animClass } = colorMap[simulationState];

  // Label changes by state
  const label =
    simulationState === "VALID_CIRCUIT"
      ? "Active"
      : simulationState === "SHORT_CIRCUIT"
      ? "Short!"
      : "Bulb";

  return (
    <NodeWrapper
      label={label}
      sublabel="Lamp / Load"
      state={simulationState}
      selected={selected}
      width={size + 32}
      height={size + 32}
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

      <div className={animClass}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: "visible" }}
        >
          {/* Glass envelope (circle) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - 2}
            fill={
              simulationState === "VALID_CIRCUIT"
                ? "rgba(34, 197, 94, 0.15)"
                : simulationState === "SHORT_CIRCUIT"
                ? "rgba(239, 68, 68, 0.15)"
                : "rgba(0, 0, 0, 0.2)"
            }
            stroke={stroke}
            strokeWidth={2}
            style={{
              filter:
                simulationState === "VALID_CIRCUIT"
                  ? "drop-shadow(0 0 8px rgba(34, 197, 94, 0.9)) drop-shadow(0 0 16px rgba(34, 197, 94, 0.5))"
                  : simulationState === "SHORT_CIRCUIT"
                  ? "drop-shadow(0 0 8px rgba(239, 68, 68, 0.9))"
                  : "drop-shadow(0 0 4px rgba(0, 255, 255, 0.6))",
              transition: "all 0.3s ease",
            }}
          />

          {/* Filament (X pattern) — IEEE standard for lamp */}
          <line
            x1={size / 2 - radius * 0.55}
            y1={size / 2 - radius * 0.55}
            x2={size / 2 + radius * 0.55}
            y2={size / 2 + radius * 0.55}
            stroke={stroke}
            strokeWidth={1.5}
            style={{
              filter:
                simulationState === "VALID_CIRCUIT"
                  ? "drop-shadow(0 0 4px rgba(34, 197, 94, 0.8))"
                  : "none",
            }}
          />
          <line
            x1={size / 2 + radius * 0.55}
            y1={size / 2 - radius * 0.55}
            x2={size / 2 - radius * 0.55}
            y2={size / 2 + radius * 0.55}
            stroke={stroke}
            strokeWidth={1.5}
            style={{
              filter:
                simulationState === "VALID_CIRCUIT"
                  ? "drop-shadow(0 0 4px rgba(34, 197, 94, 0.8))"
                  : "none",
            }}
          />

          {/* Internal lead wires (visible inside circle) */}
          <line
            x1={-4}
            y1={size / 2}
            x2={size / 2 - radius * 0.55}
            y2={size / 2 - radius * 0.55}
            stroke={stroke}
            strokeWidth={1}
            opacity={0.5}
          />
          <line
            x1={size / 2 + radius * 0.55}
            y1={size / 2 + radius * 0.55}
            x2={size + 4}
            y2={size / 2}
            stroke={stroke}
            strokeWidth={1}
            opacity={0.5}
          />
        </svg>
      </div>
    </NodeWrapper>
  );
});