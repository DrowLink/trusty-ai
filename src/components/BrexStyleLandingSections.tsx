'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  CheckCircle2, 
  Plane, 
  FileText, 
  TrendingUp, 
  ArrowRight,
  Zap,
  Lock,
  Layers,
  Building2,
  Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';

export interface BrexSectionsCustomImages {
  card1_corporateCards?: string;
  card2_expenseManagement?: string;
  card3_travelEnvelopes?: string;
  card4_billPay?: string;
  card5_bankingTreasury?: string;
}

interface BrexStyleLandingSectionsProps {
  customImages?: BrexSectionsCustomImages;
  onSelectProduct?: (tab: string) => void;
  onAuditAgent?: () => void;
}

export const BrexStyleLandingSections: React.FC<BrexStyleLandingSectionsProps> = ({
  customImages = {},
  onSelectProduct,
  onAuditAgent,
}) => {
  return (
    <section className="w-full bg-[#f8fafc] dark:bg-[#070b14] py-16 sm:py-24 border-t border-slate-200/80 dark:border-white/[0.06] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================== */}
        {/* HEADER SECTION: "The card is just the start." (FOTO 2)     */}
        {/* ========================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <h2 className="font-display text-3xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-slate-950 dark:text-white leading-[1.1] mb-4 sm:mb-5">
            The card is just the start.
          </h2>
          <p className="font-sans text-base sm:text-xl text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Everything you need to boost spending power and control — and eliminate manual work for autonomous AI agents.
          </p>
        </div>

        {/* ========================================================== */}
        {/* STACK OF BENTO CARDS (ORDEN EXACTO DE LAS FOTOS DE BREX)   */}
        {/* ========================================================== */}
        <div className="space-y-8 sm:space-y-12">
          
          {/* -------------------------------------------------------- */}
          {/* CARD 1: Corporate cards / Autonomous agent cards (FOTO 2/3) */}
          {/* -------------------------------------------------------- */}
          <div className="group rounded-3xl bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-white/[0.08] shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-10 lg:p-12 overflow-hidden flex flex-col justify-between">
            <div className="max-w-xl mb-8 sm:mb-12">
              <h3 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white mb-3">
                Corporate cards for AI agents
              </h3>
              <p className="font-sans text-sm sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Spend smart globally with programmatic cards, hard velocity limits, and continuous credit underwriting.
              </p>
            </div>

            {/* Visual / Image Slot */}
            <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-white/[0.03] dark:to-white/[0.01] border border-slate-200/80 dark:border-white/[0.06] p-6 sm:p-10 flex items-center justify-center min-h-[260px] sm:min-h-[340px] overflow-hidden">
              {customImages.card1_corporateCards ? (
                <div className="relative w-full h-64 sm:h-80">
                  <Image 
                    src={customImages.card1_corporateCards} 
                    alt="Autonomous agent cards" 
                    fill 
                    className="object-contain" 
                  />
                </div>
              ) : (
                /* High-fidelity Vector Render of Brex/TRUSTY metallic agent cards */
                <div className="relative w-full max-w-md h-56 sm:h-72 flex items-center justify-center select-none">
                  {/* Background Card (Dark Titanium with subtle red/amber edge) */}
                  <div className="absolute w-56 sm:w-72 h-36 sm:h-44 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-black p-4 sm:p-5 shadow-2xl border border-white/10 transform -rotate-12 -translate-x-6 sm:-translate-x-10 -translate-y-2 transition-transform duration-300 group-hover:-rotate-10">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-5 h-5 rounded-md bg-blue-600/30 flex items-center justify-center border border-blue-400/40">
                          <Zap className="w-3 h-3 text-sky-400" />
                        </div>
                        <span className="font-display text-xs sm:text-sm font-bold tracking-tight text-white">TRUSTY</span>
                      </div>
                      <div className="flex -space-x-1.5">
                        <div className="w-5 h-5 rounded-full bg-slate-400/40 border border-white/20" />
                        <div className="w-5 h-5 rounded-full bg-slate-200/50 border border-white/20" />
                      </div>
                    </div>
                    <div className="mt-8 sm:mt-12 flex justify-between items-end">
                      <div>
                        <div className="text-[9px] sm:text-[10px] font-mono text-slate-400">AGENT LIMIT</div>
                        <div className="text-xs sm:text-sm font-bold text-white font-mono">$50,000 / DAY</div>
                      </div>
                      <span className="text-[10px] font-mono text-sky-400 font-semibold">Tier AAA</span>
                    </div>
                  </div>

                  {/* Foreground Card (Hero Matte Black with TRUSTY Blue Accent & Chip) */}
                  <div className="relative w-60 sm:w-80 h-38 sm:h-48 rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a0f1d] p-4 sm:p-5 shadow-2xl border border-sky-500/30 transform rotate-6 translate-x-4 sm:translate-x-6 translate-y-3 transition-transform duration-300 group-hover:rotate-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0066FF] to-sky-400 flex items-center justify-center shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="font-display text-sm sm:text-base font-black tracking-tight text-white">TRUSTY<span className="text-sky-400">.bot</span></span>
                      </div>
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-rose-500/80" />
                        <div className="w-6 h-6 rounded-full bg-amber-400/80" />
                      </div>
                    </div>

                    {/* Chip Graphic */}
                    <div className="mt-3 sm:mt-4 w-8 h-6 rounded-md bg-gradient-to-br from-amber-200 to-amber-400/80 border border-amber-500/40 opacity-85" />

                    <div className="mt-4 sm:mt-6 flex justify-between items-end">
                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Autonomous Procurement</div>
                        <div className="text-xs sm:text-sm font-mono tracking-widest text-slate-100 font-bold">•••• 8470</div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">
                          SUB-14MS RAIL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Resolution Spec Badge for User */}
              <div className="absolute bottom-2.5 right-3 px-2 py-1 rounded bg-slate-900/80 dark:bg-black/80 text-[10px] font-mono text-slate-300 backdrop-blur-sm border border-white/10 flex items-center space-x-1.5 opacity-60 hover:opacity-100 transition-opacity">
                <ImageIcon className="w-3 h-3 text-sky-400" />
                <span>IMG-CARD-01 · 800×600 px (4:3)</span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* CARD 2: Expense management / Real-time clearing (FOTO 3)  */}
          {/* -------------------------------------------------------- */}
          <div className="group rounded-3xl bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-white/[0.08] shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-10 lg:p-12 overflow-hidden flex flex-col justify-between">
            <div className="max-w-xl mb-8 sm:mb-12">
              <h3 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white mb-3">
                Expense &amp; spend management
              </h3>
              <p className="font-sans text-sm sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Use AI to automate transaction approvals and expense reports across 5 deterministic policy gates. Track in real time.
              </p>
            </div>

            {/* Visual / Image Slot */}
            <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-white/[0.03] dark:to-white/[0.01] border border-slate-200/80 dark:border-white/[0.06] p-6 sm:p-10 flex items-center justify-center min-h-[260px] sm:min-h-[340px] overflow-hidden">
              {customImages.card2_expenseManagement ? (
                <div className="relative w-full h-64 sm:h-80">
                  <Image 
                    src={customImages.card2_expenseManagement} 
                    alt="Spend management" 
                    fill 
                    className="object-contain" 
                  />
                </div>
              ) : (
                /* Interactive Transaction Stream matching Foto 3 exactly */
                <div className="w-full max-w-md space-y-3 sm:space-y-4">
                  {/* Transaction 1: JetBlue Airlines */}
                  <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex items-center justify-between transition-transform duration-200 hover:scale-[1.01]">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#00205b] text-white flex items-center justify-center font-bold text-xs sm:text-sm tracking-tighter">
                        jet
                      </div>
                      <div>
                        <div className="font-sans font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          JetBlue Airlines
                        </div>
                        <div className="font-sans text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">
                          TRAVEL · $840.00
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#ff5100] text-white text-xs font-semibold shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approved</span>
                    </div>
                  </div>

                  {/* Transaction 2: Google Cloud */}
                  <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex items-center justify-between transition-transform duration-200 hover:scale-[1.01]">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 dark:bg-white/[0.08] p-2 flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-sans font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          Google Cloud Platform
                        </div>
                        <div className="font-sans text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">
                          SOFTWARE · $1,250.00
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#ff5100] text-white text-xs font-semibold shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approved</span>
                    </div>
                  </div>

                  {/* Transaction 3: Anthropic API */}
                  <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex items-center justify-between transition-transform duration-200 hover:scale-[1.01]">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#cc785c]/15 text-[#cc785c] flex items-center justify-center font-bold text-xs sm:text-sm">
                        \A/
                      </div>
                      <div>
                        <div className="font-sans font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          Anthropic Claude API
                        </div>
                        <div className="font-sans text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">
                          INFERENCE · $340.00
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#0066FF] text-white text-xs font-semibold shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approved</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Resolution Spec Badge for User */}
              <div className="absolute bottom-2.5 right-3 px-2 py-1 rounded bg-slate-900/80 dark:bg-black/80 text-[10px] font-mono text-slate-300 backdrop-blur-sm border border-white/10 flex items-center space-x-1.5 opacity-60 hover:opacity-100 transition-opacity">
                <ImageIcon className="w-3 h-3 text-sky-400" />
                <span>IMG-CARD-02 · 800×500 px (16:10)</span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* CARD 3: Travel / Agent policy envelopes (FOTO 4)         */}
          {/* -------------------------------------------------------- */}
          <div className="group rounded-3xl bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-white/[0.08] shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-10 lg:p-12 overflow-hidden flex flex-col justify-between">
            <div className="max-w-xl mb-8 sm:mb-12">
              <h3 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white mb-3">
                Agent policy envelopes &amp; travel
              </h3>
              <p className="font-sans text-sm sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Simplify global agent transactions with in-flight merchant whitelists, budget ceilings, and automated approvals.
              </p>
            </div>

            {/* Visual / Image Slot */}
            <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-white/[0.03] dark:to-white/[0.01] border border-slate-200/80 dark:border-white/[0.06] p-6 sm:p-10 flex items-center justify-center min-h-[260px] sm:min-h-[320px] overflow-hidden">
              {customImages.card3_travelEnvelopes ? (
                <div className="relative w-full h-64 sm:h-80">
                  <Image 
                    src={customImages.card3_travelEnvelopes} 
                    alt="Travel & reservation" 
                    fill 
                    className="object-contain" 
                  />
                </div>
              ) : (
                /* Reservation Widget matching Foto 4 */
                <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
                  <div className="flex items-center justify-between mb-8 sm:mb-10">
                    <div className="font-sans font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                      Reservation
                    </div>
                    <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#ff5100] text-white text-xs font-bold shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Booked</span>
                    </div>
                  </div>

                  {/* Route Track: PHX to AUS */}
                  <div className="flex items-center justify-between relative px-2">
                    <div>
                      <div className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white">PHX</div>
                      <div className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider">Phoenix</div>
                    </div>

                    <div className="flex-1 mx-4 sm:mx-6 flex items-center justify-center relative">
                      <div className="w-full h-0.5 bg-[#ff5100] relative">
                        <div className="absolute -top-1 left-0 w-2.5 h-2.5 rounded-full bg-[#ff5100]" />
                        <div className="absolute -top-1 right-0 w-2.5 h-2.5 rounded-full bg-[#ff5100]" />
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white">AUS</div>
                      <div className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider">Austin</div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-sans">
                    <span>Autonomous conference assistant</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">$384.50 within cap</span>
                  </div>
                </div>
              )}

              {/* Resolution Spec Badge for User */}
              <div className="absolute bottom-2.5 right-3 px-2 py-1 rounded bg-slate-900/80 dark:bg-black/80 text-[10px] font-mono text-slate-300 backdrop-blur-sm border border-white/10 flex items-center space-x-1.5 opacity-60 hover:opacity-100 transition-opacity">
                <ImageIcon className="w-3 h-3 text-sky-400" />
                <span>IMG-CARD-03 · 800×500 px (16:10)</span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* CARD 4: Bill pay / Autonomous settlement (FOTO 4)        */}
          {/* -------------------------------------------------------- */}
          <div className="group rounded-3xl bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-white/[0.08] shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-10 lg:p-12 overflow-hidden flex flex-col justify-between">
            <div className="max-w-xl mb-8 sm:mb-12">
              <h3 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white mb-3">
                Autonomous bill pay &amp; invoicing
              </h3>
              <p className="font-sans text-sm sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Save time with AI-powered invoice entry, 3-way reconciliation, and payment automation on Visa and Stripe rails.
              </p>
            </div>

            {/* Visual / Image Slot */}
            <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-white/[0.03] dark:to-white/[0.01] border border-slate-200/80 dark:border-white/[0.06] p-6 sm:p-10 flex items-center justify-center min-h-[260px] sm:min-h-[320px] overflow-hidden">
              {customImages.card4_billPay ? (
                <div className="relative w-full h-64 sm:h-80">
                  <Image 
                    src={customImages.card4_billPay} 
                    alt="Autonomous bill pay" 
                    fill 
                    className="object-contain" 
                  />
                </div>
              ) : (
                /* Invoice Reconciliation Widget matching Foto 4 */
                <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Vendor Invoice</div>
                      <div className="font-display font-bold text-slate-900 dark:text-white text-base">Scale AI Datasets Inc.</div>
                    </div>
                    <span className="font-mono text-base font-extrabold text-slate-950 dark:text-white">$14,850.00</span>
                  </div>

                  <div className="space-y-2 text-xs font-sans">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>PO Line Item Matching</span>
                      </span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">100% Match</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Prompt Injection &amp; Phishing Gate</span>
                      </span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Clean (0 threats)</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-sans font-bold text-xs flex items-center justify-center space-x-2">
                      <Lock className="w-3.5 h-3.5 text-[#0066FF]" />
                      <span>Automated Visa Commercial Settlement Scheduled</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Resolution Spec Badge for User */}
              <div className="absolute bottom-2.5 right-3 px-2 py-1 rounded bg-slate-900/80 dark:bg-black/80 text-[10px] font-mono text-slate-300 backdrop-blur-sm border border-white/10 flex items-center space-x-1.5 opacity-60 hover:opacity-100 transition-opacity">
                <ImageIcon className="w-3 h-3 text-sky-400" />
                <span>IMG-CARD-04 · 800×500 px (16:10)</span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* CARD 5: Banking and treasury / Continuous credit (FOTO 5)  */}
          {/* -------------------------------------------------------- */}
          <div className="group rounded-3xl bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-white/[0.08] shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-10 lg:p-12 overflow-hidden flex flex-col justify-between">
            <div className="max-w-xl mb-8 sm:mb-12">
              <h3 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white mb-3">
                Continuous machine credit &amp; treasury
              </h3>
              <p className="font-sans text-sm sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Save, clear, and scale autonomous liquidity with algorithmic underwriting — establishing daily credit lines up to $50,000+.
              </p>
            </div>

            {/* Visual / Image Slot */}
            <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-white/[0.03] dark:to-white/[0.01] border border-slate-200/80 dark:border-white/[0.06] p-6 sm:p-10 flex items-center justify-center min-h-[260px] sm:min-h-[340px] overflow-hidden">
              {customImages.card5_bankingTreasury ? (
                <div className="relative w-full h-64 sm:h-80">
                  <Image 
                    src={customImages.card5_bankingTreasury} 
                    alt="Banking and treasury" 
                    fill 
                    className="object-contain" 
                  />
                </div>
              ) : (
                /* Area Chart & Metric Box matching Foto 5 */
                <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/[0.08] shadow-sm relative">
                  {/* Floating Metric Badge */}
                  <div className="absolute top-6 left-8 sm:left-12 z-10 bg-white dark:bg-slate-900/95 px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-white/[0.12] shadow-md">
                    <div className="font-display font-black text-slate-950 dark:text-white text-base sm:text-lg">
                      +$50,000.00
                    </div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                      DAILY CAPACITY GRADUATED
                    </div>
                  </div>

                  {/* Area Chart Vector Curve (Foto 5 style) */}
                  <div className="pt-12">
                    <svg className="w-full h-40 overflow-visible" viewBox="0 0 320 120" fill="none">
                      <line x1="0" y1="30" x2="320" y2="30" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" />
                      <line x1="0" y1="80" x2="320" y2="80" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" />
                      
                      {/* Gradient Fill under curve */}
                      <path 
                        d="M 0 110 Q 50 100 100 85 T 200 45 T 280 20 L 320 10 L 320 120 L 0 120 Z" 
                        fill="url(#brexChartGradient)" 
                      />
                      
                      {/* Glowing Main Stroke Curve */}
                      <path 
                        d="M 0 110 Q 50 100 100 85 T 200 45 T 280 20 L 320 10" 
                        stroke="#ff5100" 
                        strokeWidth="3" 
                        fill="none" 
                      />
                      
                      <defs>
                        <linearGradient id="brexChartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ff5100" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#ff5100" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <div className="mt-4 flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                    <span>Day 0 (Thin File $1.5k)</span>
                    <span className="text-emerald-500 font-semibold">Day 90 (Graduated $50k)</span>
                  </div>
                </div>
              )}

              {/* Resolution Spec Badge for User */}
              <div className="absolute bottom-2.5 right-3 px-2 py-1 rounded bg-slate-900/80 dark:bg-black/80 text-[10px] font-mono text-slate-300 backdrop-blur-sm border border-white/10 flex items-center space-x-1.5 opacity-60 hover:opacity-100 transition-opacity">
                <ImageIcon className="w-3 h-3 text-sky-400" />
                <span>IMG-CARD-05 · 800×500 px (16:10)</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================== */}
        {/* CLOSING SECTION: "Solutions for every stage of growth." (FOTO 5) */}
        {/* ========================================================== */}
        <div className="mt-20 sm:mt-28 text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white mb-4">
            Solutions for every stage of growth.
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-8">
            From single developer experiments to multi-agent swarms with commercial credit lines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left">
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-white/[0.08]">
              <div className="font-mono text-xs text-sky-500 font-bold mb-1">01 · STARTUPS</div>
              <div className="font-display font-bold text-slate-900 dark:text-white text-sm mb-1">Day-0 Underwriting</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Public scan &amp; conservative $1,500/day pre-funded limits.</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-white/[0.08]">
              <div className="font-mono text-xs text-[#0066FF] font-bold mb-1">02 · MID-MARKET</div>
              <div className="font-display font-bold text-slate-900 dark:text-white text-sm mb-1">Agent Swarm Cards</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Programmatic multi-card envelopes with sub-14ms clearance.</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-white/[0.08]">
              <div className="font-mono text-xs text-purple-500 font-bold mb-1">03 · ENTERPRISE</div>
              <div className="font-display font-bold text-slate-900 dark:text-white text-sm mb-1">Autonomous Treasury</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Continuous AVUD lines up to $500k/day with ERP reconciliation.</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
