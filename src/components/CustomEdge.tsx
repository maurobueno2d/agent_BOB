import React from 'react';
import { BaseEdge, getBezierPath, EdgeProps, EdgeLabelRenderer } from '@xyflow/react';

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  // Determines color based on direction / type. Usually forward is blue, back is red.
  const isReturn = data?.direction === 'return';
  const edgeColor = isReturn ? '#ff4d4d' : data?.direction === 'forward' ? '#4da6ff' : '#fff';

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: isReturn ? targetX : sourceX,
    sourceY: isReturn ? targetY : sourceY,
    sourcePosition: isReturn ? targetPosition : sourcePosition,
    targetX: isReturn ? sourceX : targetX,
    targetY: isReturn ? sourceY : targetY,
    targetPosition: isReturn ? sourcePosition : targetPosition,
  });
  const customStyle = { ...style, stroke: edgeColor, strokeWidth: 2 };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={customStyle} id={id} />
      {data?.waypoints && data.waypoints.map((wp: any, index: number) => (
        <EdgeLabelRenderer key={`${id}-wp-${index}`}>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${wp.x}px,${wp.y}px)`,
              background: '#444',
              width: 10,
              height: 10,
              borderRadius: '50%',
              border: `1px solid ${edgeColor}`,
              pointerEvents: 'all',
              cursor: 'move',
            }}
            className="nodrag nopan"
            onPointerDown={(e) => {
              // We dispatch a custom event or let ReactFlow handle node drag if we made waypoints nodes.
              // For a simple implementation, an invisible node is generally easier for routing, but here we just render the points 
              // To hook into drag, we need to handle window mousemove.
              e.stopPropagation();
            }}
          />
        </EdgeLabelRenderer>
      ))}
    </>
  );
}
