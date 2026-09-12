import Link from 'next/link';
import Image from 'next/image';
import './marketing.css';
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <div className="marketing"><a className="skip-link" href="#content">Skip to content</a>
    <header className="marketing-header"><Link href="/" className="marketing-brand" aria-label="TRUSTY home"><Image src="/isotype.svg" width={35} height={35} alt="" /><span>TRUSTY<span>.bot</span></span></Link>
      <nav aria-label="Main navigation"><Link href="/#product">Product</Link><Link href="/#integrations">Integrations</Link><Link href="/#pilot">Design partners</Link></nav>
      <div className="nav-actions"><Link href="/app?signin=1" className="login-link">Sign in</Link><Link href="/contact" className="marketing-button small">Request a demo</Link></div>
    </header>{children}
    <footer className="marketing-footer"><div><Link href="/" className="marketing-brand">TRUSTY<span>.bot</span></Link><p>Give agents authority.<br />Keep humans in control.</p></div><nav aria-label="Footer"><Link href="/demo">Explore the demo</Link><Link href="/contact">Design partner pilot</Link><Link href="/app">Open application</Link><Link href="/docs">Integration guide</Link></nav><p className="footer-note">Intent authorization for AI agent payments.<br />Brex, Ramp and Slash are referenced platforms, not announced partners.</p></footer>
  </div>;
}
