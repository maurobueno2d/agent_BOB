import React, { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { useStore } from '../store';

const RobotIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="10" y="10" width="20" height="20" />
    <circle cx="16" cy="18" r="2" fill="currentColor" />
    <circle cx="24" cy="18" r="2" fill="currentColor" />
    <line x1="15" y1="24" x2="25" y2="24" />
    <rect x="18" y="5" width="4" height="5" />
  </svg>
);

const HumanIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="20" cy="12" r="7" />
    <path d="M10 35c0-10 20-10 20 0" />
    <line x1="20" y1="19" x2="20" y2="28" />
  </svg>
);

const DiamondIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 5 L35 20 L20 35 L5 20 Z" />
  </svg>
);

const DeleteButton = ({ onClick }: { onClick: () => void }) => (
  <button className="nodrag node-delete-btn" onClick={onClick} title="Delete Node">
    ×
  </button>
);

/* 
  Universal Port: Renders two handles (source and target) at the same position.
  This allows bi-directional connections and simplifies user experience.
*/
const UniversalPort = ({ position, id, style = {} }: { position: Position, id: string, style?: React.CSSProperties }) => (
  <>
    <Handle 
      type="target" 
      position={position} 
      id={`${id}-target`} 
      style={{ ...style, zIndex: 1 }} 
    />
    <Handle 
      type="source" 
      position={position} 
      id={`${id}-source`} 
      style={{ ...style, zIndex: 2, opacity: 0 }} /* Hidden but draggable */
    />
  </>
);

export const AgentNode = memo(({ data, id, updateNodeLabel, deleteNode }: any) => {
  const layout = useStore((state) => state.layout);
  const isVertical = layout === 'vertical';

  return (
    <div className="custom-node">
      <DeleteButton onClick={() => deleteNode(id)} />
      
      {/* PRIMARY FLOW PORTS */}
      <UniversalPort position={isVertical ? Position.Top : Position.Left} id="main-in" />
      <UniversalPort position={isVertical ? Position.Bottom : Position.Right} id="main-out" />
      
      {/* SECONDARY/INSTRUCTION PORTS (GREEN) */}
      <UniversalPort 
        position={isVertical ? Position.Left : Position.Top} 
        id="side-in" 
        style={{ backgroundColor: '#0f0', border: 'none' }}
      />
      <UniversalPort 
        position={isVertical ? Position.Right : Position.Bottom} 
        id="side-out" 
        style={{ backgroundColor: '#0f0', border: 'none' }}
      />

      <div className="custom-node-icon">
        <RobotIcon />
      </div>
      <input
        className="nodrag custom-node-input"
        value={data.label}
        onChange={(e) => updateNodeLabel(id, e.target.value)}
      />
    </div>
  );
});

export const InstructionNode = memo(({ data, id, updateNodeData, deleteNode }: any) => {
  const layout = useStore((state) => state.layout);
  const isVertical = layout === 'vertical';

  return (
    <div className="custom-node">
      <DeleteButton onClick={() => deleteNode(id)} />
      
      {/* PRIMARY PORTS */}
      <UniversalPort position={isVertical ? Position.Top : Position.Left} id="main-in" />
      <UniversalPort position={isVertical ? Position.Bottom : Position.Right} id="main-out" />
      
      {/* SECONDARY PORTS (GREEN) */}
      <UniversalPort 
        position={isVertical ? Position.Left : Position.Top} 
        id="side-in" 
        style={{ backgroundColor: '#0f0', border: 'none' }}
      />
      <UniversalPort 
        position={isVertical ? Position.Right : Position.Bottom} 
        id="side-out" 
        style={{ backgroundColor: '#0f0', border: 'none' }}
      />

      <div className="custom-node-label">INSTRUCTIONS</div>
      <div className="custom-node-content">
        <textarea
          className="nodrag"
          defaultValue={data.content}
          onChange={(e) => updateNodeData(id, { content: e.target.value })}
          placeholder="Type orders here..."
        />
      </div>
    </div>
  );
});

export const HITLNode = memo(({ data, id, updateNodeLabel, deleteNode }: any) => {
  const layout = useStore((state) => state.layout);
  const isVertical = layout === 'vertical';

  return (
    <div className="custom-node hitl-node">
      <DeleteButton onClick={() => deleteNode(id)} />
      <UniversalPort position={isVertical ? Position.Top : Position.Left} id="main-in" />
      <div className="custom-node-icon">
        <HumanIcon />
      </div>
      <div className="custom-node-label" style={{ borderBottom: 'none' }}>HITL - </div>
      <input
        className="nodrag custom-node-input"
        value={data.label}
        onChange={(e) => updateNodeLabel(id, e.target.value)}
      />
      <UniversalPort position={isVertical ? Position.Bottom : Position.Right} id="main-out" />
    </div>
  );
});

export const WildcardNode = memo(({ data, id, updateNodeLabel, deleteNode }: any) => {
  const layout = useStore((state) => state.layout);
  const isVertical = layout === 'vertical';

  return (
    <div className="custom-node">
      <DeleteButton onClick={() => deleteNode(id)} />
      <UniversalPort position={isVertical ? Position.Top : Position.Left} id="main-in" />
      <div className="custom-node-icon">
        <DiamondIcon />
      </div>
      <input
        className="nodrag custom-node-input"
        value={data.label}
        onChange={(e) => updateNodeLabel(id, e.target.value)}
      />
      <UniversalPort position={isVertical ? Position.Bottom : Position.Right} id="main-out" />
    </div>
  );
});

export const AnnotationNode = memo(({ data, id, updateNodeData, deleteNode }: any) => {
  return (
    <div className="custom-node annotation-node">
      <DeleteButton onClick={() => deleteNode(id)} />
      <textarea
        className="nodrag annotation-textarea"
        defaultValue={data.content}
        onChange={(e) => updateNodeData(id, { content: e.target.value })}
        placeholder="Type annotation/title..."
      />
    </div>
  );
});
