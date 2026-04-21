import React, { useMemo, useCallback, useRef } from 'react';
import { ReactFlow, Background, Controls, useReactFlow } from '@xyflow/react';
import { useStore } from '../store';
import { AgentNode, InstructionNode, HITLNode, WildcardNode, AnnotationNode } from './CustomNodes';
import { BackdropNode } from './BackdropNode';
import { WaypointNode } from './WaypointNode';
import { CustomEdge } from './CustomEdge';
import { Toolbar } from './Toolbar';
import { HelpPanel } from './HelpPanel';
import { ProjectSidebar } from './ProjectSidebar';

export function FlowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onReconnect,
    onNodesDelete,
    updateNodeData,
    updateNodeLabel,
    deleteNode,
    invertEdge,
    splitEdge,
    currentProjectId,
    setSelectedNodeIds,
    selectedNodeIds,
  } = useStore();

  const nodeTypes = useMemo(() => ({
    agent: (props: any) => <AgentNode {...props} updateNodeLabel={updateNodeLabel} deleteNode={deleteNode} />,    
    instruction: (props: any) => <InstructionNode {...props} updateNodeData={updateNodeData} deleteNode={deleteNode} />,    
    hitl: (props: any) => <HITLNode {...props} updateNodeLabel={updateNodeLabel} deleteNode={deleteNode} />,    
    wildcard: (props: any) => <WildcardNode {...props} updateNodeLabel={updateNodeLabel} deleteNode={deleteNode} />,    
    annotation: (props: any) => <AnnotationNode {...props} updateNodeData={updateNodeData} deleteNode={deleteNode} />,
    backdrop: BackdropNode,
    waypoint: (props: any) => <WaypointNode {...props} deleteNode={deleteNode} />,
  }), [updateNodeLabel, updateNodeData, deleteNode]);

  const edgeTypes = useMemo(() => ({
    custom: CustomEdge,
  }), []);

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

  // Manejo de la seleccion de React Flow
  const onSelectionChange = useCallback((params: any) => {
    const elementos = params.nodes || [];
    const nodeIds = elementos.filter((e: any) => e.id).map((e: any) => e.id) || [];
    const selectionSet = new Set(nodeIds);
    // Solo actualizar si hay cambios reales para evitar re-renders excesivos
    useStore.setState((state) => {
      if (state.selectedNodeIds.length === selectionSet.size && state.selectedNodeIds.every(id => selectionSet.has(id))) {
        return state;
      }
      return { selectedNodeIds: nodeIds };
    });
  }, []);

  const onEdgeDoubleClick = useCallback(
    (event: React.MouseEvent, edge: any) => {
      // Necesitamos proyectar las coordenadas de la pantalla al canvas de ReactFlow
      // Obtener el div del viewport usando getBoundingClientRect
      const reactFlowBounds = document.querySelector('.react-flow__renderer')?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      // Obtener el estado interno de ReactFlow para la transformacion (zoom/pan)
      // Como estamos dentro de un hook nativo no tenemos 'screenToFlowPosition', 
      // pero usamos una version manual simplificada para crear puntos:
      const zoom = document.querySelector('.react-flow__viewport') as HTMLElement;
      const transformString = zoom?.style.transform;
      
      let scale = 1;
      let tx = 0, ty = 0;
      if (transformString) {
        const translateMatch = transformString.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
        const scaleMatch = transformString.match(/scale\(([^)]+)\)/);
        if (translateMatch) {
          tx = parseFloat(translateMatch[1]);
          ty = parseFloat(translateMatch[2]);
        }
        if (scaleMatch) {
          scale = parseFloat(scaleMatch[1]);
        }
      }

      const position = {
        x: (event.clientX - reactFlowBounds.left - tx) / scale,
        y: (event.clientY - reactFlowBounds.top - ty) / scale,
      };

      splitEdge(edge.id, position);
    },
    [splitEdge]
  );

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
          onNodesDelete={onNodesDelete}
          onEdgeClick={(_: any, edge) => invertEdge(edge.id)}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onSelectionChange={onSelectionChange}
          selectionOnDrag={true}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{ type: 'custom' }}
          colorMode="dark"
          fitView
          defaultMarkerColor="#ffffff"
          snapToGrid={true}
          snapGrid={[20, 20]}
        >
          <Background color="#333" gap={20} />
          <Controls />
          <Toolbar />
          <HelpPanel />
        </ReactFlow>
      </div>
    </div>
  );
}
