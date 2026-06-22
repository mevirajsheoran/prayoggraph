# PrayogGraph — Real-Time Virtual Physics Lab

**Bharat Academix CodeQuest 2026** | Team Viraj Sheoran

## The Problem

77% of Indian government schools (1+ million) have no functional science laboratory.
1.1 million teaching positions are vacant. Students learn electric circuits from chalk
diagrams and are examined on concepts they never experienced.

## The Solution

PrayogGraph is a real-time collaborative virtual physics laboratory with:
- **Student Canvas:** Drag-and-drop circuit builder with deterministic simulation
- **Teacher Dashboard:** Real-time class visibility + misconception analytics
- **Live Annotation:** Teacher draws on student canvas in real-time

## Tech Stack

- **Frontend:** Next.js 14, React Flow, TypeScript, TailwindCSS
- **Real-time:** Socket.io (standalone Node.js server)
- **Physics Engine:** Custom deterministic DFS graph traversal (zero dependencies)
- **Styling:** Custom cyberpunk design system (no UI library)

## Architecture
STUDENT BROWSER SERVER TEACHER BROWSER
───────────────── ────── ───────────────
React Flow Canvas ⇄ Socket.io ⇄ Student Grid Dashboard
↓ Room Map ↓
Deterministic (In-Memory State) Misconception Analytics
Physics Engine ↓ ↓
↓ CIRCUIT_UPDATE Live Annotation
Hybrid Rule Engine (relay events) (overlay canvas)

text


## Setup

### Prerequisites
- Node.js 18+
- npm

### Frontend
```bash
npm install
npm run dev  # → http://localhost:3000
Backend (Socket.io server)
Bash

cd server
npm install
npm run dev  # → ws://localhost:4000
Tests
Bash

npm run test:engine  # 19 deterministic engine tests
Demo Flow
Open http://localhost:3000 (landing page)
Click Student View → drag Battery, Switch, Bulb
Connect with wires → click Run Simulation → bulb glows green
Open second tab → click Teacher View
See student's circuit state update in real-time
Click student card → click Annotate → draw on canvas
Key Technical Claims
Deterministic physics: Same circuit always produces same result. 19 tests verify.
No AI hallucination: Physics engine is pure DFS, not probabilistic.
NCERT-aligned: Explanations map to Class 10 Chapter 12.
Runs on ₹8,000 tablets: No WebGL, no 3D, minimal CPU.
Real-time sync: WebSocket updates within 100ms.
Live Demo
[YouTube Link] • [Deployed URL]

Documentation
See documentation.pdf for complete technical specification.

text


#### 2. Build the Presentation (8 slides)

Use the structure from documentation §4.5:

| Slide | Content |
|-------|---------|
| 1 | Title: PrayogGraph, problem stat, team name |
| 2 | Problem: 77% schools no lab (use ASER 2023 chart) |
| 3 | Solution: Two screenshots side-by-side (student + teacher) |
| 4 | Architecture: ASCII diagram from §4.7 |
| 5 | Student Experience: Screenshot of canvas with glowing bulb |
| 6 | Teacher Dashboard: Screenshot of student grid |
| 7 | Impact & Scale: India map + statistics |
| 8 | Team & Execution: Photo, name, links |

Export as PDF.

#### 3. Record Demo Video (2 minutes max)

Use OBS or Loom. Follow the script from documentation §4.3:
[0:00] "77% of Indian government schools have no science lab..."
[0:10] Open student view, show empty canvas
[0:20] Drag battery, switch, bulb
[0:30] Connect wires, click Run Simulation
[0:40] Bulb glows green, pause 1 second
[0:50] Open switch, Run Sim → bulb dark, yellow banner
[1:10] Create short circuit, Run Sim → red flash
[1:30] Open teacher view in new tab
[1:40] Show student grid updating
[1:50] Click student card → annotate → close
[1:58] Final tagline: "Built for Bharat..."

text


Upload to YouTube as **unlisted**, get the link.

#### 4. Architecture Diagram

Take the ASCII diagram from documentation §4.7, paste into [Excalidraw](https://excalidraw.com/), beautify it, export as PNG.

#### 5. Zip Everything

```powershell
# From the folder ABOVE prayoggraph/:
Compress-Archive -Path ".\prayoggraph\*" -DestinationPath ".\prayoggraph-submission.zip" -Force
Then manually add to the zip:

presentation.pdf
demo-video-link.txt (containing just the YouTube URL)
architecture-diagram.png
documentation.pdf (the full spec you shared with me)