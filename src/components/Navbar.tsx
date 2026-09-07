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
  X,
  ArrowRight
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

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Primary Platform Tabs
  const primaryTabs: { id: ActiveProductTab; label: string; icon: any; badge?: string }[] = [
    { id: 'bureau', label: 'Agent Bureau', icon: ShieldCheck },
    { id: 'decision_api', label: 'Decision Rail', icon: Cpu, badge: 'M2M' },
    { id: 'underwriting', label: 'Underwriting', icon: Activity, badge: '12+20' },
    { id: 'pricing', label: 'Pricing', icon: Layers },
  ];

  // Secondary Institutional Solutions
  const secondaryTabs: { id: ActiveProductTab; label: string; desc: string; icon: any; badge?: string }[] = [
    { id: 'economics', label: 'Economic Case', desc: 'Brex ROI & spending caps', icon: TrendingUp, badge: '$500M' },
    { id: 'moat', label: 'Moat & Defensibility', desc: 'Rating agency independence wedge', icon: Award },
  ];

  const isSecondaryActive = secondaryTabs.some(t => t.id === activeTab);

  const handleSelectTab = (id: ActiveProductTab) => {
    onTabChange(id);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full bg-white dark:bg-[#0d131f] border-b border-slate-200/80 dark:border-white/[0.08] transition-colors ${!isMobileMenuOpen ? 'bg-white/95 dark:bg-[#0d131f]/95 backdrop-blur-md' : ''}`}>
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-[#090d16] text-slate-200 text-[11px] sm:text-xs py-2 sm:py-2.5 px-3 sm:px-4 text-center font-medium border-b border-white/[0.06] flex items-center justify-center gap-2">
        <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider bg-white/[0.1] text-sky-300 px-2 py-0.5 rounded font-semibold">
          LIVE RAIL
        </span>
        <button 
          onClick={() => handleSelectTab('decision_api')}
          className="hover:text-white transition-colors flex items-center gap-1.5 group cursor-pointer"
        >
          <span className="text-slate-300 group-hover:text-white line-clamp-1 sm:line-clamp-none text-left sm:text-center text-[11px] sm:text-xs">
            Live M2M Decision Gateway 2.0: Sub-14ms clearing for autonomous cards &amp; MCP tools.
          </span>
          <span className="text-[#38bdf8] font-semibold flex items-center gap-0.5 group-hover:underline flex-shrink-0 text-[11px]">
            Explore <ArrowRight className="w-3 h-3 inline-block" />
          </span>
        </button>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left Section: Mobile Hamburger + Logo + Desktop Nav */}
        <div className="flex items-center space-x-3.5 sm:space-x-8">
          
          {/* Mobile Hamburger Toggle (Left side) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* TRUSTY.bot Brand Lockup */}
          <div 
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer select-none flex-shrink-0 group py-1"
            onClick={() => handleSelectTab('bureau')}
          >
            <div className="relative group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <TrustyIsotype className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-sm" />
            </div>

            <div className="flex flex-col justify-center space-y-0.5">
              <div className="flex items-baseline leading-none">
                <span className="text-[15px] sm:text-lg font-black tracking-tight text-slate-950 dark:text-white font-sans">
                  TRUSTY
                </span>
                <span className="text-[15px] sm:text-lg font-black tracking-tight text-[#0066FF] dark:text-[#38BDF8]">
                  .bot
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-slate-700 dark:text-slate-300 ml-0.5 -translate-y-0.5 sm:-translate-y-1 inline-block">
                  ™
                </span>
              </div>
              <span className="text-[6px] sm:text-[7px] font-bold tracking-[0.24em] text-slate-500 dark:text-slate-400 uppercase font-sans leading-none whitespace-nowrap">
                TRUST POWERS AGENTS
              </span>
            </div>
          </div>


          {/* Desktop Navigation Links (Brex Style) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {primaryTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-[13px] lg:text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#0066FF] dark:text-sky-400 font-semibold bg-blue-50/60 dark:bg-white/[0.06]'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isActive 
                        ? 'bg-blue-100 dark:bg-sky-950 text-[#0066FF] dark:text-sky-300 font-semibold' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Solutions Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-[13px] lg:text-sm font-medium transition-colors whitespace-nowrap ${
                  isSecondaryActive
                    ? 'text-[#0066FF] dark:text-sky-400 font-semibold bg-blue-50/60 dark:bg-white/[0.06]'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04]'
                }`}
              >
                <span>Solutions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#0066FF]' : 'opacity-60'}`} />
              </button>

              {/* Dropdown Menu Box */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-white dark:bg-[#0d131f] border border-slate-200 dark:border-white/[0.12] shadow-xl p-2 z-50 font-sans space-y-1 animate-fadeIn">
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
                        className={`w-full flex items-start space-x-2.5 p-2 rounded-lg text-left transition ${
                          isActive
                            ? 'bg-blue-50 dark:bg-slate-800/90 text-[#0066FF] dark:text-sky-300'
                            : 'hover:bg-slate-50 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md mt-0.5 ${isActive ? 'bg-[#0066FF]/10 text-[#0066FF] dark:text-sky-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">{tab.label}</span>
                            {tab.badge && (
                              <span className="text-[9px] font-mono px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
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
                    className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.04] transition"
                  >
                    <FileText className="w-3.5 h-3.5 opacity-70" />
                    <span>Technical Architecture Specs (.md)</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Section: Sign in, Quota, Dark mode toggle, Primary CTA */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Quota Indicator */}
          {session.isAuthenticated ? (
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-sans font-medium text-emerald-700 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Unlimited</span>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              title="3 free anonymous audits included. Sign in for unlimited access."
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-sans text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition border border-slate-200/80 dark:border-white/[0.08]"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${session.queriesRemaining > 0 ? 'bg-blue-500' : 'bg-amber-500'}`} />
              <span className="tabular-nums font-medium">
                {session.queriesRemaining} {session.queriesRemaining === 1 ? 'audit left' : 'audits left'}
              </span>
            </button>
          )}

          {/* Sign In Link (Brex Style Desktop) */}
          <button
            onClick={onOpenAuth}
            className="hidden sm:inline-block text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-2.5 py-1.5 transition"
          >
            {session.isAuthenticated ? 'Account' : 'Sign in'}
          </button>

          {/* Primary CTA Button (Desktop only, hidden on mobile to avoid clutter) */}
          {onOpenEvaluate && (
            <button
              onClick={onOpenEvaluate}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#0066FF] hover:bg-blue-600 text-white transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Audit Agent</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. MOBILE RESPONSIVE DRAWER (LATERAL MENU) */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full bg-white dark:bg-[#0d131f] border-t border-slate-200 dark:border-white/[0.08] px-5 py-5 space-y-5 shadow-2xl h-[calc(100vh-110px)] overflow-y-auto">
          {/* Primary Mobile Action: Audit Agent */}
          {onOpenEvaluate && (
            <div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenEvaluate();
                }}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#0066FF] to-[#0052cc] hover:from-blue-600 hover:to-blue-700 active:scale-[0.98] transition shadow-md shadow-blue-500/25 text-center flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-200" />
                <span>Audit Agent</span>
              </button>
            </div>
          )}

          {/* Primary Navigation */}
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-2">
              Platform &amp; Rails
            </div>
            {primaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center justify-between py-3 px-3 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-50 dark:bg-white/[0.08] text-[#0066FF] dark:text-sky-300 font-semibold'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-[#0066FF] dark:text-sky-400" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Institutional Suite */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-white/[0.08]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-2">
              Solutions &amp; Research
            </div>
            {secondaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center justify-between py-3 px-3 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-50 dark:bg-white/[0.08] text-[#0066FF] dark:text-sky-300 font-semibold'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Technical Specs & Auth in Mobile */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/[0.08] space-y-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSpecs();
              }}
              className="w-full flex items-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Technical Architecture Specs (.md)</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full py-2.5 px-3 rounded-lg text-sm font-semibold border border-slate-200 dark:border-white/[0.12] text-slate-900 dark:text-white text-center hover:bg-slate-50 dark:hover:bg-white/[0.04] transition"
            >
              {session.isAuthenticated ? 'Manage Account (Unlimited)' : 'Sign in / Get API Key'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
