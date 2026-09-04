'use client';

import React, { useState } from 'react';
import { RefreshCw, Radio, CheckCircle2, Github, Boxes, Store } from 'lucide-react';

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
          `Crawl complete in ${data.crawlResult.durationMs}ms: Scanned GitHub (${data.crawlResult.sourcesScanned.github}), MCP Registry (${data.crawlResult.sourcesScanned.mcp_registry}), Marketplaces (${data.crawlResult.sourcesScanned.agent_marketplace}).`
        );
        onRefresh();
      } else {
        setLastCrawlResult(`Discovery error: ${data.error}`);
      }
    } catch (err: any) {
      setLastCrawlResult(`Failed to trigger crawler: ${err.message}`);
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-4 sm:my-6 px-3 sm:px-6">
      <div className="glass-panel p-3 sm:p-4 rounded-xl border border-slate-800/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Ecosystem Sources indicator */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <div className="flex items-center space-x-1 text-xs font-mono text-slate-300 mr-1 w-full sm:w-auto mb-1 sm:mb-0">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse flex-shrink-0" />
            <span className="font-semibold">Discovery Engine:</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-slate-900 border border-slate-700/60 text-[10px] sm:text-[11px] text-slate-300">
            <Github className="w-3 h-3 text-sky-400 flex-shrink-0" />
            <span>GitHub</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-slate-900 border border-slate-700/60 text-[10px] sm:text-[11px] text-slate-300">
            <Boxes className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span>MCP Registry</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-slate-900 border border-slate-700/60 text-[10px] sm:text-[11px] text-slate-300">
            <Store className="w-3 h-3 text-purple-400 flex-shrink-0" />
            <span>Hugging Face & CrewAI</span>
          </div>
        </div>

        {/* Right: Crawl action button */}
        <div className="flex items-center w-full sm:w-auto">
          <button
            onClick={triggerCrawl}
            disabled={isCrawling}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-600 disabled:opacity-50 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isCrawling ? 'animate-spin' : ''}`} />
            <span>{isCrawling ? 'Crawling...' : 'Trigger Multi-Source Crawl'}</span>
          </button>
        </div>
      </div>

      {lastCrawlResult && (
        <div className="mt-2 text-[11px] sm:text-xs font-mono text-emerald-400/90 flex items-center space-x-1.5 bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-800/40">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{lastCrawlResult}</span>
        </div>
      )}
    </div>
  );
};
