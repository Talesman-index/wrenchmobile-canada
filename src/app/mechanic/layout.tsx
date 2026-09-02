'use client';

import React from 'react';
import MechanicBottomNav from '@/components/navigation/MechanicBottomNav';

export default function MechanicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="flex-1 max-w-md w-full mx-auto pb-24 px-4 pt-3 flex flex-col">
        {children}
      </div>
      <MechanicBottomNav />
    </div>
  );
}
