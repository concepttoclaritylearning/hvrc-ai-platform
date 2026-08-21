import React, { useState } from "react";
import {
  Kanban,
  ListChecks,
  GitBranch,
  TrendUp,
  Plus,
  Check,
  Clock,
  Sparkle,
  Trash,
  PencilSimple,
  CircleNotch
} from "@phosphor-icons/react";

export default function TaskBoard({ tasks: initialTasks, onTaskChange }) {
  const [activeView, setActiveView] = useState("kanban"); // 'kanban' | 'timeline' | 'graph' | 'sprint'

  const [tasks, setTasks] = useState(
    initialTasks || [
      { id: "t-1", title: "Initialize Universal Provider Gateway Architecture (460+ Models)", category: "Backend", status: "completed", priority: "high", milestone: "M1" },
      { id: "t-2", title: "Integrate Multi-Agent Swarm Orchestrator & Role Synchronizer", category: "OS Engine", status: "in-progress", priority: "high", milestone: "M1" },
      { id: "t-3", title: "Build AI Task Tree & Synchronized Kanban Board", category: "OS Engine", status: "in-progress", priority: "medium", milestone: "M2" },
      { id: "t-4", title: "Implement Autonomous Background Execution Engine", category: "Autonomous", status: "todo", priority: "high", milestone: "M2" },
      { id: "t-5", title: "Add 1-Click Diagnostics 'Send to AI' Auto-Fix Button", category: "IDE Workspace", status: "todo", priority: "medium", milestone: "M3" }
    ]
  );

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Workspace");

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `t-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      status: "todo",
      priority: "medium",
      milestone: "M2"
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    setNewTaskTitle("");
    if (onTaskChange) onTaskChange(updated);
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
    setTasks(updated);
    if (onTaskChange) onTaskChange(updated);
  };

  const handleDeleteTask = (taskId) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    if (onTaskChange) onTaskChange(updated);
  };

  const columns = [
    { id: "todo", title: "To-Do / Backlog", color: "border-amber-400 text-amber-800 bg-amber-50" },
    { id: "in-progress", title: "In Progress (AI Active)", color: "border-blue-400 text-[#2F6BFF] bg-blue-50" },
    { id: "completed", title: "Completed / Verified", color: "border-emerald-400 text-emerald-800 bg-emerald-50" }
  ];

  return (
    <div className="space-y-4 font-sans text-stone-800">
      {/* View Switcher Header */}
      <div className="flex items-center justify-between border-b border-stone-200/80 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#2F6BFF]/10 text-[#2F6BFF] flex items-center justify-center font-bold">
            <Kanban className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-stone-900">AI Task &amp; Sprint Synchronizer</h3>
            <p className="text-[11px] text-stone-500">Coordinate multi-agent work items and project milestones.</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold">
          {[
            { id: "kanban", label: "Kanban", icon: <Kanban className="w-3.5 h-3.5" /> },
            { id: "timeline", label: "Timeline", icon: <Clock className="w-3.5 h-3.5" /> },
            { id: "graph", label: "Graph", icon: <GitBranch className="w-3.5 h-3.5" /> },
            { id: "sprint", label: "Sprint", icon: <TrendUp className="w-3.5 h-3.5" /> }
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === v.id ? "bg-white text-[#2F6BFF] shadow-2xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {v.icon}
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. KANBAN VIEW */}
      {activeView === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="bg-stone-50/80 rounded-2xl border border-stone-200/80 p-3.5 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${col.color}`}>
                    {col.title} ({colTasks.length})
                  </span>
                </div>

                <div className="flex-1 space-y-2.5 min-h-[140px]">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs hover:border-[#2F6BFF] transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-stone-400">
                        <span className="font-mono">{t.id}</span>
                        <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-mono">{t.category}</span>
                      </div>
                      <div className="text-xs font-bold text-stone-900">{t.title}</div>
                      <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{t.milestone}</span>
                        <div className="flex items-center gap-1">
                          {col.id !== "completed" && (
                            <button
                              onClick={() => handleStatusChange(t.id, col.id === "todo" ? "in-progress" : "completed")}
                              className="p-1 hover:bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold cursor-pointer"
                              title="Advance Status"
                            >
                              ✓ Next
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteTask(t.id)}
                            className="p-1 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. TIMELINE & MILESTONE VIEW */}
      {activeView === "timeline" && (
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
          <div className="font-extrabold text-xs text-stone-900">Project Timeline &amp; Milestones</div>
          <div className="space-y-3">
            {[
              { milestone: "Milestone 1: Universal AI OS Architecture", progress: 100, date: "Completed" },
              { milestone: "Milestone 2: Multi-Agent Swarm Orchestrator & Live Sandbox", progress: 90, date: "Active Sprint" },
              { milestone: "Milestone 3: Autonomous Background Engine & IDE Diagnostics", progress: 60, date: "Next Sprint" }
            ].map((m, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between text-xs font-bold text-stone-800">
                  <span>{m.milestone}</span>
                  <span className="text-[#2F6BFF]">{m.progress}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2F6BFF] h-full transition-all" style={{ width: `${m.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DEPENDENCY GRAPH VIEW */}
      {activeView === "graph" && (
        <div className="p-6 bg-stone-900 text-stone-200 rounded-2xl border border-stone-800 font-mono text-xs space-y-3">
          <div className="font-bold text-emerald-400">Dependency Graph Tree:</div>
          <pre className="text-[11px] text-stone-300 leading-relaxed overflow-x-auto">
{`[HVRC.AI OS Root]
├── (M1) Universal Provider Gateway (Completed)
│   ├── OpenAI Compatible Proxy
│   └── AES-GCM Encryption Engine
├── (M2) Multi-Agent Swarm Orchestrator (Active)
│   ├── Primary Orchestrator + Co-Workers
│   └── Live Web Sandbox IDE
└── (M3) Autonomous Background Supervision (Active)
    ├── Agent Orchestrator
    └── Problems Panel 1-Click AI Fix`}
          </pre>
        </div>
      )}

      {/* 4. SPRINT VIEW */}
      {activeView === "sprint" && (
        <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3 text-xs">
          <div className="font-extrabold text-blue-900 flex items-center justify-between">
            <span>Sprint Velocity: 42 Story Points / Sprint</span>
            <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[10px]">Active Sprint 4</span>
          </div>
          <p className="text-stone-600">
            Current sprint contains {tasks.length} active tasks synchronized with current AI agent workers.
          </p>
        </div>
      )}
    </div>
  );
}
