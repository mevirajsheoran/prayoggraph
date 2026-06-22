/**
 * PrayogGraph WebSocket Server
 *
 * Standalone Node.js process that:
 *   1. Serves a health check endpoint on HTTP
 *   2. Manages Socket.io connections
 *   3. Routes events between students and teachers
 *
 * Run:
 *   npm install
 *   npm run dev    (development)
 *   npm start      (production)
 */

import express from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { RoomManager } from "./rooms";
import {
  SERVER_EVENTS,
  ServerCircuitPayload,
  ServerStudentRecord,
} from "./types";

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "0.0.0.0";

/* ─── Setup ─── */

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  // Lightweight — we only relay JSON messages
  maxHttpBufferSize: 1e6, // 1MB
  pingTimeout: 30000,
  pingInterval: 25000,
});

const roomManager = new RoomManager();

/* ─── HTTP Health Check ─── */

app.get("/", (_req, res) => {
  res.json({
    name: "PrayogGraph WebSocket Server",
    status: "online",
    version: "2.0.0",
    uptime: process.uptime(),
    rooms: roomManager.getStudents.length || 0,
    timestamp: Date.now(),
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

/* ─── Socket.io Connection Handler ─── */

io.on("connection", (socket: Socket) => {
  const clientIp = socket.handshake.address;
  console.log(`[+] Client connected: ${socket.id} from ${clientIp}`);

  let joinedRoomId: string | null = null;
  let joinedStudentId: string | null = null;

  /**
   * JOIN_ROOM
   * Payload: { roomId: string, studentId: string, studentName: string, role: "student" | "teacher" }
   */
  socket.on(SERVER_EVENTS.JOIN_ROOM, (payload: {
    roomId: string;
    studentId: string;
    studentName: string;
    role: "student" | "teacher";
  }) => {
    try {
      const { roomId, studentId, studentName, role } = payload;

      if (!roomId || !studentId || !studentName) {
        socket.emit(SERVER_EVENTS.ERROR, { message: "Missing required fields" });
        return;
      }

      // For students: register them in the room
      if (role === "student") {
        const { room, student, isNew } = roomManager.addStudent(roomId, studentId, studentName);

        joinedRoomId = roomId;
        joinedStudentId = studentId;

        socket.join(roomId);

        // Notify the student they joined successfully
        socket.emit("joined", {
          roomId,
          studentId,
          studentCount: room.students.size,
        });

        // Notify everyone else in the room
        if (isNew) {
          socket.to(roomId).emit(SERVER_EVENTS.STUDENT_JOINED, {
            studentId: student.studentId,
            studentName: student.studentName,
            joinedAt: student.joinedAt,
          });
          console.log(`[→] ${studentName} joined room ${roomId} (total: ${room.students.size})`);
        }

        // Send the full current state to the new joiner
        const fullState = roomManager.getRoomState(roomId);
        socket.emit(SERVER_EVENTS.FULL_STATE, {
          roomId,
          students: fullState?.students || [],
          circuits: {},
        });
      } else {
        // Teacher: join room to observe but don't add as student
        socket.join(roomId);
        joinedRoomId = roomId;

        // Send full state immediately
        const fullState = roomManager.getRoomState(roomId);
        socket.emit(SERVER_EVENTS.FULL_STATE, {
          roomId,
          students: fullState?.students || [],
          circuits: {},
        });

        console.log(`[👁] Teacher joined room ${roomId} to observe`);
      }
    } catch (err) {
      console.error(`[!] JOIN_ROOM error:`, err);
      socket.emit(SERVER_EVENTS.ERROR, { message: "Failed to join room" });
    }
  });

  /**
   * CIRCUIT_UPDATE
   * Payload: ServerCircuitPayload (student's latest circuit)
   */
  socket.on(SERVER_EVENTS.CIRCUIT_UPDATE, (payload: ServerCircuitPayload & {
    roomId: string;
    studentId: string;
  }) => {
    try {
      const { roomId, studentId } = payload;

      if (!roomId || !studentId) return;

      const updated = roomManager.updateStudentCircuit(roomId, studentId, payload);

      if (updated) {
        // Broadcast to everyone in the room EXCEPT the sender
        socket.to(roomId).emit(SERVER_EVENTS.CIRCUIT_UPDATE, {
          studentId: updated.studentId,
          studentName: updated.studentName,
          simulation: payload.simulation,
          timestamp: payload.timestamp,
        });
      }
    } catch (err) {
      console.error(`[!] CIRCUIT_UPDATE error:`, err);
    }
  });

  /**
   * ANNOTATION_START
   * Teacher begins drawing on a student's canvas.
   * Payload: { teacherId, studentId, color }
   */
  socket.on(SERVER_EVENTS.ANNOTATION_START, (payload: {
    roomId: string;
    teacherId: string;
    studentId: string;
    color?: string;
  }) => {
    if (!payload.roomId) return;
    // Forward to the specific student's socket(s)
    io.to(payload.roomId).emit(SERVER_EVENTS.ANNOTATION_START, payload);
  });

  /**
   * ANNOTATION_DRAW
   * Teacher draws a point. Many of these per stroke.
   */
  socket.on(SERVER_EVENTS.ANNOTATION_DRAW, (payload: {
    roomId: string;
    teacherId: string;
    studentId: string;
    point: { x: number; y: number };
  }) => {
    if (!payload.roomId) return;
    io.to(payload.roomId).emit(SERVER_EVENTS.ANNOTATION_DRAW, payload);
  });

  /**
   * ANNOTATION_END
   * Teacher finishes drawing.
   */
  socket.on(SERVER_EVENTS.ANNOTATION_END, (payload: {
    roomId: string;
    teacherId: string;
    studentId: string;
  }) => {
    if (!payload.roomId) return;
    io.to(payload.roomId).emit(SERVER_EVENTS.ANNOTATION_END, payload);
  });

  /**
   * ANNOTATION_CLEAR
   * Teacher clears all annotations.
   */
  socket.on(SERVER_EVENTS.ANNOTATION_CLEAR, (payload: {
    roomId: string;
    studentId?: string; // If omitted, clear for all
  }) => {
    if (!payload.roomId) return;
    io.to(payload.roomId).emit(SERVER_EVENTS.ANNOTATION_CLEAR, payload);
  });

  /**
   * REQUEST_STATE
   * Client wants the current full state of the room.
   */
  socket.on(SERVER_EVENTS.REQUEST_STATE, (payload: { roomId: string }) => {
    const state = roomManager.getRoomState(payload.roomId);
    if (state) {
      socket.emit(SERVER_EVENTS.FULL_STATE, {
        roomId: state.roomId,
        students: state.students,
        circuits: {},
      });
    }
  });

  /**
   * Disconnect — remove student from room, notify others
   */
  socket.on("disconnect", (reason) => {
    try {
      if (joinedRoomId && joinedStudentId) {
        const removed = roomManager.removeStudent(joinedRoomId, joinedStudentId);
        if (removed) {
          socket.to(joinedRoomId).emit(SERVER_EVENTS.STUDENT_DISCONNECTED, {
            studentId: removed.studentId,
            studentName: removed.studentName,
            timestamp: Date.now(),
          });
          console.log(`[-] ${removed.studentName} left room ${joinedRoomId}`);
        }
      }
      console.log(`[-] Client disconnected: ${socket.id} (${reason})`);
    } catch (err) {
      console.error(`[!] Disconnect error:`, err);
    }
  });
});

/* ─── Boot ─── */

server.listen(PORT, HOST, () => {
  console.log("");
  console.log("═══════════════════════════════════════════════════");
  console.log("  PrayogGraph WebSocket Server");
  console.log("═══════════════════════════════════════════════════");
  console.log(`  Status:  ONLINE`);
  console.log(`  HTTP:    http://${HOST}:${PORT}`);
  console.log(`  Health:  http://${HOST}:${PORT}/health`);
  console.log(`  Socket:  ws://${HOST}:${PORT}`);
  console.log(`  PID:     ${process.pid}`);
  console.log("═══════════════════════════════════════════════════");
  console.log("");
});

/* ─── Graceful shutdown ─── */

process.on("SIGTERM", () => {
  console.log("\n[!] SIGTERM received. Shutting down...");
  roomManager.shutdown();
  server.close(() => {
    console.log("[✓] Server closed gracefully");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n[!] SIGINT received. Shutting down...");
  roomManager.shutdown();
  server.close(() => {
    console.log("[✓] Server closed gracefully");
    process.exit(0);
  });
});