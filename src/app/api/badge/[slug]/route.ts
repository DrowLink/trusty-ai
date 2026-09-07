import { NextRequest, NextResponse } from 'next/server';
import { agentStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  await agentStore.hydrate();
  const agent = agentStore.findByIdOrSlug(slug);

  const trustScore = agent ? agent.evaluation.trustyScore : 75;
  const creditScore = agent ? agent.creditProfile.creditScore : 70;
  const agentName = agent ? agent.name : slug;

  const trustColor = trustScore >= 80 ? '#10b981' : trustScore >= 60 ? '#f59e0b' : '#f43f5e';
  const creditColor = creditScore >= 80 ? '#c084fc' : creditScore >= 60 ? '#a855f7' : '#ef4444';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="340" height="28" viewBox="0 0 340 28" role="img" aria-label="TRUSTY.BOT verified agent">
  <defs>
    <linearGradient id="b" x2="0" y2="100%">
      <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
      <stop offset="1" stop-opacity=".1"/>
    </linearGradient>
    <clipPath id="a">
      <rect width="340" height="28" rx="4"/>
    </clipPath>
  </defs>
  <g clip-path="url(#a)">
    <rect width="90" height="28" fill="#090d16"/>
    <rect x="90" width="125" height="28" fill="#042f2e"/>
    <rect x="215" width="125" height="28" fill="#2e1065"/>
    <rect width="340" height="28" fill="url(#b)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace" font-size="11" font-weight="700">
    <text x="45" y="18" fill="#38bdf8" letter-spacing="1">TRUSTY</text>
    <text x="152" y="18" fill="${trustColor}">TRUST: ${trustScore}/100</text>
    <text x="277" y="18" fill="${creditColor}">CREDIT: ${creditScore}/100</text>
  </g>
</svg>
`.trim();

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=600',
    },
  });
}
