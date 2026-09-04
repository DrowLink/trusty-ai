import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TRUSTY.ai — The Independent Trust & Reputation Layer for AI Agents',
  description: 'VirusTotal + Moody\'s + Credit Bureau for Autonomous AI Agents. Automated discovery and explainable TRUSTY Scores across open ecosystems.',
  keywords: ['AI agents', 'Trust score', 'Security', 'MCP', 'CrewAI', 'LangChain', 'Model Context Protocol', 'Agent reputation'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#070a11] text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        {children}
      </body>
    </html>
  );
}
