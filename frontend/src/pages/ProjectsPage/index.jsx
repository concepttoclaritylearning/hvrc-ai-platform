import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FolderPlus, FolderOpen, CodeBlock, ChatCircleText, MagnifyingGlass, Sparkle, Trash, Plus } from "@phosphor-icons/react";

export default function ProjectsPage({ projects = [], onCreateProject }) {
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const projectList = projects.length > 0 ? projects : [
    { id: "default", name: "HVRC Web App SaaS Platform", slug: "default", updated: "Just now", desc: "Browser-first AI OS combining chat, IDE, and vector search.", status: "Active" },
    { id: "proj-2", name: "AI Agent Automation Suite", slug: "agent-suite", updated: "2 hours ago", desc: "Multi-step AI workflow routines and integrations.", status: "Active" },
    { id: "proj-3", name: "RAG Document Knowledge Base", slug: "rag-kb", updated: "Yesterday", desc: "Vector DB embedding pipeline for PDFs and web URLs.", status: "Active" },
  ];

  const filtered = projectList.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  const handleCreate = () => {
    if (!newName.trim()) return;
    if (onCreateProject) {
      onCreateProject({ name: newName, desc: newDesc, slug: newName.toLowerCase().replace(/\s+/g, "-") });
    }
    setNewName("");
    setNewDesc("");
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Projects</h1>
          <p className="text-stone-600 text-xs mt-1">Every chat, codebase workspace, and file belongs to a Project.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-[#2F6BFF] text-white text-xs font-bold rounded-2xl hover:bg-blue-700 shadow-md shadow-[#2F6BFF]/20 flex items-center gap-2"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Create Project</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center gap-3">
        <MagnifyingGlass className="w-4 h-4 text-stone-400 ml-1" />
        <input
          type="text"
          placeholder="Filter projects by name or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-xs text-stone-800 placeholder-stone-400 font-medium"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2F6BFF] flex items-center justify-center font-bold">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {p.status || "Active"}
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1">{p.name}</h3>
              <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-6">{p.desc}</p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-stone-100">
              <Link
                to={`/project/${p.slug}/workspace`}
                className="flex-1 py-2 rounded-xl bg-[#2F6BFF] text-white text-center text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <CodeBlock className="w-3.5 h-3.5" />
                <span>Workspace</span>
              </Link>
              <Link
                to={`/project/${p.slug}/chat`}
                className="py-2 px-4 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition-colors"
              >
                Chat
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-lg font-bold text-stone-900">Create New Project</h3>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Project Name</label>
              <input
                type="text"
                placeholder="e.g. E-Commerce AI Agent"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs outline-none text-stone-800 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
              <textarea
                placeholder="Brief project goals..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs outline-none text-stone-800 font-medium h-20 resize-none"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-5 py-2 rounded-xl bg-[#2F6BFF] text-white text-xs font-bold hover:bg-blue-700 shadow-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
