'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Cpu, 
  TrendingUp, 
  Activity, 
  Layers, 
  Award, 
  Lock, 
  UserCheck, 
  FileText,
  Github,
  Sparkles
} from 'lucide-react';
import { UserSession } from '@/lib/quota';
import { ActiveProductTab } from '@/lib/types';

interface NavbarProps {
  activeTab: ActiveProductTab;
  onTabChange: (tab: ActiveProductTab) => void;
  onOpenSpecs: () => void;
  onOpenAuth: () => void;
  onOpenEvaluate?: () => void;
  totalAgents: number;
  session: UserSession;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenSpecs,
  onOpenAuth,
  onOpenEvaluate,
  totalAgents,
  session,
}) => {
  const tabs: { id: ActiveProductTab; label: string; icon: any; badge?: string }[] = [
    { id: 'bureau', label: 'Agent Bureau', icon: ShieldCheck },
    { id: 'decision_api', label: 'Decision Gateway', icon: Cpu, badge: 'M2M' },
    { id: 'economics', label: 'Economic Case', icon: TrendingUp, badge: '$500M' },
    { id: 'underwriting', label: 'Underwriting', icon: Activity, badge: '12+20' },
    { id: 'pricing', label: 'Pricing', icon: Layers },
    { id: 'moat', label: 'Moat', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07090e]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div 
          className="flex items-center space-x-3 cursor-pointer select-none flex-shrink-0"
          onClick={() => onTabChange('bureau')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 p-[1px] shadow-sm shadow-sky-500/20">
            <div className="w-full h-full bg-[#0c1017] rounded-[7px] flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-white font-sans">
                TRUSTY<span className="text-sky-400">.BOT</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-purple-300 bg-purple-950/60 border border-purple-800/60 px-1.5 py-0.5 rounded-full hidden sm:inline">
                Credit Bureau
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-sans hidden md:inline leading-none">
              The Trust &amp; Credit Bureau for AI Agents
            </span>
          </div>
        </div>

        {/* Center: Minimalist Segmented Tabs */}
        <nav className="hidden lg:flex items-center bg-[#0c1017] border border-white/[0.08] p-1 rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800/90 text-white font-semibold shadow-sm border border-white/[0.08]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] font-mono px-1 rounded ${
                    isActive ? 'bg-sky-950 text-sky-300 border border-sky-800' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* Live Audit Repo CTA */}
          {onOpenEvaluate && (
            <button
              onClick={onOpenEvaluate}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition shadow-sm shadow-sky-500/10"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Audit Agent</span>
            </button>
          )}

          {/* Quota Indicator */}
          {session.isAuthenticated ? (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-[11px] font-mono text-emerald-300">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[100px] hidden sm:inline">{session.email}</span>
              <span className="text-emerald-400 font-bold">• UNLIMITED</span>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              title="Daily Anonymous Quota. Click to authenticate."
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#0c1017] border border-white/[0.08] text-[11px] font-mono text-slate-300 hover:border-slate-600 transition"
            >
              <Lock className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span className="text-slate-400 hidden sm:inline">QUOTA:</span>
              <span className={`font-semibold tabular-nums ${session.queriesRemaining <= 2 ? 'text-rose-400' : 'text-slate-200'}`}>
                {session.queriesRemaining}/10
              </span>
            </button>
          )}

          {/* Specs Button */}
          <button
            onClick={onOpenSpecs}
            className="p-1.5 rounded-lg bg-[#0c1017] border border-white/[0.08] text-slate-400 hover:text-white hover:border-slate-600 transition"
            title="Read Technical Specifications & Founding Memo"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="lg:hidden border-t border-white/[0.06] bg-[#090d14] px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center space-x-1 text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition whitespace-nowrap ${
                isActive
                  ? 'bg-slate-800 text-white font-medium border border-white/[0.08]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
