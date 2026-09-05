'use client';

import React from 'react';
import { ShieldCheck, BookOpen, Plus, Github, Lock, UserCheck, Database } from 'lucide-react';
import { UserSession } from '@/lib/quota';

interface NavbarProps {
  onOpenSpecs: () => void;
  onOpenAuth: () => void;
  onOpenDb?: () => void;
  totalAgents: number;
  session: UserSession;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSpecs,
  onOpenAuth,
  onOpenDb,
  totalAgents,
  session,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090a10]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Brand */}
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
                SECURITY LAYER
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right: Quota & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Database Persistence Status Pill */}
          {onOpenDb && (
            <button
              onClick={onOpenDb}
              title="Persistent Database: Local Browser Cache + Firebase Firestore Sync"
              className="flex items-center space-x-1.5 px-2 py-1 rounded bg-zinc-900/90 border border-emerald-800/40 text-[11px] font-mono text-zinc-300 hover:border-emerald-600/60 transition group"
            >
              <Database className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-zinc-400 hidden sm:inline">DB:</span>
              <span className="text-emerald-400 font-semibold text-[10px] sm:text-[11px]">SYNCED</span>
            </button>
          )}

          {/* VirusTotal Quota Pill */}
          {session.isAuthenticated ? (
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/60 text-[11px] font-mono text-emerald-300">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[140px]">{session.email}</span>
              <span className="text-emerald-500 font-bold">• UNLIMITED</span>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              title="Daily Anonymous Quota. Click to authenticate."
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-300 hover:border-white/[0.2] transition"
            >
              <Lock className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span className="text-zinc-500 hidden md:inline">QUOTA:</span>
              <span className={`font-semibold tabular-nums ${session.queriesRemaining <= 2 ? 'text-rose-400' : 'text-zinc-200'}`}>
                {session.queriesRemaining}/10
              </span>
              <span className="text-[10px] text-zinc-500 hidden lg:inline">FREE</span>
            </button>
          )}

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
        </div>
      </div>
    </header>
  );
};
