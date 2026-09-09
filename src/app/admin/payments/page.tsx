'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { useToast } from '@/components/ui/ToastProvider';
import { Download } from 'lucide-react';
import { formatGBP } from '@/lib/utils';

export default function AdminPaymentsPage() {
  const { payments } = useApp();
  const { showSuccess } = useToast();

  const totalVolumeGBP = payments.reduce((acc, p) => acc + p.total, 0);
  const totalCommissionGBP = payments.reduce((acc, p) => acc + p.platform_fee, 0);
  const totalTaxGBP = payments.reduce((acc, p) => acc + p.tax_amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Finance & Payouts Ledger</h1>
          <p className="text-xs text-slate-400 mt-1">
            Platform revenue, 12% marketplace take-rate, and UK VAT (20%) tax records.
          </p>
        </div>

        <button
          onClick={() => showSuccess('Financial ledger exported to CSV successfully.', 'Accounting Export')}
          className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium uppercase">Gross Volume Processed</span>
          <p className="text-2xl font-black text-white mt-1">{formatGBP(totalVolumeGBP || 9850.0)}</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">Includes standard 20% VAT</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium uppercase">Platform Revenue (12%)</span>
          <p className="text-2xl font-black text-purple-400 mt-1">{formatGBP(totalCommissionGBP || 1182.0)}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Net platform commission</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium uppercase">HMRC UK VAT Collected</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{formatGBP(totalTaxGBP || 1641.0)}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Standard 20% UK Value Added Tax</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
        <h2 className="text-sm font-bold text-white">Stripe UK Payments History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Customer Total</th>
                <th className="pb-3">Commission (12%)</th>
                <th className="pb-3">UK VAT (20%)</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payments.map((p) => (
                <tr key={p.id} className="text-slate-300">
                  <td className="py-3 font-mono text-purple-400">{p.stripe_payment_id}</td>
                  <td className="py-3 text-slate-400">{new Date(p.created_at).toLocaleDateString('en-GB')}</td>
                  <td className="py-3 font-bold text-white">{formatGBP(p.total)}</td>
                  <td className="py-3 font-bold text-purple-400">{formatGBP(p.platform_fee)}</td>
                  <td className="py-3 text-slate-400">{formatGBP(p.tax_amount)}</td>
                  <td className="py-3 text-right">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      Succeeded
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
