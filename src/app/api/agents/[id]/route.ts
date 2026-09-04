import { NextRequest, NextResponse } from 'next/server';
import { agentStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const agent = agentStore.getById(params.id);

  if (!agent) {
    return NextResponse.json(
      { success: false, error: 'Agent not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    agent,
  });
}
