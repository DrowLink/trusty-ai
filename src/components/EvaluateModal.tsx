'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, Terminal, Github, ArrowRight, Shield } from 'lucide-react';
import { AgentWithScore } from '@/lib/types';

interface EvaluateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEvaluationComplete: (agent: AgentWithScore) => void;
}

export const EvaluateModal: React.FC<EvaluateModalProps> = ({
  isOpen,
  onClose,
  onEvaluationComplete,
}) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [name, setName] = useState('');
  const [publisherName, setPublisherName] = useState('');
  const [domain, setDomain] = useState('');
  const [category, setCategory] = useState('productivity');
  const [permissions, setPermissions] = useState('calendar:read, calendar:write');
  const [isSandboxed, setIsSandboxed] = useState(true);
  const [requiresHumanApproval, setRequiresHumanApproval] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const loadPreset = (presetType: 'safe' | 'overprivileged' | 'trojan') => {
    setGithubUrl('');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl security-card rounded-lg shadow-2xl overflow-hidden my-auto">
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-zinc-900 border border-white/[0.1] flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-100 font-mono">Agent Security Audit</h3>
              <p className="text-[11px] text-zinc-500 font-sans">Evaluate repository code, permissions, and threat vectors</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Real GitHub Audit */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-zinc-900/30">
          <div className="flex items-center space-x-1.5 text-xs font-mono text-zinc-300 font-semibold mb-2">
            <Github className="w-3.5 h-3.5 text-zinc-400" />
            <span>Audit Any Public GitHub Repository in Real-Time:</span>
          </div>
          <form onSubmit={handleLiveGitHubAudit} className="flex gap-2">
            <input
              type="url"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              placeholder="e.g. https://github.com/crewAIInc/crewAI"
              className="flex-1 px-3 py-1.5 bg-zinc-950 border border-white/[0.1] rounded text-xs text-white focus:outline-none focus:border-zinc-500 font-mono"
            />
            <button
              type="submit"
              disabled={isEvaluating}
              className="px-3.5 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 font-mono font-medium rounded text-xs transition flex items-center space-x-1 disabled:opacity-50 flex-shrink-0"
            >
              <span>{isEvaluating ? 'Auditing...' : 'Audit Live Repo'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
          <p className="text-[11px] text-zinc-500 mt-1.5 font-sans">
            Queries GitHub REST API live: parses commits, stars, license, dependencies, and runs the 20-signal audit.
          </p>
        </div>

        {/* Section 2: Scenarios */}
        <div className="p-3 sm:p-4 border-b border-white/[0.08] bg-zinc-900/20">
          <div className="text-[11px] font-mono text-zinc-500 mb-2">Or test synthetic threat scenarios:</div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadPreset('safe')}
              className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-900 text-zinc-300 border border-white/[0.08] hover:text-white transition flex items-center space-x-1"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Enterprise Copilot</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('overprivileged')}
              className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-900 text-zinc-300 border border-white/[0.08] hover:text-white transition flex items-center space-x-1"
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Overprivileged Calendar</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('trojan')}
              className="px-2 py-1 rounded text-[11px] font-mono bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900 transition flex items-center space-x-1"
            >
              <Terminal className="w-3 h-3 text-rose-400" />
              <span>Trojan Credential Stealer</span>
            </button>
          </div>
        </div>

        {/* Section 3: Custom Form */}
        <form onSubmit={handleEvaluate} className="p-4 sm:p-5 space-y-3.5 text-xs font-sans">
          {error && (
            <div className="p-2.5 rounded bg-rose-950/80 text-rose-300 text-xs border border-rose-800 font-mono">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">Agent Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. FinanceSync Agent"
                className="w-full px-3 py-1.5 bg-zinc-950 border border-white/[0.1] rounded text-xs text-white focus:outline-none focus:border-zinc-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">Publisher Name</label>
              <input
                type="text"
                value={publisherName}
                onChange={e => setPublisherName(e.target.value)}
                placeholder="e.g. Acme Corp or Anon"
                className="w-full px-3 py-1.5 bg-zinc-950 border border-white/[0.1] rounded text-xs text-white focus:outline-none focus:border-zinc-500 font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">Publisher Domain</label>
              <input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="e.g. acme.com"
                className="w-full px-3 py-1.5 bg-zinc-950 border border-white/[0.1] rounded text-xs text-white focus:outline-none focus:border-zinc-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-950 border border-white/[0.1] rounded text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 font-mono"
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
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Requested Permissions (comma separated)
            </label>
            <input
              type="text"
              value={permissions}
              onChange={e => setPermissions(e.target.value)}
              placeholder="e.g. calendar:read, gmail:read_all, terminal:exec"
              className="w-full px-3 py-1.5 bg-zinc-950 border border-white/[0.1] rounded text-xs text-white font-mono focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-sans">
            <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isSandboxed}
                onChange={e => setIsSandboxed(e.target.checked)}
                className="rounded bg-zinc-950 border-zinc-700 text-emerald-500 focus:ring-0"
              />
              <span>Runs in Sandbox (gVisor/WASM)</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresHumanApproval}
                onChange={e => setRequiresHumanApproval(e.target.checked)}
                className="rounded bg-zinc-950 border-zinc-700 text-emerald-500 focus:ring-0"
              />
              <span>Human Approval Gate for Writes</span>
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isEvaluating}
              className="px-4 py-1.5 rounded text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition"
            >
              {isEvaluating ? 'Auditing...' : 'Audit Custom Manifest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
