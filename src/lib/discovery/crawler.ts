import { agentStore } from '../db/store';
import { discoverFromGitHub } from './sources/github';
import { discoverFromMCPRegistry } from './sources/mcp';
import { discoverFromMarketplaces } from './sources/marketplaces';
import { AgentRecord } from '../types';

export interface CrawlResult {
  discoveredCount: number;
  sourcesScanned: {
    github: number;
    mcp_registry: number;
    agent_marketplace: number;
  };
  durationMs: number;
  newAgents: AgentRecord[];
}

export async function runUniversalCrawler(): Promise<CrawlResult> {
  const startTime = Date.now();

  const [ghResults, mcpResults, mktResults] = await Promise.all([
    discoverFromGitHub('topic:ai-agent topic:mcp-server'),
    discoverFromMCPRegistry(),
    discoverFromMarketplaces(),
  ]);

  const newAgents: AgentRecord[] = [];

  // Ingest GitHub
  for (const gh of ghResults) {
    if (gh.id && gh.name) {
      const fullRecord = gh as AgentRecord;
      agentStore.upsert(fullRecord);
      newAgents.push(fullRecord);
    }
  }

  // Ingest MCP
  for (const mcp of mcpResults) {
    agentStore.upsert(mcp);
    newAgents.push(mcp);
  }

  // Ingest Marketplaces
  for (const mkt of mktResults) {
    agentStore.upsert(mkt);
    newAgents.push(mkt);
  }

  const durationMs = Date.now() - startTime;

  return {
    discoveredCount: newAgents.length,
    sourcesScanned: {
      github: ghResults.length,
      mcp_registry: mcpResults.length,
      agent_marketplace: mktResults.length,
    },
    durationMs,
    newAgents,
  };
}
