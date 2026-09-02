'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Star, ShieldAlert, CheckCircle2, MessageSquare } from 'lucide-react';

export default function AdminReviewsPage() {
  const { reviews, mechanics } = useApp();

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-white tracking-tight">Avis Clients & Contrôle Qualité</h1>
        <p className="text-xs text-slate-400 mt-1">
          Supervision des évaluations laissées aux mécaniciens mobiles.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reviews.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">
            Aucun avis enregistré pour l&apos;instant.
          </div>
        ) : (
          reviews.map((rev) => {
            const mechanic = mechanics.find((m) => m.id === rev.mechanic_id);

            return (
              <div key={rev.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-white font-mono">{rev.rating}.0 / 5.0</span>
                  </div>

                  <span className="text-xs text-slate-500">
                    {new Date(rev.created_at).toLocaleDateString('fr-CA')}
                  </span>
                </div>

                <p className="text-xs text-slate-200 italic">&ldquo;{rev.comment}&rdquo;</p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Mécanicien évalué : <strong className="text-purple-400">{mechanic ? `${mechanic.first_name} ${mechanic.last_name}` : 'Technicien'}</strong></span>
                  <span className="text-[10px] font-mono text-slate-500">ID Mission : {rev.request_id}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
