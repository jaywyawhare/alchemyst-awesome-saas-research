"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import CommandPalette from "@/components/ui/CommandPalette";
import OverviewPanel from "@/components/agents/OverviewPanel";
import CitationPanel from "@/components/agents/CitationPanel";
import SettingsPanel from "@/components/agents/SettingsPanel";

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }

      // Tab navigation
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            setActiveTab("overview");
            break;
          case "2":
            e.preventDefault();
            setActiveTab("citation");
            break;
          case "3":
            e.preventDefault();
            setActiveTab("literature");
            break;
          case "4":
            e.preventDefault();
            setActiveTab("collaboration");
            break;
          case "5":
            e.preventDefault();
            setActiveTab("data");
            break;
          case "6":
            e.preventDefault();
            setActiveTab("proposal");
            break;
          case "7":
            e.preventDefault();
            setActiveTab("settings");
            break;
        }
      }

      // Escape to close command palette
      if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCommandPalette = () => {
    setIsCommandPaletteOpen(true);
  };

  const handleCommandPaletteClose = () => {
    setIsCommandPaletteOpen(false);
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const renderActivePanel = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewPanel />;
      case "citation":
        return <CitationPanel />;
      case "settings":
        return <SettingsPanel />;
      case "literature":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Literature Review</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case "collaboration":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Collaboration Hub</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case "data":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Extraction</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case "proposal":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Research Proposals</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      default:
        return <OverviewPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header 
        onCommandPalette={handleCommandPalette} 
        onTabChange={handleTabChange}
        activeTab={activeTab}
      />
      
      <main className="flex-1">
        <div className="container max-w-screen-2xl mx-auto px-4 py-6">
          <div className="animate-fade-in">
            {renderActivePanel()}
          </div>
        </div>
      </main>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={handleCommandPaletteClose}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

