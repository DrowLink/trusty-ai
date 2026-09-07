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
      <div className="security-card p-3 sm:p-3.5 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs border border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
        {/* Left: Sources */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mr-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-800 dark:text-slate-200 font-sans">
              Discovery Engine:
            </span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-100/90 dark:bg-white/[0.05] border border-slate-200/90 dark:border-white/[0.08] text-xs font-medium font-sans text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/[0.15] transition-colors">
            <Github className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>GitHub Repos</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-100/90 dark:bg-white/[0.05] border border-slate-200/90 dark:border-white/[0.08] text-xs font-medium font-sans text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/[0.15] transition-colors">
            <Terminal className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>MCP Registries (NPM)</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-100/90 dark:bg-white/[0.05] border border-slate-200/90 dark:border-white/[0.08] text-xs font-medium font-sans text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/[0.15] transition-colors">
            <Store className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Hugging Face Spaces</span>
          </div>
        </div>

        {/* Right: Trigger */}
        <div className="flex items-center w-full sm:w-auto justify-end">
          <button
            onClick={triggerCrawl}
            disabled={isCrawling}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-xs font-sans font-semibold text-slate-800 dark:text-slate-100 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 active:scale-[0.98] border border-slate-200 dark:border-slate-700 shadow-xs hover:border-[#0066FF]/40 dark:hover:border-[#0066FF]/50 disabled:opacity-50 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#0066FF] dark:text-blue-400 ${isCrawling ? 'animate-spin' : ''}`} />
            <span>{isCrawling ? 'Crawling Repositories...' : 'Trigger Multi-Source Crawl'}</span>
          </button>
        </div>
      </div>

      {lastCrawlResult && (
        <div className="mt-2.5 text-xs font-sans text-emerald-800 dark:text-emerald-300 flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800/50 shadow-xs">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="leading-relaxed">{lastCrawlResult}</span>
        </div>
      )}
    </div>
  );
};

