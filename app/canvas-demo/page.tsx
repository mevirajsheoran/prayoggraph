"use client";

import { useState, useCallback } from "react";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from "reactflow";
import { AmbientBackground, Navbar } from "@/components/ui";
import { Canvas } from "@/components/canvas/Canvas";
import { toShortState, type SimulationResult } from "@/lib/types";

const INITIAL_NODES: Node[] = [
  {
    id: "bat",
    type: "battery",
    position: { x: 100, y: 200 },
    data: { kind: "battery" },
  },
  {
    id: "sw",
    type: "switch",
    position: { x: 280, y: 200 },
    data: { kind: "switch", isOpen: false },
  },
  {
    id: "bulb",
    type: "bulb",
    position: { x: 460, y: 200 },
    data: { kind: "bulb" },
  },
  {
    id: "res",
    type: "locked",
    position: { x: 100, y: 380 },
    data: { kind: "resistor" },
  },
];

const INITIAL_EDGES: Edge[] = [
  {
    id: "e1",
    source: "bat",
    target: "sw",
    sourceHandle: "positive",
    targetHandle: "in",
  },
  {
    id: "e2",
    source: "sw",
    target: "bulb",
    sourceHandle: "out",
    targetHandle: "in",
  },
  {
    id: "e3",
    source: "bulb",
    target: "bat",
    sourceHandle: "out",
    targetHandle: "negative",
  },
];

export default function CanvasDemoPage() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [simState, setSimState] = useState<SimulationResult>("VALID_CIRCUIT");
  const [activeEdges, setActiveEdges] = useState<string[]>(["e1", "e2", "e3"]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...connection,
          type: "wire",
          data: {
            sourceTerminal: connection.sourceHandle as any,
            targetTerminal: connection.targetHandle as any,
          },
        },
        eds
      )
    );
  }, []);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.type === "switch") {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? { ...n, data: { ...n.data, isOpen: !n.data.isOpen } }
              : n
          )
        );
      }
    },
    []
  );

  const onSimulate = useCallback(() => {
    setSimState("VALID_CIRCUIT");
    setActiveEdges(["e1", "e2", "e3"]);
  }, []);

  const onClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSimState("IDLE");
    setActiveEdges([]);
  }, []);

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden">
      <AmbientBackground />
      <Navbar
        viewType="STUDENT VIEW"
        simulationState={toShortState(simState)}
      />

      <div className="relative flex flex-1 overflow-hidden">
        <div className="flex-1">
          <Canvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onSimulate={onSimulate}
            onClear={onClear}
            simulationState={simState}
            activeEdgeIds={activeEdges}
            showMiniMap
          />
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-neon-cyan/40 bg-bg-card/90 px-4 py-2 backdrop-blur-md">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
          ✓ Click the switch to toggle • Drag handles to wire • Run Simulation in Part 6
        </p>
      </div>
    </main>
  );
}