import React, { useState, useEffect } from "react";
import { ClockCounterClockwise, ChatCircleText, CodeBlock, FileCode, Trash } from "@phosphor-icons/react";

export default function HistoryPage() {
  const [filterType, setFilterType] = useState("all");

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("hvrc_activity_history");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "h-1", title: "Initialized HVRC.AI Zero-Server Workspace", type: "workspace", time: "Just now", project: "Default Workspace" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("hvrc_activity_history", JSON.stringify(history));
  }, [history]);

  const handleClearAllHistory = () => {
    if (window.confirm("Clear all activity logs from history?")) {
      setHistory([]);
    }
  };

  const handleClearChatHistoryOnly = () => {
    if (window.confirm("Delete all AI chat logs from history?")) {
      setHistory((prev) => prev.filter((item) => item.type !== "chat"));
    }
  };

  const handleDeleteItem = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredHistory = filterType === "all" ? history : history.filter((h) => h.type === filterType);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2F6BFF] text-xs font-semibold mb-2">
            <ClockCounterClockwise className="w-3.5 h-3.5" />
            <span>Activity Timeline &amp; Audit Trail</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">History &amp; Logs</h1>
          <p className="text-stone-600 text-xs mt-1">Audit trail of workspace code edits, AI model chats, and file operations.</p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChatHistoryOnly}
              className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-2xl hover:bg-amber-100 flex items-center gap-1.5 transition-colors"
            >
              <Trash className="w-3.5 h-3.5" />
              <span>Delete Chat History</span>
            </button>
            <button
              onClick={handleClearAllHistory}
              className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold rounded-2xl hover:bg-rose-100 flex items-center gap-1.5 transition-colors"
            >
              <Trash className="w-3.5 h-3.5" />
              <span>Clear All Logs</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl w-fit border border-stone-200/80">
        {["all", "chat", "workspace"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              filterType === t ? "bg-white text-[#2F6BFF] shadow-2xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {t === "all" ? "All Activity Logs" : t === "chat" ? "AI Chat Logs" : "Workspace Code Logs"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400 space-y-2">
            <ClockCounterClockwise className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="font-bold text-stone-700">No activity logs found for this filter.</p>
            <p>Your workspace code edits and chat prompts will automatically record here.</p>
          </div>
        ) : (
          filteredHistory.map((h) => (
            <div key={h.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between hover:bg-stone-100/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white text-[#2F6BFF] flex items-center justify-center border border-stone-200 shrink-0">
                  {h.type === "workspace" ? <CodeBlock className="w-4 h-4 text-emerald-600" /> : <ChatCircleText className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-800">{h.title}</div>
                  <div className="text-[10px] text-stone-400">Project: {h.project}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-stone-400 font-mono">{h.time}</span>
                <button
                  onClick={() => handleDeleteItem(h.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete log item"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
