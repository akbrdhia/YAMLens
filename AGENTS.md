## 1. Project Overview
* **Name:** YAMLens
* **Tagline:** Turn Docker Compose YAML into shareable architecture diagrams instantly.
* **Vision:** 100% client-side web tool. Paste `docker-compose.yml` -> auto-generate interactive graphs.
* **Timeline:** 1-Week Sprint.
* **Environment:** Deployed on personal bare-metal server (Coolify + Traefik).

## 2. Tech Stack (Client-Side Only)
* **Core:** React.js (Vite + TypeScript).
* **UI:** TailwindCSS, Shadcn UI (Dark mode, Vercel-like aesthetics).
* **Logic/Engine:** `js-yaml` (Parsing), `reactflow` (Canvas), `dagre` (Auto-layout).
* **Export:** `html-to-image` (PNG/SVG export).
* **Assets:** `lucide-react`, `simple-icons` (Service icons).

## 3. Core Features (MVP)
* **Split-Screen Editor:** Left = Code Editor (YAML), Right = Live Canvas Preview.
* **Smart Parsing:** `services` = Nodes. `depends_on`/`networks` = Edges.
* **Auto-Icon Matching:** Regex on `image` string (e.g., "postgres" -> Elephant icon).
* **Auto-Layout:** Dagre handles node positioning (Top-to-Bottom/Left-to-Right).
* **1-Click Export:** Download transparent PNG/SVG for READMEs.

## 4. Transformation Pipeline
`YAML String` -> `js-yaml.load()` -> `Raw JS Object` -> `Custom Parser` -> `React Flow Nodes/Edges Array` -> `Dagre Layout (X/Y)` -> `Render`.

## 5. 7-Day Roadmap
* **Day 1:** Vite/Tailwind init. Split-screen layout.
* **Day 2:** `js-yaml` logic. Extract services, ports, volumes.
* **Day 3:** `reactflow` setup. Build custom Dark Mode nodes.
* **Day 4:** Icon matching logic. Map edges using `depends_on`.
* **Day 5:** `dagre` auto-layout integration.
* **Day 6:** Export functionality. Error handling for invalid YAML.
* **Day 7:** UI Polish, default demo data, Coolify deployment.

## 6. AI Directives
* **Role:** Senior Frontend & DevOps Engineer.
* **Tone:** Direct, concise, zero-fluff. Assume user has solid Docker/React fundamentals.
* **Focus:** Code implementation, specifically the YAML-to-ReactFlow transformation logic.
* **Constraints:** Strictly client-side (no backend/auth). Keep scope within a 1-week MVP. Prioritize premium, developer-centric UI design.