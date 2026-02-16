import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';
import type { ComposeGraph } from '@/features/parser/types';

// Node dimensions (approximate for Cards)
const NODE_WIDTH = 250;
const NODE_HEIGHT = 200; // Increased height for enhanced card details

export function layoutGraph(graph: ComposeGraph, direction: 'TB' | 'LR' = 'TB'): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph({ compound: true });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: direction, ranksep: 60, nodesep: 40 });

  const nodes: Node[] = [];

  // 1. Create Network (Group) Nodes in Dagre
  // We use the collected networks list from the parser
  const networks = graph.networks || [];
  networks.forEach((net) => {
    dagreGraph.setNode(net, { label: net, clusterLabelPos: 'top', width: 100, height: 100 });
  });

  // 2. Add Service Nodes to Dagre
  Object.values(graph.services).forEach((service) => {
    dagreGraph.setNode(service.id, { width: NODE_WIDTH, height: NODE_HEIGHT });

    // Assign parent (Primary Network)
    // If service has networks, use the first one as the grouping parent
    if (service.networks && service.networks.length > 0) {
      dagreGraph.setParent(service.id, service.networks[0]);
    }
  });

  // 3. Add Edges to Dagre
  graph.edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // 4. Compute layout
  dagre.layout(dagreGraph);

  // 5. Transform Network Nodes (Parents)
  networks.forEach((net) => {
    const nodeWithPosition = dagreGraph.node(net);
    // Safety check if dagre dropped the node (shouldn't happen)
    if (!nodeWithPosition) return;

    nodes.push({
      id: net,
      type: 'networkNode', // We need to create this component
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
      style: {
        width: nodeWithPosition.width,
        height: nodeWithPosition.height,
      },
      data: { label: net },
    });
  });

  // 6. Transform Service Nodes (Children)
  Object.values(graph.services).forEach((service) => {
    const nodeWithPosition = dagreGraph.node(service.id);
    const parentId = service.networks?.[0];

    let position = {
      x: nodeWithPosition.x - NODE_WIDTH / 2,
      y: nodeWithPosition.y - NODE_HEIGHT / 2,
    };

    // If it has a parent, ReactFlow expects position relative to parent
    if (parentId) {
      const parentNode = dagreGraph.node(parentId);
      if (parentNode) {
        const parentX = parentNode.x - parentNode.width / 2;
        const parentY = parentNode.y - parentNode.height / 2;

        position = {
          x: position.x - parentX,
          y: position.y - parentY,
        };
      }
    }

    nodes.push({
      id: service.id,
      type: 'serviceNode',
      position,
      data: { ...service },
      parentId: parentId, // ReactFlow parent assignment
      extent: 'parent', // Optional: keeps child inside parent
    });
  });

  // 7. Create ReactFlow edges
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
