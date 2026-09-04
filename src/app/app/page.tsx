'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useToast } from '@/components/ui/ToastProvider';
import {
  Wrench,
  Car,
  ChevronRight,
  ChevronLeft,
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
  X,
} from 'lucide-react';
import { formatCAD, getStatusBadge } from '@/lib/utils';
import { SERVICE_DEFINITIONS, CANADIAN_CITIES } from '@/lib/constants';
import ServiceIcon from '@/components/ui/ServiceIcon';

const SPECIAL_OFFERS = [
  {
    id: 'offer-1',
    tag: 'Offre du Jour',
    title: 'Diagnostic Mobile',
    discountPrefix: 'Jusqu’à',
    discountValue: '20',
    discountSuffix: '%',
    desc: 'Sur votre premier diagnostic complet à domicile ou au bureau.',
    image: '/images/special_offer_mechanic.jpg',
    ctaText: 'En profiter',
    ctaHref: '/app/request',
  },
  {
    id: 'offer-2',
    tag: 'Batterie & Démarrage',
    title: 'Pack Batterie Express',
    discountPrefix: 'Rabais',
    discountValue: '25',
    discountSuffix: '%',
    desc: 'Boost & remplacement de batterie livré et installé sur place.',
    image: '/images/offer_battery_mechanic.jpg',
    ctaText: 'En profiter',
    ctaHref: '/app/request?service=battery_jump',
  },
  {
    id: 'offer-3',
    tag: 'Freins & Sécurité',
    title: 'Plaquettes & Disques',
    discountPrefix: 'Économisez',
    discountValue: '30',
    discountSuffix: '$',
    desc: 'Changement de freins certifié Sceau Rouge directement chez vous.',
    image: '/images/offer_brakes_mechanic.jpg',
    ctaText: 'Réserver',
    ctaHref: '/app/request?service=brake_service',
  },
  {
    id: 'offer-4',
    tag: 'Entretien Mobile',
    title: 'Check-Up 40 Points',
    discountPrefix: 'Dès',
    discountValue: '69',
    discountSuffix: '$',
    desc: 'Triage complet et vidange sans vous déplacer au garage.',
    image: '/images/service_provider_mechanics.jpg',
    ctaText: 'Commander',
    ctaHref: '/app/request?service=oil_change',
  },
];

