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
  Sliders, 
  Search, 
  Lock, 
  Laptop, 
  Sparkles, 
  ArrowRight,
  Database
} from 'lucide-react';

interface MandatesViewProps {
  mandates: HumanMandate[];
  onCreateMandateClick: () => void;
  onLoadSampleData?: () => void;
  onClearData?: () => void;
}

export const MandatesView: React.FC<MandatesViewProps> = ({
  mandates,
  onCreateMandateClick,
  onLoadSampleData,
  onClearData,
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

  // SAAS ONBOARDING EMPTY STATE
  if (mandates.length === 0) {
    return (
      <div className="space-y-6">
        {/* Onboarding Welcome Card */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#ffffff] dark:bg-[#14221e] border border-[#dce3db] dark:border-[#21352e] shadow-sm text-center max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#e9eddf] dark:bg-[#1c302a] text-[#203b32] dark:text-[#c5e86c] flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#50625d] dark:text-[#9cb0a8] bg-[#e9eddf] dark:bg-[#1c302a] px-3 py-1 rounded-full">
              Workspace Initialized · Ready for Setup
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#172b29] dark:text-[#f8f9f5]">
              No active spending mandates yet
            </h2>
            <p className="text-sm text-[#50625d] dark:text-[#9cb0a8] max-w-xl mx-auto leading-relaxed">
              Before allowing an AI agent to execute purchases through Brex, Ramp or Slash, establish a confirmed human mandate specifying budget, items, minimum RAM and verified delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
            <div className="p-4 rounded-xl bg-[#f8f9f5] dark:bg-[#0f1816] border border-[#dce3db] dark:border-[#21352e]">
              <span className="font-bold text-xs text-[#172b29] dark:text-[#f8f9f5] block">1. Define Mandate</span>
              <p className="text-[11px] text-[#50625d] dark:text-[#9cb0a8] mt-1">Set allowed quantity, budget limit, and corporate address.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#f8f9f5] dark:bg-[#0f1816] border border-[#dce3db] dark:border-[#21352e]">
              <span className="font-bold text-xs text-[#172b29] dark:text-[#f8f9f5] block">2. Connect Rail</span>
              <p className="text-[11px] text-[#50625d] dark:text-[#9cb0a8] mt-1">Bind to Brex virtual cards, Ramp multi-rail, or Slash webhook.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#f8f9f5] dark:bg-[#0f1816] border border-[#dce3db] dark:border-[#21352e]">
              <span className="font-bold text-xs text-[#172b29] dark:text-[#f8f9f5] block">3. Intercept &amp; Clear</span>
              <p className="text-[11px] text-[#50625d] dark:text-[#9cb0a8] mt-1">TRUSTY stops drift before money clears on your corporate card.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#dce3db] dark:border-[#21352e]">
            <button
              onClick={onCreateMandateClick}
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-xs font-bold text-white bg-[#172b29] hover:bg-[#203b32] active:scale-[0.98] transition shadow-md flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Mandate</span>
            </button>

            {onLoadSampleData && (
              <button
                onClick={onLoadSampleData}
                className="w-full sm:w-auto px-5 py-3 rounded-lg text-xs font-semibold text-[#172b29] dark:text-[#f8f9f5] bg-[#e9eddf] dark:bg-[#1c302a] hover:bg-[#dce3db] dark:hover:bg-[#264139] transition flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#203b32] dark:text-[#c5e86c]" />
                <span>Load Pitch Demo Scenario (20 Laptops)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#14221e] border border-[#dce3db] dark:border-[#21352e] shadow-sm">
          <div className="flex items-center justify-between text-[#50625d] dark:text-[#9cb0a8] text-xs font-medium">
            <span>Active Delegated Mandates</span>
            <ShieldCheck className="w-4 h-4 text-[#203b32] dark:text-[#c5e86c]" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-[#172b29] dark:text-[#f8f9f5] tabular-nums">
            {mandates.filter(m => m.status === 'ACTIVE').length}
            <span className="text-xs font-normal text-[#50625d] dark:text-[#9cb0a8] ml-2 font-mono">/ {mandates.length} total</span>
          </div>
          <p className="mt-1 text-[11px] text-[#50625d] dark:text-[#9cb0a8]">Human-confirmed spending boundaries</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#14221e] border border-[#dce3db] dark:border-[#21352e] shadow-sm">
          <div className="flex items-center justify-between text-[#50625d] dark:text-[#9cb0a8] text-xs font-medium">
            <span>Total Authorized Budget</span>
            <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-[#172b29] dark:text-[#f8f9f5] tabular-nums">
            ${totalBudget.toLocaleString('en-US')}
          </div>
          <p className="mt-1 text-[11px] text-[#203b32] dark:text-[#c5e86c] flex items-center gap-1 font-medium">
            <span>Linked to Brex, Ramp &amp; Slash</span>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#14221e] border border-[#dce3db] dark:border-[#21352e] shadow-sm">
          <div className="flex items-center justify-between text-[#50625d] dark:text-[#9cb0a8] text-xs font-medium">
            <span>Disbursed with Intent Match</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-[#172b29] dark:text-[#f8f9f5] tabular-nums">
            ${totalSpent.toLocaleString('en-US')}
          </div>
          <p className="mt-1 text-[11px] text-[#50625d] dark:text-[#9cb0a8]">
            {((totalSpent / (totalBudget || 1)) * 100).toFixed(0)}% budget consumed accurately
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#14221e] border border-[#dce3db] dark:border-[#21352e] shadow-sm">
          <div className="flex items-center justify-between text-[#50625d] dark:text-[#9cb0a8] text-xs font-medium">
            <span>Active Reservations</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-[#172b29] dark:text-[#f8f9f5] tabular-nums">
            ${totalReserved.toLocaleString('en-US')}
          </div>
          <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
            Locked in checkout sessions
          </p>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#14221e] border border-[#dce3db] dark:border-[#21352e] shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#50625d]" />
            <input
              type="text"
              placeholder="Search mandates, principals, or cards..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#dce3db] dark:border-[#21352e] bg-[#f8f9f5] dark:bg-[#0f1816] text-[#172b29] dark:text-[#f8f9f5] focus:outline-none focus:ring-2 focus:ring-[#203b32]"
            />
          </div>

          {/* Rail Filter */}
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-[#50625d] font-mono text-[10px] uppercase mr-1 hidden sm:inline">Rail:</span>
            {['ALL', 'Brex', 'Ramp', 'Slash'].map(rail => (
              <button
                key={rail}
                onClick={() => setFilterRail(rail)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                  filterRail === rail
                    ? 'bg-[#172b29] dark:bg-[#c5e86c] text-white dark:text-[#172b29] font-bold shadow-sm'
                    : 'bg-[#f8f9f5] dark:bg-[#1c302a] text-[#50625d] dark:text-[#9cb0a8] hover:bg-[#e9eddf]'
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
                    ? 'bg-[#203b32] text-white font-bold'
                    : 'bg-[#f8f9f5] dark:bg-[#1c302a] text-[#50625d] dark:text-[#9cb0a8] hover:bg-[#e9eddf]'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {onClearData && (
            <button
              onClick={onClearData}
              title="Reset to clean SaaS state"
              className="px-3 py-2 rounded-lg text-xs font-medium text-[#50625d] dark:text-[#9cb0a8] hover:bg-[#e9eddf] dark:hover:bg-[#1c302a] transition"
            >
              Reset State
            </button>
          )}

          <button
            onClick={onCreateMandateClick}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#172b29] hover:bg-[#203b32] active:scale-[0.98] transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Mandate</span>
          </button>
        </div>
      </div>

      {/* Mandates List */}
      <div className="space-y-3">
        {filtered.map(mandate => {
          const isExpanded = expandedId === mandate.id;
          const pct = Math.min(100, Math.round((mandate.budgetSpent / mandate.budgetTotal) * 100));

          return (
            <div
              key={mandate.id}
              className={`rounded-xl transition-all border ${
                isExpanded
                  ? 'bg-white dark:bg-[#14221e] border-[#203b32] dark:border-[#c5e86c]/40 shadow-md ring-1 ring-[#203b32]/20'
                  : 'bg-white dark:bg-[#14221e] border-[#dce3db] dark:border-[#21352e] hover:border-[#b8c6b7]'
              }`}
            >
              {/* Header Row */}
              <div
                className="p-5 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                onClick={() => setExpandedId(isExpanded ? null : mandate.id)}
              >
                <div className="flex items-start space-x-3 min-w-0">
                  <div className="p-2.5 rounded-lg bg-[#e9eddf] dark:bg-[#1c302a] text-[#203b32] dark:text-[#c5e86c] flex-shrink-0 mt-0.5">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-[#172b29] dark:text-[#f8f9f5]">
                        {mandate.title}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#f8f9f5] dark:bg-[#0f1816] text-[#50625d] dark:text-[#9cb0a8] font-medium border border-[#dce3db] dark:border-[#21352e]">
                        {mandate.version}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        mandate.status === 'ACTIVE'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {mandate.status}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#e9eddf] dark:bg-[#1c302a] text-[#203b32] dark:text-[#c5e86c] border border-[#dce3db] dark:border-[#21352e]">
                        {mandate.clearingRail}
                      </span>
                    </div>

                    <p className="text-xs text-[#50625d] dark:text-[#9cb0a8] mt-1 line-clamp-1">
                      Delegated by <strong className="text-[#172b29] dark:text-[#f8f9f5] font-semibold">{mandate.principalName}</strong> ({mandate.principalRole}) · {mandate.cardIdentifier}
                    </p>
                  </div>
                </div>

                {/* Right side: Budget Progress & Actions */}
                <div className="flex items-center space-x-6 flex-shrink-0">
                  <div className="min-w-[160px] text-right">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#50625d] dark:text-[#9cb0a8]">Spent / Total</span>
                      <span className="font-bold tabular-nums text-[#172b29] dark:text-[#f8f9f5]">
                        ${mandate.budgetSpent.toLocaleString()} <span className="text-[#50625d] font-normal">/ ${mandate.budgetTotal.toLocaleString()}</span>
                      </span>
                    </div>
                    <div className="w-full bg-[#e9eddf] dark:bg-[#1c302a] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 90 ? 'bg-amber-500' : 'bg-[#203b32] dark:bg-[#c5e86c]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="text-xs font-semibold text-[#203b32] dark:text-[#c5e86c] hover:underline flex items-center gap-1"
                  >
                    {isExpanded ? 'Collapse' : 'Inspect'}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-[#dce3db] dark:border-[#21352e] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-[#f8f9f5] dark:bg-[#0f1816] border border-[#dce3db] dark:border-[#21352e] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#172b29] dark:text-[#f8f9f5]">
                      <Laptop className="w-4 h-4 text-[#203b32] dark:text-[#c5e86c]" />
                      <span>Authorized Items &amp; Quantity</span>
                    </div>
                    <div className="space-y-1 text-[#50625d] dark:text-[#9cb0a8]">
                      <div><strong>Category:</strong> {mandate.itemsConstraint.category}</div>
                      <div><strong>Allowed Brands:</strong> {mandate.itemsConstraint.allowedBrands.join(', ')}</div>
                      <div className="p-1.5 rounded bg-[#e9eddf] dark:bg-[#1c302a] text-[#172b29] dark:text-[#c5e86c] font-mono text-[11px] font-semibold">
                        Max Quantity: {mandate.itemsConstraint.maxQuantity} units (Hard Limit)
                      </div>
                      <div className="pt-1">
                        <span className="font-semibold text-[#172b29] dark:text-[#f8f9f5]">Required Specs:</span>
                        <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-[11px]">
                          {mandate.itemsConstraint.specifications.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#f8f9f5] dark:bg-[#0f1816] border border-[#dce3db] dark:border-[#21352e] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#172b29] dark:text-[#f8f9f5]">
                      <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Verified Delivery &amp; Vendors</span>
                    </div>
                    <div className="space-y-1 text-[#50625d] dark:text-[#9cb0a8]">
                      <div><strong>Corporate Address:</strong> {mandate.deliveryAddress.label}</div>
                      <div className="text-[11px] font-mono text-[#50625d]">
                        {mandate.deliveryAddress.street}, {mandate.deliveryAddress.city}, {mandate.deliveryAddress.state} {mandate.deliveryAddress.zip}
                      </div>
                      <div className="pt-1">
                        <span className="font-semibold text-[#172b29] dark:text-[#f8f9f5]">Allowed Vendors:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mandate.allowedVendors.map((v, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-[#e9eddf] dark:bg-[#1c302a] font-mono text-[10px] text-[#172b29] dark:text-[#f8f9f5]">
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#f8f9f5] dark:bg-[#0f1816] border border-[#dce3db] dark:border-[#21352e] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#172b29] dark:text-[#f8f9f5]">
                      <Sliders className="w-4 h-4 text-[#203b32] dark:text-[#c5e86c]" />
                      <span>Execution Rail &amp; Approvers</span>
                    </div>
                    <div className="space-y-1 text-[#50625d] dark:text-[#9cb0a8]">
                      <div><strong>Clearing Provider:</strong> {mandate.clearingRail} Platform</div>
                      <div><strong>Single-Use Instrument:</strong> {mandate.cardIdentifier}</div>
                      <div><strong>Auto-Approve Threshold:</strong> Up to ${mandate.autoApprovalMax.toLocaleString()}</div>
                      <div className="pt-1">
                        <span className="font-semibold text-[#172b29] dark:text-[#f8f9f5]">Human Escalation List:</span>
                        <div className="text-[11px] font-mono text-[#50625d] space-y-0.5 mt-0.5">
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
        })}
      </div>
    </div>
  );
};
