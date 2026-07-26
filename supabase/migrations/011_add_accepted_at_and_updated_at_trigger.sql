-- El checklist de H6 marca 'accepted' cuando los 20 puntos estan OK (esto es
-- efectivamente la venta/entrega cerrada), pero no quedaba ningun registro de
-- CUANDO paso eso -- a diferencia de signed_at en H5.
ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ;

-- updated_at tenia un default de insert pero ningun trigger que lo
-- mantuviera al dia en cada UPDATE: quedaba congelado en la fecha de
-- creacion para siempre, aunque se firmara o se guardara el checklist despues.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS proposals_set_updated_at ON public.proposals;
CREATE TRIGGER proposals_set_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
