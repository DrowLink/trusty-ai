'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Search, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Cpu, 
  Database,
  ExternalLink,
  DollarSign
} from 'lucide-react';

export const UnderwritingExplainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'day0' | 'behavioral'>('day0');

  // 12 Public Internet Signals from Slide 4
  const dayZeroSignals = [
    { num: '01', title: 'Publisher identity', sub: 'Verified vs anonymous', desc: 'DNS TXT verification, cryptographic commit signatures, enterprise org registration.' },
    { num: '02', title: 'Company / domain age', sub: 'Stability of principal', desc: 'WHOIS registration tenure, historical corporate standing, absence of disposable domains.' },
    { num: '03', title: 'GitHub history', sub: 'Development maturity', desc: 'Repo creation date, stargazer distribution, PR review velocity, active maintainers.' },
    { num: '04', title: 'Release history', sub: 'Operational stability', desc: 'Semantic release tags, signed releases, changelog adherence, reproducible packaging.' },
    { num: '05', title: 'Security vulnerabilities', sub: 'Compromise probability', desc: 'NVD CVE scans across dependency tree, vulnerable transitive libraries.' },
    { num: '06', title: 'Permissions requested', sub: 'Potential financial damage', desc: 'Filesystem write, process spawning, terminal exec, outbound network scopes.' },
    { num: '07', title: 'Malware / scam reports', sub: 'Fraud probability', desc: 'Cross-checks with VirusTotal, AlienVault OTX, and AI agent blacklist registries.' },
    { num: '08', title: 'Security incidents', sub: 'Historical risk', desc: 'Reported credential exfiltration, prompt injection vulnerabilities, past data breaches.' },
    { num: '09', title: 'Human approval controls', sub: 'Loss containment', desc: 'Declared dual-custody gate for destructive actions, monetary limits enforcement.' },
    { num: '10', title: 'Audit / logging', sub: 'Accountability', desc: 'Structured JSON-RPC audit logs, replayable session traces, tamper-evident logs.' },
    { num: '11', title: 'Marketplace reputation', sub: 'External reputation', desc: 'Reviews & developer ratings on MCP Registry, Smithery, OpenTools, Hugging Face.' },
    { num: '12', title: 'Usage / adoption', sub: 'Operating evidence', desc: 'Public download volume, Docker pulls, active production deployments in the wild.' },
  ];

  // 20 Behavioral Signals from Slide 6
  const behavioralSignals = [
    { num: '01', name: 'Transactions attempted', category: 'activity' },
    { num: '02', name: 'Transactions successfully completed', category: 'activity' },
    { num: '03', name: 'Total dollar volume handled', category: 'activity' },
    { num: '04', name: 'Average & maximum transaction size', category: 'activity' },
    { num: '05', name: 'Transaction velocity', category: 'activity' },
    { num: '06', name: 'Decline rate', category: 'risk_containment' },
    { num: '07', name: 'Refund rate', category: 'risk_containment' },
    { num: '08', name: 'Dispute / chargeback rate', category: 'risk_containment' },
    { num: '09', name: 'Unauthorized-action rate', category: 'risk_containment' },
    { num: '10', name: 'Human override rate', category: 'risk_containment' },
    { num: '11', name: 'Attempts to exceed budget', category: 'anomalies' },
    { num: '12', name: 'Actions outside stated purpose', category: 'anomalies' },
    { num: '13', name: 'New-merchant frequency', category: 'anomalies' },
    { num: '14', name: 'Abnormal spending patterns', category: 'anomalies' },
    { num: '15', name: 'Security incidents tied to transactions', category: 'risk_containment' },
    { num: '16', name: 'Days / months operating', category: 'track_record' },
    { num: '17', name: 'Historical limits successfully handled', category: 'track_record' },
    { num: '18', name: 'Whether delegated credit was repaid', category: 'track_record' },
    { num: '19', name: 'Counterparty outcomes', category: 'track_record' },
    { num: '20', name: 'Trust-score deterioration', category: 'track_record' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 space-y-10 font-sans">
      {/* HEADER */}
      <div className="border-b border-slate-800/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>TRUSTY.BOT • DUAL-LAYER UNDERWRITING METHODOLOGY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
            Underwriting Engine: <span className="text-sky-400">12 Public + 20 Behavioral Signals</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            How TRUSTY assesses an agent without requiring private financial credentials on Day 0, then graduates it into higher spending limits via observed payment telemetry.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('day0')}
            className={`px-3 py-1.5 rounded transition ${
              activeTab === 'day0'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Day-Zero Underwriting (12 Signals)
          </button>
          <button
            onClick={() => setActiveTab('behavioral')}
            className={`px-3 py-1.5 rounded transition ${
              activeTab === 'behavioral'
                ? 'bg-purple-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Behavioral Credit File (20 Signals)
          </button>
        </div>
      </div>

      {/* THE 5-STEP GRADUATION PIPELINE (Slide 6 Bottom exact) */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#090d16] border border-slate-800">
        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-3 text-center sm:text-left">
          THE MACHINE CREDIT EVOLUTION PIPELINE
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs sm:text-sm font-bold">
          <span className="text-slate-300">PUBLIC DATA</span>
          <span className="text-slate-600">&rarr;</span>
          <span className="text-sky-400">THIN FILE (DAY 0)</span>
          <span className="text-slate-600">&rarr;</span>
          <span className="text-purple-400">TRANSACTION DATA</span>
          <span className="text-slate-600">&rarr;</span>
          <span className="text-emerald-400">CREDIT HISTORY</span>
          <span className="text-slate-600">&rarr;</span>
          <span className="text-white px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/60">
            RECOMMENDED CAPACITY ($)
          </span>
        </div>
      </div>

      {/* TAB 1: DAY-ZERO UNDERWRITING (Slide 4) */}
      {activeTab === 'day0' && (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <div className="text-[11px] font-mono text-sky-400 font-bold uppercase tracking-wider">
              DAY-ZERO UNDERWRITING
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1 font-sans">
              Score an agent before it ever integrates with TRUSTY
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Public internet evidence creates a thin-file credit assessment without requiring private financial data.
            </p>
          </div>

          {/* 12 Signals Grid (Slide 4 exact layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
            {dayZeroSignals.map(sig => (
              <div
                key={sig.num}
                className="p-4 rounded-xl bg-[#090d16] border border-slate-800/90 hover:border-slate-700 transition space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400">{sig.num}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Public Signal</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">{sig.title}</h3>
                  <div className="text-[11px] text-slate-400">{sig.sub}</div>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed pt-1">
                  {sig.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Day 0 Output Box (Slide 4 exact) */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900 to-[#0b101c] border border-sky-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                DAY 0 OUTPUT EXAMPLE
              </div>
              <div className="text-2xl sm:text-3xl font-black text-sky-400 mt-1">
                Credit Score 71/100
              </div>
            </div>

            <div className="text-xs text-slate-300 max-w-xl leading-relaxed">
              <span className="font-bold text-white">Confidence 43%</span> | <span className="text-amber-400 font-bold">THIN FILE</span> | Conservative limits until behavioral evidence exists across live transactions.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BEHAVIORAL CREDIT FILE (Slide 6) */}
      {activeTab === 'behavioral' && (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <div className="text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider">
              BEHAVIORAL CREDIT FILE
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1 font-sans">
              From public reputation to observed economic behavior
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              TRUSTY builds a machine credit history and converts it into recommended spending capacity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 20 Behavioral Signals (7 cols) */}
            <div className="lg:col-span-8 space-y-3 font-mono">
              <div className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mb-2">
                20 OBSERVED TELEMETRY SIGNALS
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {behavioralSignals.map(sig => (
                  <div
                    key={sig.num}
                    className="p-2.5 rounded bg-[#090d16] border border-slate-800/80 flex items-center space-x-2.5 hover:border-purple-800/40 transition"
                  >
                    <span className="text-purple-400 font-bold text-xs">{sig.num}</span>
                    <span className="text-slate-300 truncate">{sig.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benchmark Showcase: ProcurementBot (5 cols) (Slide 6 exact) */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl bg-[#0a0c16] border border-purple-900/50 p-6 space-y-6 shadow-xl relative overflow-hidden">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                    BEHAVIORAL BENCHMARK CARD
                  </div>
                  <h3 className="text-xl font-bold text-white font-sans">PROCUREMENTBOT</h3>
                </div>

                {/* Dual Scores */}
                <div className="grid grid-cols-2 gap-4 font-mono">
                  <div>
                    <div className="text-xs text-slate-400">Trust</div>
                    <div className="text-4xl font-black text-emerald-400 mt-1">94</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Credit</div>
                    <div className="text-4xl font-black text-purple-400 mt-1">87</div>
                  </div>
                </div>

                <div className="h-px bg-slate-800" />

                {/* Recommended Spending Capacity */}
                <div className="space-y-1 font-mono">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">
                    RECOMMENDED SPENDING CAPACITY
                  </div>
                  <div className="text-3xl font-black text-emerald-400">
                    $25,000
                  </div>
                  <div className="text-xs text-slate-400 uppercase">
                    PER DAY
                  </div>
                </div>

                {/* Human Approval Threshold */}
                <div className="p-3 rounded bg-purple-950/40 border border-purple-800/50 text-xs font-mono space-y-1">
                  <div className="text-slate-400">Human approval threshold:</div>
                  <div className="text-purple-300 font-bold">&gt;$5,000 / txn</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
