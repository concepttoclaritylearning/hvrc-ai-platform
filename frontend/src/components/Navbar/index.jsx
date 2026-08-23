import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MagnifyingGlass,
  Sparkle,
  CaretDown,
  Bell,
  User,
  FolderPlus,
  Gear,
  SignOut,
  Lightning,
  Check,
  HardDrive,
  Cpu,
  CheckCircle,
  CloudCheck
} from "@phosphor-icons/react";
import useUser from "@/hooks/useUser";
import { useModel } from "@/ModelContext";
import { signOutUser } from "@/utils/supabase";

export default function Navbar({ onOpenSearch, projects = [], activeProject, onSelectProject }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const {
    activeModel,
    selectModel,
    availableChatModels,
    userSelectedModels,
    providers
  } = useModel();

  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [driveConnected, setDriveConnected] = useState(() => {
    return localStorage.getItem("hvrc_drive_connected") !== "false";
  });

  const toggleDriveSync = () => {
    const next = !driveConnected;
    setDriveConnected(next);
    localStorage.setItem("hvrc_drive_connected", String(next));
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn("Sign out notice:", e);
    }
    localStorage.removeItem("hvrc_dev_session");
    window.location.href = "/landing";
  };

  // Combine discovered chat models with safety fallback
  const allModelsList =
    userSelectedModels?.length > 0
      ? userSelectedModels
      : availableChatModels?.length > 0
      ? availableChatModels
      : [
          { id: "meta/llama-3.3-70b-instruct", name: "Meta Llama 3.3 70B", provider: "NVIDIA NIM" },
          { id: "deepseek-ai/deepseek-r1", name: "DeepSeek R1", provider: "NVIDIA NIM" },
          { id: "qwen/qwen2.5-72b-instruct", name: "Qwen 2.5 72B", provider: "NVIDIA NIM" },
          { id: "openai/gpt-4o", name: "OpenAI GPT-4o", provider: "OpenAI" },
          { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
          { id: "mistralai/mistral-large-2407", name: "Mistral Large", provider: "Mistral" }
        ];

  const filteredModels = allModelsList.filter(
    (m) =>
      m.name?.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
      m.id?.toLowerCase().includes(modelSearchQuery.toLowerCase())
  );

  return (
    <header className="h-14 bg-white border-b border-stone-200/90 px-4 flex items-center justify-between z-30 sticky top-0 shadow-2xs font-sans text-[#1C1917]">
      
      {/* ══ LEFT: BRAND & PROJECT SELECTOR ══ */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-[#2F6BFF] flex items-center justify-center text-white font-bold shadow-md shadow-[#2F6BFF]/20 group-hover:scale-105 transition-transform">
            <Lightning weight="fill" className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-black text-lg tracking-tight text-stone-900">
            HVRC<span className="text-[#2F6BFF]">.AI</span>
          </span>
        </Link>

        <span className="text-stone-300 font-light">/</span>

        {/* Project Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-800 bg-stone-100/90 hover:bg-stone-200/80 border border-stone-200/80 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="max-w-[140px] truncate">{activeProject?.name || "Default Project"}</span>
            <CaretDown className="w-3 h-3 text-stone-400" />
          </button>

          {showProjectDropdown && (
            <div
              className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2 z-50 animate-fade-in"
              onMouseLeave={() => setShowProjectDropdown(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Select Active Project
              </div>
              <div className="max-h-56 overflow-y-auto">
                {projects.length > 0 ? (
                  projects.map((p) => (
                    <button
                      key={p.id || p.slug}
                      onClick={() => {
                        onSelectProject && onSelectProject(p);
                        setShowProjectDropdown(false);
                        navigate(`/project/${p.slug || p.id}/workspace`);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{p.name}</span>
                      {activeProject?.slug === p.slug && (
                        <span className="text-[10px] font-bold text-[#2F6BFF] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          Active
                        </span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-stone-500">Default Project</div>
                )}
              </div>
              <div className="border-t border-stone-100 mt-1 pt-1 px-2">
                <button
                  onClick={() => {
                    setShowProjectDropdown(false);
                    navigate("/projects");
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs font-bold text-[#2F6BFF] hover:bg-blue-50 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>+ Create / Manage Projects</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ MIDDLE: GLOBAL SEARCH TRIGGER ══ */}
      <button
        onClick={onOpenSearch}
        className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-stone-100/80 hover:bg-stone-200/80 border border-stone-200/80 rounded-xl text-xs text-stone-500 min-w-[260px] justify-between transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <MagnifyingGlass className="w-3.5 h-3.5 text-stone-400" />
          <span>Quick Search or Commands...</span>
        </div>
        <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-stone-400 bg-white border border-stone-200 rounded-md shadow-2xs">
          ⌘K
        </kbd>
      </button>

      {/* ══ RIGHT: GOOGLE DRIVE STATUS, MODEL SELECTOR & PROFILE ══ */}
      <div className="flex items-center gap-2.5">
        
        {/* Google Drive Connection Indicator */}
        <button
          onClick={toggleDriveSync}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
            driveConnected
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
          }`}
          title={driveConnected ? "Google Drive Sync Active (Encrypted)" : "Click to connect Google Drive sync"}
        >
          <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{driveConnected ? "Drive: Sync Active" : "Connect Drive"}</span>
        </button>

        {/* ══ PROMINENT UNIVERSAL MODEL SELECTOR ══ */}
        <div className="relative">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-900 bg-blue-50/70 border border-blue-200/80 hover:border-[#2F6BFF] shadow-2xs transition-colors cursor-pointer"
          >
            <Sparkle weight="fill" className="w-3.5 h-3.5 text-[#2F6BFF]" />
            <span className="truncate max-w-[130px] lg:max-w-[190px]">
              {activeModel?.name || "Meta Llama 3.3 70B"}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#2F6BFF] text-white rounded-md font-extrabold hidden lg:inline">
              Free NIM
            </span>
            <CaretDown className="w-3 h-3 text-stone-400" />
          </button>

          {showModelDropdown && (
            <div
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2 z-50 animate-fade-in font-sans"
              onMouseLeave={() => setShowModelDropdown(false)}
            >
              <div className="px-3 py-1.5 border-b border-stone-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Select Active Model ({filteredModels.length})
                </span>
                <Link to="/models" className="text-[11px] font-bold text-[#2F6BFF] hover:underline">
                  Model Hub (460+) →
                </Link>
              </div>

              {/* Model Search Input */}
              <div className="p-2 border-b border-stone-100">
                <input
                  type="text"
                  placeholder="Filter models..."
                  value={modelSearchQuery}
                  onChange={(e) => setModelSearchQuery(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-[#2F6BFF]"
                />
              </div>

              <div className="max-h-64 overflow-y-auto py-1 space-y-0.5">
                {filteredModels.map((m) => {
                  const isSelected = activeModel?.id === m.id || activeModel?.name === m.name;
                  const pId = m.providerId || "nvidia";
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        selectModel(pId, m);
                        setShowModelDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl hover:bg-stone-50 flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        isSelected ? "bg-blue-50 text-[#2F6BFF] font-bold" : "text-stone-700"
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate font-extrabold text-stone-900">{m.name || m.id}</div>
                        <div className="text-[10px] text-stone-400 font-mono truncate">{m.id}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#2F6BFF] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-stone-100 mt-1 pt-1.5 px-2">
                <Link
                  to="/models"
                  onClick={() => setShowModelDropdown(false)}
                  className="block text-center py-1.5 text-xs font-extrabold text-[#2F6BFF] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                >
                  Configure BYOK API Keys &amp; Providers
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs shadow-sm hover:ring-2 hover:ring-[#2F6BFF]/30 transition-all cursor-pointer"
          >
            {user?.username?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || "D"}
          </button>

          {showProfileDropdown && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2 z-50 animate-fade-in font-sans"
              onMouseLeave={() => setShowProfileDropdown(false)}
            >
              <div className="px-4 py-2 border-b border-stone-100">
                <div className="text-xs font-extrabold text-stone-900">{user?.name || "Lead Developer"}</div>
                <div className="text-[11px] text-stone-500 font-mono truncate">{user?.email || "developer@hvrc.ai"}</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <User className="w-4 h-4 text-stone-400" />
                  <span>Profile Settings</span>
                </button>
              </div>
              <div className="border-t border-stone-100 pt-1 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold cursor-pointer"
                >
                  <SignOut className="w-4 h-4 text-rose-500" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
