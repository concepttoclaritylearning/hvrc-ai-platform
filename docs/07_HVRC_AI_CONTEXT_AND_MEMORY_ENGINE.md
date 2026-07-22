# 07_HVRC_AI_CONTEXT_AND_MEMORY_ENGINE.md
## HVRC.AI AI Context Engine, Memory Architecture, Smart Router & Prompt Engine

---

## 1. AI Context Engine (`HVRC_CONTEXT_ENGINE`)

The Context Engine (`frontend/src/engine/ContextEngine.js`) builds multi-layered prompts before sending requests to model providers:

```text
User Prompt
    ↓
Context Builder
    ↓
Layer 1: System & Platform Rules
    ↓
Layer 2: Active Opened File & Workspace Code
    ↓
Layer 3: Conversation History
    ↓
Layer 4: Knowledge RAG Embeddings
    ↓
Final Payload → Model Provider
```

---

## 2. AI Memory Architecture (`HVRC_AI_MEMORY`)

HVRC.AI maintains 5 distinct memory tiers:

1. **Short-Term Memory**: Current active chat session messages (stored in component state).
2. **Project Memory**: System architecture rules, project name, and tech stack stored in Google Drive `/HVRC.AI Workspace/project.json`.
3. **Workspace Memory**: Current open editor tabs, cursor line positions, and file selection history.
4. **Knowledge Memory**: Vector embeddings stored in IndexedDB for instant semantic search.
5. **Global User Memory**: Model provider preferences and saved BYOK API keys.

---

## 3. Smart AI Model Router (`HVRC_MODEL_INTELLIGENCE`)

The Smart Model Router (`frontend/src/engine/ModelRouter.js`) automatically routes prompts based on task type:

```text
Prompt Request
    ↓
Model Router
    ├─ Coding Task → OpenRouter (Llama 3.3 70B Free) / Groq / NVIDIA NIM
    ├─ Deep Reasoning → DeepSeek R1 (OpenRouter / NVIDIA NIM)
    ├─ Fast Chat → Gemini 2.5 Flash (OpenRouter)
    └─ Custom Model → User Selected Model Badge
```

---

## 4. Prompt Engine (`HVRC_PROMPT_ENGINE`)

Structures system prompts into modular templates:
- **System Template**: Injects persona, role, and output rules.
- **Code Refactor Template**: Injects active file snippet and instructions.
- **Code Explanation Template**: Instructs models to summarize logic cleanly.
- **Output Formatter**: Ensures model code blocks are enclosed in valid Markdown syntax.
