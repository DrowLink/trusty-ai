import { NextRequest, NextResponse } from 'next/server';
import { agentStore } from '@/lib/db/store';
import { getFirebaseStatus } from '@/lib/db/firebase';
import { getSupabaseStatus } from '@/lib/supabase/database';
import { AgentRecord } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  await agentStore.hydrate();
  const all = agentStore.getAll();
  const firebaseStatus = getFirebaseStatus();
  const supabaseStatus = getSupabaseStatus();

  return NextResponse.json({
    success: true,
    totalAgents: all.length,
    supabase: supabaseStatus,
    firebase: firebaseStatus,
    stats: agentStore.getStats(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const incoming: AgentRecord[] = Array.isArray(body.agents) 
      ? body.agents 
      : (body.agent ? [body.agent] : []);

    if (incoming.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No agents provided to sync.' },
        { status: 400 }
      );
    }

    await agentStore.hydrate();
    const updated = agentStore.bulkUpsert(incoming);

    return NextResponse.json({
      success: true,
      syncedCount: updated.length,
      totalAgents: agentStore.getAll().length,
      stats: agentStore.getStats(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Sync failed' },
      { status: 500 }
    );
  }
}
