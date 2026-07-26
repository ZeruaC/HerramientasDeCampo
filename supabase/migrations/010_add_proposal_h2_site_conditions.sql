-- H2 evalua la familia recomendada en base a estas 5 condiciones de sitio
-- (temperatura, autonomia requerida, mantenimiento, tipo de uso, espacio),
-- pero H5 nunca las guardaba: al reabrir una propuesta se perdia por que
-- se habia recomendado esa familia.
ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS max_temp TEXT,
  ADD COLUMN IF NOT EXISTS autonomy_req_h2 TEXT,
  ADD COLUMN IF NOT EXISTS maintenance_available TEXT,
  ADD COLUMN IF NOT EXISTS operation_type TEXT,
  ADD COLUMN IF NOT EXISTS available_space TEXT;
