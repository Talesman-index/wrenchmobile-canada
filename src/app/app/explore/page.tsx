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
  ChevronRight,
} from 'lucide-react';
import { formatGBP } from '@/lib/utils';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/ui/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-[360px] bg-slate-200 rounded-3xl animate-pulse" />,
});

export default function ExploreMapPage() {
  const { mechanics } = useApp();
  const { toast } = useToast();
  const [selectedMechanicId, setSelectedMechanicId] = useState<string>(mechanics[0]?.id || 'mech-001');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedMechanic = mechanics.find((m) => m.id === selectedMechanicId) || mechanics[0];

  const categories = [
    { key: 'all', label: 'All Services' },
    { key: 'battery', label: 'Battery & Starting' },
    { key: 'tire', label: 'Tyres & Punctures' },
    { key: 'brakes', label: 'Brakes & Discs' },
    { key: 'oil', label: 'Oil Service' },
    { key: 'diagnostic', label: 'OBD Diagnostics' },
  ];

  return (
    <div className="flex-1 flex flex-col gap-3 -mx-4 -mt-3 pb-2">
      {/* Search & Filter Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-100 shadow-sm sticky top-12 z-30 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by London borough, postcode, mechanic or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8f9fd] border border-slate-200/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#181528] placeholder:text-slate-400 focus:border-[#5e17eb] focus:bg-white outline-none"
            />
          </div>

          <button
            onClick={() =>
              toast({
                title: 'Active Coverage',
                message: 'Displaying IMI-certified mobile technician vans within 25 miles of Central London.',
                type: 'info',
              })
            }
            className="w-10 h-10 rounded-2xl bg-[#5e17eb] text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20 active:scale-95 transition-transform"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.key
                  ? 'bg-[#5e17eb] text-white font-black shadow-sm'
                  : 'bg-[#f8f9fd] text-slate-600 hover:bg-[#f3ebff] hover:text-[#5e17eb]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Leaflet Map */}
      <div className="relative flex-1 min-h-[360px] mx-4 rounded-3xl overflow-hidden border border-slate-200 shadow-card">
        <MapComponent
          customerCoords={{ lat: 51.5074, lng: -0.1278 }}
          mechanicCoords={{
            lat: selectedMechanic.latitude || 51.515,
            lng: selectedMechanic.longitude || -0.12,
          }}
          address="Central London, W1"
          height="380px"
        />

        <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-100 text-[11px] font-bold text-[#181528] shadow-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{mechanics.length} Mobile Workshop Vans on duty</span>
        </div>
      </div>

      {/* Selected Technician Card */}
      <div className="px-4 pt-1">
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm">
                <img
                  src={selectedMechanic.avatar_url || '/images/landing/mechanic_pro.jpg'}
                  alt={selectedMechanic.first_name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-[#5e17eb] text-white font-black text-[8px] px-1 py-0.2 rounded">
                  Pro
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-[#181528]">
                    {selectedMechanic.first_name} {selectedMechanic.last_name}
                  </h3>
                </div>
                <p className="text-xs text-[#5e17eb] font-bold mt-0.5">{selectedMechanic.business_name}</p>
                <p className="text-[11px] text-slate-500">WrenchMobile London • {selectedMechanic.city}</p>

                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-amber-500 font-black flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedMechanic.rating.toFixed(1)}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{selectedMechanic.jobs_completed} jobs completed</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-black text-[#5e17eb]">
                From {formatGBP(59)}
              </span>
              <span className="block text-[10px] text-slate-400">Diagnostic</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[#5e17eb]" />
              <span>~18 min ETA • 2.4 miles</span>
            </div>

            <Link
              href={`/app/mechanics/${selectedMechanic.id}`}
              className="bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black text-xs px-4 py-2 rounded-2xl shadow-purple-cta active:scale-95 transition-all flex items-center gap-1"
            >
              <span>View Profile & Book</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
