'use client';

import React, { useState } from 'react';
import { X, BookOpen, Layers, Radar, Cpu, Activity, FileText } from 'lucide-react';

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecsModal: React.FC<SpecsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'memo' | 'arch' | 'discovery' | 'scoring' | 'monitoring'>('memo');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono">TRUSTY.ai Engineering Specs</h3>
              <p className="text-xs text-slate-400">Official technical specifications and founding memo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('memo')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'memo'
                ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Technical Memo (2 Pages)</span>
          </button>

          <button
            onClick={() => setActiveTab('scoring')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'scoring'
                ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span>SPEC-003: Scoring Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('discovery')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'discovery'
                ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>SPEC-002: Discovery Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('monitoring')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'monitoring'
                ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>SPEC-004: Continuous Drift</span>
          </button>

          <button
            onClick={() => setActiveTab('arch')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'arch'
                ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SPEC-001: Architecture</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          {activeTab === 'memo' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-base font-bold text-white font-mono mb-2">
                  TRUSTY.ai — Founding Technical Memo
                </h4>
                <p className="text-slate-300">
                  Autonomous AI agents are accelerating toward ubiquity, acquiring privileged access to enterprise APIs, personal communication channels, credentials, and financial execution vectors. Before clicking <strong>“START AGENT”</strong> or granting access to Gmail, Google Drive, Slack, Bank Accounts, or Company Data, users and organizations need an independent, explainable answer to: <strong>“Can I trust this agent?”</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h5 className="font-semibold text-sky-400 font-mono mb-2">1. Discovery Architecture</h5>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Crawls 3 diverse ecosystems: GitHub open-source repositories (search API + topic inspection), Model Context Protocol official registries (JSON-RPC tool declarations), and AI Agent Marketplaces (HuggingFace Spaces & CrewAI Hub). Rejects static manual curation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h5 className="font-semibold text-emerald-400 font-mono mb-2">2. Scoring & Overrides</h5>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    20 signals across 5 dimensions (Permissions 30%, Identity 25%, Security 25%, Governance 10%, Reputation 10%). Critical triggers (malware, unsandboxed root exec, credential theft) immediately override averages to cap scores at 0–25 (Critical Risk).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h5 className="font-semibold text-amber-400 font-mono mb-2">3. Technical Limitations</h5>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Static manifest analysis cannot detect adversarial payloads delayed at runtime. Next phase requires dynamic microVM sandboxing (gVisor detonation chamber) to monitor runtime network telemetry and syscalls.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h5 className="font-semibold text-purple-400 font-mono mb-2">4. Roadmap: TRUSTY Guard</h5>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Drop-in reverse proxy interceptor for Claude Desktop, Cursor, and LangChain that blocks dangerous tool calls in real-time, plus continuous webhook re-evaluations on Git push.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scoring' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-base font-bold text-white font-mono mb-1">
                  SPEC-003: 20-Signal Evaluation Matrix
                </h4>
                <p className="text-slate-400">
                  Every score is explainable and rejects simple arithmetic averaging when critical risk factors are present.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-900 text-slate-400 font-mono uppercase">
                    <tr>
                      <th className="p-2.5">Dimension</th>
                      <th className="p-2.5">Weight</th>
                      <th className="p-2.5">Signals Evaluated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                    <tr>
                      <td className="p-2.5 text-sky-400 font-semibold">1. Permissions & Data</td>
                      <td className="p-2.5 font-bold">30%</td>
                      <td className="p-2.5 text-slate-400 font-sans">Scope volume, least-privilege alignment to category, data minimization, retention transparency</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-emerald-400 font-semibold">2. Identity & Provenance</td>
                      <td className="p-2.5 font-bold">25%</td>
                      <td className="p-2.5 text-slate-400 font-sans">Publisher identity verification, domain DNS ownership, package provenance, signing/version integrity</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-purple-400 font-semibold">3. Security Posture</td>
                      <td className="p-2.5 font-bold">25%</td>
                      <td className="p-2.5 text-slate-400 font-sans">Vulnerability/CVE history, secret handling, sandboxing/isolation evidence, prompt-injection resilience</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-400 font-semibold">4. Behavior & Governance</td>
                      <td className="p-2.5 font-bold">10%</td>
                      <td className="p-2.5 text-slate-400 font-sans">Structured tamper-evident logs, human approval for writes, policy consistency, behavioral drift rate</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-rose-400 font-semibold">5. Reputation & Incidents</td>
                      <td className="p-2.5 font-bold">10%</td>
                      <td className="p-2.5 text-slate-400 font-sans">Scam/abuse reports, security incident history, user adoption evidence, publisher ecosystem track record</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'discovery' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-base font-bold text-white font-mono mb-2">
                  SPEC-002: Multi-Source Crawling Architecture
                </h4>
                <p className="text-slate-400">
                  Ingests agents from 3 independent ecosystems, extracts manifests, and computes canonical agent records.
                </p>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-slate-300">
                <li><strong className="text-sky-300">GitHub Open Source:</strong> Queries topics <code>ai-agent</code>, <code>mcp-server</code>, <code>crewai</code>, extracting stars, open issues, commit frequency, and license.</li>
                <li><strong className="text-emerald-300">MCP Registry:</strong> Ingests Anthropic Model Context Protocol servers, parsing JSON-RPC tools and capabilities.</li>
                <li><strong className="text-purple-300">Agent Marketplaces:</strong> Crawls HuggingFace Spaces and CrewAI agent registries, cross-referencing natural language descriptions with actual external API scopes.</li>
              </ul>
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-base font-bold text-white font-mono mb-2">
                  SPEC-004: Continuous Monitoring & Drift Detection
                </h4>
                <p className="text-slate-400">
                  Addresses the fundamental reality: <em>“A trusted agent today can become untrusted tomorrow.”</em>
                </p>
              </div>
              <p className="text-slate-300">
                TRUSTY.ai generates a cryptographic composite hash (Manifest + Tool Schemas + Requested Permissions + Dependencies Lockfile). When a periodic crawl or webhook detects a mismatch, a drift event is recorded and the TRUSTY Score is automatically re-evaluated.
              </p>
            </div>
          )}

          {activeTab === 'arch' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-base font-bold text-white font-mono mb-2">
                  SPEC-001: Architecture Overview
                </h4>
                <p className="text-slate-400">
                  High-throughput, edge-deployable fullstack application built on Next.js 14 App Router, TypeScript, React, and Tailwind CSS. Zero external paid dependencies required.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center text-xs text-slate-400">
          <span>All markdown spec files available in repository <code>/specs/</code> folder</span>
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
