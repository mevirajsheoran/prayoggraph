# PrayogGraph — Real-Time Virtual Physics Lab

**Bharat Academix CodeQuest 2026** · Team Viraj Sheoran

> A real-time collaborative virtual physics laboratory for Indian classrooms. 77% of government schools have no science lab — this fixes that.

## Quick Links

| Resource | Link |
|----------|------|
| **Live Demo** | [prayoggraph.vercel.app](https://prayoggraph.vercel.app/) |
| **GitHub Repository** | [github.com/mevirajsheoran/prayoggraph](https://github.com/mevirajsheoran/prayoggraph) |
| **Technical Documentation** | [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md) |
| **Demo Video** | [demo-video.mp4](./demo-video.mp4) |
| **Architecture Diagram** | [ArchitectureDiragram.png](./ArchitectureDiragram.png) |

---

## The Problem

77% of Indian government schools (1+ million) have no functional science laboratory. 1.1 million teaching positions are vacant. Students learn electric circuits from chalk diagrams and are examined on concepts they never experienced.

## The Solution

PrayogGraph is a real-time collaborative virtual physics laboratory with:

- **Student Canvas** — Drag-and-drop circuit builder with deterministic simulation
- **Teacher Dashboard** — Real-time class visibility and misconception analytics
- **Live Annotation** — Teacher draws on student canvas in real-time

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 14, React Flow, TypeScript, TailwindCSS |
| **Real-time** | Socket.io (standalone Node.js server) |
| **Physics Engine** | Custom deterministic DFS graph traversal (zero dependencies) |
| **Styling** | Custom cyberpunk design system (no UI library) |

## Architecture

```
STUDENT BROWSER          SERVER              TEACHER BROWSER
─────────────────        ──────              ───────────────
React Flow Canvas   ⇄    Socket.io      ⇄    Student Grid Dashboard
        ↓                Room Map                  ↓
Deterministic            (In-Memory State)   Misconception Analytics
Physics Engine                   ↓                  ↓
        ↓              CIRCUIT_UPDATE        Live Annotation
Hybrid Rule Engine     (relay events)        (overlay canvas)
```

See the full architecture diagram: [ArchitectureDiragram.png](./ArchitectureDiragram.png)

## Setup

### Prerequisites

- Node.js 18+
- npm

### Frontend

```bash
npm install
npm run dev   # → http://localhost:3000
```

### Backend (Socket.io server)

```bash
cd server
npm install
npm run dev   # → ws://localhost:4000
```

### Tests

```bash
npm run test:engine   # 19 deterministic engine tests
```

## Demo Flow

1. Open [http://localhost:3000](http://localhost:3000) (or the [live demo](https://prayoggraph.vercel.app/))
2. Click **Student View** → drag Battery, Switch, Bulb
3. Connect with wires → click **Run Simulation** → bulb glows green
4. Open a second tab → click **Teacher View**
5. See the student's circuit state update in real-time
6. Click a student card → **Annotate** → draw on the canvas

Watch the full walkthrough: [demo-video.mp4](./demo-video.mp4)

## Key Technical Claims

- **Deterministic physics** — Same circuit always produces the same result. 19 tests verify.
- **No AI hallucination** — Physics engine is pure DFS, not probabilistic.
- **NCERT-aligned** — Explanations map to Class 10 Chapter 12.
- **Runs on ₹8,000 tablets** — No WebGL, no 3D, minimal CPU.
- **Real-time sync** — WebSocket updates within 100ms.

## Documentation

For the complete technical specification — architecture, physics engine, WebSocket protocol, API reference, and deployment guide — see [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md).

---

**Built by Viraj Sheoran** · [GitHub](https://github.com/mevirajsheoran/prayoggraph) · [Live Demo](https://prayoggraph.vercel.app/)
