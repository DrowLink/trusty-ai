// Direct migration script to populate Supabase with SEED_AGENTS and their reviews
const { createClient } = require('@supabase/supabase-js');

const url = 'https://pzxtcnceevizgjpledog.supabase.co';
const secretKey = 'sb_secret_kt5g5BFVnxYq-Vcsjt8_gA_HTxmK1F_';
const client = createClient(url, secretKey, { auth: { persistSession: false } });

async function run() {
  console.log('Connecting to Supabase...');
  
  // 1. Check current count in Supabase
  const { data: initialData, count: initialCount } = await client
    .from('agents')
    .select('id, name', { count: 'exact' });

  console.log(`Current agents in Supabase: ${initialCount}`);

  // 2. Fetch all agents from local server
  try {
    const res = await fetch('http://localhost:3000/api/agents');
    const json = await res.json();
    if (json.success && Array.isArray(json.agents)) {
      console.log(`Retrieved ${json.agents.length} agents with evaluations from local server`);
      
      const rows = json.agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        slug: agent.slug,
        category: agent.category,
        source_ecosystem: agent.sourceEcosystem,
        data: agent, // stores full agent + evaluation (review) + creditProfile
        updated_at: new Date().toISOString(),
      }));

      const { error } = await client
        .from('agents')
        .upsert(rows, { onConflict: 'id' });

      if (error) {
        console.error('Error upserting to Supabase:', error);
      } else {
        console.log(`Successfully upserted ${rows.length} agents into Supabase with full reviews & credit profiles!`);
      }
    }
  } catch (err) {
    console.error('Error fetching from local server:', err);
  }

  // 3. Verify final count in Supabase
  const { count: finalCount, data: finalData } = await client
    .from('agents')
    .select('id, name, category, source_ecosystem', { count: 'exact' });

  console.log(`Final count in Supabase: ${finalCount}`);
  console.log('Sample registered agents:', finalData?.slice(0, 8).map(a => `${a.name} (${a.category})`));
}

run().catch(console.error);
