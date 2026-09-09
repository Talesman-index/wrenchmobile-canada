'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useToast } from '@/components/ui/ToastProvider';
import {
  ChevronLeft,
  Search,
  Star,
  MapPin,
  Clock,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { formatGBP } from '@/lib/utils';

export default function MechanicsListPage() {
  const router = useRouter();
  const { mechanics } = useApp();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [savedFavorites, setSavedFavorites] = useState<string[]>(['mech-001']);

  const filterChips = [
    { id: 'all', label: 'All Fleet' },
    { id: 'imi', label: 'IMI Certified' },
    { id: 'fast', label: 'Fast Response (< 20 min)' },
    { id: 'top_rated', label: 'Top Rated (4.8+)' },
    { id: 'diagnostic', label: 'OBD Diagnostics' },
    { id: 'brakes', label: 'Brakes & Discs' },
  ];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    toast({
      title: savedFavorites.includes(id) ? 'Removed from favourites' : 'Added to favourites',
      message: savedFavorites.includes(id)
        ? 'Technician removed from your saved list.'
        : 'Technician saved to your favourites.',
      type: 'info',
    });
  };

  const filteredMechanics = mechanics.filter((mech) => {
    const fullName = `${mech.first_name} ${mech.last_name} ${mech.business_name || ''}`.toLowerCase();
    const queryMatch =
      !searchQuery ||
      fullName.includes(searchQuery.toLowerCase()) ||
      mech.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mech.bio?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!queryMatch) return false;

    if (selectedFilter === 'imi') return mech.years_experience >= 6;
    if (selectedFilter === 'top_rated') return mech.rating >= 4.8;
    if (selectedFilter === 'fast') return true;

    return true;
  });

  return (
    <div className="flex flex-col gap-4 -mx-4 -mt-3 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#5610d8] via-[#5e17eb] to-[#6822f3] text-white rounded-b-[36px] p-5 pt-4 shadow-purple-cta flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h1 className="text-base font-black text-white tracking-tight">Our London Workshop Fleet</h1>
            <p className="text-[11px] text-purple-200">IMI-certified Master Technicians on duty</p>
          </div>

          <Link
            href="/app/explore"
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all shadow-sm"
            title="Map View"
          >
            <MapPin className="w-4 h-4" />
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#5e17eb] absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by name, London borough or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-[#181528] border-none rounded-2xl pl-11 pr-4 py-3 text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-purple-300 outline-none shadow-sm font-medium"
          />
        </div>
      </div>

      {/* Mechanics list content */}
      <div className="px-4 flex flex-col gap-4 -mt-1">
        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {filterChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedFilter(chip.id)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedFilter === chip.id
                  ? 'bg-[#5e17eb] text-white font-black shadow-purple-cta'
                  : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-[#f3ebff] hover:text-[#5e17eb]'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-extrabold text-[#181528]">
            {filteredMechanics.length} mobile technician{filteredMechanics.length > 1 ? 's' : ''} on duty
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            WrenchMobile London Fleet
          </span>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-3.5">
          {filteredMechanics.map((mech, index) => {
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
                <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={cardImage}
                    alt={`${mech.first_name} ${mech.last_name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* IMI Badge */}
                  <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md text-[#5e17eb] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#5e17eb]" />
                    <span>IMI Certified Tech</span>
                  </span>

                  {/* Heart */}
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

                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{mech.rating.toFixed(1)}</span>
                    <span className="text-slate-300">({mech.jobs_completed} verified jobs)</span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-[#5e17eb]/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    Mobile Van
                  </div>
                </div>

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
                      <span>WrenchMobile London • {mech.years_experience} yrs experience</span>
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                      {mech.bio}
                    </p>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <span className="text-sm font-black text-[#5e17eb]">
                      From {formatGBP(59)}
                    </span>
                    <span className="block text-[10px] text-slate-400">Diagnostic scan</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold bg-[#f3ebff] text-[#5e17eb] px-2.5 py-0.5 rounded-lg">
                    Battery & Boost
                  </span>
                  <span className="text-[10px] font-bold bg-[#f3ebff] text-[#5e17eb] px-2.5 py-0.5 rounded-lg">
                    Brake Servicing
                  </span>
                  <span className="text-[10px] font-bold bg-[#f3ebff] text-[#5e17eb] px-2.5 py-0.5 rounded-lg">
                    OBD-II Scanning
                  </span>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#5e17eb]" />
                    <span>Est. arrival: ~15-25 min</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white bg-[#5e17eb] group-hover:bg-[#4c0ec4] px-5 py-2 rounded-full transition-colors shadow-purple-cta">
                      View Profile & Book
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
