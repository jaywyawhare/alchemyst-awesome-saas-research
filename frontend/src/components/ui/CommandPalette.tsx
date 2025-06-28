"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Command, 
  Search, 
  FileText, 
  BookOpen, 
  Users, 
  Database, 
  Lightbulb,
  Settings,
  HelpCircle,
  ArrowUp,
  X
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

const commands = [
  { id: "overview", name: "Go to Overview", icon: Search, shortcut: "⌘1", category: "Navigation" },
  { id: "citation", name: "Citation Generator", icon: FileText, shortcut: "⌘2", category: "Agents" },
  { id: "literature", name: "Literature Review", icon: BookOpen, shortcut: "⌘3", category: "Agents" },
  { id: "collaboration", name: "Collaboration Hub", icon: Users, shortcut: "⌘4", category: "Agents" },
  { id: "data", name: "Data Extraction", icon: Database, shortcut: "⌘5", category: "Agents" },
  { id: "proposal", name: "Research Proposals", icon: Lightbulb, shortcut: "⌘6", category: "Agents" },
  { id: "settings", name: "Settings", icon: Settings, shortcut: "⌘,", category: "System" },
  { id: "help", name: "Help & Documentation", icon: HelpCircle, shortcut: "⌘?", category: "System" },
];

export default function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = commands.filter(command =>
    command.name.toLowerCase().includes(query.toLowerCase()) ||
    command.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            handleCommandSelect(filteredCommands[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  const handleCommandSelect = (command: typeof commands[0]) => {
    if (command.id === "settings" || command.id === "help") {
      // Handle system commands
      console.log(`Opening ${command.name}`);
    } else {
      onNavigate(command.id);
    }
    onClose();
    setQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="command-palette max-w-2xl p-0 border-0">
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Command className="h-5 w-5 text-white/70" />
            <Input
              placeholder="Search commands, agents, or actions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 glass focus-ring"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-white/50">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No commands found</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredCommands.map((command, index) => (
                <Button
                  key={command.id}
                  variant="ghost"
                  className={`w-full justify-start p-3 h-auto ${
                    index === selectedIndex 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => handleCommandSelect(command)}
                >
                  <command.icon className="h-4 w-4 mr-3" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{command.name}</div>
                    <div className="text-xs text-white/50">{command.category}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="shortcut-key">
                      {command.shortcut}
                    </span>
                    {index === selectedIndex && (
                      <ArrowUp className="h-3 w-3 text-white/50" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 text-xs text-white/40">
          <div className="flex items-center justify-between">
            <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
            <span>{filteredCommands.length} commands</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 