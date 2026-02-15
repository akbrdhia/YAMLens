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
import { layoutGraph } from '../utils/layout-grid';

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
