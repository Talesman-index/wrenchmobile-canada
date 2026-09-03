'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  Wrench,
  Car,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Sparkles,
  ChevronLeft,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { formatCAD, getStatusBadge } from '@/lib/utils';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/ui/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-44 bg-slate-100 rounded-3xl animate-pulse" />,
});

export default function MechanicJobExecutionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { serviceRequests, updateRequestStatus, submitFinalQuote } = useApp();

  const [diagnosticNotes, setDiagnosticNotes] = useState('');
  const [workPerformed, setWorkPerformed] = useState('');
  const [partsUsed, setPartsUsed] = useState('');
  const [laborAmount, setLaborAmount] = useState('120');
  const [partsAmount, setPartsAmount] = useState('0');
  const [additionalFee, setAdditionalFee] = useState('0');

  const request = serviceRequests.find((r) => r.id === id);

  if (!request) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-slate-500 text-sm">Mission introuvable.</p>
        <button
          onClick={() => router.push('/mechanic/jobs')}
          className="mt-4 bg-[#0c1f38] text-white text-xs font-bold px-4 py-2 rounded-2xl"
        >
          Retour aux missions
        </button>
      </div>
    );
  }

  const badge = getStatusBadge(request.status);

  const handleStartTrip = () => {
    updateRequestStatus(request.id, 'mechanic_on_the_way', { eta_minutes: 15 });
  };

  const handleMarkArrived = () => {
    updateRequestStatus(request.id, 'arrived', { eta_minutes: 0 });
  };

  const handleStartWork = () => {
    updateRequestStatus(request.id, 'in_progress');
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    submitFinalQuote(request.id, {
      diagnostic_notes: diagnosticNotes.trim() || 'Diagnostic standard complété par le mécanicien.',
      work_performed: workPerformed.trim() || 'Intervention terminée avec succès selon les spécifications manufacturier.',
      parts_used: partsUsed.trim() || undefined,
      labor_amount: Number(laborAmount) || 0,
      parts_amount: Number(partsAmount) || 0,
      additional_fee: Number(additionalFee) || 0,
    });
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* En-tête de mission */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/mechanic/jobs')}
          className="w-9 h-9 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-card"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${badge.bg}`}>
          {badge.label}
        </span>
        <div className="w-9" />
      </div>

      {/* Carte GPS de destination client */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card p-1.5 flex flex-col gap-2">
        <div className="flex items-center justify-between px-3 pt-1">
          <div className="flex items-center gap-2 text-[#181528] text-xs">
            <MapPin className="w-4 h-4 text-[#5e17eb]" />
            <span className="font-bold line-clamp-1">{request.address}</span>
          </div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(request.address)}`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#5e17eb] text-white font-black text-[10px] px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm shrink-0"
          >
            <Navigation className="w-3 h-3 text-white" />
            <span>GPS</span>
          </a>
        </div>

        <div className="rounded-2xl overflow-hidden">
          <MapComponent
            customerCoords={{ lat: request.latitude, lng: request.longitude }}
            mechanicCoords={{
              lat: request.latitude + 0.005,
              lng: request.longitude + 0.004,
            }}
            address={request.address}
            height="170px"
          />
        </div>
      </div>

      {/* Détails du client & Véhicule */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Client</p>
            <h2 className="text-sm font-black text-[#181528]">{request.customer_name}</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{request.customer_phone}</p>
          </div>

          <a
            href={`tel:${request.customer_phone}`}
            className="w-9 h-9 rounded-2xl bg-[#f3ebff] hover:bg-[#5e17eb] text-[#5e17eb] hover:text-white flex items-center justify-center transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
              <Car className="w-4 h-4 text-[#5e17eb]" />
            </div>
            <div>
              <p className="text-xs font-black text-[#181528]">
                {request.vehicle?.year} {request.vehicle?.make} {request.vehicle?.model}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                {request.vehicle?.license_plate || 'SANS PLAQUE'}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#5e17eb] capitalize bg-[#f3ebff] px-2.5 py-1 rounded-xl">
            {request.service_type.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="text-xs text-slate-700 bg-[#f8f9fd] p-3 rounded-2xl border border-slate-100">
          <span className="text-slate-400 block text-[10px] font-black uppercase mb-0.5">Symptôme signalé :</span>
          {request.description}
        </div>
      </div>

      {/* BOUTONS D'AVANCEMENT DU STATUT DE MISSION */}
      {request.status === 'accepted' && (
        <button
          onClick={handleStartTrip}
          className="w-full bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black py-4 rounded-2xl shadow-purple-cta flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98]"
        >
          <Navigation className="w-4 h-4" />
          <span>Démarrer le trajet vers le client</span>
        </button>
      )}

      {request.status === 'mechanic_on_the_way' && (
        <button
          onClick={handleMarkArrived}
          className="w-full bg-[#181528] hover:bg-slate-900 text-white font-black py-4 rounded-2xl shadow-card flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98]"
        >
          <MapPin className="w-4 h-4 text-[#5e17eb]" />
          <span>Marquer &quot;Arrivé sur place&quot;</span>
        </button>
      )}

      {request.status === 'arrived' && (
        <button
          onClick={handleStartWork}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98]"
        >
          <Wrench className="w-4 h-4" />
          <span>Commencer l&apos;intervention & diagnostic</span>
        </button>
      )}

      {/* FORMULAIRE DE FINALISATION DE FACTURE */}
      {request.status === 'in_progress' && (
        <form onSubmit={handleSubmitQuote} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-card-hover flex flex-col gap-3 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#5e17eb]" />
            <h2 className="text-sm font-black text-[#181528]">Rapport de terrain & Devis final</h2>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Constat de diagnostic</label>
            <textarea
              rows={3}
              value={diagnosticNotes}
              onChange={(e) => setDiagnosticNotes(e.target.value)}
              placeholder="Ex : Tension batterie mesurée à 10,2V. Alternateur délivre 14,1V. Remplacement de la batterie requis."
              className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-3 text-[#181528] focus:border-[#5e17eb] focus:bg-white outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Travaux effectués</label>
            <input
              type="text"
              value={workPerformed}
              onChange={(e) => setWorkPerformed(e.target.value)}
              placeholder="Ex : Installation batterie neuve Groupe 35 + nettoyage des bornes"
              className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] focus:border-[#5e17eb] focus:bg-white outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Pièces et fournitures utilisées</label>
            <input
              type="text"
              value={partsUsed}
              onChange={(e) => setPartsUsed(e.target.value)}
              placeholder="Ex : Batterie Interstate AGM MTX-35"
              className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] focus:border-[#5e17eb] focus:bg-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Main-d&apos;œuvre (CAD $)</label>
              <input
                type="number"
                value={laborAmount}
                onChange={(e) => setLaborAmount(e.target.value)}
                className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] font-bold focus:border-[#5e17eb] focus:bg-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pièces (CAD $)</label>
              <input
                type="number"
                value={partsAmount}
                onChange={(e) => setPartsAmount(e.target.value)}
                className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] font-bold focus:border-[#5e17eb] focus:bg-white outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black py-3.5 rounded-2xl shadow-purple-cta text-xs transition-all active:scale-98"
          >
            Transmettre le devis final au client
          </button>
        </form>
      )}

      {/* Si en attente de paiement du client */}
      {request.status === 'awaiting_payment' && (
        <div className="bg-[#f3ebff] border border-purple-200 rounded-3xl p-5 text-center flex flex-col gap-2">
          <Clock className="w-8 h-8 text-[#5e17eb] mx-auto animate-pulse" />
          <h2 className="text-sm font-black text-[#181528]">En attente du paiement du client</h2>
          <p className="text-xs text-slate-600">
            Le client a reçu le montant de {formatCAD(request.final_amount || 0)} sur son application pour validation via Stripe.
          </p>
        </div>
      )}

      {/* Si terminé */}
      {request.status === 'completed' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-center flex flex-col gap-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h2 className="text-sm font-black text-slate-900">Mission complétée & payée</h2>
          <p className="text-xs text-slate-600">
            Votre versement net de {formatCAD((request.labor_amount || 0) + (request.parts_amount || 0) * 0.9)} a été crédité à votre compte.
          </p>
        </div>
      )}
    </div>
  );
}
