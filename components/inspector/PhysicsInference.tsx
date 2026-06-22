"use client";

import { memo } from "react";
import { Brain, Zap } from "lucide-react";

interface PhysicsInferenceProps {
  message: string;
  computedAt?: number;
  traversalCount?: number;
  isDeterministic?: boolean;
}

/**
 * PhysicsInference
 *
 * Displays the deterministic physics engine's internal explanation.
 * Shows:
 *   - The message returned by evaluateCircuit()
 *   - Computation time (always <16ms)
 *   - Number of graph edges traversed
 *   - Determinism badge (proof of mathematical correctness)
 */
export const PhysicsInference = memo(function PhysicsInference({
  message,
  computedAt,
  traversalCount,
  isDeterministic = true,
}: PhysicsInferenceProps) {
  return (
    <div className="rounded-lg border border-border-default bg-bg-card/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 text-neon-purple" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neon-purple">
            Engine Inference
          </span>
        </div>
        <span className="rounded border border-neon-purple/30 bg-neon-purple/10 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest text-neon-purple">
          DFS
        </span>
      </div>

      <p className="font-mono text-[10px] leading-relaxed text-text-secondary">
        {message || "No inference available. Run a simulation."}
      </p>

      {/* Performance badges */}
      {(typeof computedAt === "number" || typeof traversalCount === "number") && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-border-default pt-2">
          {typeof computedAt === "number" && (
            <span className="inline-flex items-center gap-1 rounded border border-neon-green/30 bg-neon-green/5 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest text-neon-green">
              <Zap className="h-2.5 w-2.5" />
              {computedAt.toFixed(2)}ms
            </span>
          )}
          {typeof traversalCount === "number" && (
            <span className="rounded border border-text-muted/30 bg-bg-elevated px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest text-text-secondary">
              ◐ {traversalCount} edges
            </span>
          )}
          {isDeterministic && (
            <span className="rounded border border-neon-cyan/30 bg-neon-cyan/5 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest text-neon-cyan">
              ✓ Deterministic
            </span>
          )}
        </div>
      )}
    </div>
  );
});