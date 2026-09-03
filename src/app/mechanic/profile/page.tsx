'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Star,
  CheckCircle2,
  Power,
  DollarSign,
  Phone,
  Mail,
  Award,
} from 'lucide-react';

export default function MechanicProfilePage() {
  const { currentMechanicProfile, updateMechanicProfile, toggleMechanicAvailability } = useApp();

  const [businessName, setBusinessName] = useState(currentMechanicProfile.business_name || '');
  const [bio, setBio] = useState(currentMechanicProfile.bio || '');
  const [radius, setRadius] = useState(String(currentMechanicProfile.service_radius_km));
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMechanicProfile(currentMechanicProfile.id, {
      business_name: businessName,
      bio,
      service_radius_km: Number(radius) || 35,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Profil Technicien</h1>
        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
          Sceau Rouge Validé
        </span>
      </div>

      {/* Carte identité */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-card flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-[#ff6b00] shrink-0 shadow-md">
          <img
            src={currentMechanicProfile.avatar_url}
            alt={currentMechanicProfile.first_name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-base font-black text-slate-900">
            {currentMechanicProfile.first_name} {currentMechanicProfile.last_name}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs">
            <span className="text-amber-500 font-black flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{currentMechanicProfile.rating.toFixed(1)}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{currentMechanicProfile.jobs_completed} interventions</span>
          </div>
        </div>
      </div>

      {/* Formulaire de profil mécanicien */}
      <form onSubmit={handleSave} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-card flex flex-col gap-3 text-xs">
        <h3 className="font-black text-sm text-slate-900 mb-1">Paramètres professionnels</h3>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Nom de l&apos;atelier mobile</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 focus:border-[#0c1f38] outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Présentation / Spécialités</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 focus:border-[#0c1f38] outline-none resize-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Rayon d&apos;intervention (km)</label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 focus:border-[#0c1f38] outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full bg-[#0c1f38] hover:bg-[#162e52] text-white font-black py-3.5 rounded-2xl shadow-navy-cta text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Modifications sauvegardées !</span>
            </>
          ) : (
            <span>Enregistrer les paramètres</span>
          )}
        </button>
      </form>
    </div>
  );
}
