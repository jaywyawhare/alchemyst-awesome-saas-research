"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { 
  Sparkles, 
  Command, 
  Settings, 
  Bell,
  Menu,
  Home,
  FileText,
  BookOpen,
  Users,
  Database,
  Lightbulb
} from "lucide-react";

interface HeaderProps {
  onCommandPalette: () => void;
  onTabChange?: (tab: string) => void;
  activeTab?: string;
}

const tabs = [
  { id: "overview", name: "Overview", icon: Home },
  { id: "citation", name: "Citations", icon: FileText },
  { id: "literature", name: "Literature", icon: BookOpen },
  { id: "collaboration", name: "Collaborate", icon: Users },
  { id: "data", name: "Data", icon: Database },
  { id: "proposal", name: "Proposals", icon: Lightbulb },
];

export default function Header({ onCommandPalette, onTabChange, activeTab = "overview" }: HeaderProps) {
  const [notifications, setNotifications] = useState(0);

  const handleNotifications = () => {
    console.log("Opening notifications panel");
    setNotifications(0);
  };

  const handleSettings = () => {
    console.log("Opening settings");
    if (onTabChange) {
      onTabChange("settings");
    }
  };

  const handleLogoClick = () => {
    console.log("Navigating to overview");
    if (onTabChange) {
      onTabChange("overview");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        {/* Logo */}
        <div className="flex items-center">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={handleLogoClick}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs - Centered */}
        <nav className="flex items-center mx-auto space-x-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              className={`h-8 px-3 text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
              onClick={() => onTabChange?.(tab.id)}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </Button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Mobile menu */}
          <Button
            variant="ghost"
            className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="relative h-9 w-9 p-0"
              onClick={handleNotifications}
            >
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
              )}
              <span className="sr-only">Notifications</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={onCommandPalette}
            >
              <Command className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={handleSettings}
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 