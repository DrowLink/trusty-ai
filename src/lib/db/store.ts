import { AgentRecord, AgentWithScore, DiscoveryStats } from '../types';
import { SEED_AGENTS } from './seed';
import { evaluateAgentTrust } from '../scoring/engine';
import { fetchFirestoreAgents, saveAgentToFirestore, bulkSaveAgentsToFirestore, isFirebaseConfigured } from './firebase';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');
const LOCAL_CACHE_FILE = path.join(DATA_DIR, 'custom_agents.json');

class AgentTrustStore {
  private agents: Map<string, AgentRecord> = new Map();
  private isHydrated: boolean = false;

  constructor() {
    this.seed();
    this.loadFromLocalCache();
  }

  private seed() {
    for (const agent of SEED_AGENTS) {
      this.agents.set(agent.id, agent);
    }
  }

  private loadFromLocalCache() {
    try {
      if (typeof window === 'undefined' && fs.existsSync(LOCAL_CACHE_FILE)) {
        const raw = fs.readFileSync(LOCAL_CACHE_FILE, 'utf-8');
        const list: AgentRecord[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          for (const agent of list) {
            this.agents.set(agent.id, agent);
          }
        }
      }
    } catch (err) {
      // Ignored in read-only environments
    }
  }

  private persistToLocalCache() {
    try {
      if (typeof window === 'undefined') {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        // Only persist custom agents (not seed agents)
        const seedIds = new Set(SEED_AGENTS.map(a => a.id));
        const customAgents = Array.from(this.agents.values()).filter(a => !seedIds.has(a.id));
        fs.writeFileSync(LOCAL_CACHE_FILE, JSON.stringify(customAgents, null, 2), 'utf-8');
      }
    } catch (err) {
      // Ignored in read-only environments like Vercel serverless
    }
  }

  /**
   * Asynchronously hydrates from Firestore and local cache.
   * Called by API routes to ensure latest cloud-persisted agents are loaded.
   */
  public async hydrate(): Promise<void> {
    if (this.isHydrated && !isFirebaseConfigured) return;

    this.loadFromLocalCache();

    if (isFirebaseConfigured) {
      try {
        const firestoreAgents = await fetchFirestoreAgents();
        for (const agent of firestoreAgents) {
          this.agents.set(agent.id, agent);
        }
        this.persistToLocalCache();
      } catch (err) {
        console.warn('[Store] Hydration from Firestore failed:', err);
      }
    }

    this.isHydrated = true;
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
    this.persistToLocalCache();

    // Async save to Firestore if configured
    if (isFirebaseConfigured) {
      saveAgentToFirestore(agent).catch(err => {
        console.warn(`[Store] Firestore async save error for ${agent.id}:`, err);
      });
    }

    return {
      ...agent,
      evaluation: evaluateAgentTrust(agent),
    };
  }

  public bulkUpsert(agents: AgentRecord[]): AgentWithScore[] {
    const results: AgentWithScore[] = [];
    for (const agent of agents) {
      this.agents.set(agent.id, agent);
      results.push({
        ...agent,
        evaluation: evaluateAgentTrust(agent),
      });
    }
    this.persistToLocalCache();

    if (isFirebaseConfigured && agents.length > 0) {
      bulkSaveAgentsToFirestore(agents).catch(err => {
        console.warn('[Store] Firestore bulk save error:', err);
      });
    }

    return results;
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
