'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  Wrench,
  Car,
  MapPin,
  Phone,
  MessageSquare,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  ChevronLeft,
  DollarSign,
  FileText,
  Sparkles,
  Lock,
  Share2,
  Receipt,
  Download,
} from 'lucide-react';
import { formatCAD, getStatusBadge } from '@/lib/utils';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import Link from 'next/link';

const MapComponent = dynamic(() => import('@/components/ui/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-44 bg-slate-100 rounded-3xl animate-pulse" />,
});

const STATUS_STEPS = [
  { key: 'accepted', label: 'Assigné' },
  { key: 'mechanic_on_the_way', label: 'En route' },
  { key: 'arrived', label: 'Arrivé' },
  { key: 'in_progress', label: 'En cours' },
  { key: 'awaiting_payment', label: 'Paiement' },
  { key: 'completed', label: 'Terminé' },
];

export default function ServiceTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { serviceRequests, processPayment, submitReview, currentMechanicProfile } = useApp();
  const [isPaying, setIsPaying] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const request = serviceRequests.find((r) => r.id === id);

  if (!request) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-slate-500 text-sm">Demande de service introuvable.</p>
        <button
          onClick={() => router.push('/app/services')}
          className="mt-4 bg-[#0c1f38] text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-md"
        >
          Voir tous les services
        </button>
      </div>
    );
  }

  const mechanic = request.mechanic || currentMechanicProfile;
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === request.status);
  const badge = getStatusBadge(request.status);

  const mechanicCoords = {
    lat: request.latitude + 0.005,
    lng: request.longitude + 0.004,
  };

  const handlePayNow = async () => {
    setIsPaying(true);
    try {
      await processPayment(request.id);
      setIsPaying(false);
      setShowPaymentModal(false);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error(err);
      setIsPaying(false);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(request.id, ratingValue, ratingComment);
    setReviewSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/app/services')}
          className="w-9 h-9 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-card"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${badge.bg}`}>
          {badge.label}
        </span>
        <div className="w-9" />
      </div>

      {/* Barre de progression des statuts */}
      <div className="bg-white border border-slate-100 rounded-3xl p-3.5 shadow-card">
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div key={step.key} className="flex flex-col items-center min-w-[48px] flex-1 text-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                    isCurrent
                      ? 'bg-[#5e17eb] text-white ring-4 ring-purple-100 scale-110 shadow-md'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted && !isCurrent ? '✓' : idx + 1}
                </div>
                <span
                  className={`text-[9px] mt-1 font-bold leading-tight ${
                    isCurrent ? 'text-[#5e17eb] font-black' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carte de suivi d'itinéraire en direct */}
      {request.status !== 'completed' && (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card p-1.5 flex flex-col gap-2">
          {request.status === 'mechanic_on_the_way' && (
            <div className="bg-[#f3ebff] border border-purple-200 px-3 py-1.5 rounded-2xl flex items-center justify-between text-xs">
              <span className="text-slate-700 font-bold">Temps d&apos;arrivée estimé</span>
              <span className="font-black text-[#5e17eb] font-mono">
                ~{request.eta_minutes || 20} minutes
              </span>
            </div>
          )}

          <div className="rounded-2xl overflow-hidden">
            <MapComponent
              customerCoords={{ lat: request.latitude, lng: request.longitude }}
              mechanicCoords={mechanicCoords}
              address={request.address}
              height="180px"
            />
          </div>
        </div>
      )}

      {/* Fiche du mécanicien assigné */}
      {mechanic && (
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm">
                <img
                  src={mechanic.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
                  alt={mechanic.first_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-black text-[#181528]">
                    {mechanic.first_name} {mechanic.last_name}
                  </h2>
                  <span className="text-[9px] bg-[#f3ebff] text-[#5e17eb] font-black px-2 py-0.5 rounded-full">
                    Sceau Rouge
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-amber-500 font-black flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{mechanic.rating.toFixed(1)}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{mechanic.jobs_completed} interventions</span>
                </div>
              </div>
            </div>

            {/* Actions d'appel et de message */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${mechanic.phone}`}
                className="w-9 h-9 rounded-2xl bg-[#f3ebff] hover:bg-[#5e17eb] text-[#5e17eb] hover:text-white flex items-center justify-center transition-colors"
                title="Appeler le mécanicien"
              >
                <Phone className="w-4 h-4" />
              </a>
              <Link
                href="/app/chat"
                className="w-9 h-9 rounded-2xl bg-[#f3ebff] hover:bg-[#5e17eb] text-[#5e17eb] hover:text-white flex items-center justify-center transition-colors"
                title="Envoyer un message"
              >
                <MessageSquare className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Détails du véhicule et de l'adresse */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#f3ebff] flex items-center justify-center text-[#5e17eb]">
              <Car className="w-4 h-4" />
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

        <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <span className="text-slate-400 block text-[10px] font-black uppercase mb-0.5">Symptôme signalé :</span>
          {request.description}
        </div>
      </div>

      {/* Rapport de diagnostic de terrain */}
      {(request.diagnostic_notes || request.work_performed || request.status === 'awaiting_payment' || request.status === 'completed') && (
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-xs font-black text-[#181528]">
            <FileText className="w-4 h-4 text-[#5e17eb]" />
            <span>Rapport de diagnostic du technicien</span>
          </div>

          <div className="space-y-2 text-xs text-slate-700 bg-[#f8f9fd] p-3.5 rounded-2xl border border-slate-100">
            {request.diagnostic_notes && (
              <div>
                <strong className="text-slate-400 block text-[10px] uppercase">Diagnostic :</strong>
                <p className="mt-0.5">{request.diagnostic_notes}</p>
              </div>
            )}
            {request.work_performed && (
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-slate-400 block text-[10px] uppercase">Travaux effectués :</strong>
                <p className="mt-0.5">{request.work_performed}</p>
              </div>
            )}
            {request.parts_used && (
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-slate-400 block text-[10px] uppercase">Pièces installées :</strong>
                <p className="mt-0.5 font-mono text-emerald-700">{request.parts_used}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DEVIS FINAL & BOUTON DE PAIEMENT */}
      {request.status === 'awaiting_payment' && (
        <div className="bg-white border-2 border-[#5e17eb] rounded-3xl p-5 shadow-card-hover animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#5e17eb]" />
            <h2 className="text-sm font-black text-[#181528]">Votre mécanicien a finalisé le devis</h2>
          </div>

          <div className="bg-[#f8f9fd] rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-700">
              <span>Main-d&apos;œuvre</span>
              <span className="font-semibold">{formatCAD(request.labor_amount || 0)}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Pièces et matériel</span>
              <span className="font-semibold">{formatCAD(request.parts_amount || 0)}</span>
            </div>
            {request.additional_fee ? (
              <div className="flex justify-between text-slate-700">
                <span>Frais écologiques</span>
                <span className="font-semibold">{formatCAD(request.additional_fee)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200">
              <span>Frais de service (12 %)</span>
              <span>{formatCAD(request.platform_fee || 0)}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Taxes canadiennes (TPS + TVQ / TVH)</span>
              <span>{formatCAD(request.tax_amount || 0)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-[#181528] pt-2 border-t border-slate-300">
              <span>Total CAD</span>
              <span className="text-[#5e17eb] font-black">{formatCAD(request.final_amount || 0)}</span>
            </div>
          </div>

          <button
            onClick={() => setShowPaymentModal(true)}
            className="mt-4 w-full bg-[#5e17eb] hover:bg-[#4c0ec4] active:scale-[0.98] text-white font-black py-4 px-6 rounded-2xl shadow-purple-cta flex items-center justify-center gap-2 text-base transition-all"
          >
            <CreditCard className="w-5 h-5" />
            <span>Confirmer & Payer ({formatCAD(request.final_amount || 0)})</span>
          </button>
        </div>
      )}

      {/* REÇU ÉLECTRONIQUE AVEC CODE-BARRES & AVIS */}
      {request.status === 'completed' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col gap-4 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#5e17eb]" />
              <h2 className="text-sm font-black text-[#181528]">Reçu électronique / Facture</h2>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
              PAYÉ EN TOTALITÉ
            </span>
          </div>

          {/* Graphique Code-barres SVG */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center flex flex-col items-center">
            <svg viewBox="0 0 200 40" className="w-48 h-10">
              {Array.from({ length: 38 }).map((_, i) => (
                <rect
                  key={i}
                  x={i * 5 + 2}
                  y="0"
                  width={i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1}
                  height="40"
                  fill="#5e17eb"
                />
              ))}
            </svg>
            <span className="font-mono text-[10px] text-slate-500 mt-1 tracking-widest uppercase">
              #MM-CAN-{request.id.slice(-6)}
            </span>
          </div>

          {/* Détails du reçu */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Client</span>
              <span className="font-bold text-slate-800">{request.customer_name}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Véhicule</span>
              <span className="font-bold text-slate-800">
                {request.vehicle?.year} {request.vehicle?.make} {request.vehicle?.model}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Service</span>
              <span className="font-bold text-slate-800 capitalize">
                {request.service_type.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
              <span>Total payé (CAD)</span>
              <span className="text-[#5e17eb] font-black">{formatCAD(request.final_amount || 0)}</span>
            </div>
          </div>

          {/* Évaluation 5 étoiles */}
          {!reviewSubmitted ? (
            <form onSubmit={handleReviewSubmit} className="pt-3 border-t border-slate-100 flex flex-col gap-3">
              <label className="text-xs font-black text-[#181528] text-center">
                Comment s&apos;est passée l&apos;intervention avec {mechanic.first_name} ?
              </label>

              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingValue(star)}
                    className="p-1 transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= ratingValue ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Laissez un commentaire sur le service (optionnel)..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-3 text-xs text-[#181528] focus:border-[#5e17eb] outline-none"
              />

              <button
                type="submit"
                className="w-full bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black py-3 rounded-2xl text-xs shadow-purple-cta active:scale-98 transition-all"
              >
                Envoyer mon avis
              </button>
            </form>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-center text-xs text-emerald-700 font-bold">
              ✓ Merci d&apos;avoir évalué {mechanic.first_name} !
            </div>
          )}

          <button
            onClick={() => router.push('/app')}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-xs"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      )}

      {/* MODAL DE PAIEMENT STRIPE */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 w-full max-w-md shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#5e17eb]" />
                <span className="text-xs font-black text-[#181528] uppercase tracking-wider">
                  Paiement Sécurisé Stripe (CAD)
                </span>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                Annuler
              </button>
            </div>

            <div className="bg-[#f8f9fd] rounded-2xl p-4 border border-slate-100">
              <p className="text-xs text-slate-500">Montant total à débiter :</p>
              <p className="text-3xl font-black text-[#181528] mt-1">
                {formatCAD(request.final_amount || 0)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Traité par Stripe Canada en CAD • Toutes taxes incluses
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Carte de crédit</label>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <span className="font-mono text-xs font-bold text-slate-800">•••• •••• •••• 4242</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">12/28</span>
              </div>
            </div>

            <button
              onClick={handlePayNow}
              disabled={isPaying}
              className="w-full bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-purple-cta text-sm transition-all active:scale-[0.98]"
            >
              {isPaying ? 'Traitement du paiement CAD...' : `Autoriser & Payer ${formatCAD(request.final_amount || 0)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
