"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  FileText, 
  Users, 
  Database, 
  Lightbulb,
  Zap,
  Activity,
  TrendingUp,
  Clock,
  Star
} from "lucide-react";

const agents = [
  {
    id: "citation",
    name: "Citation Agent",
    description: "Generate citations in various formats",
    icon: FileText,
    status: "online",
    usage: 0,
    color: "bg-blue-500"
  },
  {
    id: "literature",
    name: "Literature Review",
    description: "Search and categorize papers",
    icon: BookOpen,
    status: "online",
    usage: 0,
    color: "bg-emerald-500"
  },
  {
    id: "collaboration",
    name: "Collaboration Hub",
    description: "Real-time team collaboration",
    icon: Users,
    status: "online",
    usage: 0,
    color: "bg-purple-500"
  },
  {
    id: "data",
    name: "Data Extraction",
    description: "Extract and analyze data",
    icon: Database,
    status: "online",
    usage: 0,
    color: "bg-orange-500"
  },
  {
    id: "proposal",
    name: "Proposal Generator",
    description: "Create research proposals",
    icon: Lightbulb,
    status: "online",
    usage: 0,
    color: "bg-pink-500"
  }
];

export default function OverviewPanel() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Welcome back</h1>
        <p className="text-muted-foreground">Your AI research assistants are ready</p>
      </div>

      {/* Agent Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="card-modern hover-lift cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${agent.color}`}>
                  <agent.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    agent.status === 'online' ? 'status-online' : 'status-processing'
                  }`} />
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    {agent.usage}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-foreground text-lg">{agent.name}</CardTitle>
              <p className="text-muted-foreground text-sm">{agent.description}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      {/* Removed stats cards */}

      {/* Recent Activity */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 