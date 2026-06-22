"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AmbientBackground } from "@/components/ui";
import { GraduationCap, Eye, Zap, Cpu, Users, MessageSquare } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [bootText, setBootText] = useState("");

  const bootSequence = [
    "INITIALIZING PRAYOGGRAPH...",
    "LOADING PHYSICS ENGINE...",
    "DFS TRAVERSAL MODULE: OK",
    "NCERT DATABASE: LOADED",
    "WEBSOCKET MODULE: STANDBY",
    "ALL SYSTEMS ONLINE",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootSequence.length) {
        setBootText(bootSequence[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-bg-primary">
      <AmbientBackground />

      <div className="relative flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-5xl space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-1">
              <Zap className="h-3 w-3 text-neon-cyan" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neon-cyan">
                Bharat Academix CodeQuest 2026
              </span>
            </div>

            <h1 className="mt-4 font-mono text-5xl font-bold tracking-widest text-glow-cyan sm:text-6xl"
                style={{
                  background: "linear-gradient(135deg, #00ffff 0%, #a855f7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
              PRAYOGGRAPH
            </h1>

            <p className="mt-2 font-mono text-sm uppercase tracking-widest text-text-secondary">
              Deterministic · Real-Time · Built for Bharat
            </p>

            <p className="mx-auto mt-4 max-w-2xl font-sans text-sm leading-relaxed text-text-primary">
              A real-time collaborative virtual physics laboratory for Indian classrooms.
              77% of government schools have no science lab — this fixes that.
            </p>
          </div>

          {/* Two entry cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Student View */}
            <button
              onClick={() => router.push("/student")}
              className="group relative overflow-hidden rounded-lg border border-neon-cyan/40 bg-gradient-to-br from-neon-cyan/10 to-transparent p-6 text-left transition-all duration-300 hover:border-neon-cyan hover:shadow-neon-cyan hover:-translate-y-1"
            >
              <div className="absolute right-2 top-2 font-mono text-[8px] uppercase tracking-widest text-text-muted opacity-40 group-hover:opacity-100">
                /student
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-neon-cyan/40 bg-neon-cyan/10">
                  <GraduationCap className="h-6 w-6 text-neon-cyan" />
                </div>
                <div>
                  <h2 className="font-mono text-lg font-bold uppercase tracking-widest text-neon-cyan">
                    Student View
                  </h2>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                    Build circuits · Run simulations
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-1 font-mono text-[10px] text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="text-neon-cyan">▸</span> Drag-and-drop components
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-neon-cyan">▸</span> Deterministic DFS engine
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-neon-cyan">▸</span> NCERT-aligned feedback
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-neon-cyan">▸</span> Live bulb visualization
                </li>
              </ul>

              <div className="mt-4 flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-widest text-neon-cyan opacity-0 transition-opacity group-hover:opacity-100">
                ENTER →
              </div>
            </button>

            {/* Teacher View */}
            <button
              onClick={() => router.push("/teacher")}
              className="group relative overflow-hidden rounded-lg border border-neon-purple/40 bg-gradient-to-br from-neon-purple/10 to-transparent p-6 text-left transition-all duration-300 hover:border-neon-purple hover:shadow-neon-purple hover:-translate-y-1"
            >
              <div className="absolute right-2 top-2 font-mono text-[8px] uppercase tracking-widest text-text-muted opacity-40 group-hover:opacity-100">
                /teacher
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-neon-purple/40 bg-neon-purple/10">
                  <Eye className="h-6 w-6 text-neon-purple" />
                </div>
                <div>
                  <h2 className="font-mono text-lg font-bold uppercase tracking-widest text-neon-purple">
                    Teacher View
                  </h2>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                    Live class dashboard · Annotations
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-1 font-mono text-[10px] text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="text-neon-purple">▸</span> Real-time student grid
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-neon-purple">▸</span> Misconception alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-neon-purple">▸</span> Live annotation tool
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-neon-purple">▸</span> Class mastery analytics
                </li>
              </ul>

              <div className="mt-4 flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-widest text-neon-purple opacity-0 transition-opacity group-hover:opacity-100">
                ENTER →
              </div>
            </button>
          </div>

          {/* Boot sequence + stats */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Boot console */}
            <div className="rounded-lg border border-border-default bg-bg-card/40 p-3 backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-border-default pb-2">
                <Cpu className="h-3 w-3 text-neon-cyan" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neon-cyan">
                  System Boot
                </span>
              </div>
              <div className="mt-2 min-h-[80px] font-mono text-[10px] text-text-secondary">
                {bootSequence.slice(0, bootText ? bootSequence.indexOf(bootText) + 1 : 0).map((line, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-neon-green">✓</span>
                    <span>{line}</span>
                  </div>
                ))}
                <div className="mt-1 animate-pulse text-neon-cyan">▊</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <StatBox label="Engine Speed" value="<1ms" accent="green" />
              <StatBox label="Tests Passing" value="19/19" accent="cyan" />
              <StatBox label="Components" value="7 types" accent="purple" />
              <StatBox label="NCERT Aligned" value="Ch. 12" accent="yellow" />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
              Built by Viraj Sheoran · Team PrayogGraph · CodeQuest 2026
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatBox({ label, value, accent }: { label: string; value: string; accent: "cyan" | "green" | "purple" | "yellow" }) {
  const colors = {
    cyan: "border-neon-cyan/40 text-neon-cyan",
    green: "border-neon-green/40 text-neon-green",
    purple: "border-neon-purple/40 text-neon-purple",
    yellow: "border-neon-yellow/40 text-neon-yellow",
  };
  return (
    <div className={`rounded-lg border bg-bg-card/40 p-2 backdrop-blur-md ${colors[accent]}`}>
      <div className="font-mono text-[9px] uppercase tracking-widest opacity-70">{label}</div>
      <div className="font-mono text-lg font-bold">{value}</div>
    </div>
  );
}