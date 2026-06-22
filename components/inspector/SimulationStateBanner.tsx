"use client";

import { memo, useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Circle } from "lucide-react";
import type { SimulationResult } from "@/lib/types";

interface SimulationStateBannerProps {
  result: SimulationResult;
  message?: string;
}

const STATE_CONFIG = {
  IDLE: {
    label: "READY",
    sublabel: "Awaiting simulation",
    icon: Circle,
    color: "text-text-secondary",
    border: "border-text-muted/40",
    bg: "bg-bg-card",
    glow: "",
  },
  VALID_CIRCUIT: {
    label: "VALID CIRCUIT",
    sublabel: "Current flows through bulb",
    icon: CheckCircle2,
    color: "text-neon-green",
    border: "border-neon-green/60",
    bg: "bg-neon-green/10",
    glow: "shadow-neon-green",
  },
  OPEN_CIRCUIT: {
    label: "OPEN CIRCUIT",
    sublabel: "No current can flow",
    icon: AlertTriangle,
    color: "text-neon-yellow",
    border: "border-neon-yellow/60",
    bg: "bg-neon-yellow/10",
    glow: "shadow-neon-yellow",
  },
  SHORT_CIRCUIT: {
    label: "SHORT CIRCUIT",
    sublabel: "DANGER: Excessive current",
    icon: XCircle,
    color: "text-neon-red",
    border: "border-neon-red/80",
    bg: "bg-neon-red/10",
    glow: "shadow-neon-red",
  },
} as const;

/**
 * SimulationStateBanner
 *
 * Large, prominent badge showing the current circuit state.
 * Includes a fade-in-scale animation when the state changes
 * (achieved by keying on result name).
 */
export const SimulationStateBanner = memo(function SimulationStateBanner({
  result,
  message,
}: SimulationStateBannerProps) {
  const config = STATE_CONFIG[result];
  const Icon = config.icon;

  return (
    <div
      key={result}
      className={`
        animate-fade-in-scale relative overflow-hidden rounded-lg border-2 p-4
        backdrop-blur-md transition-all duration-300
        ${config.border} ${config.bg} ${config.glow}
      `}
    >
      {/* Background scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)",
        }}
      />

      <div className="relative flex items-start gap-3">
        <Icon
          className={`h-6 w-6 shrink-0 ${config.color} ${
            result === "SHORT_CIRCUIT" ? "animate-pulse" : ""
          }`}
          style={{
            filter:
              result === "VALID_CIRCUIT"
                ? "drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))"
                : result === "SHORT_CIRCUIT"
                ? "drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))"
                : result === "OPEN_CIRCUIT"
                ? "drop-shadow(0 0 8px rgba(234, 179, 8, 0.6))"
                : undefined,
          }}
        />
        <div className="flex-1">
          <div
            className={`font-mono text-base font-bold uppercase tracking-widest ${config.color}`}
            style={{
              textShadow:
                result === "VALID_CIRCUIT"
                  ? "0 0 10px rgba(34, 197, 94, 0.6)"
                  : result === "SHORT_CIRCUIT"
                  ? "0 0 10px rgba(239, 68, 68, 0.6)"
                  : undefined,
            }}
          >
            {config.label}
          </div>
          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-text-secondary">
            {config.sublabel}
          </div>
          {message && (
            <p className="mt-2 font-mono text-[10px] leading-relaxed text-text-secondary">
              {message.length > 140 ? message.slice(0, 140) + "…" : message}
            </p>
          )}
        </div>
      </div>

      {/* Corner pulse indicator */}
      {result !== "IDLE" && (
        <div
          className={`absolute right-3 top-3 h-2 w-2 animate-pulse rounded-full ${
            result === "VALID_CIRCUIT"
              ? "bg-neon-green shadow-neon-green"
              : result === "OPEN_CIRCUIT"
              ? "bg-neon-yellow"
              : "bg-neon-red shadow-neon-red"
          }`}
        />
      )}
    </div>
  );
});