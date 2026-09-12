'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Activity, 
  Layers, 
  Award, 
  Lock, 
  FileText,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Plus
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
  onOpenNewMandate?: () => void;
  totalAgents: number;
  pendingApprovalsCount?: number;
  session: UserSession;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenSpecs,
  onOpenAuth,
  onOpenEvaluate,
  onOpenNewMandate,
  totalAgents,
  pendingApprovalsCount = 2,
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

  // Prevent background scroll when mobile menu is open
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

  // Primary Platform Tabs (Ordered by Intent Layer Priority)
  const primaryTabs: { id: ActiveProductTab; label: string; icon: any; badge?: string; badgeColor?: string }[] = [
    { id: 'mandates', label: 'Mandates', icon: Lock },
    { 
      id: 'approvals', 
      label: 'Review Queue', 
      icon: AlertTriangle, 
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : undefined,
      badgeColor: 'amber'
    },
    { id: 'decisions', label: 'Audit Trail', icon: CheckCircle2 },
    { id: 'simulator', label: 'Simulator', icon: Cpu, badge: 'M2M' },
    { id: 'agents', label: 'Agent Tools', icon: Sparkles },
  ];

  // Secondary Institutional Solutions
  const secondaryTabs: { id: ActiveProductTab; label: string; desc: string; icon: any; badge?: string }[] = [
    { id: 'economics', label: 'Economic Case', desc: 'Brex ROI & spending caps', icon: TrendingUp, badge: '$500M' },
    { id: 'underwriting', label: 'Underwriting', desc: '12 public + 20 behavioral signals', icon: Activity, badge: '12+20' },
    { id: 'pricing', label: 'Pricing', desc: 'Institutional tiers & licenses', icon: Layers },
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
      {/* 1. TOP ANNOUNCEMENT / CONTEXT BAR */}
      <div className="bg-[#090d16] text-slate-200 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-white/[0.06] flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono uppercase tracking-wider bg-blue-500/20 text-sky-300 px-2 py-0.5 rounded font-semibold border border-blue-400/30">
            INTENT CONSOLE
          </span>
          <span className="hidden md:inline text-slate-400 text-[11px]">
            Authorizing agent actions across Brex, Ramp &amp; Slash rails
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <Link
            href="/"
            className="text-slate-300 hover:text-white transition flex items-center space-x-1 underline underline-offset-4"
          >
            <span>Public Site (trusty.bot)</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Section: Mobile Hamburger + Logo + Desktop Nav */}
        <div className="flex items-center space-x-3 sm:space-x-6 min-w-0">
          
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex-shrink-0"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* TRUSTY Brand Lockup */}
          <div 
            className="flex items-center space-x-2 sm:space-x-2.5 cursor-pointer select-none flex-shrink-0 group py-1"
            onClick={() => handleSelectTab('mandates')}
          >
            <div className="relative group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <TrustyIsotype className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-sm" />
            </div>

            <div className="flex flex-col justify-center space-y-0.5">
              <div className="flex items-baseline leading-none">
                <span className="text-[16px] sm:text-lg font-black tracking-tight text-slate-950 dark:text-white font-sans">
                  TRUSTY
                </span>
                <span className="text-[16px] sm:text-lg font-black tracking-tight text-[#0066FF] dark:text-[#38BDF8]">
                  .bot
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-slate-700 dark:text-slate-300 ml-0.5 -translate-y-0.5 sm:-translate-y-1 inline-block">
                  ™
                </span>
              </div>
              <span className="text-[6px] sm:text-[7px] font-bold tracking-[0.2em] text-slate-500 dark:text-slate-400 uppercase font-sans leading-none whitespace-nowrap">
                INTENT AUTHORIZATION
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {primaryTabs.map((tab) => {
              const isActive = activeTab === tab.id || 
                (tab.id === 'agents' && activeTab === 'bureau') ||
                (tab.id === 'simulator' && activeTab === 'decision_api');
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs lg:text-[13px] font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#0066FF] dark:text-sky-400 font-bold bg-blue-50/70 dark:bg-white/[0.08]'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0066FF] dark:text-sky-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      tab.badgeColor === 'amber'
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/50 dark:border-amber-800'
                        : isActive 
                        ? 'bg-blue-100 dark:bg-sky-950 text-[#0066FF] dark:text-sky-300' 
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
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs lg:text-[13px] font-medium transition-colors whitespace-nowrap ${
                  isSecondaryActive
                    ? 'text-[#0066FF] dark:text-sky-400 font-bold bg-blue-50/70 dark:bg-white/[0.08]'
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
                    Institutional Research &amp; ROI
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

        {/* Right Section: Light/Dark toggle, Auth, Primary CTA */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0">
          
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

          {/* Account Button */}
          <button
            onClick={onOpenAuth}
            className="hidden sm:inline-block text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-2.5 py-1.5 transition"
          >
            {session.isAuthenticated ? 'Account' : 'Sign in'}
          </button>

          {/* Primary Action in Desktop */}
          {onOpenNewMandate && (
            <button
              onClick={onOpenNewMandate}
              className="inline-flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-bold bg-[#0066FF] hover:bg-blue-600 active:scale-[0.98] text-white transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Mandate</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. MOBILE RESPONSIVE DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full bg-white dark:bg-[#0d131f] border-t border-slate-200 dark:border-white/[0.08] px-4 py-5 space-y-5 shadow-2xl h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden">
          
          {/* Top Primary Mobile Action: New Mandate */}
          <div className="grid grid-cols-2 gap-2">
            {onOpenNewMandate && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenNewMandate();
                }}
                className="py-3 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Mandate</span>
              </button>
            )}

            {onOpenEvaluate && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenEvaluate();
                }}
                className="py-3 px-3 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Audit Agent</span>
              </button>
            )}
          </div>

          {/* Group 1: Intent & Governance Operations */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold px-2 mb-1.5">
              Intent Operations &amp; Rails
            </div>
            {primaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id ||
                (tab.id === 'agents' && activeTab === 'bureau') ||
                (tab.id === 'simulator' && activeTab === 'decision_api');

              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-xs font-medium transition min-h-[44px] ${
                    isActive
                      ? 'bg-blue-50 dark:bg-white/[0.08] text-[#0066FF] dark:text-sky-300 font-bold'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-[#0066FF] dark:text-sky-400" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      tab.badgeColor === 'amber'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Group 2: Institutional Suite */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-white/[0.08]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold px-2 mb-1.5">
              Institutional Solutions &amp; Specs
            </div>
            {secondaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-xs font-medium transition min-h-[44px] ${
                    isActive
                      ? 'bg-blue-50 dark:bg-white/[0.08] text-[#0066FF] dark:text-sky-300 font-bold'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
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

          {/* Group 3: Specs, Auth & Return to Public Site */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/[0.08] space-y-2 text-xs">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition min-h-[44px]"
            >
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>Return to Public Site (trusty.bot)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSpecs();
              }}
              className="w-full flex items-center space-x-2 py-2.5 px-3 rounded-lg font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition min-h-[44px]"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Technical Specs (.md)</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full py-3 px-3 rounded-lg font-bold border border-slate-200 dark:border-white/[0.12] text-slate-900 dark:text-white text-center hover:bg-slate-50 dark:hover:bg-white/[0.04] transition min-h-[44px]"
            >
              {session.isAuthenticated ? 'Manage Account (Unlimited)' : 'Sign in / Get API Key'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
