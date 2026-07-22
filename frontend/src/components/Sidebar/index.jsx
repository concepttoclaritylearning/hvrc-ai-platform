import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Layout,
  FolderOpen,
  CodeBlock,
  ChatCircleText,
  Cpu,
  Database,
  Lightning,
  Robot,
  Storefront,
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
      label: "Workspace",
      path: activeProject ? `/project/${activeProject.slug || activeProject.id}/workspace` : "/project/default/workspace",
      icon: CodeBlock,
      badge: "Cursor/Bolt"
    },
    {
      label: "AI Chat",
      path: activeProject ? `/project/${activeProject.slug || activeProject.id}/chat` : "/project/default/chat",
      icon: ChatCircleText
    },
    { label: "Model Hub", path: "/models", icon: Cpu },
    { label: "Knowledge", path: "/knowledge", icon: Database },
    { label: "Prompts", path: "/prompts", icon: Lightning },
    { label: "Agents", path: "/settings/agents", icon: Robot },
    { label: "Marketplace", path: "/settings/community-hub/trending", icon: Storefront },
    { label: "History", path: "/history", icon: ClockCounterClockwise },
  ];

  const bottomItems = [
    { label: "Settings", path: "/settings", icon: Gear },
  ];

  return (
    <aside
      className={`h-[calc(100vh-3.5rem)] bg-white border-r border-stone-200/80 flex flex-col justify-between transition-all duration-200 z-20 ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Navigation Items */}
      <div className="p-3 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 py-1.5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
            Navigation
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#2F6BFF]/10 text-[#2F6BFF] font-semibold shadow-2xs"
                  : "text-stone-600 hover:bg-stone-100/80 hover:text-stone-900"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#2F6BFF]" : "text-stone-400"}`} />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold tracking-tight bg-blue-100 text-[#2F6BFF] px-1.5 py-0.2 rounded-md">
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
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#2F6BFF]/10 text-[#2F6BFF] font-semibold shadow-2xs"
                  : "text-stone-600 hover:bg-stone-100/80 hover:text-stone-900"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#2F6BFF]" : "text-stone-400"}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}

        {/* Collapse Sidebar Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-all ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
        >
          {isCollapsed ? <CaretRight className="w-4 h-4" /> : <CaretLeft className="w-4 h-4" />}
          {!isCollapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
