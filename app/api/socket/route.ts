import { Server as SocketIOServer } from "socket.io";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Store io instance globally to persist across requests
let io: SocketIOServer | null = null;

export async function GET(_req: NextRequest) {
  if (!io) {
    console.log("[Socket.io] Initializing server on Vercel...");

    io = new SocketIOServer({
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      transports: ["websocket", "polling"],
    });

    // Connection handler
    io.on("connection", (socket) => {
      console.log(`[+] Client connected: ${socket.id}`);

      let joinedRoomId: string | null = null;
      let joinedStudentId: string | null = null;

      // JOIN_ROOM
      socket.on("join_room", (payload: {
        roomId: string;
        studentId: string;
        studentName: string;
        role: "student" | "teacher";
      }) => {
        const { roomId, studentId, studentName, role } = payload;
        if (!roomId || !studentId) return;

        socket.join(roomId);
        joinedRoomId = roomId;
        joinedStudentId = studentId;

        socket.emit("joined", {
          roomId,
          studentId,
          studentCount: 1,
        });

        if (role === "student") {
          socket.to(roomId).emit("student_joined", {
            studentId,
            studentName,
            joinedAt: Date.now(),
          });
          console.log(`[→] ${studentName} joined ${roomId}`);
        }

        // Auto-send full state
        socket.emit("full_state", {
          roomId,
          students: [],
          circuits: {},
        });
      });

      // CIRCUIT_UPDATE
      socket.on("circuit_update", (payload: {
        roomId: string;
        studentId: string;
        studentName: string;
        simulation: {
          result: string;
          message: string;
          activeEdgeIds: string[];
          computedAt: number;
        };
        timestamp: number;
      }) => {
        if (!payload.roomId) return;
        socket.to(payload.roomId).emit("circuit_update", payload);
      });

      // ANNOTATION events
      socket.on("annotation_start", (payload: { roomId: string }) => {
        if (!payload.roomId) return;
        io!.to(payload.roomId).emit("annotation_start", payload);
      });

      socket.on("annotation_draw", (payload: { roomId: string }) => {
        if (!payload.roomId) return;
        io!.to(payload.roomId).emit("annotation_draw", payload);
      });

      socket.on("annotation_end", (payload: { roomId: string }) => {
        if (!payload.roomId) return;
        io!.to(payload.roomId).emit("annotation_end", payload);
      });

      // Disconnect
      socket.on("disconnect", () => {
        if (joinedRoomId && joinedStudentId) {
          socket.to(joinedRoomId).emit("student_disconnected", {
            studentId: joinedStudentId,
            timestamp: Date.now(),
          });
        }
        console.log(`[-] Client disconnected: ${socket.id}`);
      });
    });

    console.log("[Socket.io] Server ready");
  }

  return new Response(
    JSON.stringify({
      status: "online",
      message: "PrayogGraph Socket.io server",
      path: "/api/socket",
      timestamp: Date.now(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Handle Socket.io upgrade requests
export async function POST(req: NextRequest) {
  return GET(req);
}