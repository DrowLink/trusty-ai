'use client';

import React, { useState } from 'react';
import { DiscoveryStats, AgentWithScore } from '@/lib/types';
import { UserSession } from '@/lib/quota';
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Loader2, 
  X, 
  CreditCard, 
  Shield,
  Star,
  Check
} from 'lucide-react';
import { 
  StripeIcon, 
  VisaIcon, 
  BrexIcon, 
  PayPalIcon, 
  CoinbaseIcon, 
  AnthropicIcon, 
  CrewAIIcon, 
  ShopifyIcon, 
  AWSIcon,
} from './PartnerLogos';

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
  onOpenEvaluate?: () => void;
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
  onOpenEvaluate,
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

  return (
    <section className="relative pt-6 sm:pt-12 pb-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden transition-colors">
      {/* 1. BACKGROUND CONCENTRIC ORBITAL RINGS */}
      <div className="absolute top-[320px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] pointer-events-none select-none z-0 flex items-center justify-center">
        <div className="absolute w-[360px] h-[360px] rounded-full border border-slate-200/70 dark:border-white/[0.06]" />
        <div className="absolute w-[580px] h-[580px] rounded-full border border-slate-200/60 dark:border-white/[0.05]" />
        <div className="absolute w-[840px] h-[840px] rounded-full border border-slate-200/50 dark:border-white/[0.04]" />
        <div className="absolute w-[1120px] h-[1120px] rounded-full border border-slate-200/40 dark:border-white/[0.03]" />
        <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-blue-400/10 via-sky-300/10 to-purple-400/10 dark:from-sky-500/10 dark:to-purple-600/10 blur-3xl pointer-events-none" />

        <div className="absolute -top-[14px] right-[420px] p-2.5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/[0.1] shadow-xl hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer animate-pulse" title="Stripe Settlement Rails">
          <StripeIcon className="w-6 h-6" />
        </div>
        <div className="absolute top-[280px] right-[100px] p-2.5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/[0.1] shadow-xl hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" title="Visa Autonomous Agent Card Clearing">
          <VisaIcon className="w-6 h-6" />
        </div>
        <div className="absolute top-[60px] left-[320px] p-2.5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/[0.1] shadow-xl hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer animate-pulse" style={{ animationDelay: '1s' }} title="Brex Underwriting & Credit Limits">
          <BrexIcon className="w-6 h-6" />
        </div>
        <div className="absolute top-[340px] left-[80px] p-2.5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/[0.1] shadow-xl hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" title="PayPal Autonomous Commerce">
          <PayPalIcon className="w-6 h-6" />
        </div>
        <div className="absolute top-[520px] left-[220px] p-2.5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/[0.1] shadow-xl hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" title="Coinbase On-Chain Agent Settlement">
          <CoinbaseIcon className="w-6 h-6" />
        </div>
        <div className="absolute top-[120px] right-[240px] p-2.5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/[0.1] shadow-xl hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" title="Anthropic Claude Provenance">
          <AnthropicIcon className="w-6 h-6" />
        </div>
        <div className="absolute top-[460px] right-[180px] p-2.5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/[0.1] shadow-xl hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" title="AWS Bedrock & Cloud Sandboxing">
          <AWSIcon className="w-6 h-6" />
        </div>
        <div className="absolute top-[640px] right-[320px] p-2.5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/[0.1] shadow-xl hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" title="Shopify Autonomous Purchasing">
          <ShopifyIcon className="w-6 h-6" />
        </div>
        <div className="absolute top-[680px] left-[380px] p-2.5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/[0.1] shadow-xl hover:scale-110 transition-transform duration-300 pointer-events-auto cursor-pointer" title="CrewAI Multi-Agent Ecosystem">
          <CrewAIIcon className="w-6 h-6" />
        </div>
      </div>

      {/* 2. HERO EDITORIAL COPY & SOCIAL PROOF PILL */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6 pt-4">
        <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.1] text-xs font-sans text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-md">
          <div className="flex items-center space-x-1">
            <span className="font-bold text-slate-900 dark:text-white">★ 4.9</span>
            <span className="text-slate-500 text-[11px]">TrustScore</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <div className="flex items-center space-x-1.5 font-medium text-slate-600 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Stripe, Brex &amp; Visa Integrated</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.08] font-sans">
          The trust &amp; credit bureau <br className="hidden sm:inline" />
          <span className="text-slate-900 dark:text-slate-100">for AI agents.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-sans max-w-2xl mx-auto font-normal">
          From real-time transaction approvals to continuous risk underwriting, manage agent economic limits in one place and keep your capital secure.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onOpenEvaluate && (
            <button
              onClick={onOpenEvaluate}
              className="px-7 py-3 rounded-full text-sm font-semibold bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 transition shadow-md shadow-black/10 flex items-center space-x-2"
            >
              <span>Audit an Agent</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('decision_api')}
              className="px-7 py-3 rounded-full text-sm font-medium border border-slate-200 dark:border-white/[0.15] bg-white/80 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition backdrop-blur-sm"
            >
              Connect Decision Rail
            </button>
          )}
        </div>
      </div>

      {/* 3. FLOATING LIVE SETTLEMENT NOTIFICATION CARDS */}
      <div className="relative z-10 mt-10 max-w-xl mx-auto">
        <div className="relative">
          <div className="relative z-20 rounded-2xl bg-white dark:bg-[#0d131f] border border-slate-200/90 dark:border-white/[0.12] p-4 sm:p-5 shadow-2xl shadow-blue-500/10 dark:shadow-black/60 transition hover:scale-[1.01]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-sans">
                      ProcurementBot-847
                    </span>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      APPROVED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Authorized <strong className="text-slate-800 dark:text-slate-200 font-semibold">$420.00</strong> cloud compute renewal on Brex Visa rail
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">Just now</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Tier AA • Daily Cap $25,000</span>
              </span>
              <span className="text-[#0066FF] dark:text-sky-400 font-semibold">14ms latency</span>
            </div>
          </div>
          <div className="relative -mt-3 mx-4 z-10 rounded-2xl bg-slate-50/90 dark:bg-[#0a0f18]/90 border border-slate-200/70 dark:border-white/[0.08] p-3.5 px-4 shadow-lg flex items-center justify-between text-xs backdrop-blur-md opacity-95">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 flex-shrink-0">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
                  Overprivileged Calendar blocked
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  SSH key theft prevented in AST sandbox
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800/60">
              BLOCKED
            </span>
          </div>
        </div>
      </div>

      {/* 4. UNIVERSAL SEARCH / AUDIT INPUT BAR */}
      <div className="relative z-10 mt-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className={`relative flex items-center rounded-full bg-white dark:bg-[#0c1017] border transition p-1.5 sm:p-2 shadow-lg shadow-black/[0.04] dark:shadow-black/50 ${
            isFocused 
              ? 'border-slate-400 dark:border-white/[0.3] ring-4 ring-slate-100 dark:ring-white/[0.05]' 
              : 'border-slate-200 dark:border-white/[0.1] hover:border-slate-300'
          }`}>
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 ml-3 flex-shrink-0" />
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
              className="w-full px-3 py-2 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  setSelectedIndex(-1);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={isAuditing}
              className="flex items-center space-x-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition flex-shrink-0 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50"
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

        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs font-sans text-slate-500">
          <span className="text-[11px] text-slate-400">Quick samples:</span>
          <button
            type="button"
            onClick={() => onSearchChange('ProcurementBot')}
            className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] transition font-mono"
          >
            ProcurementBot-847 (Tier AA)
          </button>
          <button
            type="button"
            onClick={() => onAuditUrl('https://github.com/crewAIInc/crewAI')}
            className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] transition font-mono"
          >
            crewAI Repo
          </button>
          <button
            type="button"
            onClick={() => onAuditUrl('https://github.com/anthropics/anthropic-quickstarts')}
            className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] transition font-mono"
          >
            anthropic-quickstarts
          </button>
        </div>
      </div>

      {/* 5. TRUSTED BY MARQUEE */}
      <div className="relative z-10 mt-16 pt-8 border-t border-slate-100 dark:border-white/[0.06] text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-6">
          Trusted by fintechs &amp; agent developers clearing autonomous transactions
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60 dark:opacity-40 grayscale hover:grayscale-0 transition-all duration-300 text-slate-700 dark:text-slate-300">
          <div className="flex items-center space-x-1.5 font-bold text-sm tracking-tight"><span className="text-lg">Stripe</span></div>
          <div className="flex items-center space-x-1.5 font-bold text-sm tracking-tight"><span className="text-lg">VISA</span></div>
          <div className="flex items-center space-x-1.5 font-bold text-sm tracking-tight"><span className="text-lg">Brex</span></div>
          <div className="flex items-center space-x-1.5 font-bold text-sm tracking-tight"><span className="text-lg">Coinbase</span></div>
          <div className="flex items-center space-x-1.5 font-bold text-sm tracking-tight"><span className="text-lg">PayPal</span></div>
          <div className="flex items-center space-x-1.5 font-bold text-sm tracking-tight"><span className="text-lg">Shopify</span></div>
          <div className="flex items-center space-x-1.5 font-bold text-sm tracking-tight"><span className="text-lg">Anthropic</span></div>
          <div className="flex items-center space-x-1.5 font-bold text-sm tracking-tight"><span className="text-lg">CrewAI</span></div>
        </div>
      </div>
    </section>
  );
};
