"use client";

import { memo } from "react";
import { Position } from "reactflow";
import { NodeWrapper } from "./NodeWrapper";
import { TerminalHandle } from "./TerminalHandle";
import type { SimulationResult } from "@/lib/types";

interface BatteryNodeData {
  kind: "battery";
  isOpen?: boolean;
}

interface BatteryNodeProps {
  data: BatteryNodeData;
  selected?: boolean;
  simulationState?: SimulationResult;
}

/**
 * BatteryNode
 *
 * IEEE standard symbol: alternating thick (positive plate) and thin (negative plate)
 * vertical lines representing a multi-cell battery.
 *
 * Long line = positive plate (taller)
 * Short line = negative plate (shorter)
 *
 * Terminal handles:
 *   - LEFT  = negative (−)
 *   - RIGHT = positive (+)
 */
export const BatteryNode = memo(function BatteryNode({
  data,
  selected,
  simulationState = "IDLE",
}: BatteryNodeProps) {
  // Cell stack configuration: pairs of [long, short] lines
  const cells = 3; // 3-cell battery
  const cellWidth = 8;
  const lineHeight = 24;
  const shortLineHeight = 12;
  const cellGap = 3;
  const totalWidth = cells * (cellWidth + cellGap) + 4;
  const totalHeight = lineHeight + 4;

  return (
    <NodeWrapper
      label="Battery"
      sublabel="EMF Source"
      state={simulationState}
      selected={selected}
      width={totalWidth + 32}
      height={totalHeight + 32}
    >
      <TerminalHandle
        terminalId="negative"
        position={Position.Left}
        label="−"
        variant="input"
      />
      <TerminalHandle
        terminalId="positive"
        position={Position.Right}
        label="+"
        variant="output"
      />

      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        style={{ overflow: "visible" }}
      >
        {/* Battery outline */}
        <rect
          x={2}
          y={(totalHeight - lineHeight) / 2 - 2}
          width={totalWidth - 4}
          height={lineHeight + 4}
          rx={2}
          fill="rgba(0, 0, 0, 0.3)"
          stroke={
            simulationState === "VALID_CIRCUIT"
              ? "#22c55e"
              : simulationState === "SHORT_CIRCUIT"
              ? "#ef4444"
              : "#a855f7"
          }
          strokeWidth={1}
          opacity={0.6}
        />

        {/* Cell plates: alternating long (positive) and short (negative) */}
        {Array.from({ length: cells }).map((_, i) => {
          const xPos = 4 + i * (cellWidth + cellGap) + cellWidth / 2;
          return (
            <g key={i}>
              {/* Long line = positive plate */}
              <line
                x1={xPos - cellWidth / 2}
                y1={(totalHeight - lineHeight) / 2}
                x2={xPos - cellWidth / 2}
                y2={(totalHeight - lineHeight) / 2 + lineHeight}
                stroke="#00ffff"
                strokeWidth={2.5}
                style={{
                  filter: "drop-shadow(0 0 2px rgba(0, 255, 255, 0.6))",
                }}
              />
              {/* Short line = negative plate */}
              <line
                x1={xPos + cellWidth / 2 - 1}
                y1={(totalHeight - lineHeight) / 2 + (lineHeight - shortLineHeight) / 2}
                x2={xPos + cellWidth / 2 - 1}
                y2={
                  (totalHeight - lineHeight) / 2 + (lineHeight - shortLineHeight) / 2 + shortLineHeight
                }
                stroke="#00ffff"
                strokeWidth={2}
                opacity={0.7}
                style={{
                  filter: "drop-shadow(0 0 2px rgba(0, 255, 255, 0.4))",
                }}
              />
            </g>
          );
        })}

        {/* External lead wires (visual hint) */}
        <line
          x1={-8}
          y1={totalHeight / 2}
          x2={2}
          y2={totalHeight / 2}
          stroke="#00ffff"
          strokeWidth={1.5}
          opacity={0.5}
        />
        <line
          x1={totalWidth - 2}
          y1={totalHeight / 2}
          x2={totalWidth + 6}
          y2={totalHeight / 2}
          stroke="#00ffff"
          strokeWidth={1.5}
          opacity={0.5}
        />
      </svg>
    </NodeWrapper>
  );
});