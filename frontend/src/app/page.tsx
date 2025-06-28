"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import CommandPalette from "@/components/ui/CommandPalette";
import OverviewPanel from "@/components/agents/OverviewPanel";
import CitationPanel from "@/components/agents/CitationPanel";

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
      case "literature":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold gradient-text mb-4">Literature Review</h2>
            <p className="text-white/60">Coming soon...</p>
          </div>
        );
      case "collaboration":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold gradient-text mb-4">Collaboration Hub</h2>
            <p className="text-white/60">Coming soon...</p>
          </div>
        );
      case "data":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold gradient-text mb-4">Data Extraction</h2>
            <p className="text-white/60">Coming soon...</p>
          </div>
        );
      case "proposal":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold gradient-text mb-4">Research Proposals</h2>
            <p className="text-white/60">Coming soon...</p>
          </div>
        );
      default:
        return <OverviewPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Header onCommandPalette={handleCommandPalette} />
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {renderActivePanel()}
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

