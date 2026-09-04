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
    <div className="flex-1 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        onOpenEvaluate={() => setIsEvaluateOpen(true)}
        onOpenSpecs={() => setIsSpecsOpen(true)}
        totalAgents={stats.totalAgents}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section & Real-Time Stats */}
        <HeroMetrics stats={stats} />

        {/* Discovery Crawler Control Bar */}
        <DiscoveryBar onRefresh={fetchAgents} />

        {/* Trust Leaderboard (Challenge Bonus Feature) */}
        <TrustLeaderboard
          agents={agents}
          onSelectAgent={agent => setSelectedAgent(agent)}
          isLoading={isLoading}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060913] py-8 text-xs text-slate-500 font-mono text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-slate-300 font-bold">TRUSTY.ai</span> — Independent Trust & Reputation Infrastructure for AI Agents
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSpecsOpen(true)}
              className="text-sky-400 hover:underline"
            >
              Specs & Documentation
            </button>
            <span>•</span>
            <span>Next.js App Router</span>
            <span>•</span>
            <span>Ready for Vercel</span>
          </div>
        </div>
      </footer>

      {/* Detail / Explainability Inspector Modal */}
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

      {/* Specs Viewer Modal */}
      <SpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />
    </div>
  );
}
