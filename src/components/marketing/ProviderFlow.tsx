'use client';
import { useState } from 'react';
import { ArrowDown, Check } from 'lucide-react';
export function ProviderFlow() {
  const [multiple, setMultiple] = useState(false);
  return <div className="provider-flow">
    <div className="provider-switch" role="group" aria-label="Financial platform setup"><button aria-pressed={!multiple} onClick={() => setMultiple(false)}>One platform</button><button aria-pressed={multiple} onClick={() => setMultiple(true)}>Multiple platforms</button></div>
    <div className="flow-person">Your team’s instruction <span>Prepare a purchase</span></div><ArrowDown aria-hidden="true" />
    <div className="flow-trusty"><strong>TRUSTY<span>.bot</span></strong><span><Check size={16} aria-hidden="true" /> Verify the mandate</span></div><ArrowDown aria-hidden="true" />
    <div className="flow-providers" aria-live="polite"><span>Brex</span>{multiple && <span>Ramp</span>}</div>
    <p>{multiple ? 'One mandate, consistent intent checks across your selected workflows.' : 'Start with your existing Brex workflow. One provider is enough.'}</p>
    <small>Illustrated setup. Connectors are planned; pilot access depends on the workflow.</small>
  </div>;
}
