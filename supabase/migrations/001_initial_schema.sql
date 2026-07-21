-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Proposals
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  proposal_number TEXT UNIQUE NOT NULL, -- PROP-YYYY-MM-DD-###
  client_name TEXT NOT NULL,
  sector TEXT,
  outage_hours_per_week NUMERIC,
  affected_lines NUMERIC,
  cost_per_hour NUMERIC,
  annual_loss NUMERIC,
  recommended_family TEXT,
  eternity_capex NUMERIC,
  system_voltage NUMERIC,
  selected_model TEXT,
  autonomy_hours NUMERIC,
  status TEXT DEFAULT 'draft', -- draft, sent, accepted, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Products (Battery catalog)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_name TEXT UNIQUE NOT NULL,
  familia TEXT NOT NULL, -- MOTIVE POWER, RESERVE POWER
  subfamilia TEXT NOT NULL, -- OPzV, OPzS, QUASAR, etc.
  voltage_v NUMERIC,
  capacity_ah NUMERIC,
  weight_kg NUMERIC,
  cycles_at_80pct_dod NUMERIC,
  floating_life_years NUMERIC,
  maintenance_required BOOLEAN,
  specifications JSONB, -- weight, dimensions, resistance, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Prices (future: dynamic pricing)
CREATE TABLE IF NOT EXISTS public.prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  currency TEXT DEFAULT 'EUR',
  price NUMERIC NOT NULL,
  effective_date DATE NOT NULL,
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for proposals
CREATE POLICY "Users can view own proposals"
  ON public.proposals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create proposals"
  ON public.proposals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own proposals"
  ON public.proposals FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can read products"
  ON public.products FOR SELECT
  USING (true);

-- RLS Policies for prices (public read, admin write)
CREATE POLICY "Anyone can read prices"
  ON public.prices FOR SELECT
  USING (true);

-- Indexes for performance
CREATE INDEX idx_proposals_user_id ON public.proposals(user_id);
CREATE INDEX idx_proposals_proposal_number ON public.proposals(proposal_number);
CREATE INDEX idx_products_familia ON public.products(familia);
CREATE INDEX idx_products_subfamilia ON public.products(subfamilia);
CREATE INDEX idx_prices_product_id ON public.prices(product_id);
