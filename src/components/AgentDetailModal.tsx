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
  Cpu,
  ShieldCheck,
  ExternalLink,
  ChevronRight
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Low Risk
          </span>
        );
      case 'MEDIUM_RISK':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Medium Risk
          </span>
        );
      case 'HIGH_RISK':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200/80 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5" />
            High Risk
          </span>
        );
      case 'CRITICAL_RISK':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
            Critical Risk
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

  const badgeMarkdown = `[![TRUSTY.bot Trust & Credit Score](https://trusty-ai.vercel.app/api/badge/${agent.slug})](https://trusty-ai.vercel.app/?q=${agent.slug})`;
  const badgeHtml = `<a href="https://trusty-ai.vercel.app/?q=${agent.slug}"><img src="https://trusty-ai.vercel.app/api/badge/${agent.slug}" alt="TRUSTY.bot verified score" /></a>`;

  const handleCopyBadge = (text: string) => {
    navigator.clipboard.writeText(text);
    setBadgeCopied(true);
    setTimeout(() => setBadgeCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-5xl rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden my-auto max-h-[94vh] flex flex-col bg-white dark:bg-[#0d131f] border border-slate-200/90 dark:border-white/[0.08] transition-all">
        
        {/* Modern Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#070a12] flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-sans tracking-tight truncate">
                {agent.name}
              </h2>
              {getRiskBadge(evaluation.riskTier)}
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200/80 dark:bg-blue-950/60 dark:border-blue-800/60 text-xs font-bold font-sans">
                Tier {creditProfile.creditTier}
              </span>
              {creditProfile.isFileThin ? (
                <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 dark:bg-sky-950/60 dark:border-sky-800/60 text-[11px] font-mono font-medium">
                  Day-Zero Thin File
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/60 dark:border-emerald-800/60 text-[11px] font-mono font-medium">
                  Mature Behavioral File
                </span>
              )}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex flex-wrap items-center gap-2 font-sans">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Publisher: <strong className="font-semibold text-slate-900 dark:text-white">{agent.publisher.name}</strong>
              </span>
              {agent.publisher.verifiedDomain && (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center space-x-1">
                  <span>({agent.publisher.domain}</span>
                  <CheckCircle2 className="w-3 h-3 inline" />
                  <span>Verified Org)</span>
                </span>
              )}
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="uppercase text-[11px] font-mono text-slate-500 dark:text-slate-400">{agent.framework}</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="capitalize text-[11px] text-slate-500 dark:text-slate-400">{agent.sourceEcosystem.replace('_', ' ')}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 dark:hover:text-white dark:hover:bg-white/[0.08] transition flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Strip (Segmented Brex/Linear style) */}
        <div className="flex items-center overflow-x-auto border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-100/70 dark:bg-[#090d16] px-4 sm:px-6 py-2.5 gap-1.5 no-scrollbar font-sans text-xs">
          {[
            { id: 'trust', label: 'Trust & Permissions', icon: Shield },
            { id: 'day0', label: 'Day-0 Underwriting', icon: FileText, count: '12' },
            { id: 'behavioral', label: 'Behavioral File', icon: Activity, count: '20' },
            { id: 'rails', label: 'Capacity & Rails', icon: CreditCard },
            { id: 'badge', label: 'Embed Badge', icon: BadgeCheck },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white dark:bg-[#0d131f] text-[#0066FF] dark:text-[#38bdf8] shadow-xs border border-slate-200/80 dark:border-white/[0.1]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/40 dark:hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0066FF] dark:text-[#38bdf8]' : 'opacity-70'}`} />
                <span>{tab.label}</span>
                {tab.count && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-sky-300' : 'bg-slate-200/60 dark:bg-white/[0.08] text-slate-500 dark:text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto text-xs text-slate-700 dark:text-slate-300 flex-1 bg-[#fafafa] dark:bg-transparent">
          
          {/* TAB 1: TRUST & PERMISSIONS */}
          {activeTab === 'trust' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Dual Score Top Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Metric 1: Data Trust */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-xs flex flex-col items-center justify-center text-center">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans mb-1.5">
                    Data Trust Score
                  </div>
                  <div className="text-4xl sm:text-5xl font-black font-sans my-1 text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
                    {score}
                    <span className="text-sm font-normal text-slate-400 dark:text-slate-500"> / 100</span>
                  </div>
                  <div className="mt-1.5">
                    {getRiskBadge(evaluation.riskTier)}
                  </div>
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-sans">
                    Security, Scopes &amp; Sandboxing
                  </div>
                </div>

                {/* Metric 2: Money / Credit */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-xs flex flex-col items-center justify-center text-center">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans mb-1.5">
                    Economic Credit Rating
                  </div>
                  <div className="text-4xl sm:text-5xl font-black font-sans my-1 text-[#0066FF] dark:text-[#38bdf8] tabular-nums tracking-tight">
                    {creditProfile.creditScore}
                    <span className="text-sm font-normal text-slate-400 dark:text-slate-500"> / 100</span>
                  </div>
                  <div className="mt-1.5 text-xs font-semibold text-slate-900 dark:text-white font-sans">
                    Tier {creditProfile.creditTier} • Cap: <span className="font-mono font-bold">${creditProfile.estimatedDailyCapacity.toLocaleString()}/d</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-sans">
                    {creditProfile.isFileThin ? 'Thin-File Underwriting' : 'Observed Behavioral Track'}
                  </div>
                </div>

                {/* Metric 3: Explainability Synthesis */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-sans">
                        Audit Synthesis
                      </span>
                      <span className="text-xs font-sans text-slate-500 dark:text-slate-400">
                        Confidence: <strong className="text-slate-900 dark:text-white font-mono">{evaluation.confidence}%</strong>
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-slate-50 dark:bg-white/[0.03] p-3 rounded-xl border border-slate-200/70 dark:border-white/[0.06]">
                      {evaluation.summaryReasoning}
                    </p>

                    {evaluation.overrideApplied && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200/80 text-xs text-rose-800 dark:bg-rose-950/40 dark:border-rose-800/80 dark:text-rose-200 flex items-start space-x-2.5">
                        <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-rose-700 dark:text-rose-300 uppercase font-sans text-[10px] tracking-wider font-bold">
                            Critical Security Override:
                          </strong>
                          <div className="mt-0.5 text-xs font-sans">{evaluation.overrideApplied.reason} (Score forced to {evaluation.overrideApplied.cappedScore})</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-white/[0.08] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0066FF] dark:bg-[#38bdf8] rounded-full transition-all duration-500"
                        style={{ width: `${evaluation.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Analyzed Permissions Section */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-4 pb-3 border-b border-slate-200/70 dark:border-white/[0.08]">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-2 font-sans">
                    <Lock className="w-4 h-4 text-[#0066FF] dark:text-[#38bdf8] flex-shrink-0" />
                    <span>Analyzed Capabilities &amp; Sensitive Scopes ({agent.requestedPermissions?.length || 0})</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-sans">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Automated AST Code &amp; Manifest Scan</span>
                  </div>
                </div>

                {(!agent.requestedPermissions || agent.requestedPermissions.length === 0) ? (
                  <div className="p-6 text-center text-slate-400 dark:text-slate-500 font-sans text-xs">
                    No requested permissions or sensitive scopes declared.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {agent.requestedPermissions.map((rawPerm, idx) => {
                      const perm = rawPerm.humanLabel
                        ? rawPerm
                        : translatePermission(rawPerm.scope, rawPerm.justification, rawPerm.detectedVia);

                      const isCrit = perm.sensitivity === 'critical' || perm.isHighRisk;
                      const isHigh = perm.sensitivity === 'high';

                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border transition-all ${
                            isCrit
                              ? 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/60'
                              : isHigh
                              ? 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50'
                              : 'bg-slate-50/80 border-slate-200/70 dark:bg-white/[0.02] dark:border-white/[0.06]'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                perm.accessType === 'execute_admin' ? 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800' :
                                perm.accessType === 'read_write' ? 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800' :
                                'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800'
                              }`}>
                                {perm.accessType === 'execute_admin' ? <Terminal className="w-3.5 h-3.5" /> :
                                 perm.accessType === 'read_write' ? <Edit3 className="w-3.5 h-3.5" /> :
                                 <Eye className="w-3.5 h-3.5" />}
                              </div>
                              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-sans truncate">
                                {perm.humanLabel || perm.scope}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 flex-shrink-0 font-sans text-xs">
                              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                perm.accessType === 'execute_admin' ? 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800' :
                                perm.accessType === 'read_write' ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800' :
                                'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                              }`}>
                                {perm.accessType === 'execute_admin' ? 'Host Control (Root)' :
                                 perm.accessType === 'read_write' ? 'Read & Write' : 'Read Only'}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                                isCrit ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                                isHigh ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                                'bg-slate-200 text-slate-700 dark:bg-white/[0.08] dark:text-slate-300'
                              }`}>
                                {perm.sensitivity}
                              </span>
                            </div>
                          </div>

                          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                            {perm.humanImpact || perm.justification}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* The 5 Dimensions Breakdown */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-xs">
                <div className="flex items-center justify-between mb-4 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-sans">
                  <span>5-Dimension Architecture</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Deterministic 0–100 Engine</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {Object.entries(evaluation.dimensions).map(([key, dim]) => (
                    <div key={key} className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.06]">
                      <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase font-sans truncate">{dim.name}</div>
                      <div className="text-xl font-bold font-sans text-slate-900 dark:text-white mt-1 tabular-nums">
                        {dim.score}<span className="text-xs font-normal text-slate-400 dark:text-slate-500">/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-white/[0.08] rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getProgressBarColor(dim.score)}`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-1.5 font-medium">Weight: {Math.round(dim.weight * 100)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DAY-0 UNDERWRITING (12 SIGNALS) */}
          {activeTab === 'day0' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-600 to-[#0066FF] text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-sky-100 font-sans">
                    Day-Zero Public Internet Evidence
                  </div>
                  <div className="text-lg font-black tracking-tight text-white mt-0.5 font-sans">
                    12 Evaluated Public Signals for {agent.name}
                  </div>
                </div>
                <div className="text-xs font-sans text-white/90">
                  Status: <span className="text-white font-bold">{creditProfile.isFileThin ? 'Thin File (43% Confidence)' : 'Mature (Validated)'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
                {(creditProfile.dayZeroSignals || []).map(sig => (
                  <div
                    key={sig.number}
                    className="p-4 rounded-2xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-xs flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md">
                          #{sig.number}
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white font-sans">{sig.name}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        sig.status === 'passed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        sig.status === 'neutral' ? 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-white/[0.06] dark:text-slate-300' :
                        'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {sig.score}/100
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 font-sans">{sig.subtitle}</div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed pt-2 border-t border-slate-100 dark:border-white/[0.06]">
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
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0066FF] to-sky-500 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100 font-sans">
                    Observed Economic Telemetry
                  </div>
                  <div className="text-lg font-black tracking-tight text-white mt-0.5 font-sans">
                    20 Behavioral Credit File Variables
                  </div>
                </div>
                <div className="text-xs font-sans text-blue-100">
                  Recommended Velocity: <span className="text-white font-bold font-mono">${creditProfile.estimatedDailyCapacity.toLocaleString()} USD / Day</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs">
                {(creditProfile.behavioralSignals || []).map(sig => (
                  <div
                    key={sig.number}
                    className="p-4 rounded-2xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-xs flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
                          #{sig.number}
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white font-sans">{sig.name}</span>
                      </div>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        sig.status === 'optimal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        sig.status === 'moderate' ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-white/[0.06] dark:text-slate-300'
                      }`}>
                        {sig.currentValue}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                      Benchmark: <span className="font-semibold text-slate-700 dark:text-slate-300">{sig.benchmark}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed pt-1.5 border-t border-slate-100 dark:border-white/[0.06]">
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
            <div className="space-y-6 animate-fadeIn font-sans">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-xs space-y-3">
                <div className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold font-sans">
                  Official TRUSTY.bot Badge Preview
                </div>
                <div className="p-6 bg-slate-50 dark:bg-[#04070d] rounded-xl border border-slate-200 dark:border-white/[0.08] flex items-center justify-center">
                  <img
                    src={`/api/badge/${agent.slug}`}
                    alt={`${agent.name} Trust & Credit Score`}
                    className="max-w-full h-8 drop-shadow-xs"
                  />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                  Embed this dynamic SVG badge directly in your GitHub README, documentation, or landing page. Scores reflect live evaluations and behavioral underwriting in real time.
                </p>
              </div>

              {/* Code Snippets */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 mb-1.5 font-sans font-semibold">
                    <span>GitHub Markdown Code</span>
                    <button
                      onClick={() => handleCopyBadge(badgeMarkdown)}
                      className="text-[#0066FF] hover:underline dark:text-[#38bdf8] flex items-center space-x-1"
                    >
                      {badgeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{badgeCopied ? 'Copied!' : 'Copy Markdown'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 bg-slate-50 dark:bg-[#04070d] border border-slate-200 dark:border-white/[0.08] rounded-xl text-xs text-slate-800 dark:text-slate-200 font-mono overflow-x-auto">
                    <code>{badgeMarkdown}</code>
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 mb-1.5 font-sans font-semibold">
                    <span>HTML Embed Code</span>
                    <button
                      onClick={() => handleCopyBadge(badgeHtml)}
                      className="text-[#0066FF] hover:underline dark:text-[#38bdf8] flex items-center space-x-1"
                    >
                      {badgeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{badgeCopied ? 'Copied!' : 'Copy HTML'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 bg-slate-50 dark:bg-[#04070d] border border-slate-200 dark:border-white/[0.08] rounded-xl text-xs text-slate-800 dark:text-slate-200 font-mono overflow-x-auto">
                    <code>{badgeHtml}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* High-Craft Institutional Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#070a12] flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-sans flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>TRUSTY.bot™ Certified Agent Risk &amp; Credit Underwriting Bureau</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#080c14] border border-slate-200 dark:border-white/[0.1] hover:bg-slate-100 dark:hover:bg-white/[0.06] shadow-xs transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
