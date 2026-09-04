import { NextResponse } from 'next/server';
import { runUniversalCrawler } from '@/lib/discovery/crawler';
import { agentStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const crawlResult = await runUniversalCrawler();
    const stats = agentStore.getStats();

    return NextResponse.json({
      success: true,
      message: `Universal crawl completed across GitHub, MCP, and Marketplaces. Discovered/indexed ${crawlResult.discoveredCount} agents.`,
      crawlResult,
      stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Discovery crawl failed' },
      { status: 500 }
    );
  }
}
