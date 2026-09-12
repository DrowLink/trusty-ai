import type { Metadata } from 'next';
import Link from 'next/link';
import { IntentDemo } from '@/components/marketing/IntentDemo';
export const metadata: Metadata = { title: 'Explore intent authorization', alternates: { canonical: '/demo' } };
export default function DemoPage() { return <main id="content" className="demo-page"><h1>The budget is only<br />part of the instruction.</h1><p>Switch between purchases to see how quantities, specifications and delivery change the decision.</p><IntentDemo /><Link className="marketing-button" href="/contact">Discuss your workflow</Link></main>; }
