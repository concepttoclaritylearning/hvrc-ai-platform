import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  FileCode,
  Folder,
  Plus,
  Play,
  Sparkle,
  Terminal,
  PaperPlane,
  Eye,
  Trash,
  Check,
  BracketsCurly,
  CaretDown,
  CaretRight,
  Spinner,
  ArrowClockwise,
  Code,
  Desktop,
  DeviceMobile,
  ArrowSquareOut,
  SidebarSimple,
  Lightning,
  Cube,
  PaintBrush,
  FilmStrip,
  ListChecks,
  WarningCircle,
  Bug,
  MagicWand,
  Robot,
  SlidersHorizontal,
  FolderPlus,
  PlayCircle
} from "@phosphor-icons/react";

import { useModel } from "@/ModelContext";
import { useCapability } from "@/context/CapabilityContext";
import ThreeDStudioModal from "@/components/MultimodalStudio/ThreeDStudioModal";
import ImageGenStudio from "@/components/MultimodalStudio/ImageGenStudio";
import VideoGenStudio from "@/components/MultimodalStudio/VideoGenStudio";
import TaskBoard from "@/components/TaskBoard";
import { BackgroundExecutionEngine } from "@/engine/BackgroundExecutionEngine";
import { AgentOrchestrator, WORKER_ROLES } from "@/engine/AgentOrchestrator";

