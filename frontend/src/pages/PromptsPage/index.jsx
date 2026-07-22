import React, { useState, useEffect } from "react";
import { Lightning, Plus, BookmarkSimple, Copy, Check, Trash } from "@phosphor-icons/react";

export default function PromptsPage() {
  const [prompts, setPrompts] = useState(() => {
    const saved = localStorage.getItem("hvrc_prompts_library");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, title: "Senior Code Architect", category: "Coding", text: "Act as a senior software architect. Analyze codebase structure, detect performance bottlenecks, and refactor using modern clean code patterns." },
      { id: 2, title: "React Component Generator", category: "UI/UX", text: "Create a modern, responsive React component using Tailwind CSS, featuring creamy white theme variables and subtle micro-animations." }
    ];
  });

  const [copiedId, setCopiedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Coding");
  const [newText, setNewText] = useState("");

  useEffect(() => {
    localStorage.setItem("hvrc_prompts_library", JSON.stringify(prompts));
  }, [prompts]);

  const handleCopy = (p) => {
    navigator.clipboard.writeText(p.text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreatePrompt = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) return;

    const newP = {
      id: Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      text: newText.trim()
    };

    setPrompts([newP, ...prompts]);
    setNewTitle("");
    setNewText("");
    setShowAddModal(false);
  };

  const handleDeletePrompt = (id) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in font-sans">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2F6BFF] text-xs font-semibold mb-2">
            <Lightning className="w-3.5 h-3.5" />
            <span>Prompt Engineering</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Prompt Library</h1>
          <p className="text-stone-600 text-xs mt-1">Curated prompt templates for software engineering, design systems, and AI workflows.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-[#2F6BFF] text-white text-xs font-bold rounded-2xl hover:bg-blue-700 shadow-md shadow-[#2F6BFF]/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Prompt Template</span>
        </button>
      </div>

      {/* New Prompt Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-stone-900">Create New Prompt Template</h3>
            <form onSubmit={handleCreatePrompt} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Prompt Title</label>
                <input
                  type="text"
                  placeholder="e.g. Code Refactor Assistant"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#2F6BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#2F6BFF]"
                >
                  <option value="Coding">Coding</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Docs">Docs</option>
                  <option value="Architecture">Architecture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Prompt Template Text</label>
                <textarea
                  rows="4"
                  placeholder="Act as a senior software architect..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#2F6BFF]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#2F6BFF] text-white text-xs font-bold rounded-xl hover:bg-blue-700"
                >
                  Save Prompt Template
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-600 text-xs font-bold rounded-xl hover:bg-stone-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {prompts.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-stone-200/80 text-center space-y-2 text-xs text-stone-400">
          <Lightning className="w-8 h-8 text-stone-300 mx-auto" />
          <p className="font-bold text-stone-700">No prompt templates saved yet.</p>
          <p>Click "+ New Prompt Template" above to save your first custom prompt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {prompts.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#2F6BFF] bg-blue-50 px-2.5 py-0.5 rounded-full">{p.category}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleCopy(p)} className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400">
                      {copiedId === p.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDeletePrompt(p.id)} className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-stone-400 transition-colors">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-base font-bold text-stone-900">{p.title}</h3>
                <p className="text-xs text-stone-500 font-mono line-clamp-3 bg-stone-50 p-3 rounded-2xl border border-stone-100 mt-2">{p.text}</p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                <button onClick={() => handleCopy(p)} className="text-xs font-bold text-[#2F6BFF] hover:underline">
                  {copiedId === p.id ? "✓ Copied to Clipboard!" : "Copy Prompt Text"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
