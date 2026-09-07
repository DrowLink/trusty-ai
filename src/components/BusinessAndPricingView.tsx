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
  Sparkles,
  HelpCircle,
  Cpu,
  TrendingUp,
  CheckCircle2
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
      tagline: 'Public Acquisition & SEO',
      price: '$0',
      period: 'forever',
      description: 'Public profiles, deterministic 0–100 Trust Score, Google search indexing, and embeddable badges.',
      features: [
        'Public agent security profile',
        'Deterministic 0–100 Trust Score',
        'Open SEO & web crawler discovery',
        'Official TRUSTY embeddable badge',
        'Community vulnerability reporting',
      ],
      cta: 'Explore Public Directory',
      highlighted: false,
      badgeColor: 'text-slate-400 bg-slate-900 border-white/[0.08]',
      btnStyle: 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.08]',
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
      badgeColor: 'text-sky-400 bg-sky-950/60 border-sky-800/60',
      btnStyle: 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.08]',
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
      cta: 'Get API Access',
      highlighted: false,
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
      btnStyle: 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.08]',
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
      badgeColor: 'text-purple-300 bg-purple-950/90 border-purple-700/80',
      btnStyle: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30',
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
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      btnStyle: 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.08]',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 font-sans">
      {/* 1. Header (Slide 7 exact) */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/90 border border-white/[0.08] text-[11px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>TRUSTY.BOT • SLIDE 07 / 10 • BUSINESS MODEL</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans">
          Keep discovery free. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
            Monetize decisions.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans max-w-2xl mx-auto">
          The public layer drives distribution; machine-to-machine risk decisions and enterprise monitoring drive commercial revenue.
        </p>
      </div>

      {/* 2. 5-Tier Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tiers.map(tier => (
          <div
            key={tier.name}
            className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition relative ${
              tier.highlighted
                ? 'bg-gradient-to-b from-[#120d22] to-[#0c1017] border-2 border-purple-500/80 shadow-2xl shadow-purple-950/30'
                : 'bg-[#0c1017] border border-white/[0.08] hover:border-white/[0.18]'
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-sm">
                Fintech Decision Rail
              </div>
            )}

            <div className="space-y-4">
              <div>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase ${tier.badgeColor}`}>
                  {tier.name}
                </span>
                <div className="text-[11px] font-sans text-slate-400 mt-2">
                  {tier.tagline}
                </div>
                <div className="mt-2 flex items-baseline space-x-1">
                  <span className="text-2xl sm:text-3xl font-black font-sans text-white">
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

              <div className="h-px bg-white/[0.06]" />

              <div className="space-y-2 font-sans text-xs">
                {tier.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onSelectTier && onSelectTier(tier.name)}
              className={`w-full mt-6 py-2.5 rounded-xl font-sans text-xs font-bold transition flex items-center justify-center space-x-1 ${tier.btnStyle}`}
            >
              <span>{tier.cta}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        ))}
      </div>

      {/* 3. The Institutional Integrity Pledge (Slide 7 bottom exact) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#071318] via-[#0c161d] to-[#071318] border border-emerald-500/30 space-y-3 shadow-xl">
        <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>INSTITUTIONAL INDEPENDENCE &amp; ETHICAL PLEDGE (SLIDE 07)</span>
        </div>
        <div className="text-lg sm:text-2xl font-bold text-white font-sans">
          &ldquo;Developers can pay TRUSTY to verify evidence — never to buy a better score.&rdquo;
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed font-sans">
          TRUSTY operates under strict rating agency independence. Payment only covers the labor of cryptographic identity checks, DNS verification, and on-demand repository audits. All algorithmic Trust Scores and Credit Tiers remain 100% deterministic and tamper-evident.
        </p>
      </div>

      {/* 4. The Two Monetization Pillars (Lookup vs Decision from ROI Deck) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-3">
          <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs uppercase font-bold">
            <Cpu className="w-4 h-4" />
            <span>Pillar 1: Data Lookup ($0.01 / query)</span>
          </div>
          <h4 className="text-base font-bold text-white font-sans">Passive Information Retrieval</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Marketplaces, developer tools, and workflow agents query TRUSTY during onboarding: &ldquo;What is this agent&rsquo;s score?&rdquo; Low-latency responses in under 20 milliseconds.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c1017] border border-purple-900/40 space-y-3">
          <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs uppercase font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>Pillar 2: Economic Risk Decision (5 bps / $0.25)</span>
          </div>
          <h4 className="text-base font-bold text-white font-sans">Active Financial Settlement Gate</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Card issuers, banks, and enterprise wallets query TRUSTY before money moves: &ldquo;Should this $840 purchase move?&rdquo; Real economic consequence with APPROVE / DECLINE / HUMAN_REVIEW verdicts.
          </p>
        </div>
      </div>
    </div>
  );
};
