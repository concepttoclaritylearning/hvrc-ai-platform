# 08_HVRC_WORKSPACE_FILE_AND_SYNC_ENGINE.md
## HVRC.AI Workspace Engine, Virtual File System & Drive Sync Engine

---

## 1. Workspace Engine (`HVRC_WORKSPACE_ENGINE`)

The Flagship Workspace IDE pairs Monaco Editor with a live HMR previewer, file tree explorer, and interactive Web Terminal:

```text
+-------------------------------------------------------------------------+
| Top Bar: Workspace Name | Active File | Model Badge | Preview/AI Toggle |
+------------------+------------------------------------+-----------------+
| Explorer Sidebar | Monaco Code Editor                 | Live Preview /  |
| - src/           | App.jsx (React Code)               | AI Assistant    |
|   - App.jsx      |                                    | Canvas          |
|   - index.css    |                                    |                 |
| - package.json   +------------------------------------+                 |
|                  | Bottom Terminal & Problems Drawer  |                 |
|                  | $ npx vite build → ✓ Build Clean   |                 |
+------------------+------------------------------------+-----------------+
```

---

## 2. Virtual File System & Versioning (`HVRC_VIRTUAL_FILE_ENGINE`)

- **In-Memory Virtual File System (VFS)**: Tracks dirty files and uncommitted code edits before saving.
- **Snapshots & Rollbacks**: Every save operation creates an immutable snapshot timestamped in LocalStorage/IndexedDB, allowing 1-click rollbacks to any point in development history.

---

## 3. Google Drive Synchronization Engine (`HVRC_SYNCHRONIZATION_ENGINE`)

Guarantees 100% data sovereignty without hitting Google REST API rate limits:

```text
Browser Code Edit
    ↓
IndexedDB Instant Local Cache (0ms latency)
    ↓
Debounced Sync Queue (5-second throttle)
    ↓
Conflict Resolver & Compression
    ↓
Personal Google Drive REST API (`/HVRC.AI Workspace/`)
```

- **Offline Resilience**: When internet is disconnected, edits accumulate in IndexedDB. Once online, the Sync Queue auto-flushes to Google Drive seamlessly.
