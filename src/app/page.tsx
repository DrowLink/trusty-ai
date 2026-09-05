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
import { AuthModal } from '@/components/AuthModal';
import { getUserSession, decrementQueryQuota, authenticateWithEmail, UserSession } from '@/lib/quota';
import { 
  getLocalCustomAgents, 
  saveLocalCustomAgent, 
  mergeAgentsWithLocal, 
  computeDiscoveryStats, 
  saveMultipleLocalCustomAgents 
} from '@/lib/storage/clientStorage';
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
  const [isAuditingLive, setIsAuditingLive] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentWithScore | null>(null);
  const [isEvaluateOpen, setIsEvaluateOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [session, setSession] = useState<UserSession>({
    email: null,
    isAuthenticated: false,
    queriesRemaining: 10,
    maxQueries: 10,
    tier: 'anonymous',
  });

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/agents');
      const data = await res.json();
      if (data.success && Array.isArray(data.agents)) {
        // Dual-Layer Resilience: Merge with locally stored custom audits so user never loses their 11+ agents
        const { merged, newToSync } = mergeAgentsWithLocal(data.agents);
        setAgents(merged);
        setStats(computeDiscoveryStats(merged));

        // Save server agents into local storage cache
        saveMultipleLocalCustomAgents(merged);

        // If client had audited agents that the server lost (e.g. serverless cold restart),
        // sync them back to backend & Firestore in background
        if (newToSync.length > 0) {
          fetch('/api/agents/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agents: newToSync }),
          }).catch(e => console.warn('Background sync failed:', e));
        }
      }
    } catch (err) {
      console.error('Failed to load agents:', err);
      // Fallback directly to local storage
      const local = getLocalCustomAgents();
      if (local.length > 0) {
        setAgents(local);
        setStats(computeDiscoveryStats(local));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSession(getUserSession());
    fetchAgents();
  }, []);

  const checkAndConsumeQuota = (): boolean => {
    const currentSession = getUserSession();
    if (currentSession.isAuthenticated) {
      return true;
    }
    if (currentSession.queriesRemaining <= 0) {
      setIsAuthOpen(true);
      return false;
    }
    const { allowed } = decrementQueryQuota();
    const updated = getUserSession();
    setSession(updated);
    if (!allowed) {
      setIsAuthOpen(true);
      return false;
    }
    return true;
  };

  const handleEvaluationComplete = (newAgent: AgentWithScore) => {
    // 1. Immediately persist to browser storage
    saveLocalCustomAgent(newAgent);

    // 2. Update local state
    setAgents(prev => {
      const updated = [newAgent, ...prev.filter(a => a.id !== newAgent.id)];
      setStats(computeDiscoveryStats(updated));
      return updated;
    });

    // 3. Open explainability drawer
    setSelectedAgent(newAgent);

    // 4. Sync to server & Firestore
    const { evaluation, ...agentRecord } = newAgent;
    fetch('/api/agents/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent: agentRecord }),
    }).catch(e => console.warn('Background sync error:', e));
  };

  // Instant Hero URL Audit Handler
  const handleHeroAudit = async (urlOrName: string) => {
    if (!checkAndConsumeQuota()) {
      return;
    }

    setIsAuditingLive(true);
    try {
      const isGithub = urlOrName.includes('github.com');
      const payload = isGithub
        ? { repositoryUrl: urlOrName.startsWith('http') ? urlOrName : `https://github.com/${urlOrName}` }
        : { name: urlOrName, permissions: 'network:read, tasks:execute' };

      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.agent) {
        handleEvaluationComplete(data.agent);
      } else {
        alert(data.error || 'Audit failed');
      }
    } catch (err: any) {
      alert(`Error auditing agent: ${err.message}`);
    } finally {
      setIsAuditingLive(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-transparent">
      {/* Top Navigation */}
      <Navbar
        onOpenSpecs={() => setIsSpecsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        totalAgents={stats.totalAgents}
        session={session}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Universal Command Center Omnibox (Search, Autocomplete & Live Repo Audit) */}
        <HeroMetrics
          stats={stats}
          agents={agents}
          onAuditUrl={handleHeroAudit}
          onSelectAgent={agent => setSelectedAgent(agent)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isAuditing={isAuditingLive}
          session={session}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* Trust Leaderboard with 5-dimension mini bars & category tabs */}
        <TrustLeaderboard
          agents={agents}
          onSelectAgent={agent => setSelectedAgent(agent)}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
        />

        {/* Discovery Crawler Control (Moved to the bottom) */}
        <DiscoveryBar onRefresh={fetchAgents} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070a11]/90 backdrop-blur py-6 text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-slate-200 font-bold">TRUSTY.ai</span>
            <span>—</span>
            <span className="text-slate-400">Independent Agent Trust Layer</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a
              href="https://trusty-jfagbrh7p-drowlinks-projects.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-zinc-200 transition flex items-center space-x-1"
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
        onCheckQuota={checkAndConsumeQuota}
      />

      {/* Specs Viewer */}
      <SpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

      {/* VirusTotal Quota Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthenticate={(email) => {
          const newSession = authenticateWithEmail(email);
          setSession(newSession);
          setIsAuthOpen(false);
        }}
      />
    </div>
  );
}