export default function CustomerHomePage() {
  const { currentUser, primaryVehicle, vehicles, activeCustomerRequest, mechanics } = useApp();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [savedFavorites, setSavedFavorites] = useState<string[]>(['mech-001']);
  const [selectedCity, setSelectedCity] = useState('Montréal, QC');
  const [showCityPicker, setShowCityPicker] = useState(false);

  // Modales "Voir tout"
  const [showAllServicesModal, setShowAllServicesModal] = useState(false);
  const [showAllOffersModal, setShowAllOffersModal] = useState(false);

  // État du carrousel d'offres spéciales
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Auto-play du slider toutes les 4,5 secondes
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SPECIAL_OFFERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Gestion du swipe tactile mobile (Touch gesture)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diff = touchStartXRef.current - touchEndXRef.current;
      const minSwipeDistance = 40;

      if (diff > minSwipeDistance) {
        setActiveSlide((prev) => (prev + 1) % SPECIAL_OFFERS.length);
      } else if (diff < -minSwipeDistance) {
        setActiveSlide((prev) => (prev === 0 ? SPECIAL_OFFERS.length - 1 : prev - 1));
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % SPECIAL_OFFERS.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? SPECIAL_OFFERS.length - 1 : prev - 1));
  };

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
            <span className="text-[11px] text-purple-200 font-medium">Localisation</span>
            <button
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="flex items-center gap-1.5 text-sm font-black text-white hover:text-purple-200 transition-colors mt-0.5"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
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

        {/* Barre de recherche + Bouton Filtre */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#5e17eb] absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Rechercher un service, garage ou panne..."
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
        {/* SECTION 1: Offres Spéciales (Carrousel interactif animé avec glissement / swipe) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#181528] tracking-tight">Offres Spéciales</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-[#f3ebff] hover:text-[#5e17eb] flex items-center justify-center text-slate-500 transition-colors"
                title="Offre précédente"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-[#f3ebff] hover:text-[#5e17eb] flex items-center justify-center text-slate-500 transition-colors"
                title="Offre suivante"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <Link
                href="/app/offers"
                className="text-xs font-bold text-[#5e17eb] hover:underline ml-1"
              >
                Voir tout
              </Link>
            </div>
          </div>

          {/* Conteneur Carrousel avec support Touch Swipe */}
          <div
            className="relative overflow-hidden rounded-3xl bg-[#f4f5f8] border border-slate-100 shadow-card cursor-grab active:cursor-grabbing select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Texture de points discrète en arrière-plan */}
            <div
              className="absolute top-2 left-2 w-36 h-24 opacity-15 pointer-events-none z-0"
              style={{
                backgroundImage: 'radial-gradient(#5e17eb 1px, transparent 1px)',
                backgroundSize: '8px 8px',
              }}
            />

            {/* Piste de glissement (Slider Track) */}
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {SPECIAL_OFFERS.map((offer) => (
                <div
                  key={offer.id}
                  className="w-full shrink-0 p-5 flex items-center justify-between relative z-10 min-w-full"
                >
                  {/* Texte et bouton à gauche */}
                  <div className="relative z-10 max-w-[190px]">
                    <div className="inline-block bg-white px-2.5 py-0.5 rounded-full text-[9px] font-bold text-slate-700 shadow-sm mb-2">
                      {offer.tag}
                    </div>

                    <h3 className="text-sm font-black text-[#181528] leading-tight tracking-tight">
                      {offer.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      {offer.discountPrefix}{' '}
                      <span className="text-xl font-black text-[#181528]">{offer.discountValue}</span>
                      <span className="text-xl font-black text-[#ff7a00]">{offer.discountSuffix}</span>
                    </p>

                    <Link
                      href={offer.ctaHref}
                      className="inline-block mt-3 bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black text-xs px-5 py-2 rounded-full shadow-purple-cta active:scale-95 transition-all"
                    >
                      {offer.ctaText}
                    </Link>
                  </div>

                  {/* Photo de l'offre dans l'arc circulaire stylisé */}
                  <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white shadow-md bg-white relative">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicateurs de carrousel interactifs */}
          <div className="flex items-center justify-center gap-1.5 pt-0.5">
            {SPECIAL_OFFERS.map((_, idx) => {
              const isActive = idx === activeSlide;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'w-6 h-1.5 rounded-full bg-[#5e17eb]'
                      : 'w-1.5 h-1.5 rounded-full bg-purple-200 hover:bg-purple-300'
                  }`}
                  title={`Aller à l'offre ${idx + 1}`}
                />
              );
            })}
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
            <div>
              <h2 className="text-base font-extrabold text-[#181528] tracking-tight">Services</h2>
              <p className="text-[11px] text-slate-400">Interventions rapides à domicile</p>
            </div>
            <Link
              href="/app/services-list"
              className="text-xs font-bold text-[#5e17eb] hover:underline"
            >
              Voir tout
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              {
                type: 'mechanic_repair',
                label: 'Entretien',
                fullLabel: 'Entretien Auto',
              },
              {
                type: 'bodywork_dent',
                label: 'Débosselage',
                fullLabel: 'Carrosserie',
              },
              {
                type: 'oil_change',
                label: 'Vidange',
                fullLabel: 'Vidange & Huile',
              },
              {
                type: 'car_wash',
                label: 'Lavage',
                fullLabel: 'Lavage Mobile',
              },
            ].map((cat) => (
              <Link
                key={cat.type}
                href={`/app/request?service=${cat.type}`}
                className="flex flex-col items-center text-center gap-1.5 group"
              >
                <ServiceIcon type={cat.type} size="lg" />
                <span className="text-[11px] font-bold text-[#181528] leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* SECTION 3: Notre Équipe de Techniciens d'Atelier */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#181528] tracking-tight">Notre Équipe d&apos;Atelier</h2>
              <p className="text-[11px] text-slate-400">Maîtres mécaniciens & techniciens certifiés Sceau Rouge</p>
            </div>
            <Link href="/app/mechanics" className="text-xs font-bold text-[#5e17eb] hover:underline">
              Voir l&apos;équipe
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {mechanics.map((mech, index) => {
              const isFav = savedFavorites.includes(mech.id);
              const cardImage =
                index === 0
                  ? '/images/service_provider_mechanics.jpg'
                  : index === 1
                  ? '/images/special_offer_mechanic.jpg'
                  : '/images/offer_battery_mechanic.jpg';

              return (
                <Link
                  key={mech.id}
                  href={`/app/mechanics/${mech.id}`}
                  className="bg-white border border-slate-100 rounded-3xl p-3.5 shadow-card hover:shadow-card-hover transition-all flex flex-col gap-3 group relative"
                >
                  {/* Photo bannière */}
                  <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={cardImage}
                      alt={`${mech.first_name} ${mech.last_name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badge Sceau Rouge */}
                    <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md text-[#5e17eb] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                      Sceau Rouge
                    </span>

                    {/* Bouton Coeur / Favori */}
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
                      <span className="text-slate-300">({mech.jobs_completed} interventions)</span>
                    </div>
                  </div>

                  {/* Infos du technicien */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-sm text-[#181528] group-hover:text-[#5e17eb] transition-colors">
                        {mech.first_name} {mech.last_name}
                      </h3>
                      <p className="text-[11px] font-bold text-[#5e17eb] mt-0.5">
                        {mech.business_name}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#5e17eb]" />
                        <span>Atelier MécanoMobile • {mech.years_experience} ans d&apos;expérience</span>
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
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#5e17eb]" />
                      <span>{mech.is_available ? 'Disponible aujourd\'hui' : 'En intervention'}</span>
                    </div>

                    <span className="text-[11px] font-black text-white bg-[#5e17eb] group-hover:bg-[#4c0ec4] px-4 py-1.5 rounded-full transition-colors shadow-purple-cta">
                      Prendre RDV
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODALE "VOIR TOUT" : TOUS LES SERVICES DISPONIBLES */}
      {showAllServicesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 w-full max-w-lg shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-[#181528]">Tous les Services Mobiles</h2>
                <p className="text-xs text-slate-500">Sélectionnez la prestation souhaitée à domicile</p>
              </div>
              <button
                onClick={() => setShowAllServicesModal(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {SERVICE_DEFINITIONS.map((srv) => (
                <Link
                  key={srv.type}
                  href={`/app/request?service=${srv.type}`}
                  onClick={() => setShowAllServicesModal(false)}
                  className="p-3.5 rounded-2xl bg-[#f8f9fd] hover:bg-[#f3ebff] border border-slate-100 hover:border-purple-200 transition-all flex items-start gap-3 group"
                >
                  <ServiceIcon type={srv.type} size="md" />
                  <div className="flex-1">
                    <h3 className="text-xs font-black text-[#181528] group-hover:text-[#5e17eb] transition-colors">
                      {srv.label}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{srv.shortDesc}</p>
                    <p className="text-[11px] font-black text-[#5e17eb] mt-1">
                      Dès {formatCAD(srv.basePriceCAD)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODALE "VOIR TOUT" : TOUTES LES OFFRES SPÉCIALES */}
      {showAllOffersModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 w-full max-w-lg shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-[#181528]">Toutes les Offres Spéciales</h2>
                <p className="text-xs text-slate-500">Profitez de tarifs réduits sur nos prestations mobiles</p>
              </div>
              <button
                onClick={() => setShowAllOffersModal(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 pt-1">
              {SPECIAL_OFFERS.map((offer) => (
                <div
                  key={offer.id}
                  className="p-4 rounded-3xl bg-[#f8f9fd] border border-slate-100 flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="max-w-[220px]">
                    <span className="text-[9px] font-black bg-white px-2 py-0.5 rounded-full text-slate-700 shadow-xs uppercase">
                      {offer.tag}
                    </span>
                    <h3 className="text-sm font-black text-[#181528] mt-1.5">{offer.title}</h3>
                    <p className="text-xs font-black text-[#5e17eb] mt-0.5">
                      {offer.discountPrefix} {offer.discountValue}{offer.discountSuffix}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{offer.desc}</p>
                    <Link
                      href={offer.ctaHref}
                      onClick={() => setShowAllOffersModal(false)}
                      className="inline-block mt-2.5 bg-[#5e17eb] hover:bg-[#4c0ec4] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-purple-cta transition-all"
                    >
                      {offer.ctaText}
                    </Link>
                  </div>

                  <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-white">
                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
