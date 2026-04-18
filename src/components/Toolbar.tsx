import React, { useCallback } from 'react';
import { Panel, useReactFlow } from '@xyflow/react';
import { toSvg } from 'html-to-image';
import { useStore } from '../store';

interface ToolbarProps {
  onExportJSON: () => void;
}

export function Toolbar() {
  const { 
    addNode, 
    exportJSON, 
    toggleLayout, 
    layout, 
    projects, 
    currentProjectId 
  } = useStore();
  
  const { fitView } = useReactFlow();

  const currentProject = projects.find((p) => p.id === currentProjectId);

  const exportSVG = useCallback(() => {
    const filter = (node: any) => {
      if (
        node?.classList?.contains('react-flow__panel') ||
        node?.classList?.contains('react-flow__controls') ||
        node?.classList?.contains('react-flow__attribution') ||
        node?.classList?.contains('project-sidebar')
      ) {
        return false;
      }
      return true;
    };

    fitView();
    setTimeout(() => {
      const flowElement = document.querySelector('.react-flow__viewport') as HTMLElement;
      if (!flowElement) return;

      const fileName = `${currentProject?.name || 'architecture'}-${Date.now()}.svg`.toLowerCase().replace(/\s+/g, '-');

      toSvg(flowElement, {
        filter,
        backgroundColor: '#000',
      })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((err) => {
          console.error('Failed to export SVG', err);
        });
    }, 200);
  }, [fitView, currentProject]);

  return (
    <Panel position="top-left" className="ui-overlay">
      <div className="button-group">
        <button className="btn-console" onClick={() => addNode('agent')}>+ Agent</button>
        <button className="btn-console" onClick={() => addNode('instruction')}>+ Instruction</button>
        <button className="btn-console" onClick={() => addNode('hitl')}>+ HITL</button>
        <button className="btn-console" onClick={() => addNode('wildcard')}>+ Diamond</button>
        <button className="btn-console" onClick={() => addNode('annotation')}>+ Text</button>
      </div>
      
      <div className="divider-v" />
      
      <div className="button-group">
        <button 
          className="btn-console" 
          onClick={toggleLayout}
          style={{ backgroundColor: layout === 'horizontal' ? '#333' : '#000' }}
        >
          LAYOUT: {layout.toUpperCase()}
        </button>
        
        <button className="btn-console btn-highlight" onClick={exportSVG}>
          SVG EXPORT
        </button>
        
        <button className="btn-console btn-dim" onClick={exportJSON}>
          JSON
        </button>
      </div>
    </Panel>
  );
}
