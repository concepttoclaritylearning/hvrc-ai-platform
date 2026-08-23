import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Layout,
  FolderOpen,
  CodeBlock,
  ChatCircleText,
  Cpu,
  ClockCounterClockwise,
  Gear,
  CaretLeft,
  CaretRight
} from "@phosphor-icons/react";

export function SidebarMobileHeader() {
  return null;
}

export default function Sidebar({ isCollapsed, onToggleCollapse, activeProject }) {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/", icon: Layout },
    { label: "Projects", path: "/projects", icon: FolderOpen },
    {
      label: "Workspace IDE",
      path: activeProject ? `/project/${activeProject.slug || activeProject.id}/workspace` : "/project/default/workspace",
      icon: CodeBlock,
      badge: "Live Sandbox"
    },
    {
      label: "AI Chat",
      path: activeProject ? `/project/${activeProject.slug || activeProject.id}/chat` : "/project/default/chat",
      icon: ChatCircleText
    },
    { label: "Model Hub", path: "/models", icon: Cpu, badge: "460+ BYOK" },
    { label: "History", path: "/history", icon: ClockCounterClockwise },
  ];

  const bottomItems = [
    { label: "Settings", path: "/settings", icon: Gear },
  ];

  return (
    <aside
      className={`h-[calc(100vh-3.5rem)] bg-white border-r border-stone-200/80 flex flex-col justify-between transition-all duration-200 z-20 shrink-0 font-sans ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Navigation Items */}
      <div className="p-3 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Navigation
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#2F6BFF]/10 text-[#2F6BFF] shadow-2xs"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#2F6BFF]" : "text-stone-400"}`} />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold tracking-tight bg-blue-50 text-[#2F6BFF] border border-blue-200/60 px-1.5 py-0.2 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-stone-100 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#2F6BFF]/10 text-[#2F6BFF] shadow-2xs"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#2F6BFF]" : "text-stone-400"}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}

        {/* Collapse Sidebar Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer text-xs font-bold"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <CaretRight className="w-4 h-4" /> : <CaretLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
