# Day 3: ReactFlow Setup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate ReactFlow canvas with custom nodes (Service Card) and connect it to the YAML parser via Zustand.

**Architecture:** Editor updates -> Parser (Day 2) -> Zustand Store -> ReactFlow Canvas.

**Tech Stack:** `@xyflow/react`, `zustand`, Shadcn UI.

---

### Task 1: Install Dependencies & Setup Store

**Files:**
- Modify: `package.json`
- Create: `src/features/canvas/types.ts`
- Create: `src/features/canvas/store/useCanvasStore.ts`

**Step 1: Install dependencies**

Run:
```bash
npm install @xyflow/react zustand
```

**Step 2: Define Canvas Types**

Create `src/features/canvas/types.ts`:
```typescript
import { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';
import { ComposeGraph } from '@/features/parser/types';

export interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setGraph: (graph: ComposeGraph) => void;
}
```

**Step 3: Create Zustand Store**

Create `src/features/canvas/store/useCanvasStore.ts`. Implement basic state management.

```typescript
import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  EdgeChange,
  NodeChange,
} from '@xyflow/react';
import { CanvasState } from '../types';
import { layoutGraph } from '../utils/layout-grid'; // We'll create this next

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setGraph: (graph) => {
    // Transform ComposeGraph (IR) to ReactFlow Nodes/Edges
    const { nodes, edges } = layoutGraph(graph);
    set({ nodes, edges });
  },
}));
```

**Step 4: Commit**

```bash
git add package.json package-lock.json src/features/canvas/types.ts src/features/canvas/store/useCanvasStore.ts
git commit -m "feat(canvas): install reactflow and setup zustand store"
```

---

### Task 2: Implement Layout Utility (Grid)

**Files:**
- Create: `src/features/canvas/utils/layout-grid.ts`

**Step 1: Create Basic Grid Layout**

Create `src/features/canvas/utils/layout-grid.ts`. Maps `ComposeGraph` to ReactFlow nodes with simple grid positions.

```typescript
import { Node, Edge, MarkerType } from '@xyflow/react';
import { ComposeGraph } from '@/features/parser/types';

const NODE_WIDTH = 250;
const NODE_HEIGHT = 150;
const GAP = 50;
const COLS = 3;

export function layoutGraph(graph: ComposeGraph): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // 1. Create Nodes (Grid Layout)
  Object.values(graph.services).forEach((service, index) => {
    const col = index % COLS;
    const row = Math.floor(index / COLS);

    nodes.push({
      id: service.id,
      type: 'serviceNode', // Custom node type we'll build next
      position: {
        x: col * (NODE_WIDTH + GAP),
        y: row * (NODE_HEIGHT + GAP),
      },
      data: { ...service }, // Pass service data to node
    });
  });

  // 2. Create Edges
  graph.edges.forEach((edge) => {
    edges.push({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep', // Built-in curve type
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    });
  });

  return { nodes, edges };
}
```

**Step 2: Commit**

```bash
git add src/features/canvas/utils/layout-grid.ts
git commit -m "feat(canvas): implement basic grid layout utility"
```

---

### Task 3: Implement Custom Node (ServiceNode)

**Files:**
- Create: `src/features/canvas/components/ServiceNode.tsx`

**Step 1: Create ServiceNode Component**

Create `src/features/canvas/components/ServiceNode.tsx` using Shadcn Card.

```typescript
import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ServiceNode as ServiceNodeType } from '@/features/parser/types';
import { cn } from '@/lib/utils';
import { Box, Globe, Database } from 'lucide-react'; // Example icons

// Helper to guess icon (Day 4 will make this better)
const getIcon = (image?: string) => {
  if (image?.includes('postgres') || image?.includes('mysql') || image?.includes('mongo')) return <Database className="size-4" />;
  if (image?.includes('nginx') || image?.includes('apache') || image?.includes('httpd')) return <Globe className="size-4" />;
  return <Box className="size-4" />;
};

export const ServiceNode = memo(({ data }: NodeProps<ServiceNodeType>) => {
  return (
    <div className="relative group">
      {/* Input Handle (Top) */}
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground w-3 h-3" />

      <Card className="w-[240px] shadow-sm hover:shadow-md transition-shadow border-border/50 bg-card/95 backdrop-blur-sm">
        <CardHeader className="p-3 pb-1 flex flex-row items-center gap-2 space-y-0 border-b border-border/50">
          <div className="p-1.5 bg-primary/10 rounded-md text-primary">
            {getIcon(data.image)}
          </div>
          <CardTitle className="text-sm font-semibold truncate" title={data.id}>
            {data.id}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 text-xs text-muted-foreground space-y-1">
          {data.image && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Image:</span>
              <span className="truncate">{data.image}</span>
            </div>
          )}
          {data.ports && data.ports.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.ports.map((p) => (
                <span key={p} className="px-1.5 py-0.5 bg-accent rounded text-[10px] font-mono text-accent-foreground">
                  {p}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Output Handle (Bottom) */}
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground w-3 h-3" />
    </div>
  );
});

ServiceNode.displayName = 'ServiceNode';
```

