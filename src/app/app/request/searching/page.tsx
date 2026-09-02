'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Wrench, Car, MapPin, X, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

function SearchingScreenContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get('id');

  const { serviceRequests, cancelRequest } = useApp();
  const [dots, setDots] = useState('');

  const targetRequest =
    serviceRequests.find((r) => r.id === requestId) ||
    serviceRequests.find((r) => r.status === 'searching') ||
    serviceRequests[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Surveiller le statut : si accepté, rediriger vers le suivi de mission
  useEffect(() => {
    if (targetRequest && targetRequest.status !== 'searching' && targetRequest.status !== 'cancelled') {
      const timer = setTimeout(() => {
        router.push(`/app/services/${targetRequest.id}`);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [targetRequest?.status, targetRequest?.id, router]);

  const handleCancel = () => {
    if (targetRequest) {
      cancelRequest(targetRequest.id);
    }
    router.push('/app');
  };

  if (!targetRequest) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <p className="text-slate-500 text-sm">Aucune recherche active en cours.</p>
        <button
          onClick={() => router.push('/app')}
          className="mt-4 bg-[#e5a910] text-[#0c1f38] text-xs font-black px-4 py-2 rounded-2xl"
        >
          Retour à l&apos;accueil
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between pt-4">
      {/* Animation du radar avec ondes violettes */}
      <div className="flex flex-col items-center text-center my-auto relative py-10">
        <div className="relative w-56 h-56 flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-purple-300 animate-radar" />
          <div
            className="absolute inset-4 rounded-full border-2 border-purple-400 animate-radar"
            style={{ animationDelay: '0.8s' }}
          />
          <div
            className="absolute inset-8 rounded-full border-2 border-purple-500 animate-radar"
            style={{ animationDelay: '1.6s' }}
          />

          <div className="w-20 h-20 rounded-full bg-[#5e17eb] border-4 border-white shadow-2xl shadow-purple-500/50 flex items-center justify-center text-white relative z-10 font-black">
            <Wrench className="w-9 h-9 animate-bounce text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-[#181528] tracking-tight">
          Recherche d’un mécanicien à proximité{dots}
        </h1>
        <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
          Diffusion de votre demande aux techniciens mobiles certifiés Sceau Rouge en service à {targetRequest.city || 'Montréal'}.
        </p>
      </div>

      {/* Carte récapitulative */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-card-hover flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#f3ebff] flex items-center justify-center text-[#5e17eb] shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-black text-[#181528]">
              {targetRequest.vehicle?.year} {targetRequest.vehicle?.make} {targetRequest.vehicle?.model}
            </p>
            <p className="text-[11px] text-slate-500 capitalize">
              {targetRequest.service_type.replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <p className="text-[11px] text-slate-600 line-clamp-1 flex-1">
            {targetRequest.address}
          </p>
        </div>

        {/* Bouton Annuler */}
        <div className="pt-2">
          <button
            onClick={handleCancel}
            className="w-full bg-[#f8f9fd] hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Annuler la demande</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SearchingScreenPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-xs">Recherche de mécaniciens à proximité...</div>}>
      <SearchingScreenContent />
    </Suspense>
  );
}
