'use client';

import React, { useState } from 'react';
import { DiscoveryStats } from '@/lib/types';
import { Shield, AlertTriangle, Database, Activity, Search, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

import { UserSession } from '@/lib/quota';
import { AgentWithScore } from '@/lib/types';
import { X, ExternalLink, ChevronRight, Sparkles, Loader2 } from 'lucide-react';

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

  // Matching suggestions from indexed agents
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
      // If user presses Enter with suggestions, select first or selected
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

  const lowRiskPct = stats.totalAgents > 0 ? Math.round((stats.lowRiskCount / stats.totalAgents) * 100) : 0;
  const medRiskPct = stats.totalAgents > 0 ? Math.round((stats.mediumRiskCount / stats.totalAgents) * 100) : 0;
  const critRiskPct = stats.totalAgents > 0 ? Math.round(((stats.criticalRiskCount + stats.highRiskCount) / stats.totalAgents) * 100) : 0;

  return (
    <section className="pt-6 sm:pt-10 pb-6 px-3 sm:px-6 max-w-7xl mx-auto border-b border-slate-800/80">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Column (7 cols on desktop, 12 on mobile): Mission & Universal Omnibox */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-sky-300 font-semibold">TRUSTY.BOT</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Agent Risk &amp; Credit Infrastructure</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-sans">
            The trust &amp; credit bureau <br />
            <span className="text-sky-400">for AI agents.</span>
          </h1>

          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-xl">
            Before an agent gets your <strong className="text-sky-400">data</strong>, <strong className="text-purple-400">permissions</strong>, or <strong className="text-emerald-400">money</strong> — ask TRUSTY.
          </p>

          {/* The 5 Pillars Strip from Slide 1 & 10 */}
          <div className="mt-4 p-2.5 rounded-xl bg-[#090d16] border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono">
            <div className="flex flex-col">
              <span className="text-slate-400 uppercase font-semibold">IDENTITY</span>
              <span className="text-slate-200 font-medium">Who is it?</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">&rarr;</span>
            <div className="flex flex-col">
              <span className="text-emerald-400 uppercase font-semibold">TRUST</span>
              <span className="text-slate-200 font-medium">Can I trust it?</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">&rarr;</span>
            <div className="flex flex-col">
              <span className="text-purple-400 uppercase font-semibold">CREDIT</span>
              <span className="text-slate-200 font-medium">How risky?</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">&rarr;</span>
            <div className="flex flex-col">
              <span className="text-sky-400 uppercase font-semibold">CAPACITY</span>
              <span className="text-slate-200 font-medium">How much?</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">&rarr;</span>
            <div className="flex flex-col">
              <span className="text-amber-400 uppercase font-semibold">AUTHORIZATION</span>
              <span className="text-slate-200 font-medium">Allow now?</span>
            </div>
          </div>

          {/* Universal Hero Omnibox with Autocomplete & Direct Audit */}
          <div className="relative mt-4 sm:mt-5 max-w-xl">
            <form onSubmit={handleSubmit}>
              <div className={`relative flex items-center rounded-xl bg-slate-900/95 border transition shadow-2xl p-1.5 ${
                isFocused ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-sky-500/10' : 'border-slate-700/70 hover:border-slate-600'
              }`}>
                <Search className="w-4 h-4 text-slate-400 ml-2.5 sm:ml-3 flex-shrink-0" />
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
                  placeholder="Search agent name or paste GitHub repo URL..."
                  className="w-full px-2.5 sm:px-3 py-2 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none font-sans"
                />

                {/* Clear button if text exists */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      onSearchChange('');
                      setSelectedIndex(-1);
                    }}
                    className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition mr-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Direct Action Button */}
                <button
                  type="submit"
                  disabled={isAuditing}
                  className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex-shrink-0 shadow-sm bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-sky-950 disabled:opacity-50"
                >
                  {isAuditing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span className="hidden xs:inline">Auditing...</span>
                    </>
                  ) : (
                    <>
                      <span>{isInputUrl ? 'Audit Repo' : 'Search'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Instant Autocomplete Suggestions Dropdown */}
            {isFocused && matchingAgents.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl bg-[#0d131f] border border-slate-700 shadow-2xl z-30 overflow-hidden font-sans divide-y divide-slate-800">
                <div className="px-3 py-1.5 bg-zinc-950/90 text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Matching Indexed Agents ({matchingAgents.length})</span>
                  <span className="text-zinc-600">Press Enter or click to inspect</span>
                </div>
                {matchingAgents.map((agent, index) => {
                  const isSelected = index === selectedIndex;
                  const score = agent.evaluation.trustyScore;
                  const isLowRisk = score >= 80;
                  const isMedRisk = score >= 60 && score < 80;

                  return (
                    <div
                      key={agent.id}
                      onMouseDown={() => {
                        onSelectAgent(agent);
                        setIsFocused(false);
                      }}
                      className={`p-3 flex items-center justify-between cursor-pointer transition ${
                        isSelected ? 'bg-zinc-800/80' : 'hover:bg-zinc-900/90'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          isLowRisk ? 'bg-emerald-400' : isMedRisk ? 'bg-amber-400' : 'bg-rose-400'
                        }`} />
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-zinc-100 truncate">
                              {agent.name}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500 px-1.5 py-0.2 rounded bg-zinc-900 border border-white/[0.06]">
                              {agent.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate">
                            by {agent.publisher.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5 flex-shrink-0">
                        <div className="text-right">
                          <span className={`text-xs font-mono font-bold ${
                            isLowRisk ? 'text-emerald-400' : isMedRisk ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {score}/100
                          </span>
                          <span className="block text-[9px] font-mono text-zinc-500 uppercase">
                            {agent.evaluation.riskTier.replace('_', ' ')}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* URL Detection Helper Notice */}
            {isFocused && isInputUrl && (
              <div className="absolute top-full left-0 right-0 mt-1.5 p-2.5 rounded-lg bg-emerald-950/90 border border-emerald-800/80 text-emerald-300 text-xs font-mono shadow-2xl z-30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Repository link detected. Press <strong>Enter</strong> or click &ldquo;Audit&rdquo; to scan.</span>
                </div>
              </div>
            )}

            {/* Quick Presets / Try links */}
            <div className="flex items-center space-x-1.5 mt-2.5 text-[11px] text-slate-500 font-mono overflow-x-auto no-scrollbar py-0.5">
              <span className="flex-shrink-0 text-slate-400">Try:</span>
              <button
                type="button"
                onClick={() => {
                  onSearchChange('https://github.com/crewAIInc/crewAI');
                  onAuditUrl('https://github.com/crewAIInc/crewAI');
                }}
                className="text-slate-300 hover:text-sky-300 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-sky-500/30 flex-shrink-0 transition"
              >
                crewAI
              </button>
              <button
                type="button"
                onClick={() => {
                  onSearchChange('https://github.com/browser-use/browser-use');
                  onAuditUrl('https://github.com/browser-use/browser-use');
                }}
                className="text-slate-300 hover:text-sky-300 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-sky-500/30 flex-shrink-0 transition"
              >
                browser-use
              </button>
              <button
                type="button"
                onClick={() => {
                  onSearchChange('Git');
                }}
                className="text-slate-300 hover:text-sky-300 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-sky-500/30 flex-shrink-0 transition"
              >
                Filter &ldquo;Git&rdquo;
              </button>
            </div>

            {/* VirusTotal Quota indicator */}
            {session && !session.isAuthenticated && (
              <div className="mt-2.5 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono">
                <div className="flex items-center space-x-1.5 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span>
                    Quota:{' '}
                    <strong className={session.queriesRemaining <= 2 ? 'text-rose-400' : 'text-slate-200'}>
                      {session.queriesRemaining}/10
                    </strong>{' '}
                    free
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="text-sky-400 hover:text-sky-300 font-medium transition"
                >
                  {session.queriesRemaining <= 0 ? 'Authenticate' : 'Unlock unlimited'}
                </button>
              </div>
            )}

            {/* Mobile-only compact telemetry pill bar (clean like VirusTotal) */}
            <div className="lg:hidden mt-3 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-200 font-semibold">{stats.totalAgents} Agents Monitored</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px]">
                <span className="text-emerald-400 font-medium">{stats.lowRiskCount} Safe</span>
                <span className="text-slate-600">•</span>
                <span className="text-rose-400 font-medium">{stats.criticalRiskCount + stats.highRiskCount} Flagged</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Real-time Risk Distribution Radar (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-5">
          <div className="security-card p-4 sm:p-5 rounded-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold uppercase text-slate-200">Ecosystem Risk Radar</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tabular-nums">
                {stats.totalAgents} Agents Monitored
              </span>
            </div>

            {/* Visual Risk Distribution Bar */}
            <div className="space-y-3">
              {/* Segmented spectrum bar */}
              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <span>Trust Distribution</span>
                  <span className="text-slate-400">Benchmark: {stats.avgTrustScore}/100</span>
                </div>
                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
                  <div style={{ width: `${lowRiskPct}%` }} className="bg-emerald-500 rounded-l-full" title={`Low Risk: ${stats.lowRiskCount}`} />
                  <div style={{ width: `${medRiskPct}%` }} className="bg-amber-500" title={`Medium Risk: ${stats.mediumRiskCount}`} />
                  <div style={{ width: `${critRiskPct}%` }} className="bg-rose-500 rounded-r-full" title={`Critical: ${stats.criticalRiskCount + stats.highRiskCount}`} />
                </div>
              </div>

              {/* Breakdown Matrix */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                <div className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800/80">
                  <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums leading-none">
                    {stats.lowRiskCount}
                  </div>
                  <div className="text-[10px] font-mono text-slate-300 mt-1.5 font-medium">Low Risk</div>
                  <div className="text-[9px] text-slate-500 font-mono">80–100</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800/80">
                  <div className="text-lg font-bold font-mono text-amber-400 tabular-nums leading-none">
                    {stats.mediumRiskCount}
                  </div>
                  <div className="text-[10px] font-mono text-slate-300 mt-1.5 font-medium">Elevated</div>
                  <div className="text-[9px] text-slate-500 font-mono">60–79</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800/80">
                  <div className="text-lg font-bold font-mono text-rose-400 tabular-nums leading-none">
                    {stats.criticalRiskCount + stats.highRiskCount}
                  </div>
                  <div className="text-[10px] font-mono text-rose-300 mt-1.5 font-medium">Quarantine</div>
                  <div className="text-[9px] text-rose-400/70 font-mono">0–59</div>
                </div>
              </div>

              {/* Crawler Telemetry line */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  <span>3 Crawlers Connected:</span>
                </span>
                <span className="text-slate-300">GitHub · NPM · HuggingFace</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
