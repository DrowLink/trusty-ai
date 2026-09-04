import { NextRequest, NextResponse } from 'next/server';
import { agentStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get('category');
  const risk = searchParams.get('risk');
  const ecosystem = searchParams.get('ecosystem');
  const permission = searchParams.get('permission');
  const search = searchParams.get('q')?.toLowerCase();
  const sort = searchParams.get('sort') || 'trust_desc';

  let agents = agentStore.getAll();

  // Search query
  if (search) {
    agents = agents.filter(a => 
      a.name.toLowerCase().includes(search) ||
      a.description.toLowerCase().includes(search) ||
      a.publisher.name.toLowerCase().includes(search) ||
      a.slug.toLowerCase().includes(search)
    );
  }

  // Category filter
  if (category && category !== 'all') {
    agents = agents.filter(a => a.category === category);
  }

  // Risk filter
  if (risk && risk !== 'all') {
    agents = agents.filter(a => a.evaluation.riskTier === risk);
  }

  // Ecosystem filter
  if (ecosystem && ecosystem !== 'all') {
    agents = agents.filter(a => a.sourceEcosystem === ecosystem);
  }

  // Permission filter
  if (permission && permission !== 'all') {
    agents = agents.filter(a => 
      a.requestedPermissions.some(p => p.scope.toLowerCase().includes(permission.toLowerCase()))
    );
  }

  // Sorting
  if (sort === 'trust_desc') {
    agents.sort((a, b) => b.evaluation.trustyScore - a.evaluation.trustyScore);
  } else if (sort === 'trust_asc') {
    agents.sort((a, b) => a.evaluation.trustyScore - b.evaluation.trustyScore);
  } else if (sort === 'confidence_desc') {
    agents.sort((a, b) => b.evaluation.confidence - a.evaluation.confidence);
  } else if (sort === 'popularity_desc') {
    agents.sort((a, b) => (b.starsCount || 0) - (a.starsCount || 0));
  } else if (sort === 'recent') {
    agents.sort((a, b) => new Date(b.discoveredAt).getTime() - new Date(a.discoveredAt).getTime());
  }

  const stats = agentStore.getStats();

  return NextResponse.json({
    success: true,
    total: agents.length,
    stats,
    agents,
  });
}
