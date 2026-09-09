'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  Wrench,
  Power,
  Star,
  MapPin,
  Car,
  ChevronRight,
  Sparkles,
  Check,
  X,
} from 'lucide-react';
import { formatGBP } from '@/lib/utils';

export default function MechanicHomePage() {
  const router = useRouter();
  const {
    currentMechanicProfile,
    toggleMechanicAvailability,
    serviceRequests,
    activeMechanicJob,
    updateRequestStatus,
  } = useApp();

  const [dismissedRequests, setDismissedRequests] = useState<string[]>([]);

  // Find incoming unassigned requests
  const incomingRequests = serviceRequests.filter(
    (r) =>
      r.status === 'searching' &&
      !dismissedRequests.includes(r.id)
  );

  const handleAcceptRequest = (requestId: string) => {
    updateRequestStatus(requestId, 'accepted');
    router.push(`/mechanic/jobs/${requestId}`);
  };

  const handleDeclineRequest = (requestId: string) => {
    setDismissedRequests((prev) => [...prev, requestId]);
  };

  // Calculate day earnings in GBP
  const completedJobs = serviceRequests.filter(
    (r) => r.mechanic_id === currentMechanicProfile.id && r.status === 'completed'
  );
  const todayEarningsGBP = completedJobs.reduce(
    (acc, job) => acc + ((job.labor_amount || 0) + (job.parts_amount || 0) * 0.9),
    0
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header & Online Switch */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={currentMechanicProfile.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
              alt={currentMechanicProfile.first_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#5e17eb] uppercase tracking-wider">
              Mobile Field Technician
            </p>
            <h1 className="text-base font-black text-[#181528] tracking-tight">
              {currentMechanicProfile.first_name} {currentMechanicProfile.last_name}
            </h1>
          </div>
        </div>

        {/* ONLINE / OFFLINE Toggle */}
        <button
          onClick={toggleMechanicAvailability}
          className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-md ${
            currentMechanicProfile.is_available
              ? 'bg-emerald-500 text-white shadow-emerald-500/20'
              : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{currentMechanicProfile.is_available ? 'ONLINE' : 'OFFLINE'}</span>
        </button>
      </div>

      {/* Status banner */}
      <div
        className={`p-3.5 rounded-3xl border text-xs flex items-center justify-between shadow-card transition-colors ${
          currentMechanicProfile.is_available
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-white border-slate-100 text-slate-500'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              currentMechanicProfile.is_available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
            }`}
          />
          <span className="font-semibold text-[11px]">
            {currentMechanicProfile.is_available
              ? 'You are active and receiving mobile breakdown & service calls in Greater London'
              : 'You are currently offline. Switch to ONLINE to receive customer requests.'}
          </span>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white border border-slate-100 rounded-3xl p-3.5 flex flex-col shadow-card">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Today&apos;s Earnings</span>
          <span className="text-base font-black text-[#181528] mt-1">
            {formatGBP(todayEarningsGBP || 185.0)}
          </span>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-3.5 flex flex-col shadow-card">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Jobs</span>
          <span className="text-base font-black text-emerald-600 mt-1">
            {currentMechanicProfile.jobs_completed}
          </span>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-3.5 flex flex-col shadow-card">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Rating</span>
          <span className="text-base font-black text-[#5e17eb] mt-1 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{currentMechanicProfile.rating.toFixed(1)}</span>
          </span>
        </div>
      </div>

      {/* ACTIVE JOB BANNER */}
      {activeMechanicJob && (
        <div className="bg-gradient-to-r from-[#5610d8] via-[#5e17eb] to-[#7c3aed] text-white rounded-3xl p-5 shadow-purple-cta flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              ACTIVE JOB
            </span>
            <span className="text-xs text-purple-200 capitalize font-bold">
              {activeMechanicJob.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div>
            <h2 className="text-base font-black">
              {activeMechanicJob.vehicle?.year} {activeMechanicJob.vehicle?.make} {activeMechanicJob.vehicle?.model}
            </h2>
            <p className="text-xs text-purple-200 capitalize font-bold mt-0.5">
              {activeMechanicJob.service_type.replace(/_/g, ' ')}
            </p>
            <p className="text-[11px] text-purple-100 mt-1 line-clamp-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-purple-300 shrink-0" />
              <span>{activeMechanicJob.address}</span>
            </p>
          </div>

          <Link
            href={`/mechanic/jobs/${activeMechanicJob.id}`}
            className="w-full bg-white text-[#5e17eb] hover:bg-purple-50 font-black py-3 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md active:scale-98 transition-all"
          >
            <span>Resume Job</span>
            <ChevronRight className="w-4 h-4 text-[#5e17eb]" />
          </Link>
        </div>
      )}

      {/* INCOMING REQUESTS */}
      {currentMechanicProfile.is_available && incomingRequests.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-[#181528] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#5e17eb]" />
              <span>Incoming Breakdown Requests ({incomingRequests.length})</span>
            </h2>
          </div>

          {incomingRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white border-2 border-purple-300 rounded-3xl p-4 shadow-card-hover flex flex-col gap-3.5 animate-in slide-in-from-bottom-2 duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#f3ebff] text-[#5e17eb] flex items-center justify-center shrink-0 border border-purple-200">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-[#181528]">
                      {req.vehicle?.year} {req.vehicle?.make} {req.vehicle?.model}
                    </h3>
                    <p className="text-xs text-[#5e17eb] font-bold capitalize">
                      {req.service_type.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-base font-black text-emerald-600">
                    {formatGBP(req.estimated_amount * 0.88)}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">Est. Net Payout</p>
                </div>
              </div>

              {/* Address & Distance */}
              <div className="bg-[#f8f9fd] p-3 rounded-2xl border border-slate-100 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 line-clamp-1">
                  <MapPin className="w-4 h-4 text-[#5e17eb] shrink-0" />
                  <span className="line-clamp-1">{req.address}</span>
                </div>
                <span className="text-[11px] font-mono text-[#5e17eb] font-black shrink-0 ml-2">
                  ~2.1 miles
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 italic">
                &ldquo;{req.description}&rdquo;
              </p>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleDeclineRequest(req.id)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <X className="w-4 h-4 text-red-500" />
                  <span>Decline</span>
                </button>

                <button
                  onClick={() => handleAcceptRequest(req.id)}
                  className="bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-purple-cta active:scale-98 transition-all"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>Accept Job</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Idle waiting state */}
      {currentMechanicProfile.is_available && incomingRequests.length === 0 && !activeMechanicJob && (
        <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center flex flex-col items-center shadow-card">
          <div className="w-12 h-12 rounded-full bg-[#f3ebff] text-[#5e17eb] flex items-center justify-center mb-3">
            <Wrench className="w-6 h-6 animate-pulse text-[#5e17eb]" />
          </div>
          <h2 className="text-sm font-black text-[#181528]">Waiting for nearby London calls...</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            You will receive an instant push notification as soon as a driver in {currentMechanicProfile.city} requests assistance.
          </p>
        </div>
      )}
    </div>
  );
}
