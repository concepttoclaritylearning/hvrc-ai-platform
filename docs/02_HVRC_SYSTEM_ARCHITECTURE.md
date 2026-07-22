# HVRC_SYSTEM_ARCHITECTURE.md
## HVRC.AI Complete System Architecture & Backend Specification v1.0

---

## 1. Architecture Overview
HVRC.AI is an all-in-one, browser-first **AI Operating System and Code Workspace**. Its system architecture is built on three core pillars:
1. **Unified Client-Side LiteLLM Serverless Proxy**: Enables zero-latency BYOK integration with OpenRouter, Groq, and NVIDIA NIM without central server token markup.
2. **Zero-Server Database Bloat & Personal Google Drive Sovereignty**: Authenticates user logins via Supabase Auth while storing user workspace files, project trees, and chat logs directly in the user's personal Google Drive (`/HVRC.AI Workspace/`).
3. **Dual-Canvas IDE & Artifact Engine**: Combines a high-performance Monaco Editor code environment with a live sandboxed iframe web preview (`http://localhost:5173`) and interactive HTML/React artifact rendering.

---

## 2. System Components
- **Client Frontend SPA**: Vite + React 18 single-page application (`/frontend`).
- **Authentication Service**: Supabase Auth OAuth (`@supabase/supabase-js`) supporting Google OAuth + Developer Guest Bypass.
- **Serverless LLM Proxy Router**: Inbuilt `serverlessProxy.js` mapping OpenAI-compatible `/v1/models` and `/v1/chat/completions` API endpoints directly from the client.
- **Personal Cloud Storage Adapter**: Client-side Google Drive API v3 sync (`https://www.googleapis.com/auth/drive.file`).
- **Monaco Code Workspace**: In-browser IDE sandbox with responsive viewport previews (Desktop 1920px, Tablet 768px, Mobile 375px).
- **RAG Knowledge Vector Engine**: Browser-side document parser supporting PDF, TXT, MD, CSV, and web URL embedding.

---

## 3. Frontend Architecture
- **Framework & Bundler**: React 18, Vite 4, Tailwind CSS 3.
- **State Hydration**: React Context API (`ModelContext`, `AuthProvider`, `ThemeProvider`, `LogoProvider`, `PfpProvider`, `PWAContext`).
- **Routing**: `react-router-dom` v6 with code-split lazy routes (`React.lazy`).
- **Code Execution / Preview**: Embedded sandboxed iframe runtime connected via postMessage RPC.

---

## 4. Backend Architecture
- **Decoupled Architecture**: Lightweight server API (`/src/models/system.js`) for system key validation, paired with direct client-to-provider CORS proxy dispatchers for OpenRouter, Groq, and NVIDIA NIM.
- **Zero-DB Persistence**: Server endpoints store zero user content. State is persisted in `localStorage` (`hvrc_ai_...`) and user-owned Google Drive storage.

---

## 5. API Gateway
- **Proxy Endpoint Map**:
  - **OpenRouter**: `https://openrouter.ai/api/v1`
  - **Groq**: `https://api.groq.com/openai/v1`
  - **NVIDIA NIM**: `https://integrate.api.nvidia.com/v1`
- **Header Injection**:
  - `Authorization: Bearer <user_api_key>`
  - `Content-Type: application/json`
  - `HTTP-Referer: https://hvrc.ai`
  - `X-Title: HVRC.AI`

---

## 6. Authentication Service
- **Provider**: Supabase Auth (`@supabase/supabase-js`).
- **OAuth Provider**: Google OAuth with offline access and Google Drive scopes.
- **Guest Bypass**: "Continue without account" mode triggering `System.markOnboardingComplete()` and routing directly to `/`.

---

## 7. User Service
- **User Profile Model**: Manages avatar, theme preferences (`light` creamy `#FAF8F4` vs `dark` `#06070f`), display name, and active workspace session.

---

## 8. Project Service
- **Project Structure**: Each project is an isolated workspace defined by a unique `slug`, containing:
  - `workspace.json`: Metadata, file list, dependency graph.
  - `files/`: Code assets (`.jsx`, `.js`, `.css`, `.json`, `.md`).
  - `history/`: Conversation threads & code commit snapshots.

---

## 9. Workspace Service
- **Monaco Editor Integration**: Configured with syntax highlighting, IntelliSense, auto-formatting, and line diffs.
- **File System Tree**: Reactive virtual file system supporting create, rename, edit, delete, and download operations.

---

## 10. Chat Service
- **Dual-Canvas Layout**: Left thread list, center conversation stream, right interactive Artifact Canvas.
- **Message Rendering**: Markdown, syntax-highlighted code blocks, expandable reasoning steps, and interactive HTML/React preview artifacts.

---

