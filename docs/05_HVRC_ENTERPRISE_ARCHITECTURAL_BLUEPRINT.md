# HVRC_ENTERPRISE_ARCHITECTURAL_BLUEPRINT.md
## HVRC.AI Strategic Architecture Blueprint & Product Evolution Plan
**Role**: Lead Architect & CTO Specifications Audit

---

## 1. Everything That Is Excellent

1. **BYOK Serverless Intelligence Architecture**:
   - Zero vendor markups or token taxes. Direct client-side proxying to OpenRouter, Groq, and NVIDIA NIM using standard `/v1/chat/completions` API semantics.
2. **Zero-Server Database Bloat & Personal Drive Sovereignty**:
   - Authenticates user identities via Supabase Auth while saving projects, chats, and code directly in the user's personal Google Drive (`/HVRC.AI Workspace/`).
3. **Warm Creamy White UI Aesthetic (`#FAF8F4`)**:
   - High visual elegance contrasting against generic dark IDE clones, featuring 16px rounded cards and `#2F6BFF` active accents.
4. **Dual-Canvas Workspace IDE & Artifact Engine**:
   - Seamless pairing of Monaco Editor with a live iframe browser preview (`http://localhost:5173`) and interactive code artifact canvas.
5. **Strict Build Verification Culture**:
   - Code updates are validated via `npx vite build` with zero transform or bundle errors.

---

## 2. Everything That Is Missing (To Beat Claude Code, Replit, & Cursor)

1. **Terminal & PTY Web Socket Integration**:
   - Lacks an active WebSockets PTY terminal (xterm.js) for running `npm install`, `git commit`, or executing shell commands inside the web workspace.
2. **AI Autonomous File Multi-Diff Engine**:
   - Lacks a multi-file diff reviewer allowing AI agents to edit multiple files across directories simultaneously with visual side-by-side git diff approvals.
3. **Background Autonomous Agent Swarm**:
   - Lacks subagent orchestration (Planner, Coder, Architect, QA) capable of running background coding loops without freezing the main browser loop.
4. **Local LLM & WebGPU Fallback**:
   - Lacks WebGPU in-browser inference (via WebLLM or Ollama local port `http://localhost:11434`) when internet connectivity is offline.
5. **Real-Time Multi-User Collaboration**:
   - Lacks Yjs / CRDT real-time multiplayer editing across code files and chat threads.

---

## 3. Everything That Should Be Improved

1. **Strict Real Model API Discovery**:
   - Ensure `fetchLiveModels` returns strictly the real models returned by user-pasted API keys without default model catalog pollution.
2. **API Key Input UX**:
   - Provide immediate visual validation feedback (green checkmark / error toast) when pasting API keys in `ModelHubPage` or the top bar model picker.
3. **Streamed Event Sourcing**:
   - Upgrade HTTP fetch completions to Server-Sent Events (`fetchEventSource`) for token-by-token typewriter chat responses across all serverless providers.

---

## 4. Architectural Weaknesses

1. **Browser Memory Pressure**:
   - Storing large workspace file contents and heavy Monaco editor instances in client memory without virtualized tab unloading can degrade performance on large projects.
2. **CORS Vulnerability**:
   - Direct browser calls to third-party endpoints depend on provider CORS headers (`Access-Control-Allow-Origin: *`). A serverless fallback proxy layer is required for strict enterprise environments.

---

## 5. Scalability Concerns

1. **Google Drive API Quotas**:
   - High-frequency auto-saving on every keystroke can hit Google Drive REST API rate limits (10,000 requests/day per user).
   - *Fix*: Implement debounced batch sync (save every 5s or on file tab blur).

---

## 6. Security Concerns

1. **Plaintext LocalStorage API Keys**:
   - API keys stored in unencrypted `localStorage` are vulnerable to malicious browser extensions or XSS scripts.
   - *Fix*: Encrypt keys using Web Crypto API (`AES-GCM` with a user passphrase or WebAuthn token).

---

