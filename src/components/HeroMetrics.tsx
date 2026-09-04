import React from 'react';
import { DiscoveryStats } from '@/lib/types';
import { Shield, AlertTriangle, Cpu, Globe2 } from 'lucide-react';

interface HeroMetricsProps {
  stats: DiscoveryStats;
}

export const HeroMetrics: React.FC<HeroMetricsProps> = ({ stats }) => {
  return (
    <div className="relative pt-6 pb-4">
      {/* Background radial gradient accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-48 bg-sky-500/5 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 text-xs font-mono mb-4">
          <span className="text-sky-400">●</span>
          <span>Independent Trust & Reputation Layer for the Agentic Internet</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Before clicking <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">“START AGENT”</span>,
          <br className="hidden sm:inline" /> ask: <span className="italic underline decoration-sky-500/40">Can I trust it?</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Continuous discovery across open agent ecosystems. Deterministic, explainable 
          <strong className="text-slate-200"> 0–100 TRUSTY Scores </strong> 
          evaluating identity, permissions, security, and governance.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
        {/* Total Indexed */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">{stats.totalAgents}</div>
            <div className="text-xs text-slate-400 font-medium">Agents Indexed</div>
          </div>
        </div>

        {/* Avg Trust Score */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {stats.avgTrustScore}<span className="text-xs text-slate-500 font-normal">/100</span>
            </div>
            <div className="text-xs text-slate-400 font-medium">Avg TRUSTY Score</div>
          </div>
        </div>

        {/* Critical & High Risk */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-rose-400">
              {stats.criticalRiskCount + stats.highRiskCount}
            </div>
            <div className="text-xs text-slate-400 font-medium">High / Critical Risks</div>
          </div>
        </div>

        {/* Ecosystems Active */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-purple-300">
              3 Sources
            </div>
            <div className="text-xs text-slate-400 font-medium">GitHub · MCP · Market</div>
          </div>
        </div>
      </div>
    </div>
  );
};
