'use client';

import React, { useState } from 'react';
import { ApprovalQueueItem } from '@/lib/types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Laptop, 
  ShieldAlert, 
  Clock, 
  Send,
  Sparkles,
  Check
} from 'lucide-react';

interface HumanReviewQueueProps {
  items: ApprovalQueueItem[];
  onResolveItem: (itemId: string, decision: 'APPROVED_EXCEPTION' | 'DECLINED' | 'ADJUSTMENT_REQUESTED', note: string) => void;
  onSimulateInterception?: () => void;
}

export const HumanReviewQueue: React.FC<HumanReviewQueueProps> = ({
  items,
  onResolveItem,
  onSimulateInterception,
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

  // SAAS CLEAN EMPTY STATE
  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#14221e] border border-[#dce3db] dark:border-[#21352e] shadow-sm text-center max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#e9eddf] dark:bg-[#1c302a] text-[#203b32] dark:text-[#c5e86c] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#172b29] dark:text-[#f8f9f5]">
              Review Queue is Clean
            </h3>
            <p className="text-xs text-[#50625d] dark:text-[#9cb0a8] max-w-md mx-auto leading-relaxed">
              No purchases are currently paused. When an autonomous agent attempts a transaction that violates quantity, specs, or delivery limits, it will be intercepted here before funds clear on Brex/Ramp.
            </p>
          </div>

          {onSimulateInterception && (
            <div className="pt-3 border-t border-[#dce3db] dark:border-[#21352e]">
              <button
                onClick={onSimulateInterception}
                className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#172b29] hover:bg-[#203b32] active:scale-[0.98] transition shadow-sm inline-flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#c5e86c]" />
                <span>Simulate Pitch Interception (30 Laptops)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#fff4de] dark:bg-[#231a0e] border border-[#f1d29c] dark:border-[#523d1b] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-start sm:items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#fae2b8] dark:bg-[#3d2c12] text-[#825514] dark:text-[#f3bf6a] flex-shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#4e3410] dark:text-[#ffd699]">
              Human-In-The-Loop Intent Interceptions ({pendingCount} pending review)
            </h2>
            <p className="text-xs text-[#735122] dark:text-[#d4b07d] mt-0.5">
              These autonomous actions meet the corporate credit limit, but violate human intent boundaries. Financial clearing is paused until approved.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#4e3410] dark:text-[#ffd699] bg-[#fae2b8] dark:bg-[#3d2c12] px-3 py-1.5 rounded-lg flex-shrink-0 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5" />
          <span>ZERO SPEND UNTIL APPROVED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Intercepted Queue List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#50625d] font-mono px-1">
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
                      ? 'bg-white dark:bg-[#14221e] border-[#203b32] dark:border-[#c5e86c]/60 shadow-md ring-2 ring-[#203b32]/20'
                      : 'bg-white dark:bg-[#14221e] border-[#dce3db] dark:border-[#21352e] hover:border-[#b8c6b7]'
                  } ${isResolved ? 'opacity-60 bg-[#f8f9f5] dark:bg-[#0f1816]' : ''}`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono text-[10px] text-[#50625d]">{item.id}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      item.status === 'PENDING_REVIEW'
                        ? 'bg-[#fff4de] text-[#785315]'
                        : item.status === 'APPROVED_EXCEPTION'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-[#172b29] dark:text-[#f8f9f5]">
                    {item.cartSnapshot.itemTitle}
                  </div>

                  <div className="flex items-center justify-between mt-2 text-xs">
                    <div className="text-[#50625d] truncate max-w-[180px]">
                      Agent: <strong className="text-[#172b29] dark:text-[#f8f9f5]">{item.agentName}</strong>
                    </div>
                    <div className="font-mono font-bold tabular-nums text-[#172b29] dark:text-[#f8f9f5]">
                      ${item.requestedAmount.toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#dce3db] dark:border-[#21352e] flex items-center justify-between text-[11px]">
                    <span className="text-rose-700 dark:text-rose-400 font-semibold font-mono flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {item.mismatchType}
                    </span>
                    <span className="text-[#50625d] font-mono text-[10px]">
                      Rail: {item.clearingRail}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Comparison Card (7 cols) */}
        {selectedItem && (
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#14221e] border border-[#dce3db] dark:border-[#21352e] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#dce3db] dark:border-[#21352e]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#203b32] dark:text-[#c5e86c]">
                      {selectedItem.mandateTitle}
                    </span>
                    <span className="text-[#50625d]">·</span>
                    <span className="text-xs text-[#50625d] font-mono">{selectedItem.id}</span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-[#172b29] dark:text-[#f8f9f5] mt-1">
                    Intercept Analysis: {selectedItem.mismatchType}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#50625d] block">Proposed Total</span>
                  <span className="text-xl font-bold tabular-nums text-[#172b29] dark:text-[#f8f9f5]">
                    ${selectedItem.requestedAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#f8f9f5] dark:bg-[#0f1816] border border-[#dce3db] dark:border-[#21352e] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold uppercase tracking-wider text-[#50625d]">
                      1. Human Mandate Authorized
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                      ORIGINAL INTENT
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#14221e] border border-[#dce3db] dark:border-[#21352e] text-xs space-y-1.5">
                    <div className="font-semibold text-[#172b29] dark:text-[#f8f9f5]">
                      “Buy 20 laptops for new hires. Dell or Lenovo, min 16 GB RAM. Up to $20,000. Miami office.”
                    </div>
                    <div className="text-[11px] text-[#50625d] space-y-0.5 pt-1 border-t border-[#dce3db] dark:border-[#21352e]">
                      <div>• Authorized Quantity: <strong className="text-[#172b29] dark:text-[#f8f9f5]">20 units</strong></div>
                      <div>• Spending Cap: <strong className="text-[#172b29] dark:text-[#f8f9f5]">$20,000.00</strong></div>
                      <div>• Destination: <strong className="text-[#172b29] dark:text-[#f8f9f5]">Miami Office</strong></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#fff4de] dark:bg-[#231a0e] border border-[#f1d29c] dark:border-[#523d1b] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold uppercase tracking-wider text-[#785315] dark:text-[#ffd699]">
                      2. Agent Prepared Cart
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#fae2b8] dark:bg-[#3d2c12] text-[#4e3410] dark:text-[#ffd699] font-mono text-[10px] font-bold">
                      INTERCEPTED
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#14221e] border border-[#dce3db] dark:border-[#21352e] text-xs space-y-1.5">
                    <div className="font-semibold text-[#172b29] dark:text-[#f8f9f5]">
                      {selectedItem.cartSnapshot.itemTitle}
                    </div>
                    <div className="text-[11px] text-[#50625d] space-y-0.5 pt-1 border-t border-[#dce3db] dark:border-[#21352e]">
                      <div className="text-rose-700 dark:text-rose-400 font-semibold">
                        • Cart Quantity: <strong className="font-bold underline">{selectedItem.cartSnapshot.quantity} units (+10 unrequested)</strong>
                      </div>
                      <div>• Cart Total: <strong className="text-[#172b29] dark:text-[#f8f9f5]">${selectedItem.requestedAmount.toLocaleString()}</strong> (Within $20k cap!)</div>
                      <div>• Vendor: <strong className="text-[#172b29] dark:text-[#f8f9f5]">{selectedItem.vendor}</strong></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Criteria Table */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#50625d]">
                  Criterion-By-Criterion Verification
                </div>

                <div className="divide-y divide-[#dce3db] dark:divide-[#21352e] border border-[#dce3db] dark:border-[#21352e] rounded-xl overflow-hidden text-xs">
                  {selectedItem.criteriaChecks.map((crit, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-[#14221e] flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-[#172b29] dark:text-[#f8f9f5] flex items-center gap-1.5">
                          {crit.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                          )}
                          <span>{crit.name}</span>
                        </div>
                        <p className="text-[11px] text-[#50625d]">
                          Expected: <span className="font-mono text-[#172b29] dark:text-[#f8f9f5]">{crit.expected}</span> · Got: <span className="font-mono text-[#172b29] dark:text-[#f8f9f5]">{crit.actual}</span>
                        </p>
                        {crit.notes && (
                          <p className="text-[10px] text-rose-700 dark:text-rose-400 font-medium mt-0.5">
                            {crit.notes}
                          </p>
                        )}
                      </div>

                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold flex-shrink-0 ${
                        crit.passed
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}>
                        {crit.passed ? 'MATCH' : 'MISMATCH'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hash */}
              <div className="p-3 rounded-lg bg-[#f8f9f5] dark:bg-[#0f1816] border border-[#dce3db] dark:border-[#21352e] text-[11px] font-mono text-[#50625d] flex items-center justify-between">
                <div className="truncate mr-2">
                  <span>Cart SHA256: </span>
                  <span className="text-[#172b29] dark:text-[#f8f9f5]">{selectedItem.cartSnapshot.cartHash}</span>
                </div>
                <span className="whitespace-nowrap">Single-Use Grant</span>
              </div>

              {/* Actions */}
              {selectedItem.status === 'PENDING_REVIEW' ? (
                <div className="pt-2 border-t border-[#dce3db] dark:border-[#21352e] space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#172b29] dark:text-[#f8f9f5]">
                      Reviewer Justification / Override Note (Optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Exception authorized for 10 extra contractor laptops under project code ENG-99"
                      value={reviewNote}
                      onChange={e => setReviewNote(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#dce3db] dark:border-[#21352e] bg-white dark:bg-[#0f1816] text-[#172b29] dark:text-[#f8f9f5] focus:ring-2 focus:ring-[#203b32] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      onClick={() => handleTriggerAction('APPROVED_EXCEPTION')}
                      className="px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] transition shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Exception &amp; Disburse</span>
                    </button>

                    <button
                      onClick={() => handleTriggerAction('DECLINED')}
                      className="px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 active:scale-[0.98] transition shadow-sm flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Decline &amp; Block Payment</span>
                    </button>

                    <button
                      onClick={() => handleTriggerAction('ADJUSTMENT_REQUESTED')}
                      className="px-3 py-2.5 rounded-lg text-xs font-semibold border border-[#dce3db] dark:border-[#21352e] text-[#172b29] dark:text-[#f8f9f5] hover:bg-[#e9eddf] dark:hover:bg-[#1c302a] transition flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>Request Adjustment</span>
                    </button>
                  </div>

                  {isConfirming && (
                    <div className="p-3 rounded-lg bg-[#e9eddf] dark:bg-[#1c302a] border border-[#dce3db] dark:border-[#21352e] text-xs flex items-center justify-between">
                      <span className="font-semibold text-[#172b29] dark:text-[#f8f9f5]">
                        Confirm action: <strong>{pendingAction}</strong> on {selectedItem.clearingRail} rail?
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleConfirmAction}
                          className="px-3 py-1 rounded bg-[#172b29] text-white font-bold text-xs hover:bg-[#203b32]"
                        >
                          Yes, execute
                        </button>
                        <button
                          onClick={() => setIsConfirming(false)}
                          className="px-2 py-1 rounded text-[#50625d] hover:bg-[#dce3db] text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#f8f9f5] dark:bg-[#0f1816] text-xs text-[#50625d] space-y-1">
                  <div className="font-bold text-[#172b29] dark:text-[#f8f9f5] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Resolution Recorded: {selectedItem.status}</span>
                  </div>
                  {selectedItem.resolutionNote && (
                    <p className="italic font-mono text-[11px]">“{selectedItem.resolutionNote}”</p>
                  )}
                  <div className="text-[10px] font-mono">
                    Timestamp: {selectedItem.resolvedAt || 'Just now'} · Cleared via {selectedItem.clearingRail}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
