'use client';

import React from 'react';
import { ShieldCheck, BookOpen, Plus, Github, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onOpenEvaluate: () => void;
  onOpenSpecs: () => void;
  totalAgents: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEvaluate, onOpenSpecs, totalAgents }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090a10]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Brand & Authority */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-md bg-zinc-900 border border-white/[0.12] flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white font-mono">
                TRUSTY<span className="text-zinc-500">.ai</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-500 hidden xs:inline border-l border-zinc-800 pl-2">
                REPUTATION LAYER
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Live Counter */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-900/90 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>INDEXED:</span>
            <span className="font-semibold text-zinc-200 tabular-nums">{totalAgents}</span>
          </div>

          {/* GitHub Repo */}
          <a
            href="https://github.com/DrowLink/trusty-ai"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Specs */}
          <button
            onClick={onOpenSpecs}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-xs font-mono text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Specs</span>
          </button>

          {/* Audit CTA */}
          <button
            onClick={onOpenEvaluate}
            className="flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Audit Agent</span>
          </button>
        </div>
      </div>
    </header>
  );
};
