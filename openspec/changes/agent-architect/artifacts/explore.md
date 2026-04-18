# Exploration: Agent Architect

## Goal
Design a local, visual, minimalist CAD/Miro-like agent designer with a monotone console aesthetic.

## Tech Stack Analysis
- **Framework**: Vite + React + TypeScript.
- **Canvas Library**: **React Flow**.
  - *Pros*: Built-in zooming/panning, edge routing, custom node API. Handles the "persistent connection" requirement perfectly.
  - *Cons*: Slight overhead, but negligible for a local tool.
- **Styling**: Vanilla CSS. High-contrast theme using pure blacks (`#000`), whites (`#fff`), and subtle grays (`#333`).
- **Icons**: Minimalist SVG line-art for robot faces.

## Aesthetics (Monotone Console)
Inspired by retro-future CAD systems and terminal interfaces:
- **Background**: Pure black or very dark gray with a subtle dot/grid pattern.
- **Typography**: Monospaced (JetBrains Mono or Roboto Mono).
- **Nodes**: Boxy, crisp borders (2px), no rounded corners.
- **Edges**: Simple white lines, no arrows (or very minimal ones).

![Mockup](file:///C:/Users/mauri/.gemini/antigravity/brain/417f199e-b57a-4586-bc15-a738c7095f40/agent_architect_monotone_ui_mockup_1776454107035.png)

## Core Mechanics
1. **Drag and Drop**: React Flow built-in.
2. **Connectivity**: Users drag from an "Out" handle on one node to an "In" handle on another.
3. **Node Types**:
   - **Agent**: The core robot node with its identity.
   - **Instruction**: Text blocks for detailed prompts/commands.
   - **HITL (Human In The Loop)**: Validation/Decision points where a human must intervene.
3. **Export Utility**:
   - A dedicated button to serialize the state.
   - The JSON will clean the React Flow metadata to provide a pure architecture map:
     ```json
     {
       "agents": [{ "id": "1", "name": "Agent A", "type": "robot" }],
       "instructions": [{ "id": "2", "content": "Wait for signal" }],
       "hitl": [{ "id": "3", "label": "Review Results" }],
       "graph": [{ "from": "1", "to": "3" }, { "from": "3", "to": "2" }]
     }
     ```
4. **LocalStorage**: Sync state to `agent_architect_autosave` on every change.

## Risks & Considerations
- **Line Crossing**: In complex architectures, simple straight lines might get messy. Orthogonal (step) lines are better for a "CAD" look.
- **Text Bloat**: Long instructions in nodes might break the layout. We should implement resizable nodes or a side-panel editor.
