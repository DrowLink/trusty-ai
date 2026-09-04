'use client';

import React, { useState } from 'react';
import { X, Sparkles, AlertTriangle, ShieldCheck, Terminal, Bot } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden my-auto">
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Audit Custom Agent</h3>
              <p className="text-xs text-slate-400">Test any agent manifest against the 20 TRUSTY signals</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/40">
          <div className="text-xs font-mono text-slate-400 mb-2">Or load an evaluation preset:</div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadPreset('safe')}
              className="px-2.5 py-1 rounded-lg text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition flex items-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safe Enterprise Copilot</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('overprivileged')}
              className="px-2.5 py-1 rounded-lg text-xs bg-amber-950/80 text-amber-300 border border-amber-800 hover:bg-amber-900 transition flex items-center space-x-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Overprivileged Calendar Bot</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('trojan')}
              className="px-2.5 py-1 rounded-lg text-xs bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900 transition flex items-center space-x-1"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Trojan Credential Stealer</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleEvaluate} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950 text-rose-300 text-xs border border-rose-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Agent Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. FinanceSync Agent"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Publisher Name</label>
              <input
                type="text"
                value={publisherName}
                onChange={e => setPublisherName(e.target.value)}
                placeholder="e.g. Acme Corp or Anon"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Publisher Domain</label>
              <input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="e.g. acme.com (leave blank if anon)"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
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
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Requested Permissions (comma separated scopes)
            </label>
            <input
              type="text"
              value={permissions}
              onChange={e => setPermissions(e.target.value)}
              placeholder="e.g. calendar:read, gmail:read_all, terminal:exec, stripe:charge"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-sky-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Test least-privilege alignment (e.g. productivity assistant requesting terminal or financial access).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isSandboxed}
                onChange={e => setIsSandboxed(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0"
              />
              <span>Runs in Sandbox / Jail (WASM/Docker)</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresHumanApproval}
                onChange={e => setRequiresHumanApproval(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0"
              />
              <span>Requires Human Approval for Writes</span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs rounded-lg text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isEvaluating}
              className="px-5 py-2 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 shadow-glow disabled:opacity-50 transition"
            >
              {isEvaluating ? 'Running 20-Signal Audit...' : 'Execute Audit & Generate TRUSTY Score'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
