import { type Node, type Edge, MarkerType } from '@xyflow/react';
import type { ComposeGraph } from '@/features/parser/types';

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
      type: 'serviceNode', // Custom node type we'll build next (Task 3)
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
