-- H1 captura una auditoría completa de la instalación actual (marca, modelo,
-- tecnología, capacidad, C-rate, nº de elementos, años en servicio, tipo de
-- uso, disponibilidad de mantenimiento, espacio, problemas detectados y
-- observaciones) en el objeto `audit` del store, pero H5 nunca lo guardaba.
ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS audit_data JSONB;
