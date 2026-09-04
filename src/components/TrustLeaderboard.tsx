'use client';

import React, { useState } from 'react';
import { AgentWithScore } from '@/lib/types';
import { Search, ChevronRight, ShieldAlert, Shield, ArrowUpRight } from 'lucide-react';

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
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
            LOW RISK
          </span>
        );
      case 'MEDIUM_RISK':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-950/60 text-amber-300 border border-amber-800/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5" />
            MEDIUM RISK
          </span>
        );
      case 'HIGH_RISK':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-orange-950/60 text-orange-300 border border-orange-800/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-1.5" />
            HIGH RISK
          </span>
        );
      case 'CRITICAL_RISK':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-rose-950/80 text-rose-300 border border-rose-800 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5 animate-pulse" />
            CRITICAL RISK
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-800/60 bg-emerald-950/30';
    if (score >= 60) return 'text-amber-400 border-amber-800/60 bg-amber-950/30';
    if (score >= 40) return 'text-orange-400 border-orange-800/60 bg-orange-950/30';
    return 'text-rose-400 border-rose-800 bg-rose-950/50';
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header & Preset Inquiries */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-xl font-bold tracking-tight text-white font-mono">
              Global Trust Leaderboard
            </h2>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-white/[0.08] text-zinc-400">
              {filteredAgents.length} Agents
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 font-sans">
            Independent evaluations across 20 cryptographic and behavioral signals.
          </p>
        </div>

        {/* Preset Questions from challenge */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar -mx-1 px-1">
          <span className="text-zinc-500 text-[10px] font-mono mr-1 hidden xl:inline flex-shrink-0">
            QUICK INQUIRIES:
          </span>
          <button
            onClick={() => applyPreset('email')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition flex-shrink-0 border ${
              selectedPermission === 'gmail'
                ? 'bg-zinc-800 text-white border-white/[0.2]'
                : 'bg-zinc-900 text-zinc-400 border-white/[0.06] hover:text-zinc-200'
            }`}
          >
            Email Agents
          </button>
          <button
            onClick={() => applyPreset('finance')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition flex-shrink-0 border ${
              selectedCategory === 'finance'
                ? 'bg-zinc-800 text-white border-white/[0.2]'
                : 'bg-zinc-900 text-zinc-400 border-white/[0.06] hover:text-zinc-200'
            }`}
          >
            Financial Agents
          </button>
          <button
            onClick={() => applyPreset('coding')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition flex-shrink-0 border ${
              selectedCategory === 'coding'
                ? 'bg-zinc-800 text-white border-white/[0.2]'
                : 'bg-zinc-900 text-zinc-400 border-white/[0.06] hover:text-zinc-200'
            }`}
          >
            Coding & MCP
          </button>
          {(selectedCategory !== 'all' || selectedPermission !== 'all' || selectedRisk !== 'all' || searchQuery) && (
            <button
              onClick={() => applyPreset('reset')}
              className="px-2 py-1 rounded bg-zinc-900 text-zinc-500 hover:text-zinc-300 text-[10px] font-mono border border-white/[0.06] flex-shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Control Strip (Search & Filters) */}
      <div className="security-card p-2.5 sm:p-3 rounded-lg mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by agent name, author, or scope..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-white/[0.08] rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-sans"
            />
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-1.5 bg-zinc-950 border border-white/[0.08] rounded text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 font-mono"
            >
              <option value="all">Category: All</option>
              <option value="coding">Coding</option>
              <option value="productivity">Productivity</option>
              <option value="research">Research</option>
              <option value="finance">Finance</option>
              <option value="sysadmin">System Admin</option>
              <option value="sales_marketing">Sales / Marketing</option>
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <select
              value={selectedRisk}
              onChange={e => setSelectedRisk(e.target.value)}
              className="w-full px-2 py-1.5 bg-zinc-950 border border-white/[0.08] rounded text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 font-mono"
            >
              <option value="all">Risk: All Tiers</option>
              <option value="LOW_RISK">Low Risk</option>
              <option value="MEDIUM_RISK">Medium Risk</option>
              <option value="HIGH_RISK">High Risk</option>
              <option value="CRITICAL_RISK">Critical Risk</option>
            </select>
          </div>

          {/* Ecosystem */}
          <div>
            <select
              value={selectedEcosystem}
              onChange={e => setSelectedEcosystem(e.target.value)}
              className="w-full px-2 py-1.5 bg-zinc-950 border border-white/[0.08] rounded text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 font-mono"
            >
              <option value="all">Source: All</option>
              <option value="github">GitHub</option>
              <option value="mcp_registry">MCP Registry</option>
              <option value="agent_marketplace">Marketplaces</option>
              <option value="manual_scan">Manual Scans</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-2 py-1.5 bg-zinc-950 border border-white/[0.08] rounded text-xs text-zinc-200 font-mono focus:outline-none focus:border-zinc-500"
            >
              <option value="trust">Sort: Trust Score</option>
              <option value="confidence">Sort: Confidence %</option>
              <option value="popularity">Sort: Stars / Users</option>
              <option value="recent">Sort: Most Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW: Stacked Cards */}
      <div className="block md:hidden space-y-2.5">
        {filteredAgents.length === 0 ? (
          <div className="security-card p-6 text-center text-zinc-500 text-xs rounded-lg font-mono">
            No agents match active filters.
          </div>
        ) : (
          filteredAgents.map((agent, index) => {
            const rank = index + 1;
            const score = agent.evaluation.trustyScore;

            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(agent)}
                className="security-card-interactive p-3 rounded-lg cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="w-5 h-5 rounded bg-zinc-900 border border-white/[0.08] text-[10px] font-mono font-bold text-zinc-400 flex items-center justify-center flex-shrink-0">
                      #{rank}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-zinc-100 text-xs truncate flex items-center space-x-1.5">
                        <span className="truncate">{agent.name}</span>
                        {agent.evaluation.overrideApplied && (
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate font-mono mt-0.5">
                        {agent.publisher.name}
                        {agent.publisher.verifiedDomain && (
                          <span className="ml-1 text-emerald-400 font-sans">✓ Org</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-end flex-shrink-0">
                    <div className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded border tabular-nums ${getScoreColor(score)}`}>
                      {score} <span className="text-[9px] opacity-70">/100</span>
                    </div>
                    <div className="mt-1">
                      {getRiskBadge(agent.evaluation.riskTier)}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-2 pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-zinc-900 border border-white/[0.08] text-zinc-400">
                    {agent.sourceEcosystem.replace('_', ' ')}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-zinc-300 bg-zinc-900 border border-white/[0.08]">
                    {agent.framework.toUpperCase()}
                  </span>
                  {agent.requestedPermissions.slice(0, 2).map((perm, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-zinc-950 text-zinc-400 border border-white/[0.06]"
                    >
                      {perm.scope}
                    </span>
                  ))}
                </div>

                {/* Footer bar with Confidence */}
                <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Confidence: <strong className="text-zinc-300">{agent.evaluation.confidence}%</strong></span>
                  <span className="text-zinc-300 flex items-center space-x-0.5">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP VIEW: High-density Table */}
      <div className="hidden md:block security-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-500 uppercase tracking-wider font-mono border-b border-white/[0.08] text-[10px]">
              <tr>
                <th className="py-3 px-4 w-12">Rank</th>
                <th className="py-3 px-4">Agent & Publisher</th>
                <th className="py-3 px-4">Ecosystem</th>
                <th className="py-3 px-4">Permissions</th>
                <th className="py-3 px-4 text-center">Confidence</th>
                <th className="py-3 px-4 text-center">TRUSTY Score</th>
                <th className="py-3 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] font-sans">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-zinc-500 font-mono text-xs">
                    No agents match current filters.
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
                      className="hover:bg-zinc-900/50 cursor-pointer transition group"
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4 font-mono text-zinc-400 font-medium">
                        #{rank}
                      </td>

                      {/* Agent */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-zinc-100 group-hover:text-white transition flex items-center space-x-1.5">
                          <span>{agent.name}</span>
                          {agent.evaluation.overrideApplied && (
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 inline flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono flex items-center space-x-1 mt-0.5">
                          <span>by {agent.publisher.name}</span>
                          {agent.publisher.verifiedDomain && (
                            <span className="text-emerald-400">✓ Verified Org</span>
                          )}
                        </div>
                      </td>

                      {/* Source & Framework */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-[10px] font-mono uppercase text-zinc-400">
                            {agent.sourceEcosystem.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] text-zinc-500 font-mono">
                            {agent.framework.toUpperCase()}
                          </span>
                        </div>
                      </td>

                      {/* Permissions */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {agent.requestedPermissions.slice(0, 3).map((perm, pIdx) => (
                            <span
                              key={pIdx}
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono ${
                                perm.sensitivity === 'critical'
                                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                                  : perm.sensitivity === 'high'
                                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                                  : 'bg-zinc-900 text-zinc-400 border border-white/[0.06]'
                              }`}
                            >
                              {perm.scope}
                            </span>
                          ))}
                          {agent.requestedPermissions.length > 3 && (
                            <span className="text-[10px] text-zinc-500 self-center font-mono">
                              +{agent.requestedPermissions.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Confidence */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        <div className="text-zinc-300 font-semibold tabular-nums">{agent.evaluation.confidence}%</div>
                        <div className="w-14 h-1 bg-zinc-800 rounded-full mx-auto mt-1 overflow-hidden">
                          <div
                            className="h-full bg-zinc-400 rounded-full"
                            style={{ width: `${agent.evaluation.confidence}%` }}
                          />
                        </div>
                      </td>

                      {/* TRUSTY Score */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded border tabular-nums ${getScoreColor(score)}`}>
                            {score} <span className="text-[10px] opacity-70">/100</span>
                          </div>
                          <div className="mt-1">
                            {getRiskBadge(agent.evaluation.riskTier)}
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAgent(agent);
                          }}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] transition"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
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
