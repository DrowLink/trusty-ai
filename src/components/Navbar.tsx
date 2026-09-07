'use client';

import React from 'react';
import { ShieldCheck, BookOpen, Github, Lock, UserCheck, Cpu, DollarSign, Activity, Layers, Award } from 'lucide-react';
import { UserSession } from '@/lib/quota';
import { ActiveProductTab } from '@/lib/types';

interface NavbarProps {
  activeTab: ActiveProductTab;
  onTabChange: (tab: ActiveProductTab) => void;
  onOpenSpecs: () => void;
  onOpenAuth: () => void;
  totalAgents: number;
  session: UserSession;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenSpecs,
  onOpenAuth,
  totalAgents,
  session,
}) => {
  const tabs: { id: ActiveProductTab; label: string; icon: any }[] = [
    { id: 'bureau', label: 'Agent Bureau', icon: ShieldCheck },
    { id: 'economics', label: 'Economic Case & ROI', icon: DollarSign },
    { id: 'decision_api', label: 'Decision API Playground', icon: Cpu },
    { id: 'underwriting', label: 'Underwriting (12+20)', icon: Activity },
    { id: 'pricing', label: 'Pricing & Tiers', icon: Layers },
    { id: 'moat', label: 'Moat vs HiveTrust', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070a11]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="flex items-center space-x-3 min-w-0 flex-shrink-0 cursor-pointer" onClick={() => onTabChange('bureau')}>
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-sm shadow-sky-500/10">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-1">
              <span className="text-base font-black tracking-tight text-white font-mono">
                TRUSTY<span className="text-sky-400">.BOT</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-400 border border-emerald-800/80 bg-emerald-950/60 px-1 py-0.2 rounded hidden sm:inline">
                CREDIT BUREAU
              </span>
            </div>
            <span className="text-[9px] font-mono text-slate-400 hidden md:inline tracking-wider uppercase">
              Agent Risk &amp; Credit Infrastructure
            </span>
          </div>
        </div>

        {/* Center: Institutional Tabs Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 font-mono text-xs overflow-x-auto py-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Quota & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* Quota Pill */}
          {session.isAuthenticated ? (
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-700/60 text-[11px] font-mono text-emerald-300">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[120px]">{session.email}</span>
              <span className="text-emerald-400 font-bold">• UNLIMITED</span>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              title="Daily Anonymous Quota. Click to authenticate."
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:border-slate-700 hover:text-white transition"
            >
              <Lock className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span className="text-slate-400 hidden sm:inline">QUOTA:</span>
              <span className={`font-semibold tabular-nums ${session.queriesRemaining <= 2 ? 'text-rose-400' : 'text-slate-200'}`}>
                {session.queriesRemaining}/10
              </span>
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
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded text-xs font-mono text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Specs</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto border-t border-slate-800/80 bg-slate-950 px-2 py-1.5 gap-1 text-[11px] font-mono scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-2.5 py-1 rounded whitespace-nowrap transition ${
                isActive
                  ? 'bg-slate-800 text-white font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
