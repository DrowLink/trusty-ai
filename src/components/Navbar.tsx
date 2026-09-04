'use client';

import React from 'react';
import { ShieldCheck, BookOpen, PlusCircle } from 'lucide-react';

interface NavbarProps {
  onOpenEvaluate: () => void;
  onOpenSpecs: () => void;
  totalAgents: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEvaluate, onOpenSpecs, totalAgents }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080d1a]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 shadow-glow p-0.5 flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[9px] sm:rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6 text-sky-400" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="text-base sm:text-xl font-bold tracking-tight text-white font-mono">
                TRUSTY<span className="text-sky-400">.ai</span>
              </span>
              <span className="px-1.5 py-0.2 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider bg-sky-500/10 text-sky-300 rounded border border-sky-500/20">
                MVP
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate hidden xs:block sm:block">
              VirusTotal + Moody’s for AI Agents
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* Index Counter Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">Index:</span>
            <span className="font-semibold text-white">{totalAgents}</span>
          </div>

          {/* Specs Button */}
          <button
            onClick={onOpenSpecs}
            title="Specs & Architecture"
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <span className="hidden md:inline">Specs</span>
          </button>

          {/* Audit Button */}
          <button
            onClick={onOpenEvaluate}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 shadow-glow transition active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Audit Custom Agent</span>
            <span className="sm:hidden">Audit</span>
          </button>
        </div>
      </div>
    </header>
  );
};
