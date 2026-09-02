'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { User, Phone, Mail, MapPin, Shield, CheckCircle2, LogOut, Wrench, Heart, Car, ChevronRight, Settings } from 'lucide-react';
import Link from 'next/link';

export default function CustomerProfilePage() {
  const { currentUser, updateCurrentUser, setCurrentRole, vehicles } = useApp();
  const [firstName, setFirstName] = useState(currentUser.first_name);
  const [lastName, setLastName] = useState(currentUser.last_name);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-[#181528] tracking-tight">Mon Profil</h1>
        <span className="text-[10px] font-black uppercase tracking-wider bg-[#f3ebff] text-[#5e17eb] border border-purple-200 px-2.5 py-1 rounded-full">
          Compte Client
        </span>
      </div>

      {/* Carte d'avatar */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center gap-4 shadow-card">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-[#5e17eb] shrink-0 shadow-md">
          <img
            src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-base font-black text-[#181528]">
            {currentUser.first_name} {currentUser.last_name}
          </h2>
          <p className="text-xs text-slate-500">{currentUser.email}</p>
          <p className="text-[11px] text-[#5e17eb] font-bold mt-0.5">
            {vehicles.length} véhicule(s) dans le garage
          </p>
        </div>
      </div>

      {/* Liens de paramètres rapides */}
      <div className="bg-white border border-slate-100 rounded-3xl p-2 shadow-card flex flex-col divide-y divide-slate-100 text-xs font-bold text-slate-700">
        <Link href="/app/vehicles" className="p-3.5 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#f3ebff] text-[#5e17eb] flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <span>Véhicules du Garage</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link href="/app/services" className="p-3.5 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#f3ebff] text-[#5e17eb] flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <span>Historique des Services & Factures</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>
      </div>

      {/* Formulaire de modification */}
      <form onSubmit={handleSave} className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col gap-3 text-xs shadow-card">
        <h3 className="font-black text-sm text-[#181528] mb-1">Informations personnelles</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 font-bold mb-1">Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-3 text-[#181528] focus:border-[#5e17eb] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-600 font-bold mb-1">Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-3 text-[#181528] focus:border-[#5e17eb] outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-600 font-bold mb-1">Courriel</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-3 text-[#181528] focus:border-[#5e17eb] outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-slate-600 font-bold mb-1">Numéro de téléphone canadien</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (514) 555-0192"
            className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-3 text-[#181528] focus:border-[#5e17eb] outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black py-3.5 rounded-2xl shadow-purple-cta text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Modifications enregistrées !</span>
            </>
          ) : (
            <span>Enregistrer le profil</span>
          )}
        </button>
      </form>

      {/* CTA Inscription mécanicien */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col gap-3 shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#f3ebff] text-[#5e17eb] flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#181528]">Vous êtes mécanicien certifié ?</h4>
            <p className="text-[11px] text-slate-500">Générez des revenus selon vos disponibilités avec notre plateforme mobile.</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentRole('mechanic')}
          className="w-full bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black py-3 rounded-2xl text-xs shadow-purple-cta active:scale-98 transition-all"
        >
          Basculer vers l&apos;App Mécanicien
        </button>
      </div>
    </div>
  );
}
