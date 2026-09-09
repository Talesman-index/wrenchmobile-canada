'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useToast } from '@/components/ui/ToastProvider';
import {
  ChevronLeft,
  Share2,
  Heart,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { formatGBP } from '@/lib/utils';
import { SERVICE_DEFINITIONS } from '@/lib/constants';
import Link from 'next/link';

export default function MechanicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { mechanics, reviews } = useApp();
  const { showSuccess } = useToast();
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'packages' | 'gallery' | 'reviews'>('about');
  const [isSaved, setIsSaved] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('pkg-1');

  const mechanic = mechanics.find((m) => m.id === id) || mechanics[0];
  const mechanicReviews = reviews.filter((r) => r.mechanic_id === mechanic.id);

  const packages = [
    {
      id: 'pkg-1',
      name: 'Diagnostic & Vehicle Health Check',
      price: 69,
      saved: 20,
      features: [
        'OBD-II electronic fault scan across all vehicle ECUs',
        'High-rate battery & alternator load health test',
        'Visual check of brakes, suspension and fluid leaks',
        'Detailed PDF report with photo evidence',
      ],
    },
    {
      id: 'pkg-2',
      name: 'Mobile Service Pro Pack',
      price: 149,
      saved: 30,
      features: [
        '100% full synthetic oil replacement + OEM filter',
        '4-wheel tyre check, pressure adjustment & tread gauge',
        'Top-up of all vital fluids (screenwash, brake, coolant)',
        '40-point safety and preventive inspection',
      ],
    },
    {
      id: 'pkg-3',
      name: 'Front Axle Brake Overhaul',
      price: 195,
      saved: 45,
      features: [
        'Premium Brembo or Ferodo ceramic brake pad set',
        'Caliper slider pin cleaning, lubing and inspection',
        'Disc run-out check with dial test indicator',
        'Road test and safe brake bed-in',
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
    <div className="flex flex-col gap-4 -mx-4 -mt-3 pb-28">
      {/* Hero cover photo */}
      <div className="relative h-72 w-full bg-slate-900">
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

        {/* Back, share, heart */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#181528] shadow-md active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showSuccess('Profile link copied to clipboard!', 'Share')}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#181528] shadow-md active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#181528] shadow-md active:scale-95 transition-all"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-[#181528]'}`} />
            </button>
          </div>
        </div>

        {/* Video button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={() => showSuccess('Playing workshop walkthrough video.')}
            className="pointer-events-auto flex items-center gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold border border-white/20 transition-all active:scale-95 shadow-lg"
          >
            <div className="w-5 h-5 rounded-full bg-white text-[#5e17eb] flex items-center justify-center">
              ▶
            </div>
            <span>Video Tour</span>
          </button>
        </div>

        {/* Mini gallery strip */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar z-10">
          {galleryPhotos.map((url, i) => (
            <div key={i} className="w-12 h-10 rounded-xl overflow-hidden border border-white/60 shrink-0 shadow-md">
              <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="w-12 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/60 flex items-center justify-center text-white text-xs font-black shrink-0">
            +10
          </div>
        </div>
      </div>

      {/* Primary Details */}
      <div className="px-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="bg-[#f3ebff] text-[#5e17eb] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Mobile Workshop
          </span>

          <div className="flex items-center gap-1 text-xs font-bold text-[#181528]">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{mechanic.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-normal">({mechanic.jobs_completed} reviews)</span>
          </div>
        </div>

        <div>
          <h1 className="text-xl font-black text-[#181528] tracking-tight">
            {mechanic.first_name} {mechanic.last_name}
          </h1>
          <p className="text-xs font-bold text-[#5e17eb] mt-0.5">
            {mechanic.business_name}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#5e17eb]" />
            <span>WrenchMobile London • {mechanic.city}, Greater London</span>
          </p>
        </div>

        {/* Provider card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-3.5 shadow-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-purple-100 shrink-0">
              <img
                src={mechanic.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
                alt={mechanic.first_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xs font-extrabold text-[#181528]">
                {mechanic.first_name} {mechanic.last_name}
              </h2>
              <p className="text-[11px] text-slate-400">Master Technician • IMI Certified</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/app/chat"
              className="w-9 h-9 rounded-full bg-[#f3ebff] hover:bg-[#5e17eb] text-[#5e17eb] hover:text-white flex items-center justify-center transition-colors shadow-sm"
              title="Send message"
            >
              <MessageSquare className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${mechanic.phone}`}
              className="w-9 h-9 rounded-full bg-[#f3ebff] hover:bg-[#5e17eb] text-[#5e17eb] hover:text-white flex items-center justify-center transition-colors shadow-sm"
              title="Call technician"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div className="flex items-center justify-between border-b border-slate-200">
          {[
            { key: 'about', label: 'About' },
            { key: 'services', label: 'Services' },
            { key: 'packages', label: 'Packages' },
            { key: 'gallery', label: 'Gallery' },
            { key: 'reviews', label: 'Reviews' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 text-xs font-extrabold transition-all relative ${
                activeTab === tab.key
                  ? 'text-[#5e17eb]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5e17eb] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="px-4 flex flex-col gap-4">
        {/* TAB 1: About */}
        {activeTab === 'about' && (
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-card flex flex-col gap-3.5">
            <div>
              <h2 className="text-xs font-black text-[#181528] uppercase tracking-wider text-slate-400">
                About
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{mechanic.bio}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#f8f9fd] p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black uppercase text-slate-400">Experience</span>
                <p className="font-black text-[#181528] mt-0.5">{mechanic.years_experience} years in trade</p>
              </div>

              <div className="bg-[#f8f9fd] p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black uppercase text-slate-400">Accreditation</span>
                <p className="font-black text-[#5e17eb] mt-0.5">IMI Level 4 Certified</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs font-black text-[#181528] mb-2">Van Equipment & Tooling:</h3>
              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5e17eb] shrink-0" />
                  <span>Dealer-grade OBD-II multi-marque diagnostic scan tools</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5e17eb] shrink-0" />
                  <span>High-rate carbon pile battery load & alternator tester</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5e17eb] shrink-0" />
                  <span>Low-profile hydraulic jacks & full mobile torque set</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Services */}
        {activeTab === 'services' && (
          <div className="flex flex-col gap-2.5">
            {SERVICE_DEFINITIONS.map((srv) => (
              <div
                key={srv.type}
                className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xs font-black text-[#181528]">{srv.label}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{srv.shortDesc}</p>
                  <span className="inline-block text-[10px] text-slate-400 mt-1 font-mono">
                    Est. duration: {srv.estimatedDuration}
                  </span>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <span className="text-xs font-black text-[#5e17eb]">
                    From {formatGBP(srv.basePriceGBP)}
                  </span>
                  <Link
                    href={`/app/request?service=${srv.type}`}
                    className="block mt-1 bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black text-[10px] px-3.5 py-1.5 rounded-full shadow-sm transition-colors"
                  >
                    Select
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Packages */}
        {activeTab === 'packages' && (
          <div className="flex flex-col gap-3">
            {packages.map((pkg) => {
              const isSelected = selectedPackage === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`bg-white border rounded-3xl p-4 transition-all shadow-card cursor-pointer flex flex-col gap-3 ${
                    isSelected ? 'border-[#5e17eb] ring-2 ring-purple-100 shadow-card-hover' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-black text-[#5e17eb] bg-[#f3ebff] px-2 py-0.5 rounded-full uppercase">
                        Save {formatGBP(pkg.saved)}
                      </span>
                      <h3 className="text-sm font-black text-[#181528] mt-1.5">{pkg.name}</h3>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-[#5e17eb]">{formatGBP(pkg.price)}</span>
                      <span className="block text-[10px] text-slate-400">All-inclusive</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    {pkg.features.map((feat, i) => (
                      <p key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5e17eb] shrink-0" />
                        <span className="text-[11px]">{feat}</span>
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: Gallery */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-2 gap-2.5">
            {galleryPhotos.map((url, i) => (
              <div key={i} className="relative aspect-video rounded-2xl overflow-hidden shadow-card border border-slate-100">
                <img src={url} alt={`Intervention ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: Reviews */}
        {activeTab === 'reviews' && (
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-[#181528]">{mechanic.rating.toFixed(1)}</span>
                <div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Based on {mechanic.jobs_completed} mobile interventions</p>
                </div>
              </div>
            </div>

            {mechanicReviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(rev.created_at).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <p className="text-xs text-slate-700 italic">&ldquo;{rev.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-100 p-4 shadow-[0_-4px_24px_rgba(94,23,235,0.08)] pb-safe">
        <div className="max-w-md mx-auto">
          <Link
            href="/app/request"
            className="w-full bg-[#5e17eb] hover:bg-[#4c0ec4] active:scale-[0.98] text-white font-black py-4 px-6 rounded-2xl shadow-purple-cta flex items-center justify-center gap-2 text-sm transition-all"
          >
            <span>Book This Technician Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
