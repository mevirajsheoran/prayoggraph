"use client";

import { memo } from "react";
import type { StudentCircuitView } from "./TeacherDashboard";
import { StudentCard } from "./StudentCard";

interface StudentGridProps {
  students: StudentCircuitView[];
  selectedStudentId?: string | null;
  onStudentClick?: (studentId: string) => void;
}

export const StudentGrid = memo(function StudentGrid({
  students,
  selectedStudentId,
  onStudentClick,
}: StudentGridProps) {
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="font-mono text-2xl font-bold uppercase tracking-widest text-text-muted opacity-40">
          ◌ NO STUDENTS ◌
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-text-muted">
          Waiting for students to join...
        </p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-text-muted opacity-60">
          Share room code: PHYS-10A
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {students.map((student) => (
        <StudentCard
          key={student.studentId}
          student={student}
          selected={selectedStudentId === student.studentId}
          onClick={() => onStudentClick?.(student.studentId)}
        />
      ))}
    </div>
  );
});