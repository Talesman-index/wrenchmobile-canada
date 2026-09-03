'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  Wrench,
  ShieldCheck,
  Award,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Car,
  FileCheck,
  ArrowRight,
} from 'lucide-react';
import { CANADIAN_CITIES, SERVICE_DEFINITIONS } from '@/lib/constants';

export default function MechanicOnboardingPage() {
  const router = useRouter();
  const { setCurrentRole } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('Montréal');
  const [experience, setExperience] = useState('5');
  const [hasRedSeal, setHasRedSeal] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setCurrentRole('mechanic');
      router.push('/mechanic');
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col justify-center max-w-md mx-auto py-6">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#f3ebff] text-[#5e17eb] border-2 border-purple-100 flex items-center justify-center mx-auto mb-3 shadow-md relative">
          <Wrench className="w-6 h-6 stroke-[2.2] text-[#5e17eb]" />
          <Sparkles className="w-3.5 h-3.5 text-[#ff7a00] absolute -top-0.5 -right-0.5" />
        </div>
        <h1 className="text-2xl font-black text-[#181528] tracking-tight">Devenir Mécanicien Partenaire</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Rejoignez le réseau canadien de dépannage mécanique mobile et recevez des missions rémunérées à votre horaire.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-card flex flex-col gap-3.5 text-xs">
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Prénom</label>
            <input
              type="text"
              placeholder="Ex : Marc-André"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] focus:border-[#5e17eb] focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nom</label>
            <input
              type="text"
              placeholder="Ex : Bouchard"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] focus:border-[#5e17eb] focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Nom commercial / Atelier mobile (optionnel)</label>
          <input
            type="text"
            placeholder="Ex : Mécano Mobile Express"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] focus:border-[#5e17eb] focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Téléphone</label>
            <input
              type="tel"
              placeholder="+1 (514) 555-0144"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] focus:border-[#5e17eb] focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Ville d&apos;intervention</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] font-bold focus:border-[#5e17eb] focus:bg-white outline-none transition-all"
            >
              {CANADIAN_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}, {c.province}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Années d&apos;expérience</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              min={1}
              className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-2.5 text-[#181528] focus:border-[#5e17eb] focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Certification Sceau Rouge</label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="redseal"
                checked={hasRedSeal}
                onChange={(e) => setHasRedSeal(e.target.checked)}
                className="w-4 h-4 rounded text-[#5e17eb] focus:ring-[#5e17eb]"
              />
              <label htmlFor="redseal" className="text-slate-800 font-bold text-xs cursor-pointer">
                Certifié Sceau Rouge
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-3 w-full bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black py-4 rounded-2xl shadow-purple-cta text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <span>Soumettre ma candidature</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
