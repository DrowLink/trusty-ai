'use client';

import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Loader2, 
  Eye, 
  EyeOff, 
  User, 
  LogOut, 
  AlertCircle,
  Database,
  Sparkles
} from 'lucide-react';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithOAuth, 
  signOutUser, 
  isSupabaseConfigured 
} from '@/lib/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (email: string) => void;
  onSignOut?: () => void;
  currentUserEmail?: string | null;
  initialMode?: 'signin' | 'signup';
  quotaExceeded?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  onSignOut,
  currentUserEmail,
  initialMode = 'signin',
  quotaExceeded = false,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode);
      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const isAuthenticated = Boolean(currentUserEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid corporate or developer email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        if (authMode === 'signup') {
          const res = await signUpWithEmail(email.trim(), password);
          if (res.user && !res.session) {
            setSuccessMessage('Account created! Please check your email inbox to confirm your account.');
            setLoading(false);
            return;
          }
        } else {
          await signInWithEmail(email.trim(), password);
        }
      }

      // Successful auth
      onAuthenticate(email.trim());
      onClose();
    } catch (err: any) {
      console.error('Supabase Auth error:', err);
      const msg = err.message || 'Authentication failed. Please verify credentials.';
      // Friendly message if Supabase URL is placeholder
      if (msg.includes('Supabase no está configurado')) {
        setError('Supabase connection pending: please provide your NEXT_PUBLIC_SUPABASE_URL in .env.local');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError(null);
    if (!isSupabaseConfigured) {
      setError('OAuth requires active NEXT_PUBLIC_SUPABASE_URL in .env.local.');
      return;
    }

    try {
      setLoading(true);
      await signInWithOAuth(provider);
    } catch (err: any) {
      setError(err.message || `Could not authenticate with ${provider}.`);
      setLoading(false);
    }
  };

  const handleSignOutClick = async () => {
    try {
      setLoading(true);
      await signOutUser();
      if (onSignOut) {
        onSignOut();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error signing out.');
    } finally {
      setLoading(false);
    }
  };

  // Demo bypass when Supabase URL isn't populated yet
  const handleLocalBypass = () => {
    if (!email.trim()) {
      setError('Please enter an email address for testing.');
      return;
    }
    onAuthenticate(email.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0d131f] border border-slate-200/90 dark:border-white/[0.08] rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden my-auto font-sans transition-all">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#070a12] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center text-[#0066FF] dark:text-sky-400 flex-shrink-0">
              {isAuthenticated ? <User className="w-4.5 h-4.5" /> : <Lock className="w-4.5 h-4.5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white font-sans tracking-tight">
                {isAuthenticated ? 'Account & Organization' : (authMode === 'signin' ? 'Sign In to TRUSTY.bot' : 'Create TRUSTY Account')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                {isAuthenticated ? 'Active Verified Session' : 'Agent research & intent authorization'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 dark:hover:text-white dark:hover:bg-white/[0.08] transition flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs text-slate-600 dark:text-slate-300">
          
          {/* 1. If User is Already Logged In */}
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans text-slate-500 dark:text-slate-400 font-semibold tracking-wide uppercase text-[11px]">
                    User Profile
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                    Community Member
                  </span>
                </div>
                <div className="font-sans text-base sm:text-lg font-bold text-slate-950 dark:text-white truncate tracking-tight">
                  {currentUserEmail}
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300 font-sans pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Unlimited Day-Zero audits &amp; Verified Decision access active</span>
                </div>
              </div>

              <button
                onClick={handleSignOutClick}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:bg-white/[0.04] dark:hover:bg-rose-950/40 dark:hover:text-rose-300 text-slate-700 dark:text-slate-200 font-sans font-semibold text-xs sm:text-sm transition border border-slate-200 dark:border-white/[0.08] shadow-2xs"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* 2. Login / Register Form */
            <div className="space-y-4">
              
              {/* Quota Exceeded Friendly Banner */}
              {quotaExceeded && (
                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 text-xs border border-blue-200/80 dark:border-blue-800/60 font-sans flex items-start space-x-2.5">
                  <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#0066FF] dark:text-sky-400" />
                  <div className="flex-1 leading-snug">
                    <span className="font-semibold block text-slate-900 dark:text-white mb-0.5">Has completado tus 3 auditorías gratuitas.</span>
                    Crea tu cuenta gratuita para desbloquear auditorías ilimitadas y guardar tus evaluaciones.
                  </div>
                </div>
              )}

              {/* Tab Switcher: Sign In vs Sign Up */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/80 dark:bg-[#080c14] rounded-xl border border-slate-200/80 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(null); setSuccessMessage(null); }}
                  className={`py-2 text-xs font-sans font-semibold rounded-lg transition-all ${
                    authMode === 'signin'
                      ? 'bg-white dark:bg-[#0d131f] text-slate-950 dark:text-white shadow-xs border border-slate-200/60 dark:border-white/[0.08]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setError(null); setSuccessMessage(null); }}
                  className={`py-2 text-xs font-sans font-semibold rounded-lg transition-all ${
                    authMode === 'signup'
                      ? 'bg-white dark:bg-[#0d131f] text-slate-900 dark:text-white shadow-xs border border-slate-200/60 dark:border-white/[0.08]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Status Alert Messages */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 text-xs border border-rose-200/90 dark:border-rose-800/60 font-sans flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                  <div className="flex-1 leading-snug">{error}</div>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs border border-emerald-200/90 dark:border-emerald-800/60 font-sans flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  <div className="flex-1 leading-snug">{successMessage}</div>
                </div>
              )}

              {/* Social OAuth Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border border-slate-200/90 dark:border-white/[0.1] bg-white dark:bg-[#080c14] hover:bg-slate-50 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-200 font-sans font-semibold text-xs transition shadow-2xs disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuth('github')}
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border border-slate-200/90 dark:border-white/[0.1] bg-white dark:bg-[#080c14] hover:bg-slate-50 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-200 font-sans font-semibold text-xs transition shadow-2xs disabled:opacity-50"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200/80 dark:border-white/[0.08] w-full" />
                <span className="bg-white dark:bg-[#0d131f] px-3 text-[11px] font-sans font-medium text-slate-400 relative z-10">
                  Or continue with email
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-sans font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Corporate or Developer Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080c14] border border-slate-200/90 dark:border-white/[0.1] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] font-sans transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 bg-white dark:bg-[#080c14] border border-slate-200/90 dark:border-white/[0.1] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] font-sans transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#0066FF] hover:bg-blue-600 active:bg-blue-700 text-white font-sans font-bold text-xs sm:text-sm transition shadow-xs disabled:opacity-50 mt-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
