'use client';

import React, { useState } from 'react';
import { VerifiedDecisionRecord } from '@/lib/types';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Download, 
  Search, 
  Filter, 
  FileCode2, 
  ShieldCheck, 
  CreditCard,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

interface DecisionsAuditViewProps {
  decisions: VerifiedDecisionRecord[];
}

export const DecisionsAuditView: React.FC<DecisionsAuditViewProps> = ({
  decisions,
}) => {
  const [filterRail, setFilterRail] = useState<string>('ALL');
  const [filterDecision, setFilterDecision] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDecision, setSelectedDecision] = useState<VerifiedDecisionRecord | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const filtered = decisions.filter(d => {
    if (filterRail !== 'ALL' && d.rail !== filterRail) return false;
    if (filterDecision !== 'ALL' && d.decision !== filterDecision) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.id.toLowerCase().includes(q) ||
        d.agentName.toLowerCase().includes(q) ||
        d.mandateTitle.toLowerCase().includes(q) ||
        d.vendor.toLowerCase().includes(q) ||
        d.cartHash.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const downloadJson = (decision: VerifiedDecisionRecord) => {
    const dataStr = JSON.stringify(decision.proofJson, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trusty-audit-proof-${decision.id}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.08] shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search decisions, agent, mandate, hash..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-1 text-xs">
            <span className="text-slate-400 font-mono text-[10px] uppercase mr-1 hidden sm:inline">Rail:</span>
            {['ALL', 'Brex', 'Ramp', 'Slash'].map(rail => (
              <button
                key={rail}
                onClick={() => setFilterRail(rail)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                  filterRail === rail
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {rail}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1 text-xs">
            {['ALL', 'APPROVED', 'DECLINED'].map(dec => (
              <button
                key={dec}
                onClick={() => setFilterDecision(dec)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                  filterDecision === dec
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {dec}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500">
          Total decisions: <strong className="text-slate-900 dark:text-white">{filtered.length}</strong>
        </div>
      </div>

      {/* Decisions Table */}
      <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111827] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-white/[0.08] text-[11px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Decision &amp; ID</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Agent &amp; Mandate</th>
                <th className="py-3.5 px-4">Vendor</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Clearing Rail</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Audit Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No decisions found for current criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(record => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition cursor-pointer"
                    onClick={() => setSelectedDecision(record)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        {record.decision === 'APPROVED' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        )}
                        <div>
                          <span className={`font-mono font-bold text-[11px] px-1.5 py-0.5 rounded ${
                            record.decision === 'APPROVED'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          }`}>
                            {record.decision}
                          </span>
                          <span className="block font-mono text-[10px] text-slate-400 mt-0.5">
                            {record.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span className="block text-[10px] text-slate-400">
                        {new Date(record.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {record.agentName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                        {record.mandateTitle}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {record.vendor}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                      ${record.amount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800/40">
                        {record.rail}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        record.executionStatus === 'CONFIRMED_ON_RAIL'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                      }`}>
                        {record.executionStatus.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => downloadJson(record)}
                        title="Download verified cryptographic proof (.json)"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal / Drawer */}
      {selectedDecision && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedDecision(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#0d131f] rounded-2xl border border-slate-200 dark:border-white/[0.12] shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.08]">
              <div>
                <span className="font-mono text-xs text-slate-400">Cryptographic Decision Proof</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Record ID: {selectedDecision.id}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadJson(selectedDecision)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>
                <button
                  onClick={() => setSelectedDecision(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.06]">
                <span className="text-slate-500 block font-mono text-[10px] uppercase">Agent ID</span>
                <strong className="text-slate-900 dark:text-white">{selectedDecision.agentName}</strong>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.06]">
                <span className="text-slate-500 block font-mono text-[10px] uppercase">Mandate</span>
                <strong className="text-slate-900 dark:text-white">{selectedDecision.mandateTitle}</strong>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.06]">
                <span className="text-slate-500 block font-mono text-[10px] uppercase">Amount &amp; Rail</span>
                <strong className="text-slate-900 dark:text-white">${selectedDecision.amount.toLocaleString()} ({selectedDecision.rail})</strong>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.06]">
                <span className="text-slate-500 block font-mono text-[10px] uppercase">Clearing Status</span>
                <strong className="text-emerald-600 dark:text-emerald-400">{selectedDecision.executionStatus}</strong>
              </div>
            </div>

            {/* Criteria summary */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">Evaluated Intent Criteria:</span>
              <div className="space-y-1">
                {selectedDecision.criteria.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/[0.04]">
                    <span>{c.name}: {c.actual}</span>
                    <span className={`font-mono text-[10px] font-bold ${c.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {c.passed ? 'MATCH' : 'MISMATCH'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hash Display */}
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 font-mono text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px] uppercase">Cart SHA-256 Hash:</span>
                <button
                  onClick={() => copyHash(selectedDecision.cartHash)}
                  className="text-blue-600 dark:text-sky-400 text-[11px] flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 break-all">
                {selectedDecision.cartHash}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-40">
              <pre>{JSON.stringify(selectedDecision.proofJson, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
