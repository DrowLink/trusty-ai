'use client';

import React from 'react';
import { ShieldCheck, BookOpen, Plus, Github, Lock, UserCheck } from 'lucide-react';
import { UserSession } from '@/lib/quota';

interface NavbarProps {
  onOpenSpecs: () => void;
  onOpenAuth: () => void;
  totalAgents: number;
  session: UserSession;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSpecs,
  onOpenAuth,
  totalAgents,
  session,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070a11]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-md bg-slate-900 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white font-mono">
                TRUSTY<span className="text-sky-400">.ai</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 hidden xs:inline border-l border-slate-800 pl-2">
                SECURITY LAYER
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right: Quota & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">

          {/* VirusTotal Quota Pill */}
          {session.isAuthenticated ? (
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-700/60 text-[11px] font-mono text-emerald-300">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[140px]">{session.email}</span>
              <span className="text-emerald-400 font-bold">• UNLIMITED</span>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              title="Daily Anonymous Quota. Click to authenticate."
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:border-slate-700 hover:text-white transition"
            >
              <Lock className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span className="text-slate-400 hidden md:inline">QUOTA:</span>
              <span className={`font-semibold tabular-nums ${session.queriesRemaining <= 2 ? 'text-rose-400' : 'text-slate-200'}`}>
                {session.queriesRemaining}/10
              </span>
              <span className="text-[10px] text-slate-400 hidden lg:inline">FREE</span>
            </button>
          )}

          {/* GitHub Repo */}
          <a
            href="https://github.com/DrowLink/trusty-ai"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Specs */}
          <button
            onClick={onOpenSpecs}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-xs font-mono text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Specs</span>
          </button>
        </div>
      </div>
    </header>
  );
};
