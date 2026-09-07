'use client';

import React, { useState } from 'react';
import { AgentWithScore, PermissionScope } from '@/lib/types';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Activity, 
  Hash, 
  Eye, 
  Edit3, 
  Terminal, 
  Shield, 
  Sparkles,
  CreditCard,
  FileText,
  BadgeCheck,
  Copy,
  Check,
  Cpu
} from 'lucide-react';
import { translatePermission } from '@/lib/scanner/permissionTranslator';
import { AgentCreditCard } from './AgentCreditCard';
import { evaluateAgentCredit } from '@/lib/scoring/creditEngine';

interface AgentDetailModalProps {
  agent: AgentWithScore | null;
  onClose: () => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ agent, onClose }) => {
  const [activeTab, setActiveTab] = useState<'trust' | 'day0' | 'behavioral' | 'rails' | 'badge'>('trust');
  const [badgeCopied, setBadgeCopied] = useState<boolean>(false);

  if (!agent) return null;

  const { evaluation } = agent;
  const score = evaluation.trustyScore;
  const creditProfile = agent.creditProfile || evaluateAgentCredit(agent, score);

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

  const badgeMarkdown = `[![TRUSTY.BOT Trust & Credit Score](https://trusty-ai.vercel.app/api/badge/${agent.slug})](https://trusty-ai.vercel.app/?q=${agent.slug})`;
  const badgeHtml = `<a href="https://trusty-ai.vercel.app/?q=${agent.slug}"><img src="https://trusty-ai.vercel.app/api/badge/${agent.slug}" alt="TRUSTY.BOT verified score" /></a>`;

  const handleCopyBadge = (text: string) => {
    navigator.clipboard.writeText(text);
    setBadgeCopied(true);
    setTimeout(() => setBadgeCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-5xl security-card rounded-xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col bg-[#090d16] border border-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#070a12] flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-xl font-bold text-white font-mono truncate">{agent.name}</h2>
              {getRiskBadge(evaluation.riskTier)}
              <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-[10px] font-mono text-purple-200 font-bold">
                Tier {creditProfile.creditTier}
              </span>
              {creditProfile.isFileThin ? (
                <span className="px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-[9px] font-mono text-sky-300">
                  DAY-0 THIN FILE
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-[9px] font-mono text-emerald-300">
                  MATURE BEHAVIORAL FILE
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-2 font-mono">
              <span>PUBLISHER: <strong className="text-slate-200 font-semibold">{agent.publisher.name}</strong></span>
              {agent.publisher.verifiedDomain && (
                <span className="text-emerald-400">({agent.publisher.domain} ✓ Verified Org)</span>
              )}
              <span>•</span>
              <span className="uppercase text-slate-400">{agent.framework}</span>
              <span>•</span>
              <span className="uppercase">{agent.sourceEcosystem.replace('_', ' ')}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center overflow-x-auto border-b border-slate-800 bg-slate-950 px-4 py-2 gap-2 text-xs font-mono">
          {[
            { id: 'trust', label: '1. Trust & Permissions', icon: Shield },
            { id: 'day0', label: '2. Day-0 Underwriting (12)', icon: FileText },
            { id: 'behavioral', label: '3. Behavioral File (20)', icon: Activity },
            { id: 'rails', label: '4. Capacity & Rails', icon: CreditCard },
            { id: 'badge', label: '5. Embed Badge', icon: BadgeCheck },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-white font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto text-xs text-slate-300 flex-1">
          {/* TAB 1: TRUST & PERMISSIONS */}
          {activeTab === 'trust' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Dual Score Top Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Score Number: Data Trust */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                    SCORE 01: DATA TRUST
                  </div>
                  <div className="text-4xl sm:text-5xl font-black font-mono my-1 text-emerald-400 tabular-nums">
                    {score}
                    <span className="text-sm font-normal text-slate-500"> / 100</span>
                  </div>
                  <div className="mt-1">
                    {getRiskBadge(evaluation.riskTier)}
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500 font-mono">
                    Security & Provenance
                  </div>
                </div>

                {/* Score Number: Money / Credit */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                    SCORE 02: MONEY / CREDIT
                  </div>
                  <div className="text-4xl sm:text-5xl font-black font-mono my-1 text-purple-400 tabular-nums">
                    {creditProfile.creditScore}
                    <span className="text-sm font-normal text-slate-500"> / 100</span>
                  </div>
                  <div className="mt-1 text-xs font-mono text-purple-300 font-bold">
                    Tier {creditProfile.creditTier} Limit: ${creditProfile.estimatedDailyCapacity.toLocaleString()}/d
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500 font-mono">
                    {creditProfile.isFileThin ? 'Thin-File Underwriting' : 'Observed Behavioral Track'}
                  </div>
                </div>

                {/* Explainability Synthesis */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        AUDIT SYNTHESIS
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Confidence: <strong className="text-white">{evaluation.confidence}%</strong>
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-2.5 rounded border border-slate-800">
                      {evaluation.summaryReasoning}
                    </p>

                    {evaluation.overrideApplied && (
                      <div className="mt-2 p-2 rounded bg-rose-950/40 border border-rose-800/80 text-xs text-rose-200 flex items-start space-x-2">
                        <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-rose-300 uppercase font-mono text-[10px]">Critical Severity Override:</strong>
                          <div className="mt-0.5 text-[11px]">{evaluation.overrideApplied.reason} (Score forced to {evaluation.overrideApplied.cappedScore})</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-400 rounded-full"
                        style={{ width: `${evaluation.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Analyzed Permissions */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 pb-2 border-b border-slate-800">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-300 flex items-center space-x-1.5 font-semibold">
                    <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>ANALYZED CAPABILITIES & SENSITIVE SCOPES ({agent.requestedPermissions?.length || 0})</span>
                  </div>
                  <div className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400">
                    <Sparkles className="w-3 h-3 flex-shrink-0" />
                    <span>Automated AST Code & Manifest Scan</span>
                  </div>
                </div>

                {(!agent.requestedPermissions || agent.requestedPermissions.length === 0) ? (
                  <div className="p-4 text-center text-slate-500 font-mono text-xs">
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
                          className={`p-3 rounded border transition ${
                            isCrit
                              ? 'bg-rose-950/20 border-rose-900/60'
                              : isHigh
                              ? 'bg-amber-950/20 border-amber-900/50'
                              : 'bg-slate-900/80 border-slate-800'
                          }`}
                        >
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
                              <span className="text-xs sm:text-sm font-semibold text-white font-sans truncate">
                                {perm.humanLabel || perm.scope}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1.5 flex-shrink-0 font-mono text-[9px]">
                              <span className={`px-2 py-0.5 rounded uppercase font-medium border ${
                                perm.accessType === 'execute_admin' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                                perm.accessType === 'read_write' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                                'bg-emerald-950 text-emerald-300 border-emerald-800'
                              }`}>
                                {perm.accessType === 'execute_admin' ? 'Host Control (Root)' :
                                 perm.accessType === 'read_write' ? 'Read & Write' : 'Read Only'}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded uppercase font-semibold ${
                                isCrit ? 'bg-rose-950 text-rose-300' :
                                isHigh ? 'bg-amber-950 text-amber-300' :
                                'bg-slate-800 text-slate-400'
                              }`}>
                                {perm.sensitivity}
                              </span>
                            </div>
                          </div>

                          <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-sans">
                            {perm.humanImpact || perm.justification}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* The 5 Dimensions Breakdown */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-3 text-slate-400 font-mono text-[10px] uppercase">
                  <span>5-Dimension Architecture</span>
                  <span>Deterministic 0–100 Scores</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {Object.entries(evaluation.dimensions).map(([key, dim]) => (
                    <div key={key} className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-mono uppercase truncate">{dim.name}</div>
                      <div className="text-base font-mono font-bold text-white mt-1 tabular-nums">
                        {dim.score}<span className="text-[10px] text-slate-500">/100</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full ${getProgressBarColor(dim.score)}`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono mt-1">Weight: {Math.round(dim.weight * 100)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DAY-0 UNDERWRITING (12 SIGNALS) */}
          {activeTab === 'day0' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold">
                    DAY-ZERO PUBLIC INTERNET EVIDENCE
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">
                    12 Evaluated Public Signals for {agent.name}
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-300">
                  Status: <span className="text-sky-300 font-bold">{creditProfile.isFileThin ? 'THIN FILE (43% Confidence)' : 'MATURE (Validated)'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                {(creditProfile.dayZeroSignals || []).map(sig => (
                  <div
                    key={sig.number}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-sky-400">{sig.number}</span>
                        <span className="text-sm font-bold text-white font-sans">{sig.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        sig.status === 'passed' ? 'bg-emerald-950 text-emerald-400' :
                        sig.status === 'neutral' ? 'bg-slate-800 text-slate-300' :
                        'bg-rose-950 text-rose-400'
                      }`}>
                        {sig.score}/100
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">{sig.subtitle}</div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1 border-t border-slate-900">
                      {sig.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BEHAVIORAL CREDIT FILE (20 SIGNALS) */}
          {activeTab === 'behavioral' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
                    OBSERVED ECONOMIC TELEMETRY
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">
                    20 Behavioral Credit File Variables
                  </div>
                </div>
                <div className="text-xs font-mono text-purple-300 font-bold">
                  Recommended Velocity: ${creditProfile.estimatedDailyCapacity.toLocaleString()} USD / Day
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                {(creditProfile.behavioralSignals || []).map(sig => (
                  <div
                    key={sig.number}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-400 font-bold">{sig.number}</span>
                        <span className="text-white font-sans font-semibold">{sig.name}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        sig.status === 'optimal' ? 'bg-emerald-950 text-emerald-400' :
                        sig.status === 'moderate' ? 'bg-amber-950 text-amber-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {sig.currentValue}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Benchmark: {sig.benchmark}
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      {sig.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CAPACITY & RAILS SIMULATOR */}
          {activeTab === 'rails' && (
            <div className="space-y-4 animate-fadeIn">
              <AgentCreditCard
                agentName={agent.name}
                trustScore={score}
                creditProfile={creditProfile}
              />
            </div>
          )}

          {/* TAB 5: EMBED OFFICIAL BADGE */}
          {activeTab === 'badge' && (
            <div className="space-y-6 animate-fadeIn font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                  OFFICIAL TRUSTY BADGE PREVIEW
                </div>
                <div className="p-6 bg-[#04070d] rounded-lg border border-slate-900 flex items-center justify-center">
                  {/* Real Dynamic Badge Image */}
                  <img
                    src={`/api/badge/${agent.slug}`}
                    alt={`${agent.name} Trust & Credit Score`}
                    className="max-w-full h-8"
                  />
                </div>
                <p className="text-xs text-slate-400 font-sans">
                  Embed this SVG badge directly on your GitHub README, documentation, or landing page. The score updates automatically as new audits and transactions occur.
                </p>
              </div>

              {/* Snippets */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>GITHUB MARKDOWN CODE</span>
                    <button
                      onClick={() => handleCopyBadge(badgeMarkdown)}
                      className="text-sky-400 hover:text-sky-300 flex items-center space-x-1"
                    >
                      {badgeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{badgeCopied ? 'Copied!' : 'Copy Markdown'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 overflow-x-auto">
                    <code>{badgeMarkdown}</code>
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>HTML EMBED CODE</span>
                    <button
                      onClick={() => handleCopyBadge(badgeHtml)}
                      className="text-sky-400 hover:text-sky-300 flex items-center space-x-1"
                    >
                      {badgeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{badgeCopied ? 'Copied!' : 'Copy HTML'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 overflow-x-auto">
                    <code>{badgeHtml}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-[#070a12] flex items-center justify-between">
          <div className="text-[10px] text-slate-400 font-mono">
            TRUSTY.BOT Certified Risk & Credit Underwriting Bureau
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