## 7. UX Issues

1. **Model Discovery Ambiguity**:
   - Users need a clear distinction between free models (e.g. `google/gemini-2.5-flash:free`) and paid credit models.
2. **Error Visibility**:
   - API provider error messages (e.g., 401 Unauthorized or 429 Quota Exceeded) should be rendered in formatted alert banners with direct key edit links.

---

## 8. UI Issues

1. **Mobile Workspace Layout**:
   - Monaco IDE and live preview panels require tabbed navigation on mobile viewports (< 768px).

---

## 9. Every Missing Feature to Beat Competitors

| Competitor | Their Advantage | HVRC.AI Superior Counter-Feature |
| :--- | :--- | :--- |
| **Claude Code** | CLI agent speed | Graphical Dual-Canvas IDE + Inbuilt LiteLLM Multi-Provider BYOK |
| **Replit** | Web hosting & container IDE | Zero-Server DB (Drive Sovereignty) + Free Serverless Models |
| **Cursor** | In-line AI edits (`Cmd+K`) | Monaco inline agent suggestions + Live Web Preview iframe |
| **AnythingLLM** | Desktop RAG | Zero-install Web RAG + Multi-model OpenRouter/Groq/NVIDIA NIM |

---

## 10. Every Missing Document to Add to `/docs`

- `05_HVRC_API_REFERENCE.md`
- `06_HVRC_COMPONENT_LIBRARY.md`
- `07_HVRC_DESIGN_TOKENS.md`
- `08_HVRC_DEVELOPMENT_ROADMAP_100.md`
- `09_HVRC_TESTING_AND_QA_STRATEGY.md`
- `10_HVRC_DEPLOYMENT_AND_DEVOPS_GUIDE.md`
- `11_HVRC_SECURITY_AND_ENCRYPTION_SPEC.md`
- `12_HVRC_CODING_STANDARDS_AND_CONVENTIONS.md`
- `14_HVRC_PLUGIN_AND_MCP_SDK.md`

---

## 11. New Database Entities Required

1. `Organizations` & `Teams`
2. `WorkspaceSessions` & `TerminalLogs`
3. `AgentRuns` & `TaskSteps`
4. `EncryptedApiKeys` & `ProviderHealthLogs`
5. `GitBranches` & `GitCommits`
6. `UserPreferences` & `KeyboardShortcuts`

---

## 12. New APIs Required

1. `POST /api/proxy/v1/chat/completions`: Serverless fallback proxy endpoint.
2. `GET /api/proxy/v1/models`: Provider health and model discovery proxy.
3. `POST /api/drive/sync`: Debounced batch Google Drive workspace sync.
4. `WS /api/terminal/pty`: Interactive PTY terminal WebSocket.

---

## 13. Prioritized Development Roadmap

### 🔴 Critical Priority (Immediate)
- **Strict Real Model API Discovery**: Return strictly live models from user-pasted API keys.
- **Debounced Google Drive Sync**: Prevent rate-limit errors during heavy code editing.
- **Enhanced Error Diagnostics**: Display clear status banners for HTTP 401/429 errors in chat.

### 🟠 High Priority (Next Cycle)
- **Interactive xterm.js Web Terminal**: Integrated terminal for dev server commands.
- **Streaming SSE Typewriter Responses**: Stream chat completions token-by-token.
- **Encrypted Local Storage Vault**: Web Crypto API AES-GCM encryption for stored API keys.

### 🟡 Medium Priority (Scale Phase)
- **Multi-File Git Diff Approvals**: AI multi-file edits with side-by-side visual diffs.
- **Ollama / WebGPU Local Fallback**: Support offline local models at `http://localhost:11434`.
- **MCP Plugin SDK**: Custom tool definitions for AI Agent execution.

### 🟢 Low Priority (Future Roadmap)
- **Tauri Native Desktop Bundler**: Mac/Windows native desktop apps.
- **Multiplayer Yjs Collaboration**: Real-time collaborative workspace editing.
