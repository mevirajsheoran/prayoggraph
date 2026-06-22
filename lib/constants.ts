/**
 * Application-wide constants for PrayogGraph
 */

import type { ComponentKind } from "./types";

export const APP_CONFIG = {
  name: "PrayogGraph",
  tagline: "Virtual Physics Lab",
  version: "2.0.0",
  hackathon: "Bharat Academix CodeQuest 2026",
  team: "Viraj Sheoran",
} as const;

export const ROUTES = {
  student: "/",
  teacher: "/teacher",
} as const;

export const GRID = {
  size: 16,
  backgroundDotSize: 1.5,
  backgroundDotSpacing: 24,
  backgroundDotColor: "#1e3a8a",
} as const;

export const COLORS = {
  bgPrimary: "#030712",
  bgSecondary: "#0a0f1e",
  bgCard: "#111827",
  neonCyan: "#00ffff",
  neonPurple: "#a855f7",
  neonGreen: "#22c55e",
  neonRed: "#ef4444",
  neonYellow: "#eab308",
} as const;

export const ANIMATION = {
  bulbPulsePeriod: 1500,
  shortCircuitFlashPeriod: 200,
  currentFlowPeriod: 1200,
  panelTransitionMs: 300,
} as const;

export const PHYSICS = {
  simulationTimeoutMs: 16,
  geminiTimeoutMs: 2000,
  misconceptionThreshold: 0.6,
} as const;

export const WEBSOCKET = {
  defaultRoom: "PHYS-10A",
  events: {
    JOIN_ROOM: "join_room",
    STUDENT_JOINED: "student_joined",
    STUDENT_DISCONNECTED: "student_disconnected",
    CIRCUIT_UPDATE: "circuit_update",
    ANNOTATION_START: "annotation_start",
    ANNOTATION_DRAW: "annotation_draw",
    ANNOTATION_END: "annotation_end",
    ANNOTATION_CLEAR: "annotation_clear",
    REQUEST_STATE: "request_state",
    FULL_STATE: "full_state",
  },
} as const;

export const SOCKET_URLS = {
  development: "http://localhost:4000",
  production: "",  // ← Empty = same domain (Vercel)
} as const;

/* ─── Component Palette Metadata ─── */

export interface ComponentMeta {
  kind: ComponentKind;
  label: string;
  description: string;
  nodeType: "battery" | "bulb" | "switch" | "locked";
  accent: "cyan" | "purple" | "green" | "yellow" | "red";
  symbol: "battery" | "bulb" | "switch" | "resistor" | "capacitor" | "ammeter" | "voltmeter";
  unlocked: boolean;
}

export const COMPONENT_CATALOG: ComponentMeta[] = [
  { kind: "battery", label: "Battery", description: "EMF source", nodeType: "battery", accent: "cyan", symbol: "battery", unlocked: true },
  { kind: "switch", label: "Switch", description: "Open / close", nodeType: "switch", accent: "purple", symbol: "switch", unlocked: true },
  { kind: "bulb", label: "Bulb", description: "Lamp / load", nodeType: "bulb", accent: "green", symbol: "bulb", unlocked: true },
  { kind: "resistor", label: "Resistor", description: "Opposition", nodeType: "locked", accent: "yellow", symbol: "resistor", unlocked: false },
  { kind: "capacitor", label: "Capacitor", description: "Charge store", nodeType: "locked", accent: "yellow", symbol: "capacitor", unlocked: false },
  { kind: "ammeter", label: "Ammeter", description: "Current (A)", nodeType: "locked", accent: "yellow", symbol: "ammeter", unlocked: false },
  { kind: "voltmeter", label: "Voltmeter", description: "Voltage (V)", nodeType: "locked", accent: "yellow", symbol: "voltmeter", unlocked: false },
];

export function getActiveComponents(): ComponentMeta[] {
  return COMPONENT_CATALOG.filter((c) => c.unlocked);
}

export function getLockedComponents(): ComponentMeta[] {
  return COMPONENT_CATALOG.filter((c) => !c.unlocked);
}

export const DND_MIME_TYPE = "application/x-prayoggraph-component";

export const SPAWN_OFFSET = {
  x: 280,
  y: 200,
};