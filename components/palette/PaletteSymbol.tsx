"use client";

import { memo } from "react";

interface PaletteSymbolProps {
  symbol: "battery" | "bulb" | "switch" | "resistor" | "capacitor" | "ammeter" | "voltmeter";
  accent: "cyan" | "purple" | "green" | "yellow" | "red";
}

const COLOR_MAP = {
  cyan: "#00ffff",
  purple: "#a855f7",
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
} as const;

export const PaletteSymbol = memo(function PaletteSymbol({
  symbol,
  accent,
}: PaletteSymbolProps) {
  const color = COLOR_MAP[accent];

  switch (symbol) {
    case "battery":
      return (
        <svg width="24" height="20" viewBox="0 0 24 20">
          <line x1="3" y1="6" x2="3" y2="14" stroke={color} strokeWidth="2" />
          <line x1="6" y1="3" x2="6" y2="17" stroke={color} strokeWidth="2" />
          <line x1="9" y1="3" x2="9" y2="17" stroke={color} strokeWidth="2" />
          <line x1="12" y1="3" x2="12" y2="17" stroke={color} strokeWidth="2" />
          <line x1="15" y1="6" x2="15" y2="14" stroke={color} strokeWidth="2" />
          <line x1="18" y1="3" x2="18" y2="17" stroke={color} strokeWidth="2" />
          <line x1="21" y1="3" x2="21" y2="17" stroke={color} strokeWidth="2" />
        </svg>
      );

    case "bulb":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="8"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
          />
          <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="1.5" />
          <line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="1.5" />
        </svg>
      );

    case "switch":
      return (
        <svg width="28" height="16" viewBox="0 0 28 16">
          <circle cx="3" cy="8" r="2.5" fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx="25" cy="8" r="2.5" fill="none" stroke={color} strokeWidth="1.5" />
          <line x1="3" y1="8" x2="24" y2="2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "resistor":
      return (
        <svg width="28" height="16" viewBox="0 0 28 16">
          <line x1="0" y1="8" x2="3" y2="8" stroke={color} strokeWidth="1.5" />
          <polyline
            points="3,8 5,3 8,13 11,3 14,13 17,3 20,13 23,3 25,8"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <line x1="25" y1="8" x2="28" y2="8" stroke={color} strokeWidth="1.5" />
        </svg>
      );

    case "capacitor":
      return (
        <svg width="24" height="20" viewBox="0 0 24 20">
          <line x1="0" y1="10" x2="10" y2="10" stroke={color} strokeWidth="1.5" />
          <line x1="10" y1="3" x2="10" y2="17" stroke={color} strokeWidth="2" />
          <line x1="14" y1="3" x2="14" y2="17" stroke={color} strokeWidth="2" />
          <line x1="14" y1="10" x2="24" y2="10" stroke={color} strokeWidth="1.5" />
        </svg>
      );

    case "ammeter":
      return (
        <svg width="28" height="20" viewBox="0 0 28 20">
          <circle cx="14" cy="10" r="7" fill="none" stroke={color} strokeWidth="1.5" />
          <text x="14" y="13" textAnchor="middle" fill={color} fontSize="9" fontWeight="bold">
            A
          </text>
        </svg>
      );

    case "voltmeter":
      return (
        <svg width="28" height="20" viewBox="0 0 28 20">
          <circle cx="14" cy="10" r="7" fill="none" stroke={color} strokeWidth="1.5" />
          <text x="14" y="13" textAnchor="middle" fill={color} fontSize="9" fontWeight="bold">
            V
          </text>
        </svg>
      );

    default:
      return null;
  }
});