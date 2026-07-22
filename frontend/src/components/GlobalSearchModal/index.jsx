import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlass,
  FolderOpen,
  FileCode,
  ChatCircleText,
  Lightning,
  Cpu,
  X
} from "@phosphor-icons/react";

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchResults = [
    { title: "HVRC Website SaaS Platform", type: "project", path: "/project/default/workspace", icon: FolderOpen },
    { title: "React Component Library", type: "project", path: "/projects", icon: FolderOpen },
    { title: "index.jsx (Main Shell)", type: "file", path: "/project/default/workspace", icon: FileCode },
    { title: "Tailwind CSS Design Tokens", type: "file", path: "/project/default/workspace", icon: FileCode },
    { title: "Refactor API Layer & Provider Routing", type: "chat", path: "/project/default/chat", icon: ChatCircleText },
    { title: "Codebase Architect System Prompt", type: "prompt", path: "/prompts", icon: Lightning },
    { title: "Claude 3.5 Sonnet (Anthropic)", type: "model", path: "/models", icon: Cpu },
  ].filter(
    (item) =>
      !query || item.title.toLowerCase().includes(query.toLowerCase()) || item.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-start justify-center pt-20 px-4 animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Search Header */}
        <div className="p-3 border-b border-stone-100 flex items-center gap-3">
          <MagnifyingGlass className="w-5 h-5 text-stone-400 ml-1" />
          <input
            type="text"
            autoFocus
            placeholder="Search projects, files, chats, prompts, models..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-stone-800 placeholder-stone-400 font-medium"
          />
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {searchResults.length > 0 ? (
            searchResults.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-stone-50 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-[#2F6BFF]/10 group-hover:text-[#2F6BFF] text-stone-500 flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-stone-800 group-hover:text-[#2F6BFF] transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-stone-400 capitalize">{item.type}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-stone-400 group-hover:text-stone-600">Jump ↵</span>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-stone-400">No results found for "{query}"</div>
          )}
        </div>

        {/* Search Footer */}
        <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1 py-0.5 bg-white border rounded text-[9px]">↑</kbd>
            <kbd className="px-1 py-0.5 bg-white border rounded text-[9px]">↓</kbd>
            <span>Select:</span>
            <kbd className="px-1 py-0.5 bg-white border rounded text-[9px]">↵</kbd>
          </div>
          <div>HVRC.AI Global Search</div>
        </div>
      </div>
    </div>
  );
}
