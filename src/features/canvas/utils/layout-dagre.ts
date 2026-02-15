import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';
import type { ComposeGraph } from '@/features/parser/types';

// Node dimensions (approximate for Cards)
const NODE_WIDTH = 250;
const NODE_HEIGHT = 200; // Increased height for enhanced card details

export function layoutGraph(graph: ComposeGraph, direction: 'TB' | 'LR' = 'TB'): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: direction });

  // 1. Add nodes to dagre
  Object.values(graph.services).forEach((service) => {
    dagreGraph.setNode(service.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // 2. Add edges to dagre
  graph.edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // 3. Compute layout
  dagre.layout(dagreGraph);

  // 4. Transform back to ReactFlow nodes
  const nodes: Node[] = Object.values(graph.services).map((service) => {
    const nodeWithPosition = dagreGraph.node(service.id);
    return {
      id: service.id,
      type: 'serviceNode',
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
      data: { ...service },
    };
  });

  // 5. Create ReactFlow edges
  const edges: Edge[] = graph.edges.map((edge) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    type: 'dependencyEdge',
    animated: true,
    style: { stroke: 'var(--foreground)', strokeWidth: 1.5, opacity: 0.5 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  }));

  return { nodes, edges };
}
