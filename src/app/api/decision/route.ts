import { NextRequest, NextResponse } from 'next/server';
import { agentStore } from '@/lib/db/store';
import { evaluateEconomicDecision } from '@/lib/scoring/creditEngine';
import { EconomicActionRequest } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * POST /api/decision
 * Evaluates an economic action in real-time on behalf of a payment network,
 * bank, card issuer (e.g. Brex), or enterprise agent wallet.
 *
 * Example payload:
 * {
 *   "agentId": "procurementbot-847",
 *   "principal": "Acme Corp",
 *   "action": "Purchase",
 *   "amount": 840,
 *   "merchant": "Dell",
 *   "category": "IT equipment",
 *   "requestedLimit": 5000,
 *   "humanApprovalDeclared": false
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      agentId,
      principal = 'Corporate Treasury Principal',
      action = 'Purchase',
      amount,
      merchant = 'Authorized Supplier',
      category = 'General Commercial',
      requestedLimit,
      humanApprovalDeclared = false,
    } = body;

    if (!agentId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: agentId' },
        { status: 400 }
      );
    }

    if (amount === undefined || typeof amount !== 'number' || isNaN(amount)) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid parameter: amount must be a number' },
        { status: 400 }
      );
    }

    await agentStore.hydrate();
    const agent = agentStore.findByIdOrSlug(agentId);

    if (!agent) {
      return NextResponse.json(
        {
          success: false,
          error: `Agent '${agentId}' not found in TRUSTY registry. Thin-file Day-0 underwriting required before live transaction authorization.`,
        },
        { status: 404 }
      );
    }

    const economicRequest: EconomicActionRequest = {
      agentId: agent.id,
      principal,
      action,
      amount,
      merchant,
      category,
      requestedLimit,
      humanApprovalDeclared,
    };

    const decisionResult = evaluateEconomicDecision(economicRequest, agent);

    return NextResponse.json({
      success: true,
      decision: decisionResult,
    });
  } catch (error: any) {
    console.error('Error processing economic decision:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal decision engine error' },
      { status: 500 }
    );
  }
}
