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
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "literature",
    name: "Literature Review",
    description: "Search and categorize papers",
    icon: BookOpen,
    status: "online",
    usage: 0,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "collaboration",
    name: "Collaboration Hub",
    description: "Real-time team collaboration",
    icon: Users,
    status: "online",
    usage: 0,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "data",
    name: "Data Extraction",
    description: "Extract and analyze data",
    icon: Database,
    status: "online",
    usage: 0,
    color: "from-orange-500 to-red-500"
  },
  {
    id: "proposal",
    name: "Proposal Generator",
    description: "Create research proposals",
    icon: Lightbulb,
    status: "online",
    usage: 0,
    color: "from-pink-500 to-rose-500"
  }
];

export default function OverviewPanel() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Welcome back</h1>
        <p className="text-white/60">Your AI research assistants are ready</p>
      </div>

      {/* Agent Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="glass hover-lift cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${agent.color}`}>
                  <agent.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    agent.status === 'online' ? 'status-online' : 'status-processing'
                  }`} />
                  <Badge variant="secondary" className="bg-white/10 text-white/70 border-white/20">
                    {agent.usage}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
              <p className="text-white/60 text-sm">{agent.description}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Total Operations</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-white">100%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Avg Response</p>
                <p className="text-2xl font-bold text-white">0.5s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-white/50">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 