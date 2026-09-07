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
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { UserSession } from '@/lib/quota';
import { ActiveProductTab } from '@/lib/types';
import { useTheme } from '@/lib/theme';

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
  const { theme, toggleTheme } = useTheme();

  const tabs: { id: ActiveProductTab; label: string; icon: any; badge?: string }[] = [
    { id: 'bureau', label: 'Agent Bureau', icon: ShieldCheck },
    { id: 'decision_api', label: 'Decision Gateway', icon: Cpu, badge: 'M2M' },
    { id: 'economics', label: 'Economic Case', icon: TrendingUp, badge: '$500M' },
    { id: 'underwriting', label: 'Underwriting', icon: Activity, badge: '12+20' },
    { id: 'pricing', label: 'Pricing', icon: Layers },
    { id: 'moat', label: 'Moat', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand with Official Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer select-none flex-shrink-0 group"
          onClick={() => onTabChange('bureau')}
        >
          {/* Official Logo Emblem with Vibrant Brand Glow */}
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl p-[1.5px] bg-gradient-to-tr from-[#0066FF] via-[#00A6FB] to-sky-300 shadow-[0_0_18px_rgba(0,102,255,0.28)] group-hover:shadow-[0_0_28px_rgba(0,102,255,0.55)] group-hover:scale-105 transition-all duration-300 flex-shrink-0">
            <div className="w-full h-full bg-white dark:bg-[#0a0f1d] rounded-[14px] p-1 flex items-center justify-center overflow-hidden">
              <img 
                src="/trusty-logo.png" 
                alt="TRUSTY.bot Logo" 
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#0A2540] dark:text-white font-sans leading-none">
                TRUSTY<span className="text-[#0066FF] dark:text-[#38BDF8]">.bot</span>
                <span className="text-[10px] align-super text-slate-400 font-normal">™</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 px-2 py-0.5 rounded-full hidden sm:inline-flex items-center space-x-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                <span>Credit Bureau</span>
              </span>
            </div>
            <span className="text-[9px] font-mono font-extrabold tracking-widest uppercase text-[#0066FF] dark:text-sky-400 font-sans hidden sm:inline leading-tight mt-0.5">
              TRUST POWERS AGENTS
            </span>
          </div>
        </div>

        {/* Center: Minimalist Segmented Tabs */}
        <nav className="hidden lg:flex items-center bg-slate-100/90 dark:bg-[#0c1017] border border-slate-200 dark:border-white/[0.08] p-1 rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white font-semibold shadow-sm border border-slate-200/80 dark:border-white/[0.08]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/[0.03]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0066FF] dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] font-mono px-1 rounded ${
                    isActive 
                      ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800' 
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#0c1017] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Live Audit Repo CTA */}
          {onOpenEvaluate && (
            <button
              onClick={onOpenEvaluate}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0066FF] hover:bg-[#0052cc] text-white transition shadow-sm shadow-blue-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Audit Agent</span>
            </button>
          )}

          {/* Quota Indicator */}
          {session.isAuthenticated ? (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="truncate max-w-[100px] hidden sm:inline">{session.email}</span>
              <span className="font-bold">• UNLIMITED</span>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              title="Daily Anonymous Quota. Click to authenticate."
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0c1017] border border-slate-200 dark:border-white/[0.08] text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition"
            >
              <Lock className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span className="text-slate-500 hidden sm:inline">QUOTA:</span>
              <span className={`font-semibold tabular-nums ${session.queriesRemaining <= 2 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                {session.queriesRemaining}/10
              </span>
            </button>
          )}

          {/* Specs Button */}
          <button
            onClick={onOpenSpecs}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#0c1017] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            title="Read Technical Specifications & Founding Memo"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="lg:hidden border-t border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#090d14] px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center space-x-1 text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white font-medium border border-slate-200 dark:border-white/[0.08] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0066FF] dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
