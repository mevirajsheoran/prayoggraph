"use client";

import { memo, type ReactNode } from "react";
import type { SimulationResult } from "@/lib/types";

interface NodeWrapperProps {
  /** Visual label shown below the symbol */
  label: string;
  /** Optional sub-label for state */
  sublabel?: string;
  /** Current simulation state — controls border color */
  state?: SimulationResult;
  /** Whether the node is selected */
  selected?: boolean;
  /** Width in px */
  width?: number;
  /** Height in px */
  height?: number;
  /** Children render the SVG symbol */
  children: ReactNode;
  /** Additional className for the wrapper div */
  className?: string;
}

const STATE_STYLES: Record<
  SimulationResult,
  { border: string; glow: string; labelColor: string }
> = {
  IDLE: {
    border: "border-neon-purple/60",
    glow: "shadow-neon-purple",
    labelColor: "text-neon-purple",
  },
  VALID_CIRCUIT: {
    border: "border-neon-green/80",
    glow: "shadow-neon-green",
    labelColor: "text-neon-green",
  },
  OPEN_CIRCUIT: {
    border: "border-neon-yellow/80",
    glow: "shadow-neon-yellow",
    labelColor: "text-neon-yellow",
  },
  SHORT_CIRCUIT: {
    border: "border-neon-red",
    glow: "shadow-neon-red",
    labelColor: "text-neon-red",
  },
};

/**
 * NodeWrapper
 *
 * Wraps every circuit node with consistent chrome:
 *   - Dark background with rounded corners
 *   - Neon border that changes color based on simulation state
 *   - Monospace label below the symbol
 *   - Subtle glow on selection
 *   - Hover lift effect
 */
export const NodeWrapper = memo(function NodeWrapper({
  label,
  sublabel,
  state = "IDLE",
  selected = false,
  width = 80,
  height = 80,
  children,
  className = "",
}: NodeWrapperProps) {
  const styles = STATE_STYLES[state];

  return (
    <div
      className={`
        group relative flex flex-col items-center justify-center
        rounded-md border-2 bg-bg-card/80 backdrop-blur-sm
        transition-all duration-200 no-select
        ${styles.border}
        ${selected ? styles.glow : ""}
        hover:border-neon-cyan/80 hover:shadow-neon-cyan
        ${className}
      `}
      style={{
        width,
        height,
        transition: "all 0.2s ease",
      }}
    >
      {/* SVG symbol area */}
      <div className="flex flex-1 items-center justify-center">{children}</div>

      {/* Labels */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
        <div
          className={`font-mono text-[9px] font-bold uppercase tracking-widest ${styles.labelColor}`}
          style={{
            textShadow:
              state === "VALID_CIRCUIT"
                ? "0 0 4px rgba(34, 197, 94, 0.6)"
                : state === "SHORT_CIRCUIT"
                ? "0 0 4px rgba(239, 68, 68, 0.6)"
                : "none",
          }}
        >
          {label}
        </div>
        {sublabel && (
          <div className="font-mono text-[8px] uppercase tracking-widest text-text-muted">
            {sublabel}
          </div>
        )}
      </div>

      {/* Top-right indicator dot */}
      <div
        className={`absolute -right-1 -top-1 h-2 w-2 rounded-full border border-bg-primary ${
          state === "VALID_CIRCUIT"
            ? "bg-neon-green shadow-neon-green"
            : state === "SHORT_CIRCUIT"
            ? "animate-pulse bg-neon-red shadow-neon-red"
            : state === "OPEN_CIRCUIT"
            ? "bg-neon-yellow"
            : "bg-neon-purple/60"
        }`}
      />
    </div>
  );
});