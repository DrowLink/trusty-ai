'use client';

import React, { useState } from 'react';
import { AgentCreditProfile } from '@/lib/types';
import { simulateTransactionAuthorization } from '@/lib/scoring/creditEngine';
import { CreditCard, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Sparkles, Building2 } from 'lucide-react';

interface AgentCreditCardProps {
  agentName: string;
  trustScore: number;
  creditProfile: AgentCreditProfile;
}

export const AgentCreditCard: React.FC<AgentCreditCardProps> = ({
  agentName,
  trustScore,
  creditProfile,
}) => {
  const [testAmount, setTestAmount] = useState<number>(500);
  const [testResult, setTestResult] = useState<{
    decision: 'APPROVED_AUTONOMOUS' | 'REQUIRES_HUMAN_APPROVAL' | 'DECLINED_LIMIT_EXCEEDED';
    reason: string;
    clearingRail: string;
  } | null>(null);

  const handleTestPayment = (amount: number) => {
    setTestAmount(amount);
    const result = simulateTransactionAuthorization(amount, creditProfile);
    setTestResult(result);
  };

  return (
    <div className="w-full rounded-2xl bg-[#0b0c14] border border-purple-900/40 p-5 sm:p-6 shadow-2xl font-sans relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Part 3 Beta Header Pill */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/[0.08] relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold">
            PART 2 & 3: CREDIT UNDERWRITING & PAYMENT RAILS
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-[10px] font-mono text-purple-200 font-bold">
          BETA • VISA INTEGRATED
        </span>
      </div>

      {/* CARD BODY: REPRODUCING THE USER'S EXACT REFERENCE DESIGN */}
      <div className="space-y-5 relative z-10">
        {/* Agent Profile Title */}
        <div>
          <div className="text-[11px] font-mono tracking-wider uppercase text-zinc-400 font-semibold">
            AGENT PROFILE
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 font-sans">
            {agentName}
          </h3>
        </div>

        {/* Dual Scores: TRUST (Green) & CREDIT (Purple) */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          {/* Trust Score */}
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider uppercase text-zinc-400">
              TRUST
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 mt-1 tabular-nums">
              {trustScore}
            </div>
            <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
              Security & Integrity
            </div>
          </div>

          {/* Credit Score */}
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider uppercase text-zinc-400">
              CREDIT
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-purple-400 mt-1 tabular-nums">
              {creditProfile.creditScore}
            </div>
            <div className="text-[10px] font-mono text-purple-400/80 mt-0.5 flex items-center space-x-1">
              <span>Tier {creditProfile.creditTier} (Public Underwriting)</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/[0.08] my-3" />

        {/* Estimated Agent Capacity */}
        <div>
          <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 font-semibold">
            ESTIMATED
          </div>
          <div className="text-sm font-bold tracking-wider uppercase text-white font-mono mt-0.5">
            AGENT CAPACITY
          </div>

          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-400 tracking-tight tabular-nums">
              ${creditProfile.estimatedDailyCapacity.toLocaleString()}
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
              PER DAY
            </span>
          </div>

          {/* Human Approval Rule */}
          <div className="mt-2.5 flex items-center space-x-2 text-xs font-mono">
            <span className="text-zinc-400">Human approval</span>
            <span className="text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/60">
              &gt;${creditProfile.humanApprovalThreshold.toLocaleString()} / txn
            </span>
          </div>
        </div>

        {/* Receive Capacity Telemetry */}
        <div className="p-3 rounded-lg bg-zinc-950/70 border border-white/[0.06] text-xs font-mono flex flex-wrap items-center justify-between gap-2">
          <span className="text-zinc-400">Authorized Inbound Settlement (Receive):</span>
          <span className="text-emerald-400 font-bold">
            Up to ${creditProfile.receiveCapacityDaily.toLocaleString()} / day
          </span>
        </div>

        {/* Simulated Payment Rails Badges */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Connected Payment Rails (Simulated Production Bridge):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {creditProfile.connectedRails.map((rail, idx) => (
              <div
                key={idx}
                className="p-2 rounded bg-zinc-900/90 border border-white/[0.08] flex items-center space-x-2 text-[11px] font-mono"
              >
                <CreditCard className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-zinc-200 font-medium truncate">{rail.name.split(' ')[0]}</div>
                  <div className="text-[9px] text-emerald-400 uppercase font-semibold">Active Beta</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PART 3: INTERACTIVE PAYMENT CAPACITY SIMULATOR */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-purple-800/40 mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-zinc-200 font-semibold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Simulate Payment Rail Authorization ($100 vs $20,000):</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
              Visa Direct Engine
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[100, 2500, 5000, 7500, 20000, 35000].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => handleTestPayment(amt)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition border ${
                  testAmount === amt
                    ? 'bg-purple-600 text-white border-purple-400 font-bold'
                    : 'bg-zinc-900 text-zinc-300 border-white/[0.08] hover:border-purple-500'
                }`}
              >
                ${amt.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Decision Outcome Card */}
          {testResult && (
            <div className={`p-3 rounded-lg border text-xs font-mono transition animate-in fade-in ${
              testResult.decision === 'APPROVED_AUTONOMOUS'
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                : testResult.decision === 'REQUIRES_HUMAN_APPROVAL'
                ? 'bg-amber-950/40 border-amber-800 text-amber-200'
                : 'bg-rose-950/40 border-rose-800 text-rose-200'
            }`}>
              <div className="flex items-center space-x-2 font-bold mb-1">
                {testResult.decision === 'APPROVED_AUTONOMOUS' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                {testResult.decision === 'REQUIRES_HUMAN_APPROVAL' && <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                {testResult.decision === 'DECLINED_LIMIT_EXCEEDED' && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                <span className="uppercase">
                  Decision for ${testAmount.toLocaleString()} USD: {testResult.decision.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90 font-sans">
                {testResult.reason}
              </p>
              <div className="mt-1.5 pt-1.5 border-t border-white/[0.08] text-[10px] text-zinc-400 flex justify-between">
                <span>Clearing Network: {testResult.clearingRail}</span>
                <span>Idempotency: ENFORCED</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
