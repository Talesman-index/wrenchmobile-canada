-- ==============================================================================
-- WRENCHMOBILE CANADA - SUPABASE DATABASE SCHEMA
-- Mobile Mechanic Marketplace for Canada (Toronto, Montreal, Vancouver, Calgary, Ottawa)
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
CREATE TYPE user_role AS ENUM ('customer', 'mechanic', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'suspended');
CREATE TYPE service_type AS ENUM (
  'battery_jump',
  'battery_replacement',
  'flat_tire',
  'brake_service',
  'oil_change',
  'diagnostic_scan',
  'no_start',
  'alternator_starter',
  'other'
);
CREATE TYPE request_status AS ENUM (
  'searching',
  'accepted',
  'mechanic_on_the_way',
  'arrived',
  'in_progress',
  'awaiting_payment',
  'completed',
  'cancelled'
);
CREATE TYPE payment_status AS ENUM ('pending', 'authorized', 'succeeded', 'failed', 'refunded');

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Customer Vehicles Table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  trim TEXT,
  fuel_type TEXT DEFAULT 'Gasoline',
  license_plate TEXT,
  vin TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Mechanic Profiles Table
CREATE TABLE mechanic_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  bio TEXT,
  years_experience INT NOT NULL DEFAULT 1,
  city TEXT NOT NULL DEFAULT 'Toronto',
  province TEXT NOT NULL DEFAULT 'ON',
  latitude DOUBLE PRECISION DEFAULT 43.6532,
  longitude DOUBLE PRECISION DEFAULT -79.3832,
  service_radius_km INT NOT NULL DEFAULT 35,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  is_available BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.00,
  jobs_completed INT NOT NULL DEFAULT 0,
  id_document_url TEXT,
  insurance_doc_url TEXT,
  certification_doc_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Mechanic Services Offered
CREATE TABLE mechanic_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mechanic_id UUID NOT NULL REFERENCES mechanic_profiles(id) ON DELETE CASCADE,
  service_type service_type NOT NULL,
  base_rate NUMERIC(10,2) NOT NULL DEFAULT 89.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(mechanic_id, service_type)
);

-- 5. Service Requests Table
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mechanic_id UUID REFERENCES mechanic_profiles(id) ON DELETE SET NULL,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  service_type service_type NOT NULL,
  description TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Toronto',
  province TEXT NOT NULL DEFAULT 'ON',
  status request_status NOT NULL DEFAULT 'searching',
  estimated_amount NUMERIC(10,2) NOT NULL DEFAULT 95.00,
  labor_amount NUMERIC(10,2) DEFAULT 0.00,
  parts_amount NUMERIC(10,2) DEFAULT 0.00,
  additional_fee NUMERIC(10,2) DEFAULT 0.00,
  platform_fee NUMERIC(10,2) DEFAULT 0.00,
  tax_amount NUMERIC(10,2) DEFAULT 0.00,
  final_amount NUMERIC(10,2) DEFAULT 0.00,
  diagnostic_notes TEXT,
  work_performed TEXT,
  parts_used TEXT,
  eta_minutes INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Service Photos Table
CREATE TABLE service_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Payments Table (CAD Stripe)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL UNIQUE REFERENCES service_requests(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  mechanic_id UUID NOT NULL REFERENCES mechanic_profiles(id),
  subtotal NUMERIC(10,2) NOT NULL,
  platform_fee NUMERIC(10,2) NOT NULL,
  tax_amount NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CAD',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL UNIQUE REFERENCES service_requests(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  mechanic_id UUID NOT NULL REFERENCES mechanic_profiles(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mechanic_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mechanic_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self-update
CREATE POLICY "Profiles readable by authenticated users" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Vehicles: User owns their vehicles
CREATE POLICY "Users can view own vehicles" ON vehicles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vehicles" ON vehicles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vehicles" ON vehicles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vehicles" ON vehicles FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Mechanic Profiles: Anyone can view verified mechanics, mechanic updates own
CREATE POLICY "Verified mechanic profiles are public" ON mechanic_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Mechanic can update own profile" ON mechanic_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Service Requests: Customer & assigned mechanic can view/update
CREATE POLICY "Customers view own requests" ON service_requests FOR SELECT TO authenticated USING (auth.uid() = customer_id OR EXISTS (
  SELECT 1 FROM mechanic_profiles WHERE mechanic_profiles.user_id = auth.uid() AND (mechanic_profiles.id = service_requests.mechanic_id OR service_requests.status = 'searching')
));
CREATE POLICY "Customers can create requests" ON service_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customer and assigned mechanic can update requests" ON service_requests FOR UPDATE TO authenticated USING (
  auth.uid() = customer_id OR EXISTS (SELECT 1 FROM mechanic_profiles WHERE mechanic_profiles.user_id = auth.uid() AND mechanic_profiles.id = service_requests.mechanic_id)
);
