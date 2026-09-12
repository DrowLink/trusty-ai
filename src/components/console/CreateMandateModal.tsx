'use client';

import React, { useState } from 'react';
import { HumanMandate } from '@/lib/types';
import { 
  X, 
  Lock, 
  MapPin, 
  Laptop, 
  ShieldCheck 
} from 'lucide-react';

interface CreateMandateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (mandate: HumanMandate) => void;
}

export const CreateMandateModal: React.FC<CreateMandateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [principalRole, setPrincipalRole] = useState('');
  const [clearingRail, setClearingRail] = useState<'Brex' | 'Ramp' | 'Slash'>('Brex');
  const [budgetTotal, setBudgetTotal] = useState<number>(20000);
  const [category, setCategory] = useState('IT Hardware & Workstations');
  const [maxQuantity, setMaxQuantity] = useState<number>(20);
  const [allowedBrands, setAllowedBrands] = useState('Dell, Lenovo');
  const [specifications, setSpecifications] = useState('16 GB RAM minimum, Intel i7 / Apple M3, 512 GB SSD');
  const [addressLabel, setAddressLabel] = useState('Acme Miami HQ');
  const [addressStreet, setAddressStreet] = useState('801 Brickell Ave, Suite 1400');
  const [city, setCity] = useState('Miami');
  const [state, setState] = useState('FL');
  const [zip, setZip] = useState('33131');
  const [allowedVendors, setAllowedVendors] = useState('Dell Direct B2B, Lenovo Corporate, CDW');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newMandate: HumanMandate = {
      id: `man_${Math.random().toString(36).substring(2, 10)}`,
      title: title.trim(),
      version: 'v1.0 (Human Confirmed)',
      status: 'ACTIVE',
      principalName: principalName.trim() || 'Operations Lead',
      principalRole: principalRole.trim() || 'Procurement Principal',
      description: `Autonomous purchasing mandate authorized under ${clearingRail} corporate card.`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      budgetTotal: Number(budgetTotal) || 10000,
      budgetSpent: 0,
      budgetReserved: 0,
      currency: 'USD',
      clearingRail,
      cardIdentifier: `${clearingRail} Card ****${Math.floor(1000 + Math.random() * 9000)}`,
      itemsConstraint: {
        category,
        allowedBrands: allowedBrands.split(',').map(b => b.trim()).filter(Boolean),
        maxQuantity: Number(maxQuantity) || 1,
        specifications: specifications.split(',').map(s => s.trim()).filter(Boolean),
      },
      deliveryAddress: {
        label: addressLabel,
        street: addressStreet,
        city,
        state,
        zip,
        isCorporateVerified: true,
      },
      allowedVendors: allowedVendors.split(',').map(v => v.trim()).filter(Boolean),
      approvers: ['sarah.jenkins@acme.corp'],
      autoApprovalMax: Math.round(budgetTotal * 0.25),
    };

    onCreate(newMandate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#ffffff] dark:bg-[#14221e] rounded-2xl border border-[#dce3db] dark:border-[#21352e] shadow-2xl p-6 my-8 space-y-6 max-h-[90vh] overflow-y-auto text-left"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#dce3db] dark:border-[#21352e]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-[#e9eddf] dark:bg-[#1c302a] text-[#203b32] dark:text-[#c5e86c]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#172b29] dark:text-[#f8f9f5]">
                Create New Human Mandate
              </h2>
              <p className="text-xs text-[#50625d] dark:text-[#9cb0a8]">
                Establish confirmed intent boundaries before delegating spend to AI agents.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#50625d] hover:text-[#172b29] dark:hover:text-[#f8f9f5] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title & Rail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#172b29] dark:text-[#f8f9f5] mb-1">
                Mandate Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Q4 Data Science Workstations"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dce3db] dark:border-[#21352e] bg-[#f8f9f5] dark:bg-[#0f1816] text-[#172b29] dark:text-[#f8f9f5] focus:ring-2 focus:ring-[#203b32] focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#172b29] dark:text-[#f8f9f5] mb-1">
                Clearing Financial Rail
              </label>
              <select
                value={clearingRail}
                onChange={e => setClearingRail(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-[#dce3db] dark:border-[#21352e] bg-[#f8f9f5] dark:bg-[#0f1816] text-[#172b29] dark:text-[#f8f9f5] focus:ring-2 focus:ring-[#203b32] focus:outline-none text-xs"
              >
                <option value="Brex">Brex Virtual Card</option>
                <option value="Ramp">Ramp Corporate Rail</option>
                <option value="Slash">Slash Treasury Webhook</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#172b29] dark:text-[#f8f9f5] mb-1">
                Principal Name (Human Delegator)
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={principalName}
                onChange={e => setPrincipalName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dce3db] dark:border-[#21352e] bg-[#f8f9f5] dark:bg-[#0f1816] text-[#172b29] dark:text-[#f8f9f5] focus:ring-2 focus:ring-[#203b32] focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#172b29] dark:text-[#f8f9f5] mb-1">
                Total Authorized Budget ($ USD) *
              </label>
              <input
                type="number"
                required
                min={100}
                value={budgetTotal}
                onChange={e => setBudgetTotal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#dce3db] dark:border-[#21352e] bg-[#f8f9f5] dark:bg-[#0f1816] text-[#172b29] dark:text-[#f8f9f5] focus:ring-2 focus:ring-[#203b32] focus:outline-none text-xs tabular-nums"
              />
            </div>
          </div>

          {/* Items constraints */}
          <div className="p-3.5 rounded-xl bg-[#f8f9f5] dark:bg-[#0f1816] border border-[#dce3db] dark:border-[#21352e] space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-[#172b29] dark:text-[#f8f9f5] text-xs">
              <Laptop className="w-4 h-4 text-[#203b32] dark:text-[#c5e86c]" />
              <span>Items &amp; Specification Boundaries</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#50625d] dark:text-[#9cb0a8] mb-1">
                  Hard Quantity Cap (Units)
                </label>
                <input
                  type="number"
                  min={1}
                  value={maxQuantity}
                  onChange={e => setMaxQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[#dce3db] dark:border-[#21352e] bg-white dark:bg-[#14221e] text-[#172b29] dark:text-[#f8f9f5] text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-[#50625d] dark:text-[#9cb0a8] mb-1">
                  Allowed Brands (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Dell, Lenovo, Apple"
                  value={allowedBrands}
                  onChange={e => setAllowedBrands(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#dce3db] dark:border-[#21352e] bg-white dark:bg-[#14221e] text-[#172b29] dark:text-[#f8f9f5] text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#50625d] dark:text-[#9cb0a8] mb-1">
                Required Technical Specifications
              </label>
              <input
                type="text"
                placeholder="16 GB RAM minimum, Intel i7, 512 GB SSD"
                value={specifications}
                onChange={e => setSpecifications(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dce3db] dark:border-[#21352e] bg-white dark:bg-[#14221e] text-[#172b29] dark:text-[#f8f9f5] text-xs"
              />
            </div>
          </div>

          {/* Delivery & Vendors */}
          <div className="p-3.5 rounded-xl bg-[#f8f9f5] dark:bg-[#0f1816] border border-[#dce3db] dark:border-[#21352e] space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-[#172b29] dark:text-[#f8f9f5] text-xs">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Corporate Delivery Destination</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Street address"
                value={addressStreet}
                onChange={e => setAddressStreet(e.target.value)}
                className="sm:col-span-2 px-3 py-2 rounded-lg border border-[#dce3db] dark:border-[#21352e] bg-white dark:bg-[#14221e] text-[#172b29] dark:text-[#f8f9f5] text-xs"
              />
              <input
                type="text"
                placeholder="City (e.g. Miami)"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[#dce3db] dark:border-[#21352e] bg-white dark:bg-[#14221e] text-[#172b29] dark:text-[#f8f9f5] text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-[#50625d] dark:text-[#9cb0a8] mb-1">
                Approved Vendors / Whitelist
              </label>
              <input
                type="text"
                placeholder="Dell Direct B2B, CDW Corporate, Lenovo"
                value={allowedVendors}
                onChange={e => setAllowedVendors(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dce3db] dark:border-[#21352e] bg-white dark:bg-[#14221e] text-[#172b29] dark:text-[#f8f9f5] text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#dce3db] dark:border-[#21352e]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#50625d] hover:bg-[#e9eddf] dark:hover:bg-[#1c302a]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#172b29] hover:bg-[#203b32] active:scale-[0.98] transition shadow-md flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#c5e86c]" />
              <span>Confirm &amp; Activate Mandate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
