'use client';

import React, { useState } from 'react';
import { AgentWithScore } from '@/lib/types';
import { Search, ChevronRight, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

interface TrustLeaderboardProps {
  agents: AgentWithScore[];
  onSelectAgent: (agent: AgentWithScore) => void;
  isLoading: boolean;
}

export const TrustLeaderboard: React.FC<TrustLeaderboardProps> = ({
  agents,
  onSelectAgent,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedEcosystem, setSelectedEcosystem] = useState('all');
  const [selectedPermission, setSelectedPermission] = useState('all');
  const [sortBy, setSortBy] = useState<'trust' | 'confidence' | 'popularity' | 'recent'>('trust');

  const applyPreset = (preset: string) => {
    if (preset === 'email') {
      setSelectedCategory('all');
      setSelectedPermission('gmail');
      setSortBy('trust');
    } else if (preset === 'finance') {
      setSelectedCategory('finance');
      setSelectedPermission('all');
      setSortBy('trust');
    } else if (preset === 'coding') {
      setSelectedCategory('coding');
      setSelectedPermission('all');
      setSortBy('trust');
    } else if (preset === 'reset') {
      setSearchQuery('');
      setSelectedCategory('all');
      setSelectedRisk('all');
      setSelectedEcosystem('all');
      setSelectedPermission('all');
      setSortBy('trust');
    }
  };

  const filteredAgents = agents.filter(agent => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        agent.name.toLowerCase().includes(q) ||
        agent.publisher.name.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.slug.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedCategory !== 'all' && agent.category !== selectedCategory) {
      return false;
    }

    if (selectedRisk !== 'all' && agent.evaluation.riskTier !== selectedRisk) {
      return false;
    }

    if (selectedEcosystem !== 'all' && agent.sourceEcosystem !== selectedEcosystem) {
      return false;
    }

    if (selectedPermission !== 'all') {
      const hasPerm = agent.requestedPermissions.some(p =>
        p.scope.toLowerCase().includes(selectedPermission.toLowerCase())
      );
      if (!hasPerm) return false;
    }

    return true;
  });

  filteredAgents.sort((a, b) => {
    if (sortBy === 'trust') {
      return b.evaluation.trustyScore - a.evaluation.trustyScore;
    } else if (sortBy === 'confidence') {
      return b.evaluation.confidence - a.evaluation.confidence;
    } else if (sortBy === 'popularity') {
      return (b.starsCount || 0) - (a.starsCount || 0);
    } else if (sortBy === 'recent') {
      return new Date(b.discoveredAt).getTime() - new Date(a.discoveredAt).getTime();
    }
    return 0;
  });

  const getRiskBadge = (tier: string) => {
    switch (tier) {
      case 'LOW_RISK':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            LOW RISK
          </span>
        );
      case 'MEDIUM_RISK':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5" />
            MEDIUM RISK
          </span>
        );
      case 'HIGH_RISK':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold bg-orange-950/80 text-orange-300 border border-orange-800/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-1.5" />
            HIGH RISK
          </span>
        );
      case 'CRITICAL_RISK':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/60 shadow-glow-rose whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5 animate-ping" />
            CRITICAL RISK
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    if (score >= 40) return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header & Vision Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
              Global Trust Leaderboard
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {filteredAgents.length} Agents
            </span>
          </div>
          <p className="text-[11px] sm:text-sm text-slate-400 mt-0.5 sm:mt-1">
            Real-time reputation ranking evaluated across 20 cryptographic and behavioral signals.
          </p>
        </div>

        {/* Consumer Preset Inquiries - Touch Scrollable on Mobile */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar -mx-1 px-1">
          <span className="text-slate-500 text-[11px] mr-1 hidden xl:inline flex-shrink-0">Inquiries:</span>
          <button
            onClick={() => applyPreset('email')}
            className={`px-2.5 py-1 rounded-full border transition flex-shrink-0 text-[11px] ${
              selectedPermission === 'gmail'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:border-slate-500'
            }`}
          >
            📧 Email
          </button>
          <button
            onClick={() => applyPreset('finance')}
            className={`px-2.5 py-1 rounded-full border transition flex-shrink-0 text-[11px] ${
              selectedCategory === 'finance'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:border-slate-500'
            }`}
          >
            💰 Finance
          </button>
          <button
            onClick={() => applyPreset('coding')}
            className={`px-2.5 py-1 rounded-full border transition flex-shrink-0 text-[11px] ${
              selectedCategory === 'coding'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:border-slate-500'
            }`}
          >
            💻 Coding
          </button>
          {(selectedCategory !== 'all' || selectedPermission !== 'all' || selectedRisk !== 'all' || searchQuery) && (
            <button
              onClick={() => applyPreset('reset')}
              className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 hover:text-white text-[10px] flex-shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-3 sm:p-4 rounded-xl border border-slate-800 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search agent name, author, or slug..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Categories</option>
              <option value="coding">Coding</option>
              <option value="productivity">Productivity</option>
              <option value="research">Research</option>
              <option value="finance">Finance</option>
              <option value="sysadmin">System Admin</option>
              <option value="sales_marketing">Sales / Marketing</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={selectedRisk}
              onChange={e => setSelectedRisk(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="LOW_RISK">Low Risk 🟢</option>
              <option value="MEDIUM_RISK">Medium Risk 🟡</option>
              <option value="HIGH_RISK">High Risk 🟠</option>
              <option value="CRITICAL_RISK">Critical Risk 🔴</option>
            </select>
          </div>

          {/* Ecosystem Filter */}
          <div>
            <select
              value={selectedEcosystem}
              onChange={e => setSelectedEcosystem(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Sources</option>
              <option value="github">GitHub</option>
              <option value="mcp_registry">MCP Registry</option>
              <option value="agent_marketplace">Marketplaces</option>
              <option value="manual_scan">Manual Scans</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-sky-400 font-medium focus:outline-none focus:border-sky-500"
            >
              <option value="trust">Sort: TRUSTY Score</option>
              <option value="confidence">Sort: Confidence %</option>
              <option value="popularity">Sort: Popularity / Stars</option>
              <option value="recent">Sort: Most Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW: Stacked Cards (visible on < md screens) */}
      <div className="block md:hidden space-y-3">
        {filteredAgents.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-500 text-xs rounded-xl">
            No agents match current filters. Try resetting.
          </div>
        ) : (
          filteredAgents.map((agent, index) => {
            const rank = index + 1;
            const score = agent.evaluation.trustyScore;

            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(agent)}
                className="glass-panel p-3.5 rounded-xl border border-slate-800 active:scale-[0.99] transition cursor-pointer"
              >
                {/* Header: Rank + Name + Score */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-mono font-bold flex-shrink-0 ${
                      rank === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      rank === 2 ? 'bg-slate-300/20 text-slate-200 border border-slate-400/40' :
                      rank === 3 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40' :
                      'text-slate-400 bg-slate-900 border border-slate-800'
                    }`}>
                      #{rank}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-white text-xs truncate flex items-center space-x-1.5">
                        <span className="truncate">{agent.name}</span>
                        {agent.evaluation.overrideApplied && (
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        by {agent.publisher.name}
                        {agent.publisher.verifiedDomain && (
                          <span className="ml-1 text-sky-400">✓ Verified</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-end flex-shrink-0">
                    <div className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${getScoreColor(score)}`}>
                      {score} <span className="text-[9px] opacity-70">/100</span>
                    </div>
                    <div className="mt-1">
                      {getRiskBadge(agent.evaluation.riskTier)}
                    </div>
                  </div>
                </div>

                {/* Ecosystem & Permissions */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-slate-900 border border-slate-700 text-slate-300">
                    {agent.sourceEcosystem.replace('_', ' ')}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-sky-300 bg-sky-950/60 border border-sky-800">
                    {agent.framework.toUpperCase()}
                  </span>
                  {agent.requestedPermissions.slice(0, 2).map((perm, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900 text-slate-400 border border-slate-800"
                    >
                      {perm.scope}
                    </span>
                  ))}
                  {agent.requestedPermissions.length > 2 && (
                    <span className="text-[9px] text-slate-500">
                      +{agent.requestedPermissions.length - 2}
                    </span>
                  )}
                </div>

                {/* Footer bar with Confidence & CTA */}
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <div className="flex items-center space-x-1.5">
                    <span>Confidence: {agent.evaluation.confidence}%</span>
                  </div>
                  <span className="text-sky-400 flex items-center space-x-0.5">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP VIEW: High-density Table (visible on >= md screens) */}
      <div className="hidden md:block glass-panel rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-16">Rank</th>
                <th className="py-3.5 px-4">Agent & Publisher</th>
                <th className="py-3.5 px-4">Source & Framework</th>
                <th className="py-3.5 px-4">Requested Permissions</th>
                <th className="py-3.5 px-4 text-center">Confidence</th>
                <th className="py-3.5 px-4 text-center">TRUSTY Score</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No agents match current filters. Try resetting the search or filters.
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent, index) => {
                  const rank = index + 1;
                  const score = agent.evaluation.trustyScore;

                  return (
                    <tr
                      key={agent.id}
                      onClick={() => onSelectAgent(agent)}
                      className="hover:bg-slate-800/40 cursor-pointer transition group"
                    >
                      <td className="py-4 px-4 font-mono font-bold text-slate-400">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md ${
                          rank === 1 ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                          rank === 2 ? 'bg-slate-300/10 text-slate-200 border border-slate-400/30' :
                          rank === 3 ? 'bg-amber-700/10 text-amber-500 border border-amber-700/30' :
                          'text-slate-500'
                        }`}>
                          #{rank}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-white group-hover:text-sky-300 transition flex items-center space-x-2">
                          <span>{agent.name}</span>
                          {agent.evaluation.overrideApplied && (
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 inline flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                          <span>by {agent.publisher.name}</span>
                          {agent.publisher.verifiedDomain && (
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] bg-sky-950 text-sky-400 border border-sky-800">
                              ✓ Verified Org
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-col space-y-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-900 border border-slate-700 text-slate-300 w-max">
                            {agent.sourceEcosystem.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {agent.framework.toUpperCase()}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {agent.requestedPermissions.slice(0, 3).map((perm, pIdx) => (
                            <span
                              key={pIdx}
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono ${
                                perm.sensitivity === 'critical'
                                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                                  : perm.sensitivity === 'high'
                                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                                  : 'bg-slate-900 text-slate-300 border border-slate-800'
                              }`}
                            >
                              {perm.scope}
                            </span>
                          ))}
                          {agent.requestedPermissions.length > 3 && (
                            <span className="text-[10px] text-slate-500 self-center">
                              +{agent.requestedPermissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center font-mono">
                        <div className="text-slate-300 font-semibold">{agent.evaluation.confidence}%</div>
                        <div className="w-16 h-1 bg-slate-800 rounded-full mx-auto mt-1 overflow-hidden">
                          <div
                            className="h-full bg-sky-400 rounded-full"
                            style={{ width: `${agent.evaluation.confidence}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <div className={`text-base font-bold font-mono px-3 py-1 rounded-lg border ${getScoreColor(score)}`}>
                            {score} <span className="text-[10px] opacity-70">/100</span>
                          </div>
                          <div className="mt-1">
                            {getRiskBadge(agent.evaluation.riskTier)}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAgent(agent);
                          }}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-sky-400 hover:text-white bg-sky-500/10 hover:bg-sky-500 border border-sky-500/30 transition group-hover:border-sky-400"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
