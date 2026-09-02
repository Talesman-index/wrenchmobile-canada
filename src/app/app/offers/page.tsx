'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import {
  ChevronLeft,
  Tag,
  Copy,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const ALL_OFFERS = [
  {
    id: 'promo-1',
    tag: 'Offre du Jour',
    code: 'FIRST20',
    title: 'Diagnostic Automobile Complet',
    discount: '20 % DE RABAIS',
    desc: 'Valable sur votre tout premier diagnostic mobile OBD-II et bilan santé 40 points à votre domicile ou bureau.',
    image: '/images/special_offer_mechanic.jpg',
    validUntil: '30 Septembre 2026',
    ctaHref: '/app/request',
  },
  {
    id: 'promo-2',
    tag: 'Batterie & Démarrage',
    code: 'BOOST25',
    title: 'Pack Batterie & Installation Neuve',
    discount: '25 % DE RABAIS',
    desc: 'Survoltage d’urgence ou remplacement de batterie neuve livrée et testée directement dans votre allée.',
    image: '/images/offer_battery_mechanic.jpg',
    validUntil: '15 Octobre 2026',
    ctaHref: '/app/request?service=battery_jump',
  },
  {
    id: 'promo-3',
    tag: 'Freins & Sécurité',
    code: 'BRAKES30',
    title: 'Forfait Plaquettes & Disques',
    discount: '30 $ DE RÉDUCTION',
    desc: 'Remplacement de plaquettes et disques de freins certifiés par des mécaniciens Sceau Rouge.',
    image: '/images/offer_brakes_mechanic.jpg',
    validUntil: '31 Octobre 2026',
    ctaHref: '/app/request?service=brake_service',
  },
  {
    id: 'promo-4',
    tag: 'Entretien Mobile',
    code: 'CHECKUP69',
    title: 'Forfait Vidange Synthétique & Check-Up',
    discount: 'DÈS 69 $ TOUT COMPRIS',
    desc: 'Vidange huile synthétique premium + remplacement filtre et révision générale sans déplacement.',
    image: '/images/service_provider_mechanics.jpg',
    validUntil: 'Permanent',
    ctaHref: '/app/request?service=oil_change',
  },
];

export default function SpecialOffersPage() {
  const router = useRouter();
  const { toast } = useToast();

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    toast({
      title: 'Code Promo Copié !',
      message: `Le code promo "${code}" a été copié. Il sera automatiquement appliqué à votre commande.`,
      type: 'success',
    });
  };

  return (
    <div className="flex flex-col gap-4 -mx-4 -mt-3 pb-24">
      {/* En-tête Violet */}
      <div className="bg-gradient-to-b from-[#5610d8] via-[#5e17eb] to-[#6822f3] text-white rounded-b-[36px] p-5 pt-4 shadow-purple-cta flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h1 className="text-base font-black text-white tracking-tight">Offres Spéciales & Bons Plans</h1>
            <p className="text-[11px] text-purple-200">Rabais exclusifs sur vos réparations mobiles</p>
          </div>

          <div className="w-10" />
        </div>
      </div>

      {/* Liste des offres */}
      <div className="px-4 flex flex-col gap-4 -mt-1">
        {ALL_OFFERS.map((offer) => (
          <div
            key={offer.id}
            className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col gap-3.5 relative overflow-hidden"
          >
            {/* Haut de la carte */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <span className="text-[10px] font-black bg-[#f3ebff] text-[#5e17eb] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {offer.tag}
                </span>

                <h2 className="text-sm font-black text-[#181528] mt-1.5 leading-snug">
                  {offer.title}
                </h2>

                <p className="text-xs font-black text-[#5e17eb] mt-0.5">
                  {offer.discount}
                </p>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {offer.desc}
                </p>
              </div>

              {/* Photo détourée */}
              <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md bg-white">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Code promo et bouton d'action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => copyCode(offer.code)}
                className="flex items-center gap-1.5 bg-[#f8f9fd] hover:bg-[#f3ebff] border border-dashed border-purple-300 text-[#5e17eb] px-3 py-1.5 rounded-xl text-xs font-mono font-black active:scale-95 transition-all"
                title="Copier le code promo"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Code : {offer.code}</span>
                <Copy className="w-3 h-3 text-slate-400 ml-1" />
              </button>

              <Link
                href={offer.ctaHref}
                className="bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black text-xs px-5 py-2 rounded-full shadow-purple-cta active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>Utiliser l&apos;offre</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
