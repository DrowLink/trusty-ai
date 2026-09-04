import React from 'react';
import { DiscoveryStats } from '@/lib/types';
import { Shield, AlertTriangle, Database, Activity } from 'lucide-react';

interface HeroMetricsProps {
  stats: DiscoveryStats;
}

export const HeroMetrics: React.FC<HeroMetricsProps> = ({ stats }) => {
  return (
    <section className="pt-6 sm:pt-10 pb-4 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Title & Mission */}
      <div className="max-w-3xl mb-6 sm:mb-8">
        <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-zinc-900 border border-white/[0.08] text-[10px] sm:text-xs font-mono text-zinc-400 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>INDEPENDENT TRUST & REPUTATION LAYER FOR AI AGENTS</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-100 font-sans leading-tight">
          Before clicking <span className="font-mono text-emerald-400 uppercase tracking-normal">“START AGENT”</span>,
          <br className="hidden sm:inline" /> ask: <span className="text-zinc-400 italic">Can I trust this agent?</span>
        </h1>

        <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl font-sans">
          Automated multi-source discovery across open ecosystems. Deterministic, explainable 
          <strong className="text-zinc-200 font-medium"> 0–100 TRUSTY Scores </strong> 
          evaluating identity, permission scope, sandbox containment, and historical incident signals.
        </p>
      </div>

      {/* Institutional Telemetry Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 security-card rounded-lg divide-y lg:divide-y-0 divide-x-0 sm:divide-x divide-white/[0.08] overflow-hidden">
        {/* Total Indexed */}
        <div className="p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Indexed Agents</span>
            <Database className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100 tabular-nums">
              {stats.totalAgents}
            </span>
            <span className="text-[11px] font-mono text-emerald-400">Live</span>
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-1">Cross-Ecosystem Index</div>
        </div>

        {/* Avg Score */}
        <div className="p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Avg Trust Score</span>
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
              {stats.avgTrustScore}
            </span>
            <span className="text-xs font-mono text-zinc-500">/100</span>
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-1">Weighted 20 Signals</div>
        </div>

        {/* Critical & High Risk */}
        <div className="p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">High Risk / Malicious</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-400 tabular-nums">
              {stats.criticalRiskCount + stats.highRiskCount}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60">
              Quarantined
            </span>
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-1">Circuit Breakers Active</div>
        </div>

        {/* Monitored Ecosystems */}
        <div className="p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Ecosystem Crawlers</span>
            <Activity className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-200 tabular-nums">
              3
            </span>
            <span className="text-xs font-mono text-zinc-500">Sources Active</span>
          </div>
          <div className="text-[10px] text-zinc-400 font-mono mt-1 truncate">GitHub · MCP · HuggingFace</div>
        </div>
      </div>
    </section>
  );
};
