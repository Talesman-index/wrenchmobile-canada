'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Car,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Fuel,
  Sparkles,
  ChevronRight,
  Shield,
  X,
  Wrench,
} from 'lucide-react';
import { POPULAR_VEHICLE_MAKES } from '@/lib/constants';
import Link from 'next/link';

export default function CustomerVehiclesPage() {
  const { vehicles, addVehicle, deleteVehicle, setPrimaryVehicle } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  // Formulaire d'ajout
  const [make, setMake] = useState('Honda');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2021);
  const [licensePlate, setLicensePlate] = useState('');
  const [vin, setVin] = useState('');
  const [fuelType, setFuelType] = useState('Essence');
  const [isPrimary, setIsPrimary] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim()) {
      alert('Veuillez spécifier le modèle du véhicule');
      return;
    }

    addVehicle({
      make,
      model: model.trim(),
      year: Number(year),
      license_plate: licensePlate.trim().toUpperCase() || undefined,
      vin: vin.trim().toUpperCase() || undefined,
      fuel_type: fuelType,
      is_primary: isPrimary || vehicles.length === 0,
    });

    setModel('');
    setLicensePlate('');
    setVin('');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Mon Garage</h1>
          <p className="text-xs text-slate-500">Gérez vos véhicules pour un dépannage express</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#e5a910] hover:bg-[#c88e05] text-[#0c1f38] font-black text-xs px-3.5 py-2 rounded-2xl flex items-center gap-1.5 shadow-amber-cta transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Ajouter</span>
        </button>
      </div>

      {/* Liste des véhicules */}
      <div className="flex flex-col gap-3">
        {vehicles.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center flex flex-col items-center shadow-card">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-[#c88e05] flex items-center justify-center mb-3">
              <Car className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-black text-slate-900">Votre garage est vide</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Ajoutez votre véhicule pour commander un mécanicien en 1 clic sans devoir tout ressaisir.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 bg-[#e5a910] text-[#0c1f38] font-black text-xs px-4 py-2.5 rounded-2xl shadow-amber-cta"
            >
              Ajouter un premier véhicule
            </button>
          </div>
        ) : (
          vehicles.map((veh) => (
            <div
              key={veh.id}
              className={`bg-white border rounded-3xl p-4.5 transition-all shadow-card flex flex-col gap-3 relative ${
                veh.is_primary ? 'border-[#e5a910] ring-2 ring-amber-100 shadow-card-hover' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      veh.is_primary
                        ? 'bg-[#0c1f38] text-[#e5a910] shadow-md'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Car className="w-6 h-6 text-[#e5a910]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-black text-sm text-slate-900">
                        {veh.year} {veh.make} {veh.model}
                      </h2>
                      {veh.is_primary && (
                        <span className="text-[9px] font-black bg-amber-100 text-[#0c1f38] px-2 py-0.5 rounded-full">
                          PRINCIPAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">
                      {veh.license_plate ? `Plaque : ${veh.license_plate}` : 'Sans plaque renseignée'}
                    </p>
                  </div>
                </div>

                {/* Bouton supprimer */}
                <button
                  onClick={() => {
                    if (confirm(`Supprimer ${veh.make} ${veh.model} du garage ?`)) {
                      deleteVehicle(veh.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Spécifications & Raccourcis */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-xl">
                  <Fuel className="w-3.5 h-3.5 text-[#c88e05]" />
                  <span>{veh.fuel_type || 'Essence'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-xl">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate">{veh.vin ? `NIV: ${veh.vin.slice(0, 8)}...` : 'NIV non saisi'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                {!veh.is_primary ? (
                  <button
                    onClick={() => setPrimaryVehicle(veh.id)}
                    className="text-xs font-bold text-slate-600 hover:text-[#c88e05] flex items-center gap-1"
                  >
                    Définir comme véhicule par défaut
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Sélectionné pour les urgences
                  </span>
                )}

                <Link
                  href={`/app/request?vehicle=${veh.id}`}
                  className="bg-[#e5a910] hover:bg-[#c88e05] text-[#0c1f38] font-black text-xs px-3.5 py-1.5 rounded-full shadow-amber-cta flex items-center gap-1 active:scale-95 transition-all"
                >
                  <Wrench className="w-3 h-3" />
                  <span>Dépanner</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL D'AJOUT DE VÉHICULE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 w-full max-w-md shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900">Ajouter un véhicule au garage</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marque</label>
                  <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 focus:border-[#e5a910] outline-none"
                  >
                    {POPULAR_VEHICLE_MAKES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Année</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 focus:border-[#e5a910] outline-none"
                  >
                    {Array.from({ length: 30 }, (_, i) => 2026 - i).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Modèle</label>
                <input
                  type="text"
                  placeholder="Ex : Civic, RAV4, F-150, Elantra..."
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 focus:border-[#e5a910] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plaque d&apos;immatriculation</label>
                  <input
                    type="text"
                    placeholder="Ex : G12 ABC"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 uppercase font-mono focus:border-[#e5a910] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Motorisation</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-slate-900 focus:border-[#e5a910] outline-none"
                  >
                    <option value="Essence">Essence</option>
                    <option value="Hybride">Hybride</option>
                    <option value="100 % Électrique">100 % Électrique</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="primaryCheck"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="w-4 h-4 rounded text-[#e5a910]"
                />
                <label htmlFor="primaryCheck" className="text-slate-700 font-bold cursor-pointer">
                  Définir comme véhicule principal
                </label>
              </div>

              <button
                type="submit"
                className="mt-2 w-full bg-[#e5a910] hover:bg-[#c88e05] text-[#0c1f38] font-black py-3.5 rounded-2xl shadow-amber-cta text-xs transition-all active:scale-98"
              >
                Enregistrer dans mon garage
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
