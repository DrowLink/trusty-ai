import React from 'react';
import { DiscoveryStats } from '@/lib/types';
import { Shield, AlertTriangle, Cpu, Globe2 } from 'lucide-react';

interface HeroMetricsProps {
  stats: DiscoveryStats;
}

export const HeroMetrics: React.FC<HeroMetricsProps> = ({ stats }) => {
  return (
    <div className="relative pt-4 sm:pt-6 pb-2 sm:pb-4 px-3 sm:px-6">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-48 bg-sky-500/5 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 text-[10px] sm:text-xs font-mono mb-3 sm:mb-4">
          <span className="text-sky-400">●</span>
          <span>Trust & Reputation Layer for the Agentic Internet</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Before clicking <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">“START AGENT”</span>,
          <br /> ask: <span className="italic underline decoration-sky-500/40">Can I trust it?</span>
        </h1>
        <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-slate-400 max-w-2xl mx-auto px-2">
          Continuous discovery across open agent ecosystems. Deterministic, explainable 
          <strong className="text-slate-200 font-semibold"> 0–100 TRUSTY Scores </strong> 
          evaluating identity, permissions, security, and governance.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 max-w-5xl mx-auto">
        {/* Total Indexed */}
        <div className="glass-panel p-3 sm:p-4 rounded-xl border border-slate-800 flex items-center space-x-2.5 sm:space-x-3.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 flex-shrink-0">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-2xl font-bold font-mono text-white leading-none">{stats.totalAgents}</div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1 truncate">Agents Indexed</div>
          </div>
        </div>

        {/* Avg Trust Score */}
        <div className="glass-panel p-3 sm:p-4 rounded-xl border border-slate-800 flex items-center space-x-2.5 sm:space-x-3.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-2xl font-bold font-mono text-emerald-400 leading-none">
              {stats.avgTrustScore}<span className="text-[10px] sm:text-xs text-slate-500 font-normal">/100</span>
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1 truncate">Avg TRUSTY Score</div>
          </div>
        </div>

        {/* Critical & High Risk */}
        <div className="glass-panel p-3 sm:p-4 rounded-xl border border-slate-800 flex items-center space-x-2.5 sm:space-x-3.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-2xl font-bold font-mono text-rose-400 leading-none">
              {stats.criticalRiskCount + stats.highRiskCount}
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1 truncate">High/Critical Risks</div>
          </div>
        </div>

        {/* Ecosystems Active */}
        <div className="glass-panel p-3 sm:p-4 rounded-xl border border-slate-800 flex items-center space-x-2.5 sm:space-x-3.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
            <Globe2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-2xl font-bold font-mono text-purple-300 leading-none">
              3 Sources
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1 truncate">GitHub·MCP·Market</div>
          </div>
        </div>
      </div>
    </div>
  );
};
