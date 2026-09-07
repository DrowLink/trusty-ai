'use client';

import React from 'react';
import { 
  Check, 
  ShieldCheck, 
  Layers, 
  Zap, 
  Lock, 
  Building2, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface BusinessAndPricingViewProps {
  onSelectTier?: (tier: string) => void;
}

export const BusinessAndPricingView: React.FC<BusinessAndPricingViewProps> = ({
  onSelectTier,
}) => {
  const tiers = [
    {
      name: 'FREE',
      tagline: 'Acquisition & Distribution',
      price: '$0',
      period: 'forever',
      description: 'Public profiles, deterministic 0–100 Trust Score, search engine indexing, and embeddable badges.',
      features: [
        'Public agent security profile',
        'Deterministic 0–100 Trust Score',
        'Open SEO & web crawler discovery',
        'Official TRUSTY embeddable badge',
        'Community vulnerability reporting',
      ],
      cta: 'Explore Public Directory',
      highlighted: false,
      badgeColor: 'text-slate-400 bg-slate-800',
    },
    {
      name: 'VERIFIED',
      tagline: 'Developer SaaS',
      price: '$199',
      period: '/ agent / year',
      description: 'Cryptographic developer identity, commercial domain ownership, and repository proof-of-custody.',
      features: [
        'Everything in Free',
        'DNS TXT record verification',
        'Cryptographic repo signer check',
        'Priority Day-0 underwriting refresh',
        'Verified Publisher green checkmark',
        'Fast-track dispute arbitration',
      ],
      cta: 'Verify My Agent',
      highlighted: false,
      badgeColor: 'text-sky-400 bg-sky-950/80 border-sky-800',
    },
    {
      name: 'API',
      tagline: 'Usage Revenue',
      price: '$0.01+',
      period: '/ lookup',
      description: 'Trust, credit, and risk metadata at machine speed for autonomous workflow orchestrators.',
      features: [
        'Everything in Verified',
        'Low-latency read endpoints (<20ms)',
        'Bulk agent vulnerability checks',
        'Automated drift & compromise alerts',
        'REST & Model Context Protocol (MCP) endpoints',
      ],
      cta: 'Get API Key',
      highlighted: false,
      badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-800',
    },
    {
      name: 'DECISION',
      tagline: 'Fintech & Issuers',
      price: '$0.10–$1',
      period: '/ authorization',
      description: 'Capacity and real-time transaction-level approve / review / block decisions in the live settlement path.',
      features: [
        'Direct settlement path integration',
        'APPROVE / DECLINE / REVIEW verdicts',
        'Dynamic capacity limit calculation',
        'Dual-custody human routing gates',
        'Proprietary behavioral credit file writes',
        'Brex, Stripe, & Visa network support',
      ],
      cta: 'Connect Decision Rail',
      highlighted: true,
      badgeColor: 'text-purple-300 bg-purple-950 border-purple-700',
    },
    {
      name: 'ENTERPRISE',
      tagline: 'Enterprise ARR',
      price: '$25K–$500K+',
      period: '/ year',
      description: 'Full portfolio monitoring, organization policy enforcement, custom risk rules, and dedicated rails.',
      features: [
        'Unlimited portfolio monitoring',
        'Custom risk tolerance & rule engines',
        'Private VPC / on-premise deployments',
        'Dedicated compliance officer support',
        'Custom banking & corporate card rails',
        '99.99% Enterprise uptime SLA',
      ],
      cta: 'Contact Institutional Sales',
      highlighted: false,
      badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      {/* HEADER (Slide 7 exact) */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>TRUSTY.BOT • BUSINESS MODEL & INSTITUTIONAL PRICING</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
          Keep discovery free. <span className="text-emerald-400">Monetize decisions.</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          The public layer drives distribution; machine-to-machine risk decisions and enterprise monitoring drive commercial revenue.
        </p>
      </div>

      {/* 5-TIER PRICING GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tiers.map(tier => (
          <div
            key={tier.name}
            className={`rounded-xl p-5 flex flex-col justify-between transition relative ${
              tier.highlighted
                ? 'bg-[#0e0c1a] border-2 border-purple-500/80 shadow-xl shadow-purple-950/30'
                : 'bg-[#090d16] border border-slate-800 hover:border-slate-700'
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                Fintech Engine
              </div>
            )}

            <div className="space-y-4">
              <div>
                <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase ${tier.badgeColor}`}>
                  {tier.name}
                </span>
                <div className="text-[11px] font-mono text-slate-400 mt-2">
                  {tier.tagline}
                </div>
                <div className="mt-2 flex items-baseline space-x-1">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                    {tier.price}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {tier.period}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans min-h-[48px]">
                {tier.description}
              </p>

              <div className="h-px bg-slate-800/80" />

              <div className="space-y-2 font-mono text-[11px]">
                {tier.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onSelectTier && onSelectTier(tier.name)}
              className={`w-full mt-6 py-2.5 rounded font-mono text-xs font-bold transition ${
                tier.highlighted
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-900/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      {/* THE INSTITUTIONAL INTEGRITY PLEDGE (Slide 7 bottom exact) */}
      <div className="p-6 rounded-xl bg-[#091217] border border-emerald-500/40 space-y-2">
        <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>INSTITUTIONAL INDEPENDENCE & ETHICAL PLEDGE</span>
        </div>
        <div className="text-lg sm:text-xl font-bold text-white font-sans">
          &ldquo;Developers can pay TRUSTY to verify evidence — never to buy a better score.&rdquo;
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          TRUSTY operates under strict credit-rating independence modeled after financial rating agencies. Payment only accelerates cryptographic identity auditing and on-demand verification of public artifacts. All algorithmic scores are strictly deterministic.
        </p>
      </div>
    </div>
  );
};
