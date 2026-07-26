-- Checklist Inicial captures contact person, phone and location but H5
-- never saved them — reopening a proposal lost how to reach the client.
ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS contact_person TEXT,
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT;
