# Specification: Agent Architect V1

## Goal
A local visual tool for designing agent architectures with a monotone console aesthetic and JSON export capability.

## Scenarios

### 1. Adding a Robot Agent
**Given** the user is on the main canvas
**When** the user clicks "Add Agent"
**Then** a new node with a robot face icon and the label "New Agent" MUST appear at the center of the viewport.

### 2. Documenting Instructions
**Given** an Agent node exists on the canvas
**AND** an Instruction node exists
**When** the user types text into the Instruction node's textarea
**Then** the text MUST be persisted in the node's state.

### 3. Connecting Components
**Given** two nodes (A and B) exist
**When** the user drags a line from Node A's output handle to Node B's input handle
**Then** a persistent connection (Edge) SHALL be created.
**AND** when Node A is moved, the line MUST automatically follow.

### 4. Human In The Loop (HITL)
**Given** the user is on the canvas
**When** the user clicks "Add HITL"
**Then** a new HITL node with a human validation icon MUST appear.

### 5. Exporting Architecture
**Given** a set of connected nodes and instructions
**When** the user clicks "Export JSON"
**Then** a clean JSON object containing the list of agents, instructions, HITL points, and their connectivity (graph) MUST be downloaded/displayed.

### 6. Persistence
**Given** a design in progress
**When** the user refreshes the browser page
**Then** the previous state (nodes, edges, positions, and content) MUST be restored from LocalStorage.
