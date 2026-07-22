import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lightning,
  FolderPlus,
  ChatCircleText,
  CodeBlock,
  UploadSimple,
  Sparkle,
  ArrowRight,
  Clock,
  PushPin,
  FileCode,
  CheckCircle,
  FolderOpen
} from "@phosphor-icons/react";
import useUser from "@/hooks/useUser";
import { useModel } from "@/ModelContext";

export default function DashboardPage() {
  const { user } = useUser();
  const { activeModel } = useModel();
  const navigate = useNavigate();

  // Dynamic user projects state stored in localStorage
  const [userProjects, setUserProjects] = useState(() => {
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
        desc: "Interactive React workspace powered by HVRC.AI zero-server engine.",
        status: "Active"
      }
    ];
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in font-sans">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2F6BFF] text-xs font-semibold">
            <Sparkle weight="fill" className="w-3.5 h-3.5" />
            <span>HVRC.AI Command Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            Welcome back, {user?.username || user?.name || "Developer"} 👋
          </h1>
          <p className="text-stone-600 text-xs max-w-xl">
            Select a project to continue coding, ask questions in AI chat, or launch a live web sandbox.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
          <button
            onClick={() => navigate("/projects")}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-[#2F6BFF] text-white text-xs font-semibold hover:bg-blue-700 shadow-md shadow-[#2F6BFF]/20 flex items-center justify-center gap-2 transition-all"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Create Project</span>
          </button>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/project/default/workspace"
          className="p-5 bg-white rounded-3xl border border-stone-200/80 hover:border-[#2F6BFF] shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2F6BFF] flex items-center justify-center font-bold">
              <CodeBlock className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#2F6BFF] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="text-sm font-bold text-stone-900">Code Workspace</div>
            <div className="text-xs text-stone-500 mt-0.5">Bolt/Cursor style IDE &amp; Live Preview</div>
          </div>
        </Link>

        <Link
          to="/project/default/chat"
          className="p-5 bg-white rounded-3xl border border-stone-200/80 hover:border-[#2F6BFF] shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ChatCircleText className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="text-sm font-bold text-stone-900">New AI Chat</div>
            <div className="text-xs text-stone-500 mt-0.5">Ask questions &amp; generate artifacts</div>
          </div>
        </Link>

        <Link
          to="/models"
          className="p-5 bg-white rounded-3xl border border-stone-200/80 hover:border-[#2F6BFF] shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Sparkle className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="text-sm font-bold text-stone-900">Model Hub (BYOK)</div>
            <div className="text-xs text-stone-500 mt-0.5">Connect NVIDIA NIM, OpenRouter &amp; Groq</div>
          </div>
        </Link>

        <Link
          to="/knowledge"
          className="p-5 bg-white rounded-3xl border border-stone-200/80 hover:border-[#2F6BFF] shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <UploadSimple className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="text-sm font-bold text-stone-900">Knowledge Base</div>
            <div className="text-xs text-stone-500 mt-0.5">Upload local files &amp; web URLs</div>
          </div>
        </Link>
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-stone-900">Active Workspace Projects ({userProjects.length})</h2>
          <Link to="/projects" className="text-xs font-bold text-[#2F6BFF] hover:underline">
            View All Projects →
          </Link>
        </div>

        {userProjects.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-stone-200/80 text-center space-y-3">
            <FolderOpen className="w-8 h-8 text-stone-300 mx-auto" />
            <div className="text-xs font-bold text-stone-700">No active projects found.</div>
            <button
              onClick={() => navigate("/projects")}
              className="px-4 py-2 bg-[#2F6BFF] text-white text-xs font-bold rounded-xl hover:bg-blue-700"
            >
              + Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2F6BFF]">
                      {proj.status || "Active"}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">{proj.updated}</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900">{proj.name}</h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{proj.desc}</p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => navigate(`/project/${proj.slug || proj.id}/workspace`)}
                    className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl text-center"
                  >
                    Open Workspace
                  </button>
                  <button
                    onClick={() => navigate(`/project/${proj.slug || proj.id}/chat`)}
                    className="px-3 py-2 bg-[#2F6BFF] text-white text-xs font-bold rounded-xl hover:bg-blue-700"
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
