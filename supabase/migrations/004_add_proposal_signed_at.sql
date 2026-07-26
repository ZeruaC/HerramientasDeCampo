-- The 30-day validity of a proposal should count from when the PELSA
-- advisor signs it on-site, not from a separately scheduled follow-up
-- visit. This column records that signing timestamp.
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS signed_at TIMESTAMP WITH TIME ZONE;
