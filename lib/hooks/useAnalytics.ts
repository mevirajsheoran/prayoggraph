"use client";

import { useCallback, useState } from "react";
import type { SimulationResult, MisconceptionCounters } from "@/lib/types";

const INITIAL_COUNTERS: MisconceptionCounters = {
  shortCircuitAttempts: 0,
  openCircuitAttempts: 0,
  validCircuitSuccesses: 0,
  totalAttempts: 0,
};

export interface UseAnalyticsReturn {
  counters: MisconceptionCounters;
  masteryScore: number;
  lastResult: SimulationResult;
  recordAttempt: (result: SimulationResult) => void;
  reset: () => void;
}

/**
 * useAnalytics
 *
 * Tracks per-student misconception counters and computes a Mastery Score.
 *
 * Mastery Score formula:
 *   score = (validSuccesses / totalAttempts) * 100
 *
 * Returns:
 *   - counters:  raw attempt counts by result type
 *   - masteryScore:  0-100 integer percentage
 *   - lastResult:    most recent SimulationResult
 *   - recordAttempt: function to register a new simulation result
 *   - reset:         function to clear all counters (e.g. on disconnect)
 */
export function useAnalytics(): UseAnalyticsReturn {
  const [counters, setCounters] = useState<MisconceptionCounters>(INITIAL_COUNTERS);
  const [lastResult, setLastResult] = useState<SimulationResult>("IDLE");

  const recordAttempt = useCallback((result: SimulationResult) => {
    setLastResult(result);
    setCounters((prev) => {
      const next = { ...prev, totalAttempts: prev.totalAttempts + 1 };
      switch (result) {
        case "VALID_CIRCUIT":
          next.validCircuitSuccesses = prev.validCircuitSuccesses + 1;
          break;
        case "OPEN_CIRCUIT":
          next.openCircuitAttempts = prev.openCircuitAttempts + 1;
          break;
        case "SHORT_CIRCUIT":
          next.shortCircuitAttempts = prev.shortCircuitAttempts + 1;
          break;
        case "IDLE":
          // No counter change for idle
          next.totalAttempts = prev.totalAttempts;
          break;
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setCounters(INITIAL_COUNTERS);
    setLastResult("IDLE");
  }, []);

  const masteryScore =
    counters.totalAttempts === 0
      ? 0
      : Math.round((counters.validCircuitSuccesses / counters.totalAttempts) * 100);

  return {
    counters,
    masteryScore,
    lastResult,
    recordAttempt,
    reset,
  };
}