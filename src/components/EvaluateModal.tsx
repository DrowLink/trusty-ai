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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0d131f] border border-slate-200/90 dark:border-white/[0.08] rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden my-auto transition-all">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#070a12] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white font-sans tracking-tight">
                Agent Security &amp; Underwriting Audit
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                Analyze repository code, declare permissions, and generate live trust scores
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

        {/* Section 1: Real GitHub Audit & Auto-Permission Inference */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-50/40 dark:bg-[#080c14]/60">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center space-x-2 text-xs font-sans font-semibold text-slate-900 dark:text-slate-100">
              <Github className="w-4 h-4 text-slate-900 dark:text-slate-200" />
              <span>Attach GitHub Repository (Auto-Infer Permissions)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 text-[10px] font-mono font-medium hidden sm:inline-block">
              Zero Manual Input
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              placeholder="Paste repository URL (e.g. https://github.com/crewAIInc/crewAI)..."
              className="flex-1 px-3.5 py-2.5 bg-white dark:bg-[#080c14] border border-slate-200/90 dark:border-white/[0.1] focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-sans transition"
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleAutoScanRepo()}
                disabled={isScanningRepo || !githubUrl.trim()}
                className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-sans font-semibold rounded-xl text-xs transition flex items-center space-x-1.5 disabled:opacity-50 shadow-xs"
              >
                {isScanningRepo ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Scan</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLiveGitHubAudit}
                disabled={isEvaluating || !githubUrl.trim()}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-sans font-semibold rounded-xl text-xs transition flex items-center space-x-1.5 disabled:opacity-50 shadow-xs"
              >
                <span>{isEvaluating ? 'Auditing...' : 'Instant Audit'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Try Links */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-slate-600 dark:text-slate-400 font-sans">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Try real repos:</span>
            <button
              type="button"
              onClick={() => {
                setGithubUrl('https://github.com/crewAIInc/crewAI');
                handleAutoScanRepo('https://github.com/crewAIInc/crewAI');
              }}
              className="px-2 py-0.5 rounded-lg bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-400 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300 font-mono text-[11px] transition"
            >
              crewAIInc/crewAI
            </button>
            <button
              type="button"
              onClick={() => {
                setGithubUrl('https://github.com/anthropics/anthropic-quickstarts');
                handleAutoScanRepo('https://github.com/anthropics/anthropic-quickstarts');
              }}
              className="px-2 py-0.5 rounded-lg bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-400 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300 font-mono text-[11px] transition"
            >
              anthropics/quickstarts
            </button>
            <button
              type="button"
              onClick={() => {
                setGithubUrl('https://github.com/DrowLink/trusty-ai');
                handleAutoScanRepo('https://github.com/DrowLink/trusty-ai');
              }}
              className="px-2 py-0.5 rounded-lg bg-white dark:bg-[#080c14] border border-slate-200/80 dark:border-white/[0.08] hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-400 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300 font-mono text-[11px] transition"
            >
              DrowLink/trusty-ai
            </button>
          </div>

          {/* Scan Success & Auto-Detected Features Pills */}
          {scanSuccessMsg && (
            <div className="mt-3 p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/90 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200 text-xs font-sans space-y-2">
              <div className="flex items-center space-x-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{scanSuccessMsg}</span>
              </div>
              {detectedFeatures.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {detectedFeatures.map((feat, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-md bg-white dark:bg-[#080c14] border border-emerald-200/80 dark:border-emerald-700/40 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 shadow-2xs">
                      {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Synthetic Threat Scenarios */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-100/60 dark:bg-[#070a12]/50">
          <div className="text-xs font-sans font-medium text-slate-600 dark:text-slate-400 mb-2">
            Or test instant synthetic threat scenarios:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadPreset('safe')}
              className="px-3 py-1.5 rounded-xl text-xs font-sans font-semibold bg-white dark:bg-[#080c14] text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-white/[0.08] hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center space-x-1.5 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Enterprise SQL Copilot</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('overprivileged')}
              className="px-3 py-1.5 rounded-xl text-xs font-sans font-semibold bg-white dark:bg-[#080c14] text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-white/[0.08] hover:border-amber-500 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition flex items-center space-x-1.5 shadow-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Overprivileged Calendar</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('trojan')}
              className="px-3 py-1.5 rounded-xl text-xs font-sans font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition flex items-center space-x-1.5 shadow-xs"
            >
              <Terminal className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
              <span>Trojan Credential Stealer</span>
            </button>
          </div>
        </div>

        {/* Section 3: Custom Form */}
        <form onSubmit={handleEvaluate} className="p-4 sm:p-5 space-y-4 text-xs font-sans bg-[#fafafa] dark:bg-transparent">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 text-xs border border-rose-200/90 dark:border-rose-800/60 font-sans">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-sans font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Agent Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. FinanceSync Agent"
                className="w-full px-3.5 py-2 bg-white dark:bg-[#080c14] border border-slate-200/90 dark:border-white/[0.1] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] font-sans transition"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Publisher Name
              </label>
              <input
                type="text"
                value={publisherName}
                onChange={e => setPublisherName(e.target.value)}
                placeholder="e.g. Acme Corp or Anon"
                className="w-full px-3.5 py-2 bg-white dark:bg-[#080c14] border border-slate-200/90 dark:border-white/[0.1] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] font-sans transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-sans font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Publisher Domain
              </label>
              <input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="e.g. acme.com"
                className="w-full px-3.5 py-2 bg-white dark:bg-[#080c14] border border-slate-200/90 dark:border-white/[0.1] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] font-sans transition"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 bg-white dark:bg-[#080c14] border border-slate-200/90 dark:border-white/[0.1] rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] font-sans transition"
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-sans font-semibold text-slate-700 dark:text-slate-300">
                Requested Capabilities &amp; Permissions
              </label>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-sans">
                (Or use repository scanner above)
              </span>
            </div>
            <input
              type="text"
              value={permissions}
              onChange={e => setPermissions(e.target.value)}
              placeholder="e.g. calendar:read, gmail:read_all, terminal:exec"
              className="w-full px-3.5 py-2 bg-white dark:bg-[#080c14] border border-slate-200/90 dark:border-white/[0.1] rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition"
            />
            
            {/* Quick Permission Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] font-sans text-slate-500 dark:text-slate-400 font-medium">Quick insert:</span>
              <button
                type="button"
                onClick={() => setPermissions(prev => prev ? `${prev}, db:read_only` : 'db:read_only')}
                className="px-2 py-0.5 rounded-lg text-[11px] font-sans font-medium bg-white hover:bg-slate-100 dark:bg-[#080c14] dark:hover:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/[0.08] transition shadow-2xs"
              >
                + Database (Read)
              </button>
              <button
                type="button"
                onClick={() => setPermissions(prev => prev ? `${prev}, network:outbound_https` : 'network:outbound_https')}
                className="px-2 py-0.5 rounded-lg text-[11px] font-sans font-medium bg-white hover:bg-slate-100 dark:bg-[#080c14] dark:hover:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/[0.08] transition shadow-2xs"
              >
                + Internet Access
              </button>
              <button
                type="button"
                onClick={() => setPermissions(prev => prev ? `${prev}, fs:workspace_write` : 'fs:workspace_write')}
                className="px-2 py-0.5 rounded-lg text-[11px] font-sans font-medium bg-white hover:bg-slate-100 dark:bg-[#080c14] dark:hover:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/[0.08] transition shadow-2xs"
              >
                + Save Files
              </button>
              <button
                type="button"
                onClick={() => setPermissions(prev => prev ? `${prev}, terminal:exec` : 'terminal:exec')}
                className="px-2 py-0.5 rounded-lg text-[11px] font-sans font-medium bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/50 transition shadow-2xs"
              >
                + Terminal (Critical)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-center space-x-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isSandboxed}
                onChange={e => setIsSandboxed(e.target.checked)}
                className="rounded-md border-slate-300 dark:border-slate-700 text-[#0066FF] focus:ring-0 w-4 h-4"
              />
              <span>Runs in Sandbox (gVisor/WASM)</span>
            </label>

            <label className="flex items-center space-x-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={requiresHumanApproval}
                onChange={e => setRequiresHumanApproval(e.target.checked)}
                className="rounded-md border-slate-300 dark:border-slate-700 text-[#0066FF] focus:ring-0 w-4 h-4"
              />
              <span>Human Approval Gate for Writes</span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-200/80 dark:border-white/[0.08] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-sans font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isEvaluating}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
            >
              {isEvaluating ? 'Auditing...' : 'Audit Custom Manifest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
