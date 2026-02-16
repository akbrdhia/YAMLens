import type { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';
import type { ComposeGraph } from '@/features/parser/types';

export interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setGraph: (graph: ComposeGraph) => void;
  hoveredNode: string | null;
  setHoveredNode: (nodeId: string | null) => void;
  detailsNodeId: string | null;
  setDetailsNodeId: (nodeId: string | null) => void;
}
