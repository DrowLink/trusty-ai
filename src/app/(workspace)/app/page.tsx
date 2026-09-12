'use client';

import React, { useState, useEffect } from 'react';
import { 
  AgentWithScore, 
  DiscoveryStats, 
  ActiveProductTab,
  HumanMandate,
  ApprovalQueueItem,
  VerifiedDecisionRecord 
} from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
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
import { TrustyIsotype } from '@/components/PartnerLogos';
import { MandatesView } from '@/components/console/MandatesView';
import { HumanReviewQueue } from '@/components/console/HumanReviewQueue';
import { DecisionsAuditView } from '@/components/console/DecisionsAuditView';
import { CreateMandateModal } from '@/components/console/CreateMandateModal';
import { getUserSession, decrementQueryQuota, authenticateWithEmail, signOutUserSession, UserSession } from '@/lib/quota';
import { onAuthStateChange } from '@/lib/supabase/client';
import { 
  getLocalCustomAgents, 
  saveLocalCustomAgent, 
  mergeAgentsWithLocal, 
  computeDiscoveryStats, 
  saveMultipleLocalCustomAgents 
} from '@/lib/storage/clientStorage';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export default function WorkspacePage() {
  const [agents, setAgents] = useState<AgentWithScore[]>([]);
  const [mandates, setMandates] = useState<HumanMandate[]>([]);
  const [approvalQueue, setApprovalQueue] = useState<ApprovalQueueItem[]>([]);
  const [decisionsAudit, setDecisionsAudit] = useState<VerifiedDecisionRecord[]>([]);

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

  const [activeTab, setActiveTab] = useState<ActiveProductTab>('mandates');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuditingLive, setIsAuditingLive] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentWithScore | null>(null);
  const [isEvaluateOpen, setIsEvaluateOpen] = useState(false);
  const [isCreateMandateOpen, setIsCreateMandateOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [session, setSession] = useState<UserSession>({
    email: null,
    isAuthenticated: false,
    queriesRemaining: 3,
    maxQueries: 3,
    tier: 'anonymous',
  });

  // Fetch all persisted Intent Authorization records from API v1
  const fetchIntentData = async () => {
    try {
      const [mRes, aRes, dRes] = await Promise.all([
        fetch('/api/v1/mandates').then(r => r.json()).catch(() => ({ mandates: [] })),
        fetch('/api/v1/approvals').then(r => r.json()).catch(() => ({ items: [] })),
        fetch('/api/v1/decisions').then(r => r.json()).catch(() => ({ decisions: [] })),
      ]);

      if (mRes?.success && Array.isArray(mRes.mandates)) setMandates(mRes.mandates);
      if (aRes?.success && Array.isArray(aRes.items)) setApprovalQueue(aRes.items);
      if (dRes?.success && Array.isArray(dRes.decisions)) setDecisionsAudit(dRes.decisions);
    } catch (e) {
      console.warn('Failed to fetch intent records:', e);
    }
  };

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/agents');
      const data = await res.json();
      if (data.success && Array.isArray(data.agents)) {
        const { merged, newToSync } = mergeAgentsWithLocal(data.agents);
        setAgents(merged);
        setStats(computeDiscoveryStats(merged));
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
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
      if (tab === 'bureau') setActiveTab('agents');
      else if (tab === 'decision_api') setActiveTab('simulator');
      else if (['mandates', 'approvals', 'decisions', 'simulator', 'agents', 'economics', 'underwriting', 'pricing', 'moat'].includes(tab)) {
        setActiveTab(tab as ActiveProductTab);
      }
    }
    if (params.get('q')) setSearchQuery(params.get('q')!);
    if (params.get('signin') === '1') setIsAuthOpen(true);
    setSession(getUserSession());
    fetchIntentData();
    fetchAgents();

    const { unsubscribe } = onAuthStateChange((event, authSession) => {
      if (authSession?.user?.email) {
        const s = authenticateWithEmail(authSession.user.email);
        setSession(s);
      } else if (event === 'SIGNED_OUT') {
        const s = signOutUserSession();
        setSession(s);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkAndConsumeQuota = (): boolean => {
    const currentSession = getUserSession();
    if (currentSession.isAuthenticated) return true;
    if (currentSession.queriesRemaining <= 0) {
      setAuthInitialMode('signup');
      setIsQuotaExceeded(true);
      setIsAuthOpen(true);
      return false;
    }
    const { allowed } = decrementQueryQuota();
    const updated = getUserSession();
    setSession(updated);
    if (!allowed) {
      setAuthInitialMode('signup');
      setIsQuotaExceeded(true);
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
    if (!checkAndConsumeQuota()) return;

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

  const handleTabChange = (tab: ActiveProductTab | string) => {
    setActiveTab(tab as ActiveProductTab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleCreateMandate = async (newMandate: HumanMandate) => {
    // Optimistic local update
    setMandates(prev => [newMandate, ...prev]);

    // Persist to backend / Supabase
    try {
      await fetch('/api/v1/mandates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMandate),
      });
    } catch (e) {
      console.warn('Failed to persist mandate to API:', e);
    }
  };

  const handleResolveReviewItem = async (
    itemId: string, 
    decision: 'APPROVED_EXCEPTION' | 'DECLINED' | 'ADJUSTMENT_REQUESTED', 
    note: string
  ) => {
    const item = approvalQueue.find(i => i.id === itemId);
    if (!item) return;

    // Optimistic local update
    setApprovalQueue(prev => prev.map(i => {
      if (i.id === itemId) {
        return {
          ...i,
          status: decision,
          resolutionNote: note,
          resolvedAt: new Date().toISOString(),
          resolvedBy: session.email || 'Authorized Corporate Reviewer',
        };
      }
      return i;
    }));

    // Persist to backend
    try {
      const res = await fetch('/api/v1/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          decision,
          note,
          reviewerEmail: session.email,
        }),
      });
      const data = await res.json();
      if (data.success && data.decisionRecord) {
        setDecisionsAudit(prev => [data.decisionRecord, ...prev]);
      }
    } catch (e) {
      console.warn('Failed to resolve approval item on backend:', e);
    }
  };

  const handleLoadSampleData = async () => {
    try {
      await fetch('/api/v1/sample-seed', { method: 'POST' });
      await fetchIntentData();
    } catch (e) {
      console.warn('Failed to load sample scenario:', e);
    }
  };

  const handleClearData = async () => {
    if (!confirm('Reset console to a clean, empty SaaS state?')) return;
    try {
      await fetch('/api/v1/sample-seed', { method: 'DELETE' });
      setMandates([]);
      setApprovalQueue([]);
      setDecisionsAudit([]);
    } catch (e) {
      console.warn('Failed to clear state:', e);
    }
  };

  const pendingApprovalsCount = approvalQueue.filter(i => i.status === 'PENDING_REVIEW').length;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8f9f5] dark:bg-[#0e1715] text-[#172b29] dark:text-[#f8f9f5] font-sans">
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenSpecs={() => setIsSpecsOpen(true)}
        onOpenAuth={() => {
          setAuthInitialMode('signin');
          setIsQuotaExceeded(false);
          setIsAuthOpen(true);
        }}
        onOpenEvaluate={() => setIsEvaluateOpen(true)}
        onOpenNewMandate={() => setIsCreateMandateOpen(true)}
        totalAgents={stats.totalAgents}
        pendingApprovalsCount={pendingApprovalsCount}
        session={session}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* VIEW 1: MANDATES */}
        {activeTab === 'mandates' && (
          <div className="animate-fadeIn">
            <MandatesView
              mandates={mandates}
              onCreateMandateClick={() => setIsCreateMandateOpen(true)}
              onLoadSampleData={handleLoadSampleData}
              onClearData={mandates.length > 0 ? handleClearData : undefined}
            />
          </div>
        )}

        {/* VIEW 2: HUMAN REVIEW QUEUE */}
        {activeTab === 'approvals' && (
          <div className="animate-fadeIn">
            <HumanReviewQueue
              items={approvalQueue}
              onResolveItem={handleResolveReviewItem}
              onSimulateInterception={handleLoadSampleData}
            />
          </div>
        )}

        {/* VIEW 3: AUDIT TRAIL */}
        {activeTab === 'decisions' && (
          <div className="animate-fadeIn">
            <DecisionsAuditView
              decisions={decisionsAudit}
            />
          </div>
        )}

        {/* VIEW 4: SIMULATOR */}
        {(activeTab === 'simulator' || activeTab === 'decision_api') && (
          <div className="animate-fadeIn">
            <DecisionPlayground
              agents={agents}
              selectedAgentDefault={selectedAgent}
            />
          </div>
        )}

        {/* VIEW 5: AGENT TOOLS & SCANNER */}
        {(activeTab === 'agents' || activeTab === 'bureau') && (
          <div className="animate-fadeIn space-y-6">
            <section className="p-6 rounded-2xl bg-white dark:bg-[#14221e] border border-[#dce3db] dark:border-[#21352e] shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#50625d] dark:text-[#9cb0a8] bg-[#e9eddf] dark:bg-[#1c302a] px-2 py-0.5 rounded">
                    Secondary Evidence Instrument
                  </span>
                  <h1 className="text-2xl font-bold tracking-tight text-[#172b29] dark:text-[#f8f9f5] mt-1.5">
                    Agent Intelligence &amp; Repository Scanner
                  </h1>
                  <p className="mt-1 text-xs text-[#50625d] dark:text-[#9cb0a8] max-w-2xl">
                    Inspect public GitHub repositories, discover declared MCP tools, evaluate prompt injection risk, and analyze access permissions before delegating authority.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEvaluateOpen(true)}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#172b29] hover:bg-[#203b32] transition shadow-sm flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#c5e86c]" />
                    <span>Run Custom Audit</span>
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <form 
                className="mt-5 flex flex-col sm:flex-row gap-2 max-w-3xl" 
                onSubmit={e => { e.preventDefault(); if (searchQuery.trim()) handleHeroAudit(searchQuery.trim()); }}
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-[#50625d]" />
                  <input 
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#dce3db] dark:border-[#21352e] bg-[#f8f9f5] dark:bg-[#0f1816] text-[#172b29] dark:text-[#f8f9f5] text-xs focus:ring-2 focus:ring-[#203b32] focus:outline-none" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                    placeholder="Search discovered agents or paste a GitHub repo URL (e.g. owner/repo)" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isAuditingLive || !searchQuery.trim()} 
                  className="rounded-lg bg-[#172b29] hover:bg-[#203b32] text-white px-5 py-2.5 text-xs font-bold disabled:opacity-50 transition"
                >
                  {isAuditingLive ? 'Scanning...' : 'Scan Repository'}
                </button>
              </form>
            </section>

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

        {/* INSTITUTIONAL VIEWS */}
        {activeTab === 'economics' && (
          <div className="animate-fadeIn">
            <EconomicCaseView
              onOpenDecisionPlayground={() => setActiveTab('simulator')}
            />
          </div>
        )}

        {activeTab === 'underwriting' && (
          <div className="animate-fadeIn">
            <UnderwritingExplainer />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="animate-fadeIn">
            <BusinessAndPricingView
              onSelectTier={(tier) => {
                if (tier === 'FREE') handleTabChange('agents');
                else if (tier === 'DECISION' || tier === 'API') handleTabChange('simulator');
              }}
            />
          </div>
        )}

        {activeTab === 'moat' && (
          <div className="animate-fadeIn">
            <CompetitiveMoatView />
          </div>
        )}
      </main>

      <footer className="border-t border-[#dce3db] dark:border-[#21352e] bg-white/95 dark:bg-[#14221e]/95 backdrop-blur py-8 text-xs text-[#50625d] dark:text-[#9cb0a8] font-sans transition-colors duration-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center space-x-3 text-center sm:text-left">
            <div className="flex items-center space-x-2">
              <TrustyIsotype className="w-6 h-6 text-[#203b32] dark:text-[#c5e86c]" />
              <span className="text-[#172b29] dark:text-[#f8f9f5] font-extrabold text-sm tracking-tight font-sans">
                TRUSTY<span className="text-[#203b32] dark:text-[#c5e86c]">.bot</span>
              </span>
              <span className="text-[9px] font-mono font-bold text-[#172b29] dark:text-[#c5e86c] bg-[#e9eddf] dark:bg-[#1c302a] px-1.5 py-0.5 rounded border border-[#dce3db] dark:border-[#21352e]">
                INTENT CONSOLE
              </span>
            </div>
            <span className="hidden sm:inline text-[#dce3db]">—</span>
            <span className="text-[#50625d] font-mono text-[11px]">
              INTENT PRECEDES CLEARING
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#50625d] dark:text-[#9cb0a8]">
            <button
              onClick={() => handleTabChange('mandates')}
              className={`hover:text-[#172b29] dark:hover:text-white transition ${activeTab === 'mandates' ? 'text-[#172b29] dark:text-[#c5e86c] font-bold' : ''}`}
            >
              Mandates
            </button>
            <span>•</span>
            <button
              onClick={() => handleTabChange('approvals')}
              className={`hover:text-[#172b29] dark:hover:text-white transition ${activeTab === 'approvals' ? 'text-[#172b29] dark:text-[#c5e86c] font-bold' : ''}`}
            >
              Review Queue ({pendingApprovalsCount})
            </button>
            <span>•</span>
            <button
              onClick={() => handleTabChange('decisions')}
              className={`hover:text-[#172b29] dark:hover:text-white transition ${activeTab === 'decisions' ? 'text-[#172b29] dark:text-[#c5e86c] font-bold' : ''}`}
            >
              Audit Trail
            </button>
            <span>•</span>
            <button
              onClick={() => handleTabChange('simulator')}
              className={`hover:text-[#172b29] dark:hover:text-white transition ${activeTab === 'simulator' || activeTab === 'decision_api' ? 'text-[#172b29] dark:text-[#c5e86c] font-bold' : ''}`}
            >
              Simulator
            </button>
            <span>•</span>
            <button
              onClick={() => handleTabChange('agents')}
              className={`hover:text-[#172b29] dark:hover:text-white transition ${activeTab === 'agents' || activeTab === 'bureau' ? 'text-[#172b29] dark:text-[#c5e86c] font-bold' : ''}`}
            >
              Agent Tools
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSpecsOpen(true)}
              className="hover:text-[#172b29] dark:hover:text-white transition"
            >
              Specs (.md)
            </button>
            <span>•</span>
            <Link
              href="/"
              className="hover:text-[#172b29] dark:hover:text-white transition underline underline-offset-2"
            >
              Public Site
            </Link>
          </div>
        </div>
      </footer>

      <CreateMandateModal
        isOpen={isCreateMandateOpen}
        onClose={() => setIsCreateMandateOpen(false)}
        onCreate={handleCreateMandate}
      />

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
        onClose={() => {
          setIsAuthOpen(false);
          setIsQuotaExceeded(false);
        }}
        currentUserEmail={session.email}
        initialMode={authInitialMode}
        quotaExceeded={isQuotaExceeded}
        onAuthenticate={(email) => {
          const newSession = authenticateWithEmail(email);
          setSession(newSession);
          setIsAuthOpen(false);
          setIsQuotaExceeded(false);
        }}
        onSignOut={() => {
          const newSession = signOutUserSession();
          setSession(newSession);
        }}
      />

      <CookieConsent />
    </div>
  );
}
