import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#070a11' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://trusty-ai.vercel.app'),
  title: {
    default: 'TRUSTY.bot™ — The Trust & Credit Bureau for AI Agents',
    template: '%s | TRUSTY.bot',
  },
  description:
    'The independent trust, reputation, and credit underwriting layer for autonomous AI agents. Deterministic 20-signal scoring, Day-Zero public underwriting, and real-time machine-to-machine clearing for payment rails (Visa, Stripe, Brex).',
  applicationName: 'TRUSTY.bot',
  authors: [{ name: 'TRUSTY.bot Founding Team', url: 'https://trusty-ai.vercel.app' }],
  creator: 'TRUSTY.bot',
  publisher: 'TRUSTY.bot',
  keywords: [
    'AI agents',
    'Trust score',
    'Agent Credit Bureau',
    'Agentic Volume Under Decision',
    'AVUD',
    'Model Context Protocol',
    'MCP Security',
    'CrewAI',
    'LangChain',
    'Day-Zero Underwriting',
    'Autonomous Payments',
    'Brex AI agents',
    'Stripe AgentKit',
    'Visa AI payments',
    'AI agent security audit',
    'Behavioral Credit File',
  ],
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: [
      { url: '/icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'TRUSTY.bot™ — The Trust & Credit Bureau for AI Agents',
    description:
      'Trust Powers Agents. Before an agent gets your data, permissions, or money — ask TRUSTY. Continuous discovery, Day-Zero underwriting, and real-time transaction clearing for autonomous finance.',
    url: 'https://trusty-ai.vercel.app',
    siteName: 'TRUSTY.bot',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'TRUSTY.bot Logo - Trust Powers Agents',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TRUSTY.bot™ — The Trust & Credit Bureau for AI Agents',
    description:
      'Independent trust, reputation, and credit underwriting for autonomous AI agents. Evaluate permissions, compute daily spending limits, and clear transactions in real time.',
    site: '@trustybot',
    creator: '@trustybot',
    images: ['/icon.png'],
  },
  alternates: {
    canonical: 'https://trusty-ai.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured JSON-LD Data for SEO & AEO (Answer Engine Optimization for ChatGPT, Perplexity, Claude, Google)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://trusty-ai.vercel.app/#organization',
        name: 'TRUSTY.bot',
        url: 'https://trusty-ai.vercel.app',
        logo: 'https://trusty-ai.vercel.app/trusty-logo.png',
        image: 'https://trusty-ai.vercel.app/trusty-logo.png',
        slogan: 'Trust Powers Agents',
        description: 'The independent trust, reputation, and credit underwriting layer for autonomous AI agents.',
        sameAs: ['https://github.com/DrowLink/trusty-ai'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://trusty-ai.vercel.app/#website',
        url: 'https://trusty-ai.vercel.app',
        name: 'TRUSTY.bot',
        description: 'AI Agent Trust & Credit Bureau Directory',
        publisher: { '@id': 'https://trusty-ai.vercel.app/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://trusty-ai.vercel.app/?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://trusty-ai.vercel.app/#software',
        name: 'TRUSTY.bot Risk & Decision Gateway',
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'Cloud / Serverless / REST API',
        image: 'https://trusty-ai.vercel.app/trusty-logo.png',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: 'Free public directory & Trust Scores',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://trusty-ai.vercel.app/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is TRUSTY.bot?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'TRUSTY.bot is the independent trust and credit bureau for autonomous AI agents — functioning as the VirusTotal + Moody’s + credit bureau for the agentic web. It evaluates cybersecurity risk across 20 deterministic signals and underwrites risk-adjusted daily spending limits for autonomous agents transacting on payment rails like Visa, Stripe, and Brex.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the difference between an AI Agent Trust Score and a Credit Score?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The Trust Score (0–100) measures cybersecurity posture, least-privilege permissions, prompt-injection resilience, and identity provenance. The Credit Score (0–100, categorized into Tiers AAA through D) measures economic authority, establishing recommended daily spending capacity ($/day), single-transaction autonomous ceilings, and dual-custody human approval thresholds.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does Day-Zero underwriting work for AI agents?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Day-Zero underwriting scores an AI agent before it ever executes a live transaction using 12 verifiable public internet evidence signals (publisher identity, domain age, GitHub commit cadence, release stability, dependency CVEs, declared permission sensitivity, malware reports, code incidents, human approval controls, audit logging, marketplace reputation, and active usage instances).',
            },
          },
          {
            '@type': 'Question',
            name: 'What is Agentic Volume Under Decision (AVUD)?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'AVUD (Agentic Volume Under Decision) represents the cumulative gross dollar volume of autonomous agent transactions evaluated and cleared in real time through the TRUSTY.bot machine-to-machine decision API (POST /api/decision). It is the north-star metric measuring the scale of economic value protected.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do payment networks like Visa, Brex, and Stripe integrate with TRUSTY.bot?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Card issuers, wallets, and banks send incoming economic actions (Purchase, Transfer, Key Exchange) to POST /api/decision in sub-30ms. TRUSTY evaluates 5 automated policy gates (Security Hard Gate, Amount Validation, Velocity Limit, Single Autonomous Ceiling, and Human Approval Enforcement) and returns APPROVED, DECLINED, or HUMAN_REVIEW verdicts before funds settle.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can an AI agent or developer pay to buy a higher score on TRUSTY.bot?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Under TRUSTY.bot’s institutional integrity pledge, developers can pay TRUSTY to verify evidence (identity checks, domain DNS verification, cryptographic attestation) — never to alter, buy, or artificially boost an algorithmic score. All evaluations are deterministic and evidence-backed.',
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col font-sans antialiased selection:bg-blue-500/20 selection:text-[#0066FF] transition-colors duration-200`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
