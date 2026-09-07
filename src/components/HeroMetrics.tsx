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
  Play
} from 'lucide-react';
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
    if (!query) {
      if (onOpenEvaluate) onOpenEvaluate();
      return;
    }

    if (isInputUrl) {
      onAuditUrl(query);
      setIsFocused(false);
    } else if (matchingAgents.length > 0) {
      const target = selectedIndex >= 0 && selectedIndex < matchingAgents.length
        ? matchingAgents[selectedIndex]
        : matchingAgents[0];
      onSelectAgent(target);
      setIsFocused(false);
    } else {
      onAuditUrl(query);
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
    <section className="relative pt-8 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      
      {/* MAIN 2-COLUMN HERO GRID (BREX ASYMMETRICAL EDITORIAL FINTECH LAYOUT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left Column: Authority Pitch, Value Prop & Brex-Style Integrated Action Input */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Social Proof Tag */}
          <div className="inline-flex items-center space-x-2.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.1] text-xs font-sans text-slate-700 dark:text-slate-300">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-slate-950 dark:text-white">★ 4.9</span>
              <span className="text-slate-500 text-[11px]">TrustScore</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <div className="flex items-center space-x-1.5 font-medium text-slate-700 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Stripe, Brex &amp; Visa Integrated</span>
            </div>
          </div>

          {/* Main Display Headline (Brex Bold neo-grotesque style) */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[62px] font-black tracking-[-0.035em] text-slate-950 dark:text-white leading-[1.05]">
            The trust &amp; credit bureau <br className="hidden sm:inline" />
            <span>for AI agents.</span>
          </h1>

          {/* Subtitle with generous line height and relaxed slate tone */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl font-normal">
            From real-time transaction approvals to continuous risk underwriting, manage agent economic limits in one place and keep your capital secure.
          </p>

          {/* Brex-Style Integrated Action Box (Single Container: Input + CTA Button) */}
          <div className="pt-2 max-w-xl">
            <form onSubmit={handleSubmit}>
              <div className={`flex flex-col sm:flex-row items-stretch sm:items-center bg-white dark:bg-[#0c1017] border rounded-xl p-1.5 transition-all shadow-sm ${
                isFocused 
                  ? 'border-[#0066FF] ring-2 ring-[#0066FF]/15 dark:border-sky-400' 
                  : 'border-slate-300 dark:border-white/[0.15] hover:border-slate-400 dark:hover:border-white/[0.25]'
              }`}>
                <div className="flex items-center flex-1 px-3 py-2">
                  <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2.5 flex-shrink-0" />
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
                    placeholder="Enter agent name or GitHub repository URL..."
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white mr-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isAuditing}
                  className="mt-2 sm:mt-0 flex items-center justify-center space-x-1.5 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#0066FF] hover:bg-blue-600 text-white transition flex-shrink-0 disabled:opacity-50 shadow-sm"
                >
                  {isAuditing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Auditing...</span>
                    </>
                  ) : (
                    <>
                      <span>{isInputUrl ? 'Audit Repo' : 'Get started'}</span>
                      <ArrowRight className="w-4 h-4 ml-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Brex Secondary Action Link + Clean Sample Buttons */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-slate-500 mt-3.5">
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('decision_api')}
                className="inline-flex items-center space-x-2 text-slate-900 dark:text-white font-medium hover:text-[#0066FF] dark:hover:text-sky-400 transition group cursor-pointer"
              >
                <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-white/[0.2] flex items-center justify-center group-hover:border-[#0066FF]">
                  <Play className="w-2.5 h-2.5 text-slate-800 dark:text-slate-200 fill-slate-800 dark:fill-slate-200 ml-0.5 group-hover:text-[#0066FF] group-hover:fill-[#0066FF]" />
                </span>
                <span>See TRUSTY in action</span>
              </button>

              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

              <div className="flex items-center space-x-2 text-[11px]">
                <span className="text-slate-400">Samples:</span>
                <button
                  type="button"
                  onClick={() => onSearchChange('ProcurementBot')}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0066FF] dark:hover:text-sky-400 transition font-mono underline decoration-slate-300 underline-offset-2"
                >
                  ProcurementBot-847
                </button>
                <button
                  type="button"
                  onClick={() => onAuditUrl('https://github.com/crewAIInc/crewAI')}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0066FF] dark:hover:text-sky-400 transition font-mono underline decoration-slate-300 underline-offset-2"
                >
                  crewAI
                </button>
              </div>
            </div>

            {/* Mobile Decision Pipeline Preview (positioned below CTA like Brex hardware hero) */}
            <div className="block lg:hidden mt-8">
              <HeroDecisionPipeline />
            </div>
          </div>
        </div>

        {/* Right Column: Sleek Product Terminal Simulator (Brex Card & Showcase Perspective) */}
        <div className="hidden lg:block lg:col-span-5 relative">
          <HeroDecisionPipeline />
        </div>

      </div>

      {/* 3. "TRUSTED BY" SECTION (BREX HEADLINE STYLE: "Trusted by 35,000+ top companies") */}
      <div className="mt-20 pt-12 border-t border-slate-200/70 dark:border-white/[0.08] text-center">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
          Trusted by fintechs &amp; agent developers clearing autonomous transactions
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-14 opacity-75 dark:opacity-60 grayscale hover:grayscale-0 transition-all duration-300 text-slate-700 dark:text-slate-300">
          <div className="flex items-center space-x-1.5 font-bold text-sm sm:text-base tracking-tight"><span className="text-lg sm:text-xl">Stripe</span></div>
          <div className="flex items-center space-x-1.5 font-bold text-sm sm:text-base tracking-tight"><span className="text-lg sm:text-xl">VISA</span></div>
          <div className="flex items-center space-x-1.5 font-bold text-sm sm:text-base tracking-tight"><span className="text-lg sm:text-xl">Brex</span></div>
          <div className="flex items-center space-x-1.5 font-bold text-sm sm:text-base tracking-tight"><span className="text-lg sm:text-xl">Coinbase</span></div>
          <div className="flex items-center space-x-1.5 font-bold text-sm sm:text-base tracking-tight"><span className="text-lg sm:text-xl">PayPal</span></div>
          <div className="flex items-center space-x-1.5 font-bold text-sm sm:text-base tracking-tight"><span className="text-lg sm:text-xl">Shopify</span></div>
          <div className="flex items-center space-x-1.5 font-bold text-sm sm:text-base tracking-tight"><span className="text-lg sm:text-xl">Anthropic</span></div>
          <div className="flex items-center space-x-1.5 font-bold text-sm sm:text-base tracking-tight"><span className="text-lg sm:text-xl">CrewAI</span></div>
        </div>
      </div>
    </section>
  );
};
