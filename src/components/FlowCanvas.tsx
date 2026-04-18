import React, { useMemo, useCallback, useRef } from 'react';
import { ReactFlow, Background, Controls, useReactFlow } from '@xyflow/react';
import { useStore } from '../store';
import { AgentNode, InstructionNode, HITLNode, WildcardNode, AnnotationNode } from './CustomNodes';
import { Toolbar } from './Toolbar';
import { ProjectSidebar } from './ProjectSidebar';

export function FlowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onReconnect,
    updateNodeData,
    updateNodeLabel,
    deleteNode,
    invertEdge,
    currentProjectId,
  } = useStore();

  const nodeTypes = useMemo(() => ({
    agent: (props: any) => <AgentNode {...props} updateNodeLabel={updateNodeLabel} deleteNode={deleteNode} />,
    instruction: (props: any) => <InstructionNode {...props} updateNodeData={updateNodeData} deleteNode={deleteNode} />,
    hitl: (props: any) => <HITLNode {...props} updateNodeLabel={updateNodeLabel} deleteNode={deleteNode} />,
    wildcard: (props: any) => <WildcardNode {...props} updateNodeLabel={updateNodeLabel} deleteNode={deleteNode} />,
    annotation: (props: any) => <AnnotationNode {...props} updateNodeData={updateNodeData} deleteNode={deleteNode} />,
  }), [updateNodeLabel, updateNodeData, deleteNode]);

  const edgeReconnectTimeout = useRef<any>(null);

  const onReconnectStart = useCallback(() => {
    if (edgeReconnectTimeout.current) clearTimeout(edgeReconnectTimeout.current);
  }, []);

  const onReconnectEnd = useCallback((_: any, edge: any) => {
    edgeReconnectTimeout.current = setTimeout(() => {
      onEdgesChange([{ id: edge.id, type: 'remove' }]);
    }, 100);
  }, [onEdgesChange]);

  const handleReconnect = useCallback((oldEdge: any, newConnection: any) => {
    if (edgeReconnectTimeout.current) clearTimeout(edgeReconnectTimeout.current);
    onReconnect(oldEdge, newConnection);
  }, [onReconnect]);

  return (
    <div className="app-container">
      <ProjectSidebar />
      <div className="canvas-container">
        {!currentProjectId && (
          <div className="overlay-msg">
            <div className="msg-box">
              <p>SELECT OR CREATE A PROJECT IN THE SIDEBAR TO START</p>
            </div>
          </div>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={handleReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          onEdgeClick={(_: any, edge) => invertEdge(edge.id)}
          nodeTypes={nodeTypes}
          colorMode="dark"
          fitView
          defaultMarkerColor="#ffffff"
          snapToGrid={true}
          snapGrid={[20, 20]}
        >
          <Background color="#333" gap={20} />
          <Controls />
          <Toolbar />
        </ReactFlow>
      </div>
    </div>
  );
}
