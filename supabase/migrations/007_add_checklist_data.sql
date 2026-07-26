-- H6 (Checklist de instalación y garantía) computed a pass/fail status but
-- discarded the actual 20 verification points (OK/NOK, measured values,
-- observations) and the install metadata (técnico, ubicación, fecha,
-- cantidad, serie) — nothing survived past the browser session, even
-- though this is the document that activates factory warranty coverage.
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS checklist_data JSONB;
