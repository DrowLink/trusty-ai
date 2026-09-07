'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Activity, 
  Layers, 
  Award, 
  Lock, 
  UserCheck, 
  FileText,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { UserSession } from '@/lib/quota';
import { ActiveProductTab } from '@/lib/types';
import { useTheme } from '@/lib/theme';

import { TrustyIsotype } from './PartnerLogos';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary Essential Tabs
  const primaryTabs: { id: ActiveProductTab; label: string; icon: any; badge?: string }[] = [
    { id: 'bureau', label: 'Agent Bureau', icon: ShieldCheck },
    { id: 'decision_api', label: 'Decision Rail', icon: Cpu, badge: 'M2M' },
    { id: 'pricing', label: 'Pricing', icon: Layers },
  ];

  // Secondary Submenu Tabs
  const secondaryTabs: { id: ActiveProductTab; label: string; desc: string; icon: any; badge?: string }[] = [
    { id: 'economics', label: 'Economic Case', desc: 'Brex ROI & spending caps', icon: TrendingUp, badge: '$500M' },
    { id: 'underwriting', label: 'Underwriting', desc: '12 Day-0 + 20 Telemetry signals', icon: Activity, badge: '12+20' },
    { id: 'moat', label: 'Moat & Defensibility', desc: 'Rating agency independence wedge', icon: Award },
  ];

  const isSecondaryActive = secondaryTabs.some(t => t.id === activeTab);
  const activeSecondaryItem = secondaryTabs.find(t => t.id === activeTab);

  const handleSelectTab = (id: ActiveProductTab) => {
    onTabChange(id);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-3 sm:top-4 z-40 w-full px-3 sm:px-6">
      <div className="max-w-5xl mx-auto rounded-full border border-slate-200/90 dark:border-white/[0.1] bg-white/85 dark:bg-[#0a0d14]/85 backdrop-blur-xl shadow-lg shadow-black/[0.04] px-3.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 transition-all">
        {/* Brand with Clean Vector Isotype & Typography */}
        <div 
          className="flex items-center space-x-2.5 cursor-pointer select-none flex-shrink-0 group"
          onClick={() => handleSelectTab('bureau')}
        >
          {/* Native SVG Isotype */}
          <div className="relative group-hover:scale-105 transition-transform duration-200">
            <TrustyIsotype className="w-8 h-8 drop-shadow-sm" />
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-950 dark:text-white font-sans">
              TRUSTY<span className="text-[#0066FF] dark:text-[#38BDF8]">.bot</span>
              <span className="text-[9px] align-super text-slate-400 font-normal ml-0.5">™</span>
            </span>
          </div>
        </div>

        {/* Center: Minimalist Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {primaryTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive 
                      ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300' 
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Submenu Dropdown: Solutions / More */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
                isSecondaryActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.04]'
              }`}
            >
              <span>Solutions</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#0066FF] dark:text-sky-400' : 'opacity-60'}`} />
            </button>

            {/* Dropdown Menu Box */}
            {isDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/[0.12] shadow-2xl p-2 z-50 animate-fade-in font-sans space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                  Institutional Solutions
                </div>
                {secondaryTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleSelectTab(tab.id)}
                      className={`w-full flex items-start space-x-2.5 p-2 rounded-xl text-left transition ${
                        isActive
                          ? 'bg-slate-100 dark:bg-slate-800/90 text-[#0066FF] dark:text-sky-300'
                          : 'hover:bg-slate-50 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg mt-0.5 ${isActive ? 'bg-[#0066FF]/10 text-[#0066FF] dark:text-sky-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">{tab.label}</span>
                          {tab.badge && (
                            <span className="text-[9px] font-mono px-1 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {tab.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{tab.desc}</p>
                      </div>
                    </button>
                  );
                })}

                <div className="h-px bg-slate-100 dark:bg-white/[0.08] my-1" />

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenSpecs();
                  }}
                  className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.04] transition"
                >
                  <FileText className="w-3.5 h-3.5 opacity-70" />
                  <span>Architecture Specs (.md)</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions: Theme Toggle + Quota + Pill CTA */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Quota Indicator */}
          {session.isAuthenticated ? (
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold">UNLIMITED</span>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              title="Daily Anonymous Quota. Click to authenticate."
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Lock className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span className="tabular-nums font-medium">{session.queriesRemaining}/10</span>
            </button>
          )}

          {/* Primary CTA with Brand Color */}
          {onOpenEvaluate && (
            <button
              onClick={onOpenEvaluate}
              className="flex items-center space-x-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold bg-[#0066FF] hover:bg-blue-600 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 transition shadow-sm shadow-blue-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-white dark:text-[#0066FF]" />
              <span>Audit Agent</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-white/[0.08] bg-white/98 dark:bg-[#07090e]/98 backdrop-blur-xl px-4 py-4 space-y-4 font-sans animate-fade-in shadow-2xl">
          {/* Core Navigation */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
              Core Platform
            </div>
            {primaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-[#0066FF] dark:text-sky-300 border border-slate-200 dark:border-white/[0.08]'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-[#0066FF] dark:text-sky-400" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Institutional Suite */}
          <div className="space-y-1 pt-1">
            <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
              Institutional &amp; Research
            </div>
            {secondaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-[#0066FF] dark:text-sky-300 border border-slate-200 dark:border-white/[0.08]'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex flex-col gap-2">
            {onOpenEvaluate && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenEvaluate();
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#0066FF] hover:bg-[#0052cc] transition shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Audit Repository / Manifest</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSpecs();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Technical Specs &amp; Founding Memo</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
