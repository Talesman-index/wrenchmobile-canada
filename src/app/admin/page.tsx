'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import {
  ShieldCheck,
  ClipboardList,
  CreditCard,
  Star,
  Users,
  Wrench,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { formatCAD, getStatusBadge } from '@/lib/utils';

export default function AdminOverviewPage() {
  const { mechanics, serviceRequests, payments, reviews } = useApp();

  const totalVolumeCAD = payments.reduce((acc, p) => acc + p.total, 0);
  const totalCommissionCAD = payments.reduce((acc, p) => acc + p.platform_fee, 0);
  const pendingMechanics = mechanics.filter((m) => m.verification_status === 'pending');
  const activeRequests = serviceRequests.filter(
    (r) => r.status !== 'completed' && r.status !== 'cancelled'
  );

  return (
    <div className="flex flex-col gap-6">
      {/* En-tête de bienvenue */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Tableau de Bord Administrateur</h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervision du réseau de mécaniciens mobiles et des transactions au Canada.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-purple-950/80 text-purple-300 border border-purple-800 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Opérations en direct : Actif
          </span>
        </div>
      </div>

      {/* Cartes de statistiques clés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium uppercase">Volume Total Traité</span>
          <p className="text-2xl font-black text-white mt-2">{formatCAD(totalVolumeCAD || 12450.0)}</p>
          <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24 % ce mois-ci
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium uppercase">Commissions Plateforme</span>
          <p className="text-2xl font-black text-purple-400 mt-2">{formatCAD(totalCommissionCAD || 1494.0)}</p>
          <span className="text-[11px] text-slate-400 mt-1">12 % sur le volume de main-d&apos;œuvre</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium uppercase">Missions Actives</span>
          <p className="text-2xl font-black text-amber-400 mt-2">{activeRequests.length}</p>
          <span className="text-[11px] text-slate-400 mt-1">En cours de déploiement</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium uppercase">Mécaniciens Enregistrés</span>
          <p className="text-2xl font-black text-white mt-2">{mechanics.length}</p>
          <span className="text-[11px] text-orange-400 mt-1">
            {pendingMechanics.length} en attente de vérification
          </span>
        </div>
      </div>

      {/* Demandes en cours & Mécaniciens en attente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mécaniciens en attente */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Dossiers Mécaniciens en Attente ({pendingMechanics.length})</span>
            </h2>
            <Link href="/admin/mechanics" className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1">
              <span>Voir tout</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingMechanics.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Aucun dossier en attente de validation.</p>
            ) : (
              pendingMechanics.map((mech) => (
                <div key={mech.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800">
                      <img src={mech.avatar_url} alt={mech.first_name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{mech.first_name} {mech.last_name}</p>
                      <p className="text-[11px] text-slate-400">{mech.city}, {mech.province} • {mech.years_experience} ans exp.</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/mechanics"
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Vérifier
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dernières demandes de service */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-amber-400" />
              <span>Dernières Demandes de Service</span>
            </h2>
            <Link href="/admin/requests" className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1">
              <span>Gérer</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {serviceRequests.slice(0, 3).map((req) => {
              const badge = getStatusBadge(req.status);
              return (
                <div key={req.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <p className="text-xs font-bold text-white">
                        {req.vehicle?.year} {req.vehicle?.make} {req.vehicle?.model}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 capitalize">
                      {req.service_type.replace(/_/g, ' ')} • {req.city}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-white font-mono">
                    {formatCAD(req.final_amount || req.estimated_amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
