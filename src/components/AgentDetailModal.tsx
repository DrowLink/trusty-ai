'use client';

import React from 'react';
import { AgentWithScore, PermissionScope } from '@/lib/types';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Lock, Activity, Hash, Eye, Edit3, Terminal, Shield, Sparkles } from 'lucide-react';
import { translatePermission } from '@/lib/scanner/permissionTranslator';
import { AgentCreditCard } from './AgentCreditCard';
import { evaluateAgentCredit } from '@/lib/scoring/creditEngine';

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
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
            LOW RISK
          </span>
        );
      case 'MEDIUM_RISK':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-950/60 text-amber-300 border border-amber-800/80 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5" />
            MEDIUM RISK
          </span>
        );
      case 'HIGH_RISK':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-orange-950/60 text-orange-300 border border-orange-800/80 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-1.5" />
            HIGH RISK
          </span>
        );
      case 'CRITICAL_RISK':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-rose-950/80 text-rose-300 border border-rose-800 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5 animate-pulse" />
            CRITICAL RISK
          </span>
        );
    }
  };

  const getProgressBarColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-500';
    if (val >= 60) return 'bg-amber-500';
    if (val >= 40) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-4xl security-card rounded-lg shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-zinc-950 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-xl font-bold text-zinc-100 font-mono truncate">{agent.name}</h2>
              {getRiskBadge(evaluation.riskTier)}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 flex flex-wrap items-center gap-2 font-mono">
              <span>PUBLISHER: <strong className="text-zinc-300 font-semibold">{agent.publisher.name}</strong></span>
              {agent.publisher.verifiedDomain && (
                <span className="text-emerald-400">({agent.publisher.domain} ✓ Org)</span>
              )}
              <span>•</span>
              <span className="uppercase text-zinc-400">{agent.framework}</span>
              <span>•</span>
              <span className="uppercase">{agent.sourceEcosystem.replace('_', ' ')}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto text-xs text-zinc-300">
          {/* Top Score & Executive Synthesis Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Score Number */}
            <div className="p-4 rounded bg-zinc-950 border border-white/[0.08] flex flex-col items-center justify-center text-center">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                TRUSTY RATING
              </div>
              <div className="text-4xl sm:text-5xl font-bold font-mono my-1 text-zinc-100 tabular-nums">
                {score}
                <span className="text-sm font-normal text-zinc-600"> / 100</span>
              </div>
              <div className="mt-1">
                {getRiskBadge(evaluation.riskTier)}
              </div>
              <div className="mt-2 text-[10px] text-zinc-500 font-mono">
                Evaluated: {new Date(evaluation.lastEvaluated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            {/* Explainability Synthesis */}
            <div className="md:col-span-2 p-4 rounded bg-zinc-950 border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    AUDIT SYNTHESIS & REASONING
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Confidence: <strong className="text-zinc-200">{evaluation.confidence}%</strong>
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans bg-zinc-900/60 p-3 rounded border border-white/[0.06]">
                  {evaluation.summaryReasoning}
                </p>

                {evaluation.overrideApplied && (
                  <div className="mt-2.5 p-2.5 rounded bg-rose-950/40 border border-rose-800/80 text-xs text-rose-200 flex items-start space-x-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-rose-300 uppercase font-mono text-[10px]">Critical Severity Override:</strong>
                      <div className="mt-0.5 text-[11px]">{evaluation.overrideApplied.reason} (Score forced to {evaluation.overrideApplied.cappedScore})</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confidence progress */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                  <span>Signal Telemetry Confidence</span>
                  <span>{evaluation.confidence}%</span>
                </div>
                <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-300 rounded-full"
                    style={{ width: `${evaluation.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Part 2 & Part 3: Agent Credit Profile & Payment Rails Simulator */}
          <AgentCreditCard
            agentName={agent.name}
            trustScore={score}
            creditProfile={agent.creditProfile || evaluateAgentCredit(agent, score)}
          />

          {/* Section 2: ANALYZED CAPABILITIES & PERMISSIONS (MOVED TO TOP) */}
          <div className="p-3.5 sm:p-4 rounded bg-zinc-950 border border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 pb-2 border-b border-white/[0.06]">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-300 flex items-center space-x-1.5 font-semibold">
                <Lock className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                <span>ANALYZED CAPABILITIES & PERMISSIONS (EXPLAINED)</span>
              </div>
              <div className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400">
                <Sparkles className="w-3 h-3 flex-shrink-0" />
                <span>Automated Code & Manifest Scan</span>
              </div>
            </div>

            {(!agent.requestedPermissions || agent.requestedPermissions.length === 0) ? (
              <div className="p-4 text-center text-zinc-500 font-mono text-xs">
                No requested permissions or sensitive scopes declared.
              </div>
            ) : (
              <div className="space-y-2.5">
                {agent.requestedPermissions.map((rawPerm, idx) => {
                  const perm = rawPerm.humanLabel
                    ? rawPerm
                    : translatePermission(rawPerm.scope, rawPerm.justification, rawPerm.detectedVia);

                  const isCrit = perm.sensitivity === 'critical' || perm.isHighRisk;
                  const isHigh = perm.sensitivity === 'high';

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 sm:p-3 rounded border transition ${
                        isCrit
                          ? 'bg-rose-950/20 border-rose-900/60'
                          : isHigh
                          ? 'bg-amber-950/20 border-amber-900/50'
                          : 'bg-zinc-900/80 border-white/[0.06]'
                      }`}
                    >
                      {/* Card Header: Human Title + Access Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2 min-w-0">
                          <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                            perm.accessType === 'execute_admin' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                            perm.accessType === 'read_write' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}>
                            {perm.accessType === 'execute_admin' ? <Terminal className="w-3 h-3" /> :
                             perm.accessType === 'read_write' ? <Edit3 className="w-3 h-3" /> :
                             <Eye className="w-3 h-3" />}
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-zinc-100 font-sans truncate">
                            {perm.humanLabel || perm.scope}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1.5 flex-shrink-0">
                          {/* Access Type Badge */}
                          <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-medium border ${
                            perm.accessType === 'execute_admin'
                              ? 'bg-rose-950 text-rose-300 border-rose-800'
                              : perm.accessType === 'read_write'
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          }`}>
                            {perm.accessType === 'execute_admin' ? 'Host Control (Root)' :
                             perm.accessType === 'read_write' ? 'Read & Write' :
                             'Read Only'}
                          </span>

                          {/* Sensitivity Pill */}
                          <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] uppercase font-semibold ${
                            isCrit ? 'bg-rose-950/80 text-rose-300' :
                            isHigh ? 'bg-amber-950/80 text-amber-300' :
                            'bg-zinc-800 text-zinc-400'
                          }`}>
                            {perm.sensitivity}
                          </span>
                        </div>
                      </div>

                      {/* Real-World Blast Radius Impact Explanation */}
                      <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed font-sans">
                        {perm.humanImpact || perm.justification}
                      </p>

                      {/* Footer: Technical Scope & Detection Origin */}
                      <div className="mt-2 pt-1.5 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono text-zinc-500">
                        <div className="flex items-center space-x-1">
                          <span className="text-zinc-600">API Scope:</span>
                          <code className="text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-white/[0.06]">
                            {perm.scope}
                          </code>
                        </div>

                        {perm.detectedVia && (
                          <span className="text-zinc-400 truncate max-w-full">
                            Source: <span className="text-zinc-300">{perm.detectedVia}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: The 5 Dimensions */}
          <div className="p-4 rounded bg-zinc-950 border border-white/[0.08]">
            <div className="flex items-center justify-between mb-3 text-zinc-400 font-mono text-[10px] uppercase">
              <span>Dimension Breakdown</span>
              <span>20 Evaluated Signals</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {/* 1 */}
              <div className="p-2.5 rounded bg-zinc-900 border border-white/[0.06]">
                <div className="text-[10px] text-zinc-400 font-mono truncate">1. Identity</div>
                <div className="text-base font-mono font-bold text-zinc-200 mt-1 tabular-nums">
                  {evaluation.dimensions.identity.score}<span className="text-[10px] text-zinc-600">/100</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full ${getProgressBarColor(evaluation.dimensions.identity.score)}`}
                    style={{ width: `${evaluation.dimensions.identity.score}%` }}
                  />
                </div>
                <div className="text-[9px] text-zinc-500 font-mono mt-1">Weight: 25%</div>
              </div>

              {/* 2 */}
              <div className="p-2.5 rounded bg-zinc-900 border border-white/[0.06]">
                <div className="text-[10px] text-zinc-400 font-mono truncate">2. Permissions</div>
                <div className="text-base font-mono font-bold text-zinc-200 mt-1 tabular-nums">
                  {evaluation.dimensions.permissions.score}<span className="text-[10px] text-zinc-600">/100</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full ${getProgressBarColor(evaluation.dimensions.permissions.score)}`}
                    style={{ width: `${evaluation.dimensions.permissions.score}%` }}
                  />
                </div>
                <div className="text-[9px] text-zinc-500 font-mono mt-1">Weight: 30%</div>
              </div>

              {/* 3 */}
              <div className="p-2.5 rounded bg-zinc-900 border border-white/[0.06]">
                <div className="text-[10px] text-zinc-400 font-mono truncate">3. Security</div>
                <div className="text-base font-mono font-bold text-zinc-200 mt-1 tabular-nums">
                  {evaluation.dimensions.security.score}<span className="text-[10px] text-zinc-600">/100</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full ${getProgressBarColor(evaluation.dimensions.security.score)}`}
                    style={{ width: `${evaluation.dimensions.security.score}%` }}
                  />
                </div>
                <div className="text-[9px] text-zinc-500 font-mono mt-1">Weight: 25%</div>
              </div>

              {/* 4 */}
              <div className="p-2.5 rounded bg-zinc-900 border border-white/[0.06]">
                <div className="text-[10px] text-zinc-400 font-mono truncate">4. Governance</div>
                <div className="text-base font-mono font-bold text-zinc-200 mt-1 tabular-nums">
                  {evaluation.dimensions.governance.score}<span className="text-[10px] text-zinc-600">/100</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full ${getProgressBarColor(evaluation.dimensions.governance.score)}`}
                    style={{ width: `${evaluation.dimensions.governance.score}%` }}
                  />
                </div>
                <div className="text-[9px] text-zinc-500 font-mono mt-1">Weight: 10%</div>
              </div>

              {/* 5 */}
              <div className="col-span-2 sm:col-span-1 p-2.5 rounded bg-zinc-900 border border-white/[0.06]">
                <div className="text-[10px] text-zinc-400 font-mono truncate">5. Reputation</div>
                <div className="text-base font-mono font-bold text-zinc-200 mt-1 tabular-nums">
                  {evaluation.dimensions.reputation.score}<span className="text-[10px] text-zinc-600">/100</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full ${getProgressBarColor(evaluation.dimensions.reputation.score)}`}
                    style={{ width: `${evaluation.dimensions.reputation.score}%` }}
                  />
                </div>
                <div className="text-[9px] text-zinc-500 font-mono mt-1">Weight: 10%</div>
              </div>
            </div>
          </div>

          {/* Section 4: Positive vs Risk Signals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Positive */}
            <div className="p-3.5 rounded bg-zinc-950 border border-emerald-900/30">
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5 mb-2 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Verified Positive Indicators ({evaluation.positiveSignals.length})</span>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {evaluation.positiveSignals.map((sig, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold flex-shrink-0">✓</span>
                    <span className="text-[11px] leading-snug">{sig}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk */}
            <div className="p-3.5 rounded bg-zinc-950 border border-rose-900/30">
              <div className="text-[10px] font-mono uppercase tracking-wider text-rose-400 flex items-center space-x-1.5 mb-2 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Material Risk Findings ({evaluation.riskSignals.length})</span>
              </div>
              {evaluation.riskSignals.length === 0 ? (
                <div className="text-xs text-zinc-500 italic font-mono">No material risk flags identified.</div>
              ) : (
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {evaluation.riskSignals.map((sig, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold flex-shrink-0">⚠</span>
                      <span className="text-[11px] leading-snug">{sig}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Section 5: Cryptographic Fingerprint */}
          <div className="p-3.5 rounded bg-zinc-950 border border-white/[0.08]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-1.5 text-[10px] font-mono text-zinc-400 font-semibold uppercase">
                <Hash className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                <span>Cryptographic Fingerprint & Continuous Drift</span>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.2 rounded border ${
                agent.fingerprint.isDriftDetected
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {agent.fingerprint.isDriftDetected ? 'DRIFT DETECTED' : 'FINGERPRINT VERIFIED'}
              </span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400 bg-zinc-900 p-2 rounded border border-white/[0.06] break-all">
              ID: <span className="text-zinc-200">{agent.fingerprint.fingerprintId}</span> | Manifest: <span className="text-zinc-400">{agent.fingerprint.manifestHash}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-white/[0.08] bg-zinc-950 flex items-center justify-between">
          <div className="text-[10px] text-zinc-500 font-mono">
            TRUSTY.ai Certified Audit Engine
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs font-mono text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] transition"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
