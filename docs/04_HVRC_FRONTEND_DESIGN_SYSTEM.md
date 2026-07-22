# HVRC_FRONTEND_DESIGN_SYSTEM.md
## HVRC.AI Frontend & Design System Specification v1.0

---

## 1. Design Aesthetics & Core Principles

HVRC.AI adheres to a **warm, ultra-premium aesthetic** designed to wow the user at first glance:
- **Primary App Canvas Theme**: Warm Creamy White (`#FAF8F4`) for workspace, dashboard, IDE, and chat screens.
- **Landing Page Theme**: Deep Midnight Dark (`#06070f`) with radial ambient blue lighting (`rgba(47,107,255,0.18)`).
- **Primary Brand Accent**: Electric Blue (`#2F6BFF`).
- **Corner Radius**: 16px (`rounded-2xl`) for cards and containers; 12px (`rounded-xl`) for buttons; 8px (`rounded-lg`) for input fields.
- **Typography**: Modern font stack utilizing `Plus Jakarta Sans`, `Inter`, and `JetBrains Mono` for code snippets.

---

## 2. Design Tokens

### 2.1 Color Palette
| Token Name | Hex / Value | Usage |
| :--- | :--- | :--- |
| `bg-theme-bg-container` | `#FAF8F4` | Main application background canvas |
| `bg-white` | `#FFFFFF` | Card surface, sidebar, and workspace panels |
| `text-stone-900` | `#1C1917` | Primary text headings and active labels |
| `text-stone-500` | `#78716C` | Secondary text, captions, and metadata |
| `border-stone-200` | `#E7E5E4` | Component borders and panel dividers |
| `primary-accent` | `#2F6BFF` | Action buttons, active badges, and active state rings |
| `primary-accent-hover` | `#1D5AEF` | Hover state for primary buttons |
| `landing-bg` | `#06070f` | Public landing page dark background |

### 2.2 Shadow Tokens
- `shadow-2xs`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- `shadow-md`: `0 4px 6px -1px rgba(47, 107, 255, 0.12)`
- `shadow-xl`: `0 20px 25px -5px rgba(0, 0, 0, 0.08)`

---

## 3. Page Layouts & Specifications

### 3.1 Public Landing Page (`/landing` & `/onboarding`)
- **Layout**: Full-width dark layout (`#06070f`).
- **Sections**:
  - **Fixed Top Nav**: Brand logo (`HVRC.AI`), navigation links (`Features`, `Models`, `How it works`), `Sign In`, `Start Free →`.
  - **Hero Section**: Radial blue background glow, grid background overlay, badge (`Next-Gen AI Operating System`), headline (`One platform. Every AI model.`), and dual CTAs.
  - **Model Ticker**: Infinite marquee scrolling row of 200+ models.
  - **Feature Grid**: 9 glassmorphism cards highlighting AI Chat, Code IDE, Workspaces, BYOK, Zero Storage, CORS Proxy, RAG, Agent Skills, & Voice Chat.
  - **How it Works**: 3-step numbered cards.
  - **Privacy Callout**: Zero-server storage explanation.
  - **CTA Banner**: Gradient call-to-action block.
  - **Footer**: Branding, legal, and copyright links.

### 3.2 Login Page (`/login`)
- **Layout**: Centered login card over dark canvas (`#06070f`).
- **Elements**:
  - Top header with back link (`← Back to overview`).
  - Login card: Lightning icon badge, heading (`Sign in to HVRC.AI`), Supabase Google OAuth button, divider (`or`), and **"Continue without account"** (Developer/Guest bypass).
  - Privacy callout card highlighting personal Google Drive storage.

### 3.3 Main Dashboard (`/`)
- **Layout**: Warm Creamy White canvas (`#FAF8F4`) with persistent left sidebar and top navbar.
- **Elements**:
  - Greeting banner: `Welcome back, Developer 👋` with `New Project` and `Launch IDE` action buttons.
  - 4 Quick action cards (Create Project, New AI Chat, Code Workspace, Upload Knowledge).
  - Recent Projects grid with status badges (`Active`/`Pinned`) and action buttons.
  - Active Selected Model indicator card.

### 3.4 Code Workspace IDE (`/project/:slug/workspace`)
- **Layout**: Split-screen 3-panel IDE (File Explorer | Monaco Editor | Live Web Preview).
- **Elements**:
  - Top bar with active file tab, model badge, and preview toggle button.
  - Monaco editor with line numbers, code completion, and syntax highlighting.
  - Responsive iframe preview sandbox (`http://localhost:5173`) with Mobile/Tablet/Desktop switchers.

### 3.5 Dual-Canvas AI Chat (`/project/:slug/chat`)
- **Layout**: Left conversation sidebar, center chat stream, right Artifact Canvas previewer.
- **Elements**:
  - Thread list with pin button and new chat button.
  - Messages with expandable reasoning steps, code syntax highlighting, and interactive artifact triggers.
  - Prompt bar with Reasoning toggle and send button.

### 3.6 Model Hub (`/models`)
- **Layout**: BYOK management grid.
- **Elements**:
  - Top active model status pill.
  - 3 Core Serverless Provider Cards: OpenRouter (Free), Groq (Fast), NVIDIA NIM (Cloud).
  - Password input field for API keys + auto-fetch models grid.

---

## 4. Component Specification & Variants

### 4.1 Button Component
- **Primary**: `bg-[#2F6BFF] hover:bg-[#1D5AEF] text-white rounded-xl px-5 py-2.5 font-bold shadow-md`
- **Secondary / Border**: `bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 rounded-xl px-4 py-2 text-xs font-semibold`
- **Ghost**: `text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg px-3 py-1.5 text-xs font-medium`

### 4.2 Card Component
- **Standard Card**: `bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs hover:border-stone-300 transition-all`
- **Active Card**: `bg-white rounded-3xl p-6 border border-[#2F6BFF] ring-2 ring-[#2F6BFF]/20 shadow-md`

### 4.3 Input Component
- **Text Input**: `bg-[#FAF8F4] border border-stone-200 focus:border-[#2F6BFF] outline-none text-stone-900 rounded-lg px-3.5 py-2 text-xs w-full`

---

## 5. Responsive Guidelines
- **Desktop (>= 1024px)**: Full multi-column layout with open sidebar and dual-canvas panels.
- **Tablet (768px - 1023px)**: Collapsible sidebar, 2-column project grid, tabbed artifact canvas.
- **Mobile (< 768px)**: Drawer sidebar, single column project cards, stacked chat/artifact tabs.
