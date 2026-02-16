# YAMLens

**Visualize Docker Compose files as interactive architecture diagrams.**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://yamlens.akbardhia.me)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Live Demo](https://yamlens.akbardhia.me) • [Report Bug](https://github.com/akbrdhia/YAMLens/issues)

---

**YAMLens** transforms your `docker-compose.yml` into beautiful, interactive architecture diagrams instantly. It's built for developers who need to understand complex service dependencies at a glance.

## Key Features

### Smart Visualization
- **Auto-Layout:** Automatically arranges services hierarchically using Dagre (Top-to-Bottom).
- **Brand Icons:** Automatically detects service images (e.g., Postgres, Redis, Node) and displays official brand logos.
- **Interactive Tracing:** **Click** on any node to highlight its connections and dim unrelated services.
- **Rich Details:** View ports, volume counts, and environment variable counts directly on the cards.

### Powerful Editor
- **Monaco-like Experience:** Syntax highlighting, line numbers, and error detection.
- **History:** Full **Undo/Redo** support (`Ctrl+Z` / `Ctrl+Shift+Z`).
- **Formatter:** Auto-format your YAML with a single click.
- **Smart Search (`Ctrl+K`):** Jump instantly to any service definition or find text in the editor.

### Beautiful & Customizable
- **Theming:** Full **Light/Dark** mode support with Docker Blue branding.
- **Export:** Download high-quality **PNG/SVG** or copy to clipboard for documentation.
- **Hand-Drawn Style:** Uses the *Virgil* font for diagrams (like Excalidraw) and *Cascadia Code* for the editor.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Open Command Palette (Search Services) |
| `Ctrl + F` | Find in Editor / Command Palette |
| `Ctrl + J` | Toggle Light/Dark Theme |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + E` | Export as PNG |

## Quick Start

### Online
Visit [yamlens.akbardhia.me](https://yamlens.akbardhia.me) and paste your docker-compose.yml.

### Local Development

1.  **Clone the repo**
    ```bash
    git clone https://github.com/akbrdhia/yamlens.git
    cd yamlens
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run dev server**
    ```bash
    npm run dev
    ```

## 🛠 Tech Stack

-   **Core:** React 19, TypeScript, Vite
-   **State:** Zustand
-   **Visuals:** React Flow, Dagre (Layout), html-to-image
-   **Editor:** CodeMirror 6
-   **UI:** Tailwind CSS v4, Shadcn UI, Lucide Icons, Simple Icons

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Author:** [Akbar](https://akbardhia.me)
