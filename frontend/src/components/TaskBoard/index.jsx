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
      { id: "t-1", title: "Initialize Universal Provider Gateway Architecture", category: "Backend", status: "completed", priority: "high", milestone: "M1" },
      { id: "t-2", title: "Integrate WebGL 3D Asset Studio & Three.js Viewer", category: "Multimodal", status: "in-progress", priority: "high", milestone: "M1" },
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

  const handleUpdateStatus = (taskId, newStatus) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
    setTasks(updated);
    if (onTaskChange) onTaskChange(updated);
  };

  const handleDeleteTask = (taskId) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    if (onTaskChange) onTaskChange(updated);
  };

  const COLUMNS = [
    { id: "todo", title: "To Do", color: "border-stone-200 bg-stone-50 text-stone-700" },
    { id: "in-progress", title: "In Progress", color: "border-blue-200 bg-blue-50/50 text-[#2F6BFF]" },
    { id: "review", title: "AI Review", color: "border-amber-200 bg-amber-50/50 text-amber-800" },
    { id: "completed", title: "Completed", color: "border-emerald-200 bg-emerald-50/50 text-emerald-800" }
  ];

  return (
    <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-5 font-sans">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-[#2F6BFF]" />
            <h3 className="font-extrabold text-base text-stone-900">Synchronized AI Task Board</h3>
            <span className="text-[10px] font-bold bg-blue-50 text-[#2F6BFF] px-2.5 py-0.5 rounded-full">
              Live Codebase Synchronized
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Auto-generated milestones and dependency trees synchronized with codebase edits.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200/60">
          {[
            { id: "kanban", name: "Kanban", icon: Kanban },
            { id: "timeline", name: "Timeline", icon: Clock },
            { id: "graph", name: "Graph", icon: GitBranch },
            { id: "sprint", name: "Sprint", icon: TrendUp }
          ].map((view) => {
            const IconComponent = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeView === view.id
                    ? "bg-white text-[#2F6BFF] shadow-2xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{view.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Add new task or prompt AI to auto-generate milestones..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs outline-none text-stone-800 focus:border-[#2F6BFF]"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#2F6BFF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </form>

      {/* 1. KANBAN BOARD VIEW */}
      {activeView === "kanban" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200/80 space-y-3">
                <div className={`p-2 rounded-xl border font-extrabold text-xs flex items-center justify-between ${col.color}`}>
                  <span>{col.title}</span>
                  <span className="bg-white/80 px-2 py-0.5 rounded-full text-[10px]">{colTasks.length}</span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs space-y-2 hover:border-stone-300 transition-all"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-xs text-stone-900 leading-snug">{t.title}</span>
                        <button
                          onClick={() => handleDeleteTask(t.id)}
                          className="text-stone-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[10px]">
                        <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                          {t.category}
                        </span>
                        <span className={`font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          t.priority === "high" ? "bg-rose-100 text-rose-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {t.priority}
                        </span>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                        <span>Milestone: <strong>{t.milestone}</strong></span>
                        <select
                          value={t.status}
                          onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                          className="bg-stone-100 border border-stone-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-stone-700 outline-none"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="review">AI Review</option>
                          <option value="completed">Completed</option>
                        </select>
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
              { milestone: "Milestone 2: Multimodal WebGL Studio & Multi-Agent Engine", progress: 85, date: "Active Sprint" },
              { milestone: "Milestone 3: Autonomous Background Engine & IDE Diagnostics", progress: 40, date: "Next Sprint" }
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
├── (M2) Multimodal Generation & WebGL 3D Studio (In Progress)
│   ├── Three.js Orbit Viewer
│   └── Image/Video Generators
└── (M3) Multi-Agent Engine & Diagnostics Auto-Fix (Pending)
    ├── Agent Orchestrator
    └── Problems Panel AI Fix`}
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
