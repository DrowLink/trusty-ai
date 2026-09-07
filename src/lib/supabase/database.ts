import { supabase, supabaseAdmin, isSupabaseConfigured } from './client';
import { AgentRecord, AgentWithScore } from '../types';
import { SEED_AGENTS } from '../db/seed';
import { evaluateAgentTrust } from '../scoring/engine';
import { evaluateAgentCredit } from '../scoring/creditEngine';

export { isSupabaseConfigured };

const AGENTS_TABLE = 'agents';

function getDbClient() {
  return supabaseAdmin || supabase;
}

/**
 * Format an agent for database insertion with full review & credit profile
 */
function prepareAgentRow(agent: AgentRecord | AgentWithScore) {
  const evaluation = (agent as AgentWithScore).evaluation || evaluateAgentTrust(agent);
  const creditProfile = (agent as AgentWithScore).creditProfile || evaluateAgentCredit(agent, evaluation.trustyScore);

  const fullData: AgentWithScore = {
    ...agent,
    evaluation,
    creditProfile,
  };

  return {
    id: agent.id,
    name: agent.name,
    slug: agent.slug,
    category: agent.category,
    source_ecosystem: agent.sourceEcosystem,
    data: fullData,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Fetch all agents from Supabase PostgreSQL with their full evaluations and credit reviews
 */
export async function fetchSupabaseAgentsWithScores(): Promise<AgentWithScore[]> {
  const client = getDbClient();
  if (!client || !isSupabaseConfigured) return [];

  try {
    const { data, error } = await client
      .from(AGENTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Error fetching agents:', error.message);
      return [];
    }

    if (!data || data.length === 0) return [];

    return data.map((row: any) => {
      const raw = row.data || row;
      const evaluation = raw.evaluation || evaluateAgentTrust(raw);
      const creditProfile = raw.creditProfile || evaluateAgentCredit(raw, evaluation.trustyScore);
      return {
        ...raw,
        evaluation,
        creditProfile,
      } as AgentWithScore;
    });
  } catch (err) {
    console.warn('[Supabase] Exception fetching agents with scores:', err);
    return [];
  }
}

/**
 * Fetch all agents persisted in Supabase PostgreSQL (as AgentRecord)
 */
export async function fetchSupabaseAgents(): Promise<AgentRecord[]> {
  const list = await fetchSupabaseAgentsWithScores();
  return list.map(({ evaluation, creditProfile, ...agent }) => agent);
}

/**
 * Save or update an agent record with review in Supabase PostgreSQL
 */
export async function saveAgentToSupabase(agent: AgentRecord | AgentWithScore): Promise<boolean> {
  const client = getDbClient();
  if (!client || !isSupabaseConfigured) return false;

  try {
    const row = prepareAgentRow(agent);

    const { error } = await client
      .from(AGENTS_TABLE)
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn(`[Supabase] Failed to upsert agent ${agent.id}:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[Supabase] Exception saving agent ${agent.id}:`, err);
    return false;
  }
}

/**
 * Bulk persist agents with their reviews to Supabase PostgreSQL
 */
export async function bulkSaveAgentsToSupabase(agents: (AgentRecord | AgentWithScore)[]): Promise<number> {
  const client = getDbClient();
  if (!client || !isSupabaseConfigured || agents.length === 0) return 0;

  try {
    const rows = agents.map(agent => prepareAgentRow(agent));

    const { error } = await client
      .from(AGENTS_TABLE)
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] Failed bulk upsert:', error.message);
      return 0;
    }

    return agents.length;
  } catch (err) {
    console.warn('[Supabase] Exception in bulk upsert:', err);
    return 0;
  }
}

/**
 * Ensure Supabase has the base seed agents and initial directory records
 */
export async function ensureSupabaseSeeded(): Promise<number> {
  const client = getDbClient();
  if (!client || !isSupabaseConfigured) return 0;

  try {
    const { count, error } = await client
      .from(AGENTS_TABLE)
      .select('id', { count: 'exact', head: true });

    if (error) {
      console.warn('[Supabase] Check count error:', error.message);
      return 0;
    }

    // If table has fewer than 10 agents, seed the default catalogue
    if (count === null || count < 10) {
      console.log(`[Supabase] Seeding ${SEED_AGENTS.length} initial agents with full reviews...`);
      return await bulkSaveAgentsToSupabase(SEED_AGENTS);
    }

    return count;
  } catch (err) {
    console.warn('[Supabase] Exception during ensureSupabaseSeeded:', err);
    return 0;
  }
}

export function getSupabaseStatus() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return {
    configured: isSupabaseConfigured,
    provider: 'Supabase (PostgreSQL)',
    projectUrl: url ? `${url.substring(0, 16)}...` : null,
  };
}

