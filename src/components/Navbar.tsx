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
  pendingApprovalsCount = 0,
  session,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className={`sticky top-0 z-50 w-full bg-[#f8f9f5] dark:bg-[#0f1816] border-b border-[#dce3db] dark:border-[#21352e] transition-colors ${!isMobileMenuOpen ? 'bg-[#f8f9f5]/95 dark:bg-[#0f1816]/95 backdrop-blur-md' : ''}`}>
      {/* 1. TOP ANNOUNCEMENT / CONTEXT BAR */}
      <div className="bg-[#172b29] text-[#dce3db] text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#203b32] flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono uppercase tracking-wider bg-[#203b32] text-[#c5e86c] px-2 py-0.5 rounded font-semibold border border-[#3b5d51]">
            INTENT CONSOLE
          </span>
          <span className="hidden md:inline text-[#9cb0a8] text-[11px]">
            Intent verification layer for Brex, Ramp &amp; Slash rails
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <Link
            href="/"
            className="text-[#dce3db] hover:text-white transition flex items-center space-x-1 underline underline-offset-4"
          >
            <span>Public Site (trusty.bot)</span>
            <ExternalLink className="w-3 h-3 text-[#c5e86c]" />
          </Link>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Section: Mobile Hamburger + Logo + Desktop Nav */}
        <div className="flex items-center space-x-3 sm:space-x-6 min-w-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg text-[#172b29] dark:text-[#f8f9f5] hover:bg-[#e9eddf] dark:hover:bg-[#1c302a] transition cursor-pointer flex-shrink-0"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Lockup */}
          <div 
            className="flex items-center space-x-2 sm:space-x-2.5 cursor-pointer select-none flex-shrink-0 group py-1"
            onClick={() => handleSelectTab('mandates')}
          >
            <div className="relative group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <TrustyIsotype className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-sm" />
            </div>

            <div className="flex flex-col justify-center space-y-0.5">
              <div className="flex items-baseline leading-none">
                <span className="text-[17px] sm:text-lg font-black tracking-tight text-[#172b29] dark:text-[#f8f9f5] font-sans">
                  TRUSTY
                </span>
                <span className="text-[17px] sm:text-lg font-black tracking-tight text-[#203b32] dark:text-[#c5e86c]">
                  .bot
                </span>
              </div>
              <span className="text-[6.5px] sm:text-[7px] font-bold tracking-[0.2em] text-[#50625d] dark:text-[#9cb0a8] uppercase font-sans leading-none whitespace-nowrap">
                INTENT AUTHORIZATION
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
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
                      ? 'text-[#172b29] dark:text-[#f8f9f5] font-bold bg-[#e9eddf] dark:bg-[#1c302a] border border-[#dce3db] dark:border-[#21352e]'
                      : 'text-[#50625d] dark:text-[#9cb0a8] hover:text-[#172b29] dark:hover:text-[#f8f9f5] hover:bg-[#e9eddf]/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#203b32] dark:text-[#c5e86c]' : 'text-[#50625d]'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      tab.badgeColor === 'amber'
                        ? 'bg-[#fff4de] text-[#785315] border border-[#f1d29c]'
                        : isActive 
                        ? 'bg-[#172b29] text-white dark:bg-[#c5e86c] dark:text-[#172b29]' 
                        : 'bg-[#e9eddf] dark:bg-[#1c302a] text-[#50625d]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Solutions Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs lg:text-[13px] font-medium transition-colors whitespace-nowrap ${
                  isSecondaryActive
                    ? 'text-[#172b29] dark:text-[#f8f9f5] font-bold bg-[#e9eddf] dark:bg-[#1c302a]'
                    : 'text-[#50625d] dark:text-[#9cb0a8] hover:text-[#172b29] hover:bg-[#e9eddf]/60'
                }`}
              >
                <span>Solutions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#172b29]' : 'opacity-60'}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-white dark:bg-[#14221e] border border-[#dce3db] dark:border-[#21352e] shadow-xl p-2 z-50 font-sans space-y-1 animate-fadeIn">
                  <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#50625d] font-bold">
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
                            ? 'bg-[#e9eddf] dark:bg-[#1c302a] text-[#172b29] dark:text-[#f8f9f5]'
                            : 'hover:bg-[#f8f9f5] dark:hover:bg-[#1c302a]/60 text-[#50625d] dark:text-[#9cb0a8]'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md mt-0.5 ${isActive ? 'bg-[#203b32] text-white dark:text-[#c5e86c]' : 'bg-[#e9eddf] dark:bg-[#1c302a] text-[#50625d]'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">{tab.label}</span>
                            {tab.badge && (
                              <span className="text-[9px] font-mono px-1 rounded bg-[#e9eddf] dark:bg-[#1c302a] text-[#50625d] font-medium">
                                {tab.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#50625d] truncate mt-0.5">{tab.desc}</p>
                        </div>
                      </button>
                    );
                  })}

                  <div className="h-px bg-[#dce3db] dark:bg-[#21352e] my-1" />

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenSpecs();
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-xs text-[#50625d] hover:text-[#172b29] dark:hover:text-[#f8f9f5] hover:bg-[#f8f9f5] transition"
                  >
                    <FileText className="w-3.5 h-3.5 opacity-70" />
                    <span>Technical Architecture Specs (.md)</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-[#50625d] hover:text-[#172b29] dark:hover:text-white hover:bg-[#e9eddf] dark:hover:bg-[#1c302a] transition"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#172b29]" />
            )}
          </button>

          <button
            onClick={onOpenAuth}
            className="hidden sm:inline-block text-xs font-semibold text-[#172b29] dark:text-[#f8f9f5] hover:underline px-2.5 py-1.5 transition"
          >
            {session.isAuthenticated ? 'Account' : 'Sign in'}
          </button>

          {onOpenNewMandate && (
            <button
              onClick={onOpenNewMandate}
              className="inline-flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-bold bg-[#172b29] hover:bg-[#203b32] active:scale-[0.98] text-white transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#c5e86c]" />
              <span>New Mandate</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full bg-[#f8f9f5] dark:bg-[#0f1816] border-t border-[#dce3db] dark:border-[#21352e] px-4 py-5 space-y-5 shadow-2xl h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden">
          <div className="grid grid-cols-2 gap-2">
            {onOpenNewMandate && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenNewMandate();
                }}
                className="py-3 px-3 rounded-xl text-xs font-bold text-white bg-[#172b29] hover:bg-[#203b32] active:scale-[0.98] transition shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#c5e86c]" />
                <span>New Mandate</span>
              </button>
            )}

            {onOpenEvaluate && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenEvaluate();
                }}
                className="py-3 px-3 rounded-xl text-xs font-bold text-[#172b29] dark:text-[#f8f9f5] bg-[#e9eddf] dark:bg-[#1c302a] hover:bg-[#dce3db] active:scale-[0.98] transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#203b32] dark:text-[#c5e86c]" />
                <span>Audit Agent</span>
              </button>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#50625d] font-bold px-2 mb-1.5">
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
                      ? 'bg-[#e9eddf] dark:bg-[#1c302a] text-[#172b29] dark:text-[#f8f9f5] font-bold'
                      : 'text-[#172b29] dark:text-[#f8f9f5] hover:bg-[#e9eddf]/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-[#203b32] dark:text-[#c5e86c]" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      tab.badgeColor === 'amber'
                        ? 'bg-[#fff4de] text-[#785315]'
                        : 'bg-[#e9eddf] dark:bg-[#1c302a] text-[#50625d]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-1 pt-2 border-t border-[#dce3db] dark:border-[#21352e]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#50625d] font-bold px-2 mb-1.5">
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
                      ? 'bg-[#e9eddf] dark:bg-[#1c302a] text-[#172b29] dark:text-[#f8f9f5] font-bold'
                      : 'text-[#172b29] dark:text-[#f8f9f5] hover:bg-[#e9eddf]/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-[#203b32] dark:text-[#c5e86c]" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e9eddf] dark:bg-[#1c302a] text-[#50625d]">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#dce3db] dark:border-[#21352e] space-y-2 text-xs">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-[#172b29] dark:text-[#f8f9f5] hover:bg-[#e9eddf] dark:hover:bg-[#1c302a] transition min-h-[44px]"
            >
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-[#50625d]" />
                <span>Return to Public Site (trusty.bot)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#50625d]" />
            </Link>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSpecs();
              }}
              className="w-full flex items-center space-x-2 py-2.5 px-3 rounded-lg font-mono text-[#50625d] hover:text-[#172b29] hover:bg-[#e9eddf] dark:hover:bg-[#1c302a] transition min-h-[44px]"
            >
              <FileText className="w-4 h-4 text-[#50625d]" />
              <span>Technical Specs (.md)</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full py-3 px-3 rounded-lg font-bold border border-[#dce3db] dark:border-[#21352e] text-[#172b29] dark:text-[#f8f9f5] text-center hover:bg-[#e9eddf] dark:hover:bg-[#1c302a] transition min-h-[44px]"
            >
              {session.isAuthenticated ? 'Manage Account (Unlimited)' : 'Sign in / Get API Key'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
