import { AgentWithScore, AgentRecord, DiscoveryStats } from '../types';

const STORAGE_KEY = 'trusty_custom_agents_v1';

export function getLocalCustomAgents(): AgentWithScore[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to read custom agents from localStorage:', err);
    return [];
  }
}

export function saveLocalCustomAgent(agent: AgentWithScore): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalCustomAgents();
    // Match by ID or repositoryUrl or slug
    const filtered = current.filter(a => {
      if (a.id === agent.id) return false;
      if (agent.repositoryUrl && a.repositoryUrl && a.repositoryUrl.toLowerCase() === agent.repositoryUrl.toLowerCase()) return false;
      if (agent.slug && a.slug && a.slug.toLowerCase() === agent.slug.toLowerCase()) return false;
      return true;
    });
    const updated = [agent, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save custom agent to localStorage:', err);
  }
}

export function saveMultipleLocalCustomAgents(agents: AgentWithScore[]): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalCustomAgents();
    const map = new Map<string, AgentWithScore>();
    
    // Put current first
    for (const a of current) {
      map.set(a.id, a);
    }
    // Overwrite/add new
    for (const a of agents) {
      map.set(a.id, a);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(map.values())));
  } catch (err) {
    console.warn('Failed to save custom agents to localStorage:', err);
  }
}

/**
 * Merges server agents with locally stored custom agents.
 * Returns the unified list and any local agents that the server might not know about yet (so they can be synced to DB).
 */
export function mergeAgentsWithLocal(serverAgents: AgentWithScore[]): {
  merged: AgentWithScore[];
  newToSync: AgentRecord[];
} {
  const localAgents = getLocalCustomAgents();
  if (localAgents.length === 0) {
    return { merged: serverAgents, newToSync: [] };
  }

  const serverIdSet = new Set(serverAgents.map(a => a.id));
  const serverRepoSet = new Set(
    serverAgents.filter(a => !!a.repositoryUrl).map(a => a.repositoryUrl!.toLowerCase())
  );
  const serverSlugSet = new Set(serverAgents.map(a => a.slug.toLowerCase()));

  const newToSync: AgentRecord[] = [];
  const missingFromServer: AgentWithScore[] = [];

  for (const local of localAgents) {
    const isKnown = 
      serverIdSet.has(local.id) ||
      (local.repositoryUrl && serverRepoSet.has(local.repositoryUrl.toLowerCase())) ||
      serverSlugSet.has(local.slug.toLowerCase());

    if (!isKnown) {
      missingFromServer.push(local);
      // Strip evaluation to get pure AgentRecord for syncing to backend
      const { evaluation, ...record } = local;
      newToSync.push(record as AgentRecord);
    }
  }

  // Combine: missingFromServer at top, then server agents
  const merged = [...missingFromServer, ...serverAgents];

  return {
    merged,
    newToSync,
  };
}

/**
 * Computes live statistics across an agent collection
 */
export function computeDiscoveryStats(all: AgentWithScore[]): DiscoveryStats {
  const total = all.length;
  const avgTrust = total > 0 ? Math.round(all.reduce((acc, a) => acc + (a.evaluation?.trustyScore || 50), 0) / total) : 0;

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
    const tier = a.evaluation?.riskTier;
    if (tier === 'LOW_RISK') lowRisk++;
    else if (tier === 'MEDIUM_RISK') medRisk++;
    else if (tier === 'HIGH_RISK') highRisk++;
    else critRisk++;

    if (a.sourceEcosystem && a.sourceEcosystem in ecosystemCounts) {
      ecosystemCounts[a.sourceEcosystem as keyof typeof ecosystemCounts]++;
    } else {
      ecosystemCounts.manual_scan++;
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
