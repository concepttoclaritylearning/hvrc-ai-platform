# 06_HVRC_RUNTIME_AND_EVENT_ENGINE.md
## HVRC.AI Core Runtime, Internal Event Bus, Command System & Extension Host

---

## 1. Runtime Architecture

HVRC.AI utilizes a 5-tier decoupled runtime isolation model to ensure zero UI freezes, zero memory leaks, and 100% crash resilience:

```text
+-----------------------------------------------------------------------+
|                         Presentation Runtime                          |
|                  React 18 + Tailwind CSS + Lucide                     |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                          Application Engine                           |
|         EventBus + CommandRegistry + State Management                 |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                    Worker & Execution Sandbox                         |
|        Web Workers + WebGPU + LiteLLM Client Proxy                    |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                         Storage & Drive Sync                          |
|             IndexedDB + Debounced Google Drive Queue                  |
+-----------------------------------------------------------------------+
```

### Runtimes Defined:
1. **Browser Runtime**: Runs presentation components and handles user interactions.
2. **Workspace Runtime**: Manages Monaco Editor buffers, virtual file trees, and tab state.
3. **Agent Runtime**: Coordinates multi-agent background tasks inside Web Workers.
4. **Security Sandbox**: Isolates custom user extensions and third-party scripts.
5. **Session Restore & Crash Recovery**: Auto-saves workspace snapshots to IndexedDB every 2 seconds. On browser crashes, state is restored seamlessly without data loss.

---

## 2. Internal Event Bus (`HVRC_EVENT_SYSTEM`)

All components communicate through `globalEventBus` (`frontend/src/engine/EventBus.js`).

```text
User Action → Command → Event → Event Bus → Subscribers (Workspace, Chat, Drive Sync)
```

### Event Registry:
- `COMMAND_EXECUTE`: Triggered when a command palette or keybinding executes.
- `FILE_CHANGE`: Fired on keystroke in Monaco Editor; updates live previewer.
- `AI_CONTEXT_BUILD`: Assembles active file context before LLM completions.
- `DRIVE_SYNC_START` / `DRIVE_SYNC_SUCCESS`: Tracks personal Google Drive background sync status.

---

## 3. Universal Command System (`HVRC_COMMAND_SYSTEM`)

VS Code-style command registry (`frontend/src/engine/CommandRegistry.js`).
- `globalCommandRegistry.register(id, title, handler, category)`: Registers executable commands.
- **Shortcuts & Command Palette**: Pressing `⌘K` or `Ctrl+K` opens the Command Palette, searching across all registered commands.

---

## 4. Extension Host & Plugin Sandbox (`HVRC_EXTENSION_HOST`)

Plugins run inside a Web Worker sandbox to prevent third-party code from accessing user API keys or personal data directly.

```text
Extension Code → Sandboxed Web Worker → RPC Message Bus → Permitted APIs → Workspace
```

---

## 5. 7-Layer Engine Architecture

1. **Presentation Layer**: React UI Components, Modals, Navbar, Workspaces.
2. **Application Layer**: EventBus, CommandRegistry, Route Controllers.
3. **Engine Layer**: Context Engine, Memory Engine, Virtual File System, Sync Queue.
4. **AI Layer**: Multi-Agent Supervisor, Artifact Generator, Prompt Templates.
5. **Infrastructure Layer**: Web Workers, WebGPU, LiteLLM Client Proxy.
6. **Storage Layer**: IndexedDB Local Cache + Personal Google Drive REST API.
7. **Provider Layer**: OpenRouter, Groq, NVIDIA NIM `/v1` endpoints.
