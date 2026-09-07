'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X, Check, Sliders, ChevronRight } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'trusty_cookie_consent';

export interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  functional: boolean;
  timestamp: string;
}

interface CookieConsentProps {
  forceOpen?: boolean;
  onCloseForce?: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ forceOpen, onCloseForce }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [functionalAllowed, setFunctionalAllowed] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!saved && !forceOpen) {
      // Delay showing banner slightly for smooth load experience
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    } else if (saved) {
      try {
        const parsed: CookiePreferences = JSON.parse(saved);
        setAnalyticsAllowed(parsed.analytics);
        setFunctionalAllowed(parsed.functional);
      } catch (e) {
        // ignore
      }
    }

    const handleOpenEvent = () => {
      setIsOpen(true);
      setShowPreferences(true);
    };

    window.addEventListener('open-cookie-preferences', handleOpenEvent);
    return () => window.removeEventListener('open-cookie-preferences', handleOpenEvent);
  }, [forceOpen]);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setShowPreferences(true);
    }
  }, [forceOpen]);

  const saveConsent = (analytics: boolean, functional: boolean) => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics,
      functional,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    setIsOpen(false);
    setShowPreferences(false);
    if (onCloseForce) onCloseForce();
  };

  const handleAcceptAll = () => {
    setAnalyticsAllowed(true);
    setFunctionalAllowed(true);
    saveConsent(true, true);
  };

  const handleEssentialOnly = () => {
    setAnalyticsAllowed(false);
    setFunctionalAllowed(false);
    saveConsent(false, false);
  };

  const handleSavePreferences = () => {
    saveConsent(analyticsAllowed, functionalAllowed);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-5 pointer-events-none font-sans">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        {!showPreferences ? (
          /* Sleek Minimalist Floating Consent Pill / Banner */
          <div className="bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-md border border-slate-200 dark:border-white/[0.1] rounded-2xl p-4 sm:p-5 shadow-2xl shadow-slate-900/10 dark:shadow-black/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
            <div className="flex items-start space-x-3.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 flex items-center justify-center text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <span>Privacy &amp; Cookie Compliance</span>
                  <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-950/80 px-1.5 py-0.2 rounded-full">
                    GDPR / CCPA
                  </span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  TRUSTY.bot uses strictly necessary cookies for session quota tracking and anonymous telemetry cookies to monitor agent drift. We never sell personal data or monetize private telemetry.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 flex-shrink-0 w-full md:w-auto justify-end">
              <button
                onClick={() => setShowPreferences(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Preferences
              </button>
              <button
                onClick={handleEssentialOnly}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition border border-slate-200 dark:border-slate-700"
              >
                Essential Only
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm shadow-sky-600/20 transition"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          /* Preferences Modal */
          <div className="bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/[0.1] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cookie &amp; Telemetry Preferences</h3>
              </div>
              <button
                onClick={() => {
                  setShowPreferences(false);
                  if (onCloseForce) onCloseForce();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Essential */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white">Essential &amp; Security Cookies</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Required
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Required for anonymous quota tracking, authentication tokens, and API rate limiting.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  className="rounded text-sky-600 cursor-not-allowed opacity-80"
                />
              </div>

              {/* Analytics */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white">Analytics &amp; Drift Telemetry</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Allows anonymous aggregation of agent scan velocity to detect global supply chain regressions.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsAllowed}
                  onChange={e => setAnalyticsAllowed(e.target.checked)}
                  className="rounded text-sky-600 cursor-pointer w-4 h-4"
                />
              </div>

              {/* Functional */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white">Theme &amp; Customization</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Remembers your light / dark mode preference and custom leaderboard filters.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={functionalAllowed}
                  onChange={e => setFunctionalAllowed(e.target.checked)}
                  className="rounded text-sky-600 cursor-pointer w-4 h-4"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-white/[0.08]">
              <button
                onClick={() => {
                  setShowPreferences(false);
                  if (onCloseForce) onCloseForce();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
