# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-16

### 🚀 New Features

*   **Share Configuration:** Share your Docker Compose setup instantly via a unique URL (compressed with `lz-string`).
    *   **Auto-Hydration:** Opening a shared link automatically loads the configuration into the editor and visualizer.
    *   **Toast Notification:** Get instant feedback when a link is copied or loaded.
*   **Pro Editor:** Replaced basic textarea with **CodeMirror 6**.
    *   Added syntax highlighting for YAML.
    *   Added line numbers and fold gutters.
    *   Added **Undo/Redo** support (`Ctrl+Z`, `Ctrl+Shift+Z`).
    *   Added **Auto-Formatting** button (Beautify).
*   **Smart Search:** Added a global **Command Palette** (`Ctrl+K`).
    *   Search for services and jump instantly to them on the canvas.
    *   Unified with Editor Find (`Ctrl+F`).
*   **Theming:** Implemented full **Light/Dark Mode** support.
    *   Added theme toggle in the header.
    *   Custom "Docker Blue" branding for primary actions.
*   **Advanced Visualization:**
    *   **Network Grouping:** Services are now visually clustered by their Docker networks using dashed containers.
    *   **Volume Nodes:** Shared volumes are rendered as distinct nodes (Cylinders) to visualize data flow.
    *   **Interactive Tracing:** Click any node to highlight its dependency chain and dim unrelated services.
*   **Details Panel:** Added a comprehensive side sheet inspector.
    *   View full environment variables, volumes, ports, and networks.
    *   Copy values to clipboard with one click.
    *   "Jump to Code" button to scroll the editor to the service definition.
*   **Export:** Added functionality to download the graph as **PNG** or **SVG**, or copy to clipboard.

### 💅 UI/UX Improvements

*   **Typography:** Added **Cascadia Code** for the editor (supports ligatures) and **Virgil** for the canvas (hand-drawn style).
*   **Glassmorphism:** Added blur effects to headers and cards for a modern feel.
*   **Icons:** Integrated official brand icons (Simple Icons) for popular services (Postgres, Redis, Nginx, etc.) and generic fallbacks (Lucide).
*   **Animation:** Added animated edges for dependencies.
*   **Demo Data:** The app now loads a rich default Docker Compose example on first visit.

### 🐛 Bug Fixes

*   Fixed an issue where exporting to PNG would crash due to font embedding errors.
*   Fixed layout overlap issues between services and volumes.
*   Fixed canvas theme not updating immediately when switching modes.

*   **SEO & Social:** Added comprehensive meta tags and Open Graph support for rich social sharing previews.
    *   **PWA Support:** Added `site.webmanifest` and mobile-capable meta tags for "Add to Home Screen" functionality.
*   **Performance:** Refactored state management to use a global `CodeStore` for optimized parsing and reduced re-renders.
*   **Bug Fixes:** Resolved React Fast Refresh issues and `useEffect` dependency warnings for a cleaner development experience.

## [1.0.0] - 2026-02-15

### Initial Release

*   Basic split-screen layout (Editor + Canvas).
*   YAML parsing using `js-yaml` and `zod`.
*   Basic React Flow visualization with auto-layout (Dagre).
*   Responsive resizeable panels.
