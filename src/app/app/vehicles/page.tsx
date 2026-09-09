'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { useToast } from '@/components/ui/ToastProvider';
import {
  Car,
  Plus,
  Trash2,
  CheckCircle2,
  Fuel,
  Shield,
  X,
  Wrench,
} from 'lucide-react';
import { POPULAR_VEHICLE_MAKES } from '@/lib/constants';
import Link from 'next/link';

export default function CustomerVehiclesPage() {
  const { vehicles, addVehicle, deleteVehicle, setPrimaryVehicle } = useApp();
  const { showSuccess, showWarning, confirmModal } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);

  // Add form
  const [make, setMake] = useState('BMW');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2022);
  const [licensePlate, setLicensePlate] = useState('');
  const [vin, setVin] = useState('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [isPrimary, setIsPrimary] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim()) {
      showWarning('Please specify the vehicle model');
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

    showSuccess(`${make} ${model.trim()} added successfully to your garage!`);
    setModel('');
    setLicensePlate('');
    setVin('');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#181528] tracking-tight">My Garage</h1>
          <p className="text-xs text-slate-500">Manage your vehicles for rapid 1-click mobile booking</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black text-xs px-4 py-2 rounded-2xl flex items-center gap-1.5 shadow-purple-cta transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Vehicle list */}
      <div className="flex flex-col gap-3">
        {vehicles.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center flex flex-col items-center shadow-card">
            <div className="w-12 h-12 rounded-full bg-[#f3ebff] text-[#5e17eb] flex items-center justify-center mb-3">
              <Car className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-black text-[#181528]">Your garage is empty</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Add your vehicle now to book a certified mobile mechanic in seconds without re-entering details.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 bg-[#5e17eb] text-white font-black text-xs px-4 py-2.5 rounded-2xl shadow-purple-cta"
            >
              Add First Car
            </button>
          </div>
        ) : (
          vehicles.map((veh) => (
            <div
              key={veh.id}
              className={`bg-white border rounded-3xl p-4.5 transition-all shadow-card flex flex-col gap-3 relative ${
                veh.is_primary ? 'border-[#5e17eb] ring-2 ring-purple-100 shadow-card-hover' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      veh.is_primary
                        ? 'bg-[#5e17eb] text-white shadow-md'
                        : 'bg-[#f3ebff] text-[#5e17eb]'
                    }`}
                  >
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-black text-sm text-[#181528]">
                        {veh.year} {veh.make} {veh.model}
                      </h2>
                      {veh.is_primary && (
                        <span className="text-[9px] font-black bg-[#f3ebff] text-[#5e17eb] px-2 py-0.5 rounded-full">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">
                      {veh.license_plate ? `Reg: ${veh.license_plate}` : 'No plate set'}
                    </p>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => {
                    confirmModal({
                      title: 'Delete this vehicle?',
                      message: `Are you sure you want to remove ${veh.year} ${veh.make} ${veh.model} (${veh.license_plate || 'No plate'}) from your garage?`,
                      type: 'danger',
                      confirmText: 'Delete',
                      cancelText: 'Keep',
                      onConfirm: () => {
                        deleteVehicle(veh.id);
                        showSuccess(`${veh.make} ${veh.model} has been removed.`);
                      },
                    });
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete vehicle"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Specs & Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-600 bg-[#f8f9fd] p-2 rounded-xl">
                  <Fuel className="w-3.5 h-3.5 text-[#5e17eb]" />
                  <span>{veh.fuel_type || 'Petrol'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 bg-[#f8f9fd] p-2 rounded-xl">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate">VIN: {veh.vin ? `${veh.vin.slice(0, 8)}...` : 'Verified'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                {!veh.is_primary ? (
                  <button
                    onClick={() => setPrimaryVehicle(veh.id)}
                    className="text-xs text-slate-600 hover:text-[#5e17eb] font-bold flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Set as Primary</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Default Vehicle</span>
                  </span>
                )}

                <Link
                  href={`/app/request?vehicle=${veh.id}`}
                  className="bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black text-xs px-4 py-2 rounded-xl shadow-purple-cta active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Book Service</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: ADD VEHICLE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 w-full max-w-md shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#5e17eb]" />
                <h2 className="text-sm font-black text-[#181528]">Add Vehicle to Garage</h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Make</label>
                  <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-3 text-xs text-[#181528] focus:border-[#5e17eb] outline-none"
                  >
                    {POPULAR_VEHICLE_MAKES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Year</label>
                  <input
                    type="number"
                    min="1995"
                    max="2026"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-3 text-xs text-[#181528] focus:border-[#5e17eb] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Model / Trim</label>
                <input
                  type="text"
                  placeholder="e.g. 3 Series Touring 330e M Sport"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-3 text-xs text-[#181528] focus:border-[#5e17eb] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Registration Plate</label>
                  <input
                    type="text"
                    placeholder="e.g. LN22 XKP"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-3 text-xs text-[#181528] focus:border-[#5e17eb] outline-none font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-3 text-xs text-[#181528] focus:border-[#5e17eb] outline-none"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">VIN (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. WBA31AY08NFP19284"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  className="w-full bg-[#f8f9fd] border border-slate-200 rounded-2xl p-3 text-xs text-[#181528] focus:border-[#5e17eb] outline-none font-mono uppercase"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="primaryCheck"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="rounded text-[#5e17eb] focus:ring-[#5e17eb] w-4 h-4"
                />
                <label htmlFor="primaryCheck" className="text-xs text-slate-700 font-bold cursor-pointer">
                  Set as Primary Vehicle
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black py-3 rounded-2xl text-xs shadow-purple-cta"
                >
                  Save Car
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
