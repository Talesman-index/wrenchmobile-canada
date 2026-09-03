'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ClipboardList, Car, MapPin, DollarSign, Calendar } from 'lucide-react';
import { formatCAD, getStatusBadge } from '@/lib/utils';

export default function AdminRequestsPage() {
  const { serviceRequests } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredRequests = serviceRequests.filter((r) => {
    if (filter === 'active') return r.status !== 'completed' && r.status !== 'cancelled';
    if (filter === 'completed') return r.status === 'completed';
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Toutes les Demandes de Service</h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervision du flux complet de dispatching et d&apos;exécution sur le territoire canadien.
          </p>
        </div>

        <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === 'all' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Toutes ({serviceRequests.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === 'active' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            En cours
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === 'completed' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Terminées
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filteredRequests.map((req) => {
          const badge = getStatusBadge(req.status);

          return (
            <div
              key={req.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <span className="font-mono text-xs text-slate-400">ID : {req.id}</span>
                </div>

                <h2 className="text-sm font-bold text-white">
                  {req.vehicle?.year} {req.vehicle?.make} {req.vehicle?.model} — <span className="capitalize text-purple-400">{req.service_type.replace(/_/g, ' ')}</span>
                </h2>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
                  <span>Client : <strong className="text-slate-200">{req.customer_name}</strong></span>
                  <span>Mécanicien : <strong className="text-slate-200">{req.mechanic ? `${req.mechanic.first_name} ${req.mechanic.last_name}` : 'En recherche'}</strong></span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{req.city}, {req.province}</span>
                  </span>
                </div>
              </div>

              <div className="text-right border-t md:border-t-0 pt-2 md:pt-0 border-slate-800 shrink-0">
                <p className="text-base font-bold text-white font-mono">
                  {formatCAD(req.final_amount || req.estimated_amount)}
                </p>
                <p className="text-[10px] text-slate-400">
                  {req.final_amount ? 'Payé en totalité' : 'Montant estimé'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
