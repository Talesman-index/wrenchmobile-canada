'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ShieldCheck, Check, X, UserX, AlertCircle, Wrench, Search } from 'lucide-react';
import { getStatusBadge } from '@/lib/utils';
import { VerificationStatus } from '@/types/database';

export default function AdminMechanicsPage() {
  const { mechanics, updateMechanicVerification } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [search, setSearch] = useState('');

  const filteredMechanics = mechanics.filter((m) => {
    if (filter === 'pending' && m.verification_status !== 'pending') return false;
    if (filter === 'verified' && m.verification_status !== 'verified') return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        m.first_name.toLowerCase().includes(q) ||
        m.last_name.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        (m.business_name && m.business_name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Vérification des Mécaniciens</h1>
          <p className="text-xs text-slate-400 mt-1">
            Validation des certifications Sceau Rouge et conformité des techniciens.
          </p>
        </div>

        {/* Filtres par statut */}
        <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === 'all' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tous ({mechanics.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === 'pending' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            En attente ({mechanics.filter((m) => m.verification_status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === 'verified' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vérifiés ({mechanics.filter((m) => m.verification_status === 'verified').length})
          </button>
        </div>
      </div>

      {/* Liste des mécaniciens */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMechanics.map((m) => {
          const badge = getStatusBadge(m.verification_status);

          return (
            <div
              key={m.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                  <img src={m.avatar_url} alt={m.first_name} className="w-full h-full object-cover" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">
                      {m.first_name} {m.last_name}
                    </h2>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  <p className="text-xs text-purple-400 font-medium mt-0.5">{m.business_name || 'Atelier Mobile Indépendant'}</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl line-clamp-2">{m.bio}</p>

                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
                    <span>📍 {m.city}, {m.province} (Rayon {m.service_radius_km} km)</span>
                    <span>🛠️ {m.years_experience} ans d&apos;expérience</span>
                    <span>⭐ {m.rating.toFixed(1)} ({m.jobs_completed} interventions)</span>
                  </div>
                </div>
              </div>

              {/* Boutons d'action pour l'admin */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                {m.verification_status !== 'verified' && (
                  <button
                    onClick={() => updateMechanicVerification(m.id, 'verified')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-950"
                  >
                    <Check className="w-4 h-4" />
                    <span>Valider Sceau Rouge</span>
                  </button>
                )}

                {m.verification_status !== 'rejected' && (
                  <button
                    onClick={() => updateMechanicVerification(m.id, 'rejected')}
                    className="bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-400 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Refuser</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
