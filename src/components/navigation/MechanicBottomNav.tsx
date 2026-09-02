'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, DollarSign, UserCheck } from 'lucide-react';
import { useApp } from '@/lib/store';

export default function MechanicBottomNav() {
  const pathname = usePathname();
  const { activeMechanicJob } = useApp();

  const navItems = [
    { href: '/mechanic', label: 'Accueil', icon: LayoutDashboard },
    {
      href: '/mechanic/jobs',
      label: 'Missions',
      icon: Briefcase,
      badge: Boolean(activeMechanicJob),
    },
    { href: '/mechanic/earnings', label: 'Revenus', icon: DollarSign },
    { href: '/mechanic/profile', label: 'Profil', icon: UserCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_20px_rgba(94,23,235,0.06)] pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/mechanic' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-[#5e17eb] font-black'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1.5 rounded-2xl transition-all ${
                    isActive ? 'bg-[#f3ebff] text-[#5e17eb]' : 'text-slate-400'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-[#5e17eb]' : 'stroke-[1.8]'}`} />
                </div>
                {item.badge && (
                  <span className="absolute 0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight font-extrabold ${isActive ? 'text-[#5e17eb]' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
