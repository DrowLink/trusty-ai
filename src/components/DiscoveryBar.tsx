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
      <div className="security-card p-3 sm:p-3.5 rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Left: Sources */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-xs font-mono text-zinc-400 mr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-zinc-300">DISCOVERY ENGINE:</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.08] text-[10px] sm:text-[11px] font-mono text-zinc-300">
            <Github className="w-3 h-3 text-zinc-400" />
            <span>GitHub Repos</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.08] text-[10px] sm:text-[11px] font-mono text-zinc-300">
            <Terminal className="w-3 h-3 text-zinc-400" />
            <span>MCP Registries (NPM)</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.08] text-[10px] sm:text-[11px] font-mono text-zinc-300">
            <Store className="w-3 h-3 text-zinc-400" />
            <span>Hugging Face Spaces</span>
          </div>
        </div>

        {/* Right: Trigger */}
        <div className="flex items-center w-full sm:w-auto justify-end">
          <button
            onClick={triggerCrawl}
            disabled={isCrawling}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-3 py-1.5 rounded text-xs font-mono font-medium text-zinc-200 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 border border-white/[0.1] disabled:opacity-50 transition"
          >
            <RefreshCw className={`w-3 h-3 text-emerald-400 ${isCrawling ? 'animate-spin' : ''}`} />
            <span>{isCrawling ? 'Crawling...' : 'Trigger Multi-Source Crawl'}</span>
          </button>
        </div>
      </div>

      {lastCrawlResult && (
        <div className="mt-2 text-[11px] font-mono text-emerald-400/90 flex items-center space-x-1.5 bg-emerald-950/20 px-3 py-1.5 rounded border border-emerald-800/40">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{lastCrawlResult}</span>
        </div>
      )}
    </div>
  );
};
