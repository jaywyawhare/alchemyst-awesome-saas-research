"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  Users, 
  Database, 
  Lightbulb,
  Zap,
  ArrowRight,
  Play,
  Star,
  Globe,
  Shield,
  Cpu
} from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AuthPage from "./auth/page";

const features = [
  {
    icon: BookOpen,
    title: "Literature Review",
    description: "AI-powered research paper analysis and categorization",
    color: "from-violet-500 to-purple-500"
  },
  {
    icon: FileText,
    title: "Citation Management",
    description: "Generate and format citations in multiple styles",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Collaboration Hub",
    description: "Real-time team collaboration and knowledge sharing",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: Database,
    title: "Data Extraction",
    description: "Extract and analyze data from research papers",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Lightbulb,
    title: "Proposal Generator",
    description: "Create compelling research proposals with AI",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Cpu,
    title: "Smart Analysis",
    description: "Advanced AI analysis and insights generation",
    color: "from-indigo-500 to-purple-500"
  }
];

const stats = [
  { value: "10K+", label: "Papers Analyzed" },
  { value: "500+", label: "Research Teams" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "AI Support" }
];

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Aceternity UI Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black" />
      
      {/* Floating Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10">
        {/* Hero Section - Aceternity Style */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              {/* Aceternity-style Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 mb-8">
                <Sparkles className="h-5 w-5 text-violet-400" />
                <span className="text-white/90 font-medium">AI-Powered Research Assistant</span>
              </div>
              
              {/* Aceternity-style Typography */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[0.9] tracking-tight">
                Research Made
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Effortless
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform your research workflow with intelligent AI agents that analyze papers, 
                generate citations, and collaborate seamlessly with your team.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {/* Auth Modal Trigger */}
              <Dialog open={authOpen} onOpenChange={setAuthOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 group"
                  >
                    <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Get Started
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md p-0 bg-transparent border-none shadow-none" showCloseButton>
                  <AuthPage />
                </DialogContent>
              </Dialog>
              {/* Aceternity-style Secondary Button */}
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm"
              >
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Stats Section - Aceternity Style */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/60 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
        </div>
        </section>

        {/* Features Section - Aceternity Style */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Powerful AI Agents
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Our intelligent agents work together to streamline every aspect of your research process.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                  className="group"
                >
                  {/* Aceternity-style Card */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 h-full rounded-2xl p-8 hover:border-white/20">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Aceternity Style */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Research?
              </h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Join thousands of researchers who are already using AI to accelerate their discoveries.
              </p>
              <Dialog open={authOpen} onOpenChange={setAuthOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-violet-500/25 transition-all duration-300"
                  >
                    Start Your Free Trial
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md p-0 bg-transparent border-none shadow-none" showCloseButton>
                  <AuthPage />
                </DialogContent>
              </Dialog>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}

