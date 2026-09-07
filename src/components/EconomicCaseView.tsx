'use client';

import React, { useState } from 'react';
import { calculateEconomicROI, DEFAULT_BREX_CASE } from '@/lib/economics/roiCalculator';
import { 
  TrendingUp, 
  ShieldCheck, 
  Sliders, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Clock, 
  PieChart, 
  ShieldAlert, 
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface EconomicCaseViewProps {
  onOpenDecisionPlayground?: () => void;
}

export const EconomicCaseView: React.FC<EconomicCaseViewProps> = ({
  onOpenDecisionPlayground,
}) => {
  // Interactive Slider State
  const [decisionsPerYear, setDecisionsPerYear] = useState<number>(1000000);
  const [averageTxn, setAverageTxn] = useState<number>(500);
  const [costPerDecision, setCostPerDecision] = useState<number>(0.25);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  const activeInputs = isCustomMode
    ? {
        decisionsPerYear,
        averageTransactionSize: averageTxn,
        costPerDecision,
      }
    : DEFAULT_BREX_CASE;

  const results = calculateEconomicROI(activeInputs);

  const resetToBrexDefault = () => {
    setDecisionsPerYear(1000000);
    setAverageTxn(500);
    setCostPerDecision(0.25);
    setIsCustomMode(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      {/* SECTION 1: HEADER & CORE POSITIONING (Slide 1) */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 pb-8">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-[#0066FF]/10 dark:bg-sky-950/40 border border-[#0066FF]/30 dark:border-sky-800/50 text-[11px] font-mono text-[#0066FF] dark:text-sky-400 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] dark:bg-sky-400 animate-pulse" />
          <span>TRUSTY.BOT • AGENT RISK & CREDIT INFRASTRUCTURE</span>
          <span className="text-slate-400 dark:text-slate-600">|</span>
          <span className="text-slate-700 dark:text-slate-300">THE ECONOMIC CASE</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white font-sans">
          From data lookup to <span className="text-[#0066FF] dark:text-sky-400">financial risk decision</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          The economic value changes when TRUSTY sits directly in the decision path before autonomous money moves.
        </p>

        {/* Side-by-side comparison: Data Lookup vs Risk Decision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Card 1: Data Lookup */}
          <div className="rounded-xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div className="space-y-4">
              <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
                DATA LOOKUP
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-200 font-mono">
                &ldquo;What is this agent&rsquo;s score?&rdquo;
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Information only. Read-only query before installation or workflow registration.
              </p>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Typical value: <span className="text-slate-800 dark:text-slate-300 font-semibold">cents per query</span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-baseline justify-between">
              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-slate-300">
                  1M lookups
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  TRUSTY = data provider
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[10px] font-mono text-slate-700 dark:text-slate-400">
                Passive Lookup
              </span>
            </div>
          </div>

          {/* Card 2: Risk Decision (Hero highlighted) - Primary gradient in light mode */}
          <div className="rounded-xl bg-gradient-to-br from-[#0066FF] to-[#004bbd] text-white dark:bg-[#09101c] border border-blue-400/40 dark:border-sky-500/50 p-6 flex flex-col justify-between relative shadow-xl shadow-blue-500/10">
            <div className="absolute top-0 right-0 px-3 py-1 bg-white/20 dark:bg-sky-500/10 border-b border-l border-white/30 dark:border-sky-500/30 rounded-bl text-[10px] font-mono text-white dark:text-sky-300 font-bold uppercase tracking-wider">
              Core Economic Moat
            </div>

            <div className="space-y-4">
              <div className="text-[11px] font-mono uppercase tracking-widest text-blue-100 dark:text-sky-400 font-bold">
                RISK DECISION
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                &ldquo;Should this $4,800 move?&rdquo;
              </div>
              <p className="text-xs sm:text-sm text-blue-50 dark:text-slate-300">
                Real economic consequence. Evaluated in milliseconds prior to card authorization or wire settlement.
              </p>
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-300 dark:text-emerald-400 font-bold">
                <span>APPROVE</span>
                <span>/</span>
                <span className="text-rose-200 dark:text-rose-400">DECLINE</span>
                <span>/</span>
                <span className="text-amber-200 dark:text-amber-400">HUMAN REVIEW</span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/20 dark:border-sky-500/30 flex items-baseline justify-between">
              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-300 dark:text-emerald-400">
                  $500M volume evaluated
                </div>
                <div className="text-[11px] font-mono text-blue-100 dark:text-sky-400">
                  TRUSTY = risk infrastructure
                </div>
              </div>
              <button
                onClick={onOpenDecisionPlayground}
                className="px-3 py-1.5 rounded bg-white hover:bg-blue-50 text-[#0066FF] dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-white font-bold text-xs font-mono transition flex items-center space-x-1 shadow-sm"
              >
                <span>Test Decision API</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: THE ILLUSTRATIVE BREX CASE (Slide 2) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#0066FF] dark:text-sky-400 font-semibold">
              ILLUSTRATIVE BREX CASE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight mt-1 font-sans">
              $500M of agentic spend under decision
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-mono">
              1,000,000 attempted agent transactions &times; $500 average transaction size.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition flex items-center space-x-1.5 border ${
                isCustomMode
                  ? 'bg-sky-950 border-sky-700 text-sky-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isCustomMode ? 'Custom Simulation Active' : 'Customize Scenario'}</span>
            </button>
            {isCustomMode && (
              <button
                onClick={resetToBrexDefault}
                className="text-xs font-mono text-slate-400 hover:text-white underline px-2"
              >
                Reset to Brex Defaults
              </button>
            )}
          </div>
        </div>

        {/* Custom Controls (If active) */}
        {isCustomMode && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-800/60 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fadeIn">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                DECISIONS / YEAR: <span className="text-white font-bold">{decisionsPerYear.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="100000"
                max="5000000"
                step="100000"
                value={decisionsPerYear}
                onChange={e => setDecisionsPerYear(Number(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                AVG TRANSACTION: <span className="text-white font-bold">${averageTxn.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={averageTxn}
                onChange={e => setAverageTxn(Number(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                TRUSTY / DECISION: <span className="text-white font-bold">${costPerDecision.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.05"
                max="1.00"
                step="0.05"
                value={costPerDecision}
                onChange={e => setCostPerDecision(Number(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>
          </div>
        )}

        {/* 4 Metric Cards (Slide 2 Exact Match) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
              DECISIONS / YEAR
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#0066FF] dark:text-sky-400 mt-1">
              {(results.agenticSpendUnderDecision / (activeInputs.averageTransactionSize || 500) / 1000000).toFixed(1)}M
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
              Attempted machine authorizations
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
              AGENTIC SPEND
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
              ${(results.agenticSpendUnderDecision / 1000000).toFixed(0)}M
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
              AVUD under active evaluation
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
              TRUSTY / DECISION
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
              ${(activeInputs.costPerDecision || 0.25).toFixed(2)}
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
              Per-authorization risk fee
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
              ANNUAL TRUSTY COST
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              ${(results.annualTrustyCost / 1000).toFixed(0)}K
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
              Total infrastructure investment
            </div>
          </div>
        </div>

        {/* Highlight Box: 5 Basis Points of Volume - Primary gradient in light mode */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-blue-700 via-[#0052cc] to-indigo-700 text-white dark:from-slate-900 dark:via-[#0a1220] dark:to-slate-900 border border-blue-400/30 dark:border-sky-900/50 shadow-lg">
          <div className="text-[11px] font-mono text-blue-100 dark:text-sky-400 font-bold uppercase tracking-wider">
            TRUSTY COST = {results.trustyCostBasisPoints} BASIS POINTS OF VOLUME
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-2">
            ${results.annualTrustyCost.toLocaleString()} / ${results.agenticSpendUnderDecision.toLocaleString()} = {results.trustyCostBasisPoints / 100}%
          </div>
          <p className="mt-2 text-xs sm:text-sm text-blue-50 dark:text-slate-300 max-w-2xl leading-relaxed">
            The core underwriting question for Brex, Stripe, and corporate card issuers: <strong className="text-white">can TRUSTY create more than {results.trustyCostBasisPoints} bps of value</strong> through lower losses, less human friction, and more safely approved autonomous spend?
          </p>
        </div>
      </div>

      {/* SECTION 3: THREE ROI ENGINES (Slide 3) */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
            THREE ROI ENGINES
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1 font-sans">
            TRUSTY can create value on both sides of the risk equation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Illustrative scenario showing why a ${(activeInputs.costPerDecision || 0.25).toFixed(2)} decision is economically compelling for enterprise financial networks.
          </p>
        </div>

        {/* The 3 Engines List */}
        <div className="space-y-3">
          {/* Engine 1 */}
          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wide">
                  PREVENT LOSSES
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Avoid a portion of unauthorized, rogue, or high-risk agent spend.
                </div>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 tabular-nums self-end sm:self-auto">
              ${(results.engine1PreventLosses / 1000).toFixed(0)}K
            </div>
          </div>

          {/* Engine 2 */}
          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-700/60 text-sky-700 dark:text-sky-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wide">
                  REDUCE HUMAN REVIEWS
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Automate legitimate agent transactions that would otherwise require manual ops intervention.
                </div>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#0066FF] dark:text-sky-400 tabular-nums self-end sm:self-auto">
              ${(results.engine2ReduceHumanReviews / 1000).toFixed(0)}K
            </div>
          </div>

          {/* Engine 3 */}
          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-700/60 text-purple-700 dark:text-purple-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wide">
                  APPROVE MORE GOOD SPEND
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Enable incremental autonomous payment volume safely without blanket restriction locks.
                </div>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#0066FF] dark:text-sky-400 tabular-nums self-end sm:self-auto">
              ${(results.engine3ApproveMoreGoodSpend / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>

        {/* Summary ROI Bar - Vibrant gradient in light mode */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white dark:bg-[#070e17] border border-emerald-400/40 dark:border-emerald-500/40 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-md">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-100 dark:text-slate-400">
              TOTAL ILLUSTRATIVE VALUE
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white dark:text-emerald-400 mt-1">
              ${(results.totalIllustrativeValue / 1000000).toFixed(1)}M
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-100 dark:text-slate-400">
              TRUSTY COST
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-50 dark:text-slate-300 mt-1">
              ${(results.annualTrustyCost / 1000).toFixed(0)}K
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-100 dark:text-slate-400">
              NET VALUE
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-200 dark:text-sky-400 mt-1">
              +${(results.netEconomicValue / 1000000).toFixed(2)}M
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-100 dark:text-slate-400">
              GROSS BENEFIT / COST
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white dark:text-emerald-300 mt-1">
              ~{results.grossBenefitCostRatio}x
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: HOW TRUSTY GETS PAID & AVUD (Slide 4) */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-semibold">
            HOW TRUSTY GETS PAID
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1 font-sans">
            Price against risk and economic value — not just API calls
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            The buyer can be the card issuer, agent wallet, bank, payment platform, or enterprise making the financial decision.
          </p>
        </div>

        {/* Without vs With TRUSTY Comparison Box (Slide 4 exact) */}
        <div className="space-y-4">
          {/* Without */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
              WITHOUT TRUSTY (THE BLIND DILEMMA)
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300">
              <span className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300 text-center w-full sm:w-auto">
                Allow agents freely &rarr; <strong className="text-rose-900 dark:text-rose-200">More Risk</strong>
              </span>
              <span className="text-slate-400 font-bold">OR</span>
              <span className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-300 text-center w-full sm:w-auto">
                Require conservative limits &rarr; <strong className="text-amber-900 dark:text-amber-200">Less Autonomy</strong>
              </span>
            </div>
          </div>

          {/* With */}
          <div className="p-5 rounded-xl bg-emerald-50/40 dark:bg-[#091515] border border-emerald-200 dark:border-emerald-500/40 space-y-3 shadow-sm">
            <div className="text-[11px] font-mono text-emerald-800 dark:text-emerald-400 uppercase tracking-widest font-bold flex items-center justify-between">
              <span>WITH TRUSTY (GRANULAR RISK-ADJUSTED CAPACITIES)</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-300 font-normal">Real-Time Decision Path</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded bg-white dark:bg-slate-950 border border-emerald-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400">Agent A (Thin File):</span> <strong className="text-slate-900 dark:text-white">$100/day</strong>
              </div>
              <div className="p-2.5 rounded bg-white dark:bg-slate-950 border border-emerald-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400">Agent B (Standard):</span> <strong className="text-slate-900 dark:text-white">$5K/day</strong>
              </div>
              <div className="p-2.5 rounded bg-white dark:bg-slate-950 border border-emerald-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400">Agent C (Tier AA):</span> <strong className="text-emerald-600 dark:text-emerald-400">$25K/day</strong>
              </div>
            </div>
            <div className="text-xs font-mono text-slate-700 dark:text-slate-300">
              Each individual transaction evaluated: <span className="text-emerald-600 dark:text-emerald-400 font-bold">APPROVE</span> / <span className="text-rose-600 dark:text-rose-400 font-bold">DECLINE</span> / <span className="text-amber-600 dark:text-amber-400 font-bold">HUMAN REVIEW</span>
            </div>
          </div>
        </div>

        {/* Pricing Model & North Star */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
              COMMERCIAL PRICING MODEL
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
              Platform Fee + Per-Decision Fee + Volume/Risk Tier
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
              Aligned with fintech risk reduction rather than commoditized static data scrapes.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-r from-[#0066FF] to-sky-600 text-white dark:from-sky-950/40 dark:to-[#0b101c] border border-blue-400/40 dark:border-sky-800/60 space-y-1 shadow-md">
            <div className="text-[10px] font-mono uppercase tracking-widest text-blue-100 dark:text-sky-400 font-semibold">
              NORTH-STAR ECONOMIC METRIC
            </div>
            <div className="text-xl font-black text-sky-300 font-mono tracking-tight">
              AGENTIC VOLUME UNDER DECISION (AVUD)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Total cumulative dollar flow cleared through TRUSTY risk gates at machine speed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
