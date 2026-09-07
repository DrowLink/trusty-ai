'use client';

import React, { useState } from 'react';
import { AgentWithScore, EconomicDecisionResult, EconomicActionRequest } from '@/lib/types';
import { 
  Terminal, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Code2, 
  Copy, 
  Check, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Cpu, 
  CreditCard,
  Sparkles,
  RefreshCw,
  Loader2
} from 'lucide-react';

interface DecisionPlaygroundProps {
  agents: AgentWithScore[];
  selectedAgentDefault?: AgentWithScore | null;
}

export const DecisionPlayground: React.FC<DecisionPlaygroundProps> = ({
  agents,
  selectedAgentDefault,
}) => {
  // Preset demo from Slide 5: ProcurementBot-847, Acme Corp, Purchase, $840, Dell, IT equipment
  const initialAgent = selectedAgentDefault || agents.find(a => a.name.toLowerCase().includes('procurement')) || agents[0];

  const [selectedAgentId, setSelectedAgentId] = useState<string>(initialAgent ? initialAgent.id : '');
  const [principal, setPrincipal] = useState<string>('Acme Corp');
  const [action, setAction] = useState<'Purchase' | 'Transfer' | 'Credit_Disbursement'>('Purchase');
  const [amount, setAmount] = useState<number>(840);
  const [merchant, setMerchant] = useState<string>('Dell');
  const [category, setCategory] = useState<string>('IT equipment');
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'typescript' | 'python'>('typescript');
  const [copied, setCopied] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [decisionResult, setDecisionResult] = useState<EconomicDecisionResult | null>(null);

  const currentAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleEvaluate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentAgent) return;

    setIsLoading(true);
    try {
      const payload: EconomicActionRequest = {
        agentId: currentAgent.id,
        principal,
        action,
        amount,
        merchant,
        category,
      };

      const res = await fetch('/api/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.decision) {
        setDecisionResult(data.decision);
      } else {
        alert(data.error || 'Failed to evaluate decision');
      }
    } catch (err: any) {
      alert(`Error querying decision API: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const curlCode = `curl -X POST https://trusty.bot/api/decision \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_live_trusty_rail" \\
  -d '{
    "agentId": "${currentAgent?.slug || 'procurementbot-847'}",
    "principal": "${principal}",
    "action": "${action}",
    "amount": ${amount},
    "merchant": "${merchant}",
    "category": "${category}"
  }'`;

  const tsCode = `import { TrustyDecisionClient } from '@trusty/agent-risk';

const trusty = new TrustyDecisionClient({ apiKey: process.env.TRUSTY_API_KEY });

const decision = await trusty.evaluateTransaction({
  agentId: '${currentAgent?.slug || 'procurementbot-847'}',
  principal: '${principal}',
  action: '${action}',
  amount: ${amount},
  merchant: '${merchant}',
  category: '${category}',
});

if (decision.decision === 'APPROVED') {
  // Release funds autonomously via Visa / Stripe
  await paymentGateway.authorize({ amount: ${amount}, rail: decision.clearingRail });
} else if (decision.decision === 'HUMAN_REVIEW') {
  // Queue dual-custody notification
  await notifyComplianceManager(decision);
}`;

  const pyCode = `import requests

payload = {
    "agentId": "${currentAgent?.slug || 'procurementbot-847'}",
    "principal": "${principal}",
    "action": "${action}",
    "amount": ${amount},
    "merchant": "${merchant}",
    "category": "${category}"
}

response = requests.post(
    "https://trusty.bot/api/decision",
    json=payload,
    headers={"Authorization": "Bearer sk_live_trusty_rail"}
)

data = response.json()
decision = data["decision"]
print(f"Verdict: {decision['decision']} | Rail: {decision['clearingRail']}")`;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 space-y-10 font-sans">
      {/* HEADER & FLYWHEEL CONTEXT (Slide 5 of Pitch) */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-purple-950/40 border border-purple-800/50 text-[11px] font-mono text-purple-300 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span>TRUSTY.BOT • THE DATA FLYWHEEL</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">LIVE M2M DECISION ENGINE</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
          Every real transaction makes <span className="text-purple-400">TRUSTY harder to replicate</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Banks, payment networks, wallets, issuers, and enterprises send economic actions and outcomes to the TRUSTY.BOT API in the live settlement path.
        </p>

        {/* Integration Rails Strip (Slide 5 Header Pill) */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="text-slate-400 uppercase tracking-widest text-[10px] mr-1">CONNECTED RAILS:</span>
          {['STRIPE', 'VISA', 'MASTERCARD', 'BREX', 'COMMERCIAL BANK', 'AGENT WALLET', 'ENTERPRISE TREASURY'].map(rail => (
            <span key={rail} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
              {rail}
            </span>
          ))}
        </div>
      </div>

      {/* INTERACTIVE WORKBENCH: FORM ON LEFT, DECISION RESULT & CODE ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Request Configuration (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-800 dark:text-slate-300 flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-[#0066FF] dark:text-sky-400" />
                <span>SIMULATE ECONOMIC ACTION</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">POST /api/decision</span>
            </div>

            <form onSubmit={handleEvaluate} className="space-y-4 text-xs font-mono">
              {/* Agent Selector */}
              <div>
                <label className="text-slate-500 dark:text-slate-400 block mb-1 uppercase text-[10px]">
                  SELECT AGENT UNDER DECISION
                </label>
                <select
                  value={selectedAgentId}
                  onChange={e => setSelectedAgentId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-sky-500 focus:outline-none"
                >
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} (Trust: {a.evaluation.trustyScore} | Credit: {a.creditProfile.creditScore} • Tier {a.creditProfile.creditTier})
                    </option>
                  ))}
                </select>
                {currentAgent && (
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Daily Limit: ${currentAgent.creditProfile.estimatedDailyCapacity.toLocaleString()}/d</span>
                    <span>Approval Gate: &gt;${currentAgent.creditProfile.humanApprovalThreshold.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Principal */}
              <div>
                <label className="text-slate-500 dark:text-slate-400 block mb-1 uppercase text-[10px]">
                  PRINCIPAL / ENTERPRISE ENTITY
                </label>
                <input
                  type="text"
                  value={principal}
                  onChange={e => setPrincipal(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* Action */}
              <div>
                <label className="text-slate-500 dark:text-slate-400 block mb-1 uppercase text-[10px]">
                  ECONOMIC ACTION TYPE
                </label>
                <select
                  value={action}
                  onChange={e => setAction(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-sky-500 focus:outline-none"
                >
                  <option value="Purchase">Purchase (Commercial Merchant)</option>
                  <option value="Transfer">Transfer (Machine-to-Machine Wire)</option>
                  <option value="Credit_Disbursement">Credit Disbursement</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                    AMOUNT (USD)
                  </label>
                  <div className="space-x-1">
                    {[100, 840, 5200, 30000].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-[9px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent"
                      >
                        ${val.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded pl-7 pr-3 py-2 text-slate-900 dark:text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Merchant */}
              <div>
                <label className="text-slate-500 dark:text-slate-400 block mb-1 uppercase text-[10px]">
                  COUNTERPARTY / MERCHANT
                </label>
                <input
                  type="text"
                  value={merchant}
                  onChange={e => setMerchant(e.target.value)}
                  placeholder="e.g. Dell, AWS, GitHub"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-slate-500 dark:text-slate-400 block mb-1 uppercase text-[10px]">
                  EXPENSE CATEGORY
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  placeholder="e.g. IT equipment, Cloud SaaS"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-slate-900 dark:text-white font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-3 rounded bg-[#0066FF] hover:bg-blue-600 dark:bg-purple-600 dark:hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs font-mono transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/10 dark:shadow-purple-900/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>EVALUATING MACHINE GATE...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>EXECUTE TRUSTY DECISION</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Info box */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1 leading-relaxed shadow-sm">
            <div className="text-slate-800 dark:text-slate-300 font-bold uppercase text-[10px]">Machine-Speed SLA</div>
            <p>
              Average risk evaluation latency: <strong className="text-emerald-600 dark:text-emerald-400">18ms</strong>. Runs synchronous policy checks against deterministic 20-signal AST telemetry and credit capacity envelopes.
            </p>
          </div>
        </div>

        {/* Right Col: Live Decision Output & Integration Code (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* DECISION VERDICT CARD (Slide 5 Reproduction) */}
          <div className="rounded-xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 p-6 space-y-6 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-800 dark:text-slate-300 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>DECISION ENGINE RESPONSE</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {decisionResult ? 'Live Evaluated' : 'Awaiting Simulation'}
              </span>
            </div>

            {decisionResult ? (
              <div className="space-y-6">
                {/* BIG VERDICT PILL */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  decisionResult.decision === 'APPROVED'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-500/60 dark:text-emerald-300'
                    : decisionResult.decision === 'HUMAN_REVIEW'
                    ? 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/40 dark:border-amber-500/60 dark:text-amber-300'
                    : 'bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/40 dark:border-rose-500/60 dark:text-rose-300'
                }`}>
                  <div className="flex items-center space-x-3">
                    {decisionResult.decision === 'APPROVED' ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    ) : decisionResult.decision === 'HUMAN_REVIEW' ? (
                      <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                    )}
                    <div>
                      <div className="text-xl font-black font-mono tracking-tight">
                        {decisionResult.decision}
                      </div>
                      <div className="text-xs font-mono opacity-90 mt-0.5">
                        {decisionResult.clearingRail}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono self-end sm:self-auto">
                    <div className="text-lg font-bold tabular-nums">
                      ${decisionResult.amount.toLocaleString()} USD
                    </div>
                    <div className="text-[10px] opacity-75">
                      {decisionResult.category}
                    </div>
                  </div>
                </div>

                {/* Behavioral Outcome Note (Slide 5 verbatim) */}
                <div className="p-4 rounded-lg bg-sky-50 dark:bg-[#060c14] border border-sky-200 dark:border-sky-900/40 space-y-1 font-mono text-xs">
                  <div className="text-sky-800 dark:text-sky-300 font-bold flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Outcome becomes proprietary behavioral credit data.</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    {decisionResult.reason}
                  </p>
                  <div className="text-[10px] text-[#0066FF] dark:text-sky-400 pt-1 font-semibold">
                    Trust + transaction context + history &rarr; better credit decisions over time
                  </div>
                </div>

                {/* Policy Checks Detail Table */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">
                    POLICY CIRCUIT BREAKERS EVALUATED
                  </div>
                  <div className="space-y-1.5">
                    {decisionResult.policyChecks.map((check, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 flex items-start justify-between gap-3 text-xs font-mono"
                      >
                        <div className="flex items-start space-x-2">
                          {check.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                          ) : check.severity === 'warning' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                          )}
                          <div>
                            <span className="text-slate-900 dark:text-slate-200 font-bold">{check.rule}: </span>
                            <span className="text-slate-600 dark:text-slate-400">{check.detail}</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded flex-shrink-0 border ${
                          check.passed
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-transparent'
                            : check.severity === 'warning'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-transparent'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-transparent'
                        }`}>
                          {check.passed ? 'PASSED' : check.severity.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 font-mono text-xs space-y-3">
                <CreditCard className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-600 opacity-60" />
                <p>Click &ldquo;Execute Trusty Decision&rdquo; on the left to simulate live risk authorization.</p>
              </div>
            )}
          </div>

          {/* CODE INTEGRATION SNIPPET (Tabs: TypeScript, cURL, Python) */}
          <div className="rounded-xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <Code2 className="w-3.5 h-3.5 text-[#0066FF] dark:text-purple-400" />
                <span className="text-slate-700 dark:text-slate-400 font-bold uppercase">SDK Snippet:</span>
                {(['typescript', 'curl', 'python'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveCodeTab(tab)}
                    className={`px-2 py-0.5 rounded text-[11px] transition ${
                      activeCodeTab === tab
                        ? 'bg-white text-slate-900 font-bold shadow-sm dark:bg-slate-800 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  const code = activeCodeTab === 'typescript' ? tsCode : activeCodeTab === 'curl' ? curlCode : pyCode;
                  handleCopyCode(code);
                }}
                className="flex items-center space-x-1 text-[11px] font-mono text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            <pre className="p-4 text-xs font-mono text-slate-800 dark:text-slate-300 overflow-x-auto bg-slate-50 dark:bg-[#06080e] leading-relaxed">
              <code>{activeCodeTab === 'typescript' ? tsCode : activeCodeTab === 'curl' ? curlCode : pyCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