export default function ProjectWorkspace() {
  const { slug } = useParams();
  const { activeModel, executeCompletion } = useModel();
  const { capabilityMap, getModelForCapability } = useCapability();

  // Canvas View Mode: 'codebase' | 'preview' | '3d-studio' | 'task-board'
  const [mainCanvasView, setMainCanvasView] = useState("codebase");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);

  // Multimodal Modal States
  const [show3DModal, setShow3DModal] = useState(false);
  const [showImageStudio, setShowImageStudio] = useState(false);
  const [showVideoStudio, setShowVideoStudio] = useState(false);

  // Folder collapse state
  const [isSrcExpanded, setIsSrcExpanded] = useState(true);
  const [isAssetsExpanded, setIsAssetsExpanded] = useState(true);

  // Auto-scroll ref for AI Chat
  const chatMessagesEndRef = useRef(null);

  // File System State
  const [files, setFiles] = useState([
    {
      name: "src",
      isDir: true,
      children: [
        {
          name: "App.jsx",
          isDir: false,
          content: `import React, { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [likes, setLikes] = useState(128);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", background: "#FAF8F4", minHeight: "100vh", color: "#1C1917", padding: "40px 24px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", background: "#ffffff", padding: "36px", borderRadius: "28px", border: "1px solid #E7E5E4", boxShadow: "0 12px 40px rgba(0,0,0,0.04)" }}>
        {/* HVRC Badge & Title */}
        <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", marginBottom: "24px" }}>
          <div>
            <span style={{ background: "#EFF6FF", color: "#2F6BFF", fontSize: "12px", fontStyle: "normal", fontWeight: "800", padding: "5px 14px", borderRadius: "100px", letterSpacing: "0.5px" }}>
              ⚡ HVRC.AI OPERATING SYSTEM v3.0
            </span>
            <h1 style={{ color: "#1C1917", fontSize: "28px", fontWeight: "800", marginTop: "14px", marginBottom: "6px" }}>
              HVRC AI Operating System Platform
            </h1>
            <p style={{ color: "#78716C", fontSize: "14px", margin: 0, lineHeight: 1.5 }}>
              Multimodal 3D WebGL Studio, Multi-Agent Runtimes, AI Task Synchronizer, and Autonomous Background Engine.
            </p>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div style={{ display: "flex", gap: "8px", background: "#F5F5F4", padding: "6px", borderRadius: "16px", marginBottom: "24px" }}>
          {["overview", "multimodal", "multi-agent"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: "12px",
                border: "none",
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "capitalize",
                cursor: "pointer",
                background: activeTab === tab ? "#ffffff" : "transparent",
                color: activeTab === tab ? "#2F6BFF" : "#78716C",
                boxShadow: activeTab === tab ? "0 2px 8px rgba(0,0,0,0.06)" : "none"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ padding: "20px", background: "#FAF8F4", borderRadius: "18px", border: "1px solid #F5F5F4" }}>
              <div style={{ fontSize: "12px", fontWeight: "800", color: "#2F6BFF", textTransform: "uppercase", marginBottom: "6px" }}>OS Layer 1</div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "#1C1917" }}>Multimodal AI Capability Hub</div>
              <div style={{ fontSize: "13px", color: "#78716C", marginTop: "4px", lineHeight: 1.5 }}>
                Multi-model activation per project for Reasoning, Coding, Reviewing, Image, Video, and 3D Asset generation.
              </div>
            </div>

            <div style={{ padding: "20px", background: "#FAF8F4", borderRadius: "18px", border: "1px solid #F5F5F4" }}>
              <div style={{ fontSize: "12px", fontWeight: "800", color: "#10B981", textTransform: "uppercase", marginBottom: "6px" }}>OS Layer 2</div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "#1C1917" }}>Autonomous Background Engine</div>
              <div style={{ fontSize: "13px", color: "#78716C", marginTop: "4px", lineHeight: 1.5 }}>
                Background worker supervision executing periodic codebase quality audits and todo synchronization.
              </div>
            </div>
          </div>
        )}

        {activeTab === "multimodal" && (
          <div style={{ padding: "20px", background: "#F0FDF4", borderRadius: "18px", border: "1px solid #DCFCE7", color: "#166534", fontSize: "13px", lineHeight: 1.6 }}>
            <strong>Multimodal Asset Pipelines:</strong>
            <ul style={{ margin: "10px 0 0 18px", padding: 0 }}>
              <li>WebGL 3D Asset Studio (GLB, OBJ, Mesh Inspection, Orbit Controls)</li>
              <li>Native Image Generation (Flux, Pollinations, UI Mockup Generator)</li>
              <li>Async Video Synthesis Engine (Motion graphics &amp; UI demos)</li>
            </ul>
          </div>
        )}

        {activeTab === "multi-agent" && (
          <div style={{ padding: "20px", background: "#FEFCE8", borderRadius: "18px", border: "1px solid #FEF08A", color: "#854D0E", fontSize: "13px" }}>
            <strong>Parallel Co-Working AI Agents:</strong> Primary Orchestrator + Code Reviewer, Test Engineer, Documentation Writer, and Bug Hunter Workers.
          </div>
        )}

        {/* Footer Interaction */}
        <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid #F5F5F4", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", color: "#A8A29E", fontWeight: "600" }}>HVRC.AI OS v3.0 • Browser-First Environment</span>
          <button
            onClick={() => setLikes(likes + 1)}
            style={{ background: "#2F6BFF", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}
          >
            ⚡ Star OS ({likes})
          </button>
        </div>
      </div>
    </div>
  );
}`
        },
        {
          name: "index.css",
          isDir: false,
          content: `/* HVRC.AI Modern Styles */\n@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');\nbody { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background: #FAF8F4; color: #1C1917; }`
        }
      ]
    },
    {
      name: "assets",
      isDir: true,
      children: [
        { name: "logo.png", isDir: false, content: "[Image Binary Data]" },
        { name: "3d_cube.glb", isDir: false, content: "// GLB Binary 3D Mesh Asset" }
      ]
    },
    {
      name: "package.json",
      isDir: false,
      content: `{\n  "name": "hvrc-live-app",\n  "private": true,\n  "version": "3.0.0",\n  "type": "module",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}`
    }
  ]);

  const [activeFile, setActiveFile] = useState(files[0].children[0]);
  const [openTabs, setOpenTabs] = useState([files[0].children[0]]);
  const [editorContent, setEditorContent] = useState(files[0].children[0].content);

  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(true);
  const [activeBottomTab, setActiveBottomTab] = useState("problems"); // 'problems' | 'terminal' | 'autonomous'

  // Terminal & Problems Diagnostics State
  const [terminalLogs, setTerminalLogs] = useState([
    { type: "cmd", text: "hvrc-os init --mode full-platform" },
    { type: "info", text: "[HVRC OS Kernel] Multi-Agent Execution Engine Active." },
    { type: "info", text: "[Vite] Hot Module Replacement (HMR) active. WebGL Studio Ready." }
  ]);
  const [terminalInput, setTerminalInput] = useState("");

  // Problems & Diagnostics List
  const [diagnostics, setDiagnostics] = useState([
    {
      id: "diag-1",
      severity: "error",
      file: "src/App.jsx",
      line: 42,
      message: "TypeError: Cannot read properties of undefined (reading 'item')",
      stack: "TypeError: Cannot read properties of undefined\n  at App (App.jsx:42:18)\n  at renderWithHooks (react-dom.development.js:16305)"
    },
    {
      id: "diag-2",
      severity: "warning",
      file: "src/App.jsx",
      line: 88,
      message: "Unused state variable 'likes' detected. Consider cleanup.",
      stack: "Warning: 'likes' is assigned a value but never read in strict pass."
    }
  ]);

  const [selectedDiag, setSelectedDiag] = useState(null);
  const [isAiFixingDiag, setIsAiFixingDiag] = useState(false);

  // Autonomous Background Execution Engine State
  const [autonomousEngine, setAutonomousEngine] = useState(null);
  const [isAutonomousRunning, setIsAutonomousRunning] = useState(false);
  const [backgroundLogs, setBackgroundLogs] = useState([]);
  const [bgProposals, setBgProposals] = useState([]);

  // Initialize Autonomous Background Engine
  useEffect(() => {
    const engine = new BackgroundExecutionEngine({
      intervalMs: 12000,
      onLogUpdate: (logs) => setBackgroundLogs([...logs]),
      onTaskProposal: (prop) => setBgProposals((prev) => [prop, ...prev])
    });
    setAutonomousEngine(engine);

    return () => {
      engine.stop();
    };
  }, []);

  const toggleAutonomousEngine = () => {
    if (!autonomousEngine) return;
    if (isAutonomousRunning) {
      autonomousEngine.stop();
      setIsAutonomousRunning(false);
    } else {
      autonomousEngine.start();
      setIsAutonomousRunning(true);
    }
  };

  // AI Assistant Chat State (RIGHT Side)
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      role: "assistant",
      text: `Welcome to **HVRC.AI OS v3.0** watching project **${slug || "default"}**. Primary Orchestrator & Co-Working Worker Agents are ready.`
    }
  ]);

  // Auto-scroll AI Chat
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, isAiLoading]);

  // Helper to extract code from markdown
  const extractCodeBlock = (text) => {
    if (!text) return null;
    const match = text.match(/```(?:jsx|react|javascript|js|html)?[\s\n]*([\s\S]*?)```/i);
    return match ? match[1].trim() : null;
  };

  // Sync code into editor and active file
  const applyCodeToWorkspace = (codeToApply, fileName = "App.jsx") => {
    if (!codeToApply) return;
    setEditorContent(codeToApply);

    setFiles((prev) => {
      return prev.map((f) => {
        if (f.name === "src" && f.children) {
          const fileExists = f.children.find((c) => c.name === fileName);
          if (fileExists) {
            return {
              ...f,
              children: f.children.map((c) => (c.name === fileName ? { ...c, content: codeToApply } : c))
            };
          }
        }
        return f;
      });
    });

    setMainCanvasView("preview");
  };

  // 1-CLICK DIAGNOSTICS "SEND TO AI" AUTO-FIX BUTTON
  const handleSendDiagnosticToAi = async (diag) => {
    setSelectedDiag(diag);
    setIsAiFixingDiag(true);

    const diagPrompt = `Diagnose and fix this runtime error in ${diag.file} line ${diag.line}:\nError: ${diag.message}\nStack Trace:\n${diag.stack}\n\nCurrent Code:\n\`\`\`jsx\n${editorContent}\n\`\`\``;

    const userMsg = { role: "user", text: `⚡ [Send to AI]: Fix ${diag.message}` };
    setAiMessages((prev) => [...prev, userMsg]);

    try {
      const reasoningModel = getModelForCapability("debuggingModel");
      const res = await executeCompletion([
        { role: "system", content: "You are an expert AI Bug Hunter Worker. Analyze the diagnostic error and return complete fixed JSX code inside ```jsx ... ``` blocks." },
        { role: "user", content: diagPrompt }
      ]);

      const fixText = res.text || `Diagnosed root cause for ${diag.message}: Null dereference on uninitialized item property.\n\n\`\`\`jsx\n${editorContent.replace("props.data.item", "props?.data?.item || null")}\n\`\`\``;

      setAiMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `🔍 **Bug Hunter Worker Analysis** for ${diag.message}:\n\n${fixText}`
        }
      ]);

      // Remove fixed diagnostic entry
      setDiagnostics((prev) => prev.filter((d) => d.id !== diag.id));

      const codeInFix = extractCodeBlock(fixText);
      if (codeInFix) {
        applyCodeToWorkspace(codeInFix, "App.jsx");
      }
    } catch (err) {
      setAiMessages((prev) => [
        ...prev,
        { role: "assistant", text: `Error analyzing diagnostic: ${err.message}` }
      ]);
    } finally {
      setIsAiFixingDiag(false);
    }
  };

  const handleEditorChange = (newVal) => {
    setEditorContent(newVal);
    if (activeFile) {
      activeFile.content = newVal;
    }
  };

  const handleSelectFile = (file) => {
    if (!file || file.isDir) return;
    setActiveFile(file);
    setEditorContent(file.content);
    if (!openTabs.find((t) => t.name === file.name)) {
      setOpenTabs([...openTabs, file]);
    }
  };

  const handleCloseTab = (e, tabName) => {
    e.stopPropagation();
    const remaining = openTabs.filter((t) => t.name !== tabName);
    setOpenTabs(remaining);

    if (activeFile?.name === tabName) {
      if (remaining.length > 0) {
        handleSelectFile(remaining[remaining.length - 1]);
      } else {
        setActiveFile(null);
        setEditorContent("// No file open.");
      }
    }
  };

  const handleAiSend = async () => {
    if (!aiPrompt.trim() || isAiLoading) return;
    const userText = aiPrompt.trim();
    setAiMessages((prev) => [...prev, { role: "user", text: userText }]);
    setAiPrompt("");
    setIsAiLoading(true);

    try {
      const codingModel = getModelForCapability("codingModel");
      const res = await executeCompletion([
        { role: "system", content: `You are Primary AI Orchestrator inside HVRC.AI OS. Active File: ${activeFile?.name}. Write full React JSX code inside \`\`\`jsx ... \`\`\` blocks.` },
        ...aiMessages.map((m) => ({ role: m.role, content: m.text })),
        { role: "user", content: userText }
      ]);

      const aiText = res.text || "Completion processed.";
      setAiMessages((prev) => [...prev, { role: "assistant", text: aiText }]);

      const extracted = extractCodeBlock(aiText);
      if (extracted) {
        applyCodeToWorkspace(extracted, "App.jsx");
      }
    } catch (err) {
      setAiMessages((prev) => [...prev, { role: "assistant", text: `Error: ${err.message}` }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#FAF8F4] overflow-hidden font-sans">
      {/* 1. Top OS Navigation Bar */}
      <div className="h-11 bg-white border-b border-stone-200/80 px-4 flex items-center justify-between text-xs text-stone-600 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExplorerOpen(!isExplorerOpen)}
            className="p-1 hover:bg-stone-100 rounded text-stone-500"
            title="Toggle File Explorer Sidebar"
          >
            <SidebarSimple className="w-4 h-4" />
          </button>

          <span className="font-bold text-stone-900 flex items-center gap-1.5">
            <BracketsCurly className="w-4 h-4 text-[#2F6BFF]" />
            <span>Workspace: {slug || "default"}</span>
          </span>

          <span className="text-stone-300">|</span>
          <span className="text-stone-500 font-mono text-[11px]">{activeFile?.name || "No file open"}</span>

          {/* Multimodal Generation Toolbar */}
          <div className="flex items-center gap-1 ml-4 bg-stone-100 p-0.5 rounded-xl border border-stone-200/60">
            <button
              onClick={() => setShow3DModal(true)}
              className="px-2.5 py-1 bg-white hover:bg-stone-50 text-stone-800 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs border border-stone-200"
            >
              <Cube className="w-3.5 h-3.5 text-[#2F6BFF]" />
              <span>3D WebGL Studio</span>
            </button>
            <button
              onClick={() => setShowImageStudio(!showImageStudio)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                showImageStudio ? "bg-blue-600 text-white" : "bg-white text-stone-800 hover:bg-stone-50 border border-stone-200"
              }`}
            >
              <PaintBrush className="w-3.5 h-3.5 text-blue-500" />
              <span>Image Studio</span>
            </button>
            <button
              onClick={() => setShowVideoStudio(!showVideoStudio)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                showVideoStudio ? "bg-purple-600 text-white" : "bg-white text-stone-800 hover:bg-stone-50 border border-stone-200"
              }`}
            >
              <FilmStrip className="w-3.5 h-3.5 text-purple-500" />
              <span>Video Studio</span>
            </button>
          </div>
        </div>

        {/* Center/Right: Viewport & Canvas Switcher */}
        <div className="flex items-center gap-3">
          <div className="bg-stone-100 p-1 rounded-xl flex items-center gap-1 border border-stone-200/60">
            <button
              onClick={() => setMainCanvasView("codebase")}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                mainCanvasView === "codebase" ? "bg-white text-[#2F6BFF] shadow-2xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Codebase</span>
            </button>

            <button
              onClick={() => setMainCanvasView("preview")}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                mainCanvasView === "preview" ? "bg-[#2F6BFF] text-white shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Live Preview</span>
            </button>

            <button
              onClick={() => setMainCanvasView("task-board")}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                mainCanvasView === "task-board" ? "bg-emerald-600 text-white shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <ListChecks className="w-4 h-4" />
              <span>AI Task Board</span>
            </button>
          </div>

          <button
            onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isAiPanelOpen ? "bg-blue-50 border-blue-200 text-[#2F6BFF]" : "bg-stone-50 border-stone-200 text-stone-500"
            }`}
            title="Toggle Multi-Agent Panel"
          >
            <Sparkle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Multimodal Generation Dropdown Drawers */}
      {showImageStudio && (
        <div className="p-4 bg-stone-100 border-b border-stone-200">
          <ImageGenStudio onExportImage={(img) => applyCodeToWorkspace(`// Exported Image Asset: ${img.prompt}\n// URL: ${img.url}\n`)} />
        </div>
      )}

      {showVideoStudio && (
        <div className="p-4 bg-stone-100 border-b border-stone-200">
          <VideoGenStudio onExportVideo={(vid) => applyCodeToWorkspace(`// Exported Motion Video Asset: ${vid.title}\n`)} />
        </div>
      )}

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* PANEL 1: File Explorer Sidebar (LEFT) */}
        {isExplorerOpen && (
          <div className="w-56 bg-white border-r border-stone-200/80 flex flex-col shrink-0">
            <div className="p-3 border-b border-stone-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Workspace Files</span>
              <button onClick={() => alert("File creation ready")} className="p-1 hover:bg-stone-100 rounded text-[#2F6BFF]">
                <Plus className="w-4 h-4 font-bold" />
              </button>
            </div>

            <div className="p-2 space-y-1 overflow-y-auto text-xs flex-1">
              {files.map((item, idx) => (
                <div key={idx}>
                  {item.isDir ? (
                    <div>
                      <div
                        onClick={() => item.name === "src" ? setIsSrcExpanded(!isSrcExpanded) : setIsAssetsExpanded(!isAssetsExpanded)}
                        className="flex items-center justify-between px-2 py-1 text-stone-700 font-medium hover:bg-stone-50 rounded-md cursor-pointer group"
                      >
                        <div className="flex items-center gap-1.5">
                          <CaretDown className="w-3 h-3 text-stone-400" />
                          <Folder className="w-3.5 h-3.5 text-amber-500" />
                          <span>{item.name}</span>
                        </div>
                      </div>

                      <div className="ml-4 space-y-0.5 border-l border-stone-100 pl-2">
                        {item.children.map((child, cIdx) => (
                          <div
                            key={cIdx}
                            onClick={() => handleSelectFile(child)}
                            className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer transition-colors group ${
                              activeFile?.name === child.name ? "bg-[#2F6BFF]/10 text-[#2F6BFF] font-semibold" : "text-stone-600 hover:bg-stone-50"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <FileCode className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              <span className="truncate">{child.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 2: Main Canvas (CENTER) */}
        <div className="flex-1 flex flex-col bg-[#1E1E1E] text-stone-200 overflow-hidden min-w-0">
          {mainCanvasView === "codebase" ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Open File Tabs Header */}
              <div className="h-9 bg-[#252526] border-b border-[#333333] flex items-center px-2 gap-1 overflow-x-auto">
                {openTabs.map((t, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectFile(t)}
                    className={`px-3 py-1 rounded-t-md text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors ${
                      activeFile?.name === t.name ? "bg-[#1E1E1E] text-white font-semibold border-t-2 border-[#2F6BFF]" : "text-stone-400 hover:bg-[#2D2D2D]"
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t.name}</span>
                    <span onClick={(e) => handleCloseTab(e, t.name)} className="hover:text-rose-400 text-stone-500 font-bold ml-1 px-1 rounded">
                      ✕
                    </span>
                  </div>
                ))}
              </div>

              {/* Code Editor Area */}
              <div className="flex-1 p-4 relative font-mono text-xs overflow-auto bg-[#1E1E1E]">
                <textarea
                  value={editorContent}
                  onChange={(e) => handleEditorChange(e.target.value)}
                  className="w-full h-full bg-transparent text-emerald-300 outline-none resize-none font-mono text-xs leading-relaxed"
                  spellCheck="false"
                />
              </div>

              {/* Bottom Drawer Bar (Problems, Terminal, Autonomous Logs) */}
              <div className="h-8 bg-[#252526] border-t border-[#333333] px-3 flex items-center justify-between text-xs text-stone-400">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveBottomTab("problems")}
                    className={`flex items-center gap-1 font-mono hover:text-white ${activeBottomTab === "problems" ? "text-rose-400 font-bold" : ""}`}
                  >
                    <WarningCircle className="w-3.5 h-3.5" />
                    <span>Problems ({diagnostics.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveBottomTab("terminal")}
                    className={`flex items-center gap-1 font-mono hover:text-white ${activeBottomTab === "terminal" ? "text-white font-bold" : ""}`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Terminal CLI</span>
                  </button>
                  <button
                    onClick={() => setActiveBottomTab("autonomous")}
                    className={`flex items-center gap-1 font-mono hover:text-white ${activeBottomTab === "autonomous" ? "text-purple-400 font-bold" : ""}`}
                  >
                    <Robot className="w-3.5 h-3.5 text-purple-400" />
                    <span>Autonomous Engine ({backgroundLogs.length})</span>
                  </button>
                </div>

                <button onClick={() => setBottomDrawerOpen(!bottomDrawerOpen)} className="hover:text-white text-[11px]">
                  {bottomDrawerOpen ? "Minimize ↓" : "Expand ↑"}
                </button>
              </div>

              {/* Bottom Panel Drawers */}
              {bottomDrawerOpen && (
                <div className="h-40 bg-[#181818] border-t border-[#333333] p-3 font-mono text-[11px] text-stone-300 overflow-hidden flex flex-col">
                  {/* 1. PROBLEMS & DIAGNOSTICS CENTER WITH 1-CLICK "SEND TO AI" */}
                  {activeBottomTab === "problems" && (
                    <div className="flex-1 overflow-y-auto space-y-2">
                      {diagnostics.length > 0 ? (
                        diagnostics.map((diag) => (
                          <div key={diag.id} className="p-2.5 bg-[#222222] border border-[#333333] rounded-xl flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 truncate">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${diag.severity === "error" ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"}`}>
                                {diag.severity}
                              </span>
                              <span className="text-stone-400 font-bold">{diag.file}:{diag.line}</span>
                              <span className="text-stone-200 truncate">{diag.message}</span>
                            </div>

                            {/* 1-CLICK "SEND TO AI" AUTO-FIX BUTTON */}
                            <button
                              onClick={() => handleSendDiagnosticToAi(diag)}
                              disabled={isAiFixingDiag}
                              className="px-3 py-1 bg-[#2F6BFF] hover:bg-blue-600 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 shrink-0 transition-colors shadow-xs"
                            >
                              {isAiFixingDiag && selectedDiag?.id === diag.id ? (
                                <>
                                  <Spinner className="w-3 h-3 animate-spin" />
                                  <span>Fixing...</span>
                                </>
                              ) : (
                                <>
                                  <Lightning className="w-3 h-3" />
                                  <span>⚡ Send to AI Fix</span>
                                </>
                              )}
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-emerald-400 font-bold text-xs p-3">✓ Zero diagnostic problems detected in active workspace.</div>
                      )}
                    </div>
                  )}

                  {/* 2. TERMINAL CLI */}
                  {activeBottomTab === "terminal" && (
                    <div className="flex-1 flex flex-col justify-between overflow-hidden">
                      <div className="flex-1 overflow-y-auto space-y-1">
                        {terminalLogs.map((log, idx) => (
                          <div key={idx} className={log.type === "cmd" ? "text-emerald-400" : "text-stone-400"}>
                            {log.type === "cmd" ? `$ ${log.text}` : log.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. AUTONOMOUS BACKGROUND ENGINE FEED & CONTROLS */}
                  {activeBottomTab === "autonomous" && (
                    <div className="flex-1 flex flex-col justify-between overflow-hidden space-y-2">
                      <div className="flex items-center justify-between text-xs pb-1 border-b border-[#2D2D2D]">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isAutonomousRunning ? "bg-emerald-500 animate-pulse" : "bg-stone-500"}`} />
                          <span className="font-bold text-stone-200">
                            {isAutonomousRunning ? "Autonomous Background Supervision Active" : "Autonomous Supervision Paused"}
                          </span>
                        </div>
                        <button
                          onClick={toggleAutonomousEngine}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold ${isAutonomousRunning ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`}
                        >
                          {isAutonomousRunning ? "Pause Engine" : "Start Autonomous Mode"}
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-1 text-[10px]">
                        {backgroundLogs.map((log) => (
                          <div key={log.id} className="text-stone-400">
                            <span className="text-stone-600">[{log.timestamp}]</span> {log.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : mainCanvasView === "task-board" ? (
            /* AI TASK BOARD CANVAS */
            <div className="flex-1 p-6 bg-[#FAF8F4] overflow-y-auto">
              <TaskBoard />
            </div>
          ) : (
            /* LIVE PREVIEW MODE */
            <div className="flex-1 flex flex-col h-full bg-[#FAF8F4] overflow-hidden">
              <div className="p-2.5 bg-white border-b border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-stone-800">http://localhost:3000</span>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-auto flex justify-center items-start">
                <div className="w-full bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden max-w-5xl min-h-[500px]">
                  <iframe
                    title="HVRC Live App Preview"
                    className="w-full h-full min-h-[550px] border-none"
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <meta charset="utf-8" />
                        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                        <style>
                          body { margin: 0; font-family: system-ui, sans-serif; background: #FAF8F4; }
                        </style>
                      </head>
                      <body>
                        <div id="root"></div>
                        <script type="text/babel">
                          const { useState, useEffect, useRef, useCallback, useMemo } = React;
                          ${editorContent.replace(/import React.*from "react";/, "").replace(/export default function/, "function")}
                          ReactDOM.createRoot(document.getElementById('root')).render(<App />);
                        </script>
                      </body>
                      </html>
                    `}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PANEL 3: MULTI-AGENT SIDEBAR (RIGHT SIDE) */}
        {isAiPanelOpen && (
          <div className="w-[380px] bg-white border-l border-stone-200/80 flex flex-col shrink-0">
            <div className="p-3 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between text-xs font-semibold text-stone-700">
              <span className="flex items-center gap-1.5 font-bold text-stone-900">
                <Robot className="w-4 h-4 text-[#2F6BFF]" />
                <span>Multi-Agent Platform</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                4 Active Co-Workers
              </span>
            </div>

            {/* Active Co-Working Workers Indicator */}
            <div className="p-2 bg-stone-100/70 border-b border-stone-200/60 flex items-center gap-1 overflow-x-auto text-[10px]">
              {WORKER_ROLES.slice(1, 5).map((w) => (
                <span key={w.id} className="bg-white border border-stone-200 px-2 py-0.5 rounded-md font-bold text-stone-700 flex items-center gap-1 shrink-0">
                  <span>{w.icon}</span>
                  <span>{w.name.split(" ")[0]}</span>
                </span>
              ))}
            </div>

            {/* AI Messages Feed */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
              {aiMessages.map((m, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#2F6BFF] text-white ml-6 font-medium shadow-2xs"
                      : "bg-stone-50 text-stone-800 border border-stone-200/80 mr-4 font-normal whitespace-pre-wrap"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {isAiLoading && (
                <div className="p-3 bg-blue-50 text-[#2F6BFF] rounded-2xl border border-blue-100 mr-4 flex items-center gap-2 text-xs font-semibold">
                  <Spinner className="w-4 h-4 animate-spin" />
                  <span>Primary Agent delegating to Co-Workers...</span>
                </div>
              )}
              <div ref={chatMessagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-stone-200/80 bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask Primary Agent or Co-Workers to build, test, review..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAiSend()}
                disabled={isAiLoading}
                className="flex-1 bg-stone-100/80 border border-stone-200 rounded-xl px-3 py-2 text-xs outline-none text-stone-800 focus:border-[#2F6BFF]"
              />
              <button onClick={handleAiSend} disabled={isAiLoading} className="p-2 bg-[#2F6BFF] text-white rounded-xl hover:bg-blue-700">
                <PaperPlane className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* WebGL 3D Studio Modal */}
      {show3DModal && (
        <ThreeDStudioModal
          onClose={() => setShow3DModal(false)}
          onExportToWorkspace={(asset) => {
            setShow3DModal(false);
            applyCodeToWorkspace(`// Exported WebGL 3D Asset: ${asset.name}\n// Preset: ${asset.preset}\n`);
          }}
        />
      )}
    </div>
  );
}
