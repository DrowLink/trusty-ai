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

import { HeroDecisionPipeline } from './HeroDecisionPipeline';

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
    <section className="relative pt-6 sm:pt-14 pb-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden transition-colors font-sans">
      {/* 1. AMBIENT BACKGROUND GLOW & CONCENTRIC ORBITAL RINGS */}
      <div className="absolute top-[280px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] pointer-events-none select-none z-0 flex items-center justify-center opacity-70">
        <div className="absolute w-[400px] h-[400px] rounded-full border border-slate-200/60 dark:border-white/[0.05]" />
        <div className="absolute w-[700px] h-[700px] rounded-full border border-slate-200/40 dark:border-white/[0.04]" />
        <div className="absolute w-[1000px] h-[1000px] rounded-full border border-slate-200/30 dark:border-white/[0.03]" />
        <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-blue-400/10 via-sky-300/10 to-purple-400/10 dark:from-sky-500/10 dark:to-purple-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* 2. MAIN SPACIOUS HERO GRID (POPL-STYLE ASYMMETRICAL 2-COLUMN DESKTOP + FLUID MOBILE) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column (Editorial Headline, Pitch & CTAs) */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Social Proof Pill */}
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.1] text-xs font-sans text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-md">
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

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.06] font-sans">
            The trust &amp; credit bureau <br className="hidden sm:inline" />
            <span className="text-slate-900 dark:text-slate-100">for AI agents.</span>
          </h1>

          {/* Subtitle / Value Proposition */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-sans max-w-2xl mx-auto lg:mx-0 font-normal">
            From real-time transaction approvals to continuous risk underwriting, manage agent economic limits in one place and keep your capital secure.
          </p>

          {/* Mobile Decision Pipeline (Stacked right after headline on mobile screens) */}
          <div className="block lg:hidden my-6">
            <HeroDecisionPipeline />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
            {onOpenEvaluate && (
              <button
                onClick={onOpenEvaluate}
                className="px-6 sm:px-7 py-3 rounded-full text-sm font-semibold bg-[#0066FF] hover:bg-blue-600 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 transition shadow-md shadow-blue-500/20 flex items-center space-x-2"
              >
                <span>Audit an Agent</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('decision_api')}
                className="px-6 sm:px-7 py-3 rounded-full text-sm font-medium border border-slate-200 dark:border-white/[0.15] bg-white/80 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition backdrop-blur-sm"
              >
                Connect Decision Rail
              </button>
            )}
          </div>

          {/* Integrated Universal Search / Audit Bar */}
          <div className="pt-2 max-w-xl mx-auto lg:mx-0">
            <form onSubmit={handleSubmit}>
              <div className={`relative flex items-center rounded-full bg-white dark:bg-[#0c1017] border transition p-1.5 sm:p-2 shadow-lg shadow-black/[0.03] dark:shadow-black/40 ${
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
                  className="w-full px-3 py-1.5 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-sans"
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
                  className="flex items-center space-x-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition flex-shrink-0 bg-[#0066FF] dark:bg-white text-white dark:text-slate-950 hover:bg-blue-600 dark:hover:bg-slate-100 disabled:opacity-50 shadow-sm"
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

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-2.5 text-xs font-sans text-slate-500">
              <span className="text-[11px] text-slate-400">Quick samples:</span>
              <button
                type="button"
                onClick={() => onSearchChange('ProcurementBot')}
                className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] transition font-mono"
              >
                ProcurementBot-847
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
        </div>

        {/* Right Column (HeroDecisionPipeline Animation - Desktop View) */}
        <div className="hidden lg:block lg:col-span-5 relative">
          <HeroDecisionPipeline />
        </div>

      </div>

      {/* 3. TRUSTED BY MARQUEE */}
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

