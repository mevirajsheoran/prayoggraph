"use client";

import { memo } from "react";

/**
 * AmbientBackground
 * Two large blurred glow circles that create the cyberpunk
 * laboratory atmosphere without distracting from the canvas.
 */
export const AmbientBackground = memo(function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Cyan glow - top left */}
      <div
        className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full animate-ambient-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 255, 255, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Purple glow - bottom right */}
      <div
        className="absolute -bottom-40 -right-40 h-[700px] w-[700px] rounded-full animate-ambient-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
          animationDelay: "2s",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
});