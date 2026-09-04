'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useToast } from '@/components/ui/ToastProvider';
import { Wrench, Shield, User, RotateCcw, MapPin, Bell, ChevronDown } from 'lucide-react';
import { UserRole } from '@/types/database';
import { CANADIAN_CITIES } from '@/lib/constants';

export default function TopBar() {
  const { currentRole, setCurrentRole, resetDemoData, currentMechanicProfile, toggleMechanicAvailability } = useApp();
  const { showSuccess, confirmModal } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState('Montréal, QC');
  const [showCityPicker, setShowCityPicker] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'customer') router.push('/app');
    else if (newRole === 'mechanic') router.push('/mechanic');
    else if (newRole === 'admin') router.push('/admin');
  };

  const isCustomerSection = pathname.startsWith('/app') || pathname === '/';

  if (pathname === '/') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-2.5 transition-all shadow-sm">
      <div className="max-w-md md:max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Localisation */}
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#5e17eb] flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-sm font-black tracking-tight text-[#181528]">MÉCANO</span>
                <span className="text-[9px] bg-[#f3ebff] text-[#5e17eb] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  MOBILE
                </span>
              </div>
            </div>
          </Link>

          {/* Sélecteur de ville */}
          {isCustomerSection && (
            <div className="relative hidden xs:block">
              <button
                onClick={() => setShowCityPicker(!showCityPicker)}
                className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-[#f3ebff] hover:text-[#5e17eb] px-2.5 py-1.5 rounded-full transition-colors"
              >
                <MapPin className="w-3 h-3 text-[#5e17eb]" />
                <span className="truncate max-w-[110px]">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showCityPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 w-48 z-50 animate-in fade-in zoom-in-95">
                  <p className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Villes desservies
                  </p>
                  {CANADIAN_CITIES.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedCity(`${c.name}, ${c.province}`);
                        setShowCityPicker(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-[#f3ebff] hover:text-[#5e17eb] font-bold flex items-center justify-between"
                    >
                      <span>{c.name}, {c.province}</span>
                      {selectedCity.startsWith(c.name) && (
                        <span className="text-[#5e17eb] font-black">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sélecteur de rôle & Démo */}
        <div className="flex items-center gap-1.5">
          <div className="bg-slate-100 p-0.5 rounded-full border border-slate-200/80 flex items-center text-xs">
            <button
              onClick={() => handleRoleChange('customer')}
              className={`px-2.5 py-1 rounded-full font-black transition-all flex items-center gap-1 text-[11px] ${
                currentRole === 'customer'
                  ? 'bg-[#5e17eb] text-white shadow-sm shadow-purple-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3 h-3" />
              <span className="hidden sm:inline">Client</span>
            </button>
            <button
              onClick={() => handleRoleChange('mechanic')}
              className={`px-2.5 py-1 rounded-full font-black transition-all flex items-center gap-1 text-[11px] ${
                currentRole === 'mechanic'
                  ? 'bg-[#5e17eb] text-white shadow-sm shadow-purple-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-3 h-3" />
              <span className="hidden sm:inline">Mécano</span>
            </button>
            <button
              onClick={() => handleRoleChange('admin')}
              className={`px-2.5 py-1 rounded-full font-black transition-all flex items-center gap-1 text-[11px] ${
                currentRole === 'admin'
                  ? 'bg-[#181528] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>

          {/* Interrupteur En ligne pour mécanicien */}
          {currentRole === 'mechanic' && (
            <button
              onClick={toggleMechanicAvailability}
              className={`text-[11px] px-2.5 py-1 rounded-full font-black border flex items-center gap-1 transition-all ${
                currentMechanicProfile.is_available
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  currentMechanicProfile.is_available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span>{currentMechanicProfile.is_available ? 'EN LIGNE' : 'HORS LIGNE'}</span>
            </button>
          )}

          {/* Réinitialiser démo */}
          <button
            onClick={() => {
              confirmModal({
                title: 'Réinitialiser la démo ?',
                message: 'Voulez-vous réinitialiser toutes les données de démonstration avec les paramètres canadiens d’origine ?',
                type: 'warning',
                confirmText: 'Réinitialiser',
                cancelText: 'Conserver',
                onConfirm: () => {
                  resetDemoData();
                  showSuccess('Données de démonstration réinitialisées.');
                },
              });
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            title="Réinitialiser les données"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
