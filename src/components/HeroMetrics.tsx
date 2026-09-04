'use client';

import React, { useState } from 'react';
import { DiscoveryStats } from '@/lib/types';
import { Shield, AlertTriangle, Database, Activity, Search, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

import { UserSession } from '@/lib/quota';

interface HeroMetricsProps {
  stats: DiscoveryStats;
  onAuditUrl: (url: string) => void;
  isAuditing?: boolean;
  session?: UserSession;
  onOpenAuth?: () => void;
}

export const HeroMetrics: React.FC<HeroMetricsProps> = ({
  stats,
  onAuditUrl,
  isAuditing,
  session,
  onOpenAuth,
}) => {
  const [inputUrl, setInputUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onAuditUrl(inputUrl.trim());
    }
  };

  const lowRiskPct = stats.totalAgents > 0 ? Math.round((stats.lowRiskCount / stats.totalAgents) * 100) : 0;
  const medRiskPct = stats.totalAgents > 0 ? Math.round((stats.mediumRiskCount / stats.totalAgents) * 100) : 0;
  const critRiskPct = stats.totalAgents > 0 ? Math.round(((stats.criticalRiskCount + stats.highRiskCount) / stats.totalAgents) * 100) : 0;

  return (
    <section className="pt-6 sm:pt-10 pb-6 px-3 sm:px-6 max-w-7xl mx-auto border-b border-white/[0.08]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Column (7 cols): Mission & Instant Scan Bar */}
        <div className="lg:col-span-7">
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-wider font-semibold text-zinc-300">TRUSTY.ai Security Intelligence</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">VirusTotal for AI Agents</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-sans">
            Can I trust this agent with my data?
          </h1>

          <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-sans max-w-xl">
            Evaluate permission boundaries, identity provenance, and sandbox security before authorizing an agent to access your GitHub, inbox, databases, or terminal.
          </p>

          {/* Instant Audit Input Bar right in the Hero */}
          <form onSubmit={handleSubmit} className="mt-5 max-w-xl">
            <div className="relative flex items-center rounded-lg bg-zinc-950 border border-white/[0.14] focus-within:border-emerald-500 transition shadow-lg p-1">
              <Search className="w-4 h-4 text-zinc-500 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                placeholder="Paste any GitHub repository URL (e.g. crewAIInc/crewAI)..."
                className="w-full px-3 py-2 bg-transparent text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={isAuditing || !inputUrl.trim()}
                className="flex items-center space-x-1.5 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-mono font-medium disabled:opacity-40 transition flex-shrink-0"
              >
                <span>{isAuditing ? 'Scanning...' : 'Audit Live'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-zinc-500 font-mono">
              <span>Try:</span>
              <button
                type="button"
                onClick={() => { setInputUrl('https://github.com/crewAIInc/crewAI'); onAuditUrl('https://github.com/crewAIInc/crewAI'); }}
                className="text-zinc-400 hover:text-emerald-400 underline decoration-zinc-700 underline-offset-2"
              >
                crewAIInc/crewAI
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => { setInputUrl('https://github.com/anthropics/anthropic-quickstarts'); onAuditUrl('https://github.com/anthropics/anthropic-quickstarts'); }}
                className="text-zinc-400 hover:text-emerald-400 underline decoration-zinc-700 underline-offset-2"
              >
                anthropics/quickstarts
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => { setInputUrl('https://github.com/DrowLink/trusty-ai'); onAuditUrl('https://github.com/DrowLink/trusty-ai'); }}
                className="text-zinc-400 hover:text-emerald-400 underline decoration-zinc-700 underline-offset-2"
              >
                DrowLink/trusty-ai
              </button>
            </div>

            {/* VirusTotal Quota indicator */}
            {session && (
              <div className="mt-3.5 flex items-center justify-between p-2.5 rounded bg-zinc-950/80 border border-white/[0.08] text-[11px] font-mono">
                {session.isAuthenticated ? (
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Authenticated Session ({session.email}) • <strong className="text-white font-semibold">Unlimited Inspections</strong></span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-zinc-400">
                        Anonymous Quota:{' '}
                        <strong className={session.queriesRemaining <= 2 ? 'text-rose-400' : 'text-zinc-200'}>
                          {session.queriesRemaining}/10
                        </strong>{' '}
                        free scans remaining
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-800 underline-offset-2 ml-2 flex-shrink-0 font-medium"
                    >
                      {session.queriesRemaining <= 0 ? 'Authenticate to unlock' : 'Unlock unlimited'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Right Column (5 cols): Real-time Risk Distribution Radar */}
        <div className="lg:col-span-5">
          <div className="security-card p-4 sm:p-5 rounded-lg">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold uppercase text-zinc-200">Ecosystem Risk Radar</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tabular-nums">
                {stats.totalAgents} Agents Monitored
              </span>
            </div>

            {/* Visual Risk Distribution Bar */}
            <div className="space-y-3">
              {/* Segmented spectrum bar */}
              <div>
                <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
                  <span>Trust Distribution</span>
                  <span className="text-zinc-500">Benchmark: {stats.avgTrustScore}/100</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden flex">
                  <div style={{ width: `${lowRiskPct}%` }} className="bg-emerald-500" title={`Low Risk: ${stats.lowRiskCount}`} />
                  <div style={{ width: `${medRiskPct}%` }} className="bg-amber-500" title={`Medium Risk: ${stats.mediumRiskCount}`} />
                  <div style={{ width: `${critRiskPct}%` }} className="bg-rose-500" title={`Critical: ${stats.criticalRiskCount + stats.highRiskCount}`} />
                </div>
              </div>

              {/* Breakdown Matrix */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-center">
                <div className="p-2 rounded bg-zinc-950 border border-white/[0.06]">
                  <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums leading-none">
                    {stats.lowRiskCount}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-1">Low Risk</div>
                  <div className="text-[9px] text-zinc-600 font-mono">80–100</div>
                </div>

                <div className="p-2 rounded bg-zinc-950 border border-white/[0.06]">
                  <div className="text-lg font-bold font-mono text-amber-400 tabular-nums leading-none">
                    {stats.mediumRiskCount}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-1">Elevated</div>
                  <div className="text-[9px] text-zinc-600 font-mono">60–79</div>
                </div>

                <div className="p-2 rounded bg-zinc-950 border border-white/[0.06]">
                  <div className="text-lg font-bold font-mono text-rose-400 tabular-nums leading-none">
                    {stats.criticalRiskCount + stats.highRiskCount}
                  </div>
                  <div className="text-[10px] font-mono text-rose-400 mt-1">Quarantine</div>
                  <div className="text-[9px] text-rose-500/70 font-mono">0–59</div>
                </div>
              </div>

              {/* Crawler Telemetry line */}
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/[0.06]">
                <span className="flex items-center space-x-1">
                  <Activity className="w-3 h-3 text-zinc-400" />
                  <span>3 Crawlers Connected:</span>
                </span>
                <span className="text-zinc-400">GitHub · NPM · HuggingFace</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
