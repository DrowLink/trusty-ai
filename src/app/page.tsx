'use client';

import React, { useState, useEffect } from 'react';
import { AgentWithScore, DiscoveryStats } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { HeroMetrics } from '@/components/HeroMetrics';
import { DiscoveryBar } from '@/components/DiscoveryBar';
import { TrustLeaderboard } from '@/components/TrustLeaderboard';
import { AgentDetailModal } from '@/components/AgentDetailModal';
import { EvaluateModal } from '@/components/EvaluateModal';
import { SpecsModal } from '@/components/SpecsModal';
import { Github, ExternalLink } from 'lucide-react';

export default function HomePage() {
  const [agents, setAgents] = useState<AgentWithScore[]>([]);
  const [stats, setStats] = useState<DiscoveryStats>({
    totalAgents: 0,
    avgTrustScore: 0,
    lowRiskCount: 0,
    mediumRiskCount: 0,
    highRiskCount: 0,
    criticalRiskCount: 0,
    ecosystemCounts: {
      github: 0,
      mcp_registry: 0,
      agent_marketplace: 0,
      manual_scan: 0,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<AgentWithScore | null>(null);
  const [isEvaluateOpen, setIsEvaluateOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/agents');
      const data = await res.json();
      if (data.success) {
        setAgents(data.agents);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load agents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleEvaluationComplete = (newAgent: AgentWithScore) => {
    setAgents(prev => [newAgent, ...prev.filter(a => a.id !== newAgent.id)]);
    setSelectedAgent(newAgent);
    fetchAgents();
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Navigation */}
      <Navbar
        onOpenEvaluate={() => setIsEvaluateOpen(true)}
        onOpenSpecs={() => setIsSpecsOpen(true)}
        totalAgents={stats.totalAgents}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Mission & Real-Time Stats */}
        <HeroMetrics stats={stats} />

        {/* Discovery Crawler Control */}
        <DiscoveryBar onRefresh={fetchAgents} />

        {/* Trust Leaderboard */}
        <TrustLeaderboard
          agents={agents}
          onSelectAgent={agent => setSelectedAgent(agent)}
          isLoading={isLoading}
        />
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-white/[0.08] bg-[#07080c] py-6 text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-zinc-300 font-bold">TRUSTY.ai</span>
            <span>—</span>
            <span>Independent Agent Trust Layer</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a
              href="https://trusty-jfagbrh7p-drowlinks-projects.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition flex items-center space-x-1"
            >
              <span>Vercel Live App</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://github.com/DrowLink/trusty-ai"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-zinc-200 transition flex items-center space-x-1"
            >
              <Github className="w-3 h-3" />
              <span>DrowLink/trusty-ai</span>
            </a>
            <span>•</span>
            <button
              onClick={() => setIsSpecsOpen(true)}
              className="text-zinc-400 hover:text-zinc-200 transition"
            >
              Specifications (.md)
            </button>
          </div>
        </div>
      </footer>

      {/* Detail / Explainability Inspector */}
      <AgentDetailModal
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />

      {/* Dynamic Agent Evaluator Drawer */}
      <EvaluateModal
        isOpen={isEvaluateOpen}
        onClose={() => setIsEvaluateOpen(false)}
        onEvaluationComplete={handleEvaluationComplete}
      />

      {/* Specs Viewer */}
      <SpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />
    </div>
  );
}
