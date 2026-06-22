"use client";

import { memo } from "react";
import { Play, Trash2, Cpu } from "lucide-react";
import { Button } from "@/components/ui";

interface CanvasHeaderProps {
  onSimulate: () => void;
  onClear: () => void;
  isSimulating?: boolean;
  nodeCount: number;
  edgeCount: number;
}

export const CanvasHeader = memo(function CanvasHeader({
  onSimulate,
  onClear,
  isSimulating = false,
  nodeCount,
  edgeCount,
}: CanvasHeaderProps) {
  return (
    <div className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-3">
      {/* Component count chip */}
      <div className="flex items-center gap-2 rounded-full border border-border-default bg-bg-card/80 px-3 py-1.5 backdrop-blur-md">
        <Cpu className="h-3 w-3 text-neon-cyan" />
        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-text-secondary">
          {nodeCount}N · {edgeCount}E
        </span>
      </div>

      {/* Run Simulation button (primary) */}
      <Button
        variant="primary"
        size="md"
        onClick={onSimulate}
        loading={isSimulating}
        icon={<Play className="h-3 w-3 fill-current" />}
      >
        Run Simulation
      </Button>

      {/* Clear button (danger) */}
      <Button
        variant="danger"
        size="md"
        onClick={onClear}
        icon={<Trash2 className="h-3 w-3" />}
      >
        Clear
      </Button>
    </div>
  );
});