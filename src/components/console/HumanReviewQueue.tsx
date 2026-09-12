'use client';

import React, { useState } from 'react';
import { ApprovalQueueItem } from '@/lib/types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Laptop, 
  MapPin, 
  DollarSign, 
  ShieldAlert, 
  FileCheck, 
  Clock, 
  Send,
  ExternalLink,
  Info,
  Layers
} from 'lucide-react';

interface HumanReviewQueueProps {
  items: ApprovalQueueItem[];
  onResolveItem: (itemId: string, decision: 'APPROVED_EXCEPTION' | 'DECLINED' | 'ADJUSTMENT_REQUESTED', note: string) => void;
}

export const HumanReviewQueue: React.FC<HumanReviewQueueProps> = ({
  items,
  onResolveItem,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(items[0]?.id || '');
  const [reviewNote, setReviewNote] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<'APPROVED_EXCEPTION' | 'DECLINED' | 'ADJUSTMENT_REQUESTED' | null>(null);

  const selectedItem = items.find(i => i.id === selectedItemId) || items[0];
  const pendingCount = items.filter(i => i.status === 'PENDING_REVIEW').length;

  const handleTriggerAction = (action: 'APPROVED_EXCEPTION' | 'DECLINED' | 'ADJUSTMENT_REQUESTED') => {
    setPendingAction(action);
    setIsConfirming(true);
  };

  const handleConfirmAction = () => {
    if (!selectedItem || !pendingAction) return;
    onResolveItem(selectedItem.id, pendingAction, reviewNote || 'Approved via TRUSTY Human Approval Console');
    setIsConfirming(false);
    setPendingAction(null);
    setReviewNote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-start sm:items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-amber-950 dark:text-amber-200">
              Human-In-The-Loop Intent Interceptions ({pendingCount} pending review)
            </h2>
            <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5">
              These autonomous actions meet the corporate credit limit on Brex/Ramp, but violate human intent boundaries. Financial clearing is paused until confirmed.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/60 px-3 py-1.5 rounded-lg flex-shrink-0 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5" />
          <span>ZERO SPEND UNTIL APPROVED</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-16 text-center rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.08] text-slate-500">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Review Queue is Clean</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            All agent financial operations currently comply with authorized human mandates. No intercepted purchases pending.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Intercepted Queue List (4 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono px-1">
              Flagged Transactions ({items.length})
            </div>

            <div className="space-y-2">
              {items.map(item => {
                const isSelected = item.id === selectedItem?.id;
                const isResolved = item.status !== 'PENDING_REVIEW';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border text-left ${
                      isSelected
                        ? 'bg-white dark:bg-[#111827] border-blue-500/60 dark:border-blue-500/60 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15]'
                    } ${isResolved ? 'opacity-60 bg-slate-50 dark:bg-slate-900/40' : ''}`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono text-[10px] text-slate-400">{item.id}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        item.status === 'PENDING_REVIEW'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : item.status === 'APPROVED_EXCEPTION'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.cartSnapshot.itemTitle}
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs">
                      <div className="text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                        Agent: <strong className="text-slate-700 dark:text-slate-200">{item.agentName}</strong>
                      </div>
                      <div className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                        ${item.requestedAmount.toLocaleString()}
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px]">
                      <span className="text-rose-600 dark:text-rose-400 font-semibold font-mono flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {item.mismatchType}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        Rail: {item.clearingRail}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Side-by-Side Mandate vs Cart Inspector (7 cols) */}
          {selectedItem && (
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-6">
                {/* Header detail */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/[0.08]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-sky-400">
                        {selectedItem.mandateTitle}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-xs text-slate-500 font-mono">{selectedItem.id}</span>
                    </div>
                    <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mt-1">
                      Intercept Analysis: {selectedItem.mismatchType}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Proposed Total</span>
                    <span className="text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                      ${selectedItem.requestedAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* The Core Pitch Comparison Card: Mandate vs Proposed Cart */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mandate Box */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/[0.08] space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold uppercase tracking-wider text-slate-500">
                        1. Human Mandate Authorized
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold">
                        ORIGINAL INTENT
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/[0.04] text-xs space-y-1.5">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        “Buy 20 laptops for new hires. Dell or Lenovo, min 16 GB RAM. Up to $20,000. Miami office.”
                      </div>
                      <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100 dark:border-white/[0.06]">
                        <div>• Authorized Quantity: <strong className="text-slate-800 dark:text-slate-200">20 units</strong></div>
                        <div>• Spending Cap: <strong className="text-slate-800 dark:text-slate-200">$20,000.00</strong></div>
                        <div>• Destination: <strong className="text-slate-800 dark:text-slate-200">Miami Office</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Proposed Cart Box */}
                  <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        2. Agent Prepared Cart
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-mono text-[10px] font-bold">
                        INTERCEPTED
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/[0.04] text-xs space-y-1.5">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {selectedItem.cartSnapshot.itemTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100 dark:border-white/[0.06]">
                        <div className="text-rose-600 dark:text-rose-400 font-semibold">
                          • Cart Quantity: <strong className="font-bold underline">{selectedItem.cartSnapshot.quantity} units (+10 unrequested)</strong>
                        </div>
                        <div>• Cart Total: <strong className="text-slate-800 dark:text-slate-200">${selectedItem.requestedAmount.toLocaleString()}</strong> (Within $20k cap!)</div>
                        <div>• Vendor: <strong className="text-slate-800 dark:text-slate-200">{selectedItem.vendor}</strong></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Criteria Breakdown Table */}
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Criterion-By-Criterion Verification
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-white/[0.06] border border-slate-200 dark:border-white/[0.08] rounded-xl overflow-hidden text-xs">
                    {selectedItem.criteriaChecks.map((crit, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-slate-900/40 flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {crit.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                            )}
                            <span>{crit.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Expected: <span className="font-mono text-slate-700 dark:text-slate-300">{crit.expected}</span> · Got: <span className="font-mono text-slate-700 dark:text-slate-300">{crit.actual}</span>
                          </p>
                          {crit.notes && (
                            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium mt-0.5">
                              {crit.notes}
                            </p>
                          )}
                        </div>

                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold flex-shrink-0 ${
                          crit.passed
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                        }`}>
                          {crit.passed ? 'MATCH' : 'MISMATCH'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Evidence Hash */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/[0.04] text-[11px] font-mono text-slate-500 flex items-center justify-between">
                  <div className="truncate mr-2">
                    <span className="text-slate-400">Cart SHA256: </span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedItem.cartSnapshot.cartHash}</span>
                  </div>
                  <span className="text-slate-400 whitespace-nowrap">Single-Use Grant</span>
                </div>

                {/* Action Form / Decision Box */}
                {selectedItem.status === 'PENDING_REVIEW' ? (
                  <div className="pt-2 border-t border-slate-100 dark:border-white/[0.08] space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Reviewer Justification / Override Note (Optional):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Exception authorized for 10 extra contractor laptops under project code ENG-99"
                        value={reviewNote}
                        onChange={e => setReviewNote(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <button
                        onClick={() => handleTriggerAction('APPROVED_EXCEPTION')}
                        className="px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Exception &amp; Disburse</span>
                      </button>

                      <button
                        onClick={() => handleTriggerAction('DECLINED')}
                        className="px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.98] transition shadow-sm flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline &amp; Block Payment</span>
                      </button>

                      <button
                        onClick={() => handleTriggerAction('ADJUSTMENT_REQUESTED')}
                        className="px-3 py-2.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
                      >
                        <Send className="w-3 h-3" />
                        <span>Request Adjustment</span>
                      </button>
                    </div>

                    {isConfirming && (
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs flex items-center justify-between">
                        <span className="font-semibold text-blue-900 dark:text-sky-300">
                          Confirm action: <strong>{pendingAction}</strong> on {selectedItem.clearingRail} rail?
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleConfirmAction}
                            className="px-3 py-1 rounded bg-blue-600 text-white font-bold text-xs hover:bg-blue-500"
                          >
                            Yes, execute
                          </button>
                          <button
                            onClick={() => setIsConfirming(false)}
                            className="px-2 py-1 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Resolution Recorded: {selectedItem.status}</span>
                    </div>
                    {selectedItem.resolutionNote && (
                      <p className="italic font-mono text-[11px]">“{selectedItem.resolutionNote}”</p>
                    )}
                    <div className="text-[10px] text-slate-400 font-mono">
                      Timestamp: {selectedItem.resolvedAt || 'Just now'} · Cleared via {selectedItem.clearingRail}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
