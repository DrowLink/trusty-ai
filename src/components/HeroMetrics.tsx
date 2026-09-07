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
  Activity,
  Award
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
    <section className="pt-8 sm:pt-14 pb-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200 dark:border-white/[0.06] transition-colors">
      {/* 1. Brand Logo Banner & Mission Statement */}
      <div className="text-center max-w-3xl mx-auto space-y-5">
        {/* Prominent Hero Brand Emblem Showcase */}
        <div className="flex flex-col items-center justify-center space-y-3.5">
          <div className="relative group">
            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#0066FF] via-[#00A6FB] to-purple-500 opacity-40 group-hover:opacity-75 blur-xl transition duration-500 animate-pulse-glow" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-[2px] bg-gradient-to-b from-[#0066FF] via-[#00A6FB] to-transparent shadow-xl flex items-center justify-center overflow-hidden bg-white dark:bg-[#0b101b] backdrop-blur-md">
              <img 
                src="/trusty-logo.png" 
                alt="TRUSTY.bot Official Emblem" 
                className="w-full h-full object-contain p-2 drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/[0.1] text-xs font-mono text-slate-700 dark:text-slate-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-ping" />
            <span className="font-extrabold tracking-wider text-[#0066FF] dark:text-sky-400">TRUSTY.bot™</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="font-semibold tracking-wide uppercase text-[11px]">TRUST POWERS AGENTS</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1] font-sans">
          The trust &amp; credit bureau <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#0066FF] via-[#00A6FB] to-[#7C3AED] dark:from-sky-400 dark:via-purple-300 dark:to-emerald-400 bg-clip-text text-transparent">
            for the agentic economy.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-sans max-w-2xl mx-auto">
          Before an agent gets your <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">data</strong>, <strong className="text-[#0066FF] dark:text-sky-400 font-semibold">permissions</strong>, or <strong className="text-purple-600 dark:text-purple-400 font-semibold">money</strong> — ask TRUSTY. Continuous discovery, Day-Zero underwriting, and real-time transaction clearing.
        </p>
      </div>

      {/* 2. Universal Minimalist Omnibox (Light / Dark compliant) */}
      <div className="mt-8 max-w-2xl mx-auto relative">
        <form onSubmit={handleSubmit}>
          <div className={`relative flex items-center rounded-2xl bg-white dark:bg-[#0c1017] border transition p-2 shadow-lg shadow-blue-500/[0.04] dark:shadow-black/50 ${
            isFocused 
              ? 'border-[#0066FF] ring-2 ring-blue-500/20 shadow-blue-500/10' 
              : 'border-slate-300 dark:border-white/[0.1] hover:border-slate-400 dark:hover:border-white/[0.2]'
          }`}>
            <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-3 flex-shrink-0" />
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
              className="w-full px-3 py-2.5 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-sans"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  setSelectedIndex(-1);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={isAuditing}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex-shrink-0 shadow-sm bg-[#0066FF] hover:bg-[#0052cc] text-white disabled:opacity-50"
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
          <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/[0.12] shadow-2xl z-30 overflow-hidden font-sans divide-y divide-slate-100 dark:divide-white/[0.06]">
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950/80 text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Matching Indexed Agents ({matchingAgents.length})</span>
              <span>Click to inspect</span>
            </div>
            {matchingAgents.map((agent, index) => {
              const isSelected = index === selectedIndex;
              const trustScore = agent.evaluation.trustyScore;
              return (
                <div
                  key={agent.id}
                  onMouseDown={() => {
                    onSelectAgent(agent);
                    setIsFocused(false);
                  }}
                  className={`p-3 flex items-center justify-between cursor-pointer transition ${
                    isSelected ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">{agent.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                          {agent.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">by {agent.publisher.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0 text-right">
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">Trust {trustScore}</span>
                      <span className="block text-[10px] font-mono text-purple-600 dark:text-purple-400">
                        Tier {agent.creditProfile?.creditTier || 'BBB'}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 1-Click Quick Presets */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">Quick Samples:</span>
          {procurementBot && (
            <button
              type="button"
              onClick={() => onSelectAgent(procurementBot)}
              className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition text-[11px] font-medium"
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
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition text-[11px]"
          >
            crewAI Repo
          </button>
          <button
            type="button"
            onClick={() => {
              onSearchChange('https://github.com/browser-use/browser-use');
              onAuditUrl('https://github.com/browser-use/browser-use');
            }}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition text-[11px]"
          >
            browser-use Repo
          </button>
        </div>
      </div>

      {/* 3. The Two Core Scores Interactive Grid (Slide 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-10">
        {/* Card A: SCORE 01 - TRUST SCORE */}
        <div className="security-card p-5 sm:p-6 rounded-2xl relative overflow-hidden border border-emerald-200 dark:border-emerald-900/30 group">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold block">
                  SCORE 01 • CYBERSECURITY &amp; PERMISSIONS
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">
                  Trust Score (0–100)
                </h3>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
              Deterministic
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-200">&ldquo;Can I trust this agent?&rdquo;</strong> Multi-dimensional evaluation across 20 signals: identity verification, code provenance, sandboxing, secret safety, and prompt-injection resilience.
          </p>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-white/[0.06] text-center">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#07090e] border border-slate-200/60 dark:border-white/[0.04]">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">5 Dims</span>
              <span className="text-[10px] text-slate-500">20 Signals</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#07090e] border border-slate-200/60 dark:border-white/[0.04]">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">Circuit Breaks</span>
              <span className="text-[10px] text-slate-500">Malware / Theft</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#07090e] border border-slate-200/60 dark:border-white/[0.04]">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">100% Verified</span>
              <span className="text-[10px] text-slate-500">Explainable</span>
            </div>
          </div>
        </div>

        {/* Card B: SCORE 02 - CREDIT SCORE & SPENDING CAPACITY */}
        <div className="security-card p-5 sm:p-6 rounded-2xl relative overflow-hidden border border-purple-200 dark:border-purple-900/30 group">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-bold block">
                  SCORE 02 • MONEY &amp; ECONOMIC AUTHORITY
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">
                  Credit Score &amp; Spending Limits
                </h3>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80">
              Tiers AAA–D
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-200">&ldquo;How much economic authority should it receive?&rdquo;</strong> Establishes risk-adjusted daily spending envelopes, single-transaction autonomous ceilings, and mandatory human approval triggers.
          </p>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-white/[0.06] text-center">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#07090e] border border-slate-200/60 dark:border-white/[0.04]">
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 block">Day-Zero</span>
              <span className="text-[10px] text-slate-500">12 Public Signals</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#07090e] border border-slate-200/60 dark:border-white/[0.04]">
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 block">Behavioral</span>
              <span className="text-[10px] text-slate-500">20 Telemetry Ledger</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#07090e] border border-slate-200/60 dark:border-white/[0.04]">
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 block">AVUD Clearing</span>
              <span className="text-[10px] text-slate-500">Brex / Visa / Stripe</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Featured Institutional Benchmark Showcase (Slide 5 & 6) */}
      {procurementBot && (
        <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-white/[0.08] p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 px-2 py-0.5 rounded-full font-bold">
                MATURE CORPORATE AGENT CASE
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{procurementBot.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">• Acme Corp Treasury</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
              180+ days clean operating telemetry • $4.12M AVUD processed • 14,820 transactions with 0.00% chargebacks.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 flex-shrink-0">
            <div className="text-center px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.06] shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Trust Score</span>
              <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">94 / 100</span>
            </div>
            <div className="text-center px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.06] shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Credit Rating</span>
              <span className="text-base font-bold font-mono text-purple-600 dark:text-purple-400">Tier AA (87)</span>
            </div>
            <div className="text-center px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.06] shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Daily Capacity</span>
              <span className="text-base font-bold font-mono text-sky-600 dark:text-cyan-400">$25,000 / day</span>
            </div>

            <button
              onClick={() => onSelectAgent(procurementBot)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0066FF] hover:bg-[#0052cc] text-white transition flex items-center space-x-1.5 shadow-sm"
            >
              <span>Inspect Credit File</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Minimalist Ecosystem Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-white/[0.06] text-center text-xs">
        <div>
          <span className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white block tabular-nums">
            {stats.totalAgents}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Agents Indexed</span>
        </div>
        <div>
          <span className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 block tabular-nums">
            ${(stats.totalDailyCapacity || 249000).toLocaleString()}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Daily Spending Capacity</span>
        </div>
        <div>
          <span className="text-lg sm:text-xl font-bold font-mono text-purple-600 dark:text-purple-400 block tabular-nums">
            {stats.avgTrustScore} / 100
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Avg Ecosystem Trust</span>
        </div>
        <div>
          <span className="text-lg sm:text-xl font-bold font-mono text-[#0066FF] dark:text-sky-400 block">
            5 Rails
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Brex · Visa · Stripe · Plaid</span>
        </div>
      </div>
    </section>
  );
};
