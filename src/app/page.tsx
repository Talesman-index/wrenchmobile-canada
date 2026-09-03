'use client';

import React from 'react';
import Link from 'next/link';
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Zap,
  BatteryCharging,
  Disc,
  ShieldAlert,
  Droplets,
  Cpu,
  Sparkles,
  Flame,
  Phone,
  Car,
  AlertTriangle,
  Settings,
} from 'lucide-react';
import { SERVICE_DEFINITIONS, CANADIAN_CITIES } from '@/lib/constants';
import { formatCAD } from '@/lib/utils';
import { useApp } from '@/lib/store';

export default function LandingPage() {
  const { setCurrentRole } = useApp();

  const iconsMap: Record<string, any> = {
    Zap: Zap,
    BatteryCharging: BatteryCharging,
    Disc: Disc,
    ShieldAlert: ShieldAlert,
    Droplets: Droplets,
    Cpu: Cpu,
    AlertTriangle: AlertTriangle,
    Wrench: Wrench,
    Settings: Settings,
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f8f9fd] text-[#181528] pb-20">
      {/* Bannière d'assistance Canada */}
      <div className="bg-[#f3ebff] border-b border-purple-100 px-4 py-2 text-center text-xs text-[#5e17eb] flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>
          <strong className="text-[#181528]">Service Actif au Canada</strong> — Mécaniciens mobiles disponibles à Montréal, Québec, Gatineau, Ottawa & Toronto
        </span>
      </div>

      {/* Section Hero */}
      <section className="relative px-4 pt-10 pb-14 md:pt-20 md:pb-24 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          {/* Badge Pilule */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-black text-[#181528] mb-5 shadow-card">
            <Sparkles className="w-3.5 h-3.5 text-[#5e17eb]" />
            <span>N°1 de la mécanique mobile sur demande au Canada</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#181528] max-w-2xl leading-[1.12]">
            Panne de voiture ? <br />
            <span className="bg-gradient-to-r from-[#5e17eb] via-[#7c3aed] to-[#5e17eb] bg-clip-text text-transparent">
              Le mécanicien vient à vous.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
            Réservez un mécanicien automobile certifié Sceau Rouge et faites diagnostiquer ou réparer votre véhicule directement dans votre allée ou au bureau. Aucun remorquage nécessaire.
          </p>

          {/* Boutons d'action */}
          <div className="mt-7 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            <Link
              href="/app"
              onClick={() => setCurrentRole('customer')}
              className="w-full sm:w-auto flex-1 bg-[#5e17eb] hover:bg-[#4c0ec4] active:scale-[0.98] text-white font-black py-4 px-6 rounded-2xl shadow-purple-cta flex items-center justify-center gap-2 text-sm transition-all"
            >
              <Wrench className="w-4 h-4" />
              <span>Demander un mécanicien</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/mechanic/onboarding"
              onClick={() => setCurrentRole('mechanic')}
              className="w-full sm:w-auto bg-white hover:bg-[#f3ebff] border border-slate-200 hover:border-purple-200 text-[#181528] hover:text-[#5e17eb] font-bold py-4 px-5 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-card transition-all"
            >
              <span>Devenir mécanicien</span>
            </Link>
          </div>

          {/* Badges de Réassurance */}
          <div className="mt-10 grid grid-cols-3 gap-3 text-center max-w-md w-full pt-6 border-t border-slate-200">
            <div className="bg-white p-3 rounded-2xl shadow-card border border-slate-100 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-[#5e17eb] font-black text-xl">
                <span>4,9</span>
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Note moyenne</p>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-card border border-slate-100">
              <p className="text-xl font-black text-[#181528]">25 min</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Arrivée moyenne</p>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-card border border-slate-100">
              <p className="text-xl font-black text-emerald-600">100 %</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Prix transparents</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça fonctionne */}
      <section className="px-4 py-12 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-xs uppercase tracking-widest text-[#5e17eb] font-black mb-1">Simple & Rapide</h2>
          <p className="text-2xl font-black text-[#181528]">Comment fonctionne MécanoMobile</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-card flex flex-col items-start">
            <span className="w-8 h-8 rounded-2xl bg-[#f3ebff] text-[#5e17eb] font-black flex items-center justify-center text-sm mb-3">
              1
            </span>
            <h3 className="text-base font-black text-[#181528] mb-1">Indiquez votre problème</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sélectionnez votre voiture, précisez le symptôme (ne démarre pas, batterie, crevaison, freins) et votre localisation.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-card flex flex-col items-start">
            <span className="w-8 h-8 rounded-2xl bg-[#5e17eb] text-white font-black flex items-center justify-center text-sm mb-3">
              2
            </span>
            <h3 className="text-base font-black text-[#181528] mb-1">Trouvez un pro à proximité</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Les mécaniciens certifiés à proximité reçoivent votre demande. Suivez l’arrivée du technicien en direct sur la carte.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-card flex flex-col items-start">
            <span className="w-8 h-8 rounded-2xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-sm mb-3">
              3
            </span>
            <h3 className="text-base font-black text-[#181528] mb-1">Réparé sur place</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Votre mécanicien effectue l’intervention avec ses outils et pièces certifiées. Paiement sécurisé en CAD via Stripe.
            </p>
          </div>
        </div>
      </section>

      {/* Services Populaires */}
      <section className="px-4 py-12 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-[#5e17eb] font-black mb-1">Atelier Mobile</h2>
            <p className="text-2xl font-black text-[#181528]">Services Automobiles Populaires</p>
          </div>
          <Link
            href="/app/request"
            onClick={() => setCurrentRole('customer')}
            className="text-xs font-bold text-[#5e17eb] flex items-center gap-1 hover:underline"
          >
            <span>Commander un service</span>
            <ChevronRight className="w-4 h-4 text-[#5e17eb]" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SERVICE_DEFINITIONS.slice(0, 6).map((service) => {
            const Icon = iconsMap[service.iconName] || Wrench;

            return (
              <Link
                key={service.type}
                href={`/app/request?service=${service.type}`}
                onClick={() => setCurrentRole('customer')}
                className="bg-white hover:bg-slate-50 border border-slate-100 hover:border-purple-200 rounded-3xl p-4 transition-all shadow-card hover:shadow-card-hover group flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-[#f3ebff] text-[#5e17eb] group-hover:bg-[#5e17eb] group-hover:text-white flex items-center justify-center mb-3 transition-all">
                    <Icon className="w-5 h-5 stroke-[2.2] group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-black text-[#181528] text-sm transition-colors leading-tight">
                    {service.shortLabel}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{service.shortDesc}</p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-black text-[#5e17eb]">Dès {formatCAD(service.basePriceCAD)}</span>
                  <span className="text-slate-400 font-mono">{service.estimatedDuration}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Espace Mécaniciens Partenaires */}
      <section className="px-4 py-8 max-w-4xl mx-auto w-full">
        <div className="bg-[#181528] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-card border border-purple-950">
          <div className="max-w-lg relative z-10">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 bg-white/10 px-3 py-1 rounded-full">
              Pour Mécaniciens Certifiés
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-3 tracking-tight">
              Prenez la route avec votre savoir-faire.
            </h2>
            <p className="text-slate-300 text-xs mt-2 leading-relaxed">
              Générez des revenus plus élevés selon votre propre horaire. Conservez 88 % des montants de main-d&apos;œuvre et de pièces avec versements directs en dollars canadiens (CAD).
            </p>

            <div className="mt-6">
              <Link
                href="/mechanic/onboarding"
                onClick={() => setCurrentRole('mechanic')}
                className="inline-flex items-center gap-2 bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black py-3.5 px-6 rounded-2xl shadow-purple-cta text-xs transition-all active:scale-95"
              >
                <span>Rejoindre comme mécanicien</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Villes Desservies & Pied de page */}
      <footer className="px-4 pt-8 max-w-4xl mx-auto w-full text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Disponible dans les grandes régions métropolitaines canadiennes
        </p>
        <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto mb-6">
          {CANADIAN_CITIES.map((city) => (
            <span
              key={city.name}
              className="text-xs px-3 py-1.5 bg-white border border-slate-200 text-[#181528] rounded-full font-bold shadow-sm flex items-center gap-1.5"
            >
              <MapPin className="w-3 h-3 text-[#5e17eb] shrink-0" />
              <span>{city.name}, {city.province}</span>
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} MécanoMobile Canada Inc. Tous droits réservés. Application Progressive Web App (PWA).
        </p>
      </footer>
    </div>
  );
}
