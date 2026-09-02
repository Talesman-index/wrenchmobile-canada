'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  ChevronLeft,
  Share2,
  Heart,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Car,
  Calendar,
  Sparkles,
  ArrowRight,
  Info,
  DollarSign,
  Camera,
} from 'lucide-react';
import { formatCAD } from '@/lib/utils';
import { SERVICE_DEFINITIONS } from '@/lib/constants';
import Link from 'next/link';

export default function MechanicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { mechanics, reviews, setCurrentRole } = useApp();
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'experts' | 'packages' | 'gallery' | 'reviews'>('about');
  const [isSaved, setIsSaved] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('pkg-1');

  const mechanic = mechanics.find((m) => m.id === id) || mechanics[0];
  const mechanicReviews = reviews.filter((r) => r.mechanic_id === mechanic.id);

  const packages = [
    {
      id: 'pkg-1',
      name: 'Diagnostic & Bilan Santé Complet',
      price: 95,
      saved: 25,
      features: [
        'Scan électronique OBD-II tous calculateurs',
        'Test de santé batterie & alternateur sous charge',
        'Contrôle visuel freins, suspension et fuites de fluides',
        'Rapport PDF complet avec photos',
      ],
    },
    {
      id: 'pkg-2',
      name: 'Forfait Entretien Mobile Pro',
      price: 189,
      saved: 40,
      features: [
        'Vidange d’huile 100 % synthétique + filtre OEM',
        'Permutation des 4 pneus et ajustement pression',
        'Mise à niveau de tous les liquides (lave-glace, frein, refroidissement)',
        'Inspection multi-points de sécurité',
      ],
    },
    {
      id: 'pkg-3',
      name: 'Freinage Complet Essieu Avant',
      price: 249,
      saved: 55,
      features: [
        'Jeu de plaquettes céramiques de première qualité',
        'Nettoyage et lubrification des étriers et coulisseaux',
        'Contrôle de voile des disques au micromètre',
        'Essai routier et rodage sécurisé',
      ],
    },
  ];

  const galleryPhotos = [
    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="flex flex-col gap-4 -mx-4 -mt-3 pb-24">
      {/* Photo de couverture Hero */}
      <div className="relative h-64 w-full bg-slate-900">
        <img
          src={
            mechanic.id === 'mech-001'
              ? 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=900&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=900&auto=format&fit=crop&q=80'
          }
          alt={mechanic.business_name || mechanic.first_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

        {/* Boutons retour, partage, favori */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-md active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Lien du profil copié dans le presse-papiers')}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-md active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-md active:scale-95 transition-all"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-900'}`} />
            </button>
          </div>
        </div>

        {/* Badges sur la photo */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10 text-white">
          <div>
            <span className="bg-[#e5a910] text-[#0c1f38] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              🏷️ -10 % SUR VOTRE PREMIÈRE MISSION
            </span>
            <h1 className="text-xl font-black mt-1 leading-tight text-white drop-shadow-md">
              {mechanic.business_name || `${mechanic.first_name} ${mechanic.last_name}`}
            </h1>
            <p className="text-xs text-slate-200 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#e5a910]" />
              <span>{mechanic.city}, {mechanic.province} • Rayon de {mechanic.service_radius_km} km</span>
            </p>
          </div>

          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1 border border-white/20">
            <Star className="w-4 h-4 fill-[#e5a910] text-[#e5a910]" />
            <span className="font-black text-xs text-white">{mechanic.rating.toFixed(1)}</span>
            <span className="text-[10px] text-slate-300">({mechanic.jobs_completed})</span>
          </div>
        </div>
      </div>

      {/* Raccourcis d'actions rapides */}
      <div className="px-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-3 shadow-card grid grid-cols-3 gap-2 text-center text-xs">
          <a
            href={`tel:${mechanic.phone}`}
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-amber-50 text-[#c88e05] flex items-center justify-center mb-1">
              <Phone className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 text-[11px]">Appeler</span>
          </a>

          <Link
            href="/app/chat"
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-50 text-[#0c1f38] flex items-center justify-center mb-1">
              <MessageSquare className="w-4 h-4 text-[#e5a910]" />
            </div>
            <span className="font-bold text-slate-800 text-[11px]">Message</span>
          </Link>

          <Link
            href="/app/explore"
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 text-[11px]">Carte GPS</span>
          </Link>
        </div>
      </div>

      {/* Onglets de navigation */}
      <div className="px-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2">
          {[
            { key: 'about', label: 'À propos' },
            { key: 'services', label: 'Services' },
            { key: 'packages', label: 'Forfaits' },
            { key: 'gallery', label: 'Galerie' },
            { key: 'reviews', label: 'Avis' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-[#0c1f38] text-[#e5a910] shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="px-4 flex flex-col gap-4">
        {/* ONGLET 1 : À propos */}
        {activeTab === 'about' && (
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-card flex flex-col gap-3.5">
            <div>
              <h2 className="text-sm font-black text-slate-900">Présentation du Technicien</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{mechanic.bio}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black uppercase text-slate-400">Expérience</span>
                <p className="font-black text-slate-900 mt-0.5">{mechanic.years_experience} ans de métier</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black uppercase text-slate-400">Certification</span>
                <p className="font-black text-[#c88e05] mt-0.5">Sceau Rouge Canadien</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs font-black text-slate-900 mb-2">Équipement de bord transporté :</h3>
              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Scanner de diagnostic professionnel OBD-II tous constructeurs</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Banc de charge haute intensité & testeur d&apos;alternateur</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Crics hydrauliques extra-bas & chandelles certifiées</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Bac de récupération de fluides étanche & écologique</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET 2 : Services */}
        {activeTab === 'services' && (
          <div className="flex flex-col gap-2.5">
            {SERVICE_DEFINITIONS.map((srv) => (
              <div
                key={srv.type}
                className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xs font-black text-slate-900">{srv.label}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{srv.shortDesc}</p>
                  <span className="inline-block text-[10px] text-slate-400 mt-1 font-mono">
                    Durée estimée : {srv.estimatedDuration}
                  </span>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <span className="text-xs font-black text-[#0c1f38]">
                    Dès {formatCAD(srv.basePriceCAD)}
                  </span>
                  <Link
                    href={`/app/request?service=${srv.type}`}
                    className="block mt-1 bg-[#e5a910] text-[#0c1f38] font-black text-[10px] px-3.5 py-1 rounded-full shadow-sm hover:bg-[#c88e05] transition-colors"
                  >
                    Choisir
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ONGLET 3 : Forfaits */}
        {activeTab === 'packages' && (
          <div className="flex flex-col gap-3">
            {packages.map((pkg) => {
              const isSelected = selectedPackage === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`bg-white border rounded-3xl p-4 transition-all shadow-card cursor-pointer flex flex-col gap-3 ${
                    isSelected ? 'border-[#e5a910] ring-2 ring-amber-100 shadow-card-hover' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-black text-[#c88e05] bg-amber-50 px-2 py-0.5 rounded-full uppercase">
                        Économisez {formatCAD(pkg.saved)}
                      </span>
                      <h3 className="text-sm font-black text-slate-900 mt-1.5">{pkg.name}</h3>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-[#0c1f38]">{formatCAD(pkg.price)}</span>
                      <span className="block text-[10px] text-slate-400">Tout inclus</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    {pkg.features.map((feat, i) => (
                      <p key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[11px]">{feat}</span>
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ONGLET 4 : Galerie */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-2 gap-2.5">
            {galleryPhotos.map((url, i) => (
              <div key={i} className="relative aspect-video rounded-2xl overflow-hidden shadow-card border border-slate-100">
                <img src={url} alt={`Intervention ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* ONGLET 5 : Avis */}
        {activeTab === 'reviews' && (
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-slate-900">{mechanic.rating.toFixed(1)}</span>
                <div>
                  <div className="flex text-[#e5a910]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#e5a910]" />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Basé sur {mechanic.jobs_completed} interventions</p>
                </div>
              </div>
            </div>

            {mechanicReviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#e5a910]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#e5a910]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(rev.created_at).toLocaleDateString('fr-CA')}
                  </span>
                </div>
                <p className="text-xs text-slate-700 italic">&ldquo;{rev.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Barre d'action fixe en bas */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-100 p-4 shadow-[0_-4px_24px_rgba(12,31,56,0.08)] pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Déplacement d&apos;urgence</span>
            <span className="text-base font-black text-[#0c1f38]">Dès {formatCAD(89)}</span>
          </div>

          <Link
            href="/app/request"
            className="flex-1 bg-[#e5a910] hover:bg-[#c88e05] active:scale-[0.98] text-[#0c1f38] font-black py-3.5 px-6 rounded-2xl shadow-amber-cta flex items-center justify-center gap-2 text-xs transition-all"
          >
            <span>Commander ce mécanicien</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
