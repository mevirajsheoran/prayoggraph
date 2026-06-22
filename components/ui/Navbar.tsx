"use client";

import { memo } from "react";
import Link from "next/link";
import { Zap, Wifi, Activity } from "lucide-react";
import type { SimulationStateShort } from "@/lib/types";

interface NavbarProps {
  viewType?: "STUDENT VIEW" | "TEACHER VIEW";
  simulationState?: SimulationStateShort;
  roomCode?: string;
  studentCount?: number;
}

const STATE_CONFIG = {
  VALID: {
    label: "VALID CIRCUIT",
    color: "text-neon-green",
    border: "border-neon-green",
    bg: "bg-neon-green/10",
    dot: "bg-neon-green",
  },
  OPEN: {
    label: "OPEN CIRCUIT",
    color: "text-neon-yellow",
    border: "border-neon-yellow",
    bg: "bg-neon-yellow/10",
    dot: "bg-neon-yellow",
  },
  SHORT: {
    label: "SHORT CIRCUIT",
    color: "text-neon-red",
    border: "border-neon-red",
    bg: "bg-neon-red/10",
    dot: "bg-neon-red",
  },
  IDLE: {
    label: "READY",
    color: "text-text-secondary",
    border: "border-text-muted",
    bg: "bg-bg-card",
    dot: "bg-text-muted",
  },
} as const;

export const Navbar = memo(function Navbar({
  viewType = "STUDENT VIEW",
  simulationState = "IDLE",
  roomCode,
  studentCount,
}: NavbarProps) {
  const state = STATE_CONFIG[simulationState];

  return (
    <header className="relative z-50 h-12 w-full">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-nav-line opacity-60" />

      <div className="relative flex h-full items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link href="/landing" className="flex items-center gap-2 no-select">
            <Zap
              className="h-5 w-5 text-neon-cyan"
              style={{ filter: "drop-shadow(0 0 6px rgba(0, 255, 255, 0.8))" }}
            />
            <div className="flex items-baseline gap-2">
              <span
                className="font-mono text-sm font-bold tracking-widest"
                style={{
                  background: "linear-gradient(135deg, #00ffff 0%, #a855f7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                PRAYOGGRAPH
              </span>
              <span className="hidden h-3 w-px bg-neon-cyan/40 sm:block" />
              <span className="hidden font-mono text-[10px] uppercase tracking-widest text-text-secondary sm:block">
                Series Circuit Lab
              </span>
            </div>
          </Link>

          {roomCode && (
            <div className="ml-4 flex items-center gap-2 rounded border border-neon-cyan/30 bg-neon-cyan/5 px-2 py-1">
              <Wifi className="h-3 w-3 text-neon-cyan" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan">
                ROOM: {roomCode}
              </span>
              {typeof studentCount === "number" && (
                <>
                  <span className="text-text-muted">•</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                    {studentCount} {studentCount === 1 ? "STUDENT" : "STUDENTS"}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Status badges */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1 ${state.border} ${state.bg}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${state.dot} ${
                simulationState !== "IDLE" ? "animate-pulse" : ""
              }`}
            />
            <span
              className={`font-mono text-[9px] font-bold uppercase tracking-widest ${state.color}`}
            >
              {state.label}
            </span>
          </div>

          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1 ${
              viewType === "TEACHER VIEW"
                ? "border-neon-purple/40 bg-neon-purple/10"
                : "border-neon-cyan/40 bg-neon-cyan/10"
            }`}
          >
            <Activity
              className={`h-3 w-3 ${
                viewType === "TEACHER VIEW" ? "text-neon-purple" : "text-neon-cyan"
              }`}
            />
            <span
              className={`font-mono text-[9px] font-bold uppercase tracking-widest ${
                viewType === "TEACHER VIEW" ? "text-neon-purple" : "text-neon-cyan"
              }`}
            >
              {viewType}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
});