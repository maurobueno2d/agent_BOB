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
  onReconnect: (oldEdge: any, newConnection: any) => void;
  layout: 'vertical' | 'horizontal';
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
      
      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
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
              type: 'step',
              animated: true,
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
              const newSource = edge.target;
              const newTarget = edge.source;
              const newSourceHandle = edge.targetHandle?.replace('-target', '-source');
              const newTargetHandle = edge.sourceHandle?.replace('-source', '-target');

              return {
                ...edge,
                source: newSource,
                target: newTarget,
                sourceHandle: newSourceHandle,
                targetHandle: newTargetHandle,
              };
            }
            return edge;
          }),
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

