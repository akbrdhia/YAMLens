import { ReactFlow, Background, Controls, MiniMap, type ColorMode, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // Import styles
import { useTheme } from 'next-themes';
import { useCanvasStore } from '../store/useCanvasStore';
import { ServiceNode } from './ServiceNode';
import { NetworkNode } from './NetworkNode';
import { DependencyEdge } from './DependencyEdge';

// Register node types
const nodeTypes = {
  serviceNode: ServiceNode,
  networkNode: NetworkNode,
};

const edgeTypes = {
  dependencyEdge: DependencyEdge,
};

export function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setHoveredNode } = useCanvasStore();
  const { resolvedTheme } = useTheme();

  return (
    <div id="react-flow-canvas" className="h-full w-full bg-background/50 font-mono">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={() => setHoveredNode(null)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        className="bg-background"
        colorMode={resolvedTheme as ColorMode}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={3.5}
          color="var(--muted-foreground)"
          className="opacity-25"
        />
        <Controls className="bg-card border-border fill-foreground" />
        <MiniMap className="bg-card border-border" nodeColor="var(--primary)" />
      </ReactFlow>
    </div>
  );
}
