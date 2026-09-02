'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { DollarSign, ArrowUpRight, TrendingUp, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import { formatCAD } from '@/lib/utils';

export default function MechanicEarningsPage() {
  const { serviceRequests, currentMechanicProfile, payments } = useApp();

  const completedJobs = serviceRequests.filter(
    (r) => r.mechanic_id === currentMechanicProfile.id && r.status === 'completed'
  );

  const totalEarningsCAD = completedJobs.reduce(
    (acc, job) => acc + ((job.labor_amount || 0) + (job.parts_amount || 0) * 0.9),
    0
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Mes Revenus</h1>
        <p className="text-xs text-slate-500 mt-0.5">Versements nets et décomptes des interventions</p>
      </div>

      {/* Carte solde total */}
      <div className="bg-[#0c1f38] text-white rounded-3xl p-5 shadow-navy-cta flex flex-col gap-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Solde net disponible (CAD)
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-[#ff6b00]">
            {formatCAD(totalEarningsCAD || 842.5)}
          </span>
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +18 % cette semaine
          </span>
        </div>

        <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
          <span>Prochain virement direct :</span>
          <span className="font-bold text-white">Vendredi (Hebdomadaire)</span>
        </div>
      </div>

      {/* Statistiques financières */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Part mécanicien</span>
          <p className="text-lg font-black text-emerald-600 mt-1">88 %</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Sur la main-d&apos;œuvre</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Interventions</span>
          <p className="text-lg font-black text-slate-900 mt-1">
            {currentMechanicProfile.jobs_completed}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Missions complétées</p>
        </div>
      </div>

      {/* Historique des transactions */}
      <div>
        <h2 className="text-sm font-black text-slate-900 mb-2.5">Derniers versements</h2>

        <div className="flex flex-col gap-2.5">
          {completedJobs.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center shadow-card text-xs text-slate-500">
              Aucun virement enregistré. Terminez votre première mission pour débloquer vos gains.
            </div>
          ) : (
            completedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-slate-100 rounded-3xl p-3.5 shadow-card flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-black text-slate-900 capitalize">
                    {job.service_type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {job.vehicle?.year} {job.vehicle?.make} • {new Date(job.created_at).toLocaleDateString('fr-CA')}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-black text-emerald-600">
                    +{formatCAD((job.labor_amount || 0) + (job.parts_amount || 0) * 0.9)}
                  </p>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Viré par Stripe</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
