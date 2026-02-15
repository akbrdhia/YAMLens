# Parser Architecture Design (Day 2)

## Goal
Implement a robust YAML parser that validates Docker Compose files and transforms them into a normalized graph structure (Intermediate Representation).

## Architecture

```mermaid
graph LR
    YAML[YAML String] -->|js-yaml| RawJS[Raw JS Object]
    RawJS -->|Zod Validation| ValidCompose[Typed Compose Object]
    ValidCompose -->|Normalization| IR[ComposeGraph (IR)]
```

## Decisions

1.  **Validation:** Use `zod` for strict schema validation.
    *   **Why:** Ensures type safety and provides clear error messages for invalid YAML.
    *   **Handling Variations:** Schema must handle loose types (e.g. `ports` as string/number array, `depends_on` as array/object).

2.  **Data Structure:** Use an Intermediate Representation (`ComposeGraph`).
    *   **Why:** Decouples parsing from rendering (ReactFlow). Allows easier testing and layout calculations.

## Folder Structure

```
src/features/parser/
├── schemas/
│   └── compose.schema.ts    # Zod definitions (services, networks, volumes)
├── utils/
│   ├── yaml-parser.ts       # js-yaml wrapper + Zod validation
│   └── graph-normalizer.ts  # ValidCompose -> ComposeGraph
├── types.ts                 # TS types inferred from Zod + IR types
└── index.ts                 # Public API: parseCompose(yaml: string): ComposeGraph
```

## Data Types (IR)

```typescript
// The normalized output of the parser
export interface ComposeGraph {
  services: Record<string, ServiceNode>;
  edges: ServiceEdge[];
}

export interface ServiceNode {
  id: string; // Service name
  image?: string;
  ports?: string[];
  volumes?: string[];
  networks?: string[];
  environment?: string[];
  dependsOn?: string[];
}

export interface ServiceEdge {
  source: string;
  target: string;
  type: 'depends_on' | 'network' | 'link';
}
```

## Error Handling
- `js-yaml` errors: Catch and rethrow with "Invalid YAML Syntax".
- `zod` errors: Catch and format into user-friendly messages (e.g. "Service 'web': Invalid 'ports' definition").
