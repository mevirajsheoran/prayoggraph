/**
 * rooms.ts
 *
 * In-memory room state management. For a hackathon MVP this is sufficient.
 * Production would back this with Redis or a database.
 *
 * Responsibilities:
 *   - Create/lookup rooms by ID
 *   - Track students in each room
 *   - Store latest circuit payload per student
 *   - Cleanup empty rooms after timeout
 */

import { ServerStudentRecord, ServerRoomState, ServerCircuitPayload } from "./types";

const ROOM_TTL_MS = 30 * 60 * 1000; // 30 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // Check every 5 minutes

export class RoomManager {
  private rooms = new Map<string, ServerRoomState>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Periodic cleanup of stale rooms
    this.cleanupInterval = setInterval(() => {
      this.cleanupStaleRooms();
    }, CLEANUP_INTERVAL_MS);
  }

  /**
   * Get or create a room.
   */
  getOrCreateRoom(roomId: string): ServerRoomState {
    let room = this.rooms.get(roomId);
    if (!room) {
      room = {
        roomId,
        students: new Map(),
        createdAt: Date.now(),
        lastActivityAt: Date.now(),
      };
      this.rooms.set(roomId, room);
      console.log(`[RoomManager] Created room: ${roomId}`);
    }
    return room;
  }

  /**
   * Add a student to a room, or update their record if they reconnect.
   */
  addStudent(
    roomId: string,
    studentId: string,
    studentName: string
  ): { room: ServerRoomState; student: ServerStudentRecord; isNew: boolean } {
    const room = this.getOrCreateRoom(roomId);
    const existing = room.students.get(studentId);

    const student: ServerStudentRecord = existing || {
      studentId,
      studentName,
      joinedAt: Date.now(),
      lastActiveAt: Date.now(),
      simulationResult: "IDLE",
    };

    if (!existing) {
      student.joinedAt = Date.now();
    }
    student.lastActiveAt = Date.now();
    student.studentName = studentName;

    room.students.set(studentId, student);
    room.lastActivityAt = Date.now();

    return { room, student, isNew: !existing };
  }

  /**
   * Remove a student from a room. Returns the removed record (if any).
   */
  removeStudent(roomId: string, studentId: string): ServerStudentRecord | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const student = room.students.get(studentId);
    if (!student) return null;

    room.students.delete(studentId);
    room.lastActivityAt = Date.now();

    console.log(
      `[RoomManager] Removed ${student.studentName} from ${roomId}. ` +
        `Remaining: ${room.students.size}`
    );

    return student;
  }

  /**
   * Update a student's circuit payload (called on CIRCUIT_UPDATE).
   */
  updateStudentCircuit(
    roomId: string,
    studentId: string,
    payload: ServerCircuitPayload
  ): ServerStudentRecord | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const student = room.students.get(studentId);
    if (!student) return null;

    student.currentCircuit = payload;
    student.simulationResult = payload.simulation.result;
    student.lastActiveAt = Date.now();
    room.lastActivityAt = Date.now();

    return student;
  }

  /**
   * Get all students in a room.
   */
  getStudents(roomId: string): ServerStudentRecord[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    return Array.from(room.students.values());
  }

  /**
   * Get a specific room's full state (for FULL_STATE event).
   */
  getRoomState(roomId: string): {
    roomId: string;
    students: ServerStudentRecord[];
  } | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    return {
      roomId: room.roomId,
      students: Array.from(room.students.values()),
    };
  }

  /**
   * Delete empty rooms older than TTL.
   */
  private cleanupStaleRooms(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [roomId, room] of this.rooms.entries()) {
      const isStale = now - room.lastActivityAt > ROOM_TTL_MS;
      const isEmpty = room.students.size === 0;

      if (isStale || isEmpty) {
        this.rooms.delete(roomId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[RoomManager] Cleaned up ${cleaned} stale room(s)`);
    }
  }

  /**
   * Shutdown — clear interval.
   */
  shutdown(): void {
    clearInterval(this.cleanupInterval);
    this.rooms.clear();
  }
}