'use client';

import React, { useState } from 'react';
import { X, BookOpen, Layers, Radar, Cpu, Activity, FileText, CreditCard } from 'lucide-react';

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecsModal: React.FC<SpecsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'memo' | 'scoring' | 'credit' | 'discovery' | 'monitoring' | 'arch'>('memo');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-4xl rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans bg-white dark:bg-[#0d131f] border border-slate-200/90 dark:border-white/[0.08] transition-all">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#070a12] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center text-[#0066FF] dark:text-sky-400 flex-shrink-0">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white font-sans tracking-tight">
                TRUSTY.ai Engineering Specifications
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                Formal architecture specs, credit bureau underwriting, and founding technical memo
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 dark:hover:text-white dark:hover:bg-white/[0.08] transition flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Pill Tabs */}
        <div className="flex items-center overflow-x-auto border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-100/70 dark:bg-[#090d16] px-4 sm:px-6 py-2.5 gap-1.5 no-scrollbar font-sans text-xs">
          {[
            { id: 'memo', label: 'Technical Memo', icon: FileText },
            { id: 'scoring', label: 'SPEC-003: Trust Engine', icon: Radar },
            { id: 'credit', label: 'SPEC-005: Credit Bureau', icon: CreditCard },
            { id: 'discovery', label: 'SPEC-002: AST Scan', icon: Cpu },
            { id: 'monitoring', label: 'SPEC-004: Continuous Drift', icon: Activity },
            { id: 'arch', label: 'SPEC-001: Architecture', icon: Layers },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white dark:bg-[#0d131f] text-[#0066FF] dark:text-[#38bdf8] shadow-xs border border-slate-200/80 dark:border-white/[0.1]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/40 dark:hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0066FF] dark:text-[#38bdf8]' : 'opacity-70'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-[#fafafa] dark:bg-transparent">
          {activeTab === 'memo' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-5 rounded-xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
                <h4 className="text-base font-bold text-slate-950 dark:text-white font-sans tracking-tight mb-2">
                  TRUSTY.ai — Founding Technical Memo
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  Autonomous AI agents are accelerating toward ubiquity, acquiring privileged access to enterprise APIs, personal communication channels, credentials, and financial execution vectors (Brex, Stripe, Visa). Before clicking <strong>“START AGENT”</strong> or delegating corporate credit cards, organizations need an independent, explainable answer to: <strong>“Can I trust this agent, and what is its safe financial limit?”</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
                  <h5 className="font-bold text-slate-900 dark:text-white font-sans text-xs mb-1.5 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>1. Discovery &amp; Live AST Scan</span>
                  </h5>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    Crawls 3 diverse ecosystems (GitHub, MCP registry on NPM, and Agent Marketplaces) + live on-demand AST code scanning (<code className="font-mono text-[11px] bg-slate-100 dark:bg-white/[0.06] px-1 py-0.5 rounded">POST /api/scan-repo</code>) bypassing GitHub rate limits to inspect imports (<code className="font-mono text-[11px]">subprocess</code>, <code className="font-mono text-[11px]">stripe</code>, <code className="font-mono text-[11px]">boto3</code>) and manifests.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
                  <h5 className="font-bold text-slate-900 dark:text-white font-sans text-xs mb-1.5 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>2. Dual-Engine Intelligence Core</span>
                  </h5>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    Combines a 20-signal Trust &amp; Security Engine (Permissions 30%, Identity 25%, Security 25%, Gov 10%, Rep 10% with circuit-breaker overrides) with an Agentic Credit Bureau (12 Day-0 signals + 20 behavioral signals, establishing Tiers AAA through D).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
                  <h5 className="font-bold text-slate-900 dark:text-white font-sans text-xs mb-1.5 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>3. M2M Decision Clearing Gateway</span>
                  </h5>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    Real-time clearing endpoint (<code className="font-mono text-[11px] bg-slate-100 dark:bg-white/[0.06] px-1 py-0.5 rounded">POST /api/decision</code>) evaluating transactions across 5 automated policy gates in sub-30ms, returning <code className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">APPROVED</code>, <code className="font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400">DECLINED</code>, or <code className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">HUMAN_REVIEW</code> with AVUD allocation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
                  <h5 className="font-bold text-slate-900 dark:text-white font-sans text-xs mb-1.5 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>4. Continuous Fingerprint Drift</span>
                  </h5>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    Cryptographic composite hashes (SHA-256 Manifest + Tools + Permissions + Dependencies) updated continuously via <code className="font-mono text-[11px] bg-slate-100 dark:bg-white/[0.06] px-1 py-0.5 rounded">/api/agents/sync</code>, triggering automated re-evaluations and limit throttling when regressions occur.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scoring' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
                <h4 className="text-base font-bold text-slate-950 dark:text-white font-sans tracking-tight mb-1">
                  SPEC-003: 20-Signal Deterministic Trust Engine
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  Every score is explainable and rejects simple arithmetic averaging when critical risk factors are present.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200/80 dark:border-white/[0.08] rounded-xl shadow-2xs bg-white dark:bg-[#080c14]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-sans text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200/80 dark:border-white/[0.08]">
                    <tr>
                      <th className="p-3">Dimension</th>
                      <th className="p-3">Weight</th>
                      <th className="p-3">Signals Evaluated &amp; Key Rule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-white/[0.06] text-slate-800 dark:text-slate-200">
                    <tr>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold font-sans">1. Permissions &amp; Data</td>
                      <td className="p-3 font-bold font-mono">30%</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 font-sans">Scope volume, least-privilege alignment to category, data minimization, retention transparency. High-risk scope triggers override.</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-900 dark:text-white font-semibold font-sans">2. Identity &amp; Provenance</td>
                      <td className="p-3 font-bold font-mono">25%</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 font-sans">Publisher identity verification, domain DNS ownership, package provenance, cryptographic signing integrity.</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-900 dark:text-white font-semibold font-sans">3. Security Posture</td>
                      <td className="p-3 font-bold font-mono">25%</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 font-sans">Vulnerability/CVE history, KMS/Vault secret handling, sandboxing evidence, prompt-injection guardrails.</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-900 dark:text-white font-semibold font-sans">4. Behavior &amp; Governance</td>
                      <td className="p-3 font-bold font-mono">10%</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 font-sans">Structured tamper-evident logs, human approval for writes, policy consistency, behavioral drift rate.</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-900 dark:text-white font-semibold font-sans">5. Reputation &amp; Incidents</td>
                      <td className="p-3 font-bold font-mono">10%</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 font-sans">Scam/abuse reports, security incident history, user adoption evidence, publisher ecosystem track record.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/50 text-xs text-rose-800 dark:text-rose-200">
                <strong className="font-bold text-rose-900 dark:text-rose-100 font-sans">Hard Severity Overrides (Circuit Breakers):</strong> Confirmed malware caps score to 0; Credential theft caps to 10; Unsandboxed host shell execution without human gate caps to 25. Confidence &lt;60% mathematically caps score at 50 + (C × 0.5).
              </div>
            </div>
          )}

          {activeTab === 'credit' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
                <h4 className="text-base font-bold text-slate-950 dark:text-white font-sans tracking-tight mb-1">
                  SPEC-005: Agentic Credit Bureau &amp; Autonomous Decision Engine
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  Establishes institutional credit ratings (AAA to SUBPRIME_D) and daily spending limits for autonomous agents, backed by real-time clearing via <code className="font-mono text-[11px]">POST /api/decision</code>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
                  <h5 className="font-bold text-emerald-600 dark:text-emerald-400 font-sans text-xs mb-1">12 Day-Zero Signals</h5>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    Underwrites cold-start agents before live transactions: Publisher identity, domain age, GitHub velocity, release history, CVEs, permissions sensitivity, malware scans, incident history, human approval gates, audit logging, marketplace reputation, and adoption instances.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
                  <h5 className="font-bold text-[#0066FF] dark:text-sky-400 font-sans text-xs mb-1">20 Behavioral Telemetry Signals</h5>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    Mature operating ledger: transactions attempted/completed, total AVUD processed ($4.1M+ for ProcurementBot-847), decline rates, dispute/chargeback rate (&lt;0.05% strict ceiling), human override rate, budget breach attempts, and treasury auto-sweep settlement.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200/80 dark:border-white/[0.08] rounded-xl shadow-2xs bg-white dark:bg-[#080c14]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-sans text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200/80 dark:border-white/[0.08]">
                    <tr>
                      <th className="p-2.5">Tier</th>
                      <th className="p-2.5">Score</th>
                      <th className="p-2.5">Daily Limit</th>
                      <th className="p-2.5">Autonomous Cap</th>
                      <th className="p-2.5">Human Gate</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-white/[0.06] text-slate-800 dark:text-slate-200">
                    <tr>
                      <td className="p-2.5 text-purple-600 dark:text-purple-400 font-bold font-sans">AAA</td>
                      <td className="p-2.5 font-mono">92–100</td>
                      <td className="p-2.5 font-bold font-mono text-emerald-600 dark:text-emerald-400">$50,000/day</td>
                      <td className="p-2.5 font-mono">$10,000</td>
                      <td className="p-2.5 font-mono">&gt; $10,000</td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400 font-sans">Super-Prime Institutional</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-purple-600 dark:text-purple-400 font-bold font-sans">AA</td>
                      <td className="p-2.5 font-mono">84–91</td>
                      <td className="p-2.5 font-bold font-mono text-emerald-600 dark:text-emerald-400">$25,000/day</td>
                      <td className="p-2.5 font-mono">$5,000</td>
                      <td className="p-2.5 font-mono">&gt; $5,000</td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400 font-sans">Prime Corporate</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-blue-600 dark:text-blue-400 font-bold font-sans">A</td>
                      <td className="p-2.5 font-mono">74–83</td>
                      <td className="p-2.5 font-bold font-mono text-emerald-600 dark:text-emerald-400">$15,000/day</td>
                      <td className="p-2.5 font-mono">$3,000</td>
                      <td className="p-2.5 font-mono">&gt; $3,000</td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400 font-sans">Verified Commercial</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-blue-600 dark:text-blue-400 font-bold font-sans">BBB</td>
                      <td className="p-2.5 font-mono">64–73</td>
                      <td className="p-2.5 font-bold font-mono text-emerald-600 dark:text-emerald-400">$5,000/day</td>
                      <td className="p-2.5 font-mono">$1,000</td>
                      <td className="p-2.5 font-mono">&gt; $1,000</td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400 font-sans">Standard Open-Source Baseline</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-600 dark:text-amber-400 font-bold font-sans">BB / B</td>
                      <td className="p-2.5 font-mono">40–63</td>
                      <td className="p-2.5 font-bold font-mono text-amber-600 dark:text-amber-400">$500–$1,500/day</td>
                      <td className="p-2.5 font-mono">$100–$300</td>
                      <td className="p-2.5 font-mono">&gt; $100–$300</td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400 font-sans">Thin File / Supervised</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-rose-600 dark:text-rose-500 font-bold font-sans">SUBPRIME_D</td>
                      <td className="p-2.5 font-mono">&lt;40</td>
                      <td className="p-2.5 font-bold font-mono text-rose-600 dark:text-rose-500">$0/day</td>
                      <td className="p-2.5 font-mono">$0</td>
                      <td className="p-2.5 font-mono">All Blocked</td>
                      <td className="p-2.5 text-rose-600 dark:text-rose-400 font-sans">Security Blocked / Revoked</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'discovery' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
                <h4 className="text-base font-bold text-slate-950 dark:text-white font-sans tracking-tight mb-1">
                  SPEC-002: Multi-Source Crawling &amp; Live AST Scanner
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  Ingests agents from 3 independent ecosystems + live on-demand AST code scanning of any public GitHub repository.
                </p>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300 font-sans text-xs leading-relaxed">
                <li><strong className="text-slate-900 dark:text-white">GitHub Open Source:</strong> Queries topics <code>ai-agent</code>, <code>mcp-server</code>, extracting stars, open issues, commit frequency, and license.</li>
                <li><strong className="text-slate-900 dark:text-white">MCP Registry:</strong> Ingests Anthropic Model Context Protocol servers on NPM, parsing JSON-RPC tools and capabilities.</li>
                <li><strong className="text-slate-900 dark:text-white">Agent Marketplaces:</strong> Crawls Hugging Face Spaces and CrewAI agent registries, cross-referencing natural language descriptions with actual external API scopes.</li>
                <li><strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Live AST Code Scanner (<code>POST /api/scan-repo</code>):</strong> Fetches raw GitHub content to bypass rate limits, parses <code>package.json</code>, <code>pyproject.toml</code>, and detects hazardous imports (<code>subprocess</code>, <code>eval</code>, <code>stripe</code>, <code>boto3</code>).</li>
                <li><strong className="text-slate-900 dark:text-white">Permission Translator:</strong> Converts low-level calls into human-labeled security scopes with plain-English impact ratings and access types.</li>
              </ul>
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
                <h4 className="text-base font-bold text-slate-950 dark:text-white font-sans tracking-tight mb-1">
                  SPEC-004: Continuous Monitoring &amp; Drift Detection
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  Addresses the fundamental reality: <em>“A trusted agent today can become untrusted tomorrow.”</em>
                </p>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                TRUSTY.ai generates a cryptographic composite hash (SHA-256 of Manifest + Tool Schemas + Requested Permissions + Dependencies Lockfile). When a periodic crawl or background sync (<code className="font-mono text-[11px] bg-slate-100 dark:bg-white/[0.06] px-1 py-0.5 rounded">/api/agents/sync</code>) detects a mismatch, <code className="font-mono text-[11px] text-amber-600 dark:text-amber-400">isDriftDetected</code> is flagged, the TRUSTY Score is recalculated, and financial limits are automatically throttled.
              </p>
            </div>
          )}

          {activeTab === 'arch' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
                <h4 className="text-base font-bold text-slate-950 dark:text-white font-sans tracking-tight mb-1">
                  SPEC-001: Production Architecture Overview
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Fullstack system built on Next.js 14 App Router, TypeScript, React, and Tailwind CSS. Features hybrid persistence (Supabase PostgreSQL + in-memory store + client-side localStorage sync), sub-30ms financial clearing, dynamic SVG badges, and quota tracking.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#070a12] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-sans">
          <div className="flex items-center space-x-2">
            <span>All 5 markdown spec files and Technical Memo available in repository <code className="font-mono text-[11px]">/specs/</code></span>
          </div>
          <button 
            onClick={onClose} 
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#080c14] border border-slate-200 dark:border-white/[0.1] hover:bg-slate-100 dark:hover:bg-white/[0.06] shadow-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
