import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // Import styles
import { useCanvasStore } from '../store/useCanvasStore';
import { ServiceNode } from './ServiceNode';
import { DependencyEdge } from './DependencyEdge';

// Register node types
const nodeTypes = {
  serviceNode: ServiceNode,
};

const edgeTypes = {
  dependencyEdge: DependencyEdge,
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
        edgeTypes={edgeTypes}
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
