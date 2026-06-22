"use client";

import { memo } from "react";
import { InspectorHeader } from "./InspectorHeader";
import { MetricsGrid } from "./MetricsGrid";
import { SimulationStateBanner } from "./SimulationStateBanner";
import { NCERTReference } from "./NCERTReference";
import { LearningAnalytics } from "./LearningAnalytics";
import { PhysicsInference } from "./PhysicsInference";
import type { SimulationResult, MisconceptionCounters, NCERTExplanation } from "@/lib/types";

interface InspectorPanelProps {
  nodeCount: number;
  edgeCount: number;
  activePaths: number;
  simulationState: SimulationResult;
  engineMessage: string;
  engineComputedAt?: number;
  engineTraversalCount?: number;
  ncertExplanation: NCERTExplanation | null;
  aiEnhancement?: string | null;
  counters: MisconceptionCounters;
  masteryScore: number;
}

export const InspectorPanel = memo(function InspectorPanel({
  nodeCount,
  edgeCount,
  activePaths,
  simulationState,
  engineMessage,
  engineComputedAt,
  engineTraversalCount,
  ncertExplanation,
  aiEnhancement,
  counters,
  masteryScore,
}: InspectorPanelProps) {
  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border-default bg-bg-secondary/60 backdrop-blur-md">
      <InspectorHeader />

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {/* Metrics */}
        <MetricsGrid
          nodeCount={nodeCount}
          edgeCount={edgeCount}
          activePaths={activePaths}
          simulationState={simulationState}
        />

        {/* State Banner */}
        <SimulationStateBanner result={simulationState} message={engineMessage} />

        {/* NCERT Reference */}
        <NCERTReference
          explanation={ncertExplanation}
          enhancement={aiEnhancement}
        />

        {/* Engine Inference */}
        <PhysicsInference
          message={engineMessage}
          computedAt={engineComputedAt}
          traversalCount={engineTraversalCount}
        />

        {/* Analytics */}
        <LearningAnalytics counters={counters} masteryScore={masteryScore} />
      </div>
    </aside>
  );
});