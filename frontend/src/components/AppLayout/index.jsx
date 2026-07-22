import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import GlobalSearchModal from "@/components/GlobalSearchModal";

export default function AppLayout({ children, activeProject, onSelectProject, projects = [] }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#FAF8F4] overflow-hidden select-none font-sans text-stone-800">
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={onSelectProject}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeProject={activeProject}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#FAF8F4] relative flex flex-col">
          {children}
        </main>
      </div>

      {/* Global Search Command Palette */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
