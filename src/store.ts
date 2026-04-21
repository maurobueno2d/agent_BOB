import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from '@xyflow/react';

export type Project = {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  layout: 'vertical' | 'horizontal';
  lastSaved: number;
};

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  projects: Project[];
  currentProjectId: string | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (type: string) => void;
  deleteNode: (id: string) => void;
  updateNodeLabel: (id: string, label: string) => void;
  updateNodeData: (id: string, data: any) => void;
  toggleLayout: () => void;

  invertEdge: (id: string) => void;
  splitEdge: (edgeId: string, position: { x: number, y: number }) => void;
  onReconnect: (oldEdge: any, newConnection: any) => void;
  onNodesDelete: (deletedNodes: any[]) => void;
  layout: 'vertical' | 'horizontal';
  selectedNodeIds: string[];
  setSelectedNodeIds: (ids: string[]) => void;
  groupNodes: (nodeIds: string[], backdropId: string) => void;
  ungroupNodes: (nodeIds: string[]) => void;
  exportJSON: () => void;
  // Project Actions
  saveProject: () => void;
  loadProject: (id: string) => void;
  createProject: (name: string) => void;
  deleteProject: (id: string) => void;
};

export const useStore = create<RFState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      projects: [],
      currentProjectId: null,
      layout: 'vertical',
      selectedNodeIds: [],
      
      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      setSelectedNodeIds: (ids) => set({ selectedNodeIds: ids }),
      groupNodes: (nodeIds, backdropId) => {
        set(state => {
          const selectedNodes = state.nodes.filter(n => nodeIds.includes(n.id));
          if (selectedNodes.length === 0) return state;

          // 1. Calculate boundaries of selected nodes
          const minX = Math.min(...selectedNodes.map(n => n.position.x));
          const minY = Math.min(...selectedNodes.map(n => n.position.y));
          const maxX = Math.max(...selectedNodes.map(n => n.position.x + (n.measured?.width || 250)));
          const maxY = Math.max(...selectedNodes.map(n => n.position.y + (n.measured?.height || 150)));

          // 2. Create Backdrop node
          const backdropNode = {
            id: backdropId,
            type: 'backdrop',
            position: { x: minX - 40, y: minY - 60 },
            data: { label: 'Grupo Configurable' },
            style: { width: (maxX - minX) + 80, height: (maxY - minY) + 100, zIndex: -1 },
          };

          // 3. Update children to have relative positions to the new parent
          const updatedNodes = state.nodes.map(node => {
            if (nodeIds.includes(node.id)) {
              return {
                ...node,
                parentId: backdropId,
                // Make position relative to exactly where the backdrop is
                position: {
                  x: node.position.x - backdropNode.position.x,
                  y: node.position.y - backdropNode.position.y
                }
              };
            }
            return node;
          });

          // En React Flow, LOS NODOS PADRE DEBEN ESTAR ANTES QUE LOS HIJOS en el arreglo
          const finalNodes = [
            ...updatedNodes.filter(n => !nodeIds.includes(n.id)), 
            backdropNode, 
            ...updatedNodes.filter(n => nodeIds.includes(n.id))
          ];

          return { 
            nodes: finalNodes,
            selectedNodeIds: [] // Limpiar seleccion tras agrupar
          };
        });
      },
      ungroupNodes: (backdropId) => {
        set(state => {
          const backdrop = state.nodes.find(n => n.id === backdropId);
          if (!backdrop) return state;

          const updatedNodes = state.nodes.filter(n => n.id !== backdropId).map(node => {
            // Restore absolute positions for children
            if (node.parentId === backdropId) {
              const { parentId, ...rest } = node;
              return {
                ...rest,
                position: {
                  x: node.position.x + backdrop.position.x,
                  y: node.position.y + backdrop.position.y
                }
              } as any;
            }
            return node;
          });
          return { nodes: updatedNodes };
        });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection: Connection) => {
        set({
          edges: addEdge(
            {
              ...connection,
              type: 'custom',
              animated: true,
              data: {
                // Determine direction based on node layout or source/target IDs.
                // For a simpler approach, if target > source lexically it might be forward,
                // but let's just default to forward. The user can invert it.
                direction: 'forward',
                waypoints: []
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#fff',
              },
            },
            get().edges
          ),
        });
      },
      onReconnect: (oldEdge: any, newConnection: any) => {
        set({
          edges: get().edges.map((edge) => {
            if (edge.id === oldEdge.id) {
              return {
                ...edge,
                ...newConnection,
              };
            }
            return edge;
          }),
        });
      },
      onNodesDelete: (deletedNodes: any[]) => {
        const deletedIds = new Set(deletedNodes.map(n => n.id));
        set({
          nodes: get().nodes.filter((node) => !deletedIds.has(node.id)),
          edges: get().edges.filter((edge) => !deletedIds.has(edge.source) && !deletedIds.has(edge.target)),
        });
      },
      addNode: (type: string) => {
        const id = `${type}-${Date.now()}`;
        const newNode = {
          id,
          type,
          data: { label: `New ${type}`, content: '' },
          position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
        };
        set({
          nodes: [...get().nodes, newNode],
        });
      },
      deleteNode: (id: string) => {
        set({
          nodes: get().nodes.filter((node) => node.id !== id),
          edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
        });
      },
      invertEdge: (id: string) => {
        set({
          edges: get().edges.map((edge) => {
            if (edge.id === id) {
              const currentDirection = edge.data?.direction || 'forward';
              const newDirection = currentDirection === 'forward' ? 'return' : 'forward';

              return {
                ...edge,
                data: {
                  ...edge.data,
                  direction: newDirection
                }
              };
            }
            return edge;
          }),
        });
      },
      splitEdge: (edgeId: string, position: { x: number, y: number }) => {
        set(state => {
          const edge = state.edges.find(e => e.id === edgeId);
          if (!edge) return state;

          const waypointId = `waypoint-${Date.now()}`;
          const waypointNode = {
            id: waypointId,
            type: 'waypoint',
            position: { x: position.x - 6, y: position.y - 6 },
            data: {},
          };

          const edgePart1 = {
            ...edge,
            id: `${edge.id}-part1`,
            target: waypointId,
            targetHandle: `${waypointId}-target`,
          };

          const edgePart2 = {
            ...edge,
            id: `${edge.id}-part2`,
            source: waypointId,
            sourceHandle: `${waypointId}-source`,
          };

          return {
            nodes: [...state.nodes, waypointNode],
            edges: [...state.edges.filter(e => e.id !== edgeId), edgePart1, edgePart2]
          };
        });
      },
      toggleLayout: () => {
        set({
          layout: get().layout === 'vertical' ? 'horizontal' : 'vertical',
        });
      },
      updateNodeLabel: (id: string, label: string) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              return { ...node, data: { ...node.data, label } };
            }
            return node;
          }),
        });
      },
      updateNodeData: (id: string, data: any) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              return { ...node, data: { ...node.data, ...data } };
            }
            return node;
          }),
        });
      },

      // Project Actions
      saveProject: () => {
        const { currentProjectId, nodes, edges, projects, layout } = get();
        
        // Initial Migration Check
        if (!currentProjectId && nodes.length > 0 && projects.length === 0) {
          const defaultId = 'default-project';
          const defaultProject: Project = {
            id: defaultId,
            name: 'DEFAULT PROJECT',
            nodes,
            edges,
            layout,
            lastSaved: Date.now(),
          };
          set({
            projects: [defaultProject],
            currentProjectId: defaultId,
          });
          return;
        }

        if (!currentProjectId) {
          // If no project selected, ask to create one (handled in UI)
          return;
        }

        set({
          projects: projects.map(p => 
            p.id === currentProjectId 
              ? { ...p, nodes, edges, layout, lastSaved: Date.now() } 
              : p
          )
        });
      },

      loadProject: (id: string) => {
        const project = get().projects.find(p => p.id === id);
        if (project) {
          set({
            currentProjectId: project.id,
            nodes: project.nodes,
            edges: project.edges,
            layout: project.layout,
          });
        }
      },

      createProject: (name: string) => {
        const newProject: Project = {
          id: `project-${Date.now()}`,
          name: name.toUpperCase(),
          nodes: [],
          edges: [],
          layout: 'vertical',
          lastSaved: Date.now(),
        };
        set({
          projects: [...get().projects, newProject],
          currentProjectId: newProject.id,
          nodes: [],
          edges: [],
          layout: 'vertical',
        });
      },

      deleteProject: (id: string) => {
        const { currentProjectId, projects } = get();
        set({
          projects: projects.filter(p => p.id !== id),
          currentProjectId: currentProjectId === id ? null : currentProjectId,
          // If we deleted the current one, clean the canvas
          ...(currentProjectId === id ? { nodes: [], edges: [], layout: 'vertical' } : {})
        });
      },

      exportJSON: () => {
        const { nodes, edges } = get();
        const exportData = {
          agents: nodes.filter((n) => n.type === 'agent').map((n) => ({ id: n.id, name: n.data.label })),
          instructions: nodes.filter((n) => n.type === 'instruction').map((n) => ({ id: n.id, content: n.data.content })),
          hitl: nodes.filter((n) => n.type === 'hitl').map((n) => ({ id: n.id, label: n.data.label })),
          wildcards: nodes.filter((n) => n.type === 'wildcard').map((n) => ({ id: n.id, label: n.data.label })),
          annotations: nodes.filter((n) => n.type === 'annotation').map((n) => ({ id: n.id, content: n.data.content })),
          graph: edges.map((e) => ({ from: e.source, to: e.target })),
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agent-architecture-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
    }),
    {
      name: 'agent-architect-storage',
    }
  )
);

