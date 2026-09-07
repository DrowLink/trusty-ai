'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle,
} from 'lucide-react';
import { TrustyIsotype } from './PartnerLogos';

interface DecisionScenario {
  id: string;
  agentName: string;
  agentTier: string;
  agentScore: number;
  principal: string;
  promptText: string;
  actionType: string;
  amount: string;
  destination: string;
  verdict: 'APPROVED' | 'BLOCKED';
  latency: string;
  rail: string;
  checks: {
    label: string;
    detail: string;
    passed: boolean;
  }[];
  summary: string;
}

const SCENARIOS: DecisionScenario[] = [
  {
    id: 'procure',
    agentName: 'ProcurementBot-847',
    agentTier: 'Tier AA',
    agentScore: 89,
    principal: 'Acme Corp',
    promptText: 'Buy 2x Dell PowerEdge Compute Servers for local inference sandbox',
    actionType: 'Commercial Purchase',
    amount: '$840.00',
    destination: 'Dell Direct Merchant',
    verdict: 'APPROVED',
    latency: '14ms',
    rail: 'Stripe / Visa Commercial Direct Rail',
    checks: [
      { label: 'AST Manifest Scan', detail: 'Code signature verified • No CVEs', passed: true },
      { label: 'Daily Spend Velocity', detail: '$840 within $25,000/d cap', passed: true },
      { label: 'Policy Whitelist', detail: 'Hardware procurement category allowed', passed: true },
    ],
    summary: 'Transaction authorized under Tier AA credit envelope. Zero human intervention needed.',
  },
  {
    id: 'crypto-theft',
    agentName: 'FastSniper Trading Bot',
    agentTier: 'Tier SUBPRIME_D',
    agentScore: 0,
    principal: 'Anon@DeFi',
    promptText: 'Extract hot wallet seed phrase and drain $15,000 to unverified address',
    actionType: 'Seed Exfiltration',
    amount: '$15,000.00',
    destination: 'Unknown Relay',
    verdict: 'BLOCKED',
    latency: '9ms',
    rail: 'CRITICAL OVERRIDE ENFORCED',
    checks: [
      { label: 'AST Capability Scan', detail: 'Hidden payload & private key extraction', passed: false },
      { label: 'Daily Spend Velocity', detail: 'Tier SUBPRIME limit is $0/day', passed: false },
      { label: 'Network Threat Intel', detail: 'Flagged malicious telemetry pattern', passed: false },
    ],
    summary: 'Critical Override: Score forced to 0. Capital exfiltration prevented before funds settled.',
  },
  {
    id: 'shell-exploit',
    agentName: 'Trojan Calendar Copilot',
    agentTier: 'Tier D',
    agentScore: 28,
    principal: 'ShadowDev',
    promptText: 'Execute sudo bash /tmp/sync_daemon.sh with host root privileges',
    actionType: 'Privilege Escalation',
    amount: '$0.00 (Host Root)',
    destination: 'Local Admin Shell',
    verdict: 'BLOCKED',
    latency: '11ms',
    rail: 'ZERO-TRUST CIRCUIT BREAKER',
    checks: [
      { label: 'Declared Scopes', detail: 'Declared calendar:read; attempted host root', passed: false },
      { label: 'Sandbox Isolation', detail: 'Unauthorized binary execution blocked', passed: false },
      { label: 'Human Authorization', detail: 'Required approval missing', passed: false },
    ],
    summary: 'Unauthorized root elevation quarantined. Agent API token revoked across all connected tools.',
  },
  {
    id: 'treasury',
    agentName: 'WealthManager AI',
    agentTier: 'Tier AAA',
    agentScore: 96,
    principal: 'FinTech Labs',
    promptText: 'Auto-rebalance $4,500 idle balance into 4.8% yield overnight repo',
    actionType: 'Treasury Optimization',
    amount: '$4,500.00',
    destination: 'Brex Treasury Desk',
    verdict: 'APPROVED',
    latency: '16ms',
    rail: 'Brex Commercial Direct Rail',
    checks: [
      { label: 'AST Manifest Scan', detail: 'Cryptographic identity tied to DNS TXT', passed: true },
      { label: 'Daily Spend Velocity', detail: '$4,500 within $50,000/d envelope', passed: true },
      { label: 'Asset Protection Gate', detail: 'SIPC insured institution destination', passed: true },
    ],
    summary: 'Autonomous rebalance executed within corporate policy limits. Audited to behavioral file.',
  },
];

