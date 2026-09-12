import { NextRequest, NextResponse } from 'next/server';
import { intentStore } from '@/lib/storage/intentStore';
import { ApprovalQueueItem, VerifiedDecisionRecord } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await intentStore.getApprovalQueue();
    return NextResponse.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, decision, note, reviewerEmail } = body;

    if (!itemId || !decision) {
      return NextResponse.json({ success: false, error: 'Missing required itemId or decision' }, { status: 400 });
    }

    const queue = await intentStore.getApprovalQueue();
    const target = queue.find(i => i.id === itemId);

    if (!target) {
      return NextResponse.json({ success: false, error: 'Approval item not found' }, { status: 404 });
    }

    // 1. Update item status
    const updatedItem: ApprovalQueueItem = {
      ...target,
      status: decision,
      resolutionNote: note || 'Resolved via TRUSTY Human Review Queue',
      resolvedAt: new Date().toISOString(),
      resolvedBy: reviewerEmail || 'Authorized Corporate Reviewer',
    };
    await intentStore.saveApprovalItem(updatedItem);

    // 2. Persist to immutable Decisions log
    const newDecisionRecord: VerifiedDecisionRecord = {
      id: `dec_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString(),
      agentId: target.agentId,
      agentName: target.agentName,
      mandateId: target.mandateId,
      mandateTitle: target.mandateTitle,
      decision: decision === 'APPROVED_EXCEPTION' ? 'HUMAN_REVIEW_RESOLVED' : 'DECLINED',
      amount: target.requestedAmount,
      currency: 'USD',
      rail: target.clearingRail,
      vendor: target.vendor,
      cartHash: target.cartSnapshot.cartHash,
      intentMatchRatio: decision === 'APPROVED_EXCEPTION' ? 0.75 : 0.25,
      executionStatus: decision === 'APPROVED_EXCEPTION' ? 'EXCEPTION_EXECUTED' : 'BLOCKED_PRE_PAYMENT',
      criteria: target.criteriaChecks,
      proofJson: {
        proofId: `proof_${Math.random().toString(36).substring(2, 8)}`,
        interceptId: target.id,
        resolution: decision,
        reviewerNote: note,
        clearingRail: target.clearingRail,
        timestamp: new Date().toISOString(),
      },
    };
    await intentStore.saveDecision(newDecisionRecord);

    return NextResponse.json({
      success: true,
      approvalItem: updatedItem,
      decisionRecord: newDecisionRecord,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
