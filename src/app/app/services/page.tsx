'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Wrench, ChevronRight, Car, Calendar, DollarSign, Clock, ShieldCheck, Compass } from 'lucide-react';
import { formatCAD, getStatusBadge } from '@/lib/utils';

export default function ServicesHistoryPage() {
  const { serviceRequests, currentUser } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const userRequests = serviceRequests.filter((r) => r.customer_id === currentUser.id);

  const filtered = userRequests.filter((r) => {
    if (filter === 'active') return r.status !== 'completed' && r.status !== 'cancelled';
    if (filter === 'completed') return r.status === 'completed';
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Mes Services</h1>
          <p className="text-xs text-slate-500 mt-0.5">Historique des réparations et missions en cours</p>
        </div>

        <Link
          href="/app/request"
          className="bg-[#ff6b00] hover:bg-[#e65c00] text-white text-xs font-black px-3.5 py-2 rounded-2xl shadow-orange-cta active:scale-95 transition-all"
        >
          + Nouvelle demande
        </Link>
      </div>

      {/* Filtres par onglets */}
      <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center gap-1 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition-all ${
            filter === 'all' ? 'bg-white text-[#0c1f38] shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Tous ({userRequests.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition-all ${
            filter === 'active' ? 'bg-[#ff6b00] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          En cours ({userRequests.filter((r) => r.status !== 'completed' && r.status !== 'cancelled').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition-all ${
            filter === 'completed' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Terminés ({userRequests.filter((r) => r.status === 'completed').length})
        </button>
      </div>

      {/* Liste des demandes */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center mt-4 shadow-card">
            <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">Aucun service trouvé</p>
            <p className="text-xs text-slate-500 mt-1">Commandez un mécanicien mobile certifié dès que votre véhicule a besoin d&apos;assistance.</p>
          </div>
        ) : (
          filtered.map((req) => {
            const badge = getStatusBadge(req.status);
            const isLive = req.status !== 'completed' && req.status !== 'cancelled';

            return (
              <Link
                key={req.id}
                href={`/app/services/${req.id}`}
                className={`bg-white border rounded-3xl p-4 transition-all hover:shadow-card-hover flex flex-col gap-3 shadow-card ${
                  isLive ? 'border-[#ff6b00] ring-2 ring-orange-100' : 'border-slate-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <h2 className="text-sm font-black text-slate-900 mt-2">
                      {req.vehicle?.year} {req.vehicle?.make} {req.vehicle?.model}
                    </h2>
                    <p className="text-xs text-slate-500 capitalize mt-0.5">
                      {req.service_type.replace(/_/g, ' ')}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-[#0c1f38]">
                      {formatCAD(req.final_amount || req.estimated_amount)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {req.final_amount ? 'Total final CAD' : 'Est. diagnostic'}
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(req.created_at).toLocaleDateString('fr-CA', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[#ff6b00] font-black">
                    <span>{isLive ? 'Suivi en direct' : 'Voir le reçu / Facture'}</span>
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
