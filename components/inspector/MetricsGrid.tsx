"use client";

import { memo } from "react";
import { Box, GitBranch, Route, Cpu } from "lucide-react";
import { MetricCard } from "@/components/ui";
import type { SimulationResult } from "@/lib/types";

interface MetricsGridProps {
  nodeCount: number;
  edgeCount: number;
  activePaths: number;
  simulationState: SimulationResult;
}

const STATE_LABEL: Record<SimulationResult, string> = {
  IDLE: "READY",
  VALID_CIRCUIT: "VALID",
  OPEN_CIRCUIT: "OPEN",
  SHORT_CIRCUIT: "SHORT",
};

const STATE_ACCENT: Record<SimulationResult, "cyan" | "green" | "yellow" | "red"> = {
  IDLE: "cyan",
  VALID_CIRCUIT: "green",
  OPEN_CIRCUIT: "yellow",
  SHORT_CIRCUIT: "red",
};

export const MetricsGrid = memo(function MetricsGrid({
  nodeCount,
  edgeCount,
  activePaths,
  simulationState,
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <MetricCard
        label="Nodes"
        value={nodeCount}
        icon={<Box className="h-3.5 w-3.5" />}
        accent="cyan"
      />
      <MetricCard
        label="Edges"
        value={edgeCount}
        icon={<GitBranch className="h-3.5 w-3.5" />}
        accent="purple"
      />
      <MetricCard
        label="Active Paths"
        value={activePaths}
        icon={<Route className="h-3.5 w-3.5" />}
        accent="green"
      />
      <MetricCard
        label="State"
        value={STATE_LABEL[simulationState]}
        icon={<Cpu className="h-3.5 w-3.5" />}
        accent={STATE_ACCENT[simulationState]}
      />
    </div>
  );
});