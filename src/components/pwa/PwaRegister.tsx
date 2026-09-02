'use client';

import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.log('Échec enregistrement SW: ', err);
        });
      });
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = sessionStorage.getItem('pwa_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('pwa_dismissed', 'true');
  };

  if (!showInstallBanner) return null;

  return (
    <aside aria-label="Bannière d'installation de l'application" className="fixed top-14 left-4 right-4 z-50 max-w-sm mx-auto bg-[#0b1b32] text-white border border-slate-700/80 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#facc15] text-[#0b1b32] flex items-center justify-center shrink-0 shadow-md font-black">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">Installer l’application</p>
          <p className="text-[11px] text-slate-300">Ajouter à l’écran d’accueil pour un accès rapide</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={handleInstallClick}
          className="bg-[#facc15] hover:bg-[#eab308] text-[#0b1b32] text-xs font-black px-3 py-1.5 rounded-lg shadow-sm"
        >
          Installer
        </button>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-200 p-1"
          aria-label="Fermer la bannière"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
