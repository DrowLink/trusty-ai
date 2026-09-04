import React from 'react';
import { DiscoveryStats } from '@/lib/types';
import { Shield, AlertTriangle, Database, Activity } from 'lucide-react';

interface HeroMetricsProps {
  stats: DiscoveryStats;
}

export const HeroMetrics: React.FC<HeroMetricsProps> = ({ stats }) => {
  return (
    <section className="pt-8 sm:pt-12 pb-4 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Title & Mission - Eyebrow eliminated per Impeccable craft floor */}
      <div className="max-w-3xl mb-8">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          Can I trust this AI agent?
        </h1>

        <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl font-sans">
          Independent risk ratings and automated provenance checks before you grant autonomous agents access to your codebase, inbox, credentials, or corporate systems.
        </p>
      </div>

      {/* Unified Telemetry Ribbon - Replaces generic hero-metric card template */}
      <div className="security-card rounded-lg divide-y lg:divide-y-0 divide-x-0 sm:divide-x divide-white/[0.08] grid grid-cols-2 lg:grid-cols-4 overflow-hidden">
        {/* Total Indexed */}
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Agents Indexed</span>
            <Database className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100 tabular-nums">
              {stats.totalAgents}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wide">Live</span>
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-1">Cross-Ecosystem Index</div>
        </div>

        {/* Avg Score */}
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Average Trusty Score</span>
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
              {stats.avgTrustScore}
            </span>
            <span className="text-xs font-mono text-zinc-500">/ 100</span>
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-1">20 Signals Weighted</div>
        </div>

        {/* Critical & High Risk */}
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Critical Threats Neutralized</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-400 tabular-nums">
              {stats.criticalRiskCount + stats.highRiskCount}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
              Quarantined
            </span>
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-1">Circuit Breakers Active</div>
        </div>

        {/* Monitored Ecosystems */}
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Active Crawlers</span>
            <Activity className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-200 tabular-nums">
              3
            </span>
            <span className="text-xs font-mono text-zinc-500">Ecosystems</span>
          </div>
          <div className="text-[10px] text-zinc-400 font-mono mt-1 truncate">GitHub · MCP · Hugging Face</div>
        </div>
      </div>
    </section>
  );
};
