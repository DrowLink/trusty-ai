'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Github, Terminal, Store, ArrowRight } from 'lucide-react';

interface DiscoveryBarProps {
  onRefresh: () => void;
}

export const DiscoveryBar: React.FC<DiscoveryBarProps> = ({ onRefresh }) => {
  const [isCrawling, setIsCrawling] = useState(false);
  const [lastCrawlResult, setLastCrawlResult] = useState<string | null>(null);

  const triggerCrawl = async () => {
    setIsCrawling(true);
    setLastCrawlResult(null);

    try {
      const res = await fetch('/api/discover', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setLastCrawlResult(
          `Crawl completed in ${data.crawlResult.durationMs}ms: Scanned GitHub (${data.crawlResult.sourcesScanned.github}), MCP Registry (${data.crawlResult.sourcesScanned.mcp_registry}), Hugging Face (${data.crawlResult.sourcesScanned.agent_marketplace}).`
        );
        onRefresh();
      } else {
        setLastCrawlResult(`Discovery error: ${data.error}`);
      }
    } catch (err: any) {
      setLastCrawlResult(`Crawler error: ${err.message}`);
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-4 mb-8 px-3 sm:px-6">
      <div className="security-card p-3 sm:p-3.5 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shadow-sm">
        {/* Left: Sources */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 mr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">DISCOVERY ENGINE:</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] sm:text-[11px] font-mono text-slate-700 dark:text-slate-300">
            <Github className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <span>GitHub Repos</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] sm:text-[11px] font-mono text-slate-700 dark:text-slate-300">
            <Terminal className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <span>MCP Registries (NPM)</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] sm:text-[11px] font-mono text-slate-700 dark:text-slate-300">
            <Store className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <span>Hugging Face Spaces</span>
          </div>
        </div>

        {/* Right: Trigger */}
        <div className="flex items-center w-full sm:w-auto justify-end">
          <button
            onClick={triggerCrawl}
            disabled={isCrawling}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:bg-slate-900 border border-slate-200 dark:border-slate-700/80 disabled:opacity-50 transition shadow-sm"
          >
            <RefreshCw className={`w-3 h-3 text-[#0066FF] dark:text-emerald-400 ${isCrawling ? 'animate-spin' : ''}`} />
            <span>{isCrawling ? 'Crawling...' : 'Trigger Multi-Source Crawl'}</span>
          </button>
        </div>
      </div>

      {lastCrawlResult && (
        <div className="mt-2.5 text-[11px] font-mono text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{lastCrawlResult}</span>
        </div>
      )}
    </div>
  );
};
