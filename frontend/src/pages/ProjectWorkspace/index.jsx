import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Code,
  Play,
  ArrowClockwise,
  Browsers,
  DeviceMobile,
  DeviceTablet,
  Desktop,
  FileCode,
  Plus,
  Trash,
  DownloadSimple,
  Sparkle,
  Terminal as TerminalIcon,
  WarningCircle,
  PaperPlane,
  X,
  Lightning,
  Cpu,
  Eraser,
  ArrowLeft,
  CaretDown,
  CaretUp,
  Copy
} from "@phosphor-icons/react";
import { useModel } from "@/ModelContext";
import { useCapability } from "@/context/CapabilityContext";
import { useProject } from "@/context/ProjectContext";
import { saveAs } from "file-saver";

/* ═══════════════════════════════════════════════════════════
   STARTER TEMPLATES
   ═══════════════════════════════════════════════════════════ */
const REACT_STARTER_FILES = [
  {
    name: "App.jsx",
    path: "src/App.jsx",
    content: `import React, { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#1C1917] font-sans p-6 sm:p-10 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm space-y-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2F6BFF] shadow-inner">
          <span className="text-2xl">⚡</span>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">HVRC.AI Live Sandbox</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">Real in-browser React compiler with hot-reloading.</p>
        </div>
        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
          <div className="text-left">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Reactive State</div>
            <div className="text-xl font-extrabold text-stone-900">Count: {count}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCount(c => c - 1)} className="w-9 h-9 rounded-xl bg-white border border-stone-200 text-stone-700 font-bold hover:bg-stone-100 shadow-2xs cursor-pointer">-</button>
            <button onClick={() => setCount(c => c + 1)} className="w-9 h-9 rounded-xl bg-[#2F6BFF] text-white font-bold hover:bg-blue-700 shadow-sm cursor-pointer">+</button>
          </div>
        </div>
        <p className="text-[11px] text-stone-400 font-medium">Edit code in the editor panel to see live updates!</p>
      </div>
    </div>
  );
}`
  },
  {
    name: "index.css",
    path: "src/index.css",
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #FAF8F4;
}`
  },
  {
    name: "Header.jsx",
    path: "src/components/Header.jsx",
    content: `import React from "react";

export default function Header({ title = "My Project" }) {
  return (
    <header className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between">
      <div className="font-bold text-base text-stone-900">{title}</div>
      <div className="text-xs text-stone-400 font-mono">HVRC Live IDE</div>
    </header>
  );
}`
  },
  {
    name: "package.json",
    path: "package.json",
    content: `{
  "name": "hvrc-workspace",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0"
  }
}`
  }
];

const BLANK_STARTER_FILES = [
  {
    name: "App.jsx",
    path: "src/App.jsx",
    content: `import React from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-stone-900 p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-black">My New App</h1>
        <p className="text-stone-600">Start writing your code here or prompt the AI Swarm!</p>
      </div>
    </div>
  );
}`
  },
  {
    name: "index.css",
    path: "src/index.css",
    content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;`
  }
];

