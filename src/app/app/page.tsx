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
    <div className="flex flex-col gap-4 -mx-4 -mt-3 pb-3">
      {/* En-tête Oxford Blue courbé avec sélecteur de ville et cloche */}
      <div className="bg-[#0b1b32] text-white rounded-b-[32px] p-5 pt-4 shadow-oxford-cta flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/app/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/40 shadow-sm shrink-0">
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt="Profil"
                className="w-full h-full object-cover"
              />
            </Link>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Localisation</p>
              <button
                onClick={() => setShowCityPicker(!showCityPicker)}
                className="flex items-center gap-1 text-xs font-black text-white hover:text-[#facc15] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#facc15]" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          <button
            onClick={() =>
              toast({
                title: 'Alerte Mécano en direct',
                message: '1 mécanicien mobile certifié Sceau Rouge est disponible à 3,5 km de votre adresse.',
                type: 'wrench',
              })
            }
            className="relative w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md flex items-center justify-center text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#facc15] rounded-full ring-2 ring-[#0b1b32]" />
          </button>
        </div>

        {/* Menu déroulant des villes */}
        {showCityPicker && (
          <div className="bg-white text-[#0b1b32] border border-slate-100 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
            <p className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Changer de ville
            </p>
            {CANADIAN_CITIES.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setSelectedCity(`${c.name}, ${c.province}`);
                  setShowCityPicker(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-[#0b1b32] hover:bg-yellow-50 font-bold flex items-center justify-between rounded-xl"
              >
                <span>{c.name}, {c.province}</span>
                {selectedCity.startsWith(c.name) && (
                  <span className="text-[#0b1b32] font-black">✓</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Barre de recherche + Bouton Filtre */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Rechercher service, mécanicien ou symptôme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-[#0b1b32] border-none rounded-2xl pl-10 pr-4 py-3 text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-[#facc15] outline-none shadow-sm"
            />
          </div>

          <Link
            href="/app/explore"
            className="w-11 h-11 rounded-2xl bg-[#facc15] hover:bg-[#eab308] text-[#0b1b32] flex items-center justify-center shrink-0 shadow-yellow-cta transition-colors"
            title="Ouvrir la carte interactive"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 flex flex-col gap-4">
        {/* Bannière Offres Spéciales */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b1b32] via-[#162e52] to-[#0b1b32] text-white p-5 shadow-card">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-40 h-40 rounded-full bg-[#facc15]/20 blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-[210px]">
            <div className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-black text-[#facc15] mb-2 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#facc15]" />
              <span>Offre Spéciale Canada</span>
            </div>

            <h2 className="text-lg font-black leading-tight tracking-tight">
              Profitez d’un rabais <br />
              <span className="text-[#facc15]">Jusqu’à 30 % DE RABAIS</span>
            </h2>
            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
              Dépannage mécanique mobile rapide à votre porte ou au travail.
            </p>

            <Link
              href="/app/request"
              className="inline-block mt-3 bg-[#facc15] hover:bg-[#eab308] text-[#0b1b32] font-black text-xs px-4 py-2 rounded-full shadow-yellow-cta active:scale-95 transition-all"
            >
              En profiter
            </Link>
          </div>

          {/* Visuel du mécanicien */}
          <div className="absolute right-3 bottom-3 top-3 w-28 flex items-center justify-center">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80"
                alt="Mécanicien Mobile"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 bg-[#facc15] text-[#0b1b32] font-black text-[9px] px-1.5 py-0.2 rounded-full">
                -30 %
              </span>
            </div>
          </div>
        </div>

        {/* Bannière de mission en direct si active */}
        {activeCustomerRequest && (
          <Link
            href={`/app/services/${activeCustomerRequest.id}`}
            className="bg-gradient-to-r from-[#0b1b32] via-[#162e52] to-[#0b1b32] text-white rounded-3xl p-4 shadow-oxford-cta flex items-center justify-between group animate-pulse border-2 border-[#facc15]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#facc15] text-[#0b1b32] flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-[#facc15] text-[#0b1b32] px-2 py-0.5 rounded-full">
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
            <ChevronRight className="w-5 h-5 text-[#facc15] group-hover:translate-x-1 transition-transform" />
          </Link>
        )}

        {/* Catégories de Services */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-black text-[#0b1b32] tracking-tight">Catégories de services</h2>
              <p className="text-[11px] text-slate-400">Interventions rapides à domicile</p>
            </div>
            <Link href="/app/request" className="text-xs font-black text-[#0b1b32] hover:underline">
              Voir tout
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {SERVICE_DEFINITIONS.slice(0, 8).map((srv) => {
              const Icon = iconsMap[srv.iconName] || Wrench;

              return (
                <Link
                  key={srv.type}
                  href={`/app/request?service=${srv.type}`}
                  className="bg-white hover:bg-slate-50 border border-slate-100 hover:border-yellow-300 rounded-2xl p-3 flex flex-col items-center text-center shadow-card hover:shadow-card-hover transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0b1b32]/5 group-hover:bg-[#0b1b32] text-[#0b1b32] group-hover:text-[#facc15] flex items-center justify-center mb-2 transition-all duration-200 shadow-sm">
                    <Icon className="w-5 h-5 stroke-[2.2] group-hover:scale-110 transition-transform" />
                  </div>

                  <span className="text-[11px] font-bold text-[#0b1b32] leading-tight text-center">
                    {srv.shortLabel}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Véhicule Principal & CTA Demande 1-Tap */}
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#0b1b32] text-white flex items-center justify-center">
                <Car className="w-5 h-5 text-[#facc15]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Véhicule sélectionné
                </p>
                <p className="text-xs font-black text-[#0b1b32]">
                  {primaryVehicle ? `${primaryVehicle.year} ${primaryVehicle.make} ${primaryVehicle.model}` : 'Ajouter un véhicule'}
                </p>
              </div>
            </div>
            <Link href="/app/vehicles" className="text-[11px] font-black text-[#0b1b32] hover:underline">
              Garage
            </Link>
          </div>

          <Link
            href="/app/request"
            className="w-full bg-[#0b1b32] hover:bg-[#162e52] active:scale-[0.98] text-white font-black py-3.5 px-5 rounded-2xl shadow-oxford-cta flex items-center justify-between text-xs transition-all"
          >
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#facc15]" />
              <span>Demander un mécanicien mobile</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#facc15]" />
          </Link>
        </div>

        {/* Mécaniciens Mobiles à Proximité */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-black text-[#0b1b32] tracking-tight">Mécaniciens mobiles à proximité</h2>
              <p className="text-[11px] text-slate-400">Techniciens vérifiés Sceau Rouge</p>
            </div>
            <Link href="/app/explore" className="text-xs font-black text-[#0b1b32] hover:underline">
              Voir carte
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {mechanics.map((mech) => {
              const isFav = savedFavorites.includes(mech.id);

              return (
                <Link
                  key={mech.id}
                  href={`/app/mechanics/${mech.id}`}
                  className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col gap-3 group relative"
                >
                  <div className="relative h-28 w-full rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={
                        mech.id === 'mech-001'
                          ? 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80'
                          : 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80'
                      }
                      alt={mech.business_name || mech.first_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <span className="absolute top-2.5 left-2.5 bg-[#facc15] text-[#0b1b32] text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                      🏷️ RABAIS 10 %
                    </span>

                    <button
                      onClick={(e) => toggleFavorite(mech.id, e)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-sm"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
                    </button>

                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[10px] font-bold">
                      <Star className="w-3 h-3 fill-[#facc15] text-[#facc15]" />
                      <span>{mech.rating.toFixed(1)}</span>
                      <span className="text-slate-300">({mech.jobs_completed} avis)</span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-sm text-[#0b1b32] transition-colors">
                        {mech.business_name || `${mech.first_name} ${mech.last_name}`}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#eab308]" />
                        <span>{mech.city}, {mech.province} • Rayon {mech.service_radius_km} km</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-[#0b1b32]">
                        Dès {formatCAD(89)}
                      </span>
                      <span className="block text-[10px] text-slate-400">Diagnostic</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-[#eab308]" />
                      <span>⏱ ~15 min • 3,5 km</span>
                    </div>

                    <span className="text-[11px] font-black text-[#0b1b32] bg-[#facc15] hover:bg-[#eab308] px-3.5 py-1.5 rounded-full transition-colors shadow-sm">
                      Voir profil & Réserver
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
