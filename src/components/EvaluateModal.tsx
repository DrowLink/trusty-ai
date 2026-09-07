'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, Terminal, Github, ArrowRight, Shield, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { AgentWithScore } from '@/lib/types';

interface EvaluateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEvaluationComplete: (agent: AgentWithScore) => void;
  onCheckQuota?: () => boolean;
}

export const EvaluateModal: React.FC<EvaluateModalProps> = ({
  isOpen,
  onClose,
  onEvaluationComplete,
  onCheckQuota,
}) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [name, setName] = useState('');
  const [publisherName, setPublisherName] = useState('');
  const [domain, setDomain] = useState('');
  const [category, setCategory] = useState('coding');
  const [permissions, setPermissions] = useState('');
  const [isSandboxed, setIsSandboxed] = useState(true);
  const [requiresHumanApproval, setRequiresHumanApproval] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isScanningRepo, setIsScanningRepo] = useState(false);
  const [detectedFeatures, setDetectedFeatures] = useState<string[]>([]);
  const [scanSuccessMsg, setScanSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAutoScanRepo = async (targetUrl?: string) => {
    const url = targetUrl || githubUrl;
    if (!url.trim() || !url.includes('github.com')) {
      setError('Provide a valid GitHub repository URL (e.g. https://github.com/crewAIInc/crewAI)');
      return;
    }

    setIsScanningRepo(true);
    setError(null);
    setScanSuccessMsg(null);

    try {
      const res = await fetch('/api/scan-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repositoryUrl: url.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setName(data.name || '');
        setPublisherName(data.publisherName || '');
        setDomain(data.domain || '');
        setCategory(data.category || 'coding');
        setPermissions(data.permissionsString || '');
        setIsSandboxed(data.isSandboxed ?? true);
        setRequiresHumanApproval(data.requiresHumanApproval ?? true);
        setDetectedFeatures(data.detectedFeatures || []);
        setGithubUrl(url.trim());
        setScanSuccessMsg(`Repository analyzed (${data.name}). ${data.permissions.length} permissions auto-inferred from source code.`);
      } else {
        setError(data.error || 'Failed to scan repository.');
      }
    } catch (err: any) {
      setError(err.message || 'Connection error while scanning repository.');
    } finally {
      setIsScanningRepo(false);
    }
  };

  const loadPreset = (presetType: 'safe' | 'overprivileged' | 'trojan') => {
    setGithubUrl('');
    setDetectedFeatures([]);
    setScanSuccessMsg(null);
    if (presetType === 'safe') {
      setName('Enterprise SQL Copilot');
      setPublisherName('Anthropic Verified MCP');
      setDomain('anthropic.com');
      setCategory('coding');
      setPermissions('db:read_only, query:explain');
      setIsSandboxed(true);
      setRequiresHumanApproval(true);
    } else if (presetType === 'overprivileged') {
      setName('EasySchedule Calendar Helper');
      setPublisherName('FreeTools Online');
      setDomain('easyschedule.xyz');
      setCategory('productivity');
      setPermissions('calendar:read, gmail:read_all, gdrive:read_all, contacts:export');
      setIsSandboxed(false);
      setRequiresHumanApproval(false);
    } else if (presetType === 'trojan') {
      setName('FastSniper Trading Bot');
      setPublisherName('Anon0xDeFi');
      setDomain('');
      setCategory('finance');
      setPermissions('wallet:private_key_export, terminal:root_exec, telegram:steal_tokens');
      setIsSandboxed(false);
      setRequiresHumanApproval(false);
    }
  };

  const handleLiveGitHubAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim() || !githubUrl.includes('github.com')) {
      setError('Provide a valid GitHub repository URL (e.g. https://github.com/crewAIInc/crewAI)');
      return;
    }

    if (onCheckQuota && !onCheckQuota()) {
      onClose();
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repositoryUrl: githubUrl.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.agent) {
        onEvaluationComplete(data.agent);
        onClose();
      } else {
        setError(data.error || 'Live GitHub audit failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an agent name.');
      return;
    }

    if (onCheckQuota && !onCheckQuota()) {
      onClose();
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          publisherName,
          domain,
          category,
          permissions,
          isSandboxed,
          requiresHumanApproval,
        }),
      });

      const data = await res.json();
      if (data.success && data.agent) {
        onEvaluationComplete(data.agent);
        onClose();
      } else {
        setError(data.error || 'Evaluation failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden my-auto">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#07090e] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-zinc-900 border border-emerald-200 dark:border-white/[0.1] flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 font-mono">Agent Security Audit</h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-sans">Evaluate repository code, permissions, and threat vectors</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Real GitHub Audit & Auto-Permission Inference */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-800 dark:text-zinc-200 font-semibold">
              <Github className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Attach GitHub Repository (Auto-Infer Permissions):</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold hidden sm:inline">
              Zero Manual Input
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              placeholder="Paste repository URL (e.g. https://github.com/crewAIInc/crewAI)..."
              className="flex-1 px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-white/[0.12] focus:border-[#0066FF] dark:focus:border-emerald-500 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none font-mono"
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleAutoScanRepo()}
                disabled={isScanningRepo || !githubUrl.trim()}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-mono font-medium rounded-lg text-xs transition flex items-center space-x-1.5 disabled:opacity-50 shadow-sm"
              >
                {isScanningRepo ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Scan Permissions</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLiveGitHubAudit}
                disabled={isEvaluating || !githubUrl.trim()}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 font-mono font-medium rounded-lg text-xs transition flex items-center space-x-1 disabled:opacity-50 border border-slate-300 dark:border-white/[0.08]"
              >
                <span>{isEvaluating ? 'Auditing...' : 'Instant Audit'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Try Links */}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-zinc-400 font-mono">
            <span className="text-zinc-500">Try:</span>
            <button
              type="button"
              onClick={() => {
                setGithubUrl('https://github.com/crewAIInc/crewAI');
                handleAutoScanRepo('https://github.com/crewAIInc/crewAI');
              }}
              className="text-emerald-400 hover:underline"
            >
              crewAIInc/crewAI
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setGithubUrl('https://github.com/anthropics/anthropic-quickstarts');
                handleAutoScanRepo('https://github.com/anthropics/anthropic-quickstarts');
              }}
              className="text-emerald-400 hover:underline"
            >
              anthropics/quickstarts
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setGithubUrl('https://github.com/DrowLink/trusty-ai');
                handleAutoScanRepo('https://github.com/DrowLink/trusty-ai');
              }}
              className="text-emerald-400 hover:underline"
            >
              DrowLink/trusty-ai
            </button>
          </div>

          {/* Scan Success & Auto-Detected Features Pills */}
          {scanSuccessMsg && (
            <div className="mt-3 p-3 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-mono space-y-1.5">
              <div className="flex items-center space-x-1.5 font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{scanSuccessMsg}</span>
              </div>
              {detectedFeatures.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {detectedFeatures.map((feat, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 border border-emerald-700/50 text-[10px] text-emerald-300">
                      {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Scenarios */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-white/[0.08] bg-slate-100/60 dark:bg-zinc-900/20">
          <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 mb-2">Or test synthetic threat scenarios:</div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadPreset('safe')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-white/[0.08] hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center space-x-1 shadow-sm"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
              <span>Enterprise Copilot</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('overprivileged')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-white/[0.08] hover:border-amber-500 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition flex items-center space-x-1 shadow-sm"
            >
              <AlertTriangle className="w-3 h-3 text-amber-500 dark:text-amber-400" />
              <span>Overprivileged Calendar</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('trojan')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900 transition flex items-center space-x-1 shadow-sm"
            >
              <Terminal className="w-3 h-3 text-rose-500 dark:text-rose-400" />
              <span>Trojan Credential Stealer</span>
            </button>
          </div>
        </div>

        {/* Section 3: Custom Form */}
        <form onSubmit={handleEvaluate} className="p-4 sm:p-5 space-y-3.5 text-xs font-sans bg-white dark:bg-[#0c1017]">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-800 font-mono">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-600 dark:text-zinc-400 mb-1 font-medium">Agent Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. FinanceSync Agent"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-white/[0.1] rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF] dark:focus:border-zinc-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-600 dark:text-zinc-400 mb-1 font-medium">Publisher Name</label>
              <input
                type="text"
                value={publisherName}
                onChange={e => setPublisherName(e.target.value)}
                placeholder="e.g. Acme Corp or Anon"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-white/[0.1] rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF] dark:focus:border-zinc-500 font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-600 dark:text-zinc-400 mb-1 font-medium">Publisher Domain</label>
              <input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="e.g. acme.com"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-white/[0.1] rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0066FF] dark:focus:border-zinc-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-600 dark:text-zinc-400 mb-1 font-medium">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-white/[0.1] rounded-lg text-xs text-slate-800 dark:text-zinc-300 focus:outline-none focus:border-[#0066FF] dark:focus:border-zinc-500 font-mono"
              >
                <option value="productivity">Productivity</option>
                <option value="coding">Coding / DevTools</option>
                <option value="finance">Finance / Trading</option>
                <option value="sysadmin">System Admin</option>
                <option value="sales_marketing">Sales / Marketing</option>
                <option value="research">Research</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono text-slate-600 dark:text-zinc-400 font-medium">
                Requested Capabilities & Permissions
              </label>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                (Or paste repository above to infer automatically)
              </span>
            </div>
            <input
              type="text"
              value={permissions}
              onChange={e => setPermissions(e.target.value)}
              placeholder="e.g. calendar:read, gmail:read_all, terminal:exec"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-white/[0.1] rounded-lg text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#0066FF] dark:focus:border-zinc-500"
            />
            {/* Quick Human Permission Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500">Insert:</span>
              <button
                type="button"
                onClick={() => setPermissions(prev => prev ? `${prev}, db:read_only` : 'db:read_only')}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/[0.06] transition"
              >
                + Database (Read)
              </button>
              <button
                type="button"
                onClick={() => setPermissions(prev => prev ? `${prev}, network:outbound_https` : 'network:outbound_https')}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/[0.06] transition"
              >
                + Internet Access
              </button>
              <button
                type="button"
                onClick={() => setPermissions(prev => prev ? `${prev}, fs:workspace_write` : 'fs:workspace_write')}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/[0.06] transition"
              >
                + Save Files
              </button>
              <button
                type="button"
                onClick={() => setPermissions(prev => prev ? `${prev}, terminal:exec` : 'terminal:exec')}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40 transition"
              >
                + Terminal (Critical)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-sans">
            <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isSandboxed}
                onChange={e => setIsSandboxed(e.target.checked)}
                className="rounded bg-slate-100 dark:bg-zinc-950 border-slate-300 dark:border-zinc-700 text-emerald-600 focus:ring-0"
              />
              <span>Runs in Sandbox (gVisor/WASM)</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresHumanApproval}
                onChange={e => setRequiresHumanApproval(e.target.checked)}
                className="rounded bg-slate-100 dark:bg-zinc-950 border-slate-300 dark:border-zinc-700 text-emerald-600 focus:ring-0"
              />
              <span>Human Approval Gate for Writes</span>
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-mono text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isEvaluating}
              className="px-4 py-2 rounded-xl text-xs font-sans font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 transition shadow-sm"
            >
              {isEvaluating ? 'Auditing...' : 'Audit Custom Manifest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