**Step 2: Commit**

```bash
git add src/features/canvas/components/ServiceNode.tsx
git commit -m "feat(canvas): implement custom ServiceNode component"
```

---

### Task 4: Implement ReactFlow Canvas

**Files:**
- Modify: `src/features/canvas/components/Canvas.tsx`
- Create: `src/features/canvas/index.ts` (update exports)

**Step 1: Update Canvas Component**

Update `src/features/canvas/components/Canvas.tsx`.

```typescript
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // Import styles
import { useCanvasStore } from '../store/useCanvasStore';
import { ServiceNode } from './ServiceNode';

// Register node types
const nodeTypes = {
  serviceNode: ServiceNode,
};

export function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useCanvasStore();

  return (
    <div className="h-full w-full bg-background/50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
        colorMode="dark"
      >
        <Background gap={20} size={1} color="var(--border)" />
        <Controls className="bg-card border-border fill-foreground" />
        <MiniMap className="bg-card border-border" nodeColor="var(--primary)" />
      </ReactFlow>
    </div>
  );
}
```

**Step 2: Update Barrel Export**

Update `src/features/canvas/index.ts`:

```typescript
export * from './types';
export { Canvas } from './components/Canvas';
export { useCanvasStore } from './store/useCanvasStore';
```

**Step 3: Commit**

```bash
git add src/features/canvas/components/Canvas.tsx src/features/canvas/index.ts
git commit -m "feat(canvas): integrate reactflow canvas"
```

---

### Task 5: Connect Editor to Store (Integration)

**Files:**
- Modify: `src/features/editor/components/Editor.tsx`
- Create: `src/shared/components/ui/card.tsx` (Need to verify if Shadcn Card exists, if not install it)

**Step 1: Install Shadcn Card (if missing)**

Run:
```bash
npx shadcn@latest add card
```
(Check if `src/shared/components/ui/card.tsx` exists after this)

**Step 2: Modify Editor to Parse on Change**

Update `src/features/editor/components/Editor.tsx` to include a `<textarea>` that updates the graph.

```typescript
import { useState, useEffect } from 'react';
import { parseDockerCompose } from '@/features/parser';
import { useCanvasStore } from '@/features/canvas';
import { cn } from '@/lib/utils';

export function Editor() {
  const setGraph = useCanvasStore((state) => state.setGraph);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Parse on code change (debounced in real app, immediate for now)
  useEffect(() => {
    if (!code.trim()) return;

    const result = parseDockerCompose(code);
    if (result.success && result.data) {
      setGraph(result.data);
      setError(null);
    } else {
      setError(result.error || 'Unknown error');
    }
  }, [code, setGraph]);

  return (
    <div className="h-full w-full flex flex-col bg-background">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/40">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          docker-compose.yml
          {error && <span className="text-destructive text-xs ml-2">({error.split('\n')[0]})</span>}
        </span>
      </div>
      <div className="flex-1 relative">
        <textarea
          className={cn(
            "w-full h-full p-4 font-mono text-sm bg-background resize-none focus:outline-none",
            "text-foreground placeholder:text-muted-foreground/50",
            error ? "border-l-2 border-destructive" : ""
          )}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="version: '3'&#10;services:&#10;  web:&#10;    image: nginx&#10;    ports:&#10;      - '80:80'"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/features/editor/components/Editor.tsx src/shared/components/ui/card.tsx
git commit -m "feat(editor): connect editor to canvas store"
```

---

### Task 6: Verify End-to-End

**Files:**
- None (Manual verification)

**Step 1: Run Dev Server**

Run: `npm run dev`

**Step 2: Test Parse**

Paste a valid docker-compose YAML into the editor.
Expected: Graph renders on the right side with cards for services and lines for edges.

**Step 3: Commit Verification**

(No code changes expected)
