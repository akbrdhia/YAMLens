import type { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';
import type { ComposeGraph } from '@/features/parser/types';

export interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setGraph: (graph: ComposeGraph) => void;
}
