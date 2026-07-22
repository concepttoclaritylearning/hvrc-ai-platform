import React, { useState } from "react";
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
  Star
} from "@phosphor-icons/react";
import useUser from "@/hooks/useUser";
import { useModel } from "@/ModelContext";

export default function Navbar({ onOpenSearch, projects = [], activeProject, onSelectProject }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const { activeModel, selectModel, providers, modelsMap, getPinnedModelsList } = useModel();

  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const pinnedModels = getPinnedModelsList();

  return (
    <header className="h-14 bg-white border-b border-stone-200/80 px-4 flex items-center justify-between z-30 sticky top-0 shadow-sm font-sans">
      {/* Left: Brand & Project Selector */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-[#2F6BFF] flex items-center justify-center text-white font-bold shadow-sm shadow-[#2F6BFF]/20 group-hover:scale-105 transition-transform">
            <Lightning weight="fill" className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-stone-900">
            HVRC<span className="text-[#2F6BFF]">.AI</span>
          </span>
        </Link>

        <span className="text-stone-300 font-light">/</span>

        {/* Project Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-700 bg-stone-100/80 hover:bg-stone-200/70 border border-stone-200/60 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="max-w-[140px] truncate">{activeProject?.name || "Default Project"}</span>
            <CaretDown className="w-3 h-3 text-stone-400" />
          </button>

          {showProjectDropdown && (
            <div
              className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200/80 py-2 z-50 animate-fade-in"
              onMouseLeave={() => setShowProjectDropdown(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Select Project
              </div>
              <div className="max-h-56 overflow-y-auto">
                {projects.length > 0 ? (
                  projects.map((p) => (
                    <button
                      key={p.id || p.slug}
                      onClick={() => {
                        onSelectProject && onSelectProject(p);
                        setShowProjectDropdown(false);
                        navigate(`/project/${p.slug || p.id}`);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center justify-between"
                    >
                      <span className="truncate">{p.name}</span>
                      {activeProject?.slug === p.slug && (
                        <span className="text-[10px] font-semibold text-[#2F6BFF] bg-[#2F6BFF]/10 px-2 py-0.5 rounded-full">
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
                  className="w-full text-left px-2 py-1.5 text-xs font-medium text-[#2F6BFF] hover:bg-blue-50/60 rounded-lg flex items-center gap-1.5"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Create / Manage Projects</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Global Search Trigger */}
      <button
        onClick={onOpenSearch}
        className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-stone-100/70 hover:bg-stone-200/70 border border-stone-200/80 rounded-xl text-xs text-stone-500 min-w-[280px] justify-between transition-colors shadow-inner"
      >
        <div className="flex items-center gap-2">
          <MagnifyingGlass className="w-3.5 h-3.5 text-stone-400" />
          <span>Search projects, files, chats, prompts...</span>
        </div>
        <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-stone-400 bg-white border border-stone-200 rounded-md shadow-2xs">
          ⌘K
        </kbd>
      </button>

      {/* Right: Active Model Selector & User Menu */}
      <div className="flex items-center gap-3">
        {/* User Selected Models Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-700 bg-white border border-stone-200 hover:border-stone-300 shadow-2xs transition-colors"
          >
            <Sparkle weight="fill" className="w-3.5 h-3.5 text-[#2F6BFF]" />
            <span className="font-bold text-stone-900 truncate max-w-[120px] lg:max-w-[180px]">
              {activeModel?.name || "Select AI Model"}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 bg-blue-50 text-[#2F6BFF] rounded font-bold hidden lg:inline">
              {activeModel?.provider || "NVIDIA NIM"}
            </span>
            <CaretDown className="w-3 h-3 text-stone-400" />
          </button>

          {showModelDropdown && (
            <div
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200/80 py-2 z-50 animate-fade-in"
              onMouseLeave={() => setShowModelDropdown(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider flex justify-between items-center border-b border-stone-100">
                <span>Selected Active Models ({pinnedModels.length})</span>
                <Link to="/models" className="text-[#2F6BFF] hover:underline lowercase font-semibold">
                  Manage Hub →
                </Link>
              </div>

              <div className="max-h-72 overflow-y-auto py-1 space-y-1">
                {pinnedModels.length > 0 ? (
                  pinnedModels.map((m) => {
                    const isSelected = activeModel?.id === m.id;
                    const pId = m.providerId || (m.id.includes("nvapi") ? "nvidia" : m.id.includes("groq") ? "groq" : "openrouter");
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          selectModel(pId, m);
                          setShowModelDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl hover:bg-stone-50 flex items-center justify-between text-xs transition-colors ${
                          isSelected ? "bg-blue-50/70 text-[#2F6BFF] font-semibold" : "text-stone-700"
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="truncate font-bold">{m.name || m.id}</div>
                          <div className="text-[10px] text-stone-400 truncate font-mono">{m.id}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#2F6BFF] shrink-0" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-stone-400">
                    No models pinned yet. Visit <Link to="/models" className="text-[#2F6BFF] underline font-bold">Model Hub</Link> to pick your favorite models.
                  </div>
                )}
              </div>

              <div className="border-t border-stone-100 mt-1 pt-2 px-3">
                <Link
                  to="/models"
                  onClick={() => setShowModelDropdown(false)}
                  className="block text-center py-1.5 text-xs font-bold text-[#2F6BFF] bg-blue-50 hover:bg-blue-100 rounded-xl"
                >
                  + Add / Pin More Models in Hub
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <button className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2F6BFF]"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium text-xs shadow-sm hover:ring-2 hover:ring-[#2F6BFF]/30 transition-all"
          >
            {user?.username?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || "H"}
          </button>

          {showProfileDropdown && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200/80 py-2 z-50 animate-fade-in font-sans"
              onMouseLeave={() => setShowProfileDropdown(false)}
            >
              <div className="px-4 py-2 border-b border-stone-100">
                <div className="text-xs font-bold text-stone-900">{user?.name || "HVRC Developer"}</div>
                <div className="text-[11px] text-stone-500 font-mono truncate">{user?.email || "dev@hvrc.ai"}</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    navigate("/settings/profile");
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-stone-400" />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    navigate("/settings/agents");
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                >
                  <Gear className="w-4 h-4 text-stone-400" />
                  <span>System Preferences</span>
                </button>
              </div>
              <div className="border-t border-stone-100 pt-1 mt-1">
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
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
