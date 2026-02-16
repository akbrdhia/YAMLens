import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react';
import type { CanvasState } from '../types';
import { layoutGraph } from '../utils/layout-dagre';

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
  hoveredNode: null,
  setHoveredNode: (nodeId) => set({ hoveredNode: nodeId }),
  detailsNodeId: null,
  setDetailsNodeId: (nodeId) => set({ detailsNodeId: nodeId }),
}));
