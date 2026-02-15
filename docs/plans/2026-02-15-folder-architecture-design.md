# ComposeViz Folder Architecture Design

## Decision

Feature-based architecture with structured internals (components/, hooks/, utils/ sub-folders per feature).

## Structure

```
src/
├── features/
│   ├── editor/                    # YAML Code Editor (left panel)
│   │   ├── components/
│   │   │   └── Editor.tsx
│   │   ├── hooks/
│   │   │   └── useEditor.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── canvas/                    # ReactFlow Graph (right panel)
│   │   ├── components/
│   │   │   ├── Canvas.tsx
│   │   │   ├── ServiceNode.tsx
│   │   │   └── DependencyEdge.tsx
│   │   ├── hooks/
│   │   │   └── useCanvas.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── parser/                    # YAML -> Nodes/Edges transformation
│   │   ├── utils/
│   │   │   ├── parseCompose.ts
│   │   │   ├── iconMatcher.ts
│   │   │   └── layoutEngine.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   └── export/                    # PNG/SVG Export
│       ├── components/
│       │   └── ExportButton.tsx
│       ├── hooks/
│       │   └── useExport.ts
│       └── index.ts
│
├── shared/                        # Cross-feature reusables
│   ├── components/
│   │   └── ui/                    # Shadcn UI components
│   ├── hooks/
│   │   └── useTheme.ts
│   └── types/
│       └── compose.types.ts
│
├── lib/                           # Third-party config
│   └── utils.ts                   # Shadcn cn() utility
│
├── App.tsx
├── App.css
├── main.tsx
└── index.css
```

## Conventions

- Each feature has an `index.ts` barrel export.
- Consumers import from `@/features/editor`, not deep paths.
- Shadcn components go into `shared/components/ui/`.
- `parser/` uses `utils/` instead of `components/` (pure logic, no UI).
- Path alias `@/` maps to `src/`.
