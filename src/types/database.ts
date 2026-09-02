export type UserRole = 'customer' | 'mechanic' | 'admin';
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export type ServiceType =
  | 'battery_jump'
  | 'battery_replacement'
  | 'flat_tire'
  | 'brake_service'
  | 'oil_change'
  | 'diagnostic_scan'
  | 'no_start'
  | 'alternator_starter'
  | 'other';

export type RequestStatus =
  | 'searching'
  | 'accepted'
  | 'mechanic_on_the_way'
  | 'arrived'
  | 'in_progress'
  | 'awaiting_payment'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'authorized' | 'succeeded' | 'failed' | 'refunded';

export interface Profile {
  id: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Vehicle {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  fuel_type?: string;
  license_plate?: string;
  vin?: string;
  is_primary: boolean;
  created_at: string;
}

export interface MechanicProfile {
  id: string;
  user_id: string;
  business_name?: string;
  bio?: string;
  years_experience: number;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  service_radius_km: number;
  verification_status: VerificationStatus;
  is_available: boolean;
  rating: number;
  jobs_completed: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  services_offered: ServiceType[];
  created_at: string;
}

export interface ServiceRequest {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone?: string;
  mechanic_id?: string;
  mechanic?: MechanicProfile;
  vehicle_id: string;
  vehicle: Vehicle;
  service_type: ServiceType;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  province: string;
  status: RequestStatus;
  estimated_amount: number;
  labor_amount?: number;
  parts_amount?: number;
  additional_fee?: number;
  platform_fee?: number;
  tax_amount?: number;
  final_amount?: number;
  diagnostic_notes?: string;
  work_performed?: string;
  parts_used?: string;
  photos?: string[];
  eta_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  request_id: string;
  customer_id: string;
  mechanic_id: string;
  subtotal: number;
  platform_fee: number;
  tax_amount: number;
  total: number;
  currency: string;
  payment_status: PaymentStatus;
  stripe_payment_id?: string;
  created_at: string;
}

export interface Review {
  id: string;
  request_id: string;
  customer_id: string;
  mechanic_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface ServiceDefinition {
  type: ServiceType;
  label: string;
  shortDesc: string;
  iconName: string;
  basePriceCAD: number;
  estimatedDuration: string;
}
