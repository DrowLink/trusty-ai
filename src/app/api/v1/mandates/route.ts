import { NextRequest, NextResponse } from 'next/server';
import { intentStore } from '@/lib/storage/intentStore';
import { HumanMandate } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const mandates = await intentStore.getMandates();
    return NextResponse.json({
      success: true,
      count: mandates.length,
      mandates,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.budgetTotal) {
      return NextResponse.json({ success: false, error: 'Missing required mandate fields' }, { status: 400 });
    }

    const newMandate: HumanMandate = {
      id: body.id || `man_${Math.random().toString(36).substring(2, 10)}`,
      title: body.title,
      version: body.version || 'v1.0 (Human Confirmed)',
      status: body.status || 'ACTIVE',
      principalName: body.principalName || 'Operations Lead',
      principalRole: body.principalRole || 'Delegating Authority',
      description: body.description || '',
      createdAt: body.createdAt || new Date().toISOString(),
      expiresAt: body.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      budgetTotal: Number(body.budgetTotal),
      budgetSpent: Number(body.budgetSpent) || 0,
      budgetReserved: Number(body.budgetReserved) || 0,
      currency: body.currency || 'USD',
      clearingRail: body.clearingRail || 'Brex',
      cardIdentifier: body.cardIdentifier || `${body.clearingRail || 'Brex'} Card ****${Math.floor(1000 + Math.random() * 9000)}`,
      itemsConstraint: body.itemsConstraint || {
        category: 'General Hardware & Services',
        allowedBrands: ['Dell', 'Lenovo', 'Apple'],
        maxQuantity: 20,
        specifications: ['16 GB RAM minimum'],
      },
      deliveryAddress: body.deliveryAddress || {
        label: 'Corporate Office',
        street: '801 Brickell Ave, Suite 1400',
        city: 'Miami',
        state: 'FL',
        zip: '33131',
        isCorporateVerified: true,
      },
      allowedVendors: body.allowedVendors || ['Dell Direct B2B', 'Lenovo Corporate'],
      approvers: body.approvers || ['finance-ops@acme.corp'],
      autoApprovalMax: body.autoApprovalMax || Math.round(Number(body.budgetTotal) * 0.25),
    };

    const saved = await intentStore.saveMandate(newMandate);
    return NextResponse.json({ success: true, mandate: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
