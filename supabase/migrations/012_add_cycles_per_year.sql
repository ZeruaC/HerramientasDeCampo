-- Criterio 1 de la matriz de selección de la formación (Fase 2, sección 2.1):
-- ciclos/año del cliente, capturado en H2. Bajo (<500) / Medio (500-1000) /
-- Alto (>1000 o multi-turno).
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS cycles_per_year text;
