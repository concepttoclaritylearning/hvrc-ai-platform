# HVRC_AI_AGENT_RULEBOOK.md
## HVRC.AI Coding Agent Constitution & Verification Rules v1.0

---

## 1. Purpose & Mandate
This rulebook defines the mandatory operational guidelines, verification workflows, and architectural constraints that **ALL AI coding agents** (Antigravity, pair-programming subagents, etc.) MUST strictly adhere to when modifying the HVRC.AI codebase.

---

## 2. Core Architectural Invariants (Non-Negotiables)

### Rule 2.1: Brand Name Integrity
- **Invariant**: The product name is strictly **`HVRC.AI`**.
- **Violation**: Never revert brand names to legacy product names or generic placeholders.

### Rule 2.2: Zero-Server Database Bloat
- **Invariant**: User chat conversations, code files, and workspace projects MUST NOT be stored in server-side SQL databases.
- **Implementation**: User identity is managed via Supabase Auth (`@supabase/supabase-js`), while user workspace assets are saved directly in the user's personal **Google Drive** under `/HVRC.AI Workspace/`.

### Rule 2.3: Serverless BYOK AI Architecture
- **Invariant**: Supported serverless model providers are strictly **OpenRouter**, **Groq**, and **NVIDIA NIM**.
- **Implementation**: API keys entered by the user in `/models` must auto-fetch live models via `/v1/models` and execute completions via `serverlessProxy.executeServerlessChatCompletion()`.

### Rule 2.4: Design Aesthetics Token Adherence
- **Invariant**:
  - Main application canvas theme: Warm Creamy White (`#FAF8F4`) with `#2F6BFF` active accents.
  - Landing page theme: Midnight Dark (`#06070f`) with radial blue ambient lighting.

---

## 3. Required Implementation Workflow

Every task executed by an AI coding agent must follow this exact 5-step workflow:

```
1. Plan & Inspect
   ├── Search codebase for existing patterns using grep/view_file.
   └── Verify file paths before making edits.

2. Execute Modifications
   ├── Use replace_file_content or write_to_file.
   └── Maintain docstrings and unrelated comments.

3. Verify Build & Syntax
   ├── Run build command: npx vite build.
   └── Ensure output completes with 0 errors (e.g. "✓ built in XXs").

4. Verify Runtime Behavior
   ├── Ensure dev server is running on http://localhost:5173.
   └── Verify page navigation and API calls.

5. Report Audit Trail
   └── Provide summary of files changed, routes updated, and build results.
```

---

## 4. Verification & Proof of Completion Rules

An AI coding agent **MUST NEVER** declare a task "complete" or "fixed" simply after editing a file. Proof of completion requires:
1. **Build Verification**: Running `npx vite build` and verifying zero build/transform errors.
2. **Syntax Integrity**: Ensuring no broken JS import variable names (e.g. avoiding invalid dots in identifiers like `import HVRC.AI`).
3. **Route & Component Verification**: Verifying that new or modified routes render clean, un-truncated UI components.

---

## 5. Summary of Document Suite (`/docs/`)

```
/docs
├── 01_HVRC_MASTER_SPECIFICATION.md   # Master Product Constitution
├── 02_HVRC_SYSTEM_ARCHITECTURE.md    # System & Backend Architecture
├── 03_HVRC_DATABASE_SCHEMA.md        # Database & Storage Schema Bible
├── 04_HVRC_FRONTEND_DESIGN_SYSTEM.md # Design System & UI Specs
└── 13_HVRC_AI_AGENT_RULEBOOK.md     # AI Coding Agent Constitution (This file)
```
