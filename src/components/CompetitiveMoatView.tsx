'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Check, 
  X, 
  ArrowRight, 
  TrendingUp, 
  Globe, 
  Search, 
  Cpu, 
  BadgeCheck,
  Zap,
  Repeat
} from 'lucide-react';

export const CompetitiveMoatView: React.FC = () => {
  const comparisonData = [
    {
      capability: 'Automatically discovers public agents',
      trusty: 'CORE',
      hivetrust: 'Registration-led',
      trustyWinning: true,
    },
    {
      capability: 'Public profile before agent opts in',
      trusty: 'CORE',
      hivetrust: 'Limited / not core',
      trustyWinning: true,
    },
    {
      capability: 'Public-internet thin-file scoring',
      trusty: 'CORE',
      hivetrust: 'Not primary model',
      trustyWinning: true,
    },
    {
      capability: 'Data / security Trust Score',
      trusty: 'YES',
      hivetrust: 'YES',
      trustyWinning: false,
    },
    {
      capability: 'Behavioral transaction telemetry',
      trusty: 'YES',
      hivetrust: 'YES',
      trustyWinning: false,
    },
    {
      capability: 'Recommended spending capacity',
      trusty: 'CORE ROADMAP',
      hivetrust: 'Risk / insurance focus',
      trustyWinning: true,
    },
    {
      capability: 'Rail-agnostic bank / card / wallet layer',
      trusty: 'CORE VISION',
      hivetrust: 'Base / USDC emphasis',
      trustyWinning: true,
    },
    {
      capability: 'Free badge + SEO distribution loop',
      trusty: 'CORE GTM',
      hivetrust: 'Not primary GTM',
      trustyWinning: true,
    },
    {
      capability: 'Parametric insurance / collateral',
      trusty: 'NO - PARTNER',
      hivetrust: 'CORE',
      trustyWinning: false,
    },
  ];

  const gtmSteps = [
    { num: 1, title: 'CRAWL', desc: 'Discover agents automatically across GitHub, MCP, and registries.' },
    { num: 2, title: 'PROFILE', desc: 'Create public Trust & Credit profile without requiring agent sign-up.' },
    { num: 3, title: 'INDEX', desc: 'Google & web indexers index [Agent] Trust Score and security file.' },
    { num: 4, title: 'CLAIM', desc: 'Developer verifies domain & repository ownership to manage badge.' },
    { num: 5, title: 'BADGE', desc: 'Developer embeds verified TRUSTY badge on README and docs.' },
    { num: 6, title: 'SEARCH', desc: 'Humans and security teams discover other verified agents in bureau.' },
    { num: 7, title: 'API / MCP', desc: 'Autonomous agents query TRUSTY API directly before transacting.' },
    { num: 8, title: 'LEARN', desc: 'Queries + completed transaction outcomes continuously improve scores.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      {/* HEADER: TRUSTY vs HIVETRUST (Slide 8) */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span>TRUSTY.BOT • COMPETITIVE LANDSCAPE & STRATEGIC MOAT</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
          TRUSTY.BOT <span className="text-slate-500 font-normal">vs</span> <span className="text-sky-400">HiveTrust</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Both address agent trust. TRUSTY is designed to win the public discovery + thin-file credit + rail-agnostic capacity layer.
        </p>
      </div>

      {/* COMPARISON MATRIX TABLE */}
      <div className="rounded-xl border border-slate-800 bg-[#090d16] overflow-hidden font-mono text-xs shadow-xl">
        <div className="grid grid-cols-12 bg-slate-950 p-3.5 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-6 sm:col-span-5">CAPABILITY</div>
          <div className="col-span-3 sm:col-span-4 text-sky-400 font-black">TRUSTY.BOT</div>
          <div className="col-span-3 text-slate-400">HIVETRUST</div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {comparisonData.map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-12 p-3.5 items-center transition ${
                row.trustyWinning ? 'bg-sky-950/[0.06]' : 'hover:bg-slate-900/40'
              }`}
            >
              <div className="col-span-6 sm:col-span-5 font-sans font-medium text-slate-200 text-xs sm:text-sm">
                {row.capability}
              </div>
              <div className="col-span-3 sm:col-span-4">
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] sm:text-xs ${
                  row.trusty === 'CORE' || row.trusty === 'CORE ROADMAP' || row.trusty === 'CORE VISION' || row.trusty === 'CORE GTM'
                    ? 'bg-sky-950 border border-sky-700 text-sky-300'
                    : row.trusty === 'YES'
                    ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                    : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}>
                  {row.trusty}
                </span>
              </div>
              <div className="col-span-3 text-slate-400 font-sans text-xs">
                {row.hivetrust}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* THE TRUSTY WEDGE BOX (Slide 8 bottom exact) */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-sky-950/50 via-[#0a1424] to-slate-900 border border-sky-800/60 shadow-lg">
        <div className="text-[11px] font-mono text-sky-400 font-bold uppercase tracking-wider mb-2">
          THE STRATEGIC WEDGE
        </div>
        <div className="text-base sm:text-lg font-bold text-white font-mono leading-relaxed">
          <span className="text-sky-300">Discover first</span> &rarr; <span className="text-emerald-300">Score from public evidence</span> &rarr; <span className="text-purple-300">Learn from transactions</span> &rarr; <span className="text-white">Recommend capacity everywhere.</span>
        </div>
        <div className="text-[10px] font-mono text-slate-500 mt-2">
          Source: hivetrustiq.com and public HiveTrust documentation, accessed Sep 2026.
        </div>
      </div>

      {/* GTM FLYWHEEL SECTION (Slide 9) */}
      <div className="space-y-6 pt-4">
        <div className="border-b border-slate-800/80 pb-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            GO-TO-MARKET DISTRIBUTION
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1 font-sans">
            Turn every scored agent into distribution
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            TRUSTY grows by creating useful public infrastructure before asking anyone to integrate.
          </p>
        </div>

        {/* 8-Step Flywheel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {gtmSteps.map(step => (
            <div
              key={step.num}
              className="p-4 rounded-xl bg-[#090d16] border border-slate-800 hover:border-slate-700 transition space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-sky-400 text-xs font-bold flex items-center justify-center">
                  {step.num}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Flywheel Step</span>
              </div>
              <div className="text-sm font-bold text-white tracking-wide">
                {step.title}
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* North Star Trajectory Banner (Slide 9 bottom exact) */}
        <div className="p-6 rounded-xl bg-[#070e17] border border-sky-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
              NORTH STAR OBJECTIVE
            </div>
            <div className="text-2xl sm:text-3xl font-black text-sky-400 mt-1">
              1,000 Agent Risk Decisions / Day
            </div>
          </div>
          <div className="text-xs text-slate-300 max-w-md font-sans">
            Then <span className="font-bold text-white font-mono">10K/day &rarr; 1M/day</span> as machine-to-machine calls replace manual human search across payment gateways.
          </div>
        </div>
      </div>

      {/* THE VISION (Slide 10) */}
      <div className="p-8 rounded-2xl bg-[#09101c] border border-slate-700 space-y-6 text-center sm:text-left relative overflow-hidden">
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-purple-400 uppercase tracking-widest font-bold">
            THE 2026 VISION
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-sans">
            The trust layer for the agentic economy
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
            Every agent should have an identity, a trust history, and a risk-adjusted economic capacity.
          </p>
        </div>

        {/* The Big 3-Step Banner */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-center sm:justify-start gap-4 font-mono text-sm sm:text-base font-bold">
          <span className="text-slate-400">BEFORE AN AGENT GETS YOUR:</span>
          <span className="text-sky-400">DATA</span>
          <span className="text-purple-400">PERMISSIONS</span>
          <span className="text-emerald-400">MONEY</span>
          <span className="text-white">&rarr; ASK TRUSTY.</span>
        </div>

        <p className="text-xs text-slate-400 font-sans max-w-3xl leading-relaxed">
          The end state: TRUSTY becomes the independent score queried before agents connect, transact, spend, or receive delegated credit.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-xs font-bold text-sky-300">
          <span>DISCOVER</span>
          <span className="text-slate-600">&rarr;</span>
          <span>TRUST</span>
          <span className="text-slate-600">&rarr;</span>
          <span>CREDIT</span>
          <span className="text-slate-600">&rarr;</span>
          <span>CAPACITY</span>
          <span className="text-slate-600">&rarr;</span>
          <span className="text-emerald-400">AUTHORIZE</span>
        </div>
      </div>
    </div>
  );
};
