"use client";

import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "reactflow";

interface WireEdgeData {
  isActive?: boolean;
  sourceTerminal?: string;
  targetTerminal?: string;
}

/**
 * WireEdge
 *
 * Custom edge for wires. Features:
 *   - Smooth bezier path
 *   - Cyan stroke with neon glow
 *   - Animated dashed stroke when `isActive` (current flowing through)
 *   - Step path option for right-angle "schematic" look
 */
export const WireEdge = memo(function WireEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<WireEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isActive = data?.isActive ?? false;
  const stroke = selected ? "#a855f7" : "#00ffff";

  return (
    <>
      {/* Glow layer (behind the main stroke) */}
      <path
        d={edgePath}
        fill="none"
        stroke={stroke}
        strokeWidth={isActive ? 4 : 3}
        opacity={0.3}
        style={{
          filter: "blur(4px)",
        }}
      />

      {/* Main wire */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke,
          strokeWidth: isActive ? 2.5 : 2,
          strokeDasharray: isActive ? "8 4" : undefined,
          animation: isActive ? "currentFlow 1.2s linear infinite" : undefined,
          filter: `drop-shadow(0 0 ${isActive ? 6 : 4}px ${stroke})`,
          transition: "all 0.3s ease",
        }}
        markerEnd={undefined}
      />

      {/* Optional label at midpoint */}
      {data?.sourceTerminal && data?.targetTerminal && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "none",
            }}
            className="rounded bg-bg-card/80 px-1 py-0.5 font-mono text-[8px] uppercase tracking-widest text-text-muted opacity-0 transition-opacity hover:opacity-100"
          >
            {data.sourceTerminal} → {data.targetTerminal}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});