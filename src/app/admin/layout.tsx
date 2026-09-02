'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldCheck,
  ClipboardList,
  CreditCard,
  Star,
  Users,
  Wrench,
  ArrowLeft,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Vue d’ensemble', icon: LayoutDashboard },
    { href: '/admin/mechanics', label: 'Vérification Mécaniciens', icon: ShieldCheck },
    { href: '/admin/requests', label: 'Demandes de service', icon: ClipboardList },
    { href: '/admin/payments', label: 'Finances & Versements', icon: CreditCard },
    { href: '/admin/reviews', label: 'Avis & Qualité', icon: Star },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-[#070a11] text-slate-100">
      {/* Barre latérale d'administration */}
      <aside className="w-full md:w-64 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800/90 p-4 shrink-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 px-2 py-3 mb-4">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">ADMINISTRATION</p>
              <p className="text-[10px] text-slate-400">Console Opérations Canada</p>
            </div>
          </div>

          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-900/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden md:block pt-4 border-t border-slate-900">
          <Link
            href="/app"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l&apos;App Client</span>
          </Link>
        </div>
      </aside>

      {/* Zone de contenu principale */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl overflow-y-auto">{children}</main>
    </div>
  );
}
