'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useToast } from '@/components/ui/ToastProvider';
import {
  Car,
  ChevronLeft,
  ChevronRight,
  Zap,
  BatteryCharging,
  Disc,
  ShieldAlert,
  Droplets,
  Cpu,
  AlertTriangle,
  Wrench,
  Settings,
  MapPin,
  Camera,
  Crosshair,
  CheckCircle2,
  Sparkles,
  Upload,
  X,
  Fuel,
  Calendar,
  Clock,
} from 'lucide-react';
import { SERVICE_DEFINITIONS, CANADIAN_CITIES } from '@/lib/constants';
import ServiceIcon from '@/components/ui/ServiceIcon';
import { formatCAD } from '@/lib/utils';
import { ServiceType } from '@/types/database';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/ui/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-44 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 text-xs border border-slate-200 animate-pulse">
      Chargement de la carte canadienne...
    </div>
  ),
});

function RequestMechanicFlowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { vehicles, primaryVehicle, createServiceRequest } = useApp();
  const { toast, showSuccess, showError, showWarning } = useToast();

  const preselectedVeh = searchParams.get('vehicle');
  const preselectedService = searchParams.get('service') as ServiceType | null;

  // Étape du formulaire (1: Véhicule & Panne, 2: Détails & Photos, 3: Localisation & Confirmation)
  const [step, setStep] = useState<number>(1);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    preselectedVeh || (primaryVehicle?.id || (vehicles[0]?.id ?? ''))
  );
  const [selectedService, setSelectedService] = useState<ServiceType>(
    preselectedService || 'no_start'
  );
  const [description, setDescription] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);

  // Programmation (Immédiat vs Planifié)
  const [bookingType, setBookingType] = useState<'asap' | 'scheduled'>('asap');
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:30');

  // Localisation (Par défaut Montréal Centre-Ville)
  const [locationAddress, setLocationAddress] = useState<string>(
    '1000 Rue de la Gauchetière O, Montréal, QC H3B 4W5'
  );
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 45.5017,
    lng: -73.5673,
  });
  const [city, setCity] = useState<string>('Montréal');
  const [province, setProvince] = useState<string>('QC');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  useEffect(() => {
    if (primaryVehicle && !selectedVehicleId) {
      setSelectedVehicleId(primaryVehicle.id);
    }
  }, [primaryVehicle, selectedVehicleId]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showError('La géolocalisation n’est pas supportée par votre navigateur.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationAddress(`Position GPS actuelle (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`);
        setIsLocating(false);
        showSuccess('Position GPS actuelle détectée avec succès !', 'Localisation');
      },
      (error) => {
        console.warn('Erreur géolocalisation:', error);
        setIsLocating(false);
        showWarning('Impossible de récupérer le GPS exact. Utilisation de l’adresse sélectionnée.', 'Localisation');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handlePhotoUploadMock = () => {
    if (photos.length >= 3) {
      showWarning('Vous avez atteint le maximum de 3 photos.');
      return;
    }
    const samplePhotos = [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=500&auto=format&fit=crop&q=60',
    ];
    const nextPhoto = samplePhotos[photos.length % samplePhotos.length];
    setPhotos([...photos, nextPhoto]);
    showSuccess('Photo du diagnostic ajoutée avec succès.');
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const selectedVeh = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const serviceDef = SERVICE_DEFINITIONS.find((s) => s.type === selectedService) || SERVICE_DEFINITIONS[0];

  const handleFinalSubmit = () => {
    const createdReq = createServiceRequest({
      vehicle_id: selectedVehicleId,
      service_type: selectedService,
      description: description.trim() || `Intervention ${serviceDef.label} demandée`,
      latitude: coords.lat,
      longitude: coords.lng,
      address: locationAddress,
      city,
      province,
      photos,
      estimated_amount: serviceDef.basePriceCAD,
    });

    // Redirection vers l'écran de recherche radar
    router.push(`/app/request/searching?id=${createdReq.id}`);
  };

  const iconsMap: Record<string, any> = {
    Zap: Zap,
    BatteryCharging: BatteryCharging,
    Disc: Disc,
    ShieldAlert: ShieldAlert,
    Droplets: Droplets,
    Cpu: Cpu,
    AlertTriangle: AlertTriangle,
    Wrench: Wrench,
    Settings: Settings,
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* En-tête & Barre de progression */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else router.push('/app');
            }}
            className="w-9 h-9 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-black text-[#181528]">
            Étape <strong className="text-[#5e17eb]">{step}</strong> sur 5
          </span>

          <div className="w-9" />
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-5">
          <div
            className="bg-gradient-to-r from-[#5e17eb] to-[#7c3aed] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* ÉTAPE 1 : Choix du véhicule */}
      {step === 1 && (
        <div className="flex-1 flex flex-col">
          <div>
            <h1 className="text-2xl font-black text-[#181528] tracking-tight">Quel véhicule a besoin d&apos;aide ?</h1>
            <p className="text-xs text-slate-500 mt-1">Sélectionnez la voiture dans votre garage</p>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            {vehicles.map((v) => {
              const isSelected = v.id === selectedVehicleId;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`text-left p-4 rounded-3xl border transition-all flex items-center justify-between shadow-card ${
                    isSelected
                      ? 'bg-[#f3ebff] border-[#5e17eb] ring-2 ring-purple-100 shadow-card-hover'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#5e17eb] text-white shadow-md'
                          : 'bg-[#f3ebff] text-[#5e17eb]'
                      }`}
                    >
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-sm text-[#181528]">
                          {v.year} {v.make} {v.model}
                        </p>
                        {v.is_primary && (
                          <span className="text-[9px] font-black bg-[#f3ebff] text-[#5e17eb] px-2 py-0.5 rounded-full">
                            PRINCIPAL
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">
                        {v.license_plate ? `Plaque : ${v.license_plate}` : 'Sans plaque'} • {v.fuel_type || 'Essence'}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-[#5e17eb] bg-[#5e17eb]' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              );
            })}

            <button
              onClick={() => router.push('/app/vehicles')}
              className="p-3.5 border-2 border-dashed border-purple-200 hover:border-purple-300 rounded-3xl text-xs font-black text-[#5e17eb] flex items-center justify-center gap-2 bg-white/80"
            >
              + Ajouter un autre véhicule au garage
            </button>
          </div>
        </div>
      )}

      {/* ÉTAPE 2 : Choix du problème */}
      {step === 2 && (
        <div className="flex-1 flex flex-col">
          <div>
            <h1 className="text-2xl font-black text-[#181528] tracking-tight">Quel est le problème ?</h1>
            <p className="text-xs text-slate-500 mt-1">Sélectionnez la prestation ou le symptôme</p>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
            {SERVICE_DEFINITIONS.map((srv) => {
              const Icon = iconsMap[srv.iconName] || Wrench;
              const isSelected = srv.type === selectedService;

              return (
                <button
                  key={srv.type}
                  onClick={() => setSelectedService(srv.type)}
                  className={`text-left p-4 rounded-3xl border transition-all flex items-start gap-3.5 shadow-card ${
                    isSelected
                      ? 'bg-[#f3ebff] border-[#5e17eb] ring-2 ring-purple-100 shadow-card-hover'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <ServiceIcon type={srv.type} size="md" />
                  <div className="flex-1">
                    <p className="font-black text-xs text-[#181528] leading-tight">{srv.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{srv.shortDesc}</p>
                    <p className="text-[11px] font-black text-[#5e17eb] mt-1.5">
                      Dès {formatCAD(srv.basePriceCAD)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ÉTAPE 3 : Description & Photos */}
      {step === 3 && (
        <div className="flex-1 flex flex-col">
          <div>
            <h1 className="text-2xl font-black text-[#181528] tracking-tight">Décrivez la situation</h1>
            <p className="text-xs text-slate-500 mt-1">
              Bruits anormaux, voyants allumés ou contexte de la panne
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex : La voiture clique au démarrage mais le moteur ne tourne pas. Voyant batterie allumé. Garée dans l'allée de mon domicile."
              rows={4}
              className="w-full bg-white border border-slate-200 rounded-3xl p-4 text-xs text-[#181528] placeholder:text-slate-400 focus:border-[#5e17eb] focus:ring-2 focus:ring-purple-100 outline-none resize-none leading-relaxed shadow-card"
            />

            {/* Photos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#5e17eb]" />
                  <span>Photos du problème (optionnel, max 3)</span>
                </label>
                <span className="text-[10px] text-slate-400">{photos.length}/3 ajoutée(s)</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {photos.map((url, i) => (
                  <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-card">
                    <img src={url} alt="Photo panne" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {photos.length < 3 && (
                  <button
                    onClick={handlePhotoUploadMock}
                    className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#5e17eb] bg-white flex flex-col items-center justify-center text-slate-400 hover:text-[#5e17eb] transition-colors shadow-card"
                  >
                    <Upload className="w-4 h-4 mb-1" />
                    <span className="text-[10px] font-bold">Ajouter</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ÉTAPE 4 : Date & Localisation */}
      {step === 4 && (
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#181528] tracking-tight">Quand & Où ?</h1>
            <p className="text-xs text-slate-500 mt-1">Intervention d&apos;urgence ou rendez-vous planifié</p>
          </div>

          {/* Mode de réservation */}
          <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center gap-1 text-xs">
            <button
              onClick={() => setBookingType('asap')}
              className={`flex-1 py-2.5 rounded-xl font-black transition-all flex items-center justify-center gap-1.5 ${
                bookingType === 'asap' ? 'bg-[#5e17eb] text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Urgence Immédiate (~25 min)</span>
            </button>
            <button
              onClick={() => setBookingType('scheduled')}
              className={`flex-1 py-2.5 rounded-xl font-black transition-all flex items-center justify-center gap-1.5 ${
                bookingType === 'scheduled' ? 'bg-[#5e17eb] text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Planifier un rendez-vous</span>
            </button>
          </div>

          {/* Calendrier si planifié */}
          {bookingType === 'scheduled' && (
            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-card flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#181528]">Août 2026</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Choisir la date</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'].map((d) => (
                  <span key={d} className="text-[9px] font-black text-slate-400 py-1">{d}</span>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((dayNum) => {
                  const isPicked = dayNum === selectedDay;
                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => setSelectedDay(dayNum)}
                      className={`h-7 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                        isPicked
                          ? 'bg-[#5e17eb] text-white font-black shadow-sm'
                          : 'text-slate-700 hover:bg-[#f3ebff]'
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Choisir l&apos;heure</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {['09:00', '10:30', '13:00', '14:30', '16:00', '17:30'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-1.5 rounded-xl text-[10px] font-black border transition-all ${
                        selectedTimeSlot === slot
                          ? 'bg-[#5e17eb] text-white border-[#5e17eb]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Localisation & Carte */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="bg-[#f3ebff] hover:bg-purple-100 border border-purple-200 text-[#5e17eb] font-black p-3 rounded-2xl flex items-center justify-center gap-2 text-xs transition-colors shadow-card"
            >
              <Crosshair className={`w-4 h-4 text-[#5e17eb] ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Détection GPS en cours...' : 'Utiliser ma position GPS actuelle'}</span>
            </button>

            <div className="relative">
              <MapPin className="w-4 h-4 text-[#5e17eb] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder="Entrez l'adresse, code postal..."
                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#181528] focus:border-[#5e17eb] outline-none shadow-card"
              />
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-card">
              <MapComponent
                customerCoords={coords}
                address={locationAddress}
                height="150px"
                onLocationChange={(newLat, newLng) => {
                  setCoords({ lat: newLat, lng: newLng });
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ÉTAPE 5 : Récapitulatif & Devis */}
      {step === 5 && (
        <div className="flex-1 flex flex-col">
          <div>
            <h1 className="text-2xl font-black text-[#181528] tracking-tight">Récapitulatif de la commande</h1>
            <p className="text-xs text-slate-500 mt-1">Vérifiez les détails avant la recherche du mécanicien</p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {/* Véhicule */}
            <div className="bg-white border border-slate-100 rounded-3xl p-3.5 flex items-center justify-between shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#f3ebff] text-[#5e17eb] flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Véhicule</p>
                  <p className="text-xs font-black text-[#181528]">
                    {selectedVeh?.year} {selectedVeh?.make} {selectedVeh?.model}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-[#5e17eb] font-black"
              >
                Modifier
              </button>
            </div>

            {/* Service */}
            <div className="bg-white border border-slate-100 rounded-3xl p-3.5 flex items-center justify-between shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#f3ebff] flex items-center justify-center text-[#5e17eb]">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Service demandé</p>
                  <p className="text-xs font-black text-[#181528]">{serviceDef.label}</p>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="text-xs text-[#5e17eb] font-black"
              >
                Modifier
              </button>
            </div>

            {/* Localisation & Horaire */}
            <div className="bg-white border border-slate-100 rounded-3xl p-3.5 flex items-center justify-between shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    {bookingType === 'asap' ? 'Urgence Immédiate' : `Août ${selectedDay} • ${selectedTimeSlot}`}
                  </p>
                  <p className="text-xs font-black text-[#181528] line-clamp-1">{locationAddress}</p>
                </div>
              </div>
              <button
                onClick={() => setStep(4)}
                className="text-xs text-[#5e17eb] font-black shrink-0"
              >
                Modifier
              </button>
            </div>

            {/* Estimation de prix */}
            <div className="bg-gradient-to-r from-[#f8f4ff] to-[#f1e6ff] border border-purple-200 rounded-3xl p-4 shadow-card">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-800 font-bold">Diagnostic & Déplacement estimé</span>
                <span className="text-base font-black text-[#5e17eb]">
                  {formatCAD(serviceDef.basePriceCAD)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                * Comprend le déplacement du fourgon atelier et le diagnostic sur place. Pièces ou main-d&apos;œuvre majeure soumises à votre approbation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Boutons d'action en bas */}
      <div className="pt-5 pb-2">
        {step < 5 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black py-4 px-6 rounded-2xl shadow-purple-cta flex items-center justify-center gap-2 text-sm active:scale-[0.98] transition-all"
          >
            <span>Continuer</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinalSubmit}
            className="w-full bg-[#5e17eb] hover:bg-[#4c0ec4] text-white font-black py-4 px-6 rounded-2xl shadow-purple-cta flex items-center justify-center gap-2 text-base active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-5 h-5 text-white" />
            <span>Trouver un mécanicien mobile</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function RequestMechanicFlowPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-xs">Chargement de la commande...</div>}>
      <RequestMechanicFlowContent />
    </Suspense>
  );
}
