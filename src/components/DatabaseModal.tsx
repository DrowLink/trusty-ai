'use client';

import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, Copy, Check, Server, HardDrive, ShieldCheck, X, Sparkles } from 'lucide-react';
import { getLocalCustomAgents } from '@/lib/storage/clientStorage';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAgents: number;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  totalAgents,
}) => {
  const [copied, setCopied] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<{ configured: boolean; projectId: string | null }>({
    configured: false,
    projectId: null,
  });
  const [localCount, setLocalCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setLocalCount(getLocalCustomAgents().length);
      fetch('/api/agents/sync')
        .then(res => res.json())
        .then(data => {
          if (data.firebase) {
            setFirebaseStatus(data.firebase);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const envSample = `NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=trusty-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=trusty-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=trusty-ai.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef`;

  const copyEnv = () => {
    navigator.clipboard.writeText(envSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-[#0d0e15] border border-white/[0.12] rounded-lg shadow-2xl overflow-hidden flex flex-col font-mono"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#090a10]">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded bg-emerald-950/60 border border-emerald-700/50 text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                PERSISTENT DATABASE INTEGRATION
              </h2>
              <p className="text-[11px] text-zinc-400">
                Firestore Cloud Database + Local Resilient Mirror
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs text-zinc-300 overflow-y-auto max-h-[80vh]">
          {/* Status Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded border border-emerald-900/60 bg-emerald-950/20 flex items-start space-x-3">
              <HardDrive className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-emerald-300">Local Browser Persistence</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Status: <span className="text-emerald-400 font-bold">Active & Synced</span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">
                  {localCount} custom agent(s) saved locally. Reloading or closing the tab will never wipe your data.
                </div>
              </div>
            </div>

            <div className={`p-3 rounded border flex items-start space-x-3 ${
              firebaseStatus.configured 
                ? 'border-emerald-900/60 bg-emerald-950/20' 
                : 'border-amber-900/50 bg-amber-950/15'
            }`}>
              <Server className={`w-4 h-4 mt-0.5 flex-shrink-0 ${firebaseStatus.configured ? 'text-emerald-400' : 'text-amber-400'}`} />
              <div>
                <div className={`font-semibold ${firebaseStatus.configured ? 'text-emerald-300' : 'text-amber-300'}`}>
                  Firebase Firestore
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Status: {firebaseStatus.configured ? (
                    <span className="text-emerald-400 font-bold">Connected ({firebaseStatus.projectId})</span>
                  ) : (
                    <span className="text-amber-400 font-medium">Ready to Connect</span>
                  )}
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">
                  {firebaseStatus.configured 
                    ? 'Cross-device cloud synchronization enabled.'
                    : 'Add Firebase env variables in Vercel for cross-device cloud persistence.'}
                </div>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-zinc-900/60 border border-white/[0.06] rounded p-3.5 space-y-2">
            <div className="text-[11px] font-semibold text-white flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>How your data is protected from getting erased:</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
              <li>
                <strong className="text-zinc-200">Zero Data Loss:</strong> Whenever you audit an agent (reaching 11+ agents), it is immediately committed to client-side indexed storage.
              </li>
              <li>
                <strong className="text-zinc-200">Auto Re-Hydration:</strong> When you reload the page, TRUSTY.ai merges the seed agents with all your custom audited agents and re-synchronizes with the server.
              </li>
              <li>
                <strong className="text-zinc-200">Firebase Ready:</strong> Once you add Firebase credentials in Vercel, every audit is also mirrored permanently into Firestore.
              </li>
            </ul>
          </div>

          {/* Firebase Setup Instructions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                Vercel / Firebase Environment Setup
              </span>
              <button
                onClick={copyEnv}
                className="flex items-center space-x-1 text-[11px] text-zinc-400 hover:text-white px-2 py-0.5 rounded border border-white/[0.08] hover:border-zinc-700 bg-zinc-900 transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Template'}</span>
              </button>
            </div>
            <pre className="p-3 bg-black/60 border border-white/[0.08] rounded text-[11px] text-zinc-400 overflow-x-auto select-all">
              {envSample}
            </pre>
            <p className="text-[10px] text-zinc-500">
              To connect Firebase: Go to your project on <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">console.firebase.google.com</a>, create a Web App, and add the variables above in your Vercel Project Settings &gt; Environment Variables.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-[#090a10] flex items-center justify-between">
          <div className="text-[11px] text-zinc-500">
            Total Active Agents: <span className="text-white font-bold">{totalAgents}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white rounded border border-white/[0.1] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
