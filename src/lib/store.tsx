'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Profile,
  Vehicle,
  MechanicProfile,
  ServiceRequest,
  Payment,
  Review,
  UserRole,
  RequestStatus,
  ServiceType,
  VerificationStatus,
} from '@/types/database';
import { PLATFORM_FEE_PERCENTAGE, LONDON_AREAS } from './constants';

interface AppContextType {
  // Current user & role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: Profile;
  updateCurrentUser: (profile: Partial<Profile>) => void;

  // Vehicles
  vehicles: Vehicle[];
  primaryVehicle: Vehicle | undefined;
  addVehicle: (v: Omit<Vehicle, 'id' | 'user_id' | 'created_at'>) => Vehicle;
  updateVehicle: (id: string, v: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  setPrimaryVehicle: (id: string) => void;

  // Mechanics
  mechanics: MechanicProfile[];
  currentMechanicProfile: MechanicProfile;
  toggleMechanicAvailability: () => void;
  updateMechanicVerification: (mechanicId: string, status: VerificationStatus) => void;
  updateMechanicProfile: (id: string, updates: Partial<MechanicProfile>) => void;

  // Service requests
  serviceRequests: ServiceRequest[];
  activeCustomerRequest: ServiceRequest | undefined;
  activeMechanicJob: ServiceRequest | undefined;
  createServiceRequest: (data: {
    vehicle_id: string;
    service_type: ServiceType;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    province: string;
    photos?: string[];
    estimated_amount: number;
  }) => ServiceRequest;
  updateRequestStatus: (requestId: string, status: RequestStatus, extraData?: Partial<ServiceRequest>) => void;
  submitFinalQuote: (requestId: string, quote: {
    diagnostic_notes: string;
    work_performed: string;
    parts_used?: string;
    labor_amount: number;
    parts_amount: number;
    additional_fee?: number;
  }) => void;
  processPayment: (requestId: string, paymentMethodId?: string) => Promise<Payment>;
  submitReview: (requestId: string, rating: number, comment?: string) => void;
  cancelRequest: (requestId: string) => void;

  // Platform & Stats
  payments: Payment[];
  reviews: Review[];
  resetDemoData: () => void;
}

const SEED_CUSTOMER: Profile = {
  id: 'usr-cust-001',
  role: 'customer',
  first_name: 'James',
  last_name: 'Wilson',
  email: 'james.wilson@example.co.uk',
  phone: '+44 20 7946 0912',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  created_at: new Date().toISOString(),
};

const SEED_VEHICLES: Vehicle[] = [
  {
    id: 'veh-001',
    user_id: 'usr-cust-001',
    make: 'BMW',
    model: '3 Series Touring',
    year: 2022,
    trim: '330e M Sport PHEV',
    fuel_type: 'Hybrid',
    license_plate: 'LN22 XKP',
    vin: 'WBA31AY08NFP19284',
    is_primary: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'veh-002',
    user_id: 'usr-cust-001',
    make: 'Land Rover',
    model: 'Range Rover Evoque',
    year: 2023,
    trim: 'D200 R-Dynamic SE',
    fuel_type: 'Diesel',
    license_plate: 'LD71 WXY',
    vin: 'SALVA2BC6MH109283',
    is_primary: false,
    created_at: new Date().toISOString(),
  },
];

const SEED_MECHANICS: MechanicProfile[] = [
  {
    id: 'mech-001',
    user_id: 'usr-mech-001',
    first_name: 'Marcus',
    last_name: 'Sterling',
    email: 'marcus.sterling@wrenchmobile.co.uk',
    phone: '+44 20 7946 0144',
    business_name: 'Master Mobile Technician & Fleet Lead',
    bio: 'IMI Level 4 Certified Master Tech with 14+ years experience across German and British prestige marques. Fully equipped mobile workshop van for Central London.',
    years_experience: 14,
    city: 'Westminster',
    province: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    service_radius_km: 30,
    verification_status: 'verified',
    is_available: true,
    rating: 4.98,
    jobs_completed: 184,
    avatar_url: '/images/landing/mechanic_pro.jpg',
    services_offered: [
      'battery_jump',
      'battery_replacement',
      'flat_tire',
      'brake_service',
      'oil_change',
      'diagnostic_scan',
      'no_start',
      'alternator_starter',
      'other',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'mech-002',
    user_id: 'usr-mech-002',
    first_name: 'Sarah',
    last_name: 'Jenkins',
    email: 'sarah.jenkins@wrenchmobile.co.uk',
    phone: '+44 20 7946 0188',
    business_name: 'Diagnostic & EV/Hybrid Specialist',
    bio: 'Senior automotive technician certified in dealer-level electronic diagnostics, high-voltage battery systems and ECU coding. Rapid mobile response.',
    years_experience: 9,
    city: 'Camden',
    province: 'London',
    latitude: 51.5390,
    longitude: -0.1426,
    service_radius_km: 25,
    verification_status: 'verified',
    is_available: true,
    rating: 4.96,
    jobs_completed: 112,
    avatar_url: '/images/special_offer_mechanic.jpg',
    services_offered: [
      'battery_jump',
      'battery_replacement',
      'diagnostic_scan',
      'brake_service',
      'oil_change',
      'no_start',
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'mech-003',
    user_id: 'usr-mech-003',
    first_name: 'David',
    last_name: 'Clarke',
    email: 'david.clarke@wrenchmobile.co.uk',
    phone: '+44 20 7946 0112',
    business_name: 'Mobile Servicing & Rapid Response',
    bio: 'Dedicated mobile technician carrying high-grade oils, OEM brake parts and on-site tyre fitting machinery. Ready across South and East London.',
    years_experience: 6,
    city: 'Southwark',
    province: 'London',
    latitude: 51.5033,
    longitude: -0.0895,
    service_radius_km: 20,
    verification_status: 'verified',
    is_available: true,
    rating: 4.93,
    jobs_completed: 78,
    avatar_url: '/images/service_provider_mechanics.jpg',
    services_offered: ['oil_change', 'flat_tire', 'battery_jump', 'brake_service'],
    created_at: new Date().toISOString(),
  },
];

const SEED_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-hist-001',
    customer_id: 'usr-cust-001',
    customer_name: 'James Wilson',
    customer_phone: '+44 20 7946 0912',
    mechanic_id: 'mech-001',
    mechanic: SEED_MECHANICS[0],
    vehicle_id: 'veh-001',
    vehicle: SEED_VEHICLES[0],
    service_type: 'brake_service',
    description: 'High-pitched squeal from front nearside brake when slowing at low speeds in wet weather.',
    latitude: 51.5194,
    longitude: -0.1588,
    address: '45 Baker Street, Marylebone, London, W1U 8ED',
    city: 'Westminster',
    province: 'London',
    status: 'completed',
    estimated_amount: 139.0,
    labor_amount: 85.0,
    parts_amount: 64.0,
    additional_fee: 0,
    platform_fee: 17.88,
    tax_amount: 33.38,
    final_amount: 200.26,
    diagnostic_notes: 'Front brake pads worn down to 2.5mm. Replaced with Brembo OEM-grade pads, lubed caliper slider pins and cleaned carriers.',
    work_performed: 'Front axle brake pads replacement, caliper slide service & brake wear sensor reset',
    parts_used: 'Brembo Low-Met Ceramic Front Pad Set & Electronic Wear Sensor',
    eta_minutes: 0,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

const SEED_PAYMENTS: Payment[] = [
  {
    id: 'pay-001',
    request_id: 'req-hist-001',
    customer_id: 'usr-cust-001',
    mechanic_id: 'mech-001',
    subtotal: 149.0,
    platform_fee: 17.88,
    tax_amount: 33.38,
    total: 200.26,
    currency: 'GBP',
    payment_status: 'succeeded',
    stripe_payment_id: 'pi_3Nh49kL893KlM94Jk',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    request_id: 'req-hist-001',
    customer_id: 'usr-cust-001',
    mechanic_id: 'mech-001',
    rating: 5,
    comment: 'Marcus arrived right on time outside our Marylebone flat. Replaced the brake pads cleanly and with zero fuss. Super professional service!',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [currentUser, setCurrentUser] = useState<Profile>(SEED_CUSTOMER);
  const [vehicles, setVehicles] = useState<Vehicle[]>(SEED_VEHICLES);
  const [mechanics, setMechanics] = useState<MechanicProfile[]>(SEED_MECHANICS);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(SEED_REQUESTS);
  const [payments, setPayments] = useState<Payment[]>(SEED_PAYMENTS);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const storedState = localStorage.getItem('wrench_app_state_london_v1');
      if (storedState) {
        const parsed = JSON.parse(storedState);
        if (parsed.currentRole) setCurrentRole(parsed.currentRole);
        if (parsed.currentUser) setCurrentUser(parsed.currentUser);
        if (parsed.vehicles) setVehicles(parsed.vehicles);
        if (parsed.mechanics) setMechanics(parsed.mechanics);
        if (parsed.serviceRequests) setServiceRequests(parsed.serviceRequests);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.reviews) setReviews(parsed.reviews);
      }
    } catch (e) {
      console.warn('Error loading demo state:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        'wrench_app_state_london_v1',
        JSON.stringify({
          currentRole,
          currentUser,
          vehicles,
          mechanics,
          serviceRequests,
          payments,
          reviews,
        })
      );
    } catch (e) {
      console.warn('Error saving demo state:', e);
    }
  }, [isLoaded, currentRole, currentUser, vehicles, mechanics, serviceRequests, payments, reviews]);

