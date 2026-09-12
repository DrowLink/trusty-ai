import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Agent workspace', robots: { index: false, follow: false }, alternates: { canonical: '/app' } };
export default function WorkspaceLayout({children}: {children: React.ReactNode}) { return children; }
