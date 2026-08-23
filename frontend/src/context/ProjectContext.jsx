import React, { createContext, useContext, useState, useEffect } from "react";

export const ProjectContext = createContext(null);

const DEFAULT_STARTER_PROJECTS = [
  {
    id: "default",
    name: "Default React Workspace",
    slug: "default",
    updated: "Active Now",
    desc: "Interactive React IDE sandbox with live web compiler and Multi-Agent Swarms.",
    status: "Active",
    template: "react"
  }
];

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("hvrc_user_projects");
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to parse projects:", e);
      }
    }
    return DEFAULT_STARTER_PROJECTS;
  });

  const [activeProjectSlug, setActiveProjectSlug] = useState(() => {
    return localStorage.getItem("hvrc_active_project_slug") || "default";
  });

  useEffect(() => {
    localStorage.setItem("hvrc_user_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("hvrc_active_project_slug", activeProjectSlug);
  }, [activeProjectSlug]);

  const activeProject =
    projects.find((p) => p.slug === activeProjectSlug || p.id === activeProjectSlug) ||
    projects[0] ||
    null;

  const createProject = ({ name, desc, template = "blank" }) => {
    const cleanName = (name || "").trim();
    if (!cleanName) return null;

    const slug = cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newProject = {
      id: `proj-${Date.now()}`,
      name: cleanName,
      slug: slug || `project-${Date.now()}`,
      updated: "Just now",
      desc:
        (desc || "").trim() ||
        (template === "blank"
          ? "Clean blank workspace created from scratch."
          : "Interactive full-stack React workspace."),
      status: "Active",
      template: template || "blank"
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    setActiveProjectSlug(newProject.slug);
    return newProject;
  };

  const deleteProject = (projectId) => {
    const target = projects.find((p) => p.id === projectId || p.slug === projectId);
    const updated = projects.filter((p) => p.id !== projectId && p.slug !== projectId);
    setProjects(updated);

    // Clean up project-specific files from storage
    if (target?.slug) {
      localStorage.removeItem(`hvrc_files_${target.slug}`);
    }

    if (activeProjectSlug === projectId || (target && activeProjectSlug === target.slug)) {
      setActiveProjectSlug(updated[0]?.slug || "");
    }
  };

  const selectProject = (slugOrId) => {
    setActiveProjectSlug(slugOrId);
  };

  const resetToDefaults = () => {
    setProjects(DEFAULT_STARTER_PROJECTS);
    setActiveProjectSlug("default");
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        activeProjectSlug,
        createProject,
        deleteProject,
        selectProject,
        resetToDefaults
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
