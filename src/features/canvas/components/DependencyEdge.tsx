import { BaseEdge, type EdgeProps, getSmoothStepPath } from '@xyflow/react';
import { memo } from 'react';
import { useCanvasStore } from '@/features/canvas';

export const DependencyEdge = memo(({
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const hoveredNode = useCanvasStore((s) => s.hoveredNode);
  const isHighlighted = hoveredNode === source || hoveredNode === target;
  const isDimmed = hoveredNode && !isHighlighted;

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeStyle = {
    ...style,
    stroke: isHighlighted ? 'var(--primary)' : 'var(--foreground)',
    strokeWidth: isHighlighted ? 3 : 1.5,
    opacity: isDimmed ? 0.1 : (isHighlighted ? 1 : 0.5),
    transition: 'all 0.3s ease-in-out',
    zIndex: isHighlighted ? 10 : 0,
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStyle} />
    </>
  );
});

DependencyEdge.displayName = 'DependencyEdge';
