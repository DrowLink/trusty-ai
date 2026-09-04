'use client';

import React from 'react';
import { ShieldCheck, BookOpen, PlusCircle, Activity, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenEvaluate: () => void;
  onOpenSpecs: () => void;
  totalAgents: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEvaluate, onOpenSpecs, totalAgents }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080d1a]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 shadow-glow p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                TRUSTY<span className="text-sky-400">.ai</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-sky-500/10 text-sky-300 rounded border border-sky-500/20">
                MVP Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              VirusTotal + Moody’s for AI Agents
            </p>
          </div>
        </div>

        {/* Live Index Status & Action Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400 font-mono">Live Index:</span>
            <span className="font-semibold text-white font-mono">{totalAgents} Agents</span>
          </div>

          <button
            onClick={onOpenSpecs}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Specs & Architecture</span>
            <span className="sm:hidden">Specs</span>
          </button>

          <button
            onClick={onOpenEvaluate}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 shadow-glow transition active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Audit Custom Agent</span>
          </button>
        </div>
      </div>
    </header>
  );
};
