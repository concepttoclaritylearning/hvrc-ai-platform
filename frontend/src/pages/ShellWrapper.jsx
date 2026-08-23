import React from "react";
import { Outlet } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useProject } from "@/context/ProjectContext";

export default function ShellWrapper() {
  const { projects, activeProject, selectProject, createProject } = useProject();

  return (
    <AppLayout
      projects={projects}
      activeProject={activeProject}
      onSelectProject={(p) => selectProject(p.slug || p.id)}
    >
      <Outlet context={{ projects, activeProject, onCreateProject: createProject }} />
    </AppLayout>
  );
}