## 11. AI Completion Service
- **Unified Function**: `executeServerlessChatCompletion({ providerId, apiKey, modelId, messages, temperature })`.
- **Response Handling**: Standardized OpenAI `/v1/chat/completions` JSON response parser with error fallback notice.

---

## 12. Model Routing Service
- **Supported Providers**: OpenRouter, Groq, NVIDIA NIM.
- **Auto-Discovery**: Pasting an API key automatically triggers a GET request to `/v1/models` to discover live available models.

---

## 13. Provider Abstraction Layer
- **Interface Standard**:
  ```ts
  interface ProviderConfig {
    id: 'openrouter' | 'groq' | 'nvidia';
    name: string;
    baseUrl: string;
    modelsUrl: string;
    keyPlaceholder: string;
  }
  ```

---

## 14. Artifact Generation Engine
- **Supported Types**: HTML, React components, Mermaid diagrams, Markdown documents, CSV data tables.
- **Sandboxed Rendering**: Rendered inside an isolated iframe with safety policies.

---

## 15. Prompt Engine
- **Template System**: Pre-built and user-defined prompt templates with variable replacement placeholders (`{{code_snippet}}`, `{{target_framework}}`).

---

## 16. Knowledge Engine (RAG)
- **Vector Search**: Client-side document chunking, embedding generation, and cosine similarity search for PDF, TXT, CSV, and URLs.

---

## 17. Embedding Pipeline
- **Processing**: Document text extraction → Chunking (500 tokens with 50-token overlap) → Embedding vector generation → Indexing.

---

## 18. Vector Search
- **Similarity Metric**: Cosine similarity math over normalized embedding vectors.

---

## 19. Agent Runtime
- **Capabilities**: Web search, tool execution, API calls, and MCP (Model Context Protocol) tool execution.

---

## 20. Memory System
- **Conversation Context Window**: Rolling buffer of recent chat history messages auto-truncated based on active model context limit (`128k`).

---

## 21. Background Task Queue
- **Async Execution**: Manages background dev server commands (`npx vite`), model auto-fetching, and Google Drive background sync.

---

## 22. Deployment Service
- **Local Dev Server**: Serves frontend on `http://localhost:5173`.
- **Static Bundle**: Production build generated via `npx vite build` into `/dist`.

---

## 23. File Storage Service
- **Storage Strategy**: Primary persistence in LocalStorage (`hvrc_ai_...`) and user-owned Google Drive `/HVRC.AI Workspace/`.

---

## 24. Google Drive Sync
- **Folder Root**: `/HVRC.AI Workspace/`
- **Sync Trigger**: Auto-saves workspace files and conversation threads to Google Drive upon edit.

---

## 25. Git Integration
- **Features**: Visual diff viewing, commit snapshot history, and file status tracking.

---

## 26. Notification Service
- **Toast Notifications**: Built with `react-toastify` for success, error, and system status alerts.

---

## 27. Analytics
- **Privacy Standard**: Zero user data or prompt text is tracked or transmitted to third-party analytics servers.

---

## 28. Logging
- **Console Debugger**: Structured console logs for LiteLLM proxy requests, API key validation, and model auto-fetching.

---

## 29. Monitoring
- **Health Checks**: Live status indicators for serverless providers (OpenRouter, Groq, NVIDIA NIM).

---

## 30. Security Specifications
- **Client-Side Key Vault**: API keys stored in local `localStorage` and sent directly to provider endpoints via HTTPS.

---

## 31. Error Recovery
- **Graceful Fallback**: Network failures or invalid keys display informative proxy error cards with instructions to update API keys in `/models`.

---

## 32. Cache Strategy
- **Fetched Models**: Cached in `ModelContext` state and `localStorage` to avoid redundant network requests.

---

## 33. API Versioning
- **Standard**: Standardized on OpenAI API Specification `/v1` endpoints.

---

## 34. Feature Flags
- **Config**: Dynamic feature flags for experimental beta features and custom branding.

---

## 35. Multi-Tenant Design
- **Single-User & Multi-User Support**: Toggles between single-user local mode and Supabase Auth multi-tenant mode.

---

## 36. Plugin SDK
- **MCP Protocol**: Full support for Model Context Protocol (MCP) server integration.

---

## 37. Future Desktop Architecture
- **Tauri / Electron Blueprint**: Native desktop wrapper loading the Vite bundle locally with filesystem access.

---

## 38. Scaling Strategy
- **Infinite Scalability**: Client-side serverless proxy model eliminates backend server bottlenecks.

---

## 39. Microservice Migration Plan
- **Modularity**: Client utilities (`serverlessProxy.js`, `supabase.js`) designed for easy extraction into microservices if needed.

---

## 40. Future AI Orchestration
- **Multi-Agent Teams**: Future roadmap includes multi-agent collaboration pipelines where different serverless models (e.g. DeepSeek for reasoning, Qwen for coding) collaborate on complex tasks.
