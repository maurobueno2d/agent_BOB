import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { useStore } from '../store';

export const BackdropNode = memo(({ id, data, selected }: any) => {
  const ungroupNodes = useStore((state) => state.ungroupNodes);

  return (
    <>
      <NodeResizer 
        color="#888" 
        isVisible={selected} 
        minWidth={150} 
        minHeight={150} 
      />
      <div 
        style={{
          width: '100%',
          height: '100%',
          background: 'rgba(200, 200, 200, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 8,
          zIndex: -1,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px' }}>
          {data.label && (
            <div style={{ color: '#aaa', fontSize: 12, fontWeight: 'bold' }}>
              {data.label}
            </div>
          )}
          <button 
            className="nodrag node-delete-btn" 
            onClick={() => ungroupNodes(id)} 
            title="Desagrupar"
            style={{ position: 'relative', top: 0, right: 0 }}
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
});
