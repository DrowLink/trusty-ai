import { AgentRecord, AgentWithScore, DiscoveryStats } from '../types';
import { SEED_AGENTS } from './seed';
import { evaluateAgentTrust } from '../scoring/engine';

class AgentTrustStore {
  private agents: Map<string, AgentRecord> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    for (const agent of SEED_AGENTS) {
      this.agents.set(agent.id, agent);
    }
  }

  public getAll(): AgentWithScore[] {
    const list = Array.from(this.agents.values()).map(agent => ({
      ...agent,
      evaluation: evaluateAgentTrust(agent),
    }));

    // Default sort by trustyScore desc
    return list.sort((a, b) => b.evaluation.trustyScore - a.evaluation.trustyScore);
  }

  public getById(id: string): AgentWithScore | null {
    const agent = this.agents.get(id);
    if (!agent) return null;
    return {
      ...agent,
      evaluation: evaluateAgentTrust(agent),
    };
  }

  public upsert(agent: AgentRecord): AgentWithScore {
    this.agents.set(agent.id, agent);
    return {
      ...agent,
      evaluation: evaluateAgentTrust(agent),
    };
  }

  public getStats(): DiscoveryStats {
    const all = this.getAll();
    const total = all.length;
    const avgTrust = total > 0 ? Math.round(all.reduce((acc, a) => acc + a.evaluation.trustyScore, 0) / total) : 0;

    let lowRisk = 0;
    let medRisk = 0;
    let highRisk = 0;
    let critRisk = 0;

    const ecosystemCounts = {
      github: 0,
      mcp_registry: 0,
      agent_marketplace: 0,
      manual_scan: 0,
    };

    all.forEach(a => {
      if (a.evaluation.riskTier === 'LOW_RISK') lowRisk++;
      else if (a.evaluation.riskTier === 'MEDIUM_RISK') medRisk++;
      else if (a.evaluation.riskTier === 'HIGH_RISK') highRisk++;
      else critRisk++;

      if (a.sourceEcosystem in ecosystemCounts) {
        ecosystemCounts[a.sourceEcosystem as keyof typeof ecosystemCounts]++;
      }
    });

    return {
      totalAgents: total,
      avgTrustScore: avgTrust,
      lowRiskCount: lowRisk,
      mediumRiskCount: medRisk,
      highRiskCount: highRisk,
      criticalRiskCount: critRisk,
      ecosystemCounts,
    };
  }
}

// Global singleton instance
const globalStore = (global as any).__trustyAgentStore || new AgentTrustStore();
if (process.env.NODE_ENV !== 'production') {
  (global as any).__trustyAgentStore = globalStore;
}

export const agentStore = globalStore as AgentTrustStore;
