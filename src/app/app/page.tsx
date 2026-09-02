'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useToast } from '@/components/ui/ToastProvider';
import {
  Wrench,
  Car,
  ChevronRight,
  ShieldCheck,
  Plus,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Search,
  SlidersHorizontal,
  Star,
  Heart,
  Zap,
  BatteryCharging,
  Disc,
  ShieldAlert,
  Droplets,
  Cpu,
  Flame,
  CheckCircle2,
  Bell,
  ChevronDown,
  AlertTriangle,
  Settings,
} from 'lucide-react';
import { formatCAD, getStatusBadge } from '@/lib/utils';
import { SERVICE_DEFINITIONS, CANADIAN_CITIES } from '@/lib/constants';

export default function CustomerHomePage() {
  const { currentUser, primaryVehicle, vehicles, activeCustomerRequest, mechanics } = useApp();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [savedFavorites, setSavedFavorites] = useState<string[]>(['mech-001']);
  const [selectedCity, setSelectedCity] = useState('Montréal, QC');
  const [showCityPicker, setShowCityPicker] = useState(false);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
    <div className="flex flex-col gap-4 -mx-4 -mt-3 pb-6">
      {/* En-tête Violet Royal avec courbes topographiques, Localisation et Recherche */}
      <div className="relative bg-gradient-to-b from-[#5610d8] via-[#5e17eb] to-[#6822f3] text-white rounded-b-[36px] p-5 pt-4 shadow-purple-cta overflow-hidden flex flex-col gap-4">
        {/* Lignes topographiques décoratives en arrière-plan */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-15"
          viewBox="0 0 400 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M-50 40 C 80 10, 180 80, 450 20" stroke="white" strokeWidth="1.5" />
          <path d="M-30 90 C 120 50, 220 130, 450 70" stroke="white" strokeWidth="1.5" />
          <path d="M-20 140 C 140 100, 260 180, 450 120" stroke="white" strokeWidth="1.5" />
          <path d="M-10 190 C 160 150, 300 230, 450 170" stroke="white" strokeWidth="1.5" />
        </svg>

        {/* Barre supérieure : Localisation & Cloche de notification */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-purple-200 font-medium">Location</span>
            <button
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="flex items-center gap-1.5 text-sm font-black text-white hover:text-purple-200 transition-colors mt-0.5"
            >
              <span className="text-amber-400 text-sm">📍</span>
              <span>{selectedCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-purple-200" />
            </button>
          </div>

          {/* Cloche avec badge rouge */}
          <button
            onClick={() =>
              toast({
                title: 'Mécaniciens en service',
                message: '3 mécaniciens mobiles certifiés sont actuellement disponibles près de votre position.',
                type: 'wrench',
              })
            }
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-sm relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#5e17eb]" />
          </button>
        </div>

        {/* Menu déroulant des villes */}
        {showCityPicker && (
          <div className="relative z-50 bg-white text-[#181528] border border-slate-100 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95">
            <p className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Changer de ville canadienne
            </p>
            {CANADIAN_CITIES.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setSelectedCity(`${c.name}, ${c.province}`);
                  setShowCityPicker(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#181528] hover:bg-[#f3ebff] hover:text-[#5e17eb] font-bold flex items-center justify-between rounded-xl"
              >
                <span>{c.name}, {c.province}</span>
                {selectedCity.startsWith(c.name) && (
                  <span className="text-[#5e17eb] font-black">✓</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Barre de recherche + Bouton Filtre (Fidèle à la maquette) */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#5e17eb] absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-[#181528] border-none rounded-2xl pl-11 pr-4 py-3 text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-purple-300 outline-none shadow-sm font-medium"
            />
          </div>

          <Link
            href="/app/explore"
            className="w-11 h-11 rounded-2xl bg-white text-[#5e17eb] hover:bg-[#f3ebff] flex items-center justify-center shrink-0 shadow-md transition-colors"
            title="Filtres & Carte"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 flex flex-col gap-5 -mt-1">
        {/* SECTION 1: Special Offers (Offres Spéciales avec photo détourée) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#181528] tracking-tight">Special Offers</h2>
            <Link href="/app/request" className="text-xs font-bold text-[#5e17eb] hover:underline">
              See All
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-[#f4f5f8] border border-slate-100 p-5 shadow-card flex items-center justify-between">
            {/* Texture de points discrète */}
            <div
              className="absolute top-2 left-2 w-32 h-20 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#5e17eb 1px, transparent 1px)',
                backgroundSize: '8px 8px',
              }}
            />

            {/* Texte et bouton à gauche */}
            <div className="relative z-10 max-w-[190px]">
              <div className="inline-block bg-white px-2.5 py-0.5 rounded-full text-[9px] font-bold text-slate-700 shadow-sm mb-2">
                Today&apos;s Offers
              </div>

              <h3 className="text-sm font-black text-[#181528] leading-tight tracking-tight">
                Get Special Offer
              </h3>

              <p className="text-xs text-slate-600 mt-1 font-medium">
                Up to <span className="text-xl font-black text-[#181528]">20</span>
                <span className="text-xl font-black text-[#ff7a00]">%</span>
              </p>

              <Link
                href="/app/request"
                className="inline-block mt-3 bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black text-xs px-5 py-2 rounded-full shadow-purple-cta active:scale-95 transition-all"
              >
                Claim
              </Link>
            </div>

            {/* Photo de la mécanicienne dans un arc stylisé (comme la maquette) */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white shadow-md bg-white relative">
                <img
                  src="/images/special_offer_mechanic.jpg"
                  alt="Mécanicienne Pro"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* Indicateurs de carrousel (1 pilule violette + 3 cercles lavande) */}
          <div className="flex items-center justify-center gap-1.5 pt-0.5">
            <span className="w-5 h-1.5 rounded-full bg-[#5e17eb]" />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-200" />
          </div>
        </div>

        {/* Mission en direct si active */}
        {activeCustomerRequest && (
          <Link
            href={`/app/services/${activeCustomerRequest.id}`}
            className="bg-gradient-to-r from-[#5e17eb] to-[#7c3aed] text-white rounded-3xl p-4 shadow-purple-cta flex items-center justify-between group animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white text-[#5e17eb] flex items-center justify-center shrink-0 shadow-sm">
                <Wrench className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">
                    Mission en cours
                  </span>
                  <span className="text-xs font-bold text-white">
                    {getStatusBadge(activeCustomerRequest.status).label}
                  </span>
                </div>
                <p className="text-xs font-bold mt-0.5">
                  {activeCustomerRequest.vehicle?.make} {activeCustomerRequest.vehicle?.model} • ~{activeCustomerRequest.eta_minutes || 20} min d&apos;arrivée
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        )}

        {/* SECTION 2: Services (4 Boutons circulaires stylisés) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#181528] tracking-tight">Services</h2>
            <Link href="/app/request" className="text-xs font-bold text-[#5e17eb] hover:underline">
              See all
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              {
                type: 'mechanic_repair',
                label: 'Car Ser..',
                fullLabel: 'Entretien Auto',
                icon: (
                  <div className="relative flex items-center justify-center">
                    <Car className="w-5 h-5 text-[#5e17eb]" />
                    <Wrench className="w-3.5 h-3.5 text-[#ff7a00] absolute -bottom-1 -right-1" />
                  </div>
                ),
              },
              {
                type: 'bodywork_dent',
                label: 'Dent Rem..',
                fullLabel: 'Débosselage',
                icon: (
                  <div className="relative flex items-center justify-center text-[#5e17eb]">
                    <Disc className="w-6 h-6 text-[#5e17eb]" />
                    <Sparkles className="w-3 h-3 text-[#ff7a00] absolute top-0 right-0" />
                  </div>
                ),
              },
              {
                type: 'oil_change',
                label: 'Oil Cha..',
                fullLabel: 'Vidange & Huile',
                icon: (
                  <div className="relative flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-[#5e17eb]" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#ff7a00]" />
                  </div>
                ),
              },
              {
                type: 'car_wash',
                label: 'Car Was..',
                fullLabel: 'Lavage Mobile',
                icon: (
                  <div className="relative flex items-center justify-center">
                    <Car className="w-5 h-5 text-[#5e17eb]" />
                    <div className="absolute -top-1 flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-[#ff7a00]" />
                      <span className="w-1 h-1 rounded-full bg-[#ff7a00]" />
                      <span className="w-1 h-1 rounded-full bg-[#ff7a00]" />
                    </div>
                  </div>
                ),
              },
            ].map((cat) => (
              <Link
                key={cat.type}
                href={`/app/request?service=${cat.type}`}
                className="flex flex-col items-center text-center gap-1.5 group"
              >
                <div className="w-14 h-14 rounded-full bg-[#f8f9fd] group-hover:bg-[#f3ebff] border border-slate-100 group-hover:border-purple-200 flex items-center justify-center transition-all duration-200 shadow-sm group-hover:scale-105">
                  {cat.icon}
                </div>
                <span className="text-[11px] font-bold text-[#181528] leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* SECTION 3: Service Providers (Prestataires avec photo d'équipe et coeur favori) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#181528] tracking-tight">Service Providers</h2>
            <Link href="/app/explore" className="text-xs font-bold text-[#5e17eb] hover:underline">
              See all
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {mechanics.map((mech, index) => {
              const isFav = savedFavorites.includes(mech.id);

              return (
                <Link
                  key={mech.id}
                  href={`/app/mechanics/${mech.id}`}
                  className="bg-white border border-slate-100 rounded-3xl p-3.5 shadow-card hover:shadow-card-hover transition-all flex flex-col gap-3 group relative"
                >
                  {/* Photo bannière avec bouton coeur rouge en haut à droite */}
                  <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={
                        index === 0
                          ? '/images/service_provider_mechanics.jpg'
                          : 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80'
                      }
                      alt={mech.business_name || mech.first_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badge Sceau Rouge */}
                    <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md text-[#5e17eb] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                      Sceau Rouge
                    </span>

                    {/* Bouton Coeur / Favori (Fidèle à la maquette) */}
                    <button
                      onClick={(e) => toggleFavorite(mech.id, e)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-md active:scale-90 transition-transform"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav ? 'fill-red-500 text-red-500' : 'text-slate-700 hover:text-red-500'
                        }`}
                      />
                    </button>

                    {/* Note en overlay sombre */}
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{mech.rating.toFixed(1)}</span>
                      <span className="text-slate-300">({mech.jobs_completed} reviews)</span>
                    </div>
                  </div>

                  {/* Infos du prestataire */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-sm text-[#181528] group-hover:text-[#5e17eb] transition-colors">
                        {mech.business_name || `${mech.first_name} ${mech.last_name}`}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#5e17eb]" />
                        <span>{mech.city}, {mech.province} • Service Mobile ({mech.service_radius_km} km)</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-[#5e17eb]">
                        Dès {formatCAD(89)}
                      </span>
                      <span className="block text-[10px] text-slate-400">Diagnostic</span>
                    </div>
                  </div>

                  {/* Raccourci & Bouton Réserver */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#5e17eb]" />
                      <span>⏱ ~15 min • 3,5 km</span>
                    </div>

                    <span className="text-[11px] font-black text-white bg-[#5e17eb] group-hover:bg-[#4c0ec4] px-4 py-1.5 rounded-full transition-colors shadow-purple-cta">
                      Réserver
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
