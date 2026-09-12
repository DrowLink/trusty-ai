import { NextRequest, NextResponse } from 'next/server';
import { intentStore } from '@/lib/storage/intentStore';
import { SAMPLE_MANDATES, SAMPLE_APPROVAL_QUEUE, SAMPLE_DECISIONS_AUDIT } from '@/lib/data/consoleData';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await intentStore.loadSampleData(SAMPLE_MANDATES, SAMPLE_APPROVAL_QUEUE, SAMPLE_DECISIONS_AUDIT);
    return NextResponse.json({
      success: true,
      message: 'Sample pitch scenarios loaded into store',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await intentStore.clearAll();
    return NextResponse.json({
      success: true,
      message: 'Store cleared to empty state',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
