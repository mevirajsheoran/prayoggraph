/**
 * Socket.io client singleton.
 *
 * Auto-detects environment:
 *   - Development: connects to localhost:4000
 *   - Production: connects to same domain (Vercel)
 */

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let connecting = false;

function getSocketUrl(): string {
  // Browser environment check
  if (typeof window === "undefined") {
    return "http://localhost:4000";
  }

  // Production: use same origin (Vercel deployment)
  if (process.env.NODE_ENV === "production") {
    return window.location.origin;
  }

  // Development: local server
  return "http://localhost:4000";
}

function getSocketPath(): string {
  // Vercel deployment uses /api/socket path
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    return "/api/socket";
  }
  return "/socket.io"; // Default for local server
}

export function getSocket(): Socket {
  if (socket && socket.connected) return socket;
  if (socket && !socket.connected) return socket;

  if (!socket && !connecting) {
    connecting = true;
    const url = getSocketUrl();
    const path = getSocketPath();

    console.log(`[Socket] Connecting to ${url} (path: ${path})`);

    socket = io(url, {
      path,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 15000,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket?.id);
      connecting = false;
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.warn("[Socket] Connection error:", err.message);
      connecting = false;
    });
  }

  return socket!;
}

export function connectSocket(): Promise<Socket> {
  const s = getSocket();

  if (s.connected) return Promise.resolve(s);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Socket connection timeout"));
    }, 15000);

    s.once("connect", () => {
      clearTimeout(timeout);
      resolve(s);
    });

    s.once("connect_error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    connecting = false;
  }
}

export const SERVER_EVENTS = {
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
  ERROR: "error",
} as const;