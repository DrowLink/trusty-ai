'use client';
import { useState } from 'react';
import { Check, ArrowRight, AlertTriangle, Laptop, Download } from 'lucide-react';

const scenarios = [
  { label: 'The right purchase', quantity: 20, ram: 16, delivery: 'Miami office', amount: 18400 },
  { label: 'Extra laptops', quantity: 30, ram: 16, delivery: 'Miami office', amount: 19900 },
  { label: 'Wrong specification', quantity: 20, ram: 8, delivery: 'Miami office', amount: 16200 },
  { label: 'Different delivery', quantity: 20, ram: 16, delivery: 'Unverified address', amount: 18400 },
];

export function IntentDemo({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState(1);
  const cart = scenarios[selected];
  const checks = [
    { name: 'Quantity', expected: '20 laptops', actual: `${cart.quantity} laptops`, passed: cart.quantity === 20 },
    { name: 'Specification', expected: '16 GB RAM minimum', actual: `${cart.ram} GB RAM`, passed: cart.ram >= 16 },
    { name: 'Delivery', expected: 'Miami office', actual: cart.delivery, passed: cart.delivery === 'Miami office' },
    { name: 'Total incl. tax & shipping', expected: 'Up to $20,000', actual: `$${cart.amount.toLocaleString('en-US')}`, passed: cart.amount <= 20000 },
  ];
  const mismatch = checks.find(check => !check.passed);
  function downloadProof() {
    const blob = new Blob([JSON.stringify({ mode: 'illustrative_demo', mandate: '20 Dell or Lenovo laptops, minimum 16 GB RAM, maximum $20,000 including tax and shipping, Miami office.', cart, criteria: checks, decision: mismatch ? 'REQUIRE_HUMAN' : 'APPROVE', execution: 'not_executed' }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'trusty-intent-demo.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className={`intent-demo ${compact ? 'intent-demo-compact' : ''}`}>
    <div className="demo-topline"><span>Purchase review</span><span>Interactive example</span></div>
    <div className="mandate"><span>Your instruction</span><p>“Buy 20 laptops for our new hires. Dell or Lenovo, at least 16 GB RAM. Up to $20,000. Deliver to our Miami office.”</p></div>
    <div className="demo-scenarios" role="group" aria-label="Choose a purchase scenario">{scenarios.map((scenario, index) => <button key={scenario.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{scenario.label}</button>)}</div>
    <div className="cart-summary"><Laptop size={34} aria-hidden="true" /><div><strong>{cart.quantity} Dell Latitude laptops</strong><span>{cart.ram} GB RAM · {cart.delivery}</span></div><strong>${cart.amount.toLocaleString('en-US')}</strong></div>
    <div className="criterion-list">{checks.map(check => <div className="criterion" key={check.name}><span>{check.name}</span><strong>{check.actual}</strong>{check.passed ? <Check size={17} aria-label="Matches mandate" /> : <AlertTriangle size={17} className="mismatch-icon" aria-label="Does not match mandate" />}</div>)}</div>
    <div className={`demo-verdict ${mismatch ? 'review' : 'approved'}`} aria-live="polite" aria-atomic="true"><strong>{mismatch ? 'Human review required' : 'Matches your mandate'}<ArrowRight size={18} aria-hidden="true" /></strong><p>{mismatch ? `${mismatch.name}: expected ${mismatch.expected.toLowerCase()}. The purchase stays within budget, but changes what you authorized.` : 'Quantity, specification, delivery and total match. Financial provider controls still apply before execution.'}</p></div>
    {!compact && <button className="proof-download" onClick={downloadProof}><Download size={16} aria-hidden="true" /> Download example decision record</button>}
    <p className="demo-caption">Illustrative criteria only. No payment is submitted.</p>
  </div>;
}