  const primaryVehicle = vehicles.find((v) => v.is_primary) || vehicles[0];
  const currentMechanicProfile = mechanics[0];

  const updateCurrentUser = (profileUpdates: Partial<Profile>) => {
    setCurrentUser((prev) => ({ ...prev, ...profileUpdates }));
  };

  const addVehicle = (v: Omit<Vehicle, 'id' | 'user_id' | 'created_at'>) => {
    const newVehicle: Vehicle = {
      ...v,
      id: `veh-${Date.now()}`,
      user_id: currentUser.id,
      created_at: new Date().toISOString(),
      is_primary: vehicles.length === 0 ? true : v.is_primary,
    };
    setVehicles((prev) => {
      let updated = [...prev];
      if (newVehicle.is_primary) {
        updated = updated.map((item) => ({ ...item, is_primary: false }));
      }
      return [newVehicle, ...updated];
    });
    return newVehicle;
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((veh) => {
        if (veh.id === id) {
          const updated = { ...veh, ...updates };
          return updated;
        }
        if (updates.is_primary) {
          return { ...veh, is_primary: false };
        }
        return veh;
      })
    );
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => {
      const remaining = prev.filter((v) => v.id !== id);
      if (remaining.length > 0 && !remaining.some((v) => v.is_primary)) {
        remaining[0].is_primary = true;
      }
      return remaining;
    });
  };

  const setPrimaryVehicle = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) => ({
        ...v,
        is_primary: v.id === id,
      }))
    );
  };

  const toggleMechanicAvailability = () => {
    setMechanics((prev) =>
      prev.map((m) =>
        m.id === currentMechanicProfile.id ? { ...m, is_available: !m.is_available } : m
      )
    );
  };

  const updateMechanicVerification = (mechanicId: string, status: VerificationStatus) => {
    setMechanics((prev) =>
      prev.map((m) => (m.id === mechanicId ? { ...m, verification_status: status } : m))
    );
  };

  const updateMechanicProfile = (id: string, updates: Partial<MechanicProfile>) => {
    setMechanics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const createServiceRequest = (data: {
    vehicle_id: string;
    service_type: ServiceType;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    province: string;
    photos?: string[];
    estimated_amount: number;
  }) => {
    const selectedVeh = vehicles.find((v) => v.id === data.vehicle_id) || vehicles[0];

    const newRequest: ServiceRequest = {
      id: `req-${Date.now()}`,
      customer_id: currentUser.id,
      customer_name: `${currentUser.first_name} ${currentUser.last_name}`,
      customer_phone: currentUser.phone,
      vehicle_id: selectedVeh?.id || 'veh-default',
      vehicle: selectedVeh || SEED_VEHICLES[0],
      service_type: data.service_type,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      city: data.city || 'Westminster',
      province: data.province || 'London',
      status: 'searching',
      estimated_amount: data.estimated_amount,
      photos: data.photos || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setServiceRequests((prev) => [newRequest, ...prev]);

    // Simulated search and automatic dispatch
    setTimeout(() => {
      const candidate = mechanics.find((m) => m.verification_status === 'verified' && m.is_available) || mechanics[0];
      if (candidate) {
        setServiceRequests((currentList) =>
          currentList.map((req) =>
            req.id === newRequest.id && req.status === 'searching'
              ? {
                  ...req,
                  status: 'accepted',
                  mechanic_id: candidate.id,
                  mechanic: candidate,
                  eta_minutes: 20,
                  updated_at: new Date().toISOString(),
                }
              : req
          )
        );
      }
    }, 4500);

    return newRequest;
  };

  const updateRequestStatus = (
    requestId: string,
    status: RequestStatus,
    extraData?: Partial<ServiceRequest>
  ) => {
    setServiceRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const updated: ServiceRequest = {
            ...req,
            ...extraData,
            status,
            updated_at: new Date().toISOString(),
          };
          if (status === 'accepted' && !updated.mechanic) {
            updated.mechanic = currentMechanicProfile;
            updated.mechanic_id = currentMechanicProfile.id;
            updated.eta_minutes = updated.eta_minutes || 20;
          }
          return updated;
        }
        return req;
      })
    );
  };

  const submitFinalQuote = (
    requestId: string,
    quote: {
      diagnostic_notes: string;
      work_performed: string;
      parts_used?: string;
      labor_amount: number;
      parts_amount: number;
      additional_fee?: number;
    }
  ) => {
    const subtotal = quote.labor_amount + quote.parts_amount + (quote.additional_fee || 0);
    const platformFee = Math.round(subtotal * PLATFORM_FEE_PERCENTAGE * 100) / 100;
    // 20% UK standard VAT
    const taxAmount = Math.round((subtotal + platformFee) * 0.20 * 100) / 100;
    const finalAmount = Math.round((subtotal + platformFee + taxAmount) * 100) / 100;

    setServiceRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'awaiting_payment',
              diagnostic_notes: quote.diagnostic_notes,
              work_performed: quote.work_performed,
              parts_used: quote.parts_used,
              labor_amount: quote.labor_amount,
              parts_amount: quote.parts_amount,
              additional_fee: quote.additional_fee || 0,
              platform_fee: platformFee,
              tax_amount: taxAmount,
              final_amount: finalAmount,
              updated_at: new Date().toISOString(),
            }
          : req
      )
    );
  };

  const processPayment = async (requestId: string): Promise<Payment> => {
    const req = serviceRequests.find((r) => r.id === requestId);
    if (!req) throw new Error('Service request not found');

    const subtotal = (req.labor_amount || 0) + (req.parts_amount || 0) + (req.additional_fee || 0);
    const platformFee = req.platform_fee || Math.round(subtotal * PLATFORM_FEE_PERCENTAGE * 100) / 100;
    const taxAmount = req.tax_amount || Math.round((subtotal + platformFee) * 0.20 * 100) / 100;
    const total = req.final_amount || subtotal + platformFee + taxAmount;

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      request_id: req.id,
      customer_id: req.customer_id,
      mechanic_id: req.mechanic_id || 'mech-001',
      subtotal,
      platform_fee: platformFee,
      tax_amount: taxAmount,
      total,
      currency: 'GBP',
      payment_status: 'succeeded',
      stripe_payment_id: `pi_uk_${Math.random().toString(36).substring(2, 10)}`,
      created_at: new Date().toISOString(),
    };

    setPayments((prev) => [newPayment, ...prev]);

    setServiceRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'completed',
              updated_at: new Date().toISOString(),
            }
          : r
      )
    );

    // Increment completed jobs count for mechanic
    setMechanics((prev) =>
      prev.map((m) =>
        m.id === req.mechanic_id ? { ...m, jobs_completed: m.jobs_completed + 1 } : m
      )
    );

    return newPayment;
  };

  const submitReview = (requestId: string, rating: number, comment?: string) => {
    const req = serviceRequests.find((r) => r.id === requestId);
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      request_id: requestId,
      customer_id: req?.customer_id || currentUser.id,
      mechanic_id: req?.mechanic_id || 'mech-001',
      rating,
      comment,
      created_at: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  const cancelRequest = (requestId: string) => {
    setServiceRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'cancelled',
              updated_at: new Date().toISOString(),
            }
          : r
      )
    );
  };

  const resetDemoData = () => {
    setCurrentRole('customer');
    setCurrentUser(SEED_CUSTOMER);
    setVehicles(SEED_VEHICLES);
    setMechanics(SEED_MECHANICS);
    setServiceRequests(SEED_REQUESTS);
    setPayments(SEED_PAYMENTS);
    setReviews(SEED_REVIEWS);
    try {
      localStorage.removeItem('wrench_app_state_london_v1');
    } catch {}
  };

  const activeCustomerRequest = serviceRequests.find(
    (r) =>
      r.customer_id === currentUser.id &&
      r.status !== 'completed' &&
      r.status !== 'cancelled'
  );

  const activeMechanicJob = serviceRequests.find(
    (r) =>
      r.mechanic_id === currentMechanicProfile.id &&
      r.status !== 'completed' &&
      r.status !== 'cancelled'
  );

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        updateCurrentUser,
        vehicles,
        primaryVehicle,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        setPrimaryVehicle,
        mechanics,
        currentMechanicProfile,
        toggleMechanicAvailability,
        updateMechanicVerification,
        updateMechanicProfile,
        serviceRequests,
        activeCustomerRequest,
        activeMechanicJob,
        createServiceRequest,
        updateRequestStatus,
        submitFinalQuote,
        processPayment,
        submitReview,
        cancelRequest,
        payments,
        reviews,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
