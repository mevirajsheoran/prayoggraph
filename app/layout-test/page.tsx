"use client";

import { AmbientBackground, Navbar, Button, Badge, MetricCard } from "../../components/ui";
import { Zap, CheckCircle2, AlertTriangle, XCircle, Eye, Users, GitBranch, Activity, Wifi, Cpu, BookOpen } from "lucide-react";

export default function LayoutTestPage() {
  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden">
      <AmbientBackground />
      <Navbar viewType="STUDENT VIEW" simulationState="VALID" roomCode="TEST-42" studentCount={12} />

      <div className="relative flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl space-y-8 pb-12">
          <header className="space-y-2">
            <h2 className="font-mono text-2xl font-bold tracking-widest text-neon-cyan text-glow-cyan">
              COMPONENT SANITY CHECK
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
              Verify every primitive renders correctly before Part 2
            </p>
          </header>

          {/* Buttons */}
          <section className="glass-panel space-y-3 rounded-lg p-4">
            <h3 className="mono-label text-neon-cyan">BUTTONS</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm">Small Primary</Button>
              <Button variant="primary" size="md">Medium Primary</Button>
              <Button variant="primary" size="lg">Large Primary</Button>
              <Button variant="danger" size="md" icon={<AlertTriangle className="h-3 w-3" />}>Danger</Button>
              <Button variant="purple" size="md" icon={<Users className="h-3 w-3" />}>Purple</Button>
              <Button variant="ghost" size="md">Ghost</Button>
              <Button variant="primary" loading>Loading</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </section>

          {/* Badges */}
          <section className="glass-panel space-y-3 rounded-lg p-4">
            <h3 className="mono-label text-neon-cyan">BADGES</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="cyan" label="READY" pulse />
              <Badge tone="green" label="VALID CIRCUIT" pulse />
              <Badge tone="red" label="SHORT CIRCUIT" pulse />
              <Badge tone="yellow" label="OPEN CIRCUIT" pulse />
              <Badge tone="purple" label="TEACHER VIEW" pulse icon={<Eye className="h-3 w-3" />} />
              <Badge tone="gray" label="IDLE" />
            </div>
          </section>

          {/* Metric cards */}
          <section className="glass-panel space-y-3 rounded-lg p-4">
            <h3 className="mono-label text-neon-cyan">METRIC CARDS</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricCard label="Nodes" value="3" icon={<Cpu className="h-4 w-4" />} accent="cyan" />
              <MetricCard label="Edges" value="2" icon={<GitBranch className="h-4 w-4" />} accent="purple" />
              <MetricCard label="State" value="OPEN" icon={<Activity className="h-4 w-4" />} accent="yellow" />
              <MetricCard label="Mastery" value="67%" icon={<CheckCircle2 className="h-4 w-4" />} accent="green" />
            </div>
          </section>

          {/* Navbar states */}
          <section className="glass-panel space-y-3 rounded-lg p-4">
            <h3 className="mono-label text-neon-cyan">NAVBAR STATES</h3>
            <div className="space-y-2 rounded border border-border-default bg-bg-primary/60 p-2 font-mono text-[10px] uppercase tracking-widest text-text-secondary">
              <p>✓ Logo with gradient (cyan → purple)</p>
              <p>✓ Brand name: PRAYOGGRAPH</p>
              <p>✓ Subtitle: Series Circuit Lab</p>
              <p>✓ Room code badge with Wifi icon</p>
              <p>✓ Student count display</p>
              <p>✓ Simulation state badge (color changes per state)</p>
              <p>✓ View type badge (cyan = student, purple = teacher)</p>
              <p>✓ Bottom gradient line</p>
              <p>✓ Glassmorphism background (black/40 + blur-xl)</p>
            </div>
          </section>

          {/* Color system */}
          <section className="glass-panel space-y-3 rounded-lg p-4">
            <h3 className="mono-label text-neon-cyan">COLOR SYSTEM</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { name: "bg-primary", cls: "bg-bg-primary", hex: "#030712" },
                { name: "bg-secondary", cls: "bg-bg-secondary", hex: "#0a0f1e" },
                { name: "bg-card", cls: "bg-bg-card", hex: "#111827" },
                { name: "neon-cyan", cls: "bg-neon-cyan", hex: "#00ffff" },
                { name: "neon-purple", cls: "bg-neon-purple", hex: "#a855f7" },
                { name: "neon-green", cls: "bg-neon-green", hex: "#22c55e" },
                { name: "neon-red", cls: "bg-neon-red", hex: "#ef4444" },
                { name: "neon-yellow", cls: "bg-neon-yellow", hex: "#eab308" },
                { name: "text-primary", cls: "bg-text-primary", hex: "#e5e7eb" },
              ].map((c) => (
                <div key={c.name} className="flex items-center gap-2 rounded border border-border-default p-2">
                  <div className={`h-8 w-8 rounded ${c.cls}`} />
                  <div className="flex-1">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-primary">
                      {c.name}
                    </div>
                    <div className="font-mono text-[9px] text-text-muted">{c.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section className="glass-panel space-y-3 rounded-lg p-4">
            <h3 className="mono-label text-neon-cyan">TYPOGRAPHY</h3>
            <div className="space-y-2">
              <p className="font-mono text-2xl font-bold tracking-widest text-neon-cyan text-glow-cyan">
                HEADING 2XL MONO
              </p>
              <p className="font-mono text-base font-bold tracking-widest text-text-primary">
                Body Bold Mono
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                Label 10px Mono Uppercase Widest
              </p>
              <p className="font-sans text-sm text-text-primary">
                Body sans-serif Inter — clean readable description text
              </p>
            </div>
          </section>

          <p className="text-center font-mono text-[10px] uppercase tracking-widest text-text-muted">
            ✓ All Part 1 primitives verified • Proceed to Part 2 (Physics Engine)
          </p>
        </div>
      </div>
    </main>
  );
}