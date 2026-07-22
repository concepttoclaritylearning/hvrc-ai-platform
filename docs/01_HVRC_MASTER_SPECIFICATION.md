# HVRC_MASTER_SPECIFICATION.md
## HVRC.AI Master Software Specification (MSS) v1.0
**The Authoritative Architecture & Technical Specification Constitution**

---

## 1. Product Vision

### 1.1 Goals
HVRC.AI is an all-in-one, browser-first **AI Operating System and Code Workspace**. It unifies the capabilities of ChatGPT, Claude, Gemini, Cursor, Bolt.new, Lovable, and Replit into a single, cohesive web platform.

### 1.2 Mission
To provide developers and AI creators with maximum intelligence, zero-vendor lock-in, and total data privacy by pairing **Bring-Your-Own-Key (BYOK) serverless AI providers** (OpenRouter, Groq, NVIDIA NIM) with **Zero-Server DB Google Drive Storage**.

### 1.3 Non-Goals
- Maintaining server-side SQL databases containing private user chat history or user code.
- Charging per-token markups or forced subscription tiers for LLM usage.
- Locking users into single LLM model ecosystems or proprietary cloud storage containers.

### 1.4 Target Audience
- Full-stack web developers building AI applications.
- Prompt engineers, agent developers, and researchers requiring multi-model access.
- Privacy-conscious engineers who demand local/personal drive data sovereignty.

### 1.5 Competitive Matrix
| Feature | ChatGPT | Cursor | Bolt.new | HVRC.AI |
| :--- | :--- | :--- | :--- | :--- |
| **Multi-Provider BYOK** | ❌ (OpenAI only) | ⚠️ (Limited) | ❌ | ✅ (OpenRouter, Groq, NVIDIA NIM) |
| **Monaco IDE + Web Preview** | ❌ | ✅ (Desktop) | ✅ (Web) | ✅ (In-Browser IDE + Live Preview) |
| **Data Storage Sovereignty** | OpenAI Cloud DB | Cloud DB | Cloud DB | ✅ Zero-DB (Personal Google Drive) |
| **Serverless Proxy Router** | ❌ | ❌ | ❌ | ✅ Inbuilt LiteLLM Unified Proxy |
| **Design Aesthetic** | Dark/Light Clean | Dark IDE | Dark Web | ✅ Warm Creamy White (`#FAF8F4`) |

---

## 2. Information Architecture

### 2.1 Route Map & Navigation Tree
```
HVRC.AI
├── / (Root - PrivateRoute wrapper with ShellWrapper)
│   ├── / (DashboardPage - Main Command Center)
│   ├── /projects (ProjectsPage - All Workspaces)
│   ├── /project/:slug/workspace (ProjectWorkspace - Monaco IDE + Web Preview)
│   ├── /project/:slug/chat (ProjectChat - Dual-Canvas AI Chat)
│   ├── /models (ModelHubPage - Serverless Model Manager)
│   ├── /knowledge (KnowledgePage - RAG Vector Embeddings)
│   ├── /prompts (PromptsPage - Prompt Templates & Variables)
│   ├── /history (HistoryPage - Audit Log & Conversations)
│   └── /profile (ProfilePage - User & Storage Settings)
├── /landing (LandingPage - Marketing Overview)
├── /login (Login - Supabase OAuth & Guest Bypass)
├── /onboarding (OnboardingFlow - Redirects to LandingPage)
├── /settings/llm-preference (GeneralLLMPreference - 3-Provider Settings)
└── /sso/simple (SimpleSSOPassthrough)
```

---

## 3. Complete UI Specification

### 3.1 Dashboard Page (`/`)
- **Header**: Greeting (`Welcome back, Developer  👋`), Quick Actions (`New Project`, `Launch IDE`).
- **Quick Action Cards**: Create Project, New AI Chat, Code Workspace, Upload Knowledge.
- **Recent Projects Grid**: Cards display status badge (`Active`/`Pinned`), title, description, timestamp, and action buttons (`Workspace`, `Chat`).
- **Active Model Pill & Code Files Panel**: Live model indicator + recent workspace code files (`AppLayout.jsx`, `ProjectWorkspace.jsx`, `tailwind.config.js`).

### 3.2 Code Workspace IDE (`/project/:slug/workspace`)
- **Top Toolbar**: File tab navigation, active file breadcrumbs, active model pill, run dev server button, live web preview toggle.
- **Left Panel (File Explorer)**: Workspace file tree (`src/`, `components/`, `public/`, `package.json`).
- **Center Panel (Monaco Editor)**: Syntax highlighting, auto-formatting, line numbers, AI inline edit suggestions.
- **Right Panel (Live Web Preview / Browser)**: Embedded iframe web server preview (`http://localhost:5173`) with reload, mobile/desktop viewport toggle, console drawer.

### 3.3 AI Chat Canvas (`/project/:slug/chat`)
- **Left Sidebar**: Conversation thread list (pinned/recent threads, new chat button).
- **Main Chat Window**: Message list, reasoning steps, code syntax highlighting, artifact preview triggers.
- **Right Panel (Artifact Canvas)**: Interactive preview for generated code artifacts.

---

## 4. Database & Storage Architecture

### 4.1 Supabase Authentication (`@supabase/supabase-js`)
- Authenticates user logins and manages OAuth sessions with zero server database user data storage.

### 4.2 Personal Google Drive Storage (`/HVRC.AI Workspace/`)
- Syncs user projects, chat histories, code files, and settings to `/HVRC.AI Workspace/` in personal Google Drive.

---

## 5. Backend & API Architecture
- **In-Built Serverless Proxy Layer (`/src/utils/serverlessProxy.js`)**: Direct browser proxying to OpenRouter, Groq, and NVIDIA NIM endpoints.

---

## 6. Verification Rules for AI Coding Agents
1. **Never Declare Completion Without Verification**: Always verify changes via `npx vite build`.
2. **Adhere to HVRC.AI Branding**: Use `HVRC.AI` exclusively.
3. **Preserve BYOK & Zero-DB Architecture**: Never add server-side SQL database storage for user code or chats.
4. **Follow the Master Specification**: Treat `/docs` as the authoritative source of truth.
