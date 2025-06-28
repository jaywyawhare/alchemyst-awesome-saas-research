"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Brain, 
  Command, 
  Settings, 
  Bell,
  Search,
  Zap
} from "lucide-react";

interface HeaderProps {
  onCommandPalette: () => void;
}

export default function Header({ onCommandPalette }: HeaderProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    // Simulate connection status
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover-lift">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Research Suite</h1>
              <p className="text-xs text-white/60">AI Research Assistant</p>
            </div>
          </div>

          {/* Center - Status & Search */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isOnline ? 'status-online' : 'status-error'
              }`} />
              <span className="text-xs text-white/70">
                {isOnline ? 'Connected' : 'Offline'}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => {/* Search functionality */}}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              <Brain className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 relative"
              onClick={() => {/* Notifications */}}
            >
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={onCommandPalette}
            >
              <Command className="h-4 w-4" />
              <span className="ml-2 text-xs opacity-60">⌘K</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 