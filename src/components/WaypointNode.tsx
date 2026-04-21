import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const DeleteButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    className="nodrag node-delete-btn" 
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }} 
    title="Delete Waypoint"
    style={{
      position: 'absolute',
      top: -18,
      right: -18,
      width: 16,
      height: 16,
      fontSize: '10px',
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#ff4d4d',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      zIndex: 1000
    }}
  >
    ×
  </button>
);

export const WaypointNode = memo(({ id, selected, deleteNode }: any) => {
  return (
    <div 
      className="custom-node waypoint-node"
      style={{
        width: 8,
        height: 8,
        background: selected ? '#0f0' : '#888',
        borderRadius: '50%',
        minWidth: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'move',
        boxShadow: '0 0 4px rgba(0,0,0,0.5)',
        position: 'relative' // To position the delete button
      }}
    >
      {selected && <DeleteButton onClick={() => deleteNode(id)} />}
      
      <Handle type="target" position={Position.Top} id={`${id}-target`} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id={`${id}-source`} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} id={`${id}-target-h`} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id={`${id}-source-h`} style={{ opacity: 0 }} />
    </div>
  );
});
