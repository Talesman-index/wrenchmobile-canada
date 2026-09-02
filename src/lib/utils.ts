import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCAD(amount: number): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDistanceKm(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon de la terre en km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'searching':
      return { label: 'Recherche d’un mécanicien', bg: 'bg-amber-100 text-amber-700 border-amber-300' };
    case 'accepted':
      return { label: 'Mécanicien assigné', bg: 'bg-blue-100 text-blue-700 border-blue-300' };
    case 'mechanic_on_the_way':
      return { label: 'Mécanicien en route', bg: 'bg-indigo-100 text-indigo-700 border-indigo-300 animate-pulse' };
    case 'arrived':
      return { label: 'Arrivé sur place', bg: 'bg-cyan-100 text-cyan-700 border-cyan-300' };
    case 'in_progress':
      return { label: 'Intervention en cours', bg: 'bg-emerald-100 text-emerald-700 border-emerald-300' };
    case 'awaiting_payment':
      return { label: 'En attente de paiement', bg: 'bg-orange-100 text-orange-700 border-orange-300' };
    case 'completed':
      return { label: 'Terminé & Payé', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    case 'cancelled':
      return { label: 'Annulé', bg: 'bg-red-100 text-red-700 border-red-300' };
    case 'verified':
      return { label: 'Technicien vérifié', bg: 'bg-emerald-100 text-emerald-700 border-emerald-300' };
    case 'pending':
      return { label: 'En attente de validation', bg: 'bg-amber-100 text-amber-700 border-amber-300' };
    case 'rejected':
      return { label: 'Refusé', bg: 'bg-red-100 text-red-700 border-red-300' };
    case 'suspended':
      return { label: 'Suspendu', bg: 'bg-slate-200 text-slate-700 border-slate-300' };
    default:
      return { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-300' };
  }
}
