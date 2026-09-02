'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useToast } from '@/components/ui/ToastProvider';
import {
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Clock,
  Car,
  Heart,
  Wrench,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { formatCAD } from '@/lib/utils';
import { SERVICE_DEFINITIONS } from '@/lib/constants';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/ui/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-[360px] bg-slate-200 rounded-3xl animate-pulse" />,
});

export default function ExploreMapPage() {
  const { mechanics, activeCustomerRequest } = useApp();
  const { toast } = useToast();
  const [selectedMechanicId, setSelectedMechanicId] = useState<string>(mechanics[0]?.id || 'mech-001');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedMechanic = mechanics.find((m) => m.id === selectedMechanicId) || mechanics[0];

  const categories = [
    { key: 'all', label: 'Tous les services' },
    { key: 'battery', label: 'Batterie' },
    { key: 'tire', label: 'Pneus & Crevaison' },
    { key: 'brakes', label: 'Freins' },
    { key: 'oil', label: 'Vidange' },
    { key: 'diagnostic', label: 'Diagnostic OBD' },
  ];

  return (
    <div className="flex-1 flex flex-col gap-3 -mx-4 -mt-3 pb-2">
      {/* En-tête de recherche et filtres */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-100 shadow-sm sticky top-12 z-30 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Rechercher par quartier, mécanicien ou service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f4f6fa] border border-slate-200/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#e5a910] focus:bg-white outline-none"
            />
          </div>

          <button
            onClick={() =>
              toast({
                title: 'Filtres actifs',
                message: 'Affichage des mécaniciens mobiles certifiés Sceau Rouge dans un rayon de 40 km.',
                type: 'info',
              })
            }
            className="w-10 h-10 rounded-2xl bg-[#0c1f38] text-white flex items-center justify-center shrink-0 shadow-md shadow-slate-900/20 active:scale-95 transition-transform"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Pilules de catégories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.key
                  ? 'bg-[#e5a910] text-[#0c1f38] font-black shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Carte interactive */}
      <div className="relative flex-1 min-h-[360px] mx-4 rounded-3xl overflow-hidden border border-slate-200 shadow-card">
        <MapComponent
          customerCoords={{ lat: 45.5017, lng: -73.5673 }}
          mechanicCoords={{
            lat: selectedMechanic.latitude || 45.505,
            lng: selectedMechanic.longitude || -73.562,
          }}
          address="Centre-ville Montréal, QC"
          height="380px"
        />

        <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-100 text-[11px] font-bold text-slate-800 shadow-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{mechanics.length} Mécaniciens mobiles en service</span>
        </div>
      </div>

      {/* Fiche flottante du technicien sélectionné */}
      <div className="px-4 pt-1">
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm">
                <img
                  src={selectedMechanic.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedMechanic.first_name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-[#e5a910] text-[#0c1f38] font-black text-[8px] px-1 py-0.2 rounded">
                  -10 %
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-slate-900">
                    {selectedMechanic.business_name || `${selectedMechanic.first_name} ${selectedMechanic.last_name}`}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{selectedMechanic.city}, QC • Certifié Sceau Rouge</p>

                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-[#c88e05] font-black flex items-center gap-0.5">
                    ★ {selectedMechanic.rating.toFixed(1)}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{selectedMechanic.jobs_completed} interventions</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-black text-[#0c1f38]">
                Dès {formatCAD(89)}
              </span>
              <span className="block text-[10px] text-slate-400">Diagnostic</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[#c88e05]" />
              <span>⏱ ~15 min • 3,5 km</span>
            </div>

            <Link
              href={`/app/mechanics/${selectedMechanic.id}`}
              className="bg-[#e5a910] hover:bg-[#c88e05] text-[#0c1f38] font-black text-xs px-4 py-2 rounded-2xl shadow-amber-cta active:scale-95 transition-all flex items-center gap-1"
            >
              <span>Voir profil & Réserver</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
