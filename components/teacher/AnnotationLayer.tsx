"use client";

import { memo, useEffect, useRef, useState, useCallback } from "react";

interface Point {
  x: number;
  y: number;
}

interface AnnotationLayerProps {
  width: number;
  height: number;
  isDrawing: boolean;
  color?: string;
  onDrawStart?: () => void;
  onDrawPoint?: (point: Point) => void;
  onDrawEnd?: () => void;
  /** Externally provided strokes to display */
  strokes?: Array<{ points: Point[]; color: string; timestamp: number }>;
}

/**
 * AnnotationLayer
 *
 * Transparent canvas overlay that captures drawing gestures from the
 * teacher and emits points via WebSocket. Also renders received strokes
 * from the teacher in real-time.
 */
export const AnnotationLayer = memo(function AnnotationLayer({
  width,
  height,
  isDrawing,
  color = "#ef4444",
  onDrawStart,
  onDrawPoint,
  onDrawEnd,
  strokes = [],
}: AnnotationLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const isDrawingRef = useRef(false);

  // Redraw all strokes
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const drawStroke = (points: Point[], strokeColor: string) => {
      if (points.length === 0) return;
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 8;

      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    };

    // Draw historical strokes
    for (const stroke of strokes) {
      drawStroke(stroke.points, stroke.color);
    }

    // Draw current in-progress stroke
    if (currentStroke.length > 0) {
      drawStroke(currentStroke, color);
    }
  }, [strokes, currentStroke, color, width, height]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const getPoint = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    isDrawingRef.current = true;
    const point = getPoint(e);
    setCurrentStroke([point]);
    onDrawStart?.();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !isDrawing) return;
    const point = getPoint(e);
    setCurrentStroke((prev) => [...prev, point]);
    onDrawPoint?.(point);
  };

  const handleMouseUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    setCurrentStroke([]);
    onDrawEnd?.();
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`absolute inset-0 ${isDrawing ? "cursor-crosshair" : "pointer-events-none"}`}
      style={{
        mixBlendMode: "screen",
      }}
    />
  );
});