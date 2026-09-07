'use client';

import React, { useState } from 'react';
import { DiscoveryStats, AgentWithScore } from '@/lib/types';
import { UserSession } from '@/lib/quota';
import { 
  ShieldCheck, 
  CreditCard, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Loader2, 
  X, 
  ChevronRight, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Building2,
  TrendingUp,
  Activity
} from 'lucide-react';

interface HeroMetricsProps {
  stats: DiscoveryStats;
  agents: AgentWithScore[];
  onAuditUrl: (url: string) => void;
  onSelectAgent: (agent: AgentWithScore) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAuditing?: boolean;
  session?: UserSession;
  onOpenAuth?: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const HeroMetrics: React.FC<HeroMetricsProps> = ({
  stats,
  agents,
  onAuditUrl,
  onSelectAgent,
  searchQuery,
  onSearchChange,
  isAuditing,
  session,
  onOpenAuth,
  onNavigateTab,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const isUrl = (text: string) => {
    const trimmed = text.trim();
    return (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.includes('github.com') ||
      /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(trimmed)
    );
  };

  const isInputUrl = isUrl(searchQuery);

  // Matching suggestions
  const matchingAgents = searchQuery.trim() && !isInputUrl
    ? agents
        .filter(a => {
          const q = searchQuery.toLowerCase();
          return (
            a.name.toLowerCase().includes(q) ||
            a.publisher.name.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q) ||
            a.slug.toLowerCase().includes(q)
          );
        })
        .slice(0, 5)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    if (isInputUrl) {
      onAuditUrl(query);
      setIsFocused(false);
    } else if (matchingAgents.length > 0) {
      const target = selectedIndex >= 0 && selectedIndex < matchingAgents.length
        ? matchingAgents[selectedIndex]
        : matchingAgents[0];
      onSelectAgent(target);
      setIsFocused(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (matchingAgents.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < matchingAgents.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : matchingAgents.length - 1));
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  const procurementBot = agents.find(a => a.name.toLowerCase().includes('procurement')) || agents[0];

  return (
    <section className="pt-8 sm:pt-12 pb-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/[0.06]">
      {/* 1. Header Statement */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/90 border border-white/[0.08] text-[11px] font-sans text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">TRUSTY.BOT</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">The Trust &amp; Credit Bureau for AI Agents</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-sans">
          The trust &amp; credit bureau <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-sky-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
            for the agentic economy.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans max-w-2xl mx-auto">
          Before an agent gets your <strong className="text-emerald-400 font-semibold">data</strong>, <strong className="text-sky-400 font-semibold">permissions</strong>, or <strong className="text-purple-400 font-semibold">money</strong> — ask TRUSTY. Continuous discovery, Day-Zero underwriting, and real-time transaction clearing.
        </p>
      </div>

      {/* 2. Universal Minimalist Omnibox */}
      <div className="mt-8 max-w-2xl mx-auto relative">
        <form onSubmit={handleSubmit}>
          <div className={`relative flex items-center rounded-2xl bg-[#0c1017] border transition p-2 shadow-2xl ${
            isFocused ? 'border-sky-500/80 ring-2 ring-sky-500/20 shadow-sky-500/10' : 'border-white/[0.1] hover:border-white/[0.2]'
          }`}>
            <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                onSearchChange(e.target.value);
                setSelectedIndex(-1);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onKeyDown={handleKeyDown}
              placeholder="Search agent name (e.g. ProcurementBot) or paste GitHub repository URL..."
              className="w-full px-3 py-2.5 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  setSelectedIndex(-1);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={isAuditing}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex-shrink-0 shadow-sm bg-white text-slate-950 hover:bg-slate-200 disabled:opacity-50"
            >
              {isAuditing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Auditing...</span>
                </>
              ) : (
                <>
                  <span>{isInputUrl ? 'Audit Repo' : 'Search'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Autocomplete Suggestions */}
        {isFocused && matchingAgents.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#0c1017] border border-white/[0.12] shadow-2xl z-30 overflow-hidden font-sans divide-y divide-white/[0.06]">
            <div className="px-3 py-2 bg-slate-950/80 text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Matching Indexed Agents ({matchingAgents.length})</span>
              <span>Click to inspect</span>
            </div>
            {matchingAgents.map((agent, index) => {
              const isSelected = index === selectedIndex;
              const trustScore = agent.evaluation.trustyScore;
              const creditScore = agent.creditProfile?.creditScore || 70;
              return (
                <div
                  key={agent.id}
                  onMouseDown={() => {
                    onSelectAgent(agent);
                    setIsFocused(false);
                  }}
                  className={`p-3 flex items-center justify-between cursor-pointer transition ${
                    isSelected ? 'bg-slate-800' : 'hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-white truncate">{agent.name}</span>
                        <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                          {agent.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">by {agent.publisher.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0 text-right">
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-400">Trust {trustScore}</span>
                      <span className="block text-[10px] font-mono text-purple-400">
                        Tier {agent.creditProfile?.creditTier || 'BBB'}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 1-Click Quick Presets */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-slate-400">
          <span className="text-slate-500 text-[11px]">Sample Audits:</span>
          {procurementBot && (
            <button
              type="button"
              onClick={() => onSelectAgent(procurementBot)}
              className="px-2.5 py-1 rounded-full bg-purple-950/40 border border-purple-800/50 text-purple-300 hover:bg-purple-900/40 transition text-[11px]"
            >
              ProcurementBot-847 (Tier AA)
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onSearchChange('https://github.com/crewAIInc/crewAI');
              onAuditUrl('https://github.com/crewAIInc/crewAI');
            }}
            className="px-2.5 py-1 rounded-full bg-slate-900 border border-white/[0.08] text-slate-300 hover:border-slate-600 transition text-[11px]"
          >
            crewAI Repo
          </button>
          <button
            type="button"
            onClick={() => {
              onSearchChange('https://github.com/browser-use/browser-use');
              onAuditUrl('https://github.com/browser-use/browser-use');
            }}
            className="px-2.5 py-1 rounded-full bg-slate-900 border border-white/[0.08] text-slate-300 hover:border-slate-600 transition text-[11px]"
          >
            browser-use Repo
          </button>
        </div>
      </div>

      {/* 3. Two Core Scores Showcase (Slide 2 & 10 of Pitch) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-10">
        {/* Card A: SCORE 01 - TRUST SCORE */}
        <div className="security-card p-5 sm:p-6 rounded-2xl relative overflow-hidden border border-emerald-900/30 group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  SCORE 01 • CYBERSECURITY &amp; GOVERNANCE
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Trust Score (0–100)
                </h3>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
              Deterministic
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            <strong className="text-slate-200">&ldquo;Can I trust this agent?&rdquo;</strong> Multi-dimensional evaluation across 20 signals: identity verification, code provenance, sandboxing, secret safety, and prompt-injection resilience.
          </p>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/[0.06] text-center">
            <div className="p-2 rounded-lg bg-[#07090e] border border-white/[0.04]">
              <span className="text-xs font-mono font-bold text-emerald-400 block">5 Dims</span>
              <span className="text-[10px] text-slate-500">20 Signals</span>
            </div>
            <div className="p-2 rounded-lg bg-[#07090e] border border-white/[0.04]">
              <span className="text-xs font-mono font-bold text-emerald-400 block">Circuit Breaks</span>
              <span className="text-[10px] text-slate-500">Malware / Theft</span>
            </div>
            <div className="p-2 rounded-lg bg-[#07090e] border border-white/[0.04]">
              <span className="text-xs font-mono font-bold text-emerald-400 block">100% Verified</span>
              <span className="text-[10px] text-slate-500">Explainable</span>
            </div>
          </div>
        </div>

        {/* Card B: SCORE 02 - CREDIT SCORE & SPENDING CAPACITY */}
        <div className="security-card p-5 sm:p-6 rounded-2xl relative overflow-hidden border border-purple-900/30 group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold block">
                  SCORE 02 • MONEY &amp; ECONOMIC AUTHORITY
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Credit Score &amp; Spending Limits
                </h3>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-800/80">
              Tiers AAA–D
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            <strong className="text-slate-200">&ldquo;How much economic authority should it receive?&rdquo;</strong> Establishes risk-adjusted daily spending envelopes, single-transaction autonomous ceilings, and mandatory human approval triggers.
          </p>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/[0.06] text-center">
            <div className="p-2 rounded-lg bg-[#07090e] border border-white/[0.04]">
              <span className="text-xs font-mono font-bold text-purple-400 block">Day-Zero</span>
              <span className="text-[10px] text-slate-500">12 Public Signals</span>
            </div>
            <div className="p-2 rounded-lg bg-[#07090e] border border-white/[0.04]">
              <span className="text-xs font-mono font-bold text-purple-400 block">Behavioral</span>
              <span className="text-[10px] text-slate-500">20 Telemetry Ledger</span>
            </div>
            <div className="p-2 rounded-lg bg-[#07090e] border border-white/[0.04]">
              <span className="text-xs font-mono font-bold text-purple-400 block">AVUD Clearing</span>
              <span className="text-[10px] text-slate-500">Brex / Visa / Stripe</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Featured Institutional Benchmark Showcase (Slide 5 & 6) */}
      {procurementBot && (
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#0c1017] via-[#111726] to-[#0c1017] border border-white/[0.08] p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded-full font-bold">
                MATURE CORPORATE AGENT CASE
              </span>
              <span className="text-xs font-bold text-white">{procurementBot.name}</span>
              <span className="text-xs text-slate-400 font-sans">• Acme Corp Treasury</span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              180+ days clean operating telemetry • $4.12M AVUD processed • 14,820 transactions with 0.00% chargebacks.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 flex-shrink-0">
            <div className="text-center px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Trust Score</span>
              <span className="text-base font-bold font-mono text-emerald-400">94 / 100</span>
            </div>
            <div className="text-center px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Credit Rating</span>
              <span className="text-base font-bold font-mono text-purple-400">Tier AA (87)</span>
            </div>
            <div className="text-center px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Daily Capacity</span>
              <span className="text-base font-bold font-mono text-cyan-400">$25,000 / day</span>
            </div>

            <button
              onClick={() => onSelectAgent(procurementBot)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/[0.1] transition flex items-center space-x-1.5"
            >
              <span>Inspect Credit File</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Minimalist Ecosystem Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/[0.06] text-center text-xs">
        <div>
          <span className="text-lg sm:text-xl font-bold font-mono text-white block tabular-nums">
            {stats.totalAgents}
          </span>
          <span className="text-slate-400 text-[11px]">Agents Indexed</span>
        </div>
        <div>
          <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400 block tabular-nums">
            ${(stats.totalDailyCapacity || 249000).toLocaleString()}
          </span>
          <span className="text-slate-400 text-[11px]">Daily Spending Capacity</span>
        </div>
        <div>
          <span className="text-lg sm:text-xl font-bold font-mono text-purple-400 block tabular-nums">
            {stats.avgTrustScore} / 100
          </span>
          <span className="text-slate-400 text-[11px]">Avg Ecosystem Trust</span>
        </div>
        <div>
          <span className="text-lg sm:text-xl font-bold font-mono text-sky-400 block">
            5 Rails
          </span>
          <span className="text-slate-400 text-[11px]">Brex · Visa · Stripe · Plaid</span>
        </div>
      </div>
    </section>
  );
};
