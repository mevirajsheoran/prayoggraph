"use client";

import { useCallback, DragEvent } from "react";
import { COMPONENT_CATALOG, DND_MIME_TYPE, SPAWN_OFFSET } from "@/lib/constants";
import type { ComponentMeta } from "@/lib/constants";
import type { Node } from "reactflow";

export interface DragData {
  meta: ComponentMeta;
  /** Mouse position at drag start (for screen-to-canvas conversion) */
  clientX: number;
  clientY: number;
}

/**
 * useDragAndDrop
 *
 * Provides drag handlers for palette cards. The card sets data on the
 * drag event with the component metadata; the canvas listens for
 * `onDrop` to spawn a new node at the cursor position.
 *
 * Usage in palette:
 *   const { onDragStart } = useDragSource();
 *   <div draggable onDragStart={(e) => onDragStart(e, meta)} />
 *
 * Usage in canvas:
 *   const { onDragOver, onDrop } = useDropTarget();
 *   <div onDragOver={onDragOver} onDrop={(e) => onDrop(e, reactFlowInstance, addNode)} />
 */
export function useDragSource() {
  const onDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>, meta: ComponentMeta) => {
      if (!meta.unlocked) {
        event.preventDefault();
        return;
      }

      const data: DragData = {
        meta,
        clientX: event.clientX,
        clientY: event.clientY,
      };

      event.dataTransfer.setData(DND_MIME_TYPE, JSON.stringify(data));
      event.dataTransfer.effectAllowed = "move";

      // Custom drag image — a small ghost with the component label
      const ghost = document.createElement("div");
      ghost.className =
        "fixed top-[-1000px] left-[-1000px] rounded border-2 border-neon-cyan bg-bg-card px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest text-neon-cyan shadow-neon-cyan";
      ghost.textContent = `+ ${meta.label}`;
      document.body.appendChild(ghost);
      event.dataTransfer.setDragImage(ghost, 40, 20);
      // Clean up ghost after drag ends
      setTimeout(() => document.body.removeChild(ghost), 0);
    },
    []
  );

  return { onDragStart };
}

/* ─── Drop target logic (called from Canvas) ─── */

export function parseDragData(
  event: DragEvent<HTMLDivElement>
): DragData | null {
  try {
    const raw = event.dataTransfer.getData(DND_MIME_TYPE);
    if (!raw) return null;
    return JSON.parse(raw) as DragData;
  } catch {
    return null;
  }
}

/**
 * Build a new Node from a dropped component.
 * Position is converted from screen coordinates to React Flow canvas coordinates.
 */
export function buildNodeFromDrop(
  data: DragData,
  canvasRect: DOMRect,
  reactFlowBounds: DOMRect | null,
  existingNodes: Node[]
): Node | null {
  const meta = data.meta;
  if (!meta.unlocked) return null;

  // Calculate position in canvas coordinates
  let position = { x: 280, y: 200 };

  if (reactFlowBounds) {
    position = {
      x: data.clientX - reactFlowBounds.left - SPAWN_OFFSET.x / 2,
      y: data.clientY - reactFlowBounds.top - SPAWN_OFFSET.y / 2,
    };
  }

  // Avoid stacking: offset each new node slightly if dropped at same spot
  const stackOffset = countNodesAtPosition(existingNodes, position) * 24;
  position.x += stackOffset;
  position.y += stackOffset;

  return {
    id: `${meta.kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: meta.nodeType,
    position,
    data: {
      kind: meta.kind,
      isOpen: meta.kind === "switch" ? false : undefined,
    },
  };
}

function countNodesAtPosition(nodes: Node[], pos: { x: number; y: number }): number {
  const threshold = 20;
  return nodes.filter(
    (n) =>
      Math.abs(n.position.x - pos.x) < threshold &&
      Math.abs(n.position.y - pos.y) < threshold
  ).length;
}

/* ─── Re-export catalog for convenience ─── */
export { COMPONENT_CATALOG };