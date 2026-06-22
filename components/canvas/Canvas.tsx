"use client";

import { memo, useCallback, useMemo, useRef } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type NodeMouseHandler,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
} from "reactflow";

import "reactflow/dist/style.css";
import { nodeTypes } from "./nodes";
import { edgeTypes } from "./edges";
import { CanvasHeader } from "./CanvasHeader";
import { GRID, COLORS } from "@/lib/constants";
import type { SimulationResult } from "@/lib/types";
import { parseDragData, buildNodeFromDrop } from "@/lib/hooks";

interface CanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick?: NodeMouseHandler;
  onSimulate: () => void;
  onClear: () => void;
  simulationState?: SimulationResult;
  activeEdgeIds?: string[];
  isSimulating?: boolean;
  readOnly?: boolean;
  showMiniMap?: boolean;
  /** Called when a new node is dropped from the palette */
  onNodeDrop?: (node: Node) => void;
}

/**
 * Inner Canvas with access to ReactFlow instance for coordinate conversion.
 */
const CanvasInner = memo(function CanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onSimulate,
  onClear,
  simulationState,
  activeEdgeIds = [],
  isSimulating = false,
  readOnly = false,
  showMiniMap = false,
  onNodeDrop,
}: CanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const styledEdges = useMemo(() => {
    return edges.map((edge) => ({
      ...edge,
      animated: activeEdgeIds.includes(edge.id),
      data: {
        ...edge.data,
        isActive: activeEdgeIds.includes(edge.id),
      },
      type: "wire",
    }));
  }, [edges, activeEdgeIds]);

  const handleConnect: OnConnect = useCallback(
    (connection) => {
      onConnect(connection);
    },
    [onConnect]
  );

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      if (readOnly) return;
      onNodesChange(changes);
    },
    [onNodesChange, readOnly]
  );

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      if (readOnly) return;
      onEdgesChange(changes);
    },
    [onEdgesChange, readOnly]
  );

  // Drop handler — spawns a new node at the cursor position
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const dragData = parseDragData(event);
      if (!dragData || !dragData.meta.unlocked) return;

      // Convert screen coords to canvas coords
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Build the new node
      const newNode: Node = {
        id: `${dragData.meta.kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: dragData.meta.nodeType,
        position,
        data: {
          kind: dragData.meta.kind,
          isOpen: dragData.meta.kind === "switch" ? false : undefined,
        },
      };

      // Stack-offset to avoid stacking on existing nodes
      const stackOffset = nodes.filter(
        (n) =>
          Math.abs(n.position.x - position.x) < 20 &&
          Math.abs(n.position.y - position.y) < 20
      ).length * 24;
      newNode.position.x += stackOffset;
      newNode.position.y += stackOffset;

      if (onNodeDrop) {
        onNodeDrop(newNode);
      } else {
        // Fallback: add directly via onNodesChange
        onNodesChange([
          {
            type: "add",
            item: newNode,
          } as any,
        ]);
      }
    },
    [nodes, screenToFlowPosition, onNodeDrop, onNodesChange]
  );

  return (
    <div
      ref={wrapperRef}
      className="relative h-full w-full overflow-hidden bg-bg-primary"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={[GRID.size, GRID.size]}
        connectionRadius={24}
        defaultEdgeOptions={{
          type: "wire",
          style: { stroke: COLORS.neonCyan, strokeWidth: 2 },
        }}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1.2 }}
        minZoom={0.3}
        maxZoom={2}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={GRID.backgroundDotSpacing}
          size={GRID.backgroundDotSize}
          color={GRID.backgroundDotColor}
        />
        <Controls
          position="bottom-left"
          showInteractive={false}
          className="!bg-bg-card/80 !border-border-default"
        />
        {showMiniMap && (
          <MiniMap
            position="bottom-right"
            maskColor="rgba(3, 7, 18, 0.85)"
            nodeColor={(node) => {
              switch (node.type) {
                case "battery":
                  return COLORS.neonCyan;
                case "bulb":
                  return COLORS.neonGreen;
                case "switch":
                  return COLORS.neonPurple;
                default:
                  return COLORS.neonYellow;
              }
            }}
            pannable
            zoomable
          />
        )}
      </ReactFlow>

      {!readOnly && (
        <CanvasHeader
          onSimulate={onSimulate}
          onClear={onClear}
          isSimulating={isSimulating}
          nodeCount={nodes.length}
          edgeCount={edges.length}
        />
      )}

      {nodes.length === 0 && !readOnly && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="max-w-md space-y-3 text-center">
            <div className="font-mono text-3xl font-bold uppercase tracking-widest text-neon-cyan text-glow-cyan opacity-40">
              ◌ EMPTY CIRCUIT ◌
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
              Drag components from the left palette onto the canvas to begin
            </p>
          </div>
        </div>
      )}

      {simulationState && simulationState !== "IDLE" && (
        <div className="absolute bottom-4 right-4 z-10">
          <div
            className={`rounded-lg border px-3 py-2 backdrop-blur-md ${
              simulationState === "VALID_CIRCUIT"
                ? "border-neon-green/60 bg-neon-green/10"
                : simulationState === "OPEN_CIRCUIT"
                ? "border-neon-yellow/60 bg-neon-yellow/10"
                : "border-neon-red/60 bg-neon-red/10"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 animate-pulse rounded-full ${
                  simulationState === "VALID_CIRCUIT"
                    ? "bg-neon-green shadow-neon-green"
                    : simulationState === "OPEN_CIRCUIT"
                    ? "bg-neon-yellow"
                    : "bg-neon-red"
                }`}
              />
              <span
                className={`font-mono text-[10px] font-bold uppercase tracking-widest ${
                  simulationState === "VALID_CIRCUIT"
                    ? "text-neon-green"
                    : simulationState === "OPEN_CIRCUIT"
                    ? "text-neon-yellow"
                    : "text-neon-red"
                }`}
              >
                {simulationState.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

/**
 * Exported Canvas — wraps Inner in ReactFlowProvider so we can use useReactFlow
 * for screen-to-flow coordinate conversion.
 */
export const Canvas = memo(function Canvas(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
});