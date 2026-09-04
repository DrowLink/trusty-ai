'use client';

import React from 'react';
import { AgentWithScore } from '@/lib/types';
import { X, ShieldCheck, AlertTriangle, HelpCircle, CheckCircle2, ShieldAlert, Cpu, Lock, Terminal, FileCode2, ExternalLink, Activity } from 'lucide-react';

interface AgentDetailModalProps {
  agent: AgentWithScore | null;
  onClose: () => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ agent, onClose }) => {
  if (!agent) return null;

  const { evaluation } = agent;
  const score = evaluation.trustyScore;

  const getRiskBadge = (tier: string) => {
    switch (tier) {
      case 'LOW_RISK':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
            🟢 LOW RISK
          </span>
        );
      case 'MEDIUM_RISK':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-700/80">
            <span className="w-2 h-2 rounded-full bg-amber-400 mr-2" />
            🟡 MEDIUM RISK
          </span>
        );
      case 'HIGH_RISK':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-950 text-orange-300 border border-orange-700/80">
            <span className="w-2 h-2 rounded-full bg-orange-400 mr-2" />
            🟠 HIGH RISK
          </span>
        );
      case 'CRITICAL_RISK':
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-700/80 shadow-glow-rose">
            <span className="w-2 h-2 rounded-full bg-rose-400 mr-2 animate-ping" />
            🔴 CRITICAL RISK
          </span>
        );
    }
  };

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (val >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    if (val >= 40) return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getProgressBarColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-400';
    if (val >= 60) return 'bg-amber-400';
    if (val >= 40) return 'bg-orange-400';
    return 'bg-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-900/80 flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">{agent.name}</h2>
              {getRiskBadge(evaluation.riskTier)}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>Publisher: <strong className="text-slate-200">{agent.publisher.name}</strong></span>
              {agent.publisher.verifiedDomain && (
                <span className="text-sky-400">({agent.publisher.domain} ✓ Verified Org)</span>
              )}
              <span>•</span>
              <span className="font-mono uppercase text-sky-300">{agent.framework}</span>
              <span>•</span>
              <span>Ecosystem: <strong className="text-slate-200">{agent.sourceEcosystem.replace('_', ' ')}</strong></span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Top Score Callout Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Score Big Display */}
            <div className="glass-panel-subtle p-5 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
                TRUSTY SCORE
              </div>
              <div className={`text-5xl font-black font-mono my-1 ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {score}
                <span className="text-lg font-normal text-slate-500"> / 100</span>
              </div>
              <div className="mt-2">
                {getRiskBadge(evaluation.riskTier)}
              </div>
              <div className="mt-3 text-[11px] text-slate-400 font-mono">
                Evaluated: {new Date(evaluation.lastEvaluated).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' })}
              </div>
            </div>

            {/* Confidence & Explainability Box */}
            <div className="md:col-span-2 glass-panel-subtle p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Explainability & Rationale</span>
                  </div>
                  <div className="text-xs font-mono text-slate-300">
                    Confidence: <strong className="text-sky-300">{evaluation.confidence}%</strong>
                  </div>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                  {evaluation.summaryReasoning}
                </p>

                {evaluation.overrideApplied && (
                  <div className="mt-3 p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-xs text-rose-200 flex items-start space-x-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-rose-300 uppercase font-mono">Hard Severity Override Triggered:</strong>
                      <div className="mt-0.5">{evaluation.overrideApplied.reason} (Score capped at {evaluation.overrideApplied.cappedScore})</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confidence bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Signal Verification Confidence</span>
                  <span>{evaluation.confidence}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full"
                    style={{ width: `${evaluation.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dimensional Breakdown (The 5 Dimensions) */}
          <div className="glass-panel-subtle p-5 rounded-xl border border-slate-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-4 flex items-center justify-between">
              <span>The Trust Framework — 5 Dimensions Breakdown</span>
              <span className="text-[11px] text-slate-500">20 Total Signals Evaluated</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Dim 1 */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">1. Identity & Provenance</div>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  {evaluation.dimensions.identity.score}<span className="text-xs text-slate-500">/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${getProgressBarColor(evaluation.dimensions.identity.score)}`}
                    style={{ width: `${evaluation.dimensions.identity.score}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1.5">Weight: 25%</div>
              </div>

              {/* Dim 2 */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">2. Permissions & Data</div>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  {evaluation.dimensions.permissions.score}<span className="text-xs text-slate-500">/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${getProgressBarColor(evaluation.dimensions.permissions.score)}`}
                    style={{ width: `${evaluation.dimensions.permissions.score}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1.5">Weight: 30%</div>
              </div>

              {/* Dim 3 */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">3. Security Posture</div>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  {evaluation.dimensions.security.score}<span className="text-xs text-slate-500">/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${getProgressBarColor(evaluation.dimensions.security.score)}`}
                    style={{ width: `${evaluation.dimensions.security.score}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1.5">Weight: 25%</div>
              </div>

              {/* Dim 4 */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">4. Behavior & Gov</div>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  {evaluation.dimensions.governance.score}<span className="text-xs text-slate-500">/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${getProgressBarColor(evaluation.dimensions.governance.score)}`}
                    style={{ width: `${evaluation.dimensions.governance.score}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1.5">Weight: 10%</div>
              </div>

              {/* Dim 5 */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">5. Reputation & Incidents</div>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  {evaluation.dimensions.reputation.score}<span className="text-xs text-slate-500">/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${getProgressBarColor(evaluation.dimensions.reputation.score)}`}
                    style={{ width: `${evaluation.dimensions.reputation.score}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1.5">Weight: 10%</div>
              </div>
            </div>
          </div>

          {/* Positive vs Risk Signals Audit Trail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Positive Signals (✓) */}
            <div className="glass-panel-subtle p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/10">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5 mb-3 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Positive Signals ({evaluation.positiveSignals.length})</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {evaluation.positiveSignals.map((sig, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold flex-shrink-0">✓</span>
                    <span>{sig}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Signals (⚠) */}
            <div className="glass-panel-subtle p-4 rounded-xl border border-rose-900/40 bg-rose-950/10">
              <div className="text-xs font-mono uppercase tracking-wider text-rose-400 flex items-center space-x-1.5 mb-3 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Risk Signals ({evaluation.riskSignals.length})</span>
              </div>
              {evaluation.riskSignals.length === 0 ? (
                <div className="text-xs text-slate-400 italic">No material risk flags identified.</div>
              ) : (
                <ul className="space-y-2 text-xs text-slate-300">
                  {evaluation.riskSignals.map((sig, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold flex-shrink-0">⚠</span>
                      <span>{sig}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Permissions & Declared Tools */}
          <div className="glass-panel-subtle p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3 flex items-center space-x-2">
              <Lock className="w-3.5 h-3.5 text-sky-400" />
              <span>Requested Permissions & Purpose Alignment</span>
            </h4>
            <div className="divide-y divide-slate-800/80">
              {agent.requestedPermissions.map((perm, idx) => (
                <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded font-mono font-semibold ${
                      perm.sensitivity === 'critical' ? 'bg-rose-900 text-rose-200 border border-rose-700' :
                      perm.sensitivity === 'high' ? 'bg-amber-900 text-amber-200 border border-amber-700' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {perm.scope}
                    </span>
                    <span className="text-slate-400">{perm.justification}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">
                    Sensitivity: {perm.sensitivity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Continuous Monitoring & Cryptographic Fingerprint */}
          <div className="glass-panel-subtle p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 font-semibold">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>Continuous Monitoring & Fingerprint</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                agent.fingerprint.isDriftDetected
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {agent.fingerprint.isDriftDetected ? 'DRIFT DETECTED' : 'FINGERPRINT VERIFIED'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cryptographic composite of tool schemas, dependencies lockfile, and outbound endpoints.
            </p>
            <div className="mt-2 text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 break-all">
              Fingerprint: <span className="text-sky-300">{agent.fingerprint.fingerprintId}</span> | Manifest Hash: <span className="text-slate-300">{agent.fingerprint.manifestHash}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            TRUSTY.ai Independent Agent Security Assessment
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 transition"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
