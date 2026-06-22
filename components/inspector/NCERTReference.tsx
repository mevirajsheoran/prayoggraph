"use client";

import { memo } from "react";
import { BookOpen, GraduationCap, AlertTriangle } from "lucide-react";
import type { NCERTExplanation } from "@/lib/types";

interface NCERTReferenceProps {
  explanation: NCERTExplanation | null;
  /** Optional AI enhancement text */
  enhancement?: string | null;
}

/**
 * NCERTReference
 *
 * Displays the curriculum-aligned explanation for the current simulation state.
 * Hardcoded from NCERT Class 10 Chapter 12 (Electricity) — always available.
 * Optionally shows a Gemini-enhanced personalized explanation below.
 */
export const NCERTReference = memo(function NCERTReference({
  explanation,
  enhancement,
}: NCERTReferenceProps) {
  if (!explanation) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-card/40 p-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-text-muted" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-muted">
            NCERT Reference
          </span>
        </div>
        <p className="mt-2 font-mono text-[10px] leading-relaxed text-text-muted">
          Run a simulation to see curriculum-aligned explanation.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-blue-400" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-400">
            NCERT Reference
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-blue-400/30 bg-blue-400/10 px-2 py-0.5">
          <GraduationCap className="h-2.5 w-2.5 text-blue-400" />
          <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-blue-400">
            Class 10
          </span>
        </div>
      </div>

      {/* Chapter */}
      <div className="mt-2 font-mono text-[9px] uppercase tracking-widest text-blue-300/80">
        {explanation.chapter}
      </div>

      {/* Topic */}
      <div className="mt-0.5 font-mono text-[11px] font-bold uppercase tracking-wide text-blue-300">
        {explanation.topic}
      </div>

      {/* Explanation */}
      <p className="mt-2 font-sans text-[11px] leading-relaxed text-text-primary">
        {explanation.explanation}
      </p>

      {/* Safety warning if present */}
      {explanation.warning && (
        <div className="mt-2 flex items-start gap-2 rounded border border-neon-red/40 bg-neon-red/10 p-2">
          <AlertTriangle className="h-3 w-3 shrink-0 text-neon-red" />
          <p className="font-mono text-[9px] leading-relaxed text-neon-red">
            {explanation.warning}
          </p>
        </div>
      )}

      {/* AI enhancement (if available) */}
      {enhancement && (
        <div className="mt-3 border-t border-blue-400/20 pt-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-neon-purple">
              ✦ AI Insight
            </span>
          </div>
          <p className="mt-1 font-sans text-[11px] italic leading-relaxed text-neon-purple/90">
            {enhancement}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-blue-400/20 pt-2 font-mono text-[8px] uppercase tracking-widest text-blue-300/60">
        <span>{explanation.classLevel}</span>
        <span>NCERT • CBSE</span>
      </div>
    </div>
  );
});