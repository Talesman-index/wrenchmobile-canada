'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Briefcase, Car, MapPin, ChevronRight, Clock, ShieldCheck } from 'lucide-react';
import { formatCAD, getStatusBadge } from '@/lib/utils';

export default function MechanicJobsPage() {
  const { serviceRequests, currentMechanicProfile } = useApp();

  const myJobs = serviceRequests.filter(
    (r) => r.mechanic_id === currentMechanicProfile.id || r.status === 'searching'
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Mes Missions</h1>
        <p className="text-xs text-slate-500 mt-0.5">Missions actives et historique des interventions</p>
      </div>

      <div className="flex flex-col gap-3">
        {myJobs.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-card">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">Aucune mission pour le moment</p>
            <p className="text-xs text-slate-500 mt-1">
              Basculez en mode EN LIGNE sur votre tableau de bord pour recevoir les demandes.
            </p>
          </div>
        ) : (
          myJobs.map((job) => {
            const badge = getStatusBadge(job.status);
            const isLive = job.status !== 'completed' && job.status !== 'cancelled';

            return (
              <Link
                key={job.id}
                href={`/mechanic/jobs/${job.id}`}
                className={`bg-white border rounded-3xl p-4 transition-all shadow-card hover:shadow-card-hover flex flex-col gap-3 ${
                  isLive ? 'border-[#ff6b00] ring-2 ring-orange-100' : 'border-slate-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <h2 className="text-sm font-black text-slate-900 mt-2">
                      {job.vehicle?.year} {job.vehicle?.make} {job.vehicle?.model}
                    </h2>
                    <p className="text-xs text-[#ff6b00] font-bold capitalize mt-0.5">
                      {job.service_type.replace(/_/g, ' ')}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600">
                      {formatCAD(
                        job.final_amount
                          ? (job.labor_amount || 0) + (job.parts_amount || 0) * 0.9
                          : job.estimated_amount * 0.88
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400">Gain net</p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-1 text-[11px]">{job.address}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[#ff6b00] font-black shrink-0 ml-2">
                    <span>{isLive ? 'Gérer la mission' : 'Voir le rapport'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