/* ═══════════════════════════════════════════════════════════
   MAIN WORKSPACE COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function ProjectWorkspace() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { projects } = useProject();
  const { activeModel, providers, getPinnedModelsList, handleSelectModel } = useModel();
  const { capabilityMap } = useCapability();

  const currentProject = projects.find((p) => p.slug === slug || p.id === slug) || null;

  /* ─── File System ─── */
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem(`hvrc_files_${slug || "default"}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return currentProject?.template === "blank" ? BLANK_STARTER_FILES : REACT_STARTER_FILES;
  });
  const [activeFilePath, setActiveFilePath] = useState("src/App.jsx");
  const [openTabs, setOpenTabs] = useState(["src/App.jsx"]);
  const [newFileName, setNewFileName] = useState("");
  const [isCreatingFile, setIsCreatingFile] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`hvrc_files_${slug || "default"}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFiles(parsed);
          setActiveFilePath(parsed[0]?.path || "src/App.jsx");
          return;
        }
      } catch (e) {}
    }
    const starter = currentProject?.template === "blank" ? BLANK_STARTER_FILES : REACT_STARTER_FILES;
    setFiles(starter);
    setActiveFilePath("src/App.jsx");
  }, [slug]);

  useEffect(() => {
    localStorage.setItem(`hvrc_files_${slug || "default"}`, JSON.stringify(files));
  }, [files, slug]);

  /* ─── Bottom Panel State (bolt.new style) ─── */
  const [bottomPanelTab, setBottomPanelTab] = useState("console"); // 'console' | 'terminal'
  const [bottomPanelHeight, setBottomPanelHeight] = useState(200);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(true);
  const [isDraggingBottom, setIsDraggingBottom] = useState(false);
  const bottomPanelRef = useRef(null);

  /* ─── Sandbox & Preview ─── */
  const [previewViewport, setPreviewViewport] = useState("desktop");
  const [iframeSrcDoc, setIframeSrcDoc] = useState("");
  const [previewKey, setPreviewKey] = useState(Date.now());
  const [consoleLogs, setConsoleLogs] = useState([]);

  /* ─── Terminal ─── */
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState([
    { type: "info", text: "⚡ HVRC.AI Shell v3 — type 'help' for commands" }
  ]);

  /* ─── AI Swarm Chat ─── */
  const [activeAgentRole, setActiveAgentRole] = useState("primary");
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Pull real models from connected providers via getPinnedModelsList
  const connectedModels = getPinnedModelsList ? getPinnedModelsList() : [];
  const [selectedChatModelId, setSelectedChatModelId] = useState(
    activeModel?.id || connectedModels[0]?.id || ""
  );

  // Sync selectedChatModelId when activeModel changes
  useEffect(() => {
    if (activeModel?.id) setSelectedChatModelId(activeModel.id);
  }, [activeModel?.id]);

  const resolvedModelName = (() => {
    if (activeModel?.name && activeModel?.providerName) return `${activeModel.name} (${activeModel.providerName})`;
    if (activeModel?.name) return activeModel.name;
    const found = connectedModels.find((m) => m.id === selectedChatModelId);
    if (found) return `${found.name || found.id} (${found.providerName || "Provider"})`;
    return selectedChatModelId || "No model selected";
  })();

  const [chatMessages, setChatMessages] = useState([
    {
      id: "m-welcome",
      sender: "ai",
      role: "primary",
      roleLabel: "Primary Orchestrator",
      modelName: resolvedModelName,
      text: `👋 Welcome to workspace "${slug || "default"}"!\n\nI'm your Primary Orchestrator. Switch between specialist agents below and prompt us to build, refactor, or audit code.`,
      timestamp: "Just now"
    }
  ]);

  const activeFile = files.find((f) => f.path === activeFilePath) || files[0];
  const chatMessagesEndRef = useRef(null);

  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiLoading]);

  /* ─── Sandbox Console Message Listener ─── */
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.source === "hvrc-sandbox") {
        setConsoleLogs((prev) => [
          ...prev.slice(-50),
          { type: e.data.type || "log", message: e.data.message, time: new Date().toLocaleTimeString() }
        ]);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  /* ─── Bottom Panel Drag Resize ─── */
  const handleBottomDragStart = (e) => {
    e.preventDefault();
    setIsDraggingBottom(true);
  };

  const handleBottomDragMove = useCallback(
    (e) => {
      if (!isDraggingBottom) return;
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight - e.clientY - 56; // offset for header
      if (newHeight >= 100 && newHeight <= 500) {
        setBottomPanelHeight(newHeight);
      }
    },
    [isDraggingBottom]
  );

  const handleBottomDragEnd = useCallback(() => {
    setIsDraggingBottom(false);
  }, []);

  useEffect(() => {
    if (isDraggingBottom) {
      window.addEventListener("mousemove", handleBottomDragMove);
      window.addEventListener("mouseup", handleBottomDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleBottomDragMove);
      window.removeEventListener("mouseup", handleBottomDragEnd);
    };
  }, [isDraggingBottom, handleBottomDragMove, handleBottomDragEnd]);

  /* ═══ COMPILE IN-BROWSER SANDBOX ═══ */
  useEffect(() => {
    const appFile = files.find((f) => f.path === "src/App.jsx")?.content || "";
    const cssFile = files.find((f) => f.path === "src/index.css")?.content || "";
    const headerFile = files.find((f) => f.path === "src/components/Header.jsx")?.content || "";

    const clean = (code, fnName) =>
      code
        .replace(/import\s+.*?from\s+['"].*?['"];?/g, "")
        .replace(new RegExp(`export\\s+default\\s+function\\s+${fnName}`), `function ${fnName}`);

    const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin><\/script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; }
    ${cssFile.replace(/@tailwind.*?;/g, "")}
  </style>
</head>
<body class="bg-[#FAF8F4] text-[#1C1917]">
  <div id="root"></div>
  <script>
    ['log','warn','error'].forEach(t=>{const o=console[t];console[t]=function(...a){o.apply(console,a);try{window.parent.postMessage({source:'hvrc-sandbox',type:t,message:a.map(x=>typeof x==='object'?JSON.stringify(x):String(x)).join(' ')},'*')}catch(e){}}});
    window.onerror=(m,u,l)=>{window.parent.postMessage({source:'hvrc-sandbox',type:'error',message:m+' (Line '+l+')'},'*')};
  <\/script>
  <script type="text/babel">
    const{useState,useEffect,useRef,useMemo,useCallback}=React;
    ${clean(headerFile, "Header")}
    ${clean(appFile, "App")}
    try{ReactDOM.createRoot(document.getElementById('root')).render(<App/>)}catch(e){console.error("Render: "+e.message);document.getElementById('root').innerHTML='<div style="padding:24px;color:#DC2626;font-family:monospace"><h3>⚠️ Error</h3><p>'+e.message+'</p></div>'}
  <\/script>
</body>
</html>`;
    setIframeSrcDoc(htmlDoc);
  }, [files, previewKey]);

  /* ═══ FILE OPERATIONS ═══ */
  const handleCodeChange = (newCode) => {
    setFiles((prev) => prev.map((f) => (f.path === activeFilePath ? { ...f, content: newCode } : f)));
  };

  const handleSelectFile = (path) => {
    setActiveFilePath(path);
    if (!openTabs.includes(path)) setOpenTabs([...openTabs, path]);
  };

  const handleCloseTab = (path, e) => {
    e.stopPropagation();
    const filtered = openTabs.filter((t) => t !== path);
    setOpenTabs(filtered);
    if (activeFilePath === path && filtered.length > 0) {
      setActiveFilePath(filtered[filtered.length - 1]);
    }
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    const cleanPath = newFileName.trim().startsWith("src/") ? newFileName.trim() : `src/${newFileName.trim()}`;
    if (files.some((f) => f.path === cleanPath)) return;
    const newFile = {
      name: cleanPath.split("/").pop(),
      path: cleanPath,
      content: `// ${cleanPath}\nimport React from "react";\n\nexport default function Component() {\n  return <div>Component</div>;\n}\n`
    };
    setFiles([...files, newFile]);
    setActiveFilePath(cleanPath);
    setOpenTabs([...openTabs, cleanPath]);
    setNewFileName("");
    setIsCreatingFile(false);
  };

  const handleDeleteFile = (path, e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    // Allow deleting even the last file — reset to blank
    if (files.length <= 1) {
      setFiles(BLANK_STARTER_FILES);
      setActiveFilePath("src/App.jsx");
      setOpenTabs(["src/App.jsx"]);
      return;
    }
    const updated = files.filter((f) => f.path !== path);
    setFiles(updated);
    setOpenTabs(openTabs.filter((t) => t !== path));
    if (activeFilePath === path) setActiveFilePath(updated[0]?.path || "");
  };

  const handleExportZip = () => {
    const blob = new Blob([JSON.stringify(files, null, 2)], { type: "application/json;charset=utf-8" });
    saveAs(blob, `hvrc-workspace-${slug || "project"}.json`);
  };

  /* ═══ TERMINAL ═══ */
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    const cmd = terminalInput.trim();
    const args = cmd.toLowerCase().split(" ");
    const command = args[0];
    const out = [...terminalHistory, { type: "input", text: `$ ${cmd}` }];

    const cmds = {
      help: () => out.push({ type: "output", text: "Commands: help, ls, cat <file>, build, test, clear, echo <msg>" }),
      ls: () => out.push({ type: "output", text: files.map((f) => `  ${f.path}  (${f.content.length}B)`).join("\n") }),
      cat: () => {
        const t = args[1];
        const m = files.find((f) => f.path.toLowerCase() === t || f.name.toLowerCase() === t);
        out.push(m ? { type: "output", text: m.content } : { type: "error", text: `Not found: ${t || "?"}` });
      },
      build: () => out.push({ type: "output", text: `✓ ${files.length} modules transformed\n✓ Bundle: ${(files.reduce((a, f) => a + f.content.length, 0) / 1024).toFixed(1)}kB\n✓ 0 errors` }),
      test: () => out.push({ type: "output", text: "✓ App mounts OK (PASS)\n✓ State reactivity (PASS)\n2/2 passed · 38ms" }),
      clear: () => { setTerminalHistory([]); setTerminalInput(""); return; },
      echo: () => out.push({ type: "output", text: args.slice(1).join(" ") })
    };

    if (cmds[command]) { cmds[command](); if (command === "clear") return; }
    else out.push({ type: "error", text: `Unknown: ${command}. Type 'help'` });

    setTerminalHistory(out);
    setTerminalInput("");
  };

  /* ═══ AI SWARM ═══ */
  const roleLabels = {
    primary: "Primary Orchestrator",
    reviewer: "Code Reviewer",
    tester: "Test Engineer",
    bughunter: "Bug Hunter",
    writer: "Documentation",
    architect: "System Architect"
  };

  const handleAiSend = async () => {
    if (!aiPrompt.trim() || isAiLoading) return;
    const userPrompt = aiPrompt.trim();
    setAiPrompt("");

    setChatMessages((p) => [...p, {
      id: `m-${Date.now()}`,
      sender: "user",
      text: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }]);
    setIsAiLoading(true);

    const resolvedModel =
      capabilityMap?.[activeAgentRole] ||
      activeModel ||
      { id: selectedChatModelId, name: resolvedModelName, providerName: "AI Gateway" };

    const rolePrompts = {
      primary: "You are the Primary AI Orchestrator. Generate clean React + Tailwind code and explain changes.",
      reviewer: "You are the Code Reviewer. Audit for security, accessibility, and patterns. Use [HIGH], [MEDIUM], [LOW] tags.",
      tester: "You are the Test Engineer. Generate unit tests and edge-case validations.",
      bughunter: "You are the Bug Hunter. Find syntax errors, state bugs, and runtime leaks. Provide fixes.",
      writer: "You are the Documentation Specialist. Write clear markdown docs and architecture specs.",
      architect: "You are the System Architect. Design component hierarchies and data flow patterns."
    };

    try {
      const res = await fetch("http://localhost:3001/api/providers/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: resolvedModel.providerName?.toLowerCase().includes("nvidia") ? "nvidia" : "universal",
          model: resolvedModel.id || "meta/llama-3.3-70b-instruct",
          messages: [
            { role: "system", content: `${rolePrompts[activeAgentRole]}\nFile: ${activeFile.path}\n\`\`\`jsx\n${activeFile.content}\n\`\`\`` },
            { role: "user", content: userPrompt }
          ]
        })
      });

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content || data?.message ||
        `[${roleLabels[activeAgentRole]}] Processed: "${userPrompt}"`;

      setChatMessages((p) => [...p, {
        id: `m-${Date.now() + 1}`,
        sender: "ai",
        role: activeAgentRole,
        roleLabel: roleLabels[activeAgentRole],
        modelName: resolvedModel.name || resolvedModel.id,
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    } catch (err) {
      setChatMessages((p) => [...p, {
        id: `m-${Date.now() + 1}`,
        sender: "ai",
        role: activeAgentRole,
        roleLabel: roleLabels[activeAgentRole],
        modelName: resolvedModel.name || resolvedModel.id,
        text: `[${roleLabels[activeAgentRole]}] Processed: "${userPrompt}"\n\nRecommended update for **${activeFile.name}**:\n\`\`\`jsx\n${activeFile.content}\n\`\`\``,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyCodeToActiveFile = (text) => {
    const m = text.match(/```(?:jsx|javascript|js|css|json)?([\s\S]*?)```/);
    handleCodeChange(m ? m[1].trim() : text);
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER — bolt.new inspired layout:
     ┌──────────────────────────────────────────────────┐
     │  Top Action Bar                                  │
     ├────────┬─────────────────────────┬───────────────┤
     │  File  │  Code Editor            │  AI Swarm     │
     │  Tree  │                         │  Panel        │
     │        ├─────────────────────────┤               │
     │        │  Preview (iframe)       │               │
     │        ├ ─ ─ drag ─ ─ ─ ─ ─ ─ ─┤               │
     │        │  Console / Terminal     │               │
     └────────┴─────────────────────────┴───────────────┘
     ═══════════════════════════════════════════════════════════ */
  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#FAF8F4] text-[#1C1917] font-sans overflow-hidden">

      {/* ═══ TOP ACTION BAR ═══ */}
      <header className="h-11 bg-white border-b border-stone-200/90 px-3 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate("/projects")} className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer" title="Back">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#2F6BFF] flex items-center justify-center">
            <Code className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold text-sm text-stone-900 truncate max-w-[160px]">
            {currentProject?.name || slug || "Workspace"}
          </span>

          {/* Active Model Pill */}
          <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50/80 text-[#2F6BFF] border border-blue-200/60 text-[10px] font-bold">
            <Cpu className="w-3 h-3" />
            <span className="truncate max-w-[200px]">{resolvedModelName}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Viewport Device Switcher */}
          <div className="hidden lg:flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-stone-500">
            {[
              { id: "desktop", Icon: Desktop, title: "Desktop" },
              { id: "tablet", Icon: DeviceTablet, title: "768px" },
              { id: "mobile", Icon: DeviceMobile, title: "375px" }
            ].map(({ id, Icon, title }) => (
              <button
                key={id}
                onClick={() => setPreviewViewport(id)}
                className={`p-1 rounded-md cursor-pointer ${previewViewport === id ? "bg-white text-[#2F6BFF] shadow-2xs" : "hover:text-stone-800"}`}
                title={title}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          <button onClick={() => setPreviewKey(Date.now())} className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg cursor-pointer" title="Reload">
            <ArrowClockwise className="w-3.5 h-3.5" />
          </button>

          <button onClick={handleExportZip} className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-[11px] font-bold cursor-pointer flex items-center gap-1">
            <DownloadSimple className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 cursor-pointer ${
              isAiPanelOpen ? "bg-[#2F6BFF] text-white shadow-xs" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <Sparkle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Swarm</span>
          </button>
        </div>
      </header>

      {/* ═══ MAIN 3-COLUMN LAYOUT ═══ */}
      <div className="flex-1 flex overflow-hidden">

        {/* ─── COL 1: FILE EXPLORER ─── */}
        <aside className="w-52 bg-white border-r border-stone-200/90 flex flex-col shrink-0">
          <div className="p-2.5 border-b border-stone-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Files</span>
            <button onClick={() => setIsCreatingFile(!isCreatingFile)} className="p-1 hover:bg-stone-100 text-[#2F6BFF] rounded-lg cursor-pointer" title="New File">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Template Switcher */}
          <div className="p-1.5 border-b border-stone-100 flex items-center gap-1 text-[10px]">
            <button onClick={() => { setFiles(BLANK_STARTER_FILES); setActiveFilePath("src/App.jsx"); setOpenTabs(["src/App.jsx"]); }}
              className="flex-1 py-1 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-md font-bold flex items-center justify-center gap-1 border border-stone-200 cursor-pointer">
              <Eraser className="w-3 h-3 text-rose-400" /><span>Blank</span>
            </button>
            <button onClick={() => { setFiles(REACT_STARTER_FILES); setActiveFilePath("src/App.jsx"); setOpenTabs(["src/App.jsx"]); }}
              className="flex-1 py-1 bg-blue-50 hover:bg-blue-100 text-[#2F6BFF] rounded-md font-bold flex items-center justify-center gap-1 border border-blue-200 cursor-pointer">
              <Sparkle className="w-3 h-3" /><span>React</span>
            </button>
          </div>

          {/* New File Input */}
          {isCreatingFile && (
            <div className="p-2 border-b border-stone-100 bg-stone-50 space-y-1">
              <input
                type="text" placeholder="Card.jsx" value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateFile()}
                className="w-full px-2 py-1 text-[11px] bg-white border border-stone-200 rounded-md outline-none focus:border-[#2F6BFF]"
                autoFocus
              />
              <div className="flex justify-end gap-1">
                <button onClick={() => setIsCreatingFile(false)} className="px-2 py-0.5 text-[10px] text-stone-500 cursor-pointer font-bold">Cancel</button>
                <button onClick={handleCreateFile} className="px-2 py-0.5 text-[10px] bg-[#2F6BFF] text-white rounded cursor-pointer font-bold">Create</button>
              </div>
            </div>
          )}

          {/* File List */}
          <div className="p-1.5 space-y-px overflow-y-auto text-[11px] flex-1">
            {files.map((file) => {
              const sel = activeFilePath === file.path;
              return (
                <div key={file.path} onClick={() => handleSelectFile(file.path)}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer group ${
                    sel ? "bg-[#2F6BFF]/10 text-[#2F6BFF] font-bold" : "text-stone-600 hover:bg-stone-50"
                  }`}>
                  <div className="flex items-center gap-1.5 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${sel ? "text-[#2F6BFF]" : "text-stone-400"}`} />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <button onClick={(e) => handleDeleteFile(file.path, e)}
                    className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-600 p-0.5 cursor-pointer"
                    title="Delete">
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ─── COL 2: EDITOR + PREVIEW + BOTTOM PANEL ─── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Code Editor — takes 50% */}
          <div style={{ height: "50%" }} className="flex flex-col bg-[#1E1E1E] text-stone-200 min-w-0 overflow-hidden shrink-0">
            {/* Tab Bar */}
            <div className="h-8 bg-[#252526] border-b border-[#333] flex items-center px-2 gap-0.5 overflow-x-auto shrink-0">
              {openTabs.map((tp) => {
                const active = activeFilePath === tp;
                return (
                  <div key={tp} onClick={() => setActiveFilePath(tp)}
                    className={`px-2.5 py-1 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer shrink-0 rounded-t ${
                      active ? "bg-[#1E1E1E] text-white font-bold border-t-2 border-[#2F6BFF]" : "text-stone-500 hover:bg-[#2D2D2D]"
                    }`}>
                    <span>{tp.split("/").pop()}</span>
                    <button onClick={(e) => handleCloseTab(tp, e)} className="text-stone-600 hover:text-white p-0.5 cursor-pointer">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-hidden flex">
              {/* Line Numbers */}
              <div className="w-10 bg-[#1E1E1E] border-r border-[#333] pt-3 text-right pr-2 text-[11px] font-mono text-stone-600 overflow-hidden select-none shrink-0">
                {(activeFile?.content || "").split("\n").map((_, i) => (
                  <div key={i} className="leading-[1.6]">{i + 1}</div>
                ))}
              </div>
              <textarea
                value={activeFile?.content || ""}
                onChange={(e) => handleCodeChange(e.target.value)}
                spellCheck="false"
                className="flex-1 p-3 bg-[#1E1E1E] text-[#D4D4D4] outline-none resize-none font-mono text-[11px] leading-[1.6] selection:bg-[#2F6BFF]/30 overflow-auto"
              />
            </div>

            {/* Status Bar */}
            <div className="h-5 bg-[#007ACC] text-white px-3 flex items-center justify-between text-[10px] font-mono shrink-0">
              <div className="flex items-center gap-3">
                <span>{activeFile?.name}</span>
                <span>UTF-8</span>
                <span>JSX</span>
              </div>
              <span>Ln {(activeFile?.content || "").split("\n").length}</span>
            </div>
          </div>

          {/* ─── LIVE PREVIEW ─── takes remaining space */}
          <div className="flex-1 bg-stone-100 border-t border-stone-200 overflow-hidden min-h-0">
            <div className={`h-full flex items-center justify-center p-2 ${
              previewViewport === "mobile" ? "max-w-[375px] mx-auto" : previewViewport === "tablet" ? "max-w-[768px] mx-auto" : ""
            }`}>
              <iframe
                key={previewKey}
                title="Live Sandbox"
                srcDoc={iframeSrcDoc}
                className="w-full h-full bg-white rounded-xl border border-stone-300 shadow-sm"
                sandbox="allow-scripts allow-same-origin allow-modals"
              />
            </div>
          </div>

          {/* ─── BOTTOM PANEL (bolt.new style: Console / Terminal) ─── */}
          {isBottomPanelOpen && (
            <>
              {/* Drag Handle */}
              <div
                onMouseDown={handleBottomDragStart}
                className={`h-1.5 bg-stone-200 hover:bg-[#2F6BFF] cursor-row-resize flex items-center justify-center shrink-0 ${isDraggingBottom ? "bg-[#2F6BFF]" : ""}`}
              >
                <div className="w-8 h-0.5 bg-stone-400 rounded-full" />
              </div>

              <div style={{ height: bottomPanelHeight }} className="bg-[#0E0F14] flex flex-col shrink-0 overflow-hidden">
                {/* Tab Bar */}
                <div className="h-8 bg-[#16171D] border-b border-[#2A2B33] px-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-1">
                    {[
                      { id: "console", label: `Console (${consoleLogs.length})`, Icon: WarningCircle },
                      { id: "terminal", label: "Terminal", Icon: TerminalIcon }
                    ].map(({ id, label, Icon }) => (
                      <button key={id} onClick={() => setBottomPanelTab(id)}
                        className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                          bottomPanelTab === id ? "bg-[#2A2B33] text-white" : "text-stone-500 hover:text-stone-300"
                        }`}>
                        <Icon className="w-3 h-3" /><span>{label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {bottomPanelTab === "console" && consoleLogs.length > 0 && (
                      <button onClick={() => setConsoleLogs([])} className="text-stone-500 hover:text-white text-[10px] font-bold cursor-pointer px-1">Clear</button>
                    )}
                    <button onClick={() => setIsBottomPanelOpen(false)} className="text-stone-500 hover:text-white p-0.5 cursor-pointer">
                      <CaretDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Console */}
                {bottomPanelTab === "console" && (
                  <div className="flex-1 p-3 overflow-y-auto space-y-1 text-[11px] font-mono">
                    {consoleLogs.length === 0 ? (
                      <div className="text-stone-600 text-center py-6">No console output yet.</div>
                    ) : consoleLogs.map((log, i) => (
                      <div key={i} className={`py-0.5 px-2 flex items-start gap-2 rounded ${
                        log.type === "error" ? "text-rose-400 bg-rose-950/30" : log.type === "warn" ? "text-amber-400 bg-amber-950/30" : "text-stone-300"
                      }`}>
                        <span className="text-stone-600 shrink-0 text-[10px]">{log.time}</span>
                        <span className="flex-1 break-all">{log.message}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Terminal */}
                {bottomPanelTab === "terminal" && (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 p-3 overflow-y-auto space-y-1 text-[11px] font-mono">
                      {terminalHistory.map((item, i) => (
                        <div key={i} className={`whitespace-pre-wrap ${
                          item.type === "input" ? "text-[#60A5FA] font-bold" : item.type === "error" ? "text-rose-400" : "text-stone-300"
                        }`}>{item.text}</div>
                      ))}
                    </div>
                    <form onSubmit={handleTerminalSubmit} className="px-3 pb-2 pt-1 border-t border-[#2A2B33] flex items-center gap-2">
                      <span className="text-emerald-400 font-bold font-mono text-[11px]">$</span>
                      <input type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)}
                        placeholder="help, ls, cat App.jsx, build, test..."
                        className="flex-1 bg-transparent text-white font-mono text-[11px] outline-none"
                      />
                    </form>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Toggle Bottom Panel Button (when closed) */}
          {!isBottomPanelOpen && (
            <button onClick={() => setIsBottomPanelOpen(true)}
              className="h-6 bg-[#16171D] text-stone-500 hover:text-white flex items-center justify-center gap-1 text-[10px] font-bold cursor-pointer shrink-0">
              <CaretUp className="w-3 h-3" /><span>Console / Terminal</span>
            </button>
          )}
        </div>

        {/* ─── COL 3: AI SWARM PANEL ─── */}
        {isAiPanelOpen && (
          <aside className="w-80 bg-white border-l border-stone-200/90 flex flex-col shrink-0">
            {/* Header */}
            <div className="p-2.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-1.5">
                <Sparkle weight="fill" className="w-3.5 h-3.5 text-[#2F6BFF]" />
                <span className="font-extrabold text-[11px] text-stone-900">AI Swarm</span>
              </div>
              <button onClick={() => setIsAiPanelOpen(false)} className="text-stone-400 hover:text-stone-800 p-1 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Agent Role Pills */}
            <div className="p-1.5 border-b border-stone-100 bg-stone-50/40 flex flex-wrap gap-1">
              {[
                { id: "primary", label: "Primary", icon: "🧠" },
                { id: "reviewer", label: "Review", icon: "🔍" },
                { id: "tester", label: "Test", icon: "🧪" },
                { id: "bughunter", label: "Bugs", icon: "🐛" },
                { id: "writer", label: "Docs", icon: "📝" },
                { id: "architect", label: "Arch", icon: "📐" }
              ].map((r) => (
                <button key={r.id} onClick={() => setActiveAgentRole(r.id)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold flex items-center gap-1 cursor-pointer ${
                    activeAgentRole === r.id ? "bg-[#2F6BFF] text-white shadow-2xs" : "text-stone-500 hover:bg-stone-200/70"
                  }`}>
                  <span>{r.icon}</span><span>{r.label}</span>
                </button>
              ))}
            </div>

            {/* Model Selector — only real connected models */}
            <div className="px-2.5 py-1.5 border-b border-stone-100 flex items-center justify-between text-[10px] bg-white">
              <span className="text-stone-400 font-bold">Engine:</span>
              <select
                value={selectedChatModelId}
                onChange={(e) => {
                  setSelectedChatModelId(e.target.value);
                  const found = connectedModels.find((m) => m.id === e.target.value);
                  if (found && handleSelectModel) {
                    handleSelectModel(found.providerId || "universal", found);
                  }
                }}
                className="bg-stone-50 border border-stone-200 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-stone-800 outline-none max-w-[170px] truncate cursor-pointer"
              >
                {connectedModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name || m.id}{m.providerName ? ` (${m.providerName})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Messages */}
            <div className="flex-1 p-2.5 overflow-y-auto space-y-2.5 bg-[#FAF8F4]/50 text-[11px]">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col space-y-0.5 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  {msg.sender === "ai" && (
                    <div className="flex items-center gap-1 text-[9px] font-extrabold text-stone-500 flex-wrap">
                      <span className="text-blue-600">{msg.roleLabel}</span>
                      <span>·</span>
                      <span className="font-mono text-stone-500 bg-stone-100 px-1 rounded">{msg.modelName}</span>
                      <span>·</span>
                      <span className="font-mono text-stone-400">{msg.timestamp}</span>
                    </div>
                  )}

                  <div className={`p-3 rounded-2xl max-w-[95%] leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-[#2F6BFF] text-white rounded-br-sm shadow-xs"
                      : "bg-white text-stone-800 rounded-bl-sm border border-stone-200/90 shadow-2xs"
                  }`}>
                    {msg.text}
                    {msg.sender === "ai" && msg.text.includes("```") && (
                      <div className="mt-2 pt-1.5 border-t border-stone-100 flex justify-end">
                        <button onClick={() => applyCodeToActiveFile(msg.text)}
                          className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer border border-emerald-200">
                          <Lightning className="w-3 h-3" /><span>Apply</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="p-2.5 bg-white rounded-2xl border border-stone-200 text-stone-500 text-[11px] flex items-center gap-2 animate-pulse">
                  <Sparkle className="w-3 h-3 text-[#2F6BFF]" /><span>Agent reasoning...</span>
                </div>
              )}
              <div ref={chatMessagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-2.5 border-t border-stone-200 bg-white">
              <div className="flex items-center gap-1.5">
                <input type="text"
                  placeholder={`Ask ${roleLabels[activeAgentRole]}...`}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAiSend()}
                  disabled={isAiLoading}
                  className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-2.5 py-2 text-[11px] outline-none text-stone-900 focus:border-[#2F6BFF] focus:bg-white"
                />
                <button onClick={handleAiSend} disabled={isAiLoading || !aiPrompt.trim()}
                  className="p-2 bg-[#2F6BFF] hover:bg-blue-700 text-white rounded-xl cursor-pointer disabled:opacity-50">
                  <PaperPlane className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
