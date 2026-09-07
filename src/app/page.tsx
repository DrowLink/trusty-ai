'use client';

import React, { useState, useEffect } from 'react';
import { AgentWithScore, DiscoveryStats, ActiveProductTab } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { HeroMetrics } from '@/components/HeroMetrics';
import { DiscoveryBar } from '@/components/DiscoveryBar';
import { TrustLeaderboard } from '@/components/TrustLeaderboard';
import { AgentDetailModal } from '@/components/AgentDetailModal';
import { EvaluateModal } from '@/components/EvaluateModal';
import { SpecsModal } from '@/components/SpecsModal';
import { AuthModal } from '@/components/AuthModal';
import { EconomicCaseView } from '@/components/EconomicCaseView';
import { DecisionPlayground } from '@/components/DecisionPlayground';
import { UnderwritingExplainer } from '@/components/UnderwritingExplainer';
import { BusinessAndPricingView } from '@/components/BusinessAndPricingView';
import { CompetitiveMoatView } from '@/components/CompetitiveMoatView';
import { CookieConsent } from '@/components/CookieConsent';
import Image from 'next/image';
import { getUserSession, decrementQueryQuota, authenticateWithEmail, UserSession } from '@/lib/quota';
import { 
  getLocalCustomAgents, 
  saveLocalCustomAgent, 
  mergeAgentsWithLocal, 
  computeDiscoveryStats, 
  saveMultipleLocalCustomAgents 
} from '@/lib/storage/clientStorage';
import { Github, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function HomePage() {
  const [agents, setAgents] = useState<AgentWithScore[]>([]);
  const [stats, setStats] = useState<DiscoveryStats>({
    totalAgents: 0,
    avgTrustScore: 0,
    avgCreditScore: 0,
    totalDailyCapacity: 0,
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

  const [activeTab, setActiveTab] = useState<ActiveProductTab>('bureau');
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
        // Dual-Layer Resilience: Merge with locally stored custom audits so user never loses their agents
        const { merged, newToSync } = mergeAgentsWithLocal(data.agents);
        setAgents(merged);
        setStats(computeDiscoveryStats(merged));

        // Save server agents into local storage cache
        saveMultipleLocalCustomAgents(merged);

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
    saveLocalCustomAgent(newAgent);
    setAgents(prev => {
      const updated = [newAgent, ...prev.filter(a => a.id !== newAgent.id)];
      setStats(computeDiscoveryStats(updated));
      return updated;
    });
    setSelectedAgent(newAgent);

    const { evaluation, ...agentRecord } = newAgent;
    fetch('/api/agents/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent: agentRecord }),
    }).catch(e => console.warn('Background sync error:', e));
  };

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
    <div className="flex-1 flex flex-col min-h-screen bg-transparent font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSpecs={() => setIsSpecsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenEvaluate={() => setIsEvaluateOpen(true)}
        totalAgents={stats.totalAgents}
        session={session}
      />

      {/* Main Product Views */}
      <main className="flex-1">
        {/* VIEW 1: AGENT BUREAU & DIRECTORY */}
        {activeTab === 'bureau' && (
          <div className="animate-fadeIn">
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
              onNavigateTab={setActiveTab}
            />

            <TrustLeaderboard
              agents={agents}
              onSelectAgent={agent => setSelectedAgent(agent)}
              isLoading={isLoading}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
            />

            <DiscoveryBar onRefresh={fetchAgents} />
          </div>
        )}

        {/* VIEW 2: M2M DECISION GATEWAY (SLIDE 5) */}
        {activeTab === 'decision_api' && (
          <div className="animate-fadeIn">
            <DecisionPlayground
              agents={agents}
              selectedAgentDefault={selectedAgent}
            />
          </div>
        )}

        {/* VIEW 3: THE ECONOMIC CASE & ROI (BREX CASE) */}
        {activeTab === 'economics' && (
          <div className="animate-fadeIn">
            <EconomicCaseView
              onOpenDecisionPlayground={() => setActiveTab('decision_api')}
            />
          </div>
        )}

        {/* VIEW 4: UNDERWRITING METHODOLOGY (12 PUBLIC + 20 BEHAVIORAL SIGNALS) */}
        {activeTab === 'underwriting' && (
          <div className="animate-fadeIn">
            <UnderwritingExplainer />
          </div>
        )}

        {/* VIEW 5: BUSINESS MODEL & INSTITUTIONAL PRICING (SLIDE 7) */}
        {activeTab === 'pricing' && (
          <div className="animate-fadeIn">
            <BusinessAndPricingView
              onSelectTier={(tier) => {
                if (tier === 'FREE') setActiveTab('bureau');
                else if (tier === 'DECISION' || tier === 'API') setActiveTab('decision_api');
              }}
            />
          </div>
        )}

        {/* VIEW 6: COMPETITIVE MOAT & GTM FLYWHEEL (SLIDE 8 & 9) */}
        {activeTab === 'moat' && (
          <div className="animate-fadeIn">
            <CompetitiveMoatView />
          </div>
        )}
      </main>

      {/* Institutional Minimalist Footer */}
      <footer className="border-t border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#07090e]/95 backdrop-blur py-8 text-xs text-slate-600 dark:text-slate-400 font-sans transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center space-x-3 text-center sm:text-left">
            <div className="flex items-center space-x-2">
              <Image
                src="/trusty-logo.png"
                alt="TRUSTY.bot Logo"
                width={26}
                height={26}
                className="w-6 h-6 object-contain rounded"
              />
              <span className="text-slate-900 dark:text-white font-extrabold text-sm tracking-tight font-sans">
                TRUSTY<span className="text-[#0066FF] dark:text-[#38BDF8]">.bot</span>
              </span>
              <span className="text-[9px] font-mono font-bold text-[#0066FF] bg-blue-50 dark:bg-blue-950/60 dark:text-sky-300 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/60">
                CREDIT BUREAU
              </span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">—</span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              TRUST POWERS AGENTS
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 text-xs text-slate-600 dark:text-slate-400">
            <button
              onClick={() => setActiveTab('bureau')}
              className={`hover:text-slate-900 dark:hover:text-white transition ${activeTab === 'bureau' ? 'text-[#0066FF] dark:text-sky-400 font-semibold' : ''}`}
            >
              Directory
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('decision_api')}
              className={`hover:text-slate-900 dark:hover:text-white transition ${activeTab === 'decision_api' ? 'text-[#0066FF] dark:text-sky-400 font-semibold' : ''}`}
            >
              Decision Gateway (M2M)
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('economics')}
              className={`hover:text-slate-900 dark:hover:text-white transition ${activeTab === 'economics' ? 'text-[#0066FF] dark:text-sky-400 font-semibold' : ''}`}
            >
              Economic Case
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('underwriting')}
              className={`hover:text-slate-900 dark:hover:text-white transition ${activeTab === 'underwriting' ? 'text-[#0066FF] dark:text-sky-400 font-semibold' : ''}`}
            >
              Underwriting
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`hover:text-slate-900 dark:hover:text-white transition ${activeTab === 'pricing' ? 'text-[#0066FF] dark:text-sky-400 font-semibold' : ''}`}
            >
              Pricing
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('moat')}
              className={`hover:text-slate-900 dark:hover:text-white transition ${activeTab === 'moat' ? 'text-[#0066FF] dark:text-sky-400 font-semibold' : ''}`}
            >
              Moat
            </button>
            <span>•</span>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-cookie-preferences'));
                }
              }}
              className="hover:text-slate-900 dark:hover:text-white transition underline underline-offset-2"
            >
              Cookies
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSpecsOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition"
            >
              Specs (.md)
            </button>
            <span>•</span>
            <a
              href="https://github.com/DrowLink/trusty-ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition flex items-center space-x-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Modals and Drawers */}
      <AgentDetailModal
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />

      <EvaluateModal
        isOpen={isEvaluateOpen}
        onClose={() => setIsEvaluateOpen(false)}
        onEvaluationComplete={handleEvaluationComplete}
        onCheckQuota={checkAndConsumeQuota}
      />

      <SpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthenticate={(email) => {
          const newSession = authenticateWithEmail(email);
          setSession(newSession);
          setIsAuthOpen(false);
        }}
      />

      {/* GDPR / CCPA Cookie Consent Banner & Preferences */}
      <CookieConsent />
    </div>
  );
}
