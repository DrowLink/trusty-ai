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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 dark:bg-black/90 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/[0.08]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-emerald-50 dark:bg-zinc-900 border border-emerald-200 dark:border-white/[0.1] flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 font-mono">TRUSTY.ai Engineering Specifications</h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-sans">Formal architecture specs, credit bureau underwriting, and founding technical memo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-white/[0.08] bg-slate-100/90 dark:bg-zinc-950 px-4 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('memo')}
            className={`py-2.5 px-3 border-b-2 font-medium flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'memo'
                ? 'border-emerald-600 text-emerald-700 bg-white dark:border-emerald-400 dark:text-emerald-400 dark:bg-emerald-950/20 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Technical Memo (2 Pages)</span>
          </button>

          <button
            onClick={() => setActiveTab('scoring')}
            className={`py-2.5 px-3 border-b-2 font-medium flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'scoring'
                ? 'border-emerald-600 text-emerald-700 bg-white dark:border-emerald-400 dark:text-emerald-400 dark:bg-emerald-950/20 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span>SPEC-003: Trust Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('credit')}
            className={`py-2.5 px-3 border-b-2 font-medium flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'credit'
                ? 'border-emerald-600 text-emerald-700 bg-white dark:border-emerald-400 dark:text-emerald-400 dark:bg-emerald-950/20 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>SPEC-005: Credit Bureau & M2M API</span>
          </button>

          <button
            onClick={() => setActiveTab('discovery')}
            className={`py-2.5 px-3 border-b-2 font-medium flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'discovery'
                ? 'border-emerald-600 text-emerald-700 bg-white dark:border-emerald-400 dark:text-emerald-400 dark:bg-emerald-950/20 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>SPEC-002: Discovery & AST Scan</span>
          </button>

          <button
            onClick={() => setActiveTab('monitoring')}
            className={`py-2.5 px-3 border-b-2 font-medium flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'monitoring'
                ? 'border-emerald-600 text-emerald-700 bg-white dark:border-emerald-400 dark:text-emerald-400 dark:bg-emerald-950/20 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>SPEC-004: Continuous Drift</span>
          </button>

          <button
            onClick={() => setActiveTab('arch')}
            className={`py-2.5 px-3 border-b-2 font-medium flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'arch'
                ? 'border-emerald-600 text-emerald-700 bg-white dark:border-emerald-400 dark:text-emerald-400 dark:bg-emerald-950/20 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SPEC-001: Architecture</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-sans bg-slate-50/50 dark:bg-transparent">
          {activeTab === 'memo' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/[0.08] shadow-sm">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 font-mono mb-2">
                  TRUSTY.ai — Founding Technical Memo
                </h4>
                <p className="text-slate-600 dark:text-zinc-300">
                  Autonomous AI agents are accelerating toward ubiquity, acquiring privileged access to enterprise APIs, personal communication channels, credentials, and financial execution vectors (Brex, Stripe, Visa). Before clicking <strong>“START AGENT”</strong> or delegating corporate credit cards, organizations need an independent, explainable answer to: <strong>“Can I trust this agent, and what is its safe financial limit?”</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/[0.08] shadow-sm">
                  <h5 className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono mb-1.5">1. Discovery & Live AST Scan</h5>
                  <p className="text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                    Crawls 3 diverse ecosystems (GitHub, MCP registry on NPM, and Agent Marketplaces) + live on-demand AST code scanning (<code>POST /api/scan-repo</code>) bypassing GitHub rate limits to inspect imports (<code>subprocess</code>, <code>stripe</code>, <code>boto3</code>) and manifests.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/[0.08] shadow-sm">
                  <h5 className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono mb-1.5">2. Dual-Engine Intelligence Core</h5>
                  <p className="text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                    Combines a 20-signal Trust & Security Engine (Permissions 30%, Identity 25%, Security 25%, Gov 10%, Rep 10% with circuit-breaker overrides) with an Agentic Credit Bureau (12 Day-0 signals + 20 behavioral signals, establishing Tiers AAA through D).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/[0.08] shadow-sm">
                  <h5 className="font-semibold text-amber-600 dark:text-amber-400 font-mono mb-1.5">3. M2M Decision Clearing Gateway</h5>
                  <p className="text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                    Real-time clearing endpoint (<code>POST /api/decision</code>) evaluating transactions across 5 automated policy gates in sub-30ms, returning <code>APPROVED</code>, <code>DECLINED</code>, or <code>HUMAN_REVIEW</code> with AVUD allocation.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/[0.08] shadow-sm">
                  <h5 className="font-semibold text-slate-800 dark:text-zinc-300 font-mono mb-1.5">4. Continuous Fingerprint Drift</h5>
                  <p className="text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                    Cryptographic composite hashes (SHA-256 Manifest + Tools + Permissions + Dependencies) updated continuously via <code>/api/agents/sync</code>, triggering automated re-evaluations and limit throttling when regressions occur.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scoring' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/[0.08] shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 font-mono mb-1">
                  SPEC-003: 20-Signal Deterministic Trust Engine
                </h4>
                <p className="text-slate-600 dark:text-zinc-400">
                  Every score is explainable and rejects simple arithmetic averaging when critical risk factors are present.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-sm">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 dark:bg-zinc-950 text-slate-600 dark:text-zinc-500 font-mono uppercase border-b border-slate-200 dark:border-white/[0.08]">
                    <tr>
                      <th className="p-2.5">Dimension</th>
                      <th className="p-2.5">Weight</th>
                      <th className="p-2.5">Signals Evaluated & Key Rule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/[0.06] text-slate-800 dark:text-zinc-300 font-mono bg-white dark:bg-zinc-950/50">
                    <tr>
                      <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">1. Permissions & Data</td>
                      <td className="p-2.5 font-bold">30%</td>
                      <td className="p-2.5 text-slate-600 dark:text-zinc-400 font-sans">Scope volume, least-privilege alignment to category, data minimization, retention transparency. High-risk scope triggers override.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-800 dark:text-zinc-300 font-semibold">2. Identity & Provenance</td>
                      <td className="p-2.5 font-bold">25%</td>
                      <td className="p-2.5 text-slate-600 dark:text-zinc-400 font-sans">Publisher identity verification, domain DNS ownership, package provenance, cryptographic signing integrity.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-800 dark:text-zinc-300 font-semibold">3. Security Posture</td>
                      <td className="p-2.5 font-bold">25%</td>
                      <td className="p-2.5 text-slate-600 dark:text-zinc-400 font-sans">Vulnerability/CVE history, KMS/Vault secret handling, sandboxing evidence, prompt-injection guardrails.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-800 dark:text-zinc-300 font-semibold">4. Behavior & Governance</td>
                      <td className="p-2.5 font-bold">10%</td>
                      <td className="p-2.5 text-slate-600 dark:text-zinc-400 font-sans">Structured tamper-evident logs, human approval for writes, policy consistency, behavioral drift rate.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-800 dark:text-zinc-300 font-semibold">5. Reputation & Incidents</td>
                      <td className="p-2.5 font-bold">10%</td>
                      <td className="p-2.5 text-slate-600 dark:text-zinc-400 font-sans">Scam/abuse reports, security incident history, user adoption evidence, publisher ecosystem track record.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 dark:bg-red-950/20 border border-rose-200 dark:border-red-900/30 text-[11px] text-rose-800 dark:text-red-300">
                <strong className="text-rose-700 dark:text-red-400 font-mono">Hard Severity Overrides (Circuit Breakers):</strong> Confirmed malware caps score to 0; Credential theft caps to 10; Unsandboxed host shell execution without human gate caps to 25. Confidence &lt;60% mathematically caps score at 50 + (C × 0.5).
              </div>
            </div>
          )}

          {activeTab === 'credit' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/[0.08] shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 font-mono mb-1">
                  SPEC-005: Agentic Credit Bureau & Autonomous Decision Engine
                </h4>
                <p className="text-slate-600 dark:text-zinc-400">
                  Establishes institutional credit ratings (AAA to SUBPRIME_D) and daily spending limits for autonomous agents, backed by real-time clearing via <code>POST /api/decision</code>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/[0.08] shadow-sm">
                  <h5 className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono mb-1">12 Day-Zero Signals</h5>
                  <p className="text-slate-600 dark:text-zinc-400 text-[11px]">
                    Underwrites cold-start agents before live transactions: Publisher identity, domain age, GitHub velocity, release history, CVEs, permissions sensitivity, malware scans, incident history, human approval gates, audit logging, marketplace reputation, and adoption instances.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/[0.08] shadow-sm">
                  <h5 className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono mb-1">20 Behavioral Telemetry Signals</h5>
                  <p className="text-slate-600 dark:text-zinc-400 text-[11px]">
                    Mature operating ledger: transactions attempted/completed, total AVUD processed ($4.1M+ for ProcurementBot-847), decline rates, dispute/chargeback rate (&lt;0.05% strict ceiling), human override rate, budget breach attempts, and treasury auto-sweep settlement.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-sm">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 dark:bg-zinc-950 text-slate-600 dark:text-zinc-500 font-mono uppercase border-b border-slate-200 dark:border-white/[0.08]">
                    <tr>
                      <th className="p-2">Tier</th>
                      <th className="p-2">Score</th>
                      <th className="p-2">Daily Limit</th>
                      <th className="p-2">Autonomous Cap</th>
                      <th className="p-2">Human Gate</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/[0.06] text-slate-800 dark:text-zinc-300 font-mono bg-white dark:bg-zinc-950/50">
                    <tr>
                      <td className="p-2 text-purple-600 dark:text-purple-400 font-bold">AAA</td>
                      <td className="p-2">92–100</td>
                      <td className="p-2 font-semibold text-emerald-600 dark:text-emerald-400">$50,000/day</td>
                      <td className="p-2">$10,000</td>
                      <td className="p-2">&gt; $10,000</td>
                      <td className="p-2 text-slate-500 dark:text-zinc-400 font-sans">Super-Prime Institutional</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-purple-600 dark:text-purple-400 font-bold">AA</td>
                      <td className="p-2">84–91</td>
                      <td className="p-2 font-semibold text-emerald-600 dark:text-emerald-400">$25,000/day</td>
                      <td className="p-2">$5,000</td>
                      <td className="p-2">&gt; $5,000</td>
                      <td className="p-2 text-slate-500 dark:text-zinc-400 font-sans">Prime Corporate (ProcurementBot)</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-blue-600 dark:text-blue-400 font-bold">A</td>
                      <td className="p-2">74–83</td>
                      <td className="p-2 font-semibold text-emerald-600 dark:text-emerald-400">$15,000/day</td>
                      <td className="p-2">$3,000</td>
                      <td className="p-2">&gt; $3,000</td>
                      <td className="p-2 text-slate-500 dark:text-zinc-400 font-sans">Verified Commercial</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-blue-600 dark:text-blue-400 font-bold">BBB</td>
                      <td className="p-2">64–73</td>
                      <td className="p-2 font-semibold text-emerald-600 dark:text-emerald-400">$5,000/day</td>
                      <td className="p-2">$1,000</td>
                      <td className="p-2">&gt; $1,000</td>
                      <td className="p-2 text-slate-500 dark:text-zinc-400 font-sans">Standard Open-Source Baseline</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-amber-600 dark:text-amber-400 font-bold">BB / B</td>
                      <td className="p-2">40–63</td>
                      <td className="p-2 font-semibold text-amber-600 dark:text-amber-400">$500–$1,500/day</td>
                      <td className="p-2">$100–$300</td>
                      <td className="p-2">&gt; $100–$300</td>
                      <td className="p-2 text-slate-500 dark:text-zinc-400 font-sans">Thin File / Supervised</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-rose-600 dark:text-rose-500 font-bold">SUBPRIME_D</td>
                      <td className="p-2">&lt;40</td>
                      <td className="p-2 font-semibold text-rose-600 dark:text-rose-500">$0/day</td>
                      <td className="p-2">$0</td>
                      <td className="p-2">All Blocked</td>
                      <td className="p-2 text-rose-600 dark:text-rose-400 font-sans">Security Blocked / Revoked</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'discovery' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/[0.08] shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 font-mono mb-2">
                  SPEC-002: Multi-Source Crawling & Live AST Scanner
                </h4>
                <p className="text-slate-600 dark:text-zinc-400">
                  Ingests agents from 3 independent ecosystems + live on-demand AST code scanning of any public GitHub repository.
                </p>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-zinc-300 font-sans">
                <li><strong className="text-slate-900 dark:text-zinc-200">GitHub Open Source:</strong> Queries topics <code>ai-agent</code>, <code>mcp-server</code>, extracting stars, open issues, commit frequency, and license.</li>
                <li><strong className="text-slate-900 dark:text-zinc-200">MCP Registry:</strong> Ingests Anthropic Model Context Protocol servers on NPM, parsing JSON-RPC tools and capabilities.</li>
                <li><strong className="text-slate-900 dark:text-zinc-200">Agent Marketplaces:</strong> Crawls Hugging Face Spaces and CrewAI agent registries, cross-referencing natural language descriptions with actual external API scopes.</li>
                <li><strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Live AST Code Scanner (<code>POST /api/scan-repo</code>):</strong> Fetches raw GitHub content to bypass rate limits, parses <code>package.json</code>, <code>pyproject.toml</code>, and detects hazardous imports (<code>subprocess</code>, <code>eval</code>, <code>stripe</code>, <code>boto3</code>).</li>
                <li><strong className="text-slate-900 dark:text-zinc-200">Permission Translator:</strong> Converts low-level calls into human-labeled security scopes with plain-English impact ratings and access types.</li>
              </ul>
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/[0.08] shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 font-mono mb-2">
                  SPEC-004: Continuous Monitoring & Drift Detection
                </h4>
                <p className="text-slate-600 dark:text-zinc-400">
                  Addresses the fundamental reality: <em>“A trusted agent today can become untrusted tomorrow.”</em>
                </p>
              </div>
              <p className="text-slate-700 dark:text-zinc-300">
                TRUSTY.ai generates a cryptographic composite hash (SHA-256 of Manifest + Tool Schemas + Requested Permissions + Dependencies Lockfile). When a periodic crawl or background sync (<code>/api/agents/sync</code>) detects a mismatch, <code>isDriftDetected</code> is flagged, the TRUSTY Score is recalculated, and financial limits are automatically throttled.
              </p>
            </div>
          )}

          {activeTab === 'arch' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/[0.08] shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 font-mono mb-2">
                  SPEC-001: Production Architecture Overview
                </h4>
                <p className="text-slate-600 dark:text-zinc-400">
                  Fullstack system built on Next.js 14 App Router, TypeScript, React, and Tailwind CSS. Features hybrid persistence (Firebase Firestore + in-memory store + client-side localStorage sync), sub-30ms financial clearing, dynamic SVG badges, and quota tracking.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-zinc-950 flex justify-between items-center text-xs text-slate-500 dark:text-zinc-500 font-mono">
          <span>All 5 markdown spec files and Technical Memo available in repository <code>/specs/</code> folder</span>
          <button onClick={onClose} className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 dark:bg-zinc-900 dark:border-white/[0.08] dark:text-zinc-300 dark:hover:text-white shadow-sm transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
