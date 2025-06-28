"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  FileText, 
  Users, 
  Database, 
  Lightbulb,
  Home,
  History,
  Star,
  Plus,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const agents = [
  { id: "overview", name: "Overview", icon: Home, shortcut: "⌘1" },
  { id: "citation", name: "Citations", icon: FileText, shortcut: "⌘2" },
  { id: "literature", name: "Literature", icon: BookOpen, shortcut: "⌘3" },
  { id: "collaboration", name: "Collaborate", icon: Users, shortcut: "⌘4" },
  { id: "data", name: "Data", icon: Database, shortcut: "⌘5" },
  { id: "proposal", name: "Proposals", icon: Lightbulb, shortcut: "⌘6" },
];

const quickActions = [
  { name: "Recent", icon: History, count: 0 },
  { name: "Favorites", icon: Star, count: 0 },
  { name: "New Project", icon: Plus, count: null },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] glass border-r border-white/10 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {agents.map((agent) => (
            <Button
              key={agent.id}
              variant={activeTab === agent.id ? "default" : "ghost"}
              className={`w-full justify-start group transition-all duration-200 ${
                activeTab === agent.id 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30' 
                  : 'hover:bg-white/5'
              }`}
              onClick={() => onTabChange(agent.id)}
            >
              <agent.icon className={`h-4 w-4 mr-3 ${
                activeTab === agent.id ? 'text-purple-400' : 'text-white/70'
              }`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{agent.name}</span>
                  <span className="text-xs text-white/40 group-hover:text-white/60">
                    {agent.shortcut}
                  </span>
                </>
              )}
            </Button>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-white/10">
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.name}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5"
              >
                <action.icon className="h-4 w-4 mr-3" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm">{action.name}</span>
                    {action.count !== null && action.count > 0 && (
                      <Badge variant="secondary" className="bg-white/10 text-white/60 border-white/20">
                        {action.count}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-white/70 hover:text-white hover:bg-white/5"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            }`} />
            {!isCollapsed && <span className="ml-2 text-sm">Collapse</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
} 