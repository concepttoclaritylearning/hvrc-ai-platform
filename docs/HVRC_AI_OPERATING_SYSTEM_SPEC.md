# HVRC.AI Operating System (AI OS) Specification

## 1. Executive Summary
**HVRC.AI** has been transformed from an AI chat application into a complete, enterprise-grade **AI Operating System & Autonomous Software Development Environment**.

The system preserves 100% of HVRC.AI's core architectural tenets:
- **BYOK (Bring Your Own Key)** client-first key security.
- **Zero-Server Database Architecture** (stateless Express proxy gateway with browser-first Web Crypto AES-GCM local storage).
- **Universal OpenAI-Compatible Gateway** supporting ANY provider (NVIDIA NIM, OpenRouter, Groq, OpenAI, Ollama, LM Studio, LiteLLM, vLLM, LocalAI, FastChat, Custom).
- **Browser-First Execution Engine** with live hot-reloading React preview and WebGL 3D asset rendering.

---

## 2. Platform Architecture Layers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HVRC.AI OPERATING SYSTEM                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Multimodal AI Capability Hub]                                             │
│  ├── Multi-Model Capability Router (Reasoning, Coding, 3D, Image, Video)    │
│  └── Intelligent Provider & Creator Matrix Filter                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Native Multimodal Generation Workflows]                                    │
│  ├── WebGL 3D Studio (Three.js Orbit Engine, Wireframe, GLB/OBJ Export)    │
│  ├── Multimodal Image Studio (Flux, Pollinations, UI Mockup Generator)     │
│  └── Motion Video Synthesis Engine (Async UI Demos & Motion Graphics)       │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Multi-Agent Intelligence Platform]                                         │
│  ├── Primary AI Orchestrator Agent (Strategic Planner & Task Delegator)     │
│  └── Specialized Co-Working Workers (Reviewer, Tester, Writer, Bug Hunter)  │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Synchronized AI Task Board]                                               │
│  └── Kanban, Timeline, Dependency Graph, and Sprint Velocity Views          │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Autonomous Background Execution Engine]                                    │
│  └── Bounded supervision cycles, codebase quality audits, real-time logs    │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Enterprise Browser IDE & Diagnostics Center]                              │
│  ├── Multi-Tab Monaco Editor, Split Panes, Multi-Session Terminal CLI        │
│  └── 1-Click Diagnostics "⚡ Send to AI" Auto-Fix Button                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Capability Specifications

### 3.1 Multimodal AI Capability Hub (`CapabilityContext.jsx`)
Allows assigning specialized models per project across 14 capability slots:
1. `reasoningModel` (DeepSeek R1, OpenAI o1/o3)
2. `codingModel` (Llama 3.3 70B, Claude 3.5 Sonnet)
3. `reviewingModel` (Nemotron 70B)
4. `planningModel`
5. `researchModel`
6. `debuggingModel`
7. `documentationModel`
8. `testingModel`
9. `backgroundModel`
10. `imageGenModel` (HVRC Flux Engine)
11. `videoGenModel` (HVRC Motion Engine)
12. `threeDGenModel` (HVRC WebGL 3D Studio)
13. `speechModel`
14. `visionModel`

### 3.2 Native WebGL 3D Studio (`ThreeDStudioModal.jsx`)
- Interactive orbit camera controls, rotation speed, lighting intensity sliders.
- Wireframe mesh mode toggle.
- Mesh inspection (Vertices, Faces, WebGL shading).
- 1-click export directly to workspace `assets/models/` and Artifact Panel.

### 3.3 Multi-Agent Intelligence Engine (`AgentOrchestrator.js`)
- Primary Agent orchestrates project strategy.
- Parallel worker roles (Code Reviewer, Test Engineer, Documentation Writer, Bug Hunter, System Architect).

### 3.4 Synchronized AI Task Board (`TaskBoard/index.jsx`)
- Auto-generates structured task trees, milestones, subtasks.
- Synchronized views: **Kanban Board**, **Timeline View**, **Dependency Graph**, and **Sprint View**.

### 3.5 Autonomous Background Execution Engine (`BackgroundExecutionEngine.js`)
- Runs background execution cycles every 12–15 seconds auditing workspace quality.
- Emits real-time logs and proposal diffs.
- Includes full user pause/resume and approval controls.

### 3.6 Enterprise IDE & Intelligent Diagnostics Center (`ProjectWorkspace/index.jsx`)
- Multi-pane workspace layout with File Explorer, Multi-Tab Editor, Live Preview, and Multi-Session Terminals.
- **1-Click Diagnostics "⚡ Send to AI" Auto-Fix**: Automatically bundles stack traces, surrounding source code, and active file context, returning code diff proposals for single-click application.
