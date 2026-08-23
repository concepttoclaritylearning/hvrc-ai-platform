import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Code,
  ChatCircleText,
  Cpu,
  ShieldCheck,
  Lightning,
  UsersThree,
  ArrowUpRight,
  FolderOpen,
  Plus,
  Play,
  ArrowRight,
  CheckCircle,
  HardDrive,
  Trash
} from "@phosphor-icons/react";
import { useModel } from "@/ModelContext";

export default function DashboardPage() {
  const { activeModel } = useModel();
  const navigate = useNavigate();

  const [userProjects, setUserProjects] = useState(() => {
    const saved = localStorage.getItem("hvrc_user_projects");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: "default",
        name: "Default React Workspace",
        slug: "default",
        updated: "Active Now",
        desc: "Interactive React IDE sandbox with live web compiler and Multi-Agent Swarms.",
        status: "Active"
      }
    ];
  });

  const handleDeleteProject = (projectId, projectName, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const remaining = userProjects.filter((p) => p.id !== projectId);
    setUserProjects(remaining);
    localStorage.setItem("hvrc_user_projects", JSON.stringify(remaining));
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in font-sans text-[#1C1917]">
      
      {/* ══ HERO BANNER: TELEMETRY & COMMAND CENTER ══ */}
      <div className="relative rounded-3xl p-8 sm:p-10 border border-stone-200/90 bg-white shadow-2xs overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2F6BFF] text-xs font-extrabold border border-blue-200">
              <Lightning weight="fill" className="w-3.5 h-3.5" />
              <span>AI Operating System v3.0</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
              Command Center
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed">
              Orchestrate multi-agent swarms, run live web code in your in-browser IDE, and route completions across 460+ BYOK models.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/project/default/workspace")}
              className="px-6 py-3 bg-[#2F6BFF] hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-md shadow-[#2F6BFF]/25 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Code className="w-4 h-4" />
              <span>Launch IDE Workspace</span>
            </button>
            <button
              onClick={() => navigate("/projects")}
              className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              Manage Projects
            </button>
          </div>
        </div>

        {/* Real-time Status Pills */}
        <div className="mt-8 pt-6 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="text-[11px] font-bold text-stone-500">Active AI Model</div>
            <div className="text-xs font-extrabold text-[#2F6BFF] truncate mt-0.5">
              {activeModel?.name || "Meta Llama 3.3 70B"}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="text-[11px] font-bold text-stone-500">Swarm Workers</div>
            <div className="text-xs font-extrabold text-emerald-700 mt-0.5">
              6 Parallel Runtimes
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="text-[11px] font-bold text-stone-500">Storage Engine</div>
            <div className="text-xs font-extrabold text-stone-900 mt-0.5">
              Google Drive / Local
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="text-[11px] font-bold text-stone-500">Security Architecture</div>
            <div className="text-xs font-extrabold text-emerald-700 mt-0.5 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Server Privacy</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ QUICK LAUNCHER TILES (4 CLEAN TILES) ══ */}
      <div className="space-y-4">
        <h2 className="font-display font-extrabold text-lg text-stone-900">Platform Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <Link
            to="/project/default/workspace"
            className="p-5 bg-white rounded-3xl border border-stone-200/90 hover:border-[#2F6BFF] shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2F6BFF] flex items-center justify-center font-bold shadow-inner">
                <Code className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#2F6BFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-stone-900">Live Code IDE &amp; Sandbox</div>
              <div className="text-xs text-stone-500 mt-0.5">In-browser React Babel hot-reloading</div>
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
              <div className="font-extrabold text-sm text-stone-900">AI Chat &amp; Reasoning</div>
              <div className="text-xs text-stone-500 mt-0.5">Multi-threaded conversations &amp; reasoning</div>
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
              <div className="text-xs text-stone-500 mt-0.5">NVIDIA NIM, Groq, OpenRouter &amp; BYOK</div>
            </div>
          </Link>

          <Link
            to="/projects"
            className="p-5 bg-white rounded-3xl border border-stone-200/90 hover:border-amber-500 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-inner">
                <FolderOpen className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-stone-900">Projects Manager</div>
              <div className="text-xs text-stone-500 mt-0.5">Manage workspaces, files &amp; starters</div>
            </div>
          </Link>

        </div>
      </div>

      {/* ══ ACTIVE PROJECTS SECTION ══ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-extrabold text-lg text-stone-900">Active Workspaces</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
              {userProjects.length}
            </span>
          </div>

          <Link to="/projects" className="text-xs font-bold text-[#2F6BFF] hover:underline flex items-center gap-1">
            <span>+ Create / Manage All Projects</span>
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
                className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:border-[#2F6BFF] hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {proj.status || "Active"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-400 font-mono">{proj.updated}</span>
                      <button
                        onClick={(e) => handleDeleteProject(proj.id, proj.name, e)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title={`Delete "${proj.name}"`}
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
