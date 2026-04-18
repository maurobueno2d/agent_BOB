# Design: Agent Architect V1

## High-Level Architecture
- **Frontend**: Vite + React + TypeScript.
- **State Management**: **Zustand**. 
  - *Why*: Essential for decoupled state management in React Flow. Handles nodes, edges, and complex updates (like dragging) efficiently.
- **Persistence**: Zustand `persist` middleware (LocalStorage).
- **Communication**: React Flow custom nodes and handles.

## Component Breakdown

### 1. Main Canvas (`FlowCanvas.tsx`)
- Container for `<ReactFlow>`.
- Configures `colorMode="dark"`, `nodeTypes`, and `edgeTypes`.
- Implements `onNodesChange`, `onEdgesChange`, and `onConnect`.

### 2. Custom Nodes
- `AgentNode`: Displays a centered SVG robot face (monospace style).
- `InstructionNode`: Contains a standard `<textarea>` styled with high-contrast borders and mono font.
- `HITLNode`: Displays a "Human" icon or diamond shape for decision points.

### 3. Controls (`ControlPanel.tsx`)
- Floating toolbar with buttons for:
  - Add Node (Type: Agent | Instruction | HITL).
  - Export (Triggers `ExportUtils`).
  - Clear Workspace.

## Data Schema (Export)
The internal React Flow state is "messy" (contains layout info, internal IDs, etc.). The export logic will map it to:
```typescript
interface AgentArchitecture {
  agents: Array<{ id: string, name: string }>;
  instructions: Array<{ id: string, content: string }>;
  hitlNodes: Array<{ id: string, label: string }>;
  connections: Array<{ source: string, target: string }>;
}
```

## Styling Strategy
- Base CSS: `index.css`.
- Colors:
  - Background: `#000000`
  - Node Border: `#ffffff` (2px)
  - Text: `#ffffff`
  - Connection Line: `#ffffff`
- Typography: `family: 'JetBrains Mono', 'Courier New', monospace;`
