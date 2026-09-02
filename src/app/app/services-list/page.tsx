'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import {
  ChevronLeft,
  Search,
  Wrench,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { formatCAD } from '@/lib/utils';
import { SERVICE_DEFINITIONS } from '@/lib/constants';
import ServiceIcon from '@/components/ui/ServiceIcon';

export default function ServicesCatalogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = SERVICE_DEFINITIONS.filter(
    (srv) =>
      srv.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.shortLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 -mx-4 -mt-3 pb-24">
      {/* En-tête Violet */}
      <div className="bg-gradient-to-b from-[#5610d8] via-[#5e17eb] to-[#6822f3] text-white rounded-b-[36px] p-5 pt-4 shadow-purple-cta flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h1 className="text-base font-black text-white tracking-tight">Catalogue des Services</h1>
            <p className="text-[11px] text-purple-200">Interventions mobiles certifiées à domicile</p>
          </div>

          <div className="w-10" />
        </div>

        {/* Recherche de service */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#5e17eb] absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Rechercher une prestation, vidange, batterie, freins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-[#181528] border-none rounded-2xl pl-11 pr-4 py-3 text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-purple-300 outline-none shadow-sm font-medium"
          />
        </div>
      </div>

      {/* Liste des services */}
      <div className="px-4 flex flex-col gap-3.5 -mt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold text-[#181528]">
            {filteredServices.length} prestation{filteredServices.length > 1 ? 's' : ''} disponible{filteredServices.length > 1 ? 's' : ''}
          </span>
          <span className="text-[11px] font-bold text-[#5e17eb] bg-[#f3ebff] px-2.5 py-0.5 rounded-full">
            Sans remorquage
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {filteredServices.map((srv) => (
            <div
              key={srv.type}
              className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col gap-3 group"
            >
              <div className="flex items-start gap-3.5">
                <ServiceIcon type={srv.type} size="lg" />

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-sm font-black text-[#181528] group-hover:text-[#5e17eb] transition-colors">
                        {srv.label}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">{srv.shortDesc}</p>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span className="text-sm font-black text-[#5e17eb]">
                        Dès {formatCAD(srv.basePriceCAD)}
                      </span>
                      <span className="block text-[10px] text-slate-400">pièces & M.O.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#5e17eb]" />
                  <span>Durée estimée : {srv.estimatedDuration}</span>
                </div>

                <Link
                  href={`/app/request?service=${srv.type}`}
                  className="bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black text-xs px-4 py-2 rounded-full shadow-purple-cta active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>Commander</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
