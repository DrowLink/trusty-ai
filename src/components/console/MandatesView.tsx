'use client';

import React, { useState } from 'react';
import { HumanMandate } from '@/lib/types';
import { 
  ShieldCheck, 
  Plus, 
  CreditCard, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Users, 
  Sliders, 
  ExternalLink,
  Lock,
  Search,
  Filter,
  ArrowUpRight,
  AlertCircle,
  Laptop
} from 'lucide-react';

interface MandatesViewProps {
  mandates: HumanMandate[];
  onCreateMandateClick: () => void;
  onSelectMandate?: (mandate: HumanMandate) => void;
}

export const MandatesView: React.FC<MandatesViewProps> = ({
  mandates,
  onCreateMandateClick,
  onSelectMandate,
}) => {
  const [filterRail, setFilterRail] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(mandates[0]?.id || null);

  const filtered = mandates.filter(m => {
    if (filterRail !== 'ALL' && m.clearingRail !== filterRail) return false;
    if (filterStatus !== 'ALL' && m.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.principalName.toLowerCase().includes(q) ||
        m.cardIdentifier?.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalBudget = mandates.reduce((acc, m) => acc + m.budgetTotal, 0);
  const totalSpent = mandates.reduce((acc, m) => acc + m.budgetSpent, 0);
  const totalReserved = mandates.reduce((acc, m) => acc + m.budgetReserved, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Active Delegated Mandates</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {mandates.filter(m => m.status === 'ACTIVE').length}
            <span className="text-xs font-normal text-slate-500 ml-2 font-mono">/ {mandates.length} total</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Human-confirmed spending authorities</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Total Authorized Budget</span>
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            ${totalBudget.toLocaleString('en-US')}
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <span>Linked to Brex, Ramp &amp; Slash</span>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Disbursed with Intent Match</span>
            <CheckCircle2 className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            ${totalSpent.toLocaleString('en-US')}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {((totalSpent / (totalBudget || 1)) * 100).toFixed(0)}% budget consumed accurately
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Active Reservations</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            ${totalReserved.toLocaleString('en-US')}
          </div>
          <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Locked in checkout sessions
          </p>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Create Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.08] shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search mandates, principals, or cards..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Rail Filter */}
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-slate-400 font-mono text-[10px] uppercase mr-1 hidden sm:inline">Rail:</span>
            {['ALL', 'Brex', 'Ramp', 'Slash'].map(rail => (
              <button
                key={rail}
                onClick={() => setFilterRail(rail)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                  filterRail === rail
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {rail}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 text-xs">
            {['ALL', 'ACTIVE', 'EXHAUSTED'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                  filterStatus === st
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onCreateMandateClick}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition shadow-sm flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Mandate</span>
        </button>
      </div>

      {/* Mandates List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.08] text-slate-500">
            <p className="text-sm font-medium">No mandates match your filters</p>
            <button
              onClick={() => { setFilterRail('ALL'); setFilterStatus('ALL'); setSearchQuery(''); }}
              className="mt-3 text-xs text-blue-600 dark:text-sky-400 font-semibold underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filtered.map(mandate => {
            const isExpanded = expandedId === mandate.id;
            const pct = Math.min(100, Math.round((mandate.budgetSpent / mandate.budgetTotal) * 100));

            return (
              <div
                key={mandate.id}
                className={`rounded-xl transition-all border ${
                  isExpanded
                    ? 'bg-white dark:bg-[#111827] border-blue-500/40 dark:border-blue-500/40 shadow-md ring-1 ring-blue-500/20'
                    : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15]'
                }`}
              >
                {/* Mandate Header Row */}
                <div
                  className="p-5 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  onClick={() => setExpandedId(isExpanded ? null : mandate.id)}
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-sky-400 flex-shrink-0 mt-0.5">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {mandate.title}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {mandate.version}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          mandate.status === 'ACTIVE'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {mandate.status}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                          {mandate.clearingRail}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        Delegated by <strong className="text-slate-700 dark:text-slate-200 font-semibold">{mandate.principalName}</strong> ({mandate.principalRole}) · {mandate.cardIdentifier}
                      </p>
                    </div>
                  </div>

                  {/* Right side: Budget Progress & Actions */}
                  <div className="flex items-center space-x-6 flex-shrink-0">
                    <div className="min-w-[160px] text-right">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Spent / Total</span>
                        <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                          ${mandate.budgetSpent.toLocaleString()} <span className="text-slate-400 font-normal">/ ${mandate.budgetTotal.toLocaleString()}</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pct >= 90 ? 'bg-amber-500' : 'bg-blue-600 dark:bg-sky-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      {isExpanded ? 'Collapse' : 'Inspect'}
                    </button>
                  </div>
                </div>

                {/* Expanded Mandate Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-white/[0.06] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Column 1: Items & Specs Constraints */}
                    <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.06] space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                        <Laptop className="w-4 h-4 text-blue-500" />
                        <span>Authorized Items &amp; Quantity</span>
                      </div>
                      <div className="space-y-1 text-slate-600 dark:text-slate-400">
                        <div><strong>Category:</strong> {mandate.itemsConstraint.category}</div>
                        <div><strong>Allowed Brands:</strong> {mandate.itemsConstraint.allowedBrands.join(', ')}</div>
                        <div className="p-1.5 rounded bg-blue-100/60 dark:bg-blue-950/40 text-blue-900 dark:text-sky-300 font-mono text-[11px] font-semibold">
                          Max Quantity: {mandate.itemsConstraint.maxQuantity} units (Hard Limit)
                        </div>
                        <div className="pt-1">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Required Specs:</span>
                          <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-[11px]">
                            {mandate.itemsConstraint.specifications.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Destination & Approved Vendors */}
                    <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.06] space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span>Verified Delivery &amp; Vendors</span>
                      </div>
                      <div className="space-y-1 text-slate-600 dark:text-slate-400">
                        <div><strong>Corporate Address:</strong> {mandate.deliveryAddress.label}</div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {mandate.deliveryAddress.street}, {mandate.deliveryAddress.city}, {mandate.deliveryAddress.state} {mandate.deliveryAddress.zip}
                        </div>
                        <div className="pt-1">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Allowed Vendors:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {mandate.allowedVendors.map((v, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 font-mono text-[10px] text-slate-800 dark:text-slate-300">
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Governance & Clearing */}
                    <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.06] space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                        <Sliders className="w-4 h-4 text-purple-500" />
                        <span>Execution Rail &amp; Approvers</span>
                      </div>
                      <div className="space-y-1 text-slate-600 dark:text-slate-400">
                        <div><strong>Clearing Provider:</strong> {mandate.clearingRail} Platform</div>
                        <div><strong>Single-Use Instrument:</strong> {mandate.cardIdentifier}</div>
                        <div><strong>Auto-Approve Threshold:</strong> Up to ${mandate.autoApprovalMax.toLocaleString()}</div>
                        <div className="pt-1">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Human Escalation List:</span>
                          <div className="text-[11px] font-mono text-slate-500 space-y-0.5 mt-0.5">
                            {mandate.approvers.map((app, i) => (
                              <div key={i}>• {app}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
