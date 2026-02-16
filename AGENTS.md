# YAMLens - Project Manifest

## 1. Overview
*   **Name:** YAMLens (formerly ComposeViz)
*   **Version:** v1.0.0
*   **Description:** A 100% client-side tool to visualize Docker Compose files as interactive architecture diagrams.
*   **Live Demo:** [yamlens.akbardhia.me](https://yamlens.akbardhia.me)

## 2. Architecture
*   **Pattern:** Feature-based (`src/features/*`).
*   **State Management:** Zustand (`useCanvasStore`, `useUIStore`, `useEditor` Context).
*   **Styling:** Tailwind CSS v4 + Shadcn UI (Theming via `next-themes`).

## 3. Tech Stack
*   **Core:** React 19, TypeScript, Vite.
*   **UI:** Tailwind CSS v4, Shadcn UI, Lucide Icons, Simple Icons.
*   **Editor:** CodeMirror 6 (`@uiw/react-codemirror`) with YAML language support.
*   **Visualization:** React Flow (`@xyflow/react`), Dagre (Auto-Layout).
*   **Logic:** `js-yaml` (Parsing), `zod` (Validation), `html-to-image` (Export).

## 4. Key Features (Implemented)
*   **Smart Editor:** Syntax highlighting, formatting, undo/redo (`Ctrl+Z`), and error validation.
*   **Interactive Graph:**
    *   **Auto-Layout:** Hierarchical positioning using Dagre.
    *   **Interaction:** Click-to-highlight dependencies, dim unrelated nodes.
    *   **Rich Nodes:** Brand icons (Postgres, Redis, etc.), port/volume/env indicators.
*   **Navigation:** Global Command Palette (`Ctrl+K`) to jump to services or find text.
*   **Theme:** Full Light/Dark mode support with custom "Docker Blue" branding.
*   **Export:** Download as PNG/SVG or copy to clipboard.

## 5. Folder Structure
```
src/
  features/
    canvas/    # ReactFlow logic, Custom Nodes, Layout Engine
    editor/    # CodeMirror config, Undo/Redo context
    parser/    # YAML -> Zod -> IR transformation
    export/    # Image export hooks and UI
    search/    # Command Palette (cmdk)
    theme/     # Theme toggle logic
  shared/
    components/ # Reusable UI (Shadcn), Header
    store/      # Global UI store
    providers/  # Theme/Editor providers
```

## 6. Roadmap (Future)
*   **v1.1:** URL Sharing (compress YAML to URL param).
*   **v1.2:** Visual Editing (Drag-to-connect updates YAML).
*   **v2.0:** Multi-file support (`extends`, `include`).

## 7. AI Directives
*   **Role:** Senior Frontend Engineer.
*   **Style:** Maintain the "feature-based" architecture. Do not use `src/components` for feature-specific logic.
*   **UX:** Prioritize keyboard accessibility (`Ctrl+K`) and visual clarity (Virgil font, clean lines).
