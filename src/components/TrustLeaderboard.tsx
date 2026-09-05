'use client';
import React, { useState, useEffect } from 'react';
import { AgentWithScore } from '@/lib/types';
import { 
  Search, 
  ChevronRight, 
  ShieldAlert, 
  Mail, 
  Wallet, 
  Code2, 
  RotateCcw, 
  Shield, 
  ExternalLink,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

function generatePageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | string)[] = [];
  if (current <= 3) {
    pages.push(1, 2, 3, 4, '...', total);
  } else if (current >= total - 2) {
    pages.push(1, '...', total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total);
  }
  return pages;
}

interface TrustLeaderboardProps {
  agents: AgentWithScore[];
  onSelectAgent: (agent: AgentWithScore) => void;
  isLoading: boolean;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const TrustLeaderboard: React.FC<TrustLeaderboardProps> = ({
  agents,
  onSelectAgent,
  isLoading,
  searchQuery = '',
  onClearSearch,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedEcosystem, setSelectedEcosystem] = useState('all');
  const [selectedPermission, setSelectedPermission] = useState('all');
  const [sortBy, setSortBy] = useState<'trust' | 'credit' | 'capacity' | 'confidence' | 'popularity' | 'recent'>('trust');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset to page 1 on search, filter, or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedRisk, selectedEcosystem, selectedPermission, sortBy]);

  const applyPreset = (preset: string) => {
    if (preset === 'email') {
      setSelectedCategory('all');
      setSelectedPermission('gmail');
      setSortBy('trust');
    } else if (preset === 'finance') {
      setSelectedCategory('finance');
      setSelectedPermission('all');
      setSortBy('credit');
    } else if (preset === 'coding') {
      setSelectedCategory('coding');
      setSelectedPermission('all');
      setSortBy('trust');
    } else if (preset === 'reset') {
      if (onClearSearch) onClearSearch();
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
    } else if (sortBy === 'credit') {
      return (b.creditProfile?.creditScore || 0) - (a.creditProfile?.creditScore || 0);
    } else if (sortBy === 'capacity') {
      return (b.creditProfile?.estimatedDailyCapacity || 0) - (a.creditProfile?.estimatedDailyCapacity || 0);
    } else if (sortBy === 'confidence') {
      return b.evaluation.confidence - a.evaluation.confidence;
    } else if (sortBy === 'popularity') {
      return (b.starsCount || 0) - (a.starsCount || 0);
    } else if (sortBy === 'recent') {
      return new Date(b.discoveredAt).getTime() - new Date(a.discoveredAt).getTime();
    }
    return 0;
  });

  // Pagination slice
  const totalItems = filteredAgents.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedAgents = filteredAgents.slice(startIndex, endIndex);

  // Category counts
  const countCoding = agents.filter(a => a.category === 'coding').length;
  const countProductivity = agents.filter(a => a.category === 'productivity').length;
  const countFinance = agents.filter(a => a.category === 'finance').length;
  const countResearch = agents.filter(a => a.category === 'research').length;

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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5">
      {/* Category Segmented Control Bar */}
      <div className="flex items-center space-x-1.5 border-b border-white/[0.08] pb-2.5 mb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded text-xs font-mono font-medium whitespace-nowrap transition flex items-center space-x-1.5 flex-shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-zinc-100 text-zinc-900 shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <span>All</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded ${selectedCategory === 'all' ? 'bg-zinc-300 text-zinc-900' : 'bg-zinc-900 text-zinc-500'}`}>
            {agents.length}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('coding')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded text-xs font-mono font-medium whitespace-nowrap transition flex items-center space-x-1.5 flex-shrink-0 ${
            selectedCategory === 'coding'
              ? 'bg-zinc-100 text-zinc-900 shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Code2 className="w-3 h-3" />
          <span>Coding</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded ${selectedCategory === 'coding' ? 'bg-zinc-300 text-zinc-900' : 'bg-zinc-900 text-zinc-500'}`}>
            {countCoding}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('productivity')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded text-xs font-mono font-medium whitespace-nowrap transition flex items-center space-x-1.5 flex-shrink-0 ${
            selectedCategory === 'productivity'
              ? 'bg-zinc-100 text-zinc-900 shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Mail className="w-3 h-3" />
          <span>Productivity</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded ${selectedCategory === 'productivity' ? 'bg-zinc-300 text-zinc-900' : 'bg-zinc-900 text-zinc-500'}`}>
            {countProductivity}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('finance')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded text-xs font-mono font-medium whitespace-nowrap transition flex items-center space-x-1.5 flex-shrink-0 ${
            selectedCategory === 'finance'
              ? 'bg-zinc-100 text-zinc-900 shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Wallet className="w-3 h-3" />
          <span>Finance</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded ${selectedCategory === 'finance' ? 'bg-zinc-300 text-zinc-900' : 'bg-zinc-900 text-zinc-500'}`}>
            {countFinance}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('research')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded text-xs font-mono font-medium whitespace-nowrap transition flex items-center space-x-1.5 flex-shrink-0 ${
            selectedCategory === 'research'
              ? 'bg-zinc-100 text-zinc-900 shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <span>Research</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded ${selectedCategory === 'research' ? 'bg-zinc-300 text-zinc-900' : 'bg-zinc-900 text-zinc-500'}`}>
            {countResearch}
          </span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="security-card p-2.5 sm:p-3 rounded-lg mb-3 sm:mb-4">
        {searchQuery && (
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-xs font-mono text-zinc-300">
            <span className="flex items-center space-x-1.5">
              <span className="text-zinc-500">Filtering by:</span>
              <span className="text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                &ldquo;{searchQuery}&rdquo;
              </span>
            </span>
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 transition underline"
              >
                Clear filter
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-2 py-1.5 bg-zinc-950 border border-white/[0.08] rounded text-xs text-zinc-200 font-mono focus:outline-none focus:border-zinc-500"
            >
              <option value="trust">Sort: Trusty Score</option>
              <option value="credit">Sort: Credit Score (Beta)</option>
              <option value="capacity">Sort: Daily Spend Capacity</option>
              <option value="confidence">Sort: Confidence %</option>
              <option value="popularity">Sort: Stars / Users</option>
              <option value="recent">Sort: Most Recent</option>
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
              <option value="LOW_RISK">Low Risk [80-100]</option>
              <option value="MEDIUM_RISK">Medium [60-79]</option>
              <option value="HIGH_RISK">High Risk [40-59]</option>
              <option value="CRITICAL_RISK">Critical [0-39]</option>
            </select>
          </div>

          {/* Ecosystem (Desktop/Tablet) */}
          <div className="hidden sm:block">
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

          {/* Permissions filter (Desktop/Tablet) */}
          <div className="hidden sm:block">
            <select
              value={selectedPermission}
              onChange={e => setSelectedPermission(e.target.value)}
              className="w-full px-2 py-1.5 bg-zinc-950 border border-white/[0.08] rounded text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 font-mono"
            >
              <option value="all">Permissions: All</option>
              <option value="git">Git Access</option>
              <option value="gmail">Email / Gmail</option>
              <option value="terminal">Terminal / Exec</option>
              <option value="wallet">Crypto Wallet</option>
            </select>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW: Cards */}
      <div className="block md:hidden space-y-2.5">
        {filteredAgents.length === 0 ? (
          <div className="security-card p-6 text-center text-zinc-500 text-xs rounded-lg font-mono">
            No agents match active filters.
          </div>
        ) : (
          paginatedAgents.map((agent, index) => {
            const rank = startIndex + index + 1;
            const score = agent.evaluation.trustyScore;

            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(agent)}
                className="security-card-interactive p-3 rounded-lg cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="w-5 h-5 rounded bg-zinc-900 border border-white/[0.08] text-[10px] font-mono font-bold text-zinc-400 flex items-center justify-center flex-shrink-0 tabular-nums">
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
                  {/* Scores: Trusty + Credit */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <div className="flex flex-col items-end">
                      <div className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded border tabular-nums ${getScoreColor(score)}`}>
                        {score} <span className="text-[9px] opacity-70">/100</span>
                      </div>
                      <div className="mt-1">
                        {getRiskBadge(agent.evaluation.riskTier)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end border-l border-white/[0.08] pl-2">
                      <div className="text-xs font-mono font-bold px-1.5 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-purple-300 tabular-nums">
                        CR {agent.creditProfile?.creditScore ?? 75}
                      </div>
                      <div className="text-[9px] font-mono text-cyan-400 mt-1 tabular-nums font-semibold">
                        ${(agent.creditProfile?.estimatedDailyCapacity ?? 5000).toLocaleString()}/d
                      </div>
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

                {/* Footer bar */}
                <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Confidence: <strong className="text-zinc-300 tabular-nums">{agent.evaluation.confidence}%</strong></span>
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

      {/* DESKTOP VIEW: High-density Table with 5-Dimension Mini Bar */}
      <div className="hidden md:block security-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/90 text-zinc-500 uppercase tracking-wider font-mono border-b border-white/[0.08] text-[10px]">
              <tr>
                <th className="py-3 px-4 w-12">Rank</th>
                <th className="py-3 px-4">Agent & Publisher</th>
                <th className="py-3 px-4">Ecosystem</th>
                <th className="py-3 px-4">5-Dimension Posture</th>
                <th className="py-3 px-4 text-center">Confidence</th>
                <th className="py-3 px-4 text-center">TRUSTY Score</th>
                <th className="py-3 px-4 text-center">Credit & Limit (Beta)</th>
                <th className="py-3 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] font-sans">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500 font-mono text-xs">
                    No agents match current filters.
                  </td>
                </tr>
              ) : (
                paginatedAgents.map((agent, index) => {
                  const rank = startIndex + index + 1;
                  const score = agent.evaluation.trustyScore;
                  const dims = agent.evaluation.dimensions;

                  return (
                    <tr
                      key={agent.id}
                      onClick={() => onSelectAgent(agent)}
                      className={`hover:bg-white/[0.03] transition cursor-pointer ${
                        agent.evaluation.overrideApplied ? 'bg-rose-950/10' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4 font-mono text-zinc-500 font-bold tabular-nums">
                        #{rank}
                      </td>

                      {/* Agent & Publisher */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="min-w-0">
                            <div className="font-semibold text-zinc-100 flex items-center space-x-1.5">
                              <span className="truncate">{agent.name}</span>
                              {agent.evaluation.overrideApplied && (
                                <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-500 font-mono flex items-center space-x-1.5 mt-0.5">
                              <span className="truncate">{agent.publisher.name}</span>
                              {agent.publisher.verifiedDomain && (
                                <span className="text-emerald-400 flex items-center space-x-0.5 text-[10px] font-sans">
                                  <span>✓</span>
                                  <span>Verified Org</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Ecosystem & Type */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col space-y-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-900 border border-white/[0.08] text-zinc-400 w-fit">
                            {agent.sourceEcosystem.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {agent.framework} · {agent.category}
                          </span>
                        </div>
                      </td>

                      {/* 5-Dimension Mini Bar */}
                      <td className="py-3.5 px-4 min-w-[170px]">
                        <div className="flex space-x-1 mb-1">
                          {/* Id */}
                          <div
                            className={`h-2 flex-1 rounded-sm ${dims.identity.score >= 80 ? 'bg-emerald-500' : dims.identity.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            title={`Identity: ${dims.identity.score}/100`}
                          />
                          {/* Perm */}
                          <div
                            className={`h-2 flex-1 rounded-sm ${dims.permissions.score >= 80 ? 'bg-emerald-500' : dims.permissions.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            title={`Permissions: ${dims.permissions.score}/100`}
                          />
                          {/* Sec */}
                          <div
                            className={`h-2 flex-1 rounded-sm ${dims.security.score >= 80 ? 'bg-emerald-500' : dims.security.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            title={`Security: ${dims.security.score}/100`}
                          />
                          {/* Gov */}
                          <div
                            className={`h-2 flex-1 rounded-sm ${dims.governance.score >= 80 ? 'bg-emerald-500' : dims.governance.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            title={`Governance: ${dims.governance.score}/100`}
                          />
                          {/* Rep */}
                          <div
                            className={`h-2 flex-1 rounded-sm ${dims.reputation.score >= 80 ? 'bg-emerald-500' : dims.reputation.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            title={`Reputation: ${dims.reputation.score}/100`}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                          <span>Id·Perm·Sec·Gov·Rep</span>
                        </div>
                      </td>

                      {/* Confidence */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        <div className="text-zinc-300 font-semibold tabular-nums">{agent.evaluation.confidence}%</div>
                        <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mt-1 overflow-hidden">
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

                      {/* Credit & Limit (Beta) */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex items-center space-x-1.5 font-mono">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono bg-purple-500/10 text-purple-300 border border-purple-500/25 tabular-nums">
                              CR {agent.creditProfile?.creditScore ?? 75}
                            </span>
                            <span className="text-[10px] text-purple-400/80 font-bold uppercase">
                              {agent.creditProfile?.creditTier ?? 'A'}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-cyan-400 font-semibold tabular-nums mt-1">
                            ${(agent.creditProfile?.estimatedDailyCapacity ?? 5000).toLocaleString()}/day
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

      {/* PAGINATION BAR */}
      {totalItems > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-3.5 py-3 bg-zinc-950/70 border border-white/[0.08] rounded-lg text-xs font-mono">
          {/* Item range info */}
          <div className="text-zinc-400 flex items-center space-x-1.5 text-center sm:text-left">
            <span>
              Showing <strong className="text-zinc-200 tabular-nums">{startIndex + 1}</strong>–<strong className="text-zinc-200 tabular-nums">{endIndex}</strong> of{' '}
              <strong className="text-zinc-200 tabular-nums">{totalItems}</strong> agents
            </span>
          </div>

          {/* Controls: Rows selector + Page buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Rows per page selector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-zinc-500 text-[11px]">Rows:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-zinc-900 border border-white/[0.08] text-zinc-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-zinc-700"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={safeCurrentPage === 1}
                className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 border border-white/[0.08] transition"
                title="First Page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 border border-white/[0.08] transition"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1 px-1">
                {generatePageNumbers(safeCurrentPage, totalPages).map((p, idx) => {
                  if (p === '...') {
                    return (
                      <span key={`dots-${idx}`} className="px-1 text-zinc-600 select-none">
                        ...
                      </span>
                    );
                  }
                  const pageNum = Number(p);
                  const isActive = pageNum === safeCurrentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded text-xs font-mono font-medium transition flex items-center justify-center tabular-nums ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-white/[0.08]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 border border-white/[0.08] transition"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={safeCurrentPage === totalPages}
                className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 border border-white/[0.08] transition"
                title="Last Page"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
