-- To let a technician find a previously saved proposal and continue
-- editing it (H1-H4 flow), every input that feeds H5's calculations needs
-- to be persisted, not just the few fields H5 originally saved. Adds the
-- H1 pain-quantifier inputs, the H3 TCO comparison inputs, and the H4
-- sizing inputs that were missing.
ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS outages_per_year NUMERIC,
  ADD COLUMN IF NOT EXISTS duration_hours NUMERIC,
  ADD COLUMN IF NOT EXISTS selected_family_h4 TEXT,
  ADD COLUMN IF NOT EXISTS generic_capex NUMERIC,
  ADD COLUMN IF NOT EXISTS generic_life NUMERIC,
  ADD COLUMN IF NOT EXISTS generic_maint NUMERIC,
  ADD COLUMN IF NOT EXISTS generic_install NUMERIC,
  ADD COLUMN IF NOT EXISTS eternity_life NUMERIC,
  ADD COLUMN IF NOT EXISTS eternity_maint NUMERIC,
  ADD COLUMN IF NOT EXISTS eternity_install NUMERIC,
  ADD COLUMN IF NOT EXISTS load_power_w NUMERIC,
  ADD COLUMN IF NOT EXISTS min_temp_h4 NUMERIC,
  ADD COLUMN IF NOT EXISTS max_dod NUMERIC,
  ADD COLUMN IF NOT EXISTS inverter_efficiency NUMERIC;
