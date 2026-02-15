import { BaseEdge, EdgeProps, getSmoothStepPath } from '@xyflow/react';
import { memo } from 'react';

export const DependencyEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {/* Optional: Add label renderer here if needed later */}
    </>
  );
});

DependencyEdge.displayName = 'DependencyEdge';
