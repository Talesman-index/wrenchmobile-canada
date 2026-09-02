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
        <div className="w-12 h-12 rounded-2xl bg-[#0c1f38] text-white flex items-center justify-center mx-auto mb-3 shadow-navy-cta">
          <Wrench className="w-6 h-6 text-[#e5a910]" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Devenir Mécanicien Partenaire</h1>
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
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 focus:border-[#e5a910] outline-none"
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
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 focus:border-[#e5a910] outline-none"
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
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 focus:border-[#e5a910] outline-none"
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
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 focus:border-[#e5a910] outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Ville d&apos;intervention</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 focus:border-[#e5a910] outline-none"
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
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 focus:border-[#e5a910] outline-none"
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
                className="w-4 h-4 rounded text-[#e5a910]"
              />
              <label htmlFor="redseal" className="text-slate-800 font-bold text-xs cursor-pointer">
                Certifié Sceau Rouge
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-3 w-full bg-[#e5a910] hover:bg-[#c88e05] text-[#0c1f38] font-black py-4 rounded-2xl shadow-amber-cta text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          {submitted ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Dossier approuvé ! Redirection...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#0c1f38]" />
              <span>Soumettre ma candidature</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
