import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FolderPlus,
  FolderOpen,
  CodeBlock,
  ChatCircleText,
  MagnifyingGlass,
  Sparkle,
  Trash,
  Plus,
  X,
  FileCode,
  CheckCircle,
  HardDrive
} from "@phosphor-icons/react";

const DEFAULT_STARTER_PROJECTS = [
  {
    id: "default",
    name: "Default React Workspace",
    slug: "default",
    updated: "Active Now",
    desc: "Interactive React IDE sandbox with live web compiler and Multi-Agent Swarms.",
    status: "Active",
    template: "react"
  },
  {
    id: "proj-agent-suite",
    name: "AI Agent Orchestrator Suite",
    slug: "agent-suite",
    updated: "1 hour ago",
    desc: "Parallel multi-agent workflow routines with Reviewer, Tester, and Bug Hunter.",
    status: "Active",
    template: "agents"
  },
  {
    id: "proj-rag-kb",
    name: "Vector Knowledge Base & RAG",
    slug: "rag-kb",
    updated: "Yesterday",
    desc: "Vector embeddings, PDF document search, and technical grounding pipeline.",
    status: "Active",
    template: "rag"
  }
];

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTemplate, setNewTemplate] = useState("blank"); // 'blank' | 'react'

  // Persistent user projects state in localStorage
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("hvrc_user_projects");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_STARTER_PROJECTS;
  });

  useEffect(() => {
    localStorage.setItem("hvrc_user_projects", JSON.stringify(projects));
  }, [projects]);

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const slug = newName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newProject = {
      id: `proj-${Date.now()}`,
      name: newName.trim(),
      slug: slug || `project-${Date.now()}`,
      updated: "Just now",
      desc: newDesc.trim() || (newTemplate === "blank" ? "Clean blank workspace created from scratch." : "Interactive full-stack React workspace."),
      status: "Active",
      template: newTemplate
    };

    setProjects([newProject, ...projects]);
    setNewName("");
    setNewDesc("");
    setShowModal(false);
    navigate(`/project/${newProject.slug}/workspace`);
  };

  const handleDeleteProject = (projectId, projectName, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const remaining = projects.filter((p) => p.id !== projectId);
    setProjects(remaining);
    localStorage.setItem("hvrc_user_projects", JSON.stringify(remaining));
  };

  const handleResetToDefaults = () => {
    if (confirm("Reset to default starter projects?")) {
      setProjects(DEFAULT_STARTER_PROJECTS);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in font-sans text-[#1C1917]">
      
      {/* ══ HEADER ══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2F6BFF] text-xs font-bold mb-2">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Workspace Project Manager</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Workspace Projects ({projects.length})
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Every project has its own dedicated files, live sandbox IDE, and Multi-Agent Swarm conversations.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-[#2F6BFF] text-white text-xs font-extrabold rounded-2xl hover:bg-blue-700 shadow-md shadow-[#2F6BFF]/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Create New Project</span>
          </button>
        </div>
      </div>

      {/* ══ SEARCH & FILTER BAR ══ */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <MagnifyingGlass className="w-4 h-4 text-stone-400 ml-1 shrink-0" />
          <input
            type="text"
            placeholder="Search projects by name, description, or tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs text-stone-800 placeholder-stone-400 font-medium"
          />
        </div>

        <button
          onClick={handleResetToDefaults}
          className="text-[11px] font-bold text-stone-400 hover:text-stone-700 px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors"
          title="Restore default templates"
        >
          Reset Defaults
        </button>
      </div>

      {/* ══ PROJECTS GRID ══ */}
      {filtered.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-stone-200/90 text-center space-y-3 shadow-2xs">
          <FolderOpen className="w-10 h-10 text-stone-300 mx-auto" />
          <div className="text-sm font-extrabold text-stone-700">No matching projects found.</div>
          <p className="text-xs text-stone-500">Create a new project or clear your search query.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#2F6BFF] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer shadow-sm"
          >
            + Create New Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-[#2F6BFF] transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2F6BFF] flex items-center justify-center font-bold shadow-inner">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.status || "Active"}
                      </span>
                    </div>
                  </div>

                  {/* Direct Delete Project Button */}
                  <button
                    onClick={(e) => handleDeleteProject(p.id, p.name, e)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title={`Delete "${p.name}"`}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-display font-extrabold text-base text-stone-900 mb-1">{p.name}</h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{p.desc}</p>
                <div className="mt-2 text-[10px] font-mono text-stone-400">Slug: /project/{p.slug}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-stone-100">
                <Link
                  to={`/project/${p.slug}/workspace`}
                  className="flex-1 py-2 rounded-xl bg-[#2F6BFF] text-white text-center text-xs font-extrabold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <CodeBlock className="w-3.5 h-3.5" />
                  <span>Open IDE</span>
                </Link>

                <Link
                  to={`/project/${p.slug}/chat`}
                  className="py-2 px-4 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200 transition-colors"
                >
                  Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ CREATE PROJECT MODAL ══ */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2F6BFF] flex items-center justify-center font-bold">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-stone-900">Create New Project</h3>
                  <p className="text-xs text-stone-500">Configure your workspace files and starter code.</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-800 p-1 cursor-pointer"
              >
                <X className="w-4 h-4 font-bold" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-800">Project Name *</label>
                <input
                  type="text"
                  placeholder="e.g. My Next-Gen SaaS or Mobile Dashboard"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 outline-none focus:border-[#2F6BFF] focus:bg-white transition-all"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-800">Project Description</label>
                <textarea
                  placeholder="Brief description of what this project builds..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 outline-none focus:border-[#2F6BFF] focus:bg-white resize-none transition-all"
                />
              </div>

              {/* Starter Choice */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-800">Starter Template</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewTemplate("blank")}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      newTemplate === "blank"
                        ? "bg-blue-50/70 border-[#2F6BFF] text-[#2F6BFF] shadow-2xs font-bold"
                        : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <span>📄</span>
                      <span>Blank Canvas</span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">Start completely fresh from zero code.</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewTemplate("react")}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      newTemplate === "react"
                        ? "bg-blue-50/70 border-[#2F6BFF] text-[#2F6BFF] shadow-2xs font-bold"
                        : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <span>⚛️</span>
                      <span>React + Tailwind</span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">Full starter with interactive state demo.</div>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newName.trim()}
                  className="px-6 py-2.5 bg-[#2F6BFF] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-[#2F6BFF]/20 cursor-pointer disabled:opacity-50"
                >
                  Create &amp; Open Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
