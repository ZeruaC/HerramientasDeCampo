/**
 * Datos técnico-comerciales de familias Eternity
 * Fuente: FASE_2_CONTENIDO.md - Especificaciones reales
 *
 * Estructura orientada a IMPACTO OPERATIVO, no solo especificaciones
 */

export interface FamilySpec {
  name: string;
  technology: string;
  maintenance: 'periódico' | 'cero';
  cycles: string;
  lifeYears: string;
  priceRange: string;
  degradationImpact: string;
  operationalRisk: string;
  advantages: string[];
  limitations: string[];
  tco5YearsEstimate: string;
  recommendation: string;
}

export const familyDatabase: Record<string, FamilySpec> = {
  'Larga Duración': {
    name: 'Larga Duración',
    technology: 'Flooded (Inundada)',
    maintenance: 'periódico',
    cycles: '1000+ ciclos @ 80% DoD',
    lifeYears: '8-10 años',
    priceRange: '€2.000-2.200',
    degradationImpact:
      'Año 3-4: Voltaje baja ~10% por sulfatación en calor. ' +
      'Máquina 3000W: Corriente sube ~15% para compensar.\n' +
      '  • 11% por caída de voltaje (P=V×I)\n' +
      '  • 4% adicional por aumento de Ri (resistencia interna degrada)\n\n' +
      'Consecuencia: Equipos trabajan 15% más corriente → más calor (I²R) → ' +
      'batería se calienta → degrada más rápido (ciclo positivo).\n\n' +
      'Año 5+: Fallo catastrófico sin aviso.',
    operationalRisk:
      'ALTO en El Salvador: Clima cálido acelera sulfatación. ' +
      'Requiere agua destilada cada 2-3 meses (imprescindible en tropicales). ' +
      'Sin mantenimiento = muerte garantizada en año 3.',
    advantages: [
      'Bajo costo inicial',
      'Ciclos profundos tolerados (~1000)',
      'Mantenimiento sencillo (agua destilada)',
      'Disponibilidad inmediata'
    ],
    limitations: [
      'Requiere mantenimiento periódico OBLIGATORIO en El Salvador',
      'Degrada rápido en calor (>35°C)',
      'Riesgo de sulfatación por ciclos parciales',
      'Vida media: 4-5 años si falla mantenimiento'
    ],
    tco5YearsEstimate:
      'Costo inicial: €2.000 | Mantenimiento: €600-1.200 | Downtime: €2.000-5.000 | ' +
      'TOTAL: €4.600-8.200 (muy variable por clima)',
    recommendation:
      '✅ Recomendado SI: Personal técnico disponible + Plan mantenimiento mensual\n' +
      '❌ NO recomendado: Clima extremo >35°C sin riego de agua destilada'
  },

  'OPzV Standby': {
    name: 'OPzV Standby',
    technology: 'GEL Tubular (VRLA)',
    maintenance: 'cero',
    cycles: '0-300 ciclos ocasionales',
    lifeYears: '20 años en flotación',
    priceRange: '€3.200-3.500',
    degradationImpact:
      'Degradación LENTA en flotación correcta. ' +
      'Si voltaje flotación >14.1V + calor >40°C: ' +
      'Año 2-3: Corrosión de rejillas (irreversible). ' +
      'Capacidad cae de 100% → 60% sin recuperación. ' +
      'Fallo "silencioso": Voltaje normal pero sin potencia.',
    operationalRisk:
      'BAJO si cargador es correcto (voltaje 13.5-14.1V). ' +
      'CRÍTICO si cargador viejo: AC ripple excesivo mata batería en 2-3 años. ' +
      'UPS datacenter depende totalmente de esta confiabilidad.',
    advantages: [
      'Vida flotación: 20 años @ 25°C',
      'Sin mantenimiento absoluto',
      'Muy confiable en UPS/Telecom',
      'Ciclos ocasionales soportados'
    ],
    limitations: [
      'Precio premium (+60% vs Larga Duración)',
      'Requiere cargador de ALTA CALIDAD (ripple <5A)',
      'Sensible a voltaje excesivo + calor (corrosión rejillas)',
      'Ciclos limitados (no para aplicaciones cíclicas)'
    ],
    tco5YearsEstimate:
      'Costo inicial: €3.300 | Mantenimiento: €0 | Downtime: €0 (fiable) | ' +
      'TOTAL: €3.300 (muy predecible)',
    recommendation:
      '✅ Recomendado para: UPS datacenter, Telecom, respaldo crítico\n' +
      '⚠️ CRÍTICO: Auditar cargador antes de instalar (debe tener <5A ripple)'
  },

  'QUASAR': {
    name: 'QUASAR',
    technology: 'Flooded + Nano Carbono (Carga Rápida)',
    maintenance: 'periódico',
    cycles: '800-1000+ ciclos @ 80% DoD',
    lifeYears: '6-8 años multi-turno',
    priceRange: '€2.600-2.900',
    degradationImpact:
      'Degradación LENTA por nano carbono. ' +
      'Año 3-4: Voltaje mantiene 95% capacidad (vs 80% Larga Duración). ' +
      'Máquina 3000W: Corriente se mantiene estable = equipos sin estrés. ' +
      'Año 5-6: Aún operativa, degradación predecible.',
    operationalRisk:
      'BAJO en operación multi-turno si carga rápida (4h) disponible. ' +
      'Requiere agua como Larga Duración pero tolera ciclos parciales mejor. ' +
      'En El Salvador: Mismo mantenimiento que Larga Duración, pero más fiable.',
    advantages: [
      'Carga rápida: 20→100% en 4 horas (vs 8-12h estándar)',
      'Tolera ciclos parciales (multi-turno, AGV)',
      'Rendimiento mejor en frío (-20°C)',
      'Degradación más lenta que Larga Duración (+2-3 años vida)'
    ],
    limitations: [
      'Requiere mantenimiento agua destilada como Flooded',
      '+30% costo vs Larga Duración',
      'Vida media: 6-8 años (no es premium)',
      'No reemplaza OPzV para flotación pura'
    ],
    tco5YearsEstimate:
      'Costo inicial: €2.750 | Mantenimiento: €600-1.000 | Downtime: €500-1.500 | ' +
      'Productividad ganada: -€8.000 (carga rápida disponible) | ' +
      'TOTAL: €-4.750 (POSITIVO - se paga sola)',
    recommendation:
      '✅ OBLIGATORIO para: Multi-turno, AGV, carga de oportunidad, frío industrial\n' +
      '✅ Mejor TCO en 5 años vs Larga Duración por menos downtime'
  },

  'OPzV Solar': {
    name: 'OPzV Solar',
    technology: 'GEL Tubular optimizada para ciclos solares',
    maintenance: 'cero',
    cycles: '1500-2000 ciclos @ 50% DoD',
    lifeYears: '7-10 años',
    priceRange: '€3.500-3.800',
    degradationImpact:
      'Degradación MÍNIMA en ciclo solar diario. ' +
      'Año 3-5: Mantiene 95%+ capacidad. ' +
      'Año 7+: Degradación suave (98% → 90% anualmente). ' +
      'No hay "caída repentina", fallo predecible.',
    operationalRisk:
      'BAJO en sistemas solares aislados. ' +
      'Principal riesgo: Efecto Ferranti en líneas subterráneas (>720V). ' +
      'Sin riesgo de sulfatación por ciclos solares suaves.',
    advantages: [
      'Ciclos solares optimizados (1500-2000 @ 50%)',
      'Sin mantenimiento cero',
      'Degradación predecible y lenta',
      'Ideal para sistemas aislados (viviendas, granjas)'
    ],
    limitations: [
      'Precio más alto (+70% vs Larga Duración)',
      'Menos ciclos que QUASAR (no es multi-turno)',
      'Overkill si ciclos <500/año',
      'Requiere control de inversores (Efecto Ferranti en MT)'
    ],
    tco5YearsEstimate:
      'Costo inicial: €3.650 | Mantenimiento: €0 | Downtime: €500-1.000 (muy bajo) | ' +
      'Productividad solar: +€5.000 (menor degradación) | ' +
      'TOTAL: €8.150 (inversión que se recupera en año 7-8)',
    recommendation:
      '✅ RECOMENDADO para: Solar aislado, ciclos diarios 365/año\n' +
      '✅ Si presupuesto permite (premium vs OPzS Solar)'
  },

  'OPzS Solar': {
    name: 'OPzS Solar',
    technology: 'Flooded tubular optimizada para ciclos solares',
    maintenance: 'periódico',
    cycles: '1000-1500 ciclos @ 50% DoD',
    lifeYears: '5-8 años',
    priceRange: '€2.800-3.100',
    degradationImpact:
      'Degradación MODERADA por ciclos solares + calor. ' +
      'Año 2-3: Voltaje baja 5% si agua no se rellena (CRÍTICO en El Salvador). ' +
      'Máquina solar 3000W: Corriente sube → Inversores trabajan más duro. ' +
      'Año 4-5: Decisión de reemplazo si mantenimiento falló.',
    operationalRisk:
      'ALTO en El Salvador si no hay plan de agua destilada cada 3-6 meses. ' +
      'Humedad tropical acelera evaporación. ' +
      'Sin riego = sulfatación + fallo año 3-4 (no año 8).',
    advantages: [
      'Bajo costo inicial: 15-20% menos que OPzV Solar',
      'Ciclos solares robustos (1000-1500)',
      'Mantenimiento sencillo (agua local)',
      'Mejor ROI si mantenimiento está disponible'
    ],
    limitations: [
      'MANTENIMIENTO OBLIGATORIO cada 3-6 meses en El Salvador',
      'Vida media: 5-8 años (depende 100% del riego)',
      'Degradación acelerada si se omite agua',
      'No es opción en ubicaciones sin acceso técnico'
    ],
    tco5YearsEstimate:
      'Costo inicial: €2.950 | Mantenimiento (religioso): €600-1.200 | ' +
      'Downtime (si falla mto): €2.000-5.000 | ' +
      'TOTAL: €5.550-9.150 (muy variable por disciplina mto)',
    recommendation:
      '✅ MEJOR OPCIÓN económica para El Salvador SI: Personal técnico local disponible\n' +
      '❌ NO RECOMENDAR: Ubicación remota o sin acceso mensual a inspección'
  }
};

/**
 * Función para obtener impacto operativo de degradación
 */
export function getDegradationImpactSummary(familyName: string): string {
  const family = familyDatabase[familyName];
  if (!family) return 'Familia no encontrada';

  return `
⚠️ CUANDO ESTA BATERÍA ENVEJECE:

${family.degradationImpact}

IMPACTO EN EQUIPOS:
- Voltaje bajo → Corriente sube para compensar potencia
- Equipos trabajan más caliente (pérdidas I²R)
- Ciclo positivo: Batería se degrada más rápido
- Resultado: Fallo prematuro sin aviso

RIESGO OPERATIVO:
${family.operationalRisk}

ACCIÓN RECOMENDADA:
${family.recommendation}
  `.trim();
}

/**
 * Función para comparar TCO 5 años
 */
export function getTco5YearsSummary(familyName: string): string {
  const family = familyDatabase[familyName];
  if (!family) return 'Familia no encontrada';

  return `
💰 COSTO TOTAL DE PROPIEDAD (5 AÑOS):

${family.tco5YearsEstimate}

Este cálculo incluye:
✓ Inversión inicial
✓ Mantenimiento anual
✓ Downtime por fallos
✓ Productividad ganada/perdida
  `;
}
