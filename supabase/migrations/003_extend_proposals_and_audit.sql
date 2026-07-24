-- Extend proposals table to store audit and installation-checklist data
ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS audit_data JSONB,
  ADD COLUMN IF NOT EXISTS checklist_data JSONB,
  ADD COLUMN IF NOT EXISTS selected_subfamily TEXT,
  ADD COLUMN IF NOT EXISTS generic_capex NUMERIC,
  ADD COLUMN IF NOT EXISTS generic_life NUMERIC,
  ADD COLUMN IF NOT EXISTS generic_maint NUMERIC,
  ADD COLUMN IF NOT EXISTS generic_install NUMERIC,
  ADD COLUMN IF NOT EXISTS tco_savings_10y NUMERIC,
  ADD COLUMN IF NOT EXISTS payback_months NUMERIC,
  ADD COLUMN IF NOT EXISTS load_power_w NUMERIC,
  ADD COLUMN IF NOT EXISTS max_dod NUMERIC,
  ADD COLUMN IF NOT EXISTS inverter_efficiency NUMERIC;

-- Index for JSONB audit data to allow quick lookups by client context
CREATE INDEX IF NOT EXISTS idx_proposals_audit_data ON public.proposals USING GIN (audit_data);
