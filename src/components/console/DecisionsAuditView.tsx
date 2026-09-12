'use client';

import React, { useState } from 'react';
import { VerifiedDecisionRecord } from '@/lib/types';
import { 
  CheckCircle2, 
  XCircle, 
  Download, 
  Search, 
  Copy, 
  Check,
  FileCheck2
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

  // SAAS CLEAN EMPTY STATE
  if (decisions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#14221e] border border-[#dce3db] dark:border-[#21352e] shadow-sm text-center max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#e9eddf] dark:bg-[#1c302a] text-[#203b32] dark:text-[#c5e86c] flex items-center justify-center mx-auto">
            <FileCheck2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#172b29] dark:text-[#f8f9f5]">
              Audit Trail Ready
            </h3>
            <p className="text-xs text-[#50625d] dark:text-[#9cb0a8] max-w-md mx-auto leading-relaxed">
              No decisions recorded yet. Once autonomous agents evaluate transactions against your human mandates, tamper-evident cryptographic decision proofs will be stored here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#14221e] border border-[#dce3db] dark:border-[#21352e] shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#50625d]" />
            <input
              type="text"
              placeholder="Search decisions, agent, mandate, hash..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#dce3db] dark:border-[#21352e] bg-[#f8f9f5] dark:bg-[#0f1816] text-[#172b29] dark:text-[#f8f9f5] focus:outline-none focus:ring-2 focus:ring-[#203b32]"
            />
          </div>

          <div className="flex items-center space-x-1 text-xs">
            <span className="text-[#50625d] font-mono text-[10px] uppercase mr-1 hidden sm:inline">Rail:</span>
            {['ALL', 'Brex', 'Ramp', 'Slash'].map(rail => (
              <button
                key={rail}
                onClick={() => setFilterRail(rail)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                  filterRail === rail
                    ? 'bg-[#172b29] dark:bg-[#c5e86c] text-white dark:text-[#172b29] font-bold'
                    : 'bg-[#f8f9f5] dark:bg-[#1c302a] text-[#50625d] dark:text-[#9cb0a8] hover:bg-[#e9eddf]'
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
                    ? 'bg-[#203b32] text-white font-bold'
                    : 'bg-[#f8f9f5] dark:bg-[#1c302a] text-[#50625d] dark:text-[#9cb0a8] hover:bg-[#e9eddf]'
                }`}
              >
                {dec}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-[#50625d]">
          Decisions: <strong className="text-[#172b29] dark:text-[#f8f9f5]">{filtered.length}</strong>
        </div>
      </div>

      {/* Decisions Table */}
      <div className="rounded-xl border border-[#dce3db] dark:border-[#21352e] bg-white dark:bg-[#14221e] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f9f5] dark:bg-[#0f1816] border-b border-[#dce3db] dark:border-[#21352e] text-[11px] font-mono uppercase text-[#50625d] font-semibold tracking-wider">
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
            <tbody className="divide-y divide-[#dce3db] dark:divide-[#21352e]">
              {filtered.map(record => (
                <tr
                  key={record.id}
                  className="hover:bg-[#f8f9f5] dark:hover:bg-[#1a2c27] transition cursor-pointer"
                  onClick={() => setSelectedDecision(record)}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      {record.decision === 'APPROVED' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      )}
                      <div>
                        <span className={`font-mono font-bold text-[11px] px-1.5 py-0.5 rounded ${
                          record.decision === 'APPROVED'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        }`}>
                          {record.decision}
                        </span>
                        <span className="block font-mono text-[10px] text-[#50625d] mt-0.5">
                          {record.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#50625d] whitespace-nowrap">
                    {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <span className="block text-[10px] text-[#50625d]">
                      {new Date(record.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#172b29] dark:text-[#f8f9f5]">
                      {record.agentName}
                    </div>
                    <div className="text-[11px] text-[#50625d] truncate max-w-[200px]">
                      {record.mandateTitle}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-[#172b29] dark:text-[#f8f9f5]">
                    {record.vendor}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold tabular-nums text-[#172b29] dark:text-[#f8f9f5]">
                    ${record.amount.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#e9eddf] dark:bg-[#1c302a] text-[#172b29] dark:text-[#c5e86c] font-semibold border border-[#dce3db] dark:border-[#21352e]">
                      {record.rail}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      record.executionStatus === 'CONFIRMED_ON_RAIL'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    }`}>
                      {record.executionStatus.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => downloadJson(record)}
                      title="Download verified cryptographic proof (.json)"
                      className="p-1.5 rounded-lg border border-[#dce3db] dark:border-[#21352e] hover:bg-[#e9eddf] dark:hover:bg-[#1c302a] text-[#50625d] hover:text-[#172b29] transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDecision && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedDecision(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#14221e] rounded-2xl border border-[#dce3db] dark:border-[#21352e] shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#dce3db] dark:border-[#21352e]">
              <div>
                <span className="font-mono text-xs text-[#50625d]">Cryptographic Decision Proof</span>
                <h3 className="text-base font-bold text-[#172b29] dark:text-[#f8f9f5] mt-0.5">
                  Record ID: {selectedDecision.id}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadJson(selectedDecision)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#172b29] hover:bg-[#203b32] transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>
                <button
                  onClick={() => setSelectedDecision(null)}
                  className="p-1.5 rounded-lg text-[#50625d] hover:text-[#172b29]"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-[#f8f9f5] dark:bg-[#0f1816] border border-[#dce3db] dark:border-[#21352e]">
                <span className="text-[#50625d] block font-mono text-[10px] uppercase">Agent ID</span>
                <strong className="text-[#172b29] dark:text-[#f8f9f5]">{selectedDecision.agentName}</strong>
              </div>

              <div className="p-3 rounded-lg bg-[#f8f9f5] dark:bg-[#0f1816] border border-[#dce3db] dark:border-[#21352e]">
                <span className="text-[#50625d] block font-mono text-[10px] uppercase">Mandate</span>
                <strong className="text-[#172b29] dark:text-[#f8f9f5]">{selectedDecision.mandateTitle}</strong>
              </div>

              <div className="p-3 rounded-lg bg-[#f8f9f5] dark:bg-[#0f1816] border border-[#dce3db] dark:border-[#21352e]">
                <span className="text-[#50625d] block font-mono text-[10px] uppercase">Amount &amp; Rail</span>
                <strong className="text-[#172b29] dark:text-[#f8f9f5]">${selectedDecision.amount.toLocaleString()} ({selectedDecision.rail})</strong>
              </div>

              <div className="p-3 rounded-lg bg-[#f8f9f5] dark:bg-[#0f1816] border border-[#dce3db] dark:border-[#21352e]">
                <span className="text-[#50625d] block font-mono text-[10px] uppercase">Clearing Status</span>
                <strong className="text-emerald-700 dark:text-emerald-300">{selectedDecision.executionStatus}</strong>
              </div>
            </div>

            {/* Criteria summary */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#172b29] dark:text-[#f8f9f5]">Evaluated Intent Criteria:</span>
              <div className="space-y-1">
                {selectedDecision.criteria.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-[#f8f9f5] dark:bg-[#0f1816] border border-[#dce3db] dark:border-[#21352e]">
                    <span>{c.name}: {c.actual}</span>
                    <span className={`font-mono text-[10px] font-bold ${c.passed ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                      {c.passed ? 'MATCH' : 'MISMATCH'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hash Display */}
            <div className="p-3 rounded-lg bg-[#f8f9f5] dark:bg-[#0f1816] font-mono text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[#50625d] text-[10px] uppercase">Cart SHA-256 Hash:</span>
                <button
                  onClick={() => copyHash(selectedDecision.cartHash)}
                  className="text-[#203b32] dark:text-[#c5e86c] text-[11px] flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[#172b29] dark:text-[#f8f9f5] break-all">
                {selectedDecision.cartHash}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0e1715] text-[#dce3db] font-mono text-[11px] overflow-x-auto max-h-40">
              <pre>{JSON.stringify(selectedDecision.proofJson, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
