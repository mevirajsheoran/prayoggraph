"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import type { TerminalId } from "@/lib/types";

interface TerminalHandleProps {
  terminalId: TerminalId;
  position: Position;
  label?: string;
  variant: "input" | "output";
  style?: React.CSSProperties;
}

/**
 * TerminalHandle
 *
 * IEEE-style circuit terminal. Pass-through wrapper around React Flow's Handle
 * that provides:
 *   - Stable id bound to terminal name
 *   - Optional plus/minus labels (battery)
 *   - Cyan glow on hover via globals.css
 *
 * Note: React Flow v11 uses "source"/"target" for handle type.
 * We map our semantic "input"/"output" → "target"/"source" so:
 *   - "input"  = where current ENTERS a component (target)
 *   - "output" = where current LEAVES a component (source)
 */
export const TerminalHandle = memo(function TerminalHandle({
  terminalId,
  position,
  label,
  variant,
  style,
}: TerminalHandleProps) {
  // Map our semantic variant to React Flow's expected type
  const handleType = variant === "output" ? "source" : "target";

  return (
    <>
      <Handle
        type={handleType}
        position={position}
        id={terminalId}
        className="terminal-handle"
        style={style}
      />
      {label && (
        <span
          className="pointer-events-none absolute font-mono text-[8px] font-bold opacity-0 transition-opacity group-hover:opacity-100"
          style={{
            color: terminalId === "positive" ? "#22c55e" : "#ef4444",
            textShadow: "0 0 4px currentColor",
            ...getLabelStyle(position),
          }}
        >
          {label}
        </span>
      )}
    </>
  );
});

function getLabelStyle(position: Position): React.CSSProperties {
  switch (position) {
    case Position.Left:
      return { left: -16, top: "50%", transform: "translateY(-50%)" };
    case Position.Right:
      return { right: -16, top: "50%", transform: "translateY(-50%)" };
    case Position.Top:
      return { top: -16, left: "50%", transform: "translateX(-50%)" };
    case Position.Bottom:
      return { bottom: -16, left: "50%", transform: "translateX(-50%)" };
    default:
      return {};
  }
}