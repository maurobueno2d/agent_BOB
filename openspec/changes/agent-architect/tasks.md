# Tasks: Agent Architect V1

- [ ] **Infrastructure**
  - [ ] Initialize Vite + React + TypeScript project
  - [ ] Install dependencies: `@xyflow/react`, `zustand`
  - [ ] Setup base CSS (Monotone Console Theme)

- [ ] **State Management**
  - [ ] Define Zustand store for nodes and edges
  - [ ] Implement LocalStorage persistence middleware

- [ ] **Custom Components**
  - [ ] `AgentNode`: Monotone SVG robot face
  - [ ] `InstructionNode`: High-contrast textarea
  - [ ] `HITLNode`: Human-In-The-Loop icon/diamond
  - [ ] `ControlPanel`: Top/Side bar for adding nodes and export

- [ ] **Core Logic**
  - [ ] Implement `onConnect` with specific edge styling (monotone lines)
  - [ ] Implement JSON Export utility (clean mapping)

- [ ] **Testing & Validation**
  - [ ] Manual test: Node drag/drop and connection persistence
  - [ ] Manual test: LocalStorage recovery after reload
  - [ ] Unit Test: Verify Export JSON schema correctness