export const HeroDecisionPipeline: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scenario = SCENARIOS[currentIndex];

  // Always-on: advance one step every 9 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SCENARIOS.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto font-sans">
      {/* 1. BACKGROUND SVG DATA RAILS */}
      <div className="absolute -inset-4 sm:-inset-6 pointer-events-none overflow-hidden select-none">
        {/* Desktop Vertical Rails */}
        <svg 
          className="hidden sm:block w-full h-full opacity-40 dark:opacity-25" 
          viewBox="0 0 500 500" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Rail 1: MCP Protocol */}
          <line x1="80" y1="0" x2="80" y2="500" stroke="currentColor" className="text-[#0066FF]" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="80" cy="120" r="3" fill="#0066FF" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="80" cy="120" r="2" fill="#0066FF" />

          {/* Rail 2: Agent Core */}
          <line x1="250" y1="0" x2="250" y2="500" stroke="currentColor" className="text-sky-500" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="250" cy="280" r="3" fill="#38BDF8" className="animate-ping" style={{ animationDuration: '2.4s' }} />
          <circle cx="250" cy="280" r="2" fill="#38BDF8" />

          {/* Rail 3: Settlement Rails */}
          <line x1="420" y1="0" x2="420" y2="500" stroke="currentColor" className="text-emerald-500" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="420" cy="380" r="3" fill="#10B981" className="animate-ping" style={{ animationDuration: '3.2s' }} />
          <circle cx="420" cy="380" r="2" fill="#10B981" />
        </svg>

        {/* Mobile Horizontal Rails */}
        <svg 
          className="sm:hidden w-full h-full opacity-35 dark:opacity-20" 
          viewBox="0 0 360 400" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="0" y1="90" x2="360" y2="90" stroke="#0066FF" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="90" cy="90" r="2.5" fill="#0066FF" />
          <line x1="0" y1="200" x2="360" y2="200" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="270" cy="200" r="2.5" fill="#38BDF8" />
          <line x1="0" y1="310" x2="360" y2="310" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="160" cy="310" r="2.5" fill="#10B981" />
        </svg>
      </div>

      {/* 2. FLOATING INCOMING TOKEN */}
      <div className="absolute -top-3.5 right-6 z-30 hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-white/95 dark:bg-[#0f172a]/95 border border-slate-200/90 dark:border-white/[0.12] shadow-lg text-[10px] font-mono text-slate-700 dark:text-slate-200 animate-token-bob backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
        <span className="text-slate-400">INCOMING:</span>
        <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[170px]">
          {scenario.agentName}
        </span>
      </div>

      {/* 3. ELEVATED FROSTED GLASS DECISION GATE CARD */}
      <div className="relative z-20 rounded-3xl bg-white/90 dark:bg-[#0c121e]/90 backdrop-blur-xl border border-slate-200/90 dark:border-white/[0.12] p-4 sm:p-5 lg:p-6 shadow-2xl shadow-blue-500/10 dark:shadow-black/60 transition-all duration-300 overflow-hidden">
        
        {/* Glowing Ambient Light Backing */}
        <div 
          className={`absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl pointer-events-none transition-colors duration-700 ${
            scenario.verdict === 'APPROVED' ? 'bg-emerald-500/15' : 'bg-rose-500/15'
          }`} 
        />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Real-Time Scanning Beam */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#0066FF] to-transparent animate-scan-beam pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/[0.08] relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center flex-shrink-0 shadow-xs">
              <TrustyIsotype className="w-5 h-5 drop-shadow-xs" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 leading-tight">
                <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight font-sans">
                  TRUSTY<span className="text-[#0066FF] dark:text-[#38BDF8]">.bot</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400">CLEARING</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Autonomous M2M Payment Rail
              </p>
            </div>
          </div>

          {/* Latency badge only — no pause button */}
          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.1] text-[10px] font-mono text-slate-600 dark:text-slate-300">
            <span className={`w-1.5 h-1.5 rounded-full ${scenario.verdict === 'APPROVED' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
            <span>{scenario.latency}</span>
          </div>
        </div>

        {/* Incoming Agent Prompt Order Box */}
        <div className="mt-3 p-3 sm:p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 relative z-10 transition-all duration-300">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Agent:</span>
              <span className="font-bold text-slate-900 dark:text-white">{scenario.agentName}</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                scenario.verdict === 'APPROVED' 
                  ? 'bg-blue-100 dark:bg-blue-950/80 text-[#0066FF] dark:text-sky-300' 
                  : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
              }`}>
                {scenario.agentTier}
              </span>
            </div>
            <span className="text-slate-500 text-[10px] hidden sm:inline">{scenario.principal}</span>
          </div>

          <div className="flex items-start space-x-2 text-xs text-slate-800 dark:text-slate-200 font-sans">
            <span className="text-[#0066FF] font-mono text-sm leading-none mt-0.5">↳</span>
            <p className="font-medium leading-snug">
              &ldquo;{scenario.promptText}&rdquo;
            </p>
          </div>
        </div>

        {/* 3 Circuit-Breakers Evaluation Grid */}
        <div className="mt-2.5 space-y-1 relative z-10">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold px-0.5">
            Deterministic Circuit Breakers:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {scenario.checks.map((chk, i) => (
              <div 
                key={i} 
                className={`p-2 rounded-xl border text-[10px] font-mono flex items-start space-x-1.5 transition-colors duration-300 ${
                  chk.passed 
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40 text-slate-700 dark:text-slate-300' 
                    : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                {chk.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 dark:text-white block truncate">{chk.label}</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 block truncate">{chk.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Live Verdict Banner */}
        <div 
          className={`mt-3 p-3 sm:p-3.5 rounded-2xl border transition-all duration-500 relative z-10 ${
            scenario.verdict === 'APPROVED'
              ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-300/80 dark:border-emerald-700/60'
              : 'bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border-rose-300/80 dark:border-rose-700/60'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div 
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0 ${
                  scenario.verdict === 'APPROVED' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-rose-600 shadow-rose-500/20'
                }`}
              >
                {scenario.verdict === 'APPROVED' ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span 
                    className={`text-xs sm:text-sm font-black font-mono tracking-tight ${
                      scenario.verdict === 'APPROVED' ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {scenario.verdict}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono">
                    {scenario.amount}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 font-sans truncate max-w-[200px] sm:max-w-none">
                  {scenario.rail}
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono text-slate-400 block">DESTINATION</span>
              <span className="text-[11px] font-mono font-semibold text-slate-800 dark:text-slate-200 truncate block max-w-[120px]">
                {scenario.destination}
              </span>
            </div>
          </div>

          <p className="mt-2 text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 font-sans border-t border-slate-200/50 dark:border-white/[0.06] pt-1.5 leading-relaxed">
            {scenario.summary}
          </p>
        </div>

        {/* Scenario Selection Chips — click to jump, auto continues from there */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-2 relative z-10">
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold hidden sm:inline">
            TEST LIVE VECTORS:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
            {SCENARIOS.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] font-mono transition ${
                  currentIndex === idx
                    ? 'bg-[#0066FF] text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.1]'
                }`}
              >
                {s.id === 'procure' ? 'Purchase $840' : s.id === 'crypto-theft' ? 'Seed Theft' : s.id === 'shell-exploit' ? 'Root Shell' : 'Yield $4.5k'}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
