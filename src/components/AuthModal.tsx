'use client';

import React, { useState } from 'react';
import { X, Shield, Lock, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError(null);
    onAuthenticate(email.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden my-auto font-sans">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#07090e] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-zinc-900 border border-amber-200 dark:border-white/[0.1] flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 font-mono">
                Security Quota Limit Reached
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                VirusTotal-grade Intelligence Quota (10/10 Used)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs text-slate-600 dark:text-zinc-300">
          <p className="leading-relaxed text-xs sm:text-sm font-sans">
            You have completed your <strong className="text-slate-900 dark:text-white font-mono">10 free anonymous security inspections</strong>. To prevent automated scraping and unlock unlimited agent evaluations, authenticate with your email address.
          </p>

          {/* Benefits Matrix */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-white/[0.08] space-y-2">
            <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-wider font-semibold">
              Unlocked with Community Access:
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-zinc-300 font-sans">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Unlimited live repository and manifest security audits</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Cryptographic SHA-256 fingerprint drift monitoring</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Full 20-signal mathematical breakdown & explainability export</span>
              </li>
            </ul>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-800 font-mono">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono text-slate-600 dark:text-zinc-400 mb-1 font-medium">
                Developer or Corporate Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-white/[0.12] rounded-lg text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF] dark:focus:border-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-sans font-bold text-xs sm:text-sm transition shadow-sm"
            >
              <span>Authenticate & Unlock Unlimited Audits</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-zinc-500 text-center font-mono pt-1">
            No password required. Instant session activation.
          </p>
        </div>
      </div>
    </div>
  );
};
