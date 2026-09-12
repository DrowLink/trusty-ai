import { NextRequest, NextResponse } from 'next/server';
import { intentStore } from '@/lib/storage/intentStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const decisions = await intentStore.getDecisions();
    return NextResponse.json({
      success: true,
      count: decisions.length,
      decisions,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
