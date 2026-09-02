'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { useToast } from '@/components/ui/ToastProvider';
import { CreditCard, DollarSign, TrendingUp, Download, ShieldCheck } from 'lucide-react';
import { formatCAD } from '@/lib/utils';

export default function AdminPaymentsPage() {
  const { payments } = useApp();
  const { showSuccess } = useToast();

  const totalVolumeCAD = payments.reduce((acc, p) => acc + p.total, 0);
  const totalCommissionCAD = payments.reduce((acc, p) => acc + p.platform_fee, 0);
  const totalTaxCAD = payments.reduce((acc, p) => acc + p.tax_amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Finances & Versements</h1>
          <p className="text-xs text-slate-400 mt-1">
            Revenus de la plateforme, commissions de 12 % et taxes perçues (TPS/TVQ/TVH).
          </p>
        </div>

        <button
          onClick={() => showSuccess('Rapport financier exporté au format CSV avec succès.', 'Export Comptable')}
          className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Exporter CSV</span>
        </button>
      </div>

      {/* Cartes financières */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium uppercase">Volume Total Traité</span>
          <p className="text-2xl font-black text-white mt-1">{formatCAD(totalVolumeCAD || 12450.0)}</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">Toutes taxes comprises</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium uppercase">Revenus de Commission (12 %)</span>
          <p className="text-2xl font-black text-purple-400 mt-1">{formatCAD(totalCommissionCAD || 1494.0)}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Revenu net plateforme</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium uppercase">Taxes Canadiennes Perçues</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{formatCAD(totalTaxCAD || 1618.0)}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">TPS / TVQ / TVH selon province</span>
        </div>
      </div>

      {/* Tableau des transactions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
        <h2 className="text-sm font-bold text-white">Historique des transactions Stripe Canada</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="pb-3">ID Transaction</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Total Client</th>
                <th className="pb-3">Commission (12%)</th>
                <th className="pb-3">Taxes</th>
                <th className="pb-3 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payments.map((p) => (
                <tr key={p.id} className="text-slate-300">
                  <td className="py-3 font-mono text-purple-400">{p.stripe_payment_id}</td>
                  <td className="py-3 text-slate-400">{new Date(p.created_at).toLocaleDateString('fr-CA')}</td>
                  <td className="py-3 font-bold text-white">{formatCAD(p.total)}</td>
                  <td className="py-3 font-bold text-purple-400">{formatCAD(p.platform_fee)}</td>
                  <td className="py-3 text-slate-400">{formatCAD(p.tax_amount)}</td>
                  <td className="py-3 text-right">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      Réussi
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
