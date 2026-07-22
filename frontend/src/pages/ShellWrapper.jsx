import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

export default function ShellWrapper() {
  const [projects, setProjects] = useState([
    { id: "default", name: "HVRC Web App SaaS Platform", slug: "default", desc: "Browser-first AI OS combining chat, IDE, and vector search.", status: "Active" },
    { id: "proj-2", name: "AI Agent Automation Suite", slug: "agent-suite", desc: "Multi-step AI workflow routines and integrations.", status: "Active" },
    { id: "proj-3", name: "RAG Document Knowledge Base", slug: "rag-kb", desc: "Vector DB embedding pipeline for PDFs and web URLs.", status: "Active" },
  ]);

  const [activeProject, setActiveProject] = useState(projects[0]);

  const handleCreateProject = (newProj) => {
    const created = { id: Date.now().toString(), ...newProj, status: "Active" };
    setProjects([created, ...projects]);
    setActiveProject(created);
  };

  return (
    <AppLayout
      projects={projects}
      activeProject={activeProject}
      onSelectProject={(p) => setActiveProject(p)}
    >
      <Outlet context={{ projects, activeProject, onCreateProject: handleCreateProject }} />
    </AppLayout>
  );
}
