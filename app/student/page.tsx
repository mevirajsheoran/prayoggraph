"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
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
import { ComponentPalette } from "@/components/palette";
import { InspectorPanel } from "@/components/inspector";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { evaluateCircuit, reactFlowToCircuitInput } from "@/lib/engine";
import { getNCERTExplanation, type NCERTExplanation } from "@/lib/rules";
import {
  useJoinRoom,
  useCircuitBroadcast,
  useSocketStatus,
} from "@/lib/socket";
import { toShortState, type SimulationResult, type EngineResult } from "@/lib/types";
import { WEBSOCKET } from "@/lib/constants";

const INITIAL_NODES: Node[] = [
  { id: "bat", type: "battery", position: { x: 200, y: 200 }, data: { kind: "battery" } },
  { id: "sw", type: "switch", position: { x: 420, y: 200 }, data: { kind: "switch", isOpen: false } },
  { id: "bulb", type: "bulb", position: { x: 640, y: 200 }, data: { kind: "bulb" } },
];

const INITIAL_EDGES: Edge[] = [
  { id: "e1", source: "bat", target: "sw", sourceHandle: "positive", targetHandle: "in" },
  { id: "e2", source: "sw", target: "bulb", sourceHandle: "out", targetHandle: "in" },
  { id: "e3", source: "bulb", target: "bat", sourceHandle: "out", targetHandle: "negative" },
];

export default function StudentPage() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [engineResult, setEngineResult] = useState<EngineResult | null>(null);
  const [activeEdges, setActiveEdges] = useState<string[]>([]);
  const [studentId] = useState(() => `student-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
  const [studentName] = useState(() => `Student ${Math.floor(Math.random() * 1000)}`);
  const analytics = useAnalytics();

  // ─── Socket integration ───
  const socketStatus = useSocketStatus();
  const { studentCount } = useJoinRoom(WEBSOCKET.defaultRoom, studentId, studentName, "student");

  // Broadcast payload — built from current state, debounced by the hook
  const broadcastPayload = useMemo(() => {
    if (!engineResult) return null;
    return {
      studentId,
      studentName,
      nodes,
      edges,
      simulation: {
        result: engineResult.result,
        message: engineResult.message,
        activeEdgeIds: engineResult.activeEdgeIds,
        computedAt: engineResult.computedAt,
      },
      timestamp: Date.now(),
    };
  }, [engineResult, nodes, edges, studentId, studentName]);

  useCircuitBroadcast(WEBSOCKET.defaultRoom, studentId, broadcastPayload);

  // ─── Simulation ───
  const runSimulation = useCallback(() => {
    const input = reactFlowToCircuitInput(nodes, edges);
    const result = evaluateCircuit(input);
    setEngineResult(result);
    setActiveEdges(result.activeEdgeIds);
    if (result.result !== "IDLE") {
      analytics.recordAttempt(result.result);
    }
    console.log("[PrayogGraph] Simulation result:", {
      result: result.result,
      computedAt: result.computedAt,
      traversalCount: result.traversalCount,
    });
  }, [nodes, edges, analytics]);

  // ─── React Flow handlers ───
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
            n.id === node.id ? { ...n, data: { ...n.data, isOpen: !n.data.isOpen } } : n
          )
        );
      }
    },
    []
  );

  const onNodeDrop = useCallback((newNode: Node) => {
    setNodes((nds) => [...nds, newNode]);
  }, []);

  const onSimulate = useCallback(() => runSimulation(), [runSimulation]);

  const onClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setEngineResult(null);
    setActiveEdges([]);
    analytics.reset();
  }, [analytics]);

  // ─── Derived state ───
  const simState: SimulationResult = engineResult?.result ?? "IDLE";
  const engineMessage = engineResult?.message ?? "Click Run Simulation to evaluate the circuit.";
  const ncertExplanation: NCERTExplanation | null = engineResult
    ? getNCERTExplanation(engineResult.result)
    : null;
  const activePaths = engineResult?.paths?.length ?? 0;

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden">
      <AmbientBackground />
      <Navbar
        viewType="STUDENT VIEW"
        simulationState={toShortState(simState)}
        roomCode={WEBSOCKET.defaultRoom}
        studentCount={studentCount}
      />

      <div className="relative flex flex-1 overflow-hidden">
        <ComponentPalette />

        <div className="flex-1">
          <Canvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeDrop={onNodeDrop}
            onSimulate={onSimulate}
            onClear={onClear}
            simulationState={simState}
            activeEdgeIds={activeEdges}
            showMiniMap
          />
        </div>

        <InspectorPanel
          nodeCount={nodes.length}
          edgeCount={edges.length}
          activePaths={activePaths}
          simulationState={simState}
          engineMessage={engineMessage}
          engineComputedAt={engineResult?.computedAt}
          engineTraversalCount={engineResult?.traversalCount}
          ncertExplanation={ncertExplanation}
          aiEnhancement={null}
          counters={analytics.counters}
          masteryScore={analytics.masteryScore}
        />
      </div>

      {/* Connection status pill (bottom-right) */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-md ${
          socketStatus === "connected"
            ? "border-neon-green/40 bg-neon-green/10"
            : socketStatus === "connecting"
            ? "border-neon-yellow/40 bg-neon-yellow/10"
            : "border-neon-red/40 bg-neon-red/10"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${
            socketStatus === "connected"
              ? "bg-neon-green animate-pulse"
              : socketStatus === "connecting"
              ? "bg-neon-yellow animate-pulse"
              : "bg-neon-red"
          }`} />
          <span className={`font-mono text-[9px] font-bold uppercase tracking-widest ${
            socketStatus === "connected"
              ? "text-neon-green"
              : socketStatus === "connecting"
              ? "text-neon-yellow"
              : "text-neon-red"
          }`}>
            {socketStatus === "connected" ? "WS Connected" : socketStatus === "connecting" ? "Connecting…" : "Offline"}
          </span>
        </div>
      </div>

      {!engineResult && nodes.length > 0 && (
        <div className="pointer-events-none absolute bottom-20 left-1/2 z-10 -translate-x-1/2 rounded-lg border border-neon-cyan/40 bg-bg-card/90 px-4 py-2 backdrop-blur-md">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan">
            ▶ Click "Run Simulation" to evaluate your circuit
          </p>
        </div>
      )}
    </main>
  );
}