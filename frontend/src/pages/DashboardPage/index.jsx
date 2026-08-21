import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FolderPlus,
  ChatCircleText,
  CodeBlock,
  UploadSimple,
  Sparkle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  UsersThree,
  Globe,
  Terminal,
  FolderOpen,
  ArrowUpRight,
  HardDrive
} from "@phosphor-icons/react";
import useUser from "@/hooks/useUser";
import { useModel } from "@/ModelContext";

export default function DashboardPage() {
  const { user } = useUser();
  const { activeModel } = useModel();
  const navigate = useNavigate();

  // Dynamic user projects state stored in localStorage
  const [userProjects] = useState(() => {
    const saved = localStorage.getItem("hvrc_user_projects");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "default",
        name: "Default Workspace Project",
        slug: "default",
        updated: "Active Now",
        desc: "Full-Stack AI Operating System workspace with Monaco editor, live web sandbox, and Multi-Agent Swarm.",
        status: "Active"
      }
    ];
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in font-sans">
      
      {/* ══ HERO COMMAND CENTER BANNER ══ */}
      <div className="relative rounded-3xl p-8 border border-stone-200/90 bg-gradient-to-r from-white via-stone-50/80 to-blue-50/40 shadow-sm overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#2F6BFF]/10 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F6BFF]/10 text-[#2F6BFF] text-xs font-bold">
            <Sparkle weight="fill" className="w-3.5 h-3.5" />
            <span>AI Operating System Command Center</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Welcome back, {user?.username || user?.name || "Developer"} 👋
          </h1>

          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Multi-Agent Swarm Orchestrator is active. Launch an integrated IDE workspace, converse in AI Chat, or configure capability models in the Model Hub.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto shrink-0">
          <button
            onClick={() => navigate("/project/default/workspace")}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-[#2F6BFF] text-white text-xs font-extrabold hover:bg-blue-700 shadow-lg shadow-[#2F6BFF]/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <CodeBlock className="w-4 h-4" />
            <span>Launch Code Workspace</span>
          </button>
          
          <button
            onClick={() => navigate("/projects")}
            className="px-4 py-3 rounded-2xl bg-white border border-stone-200 text-stone-800 text-xs font-bold hover:bg-stone-50 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FolderPlus className="w-4 h-4 text-[#2F6BFF]" />
            <span>+ New Project</span>
          </button>
        </div>
      </div>

      {/* ══ TELEMETRY METRIC PILLS ══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: "Active Model", val: activeModel?.name || "Llama 3.3 70B", sub: "Universal Gateway", icon: <Cpu className="w-4 h-4 text-[#2F6BFF]" /> },
          { label: "Swarm Workers", val: "6 Active Roles", sub: "Parallel Execution", icon: <UsersThree className="w-4 h-4 text-emerald-600" /> },
          { label: "Data Storage", val: "Google Drive / Local", sub: "Zero-Server Storage", icon: <HardDrive className="w-4 h-4 text-purple-600" /> },
          { label: "Security Mode", val: "Client-Side Encrypted", sub: "100% Zero-Server", icon: <ShieldCheck className="w-4 h-4 text-cyan-600" /> }
        ].map((stat, i) => (
          <div key={i} className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-stone-500 text-[11px] font-bold">
              <span>{stat.label}</span>
              {stat.icon}
            </div>
            <div className="font-display font-extrabold text-sm text-stone-900 truncate">{stat.val}</div>
            <div className="text-[10px] text-stone-400 font-medium">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* ══ QUICK ACTION LAUNCHER ══ */}
      <div className="space-y-3">
        <h2 className="font-display font-extrabold text-sm uppercase tracking-wider text-stone-400">
          Instant Launchers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/project/default/workspace"
            className="p-5 bg-white rounded-3xl border border-stone-200/90 hover:border-[#2F6BFF] shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2F6BFF] flex items-center justify-center font-bold shadow-inner">
                <CodeBlock className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#2F6BFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-stone-900">Code Workspace &amp; IDE</div>
              <div className="text-xs text-stone-500 mt-0.5">Monaco editor, sandbox preview &amp; AI swarm</div>
            </div>
          </Link>

          <Link
            to="/project/default/chat"
            className="p-5 bg-white rounded-3xl border border-stone-200/90 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-inner">
                <ChatCircleText className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-stone-900">AI Chat &amp; Brainstorm</div>
              <div className="text-xs text-stone-500 mt-0.5">Deep reasoning, artifacts &amp; streaming</div>
            </div>
          </Link>

          <Link
            to="/models"
            className="p-5 bg-white rounded-3xl border border-stone-200/90 hover:border-purple-500 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-inner">
                <Cpu className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-purple-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-stone-900">Model Hub (460+ Models)</div>
              <div className="text-xs text-stone-500 mt-0.5">NVIDIA NIM, Groq, OpenRouter &amp; Roles</div>
            </div>
          </Link>

          <Link
            to="/knowledge"
            className="p-5 bg-white rounded-3xl border border-stone-200/90 hover:border-amber-500 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-inner">
                <UploadSimple className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-stone-900">Knowledge Base &amp; RAG</div>
              <div className="text-xs text-stone-500 mt-0.5">Upload specs, documentation &amp; URLs</div>
            </div>
          </Link>
        </div>
      </div>

      {/* ══ ACTIVE PROJECTS SECTION ══ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-extrabold text-lg text-stone-900">Workspace Projects</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
              {userProjects.length}
            </span>
          </div>

          <Link to="/projects" className="text-xs font-bold text-[#2F6BFF] hover:underline flex items-center gap-1">
            <span>Manage All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {userProjects.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-stone-200/90 text-center space-y-3 shadow-2xs">
            <FolderOpen className="w-10 h-10 text-stone-300 mx-auto" />
            <div className="text-xs font-bold text-stone-700">No active projects found.</div>
            <button
              onClick={() => navigate("/projects")}
              className="px-4 py-2 bg-[#2F6BFF] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer shadow-sm"
            >
              + Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:border-[#2F6BFF] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {proj.status || "Active"}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">{proj.updated}</span>
                  </div>
                  <h3 className="font-display font-extrabold text-base text-stone-900">{proj.name}</h3>
                  <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">{proj.desc}</p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-stone-100">
                  <button
                    onClick={() => navigate(`/project/${proj.slug || proj.id}/workspace`)}
                    className="flex-1 py-2 bg-[#2F6BFF] hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl text-center shadow-xs transition-all cursor-pointer"
                  >
                    Open IDE Workspace
                  </button>
                  <button
                    onClick={() => navigate(`/project/${proj.slug || proj.id}/chat`)}
                    className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
