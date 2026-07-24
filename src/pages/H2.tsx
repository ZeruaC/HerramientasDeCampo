import { useMemo, useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { useCatalog } from '../hooks/useCatalog';
import { ThermometerSun, Clock, Wrench, Battery, CheckCircle, MapPin, HelpCircle, X, AlertCircle, TrendingDown } from 'lucide-react';
import { familyDatabase, getDegradationImpactSummary, getTco5YearsSummary } from '../data/familyData';

export default function H2() {
  const [cyclesPerYear, setCyclesPerYear] = useState('500-1000');
  const [showArgumentary, setShowArgumentary] = useState(false);
  const [selectedFamilyDetail, setSelectedFamilyDetail] = useState<string | null>(null);

  const {
    audit,
    maxTemp, setMaxTemp,
    autonomyReqH2, setAutonomyReqH2,
    maintenanceAvailable, setMaintenanceAvailable,
    operationType, setOperationType,
    availableSpace, setAvailableSpace,
  } = useStore();

  const { modelos, loading, error } = useCatalog();

  // Precargar desde auditoría
  useEffect(() => {
    if (audit.mantenimientoDisponible && maintenanceAvailable !== audit.mantenimientoDisponible) {
      setMaintenanceAvailable(audit.mantenimientoDisponible);
    }
    if (audit.uso && operationType !== audit.uso) {
      setOperationType(audit.uso);
    }
    if (audit.espacioDisponible) {
      const spaceMap: Record<string, string> = {
        'Amplio': 'Amplio',
        'Reducido': 'Reducido o sin ventilación',
        'Muy reducido': 'Reducido o sin ventilación',
      };
      const mapped = spaceMap[audit.espacioDisponible];
      if (mapped && availableSpace !== mapped) {
        setAvailableSpace(mapped);
      }
    }
    if (audit.temperaturaAmbiente) {
      const temp = audit.temperaturaAmbiente;
      let newTemp = maxTemp;
      if (temp < 25) newTemp = '<25°C';
      else if (temp <= 35) newTemp = '25-35°C';
      else newTemp = '>35°C';
      if (newTemp !== maxTemp) setMaxTemp(newTemp);
    }
  }, [audit, setMaintenanceAvailable, setOperationType, setAvailableSpace, setMaxTemp, maintenanceAvailable, operationType, availableSpace, maxTemp]);

  const evaluation = useMemo(() => {
    const availableSubfamilies = Array.from(new Set(modelos.map(m => m.subfamilia).filter(Boolean)));
    const reasons: string[] = [];

    // Conversión de ciclos/año a categoría
    const cycleCategory = cyclesPerYear === '<500' ? 'bajo' : cyclesPerYear === '500-1000' ? 'medio' : 'alto';

    if (cycleCategory === 'bajo') {
      reasons.push('Ciclos bajos (<500/año): se favorece OPzV Standby (20 años flotación).');
    } else if (cycleCategory === 'medio') {
      reasons.push('Ciclos medios (500-1000/año): se favorece Larga Duración o Solar.');
    } else {
      reasons.push('Ciclos altos (>1000/año): se favorece QUASAR (carga rápida, ciclos mejorados).');
    }

    // Filtrar por mantenimiento
    const maintenanceFree = [
      'OPzV Standby', 'OPzV Solar', 'Gel Leisure Bloc', 'Gel Solar Bloc',
      'QUASAR Estándar', 'QUASAR Gel Bloc', 'QUASAR VRLA', 'OGi Bloc',
      'Gel Semi-Tracción Bloc'
    ];

    let candidates = [...availableSubfamilies];

    if (maintenanceAvailable === 'No') {
      candidates = candidates.filter(f => maintenanceFree.includes(f));
      reasons.push('Sin mantenimiento disponible: se descartan tecnologías inundadas.');
    }

    // Filtrar por tipo de operación
    const standbySubfamilies = [
      'OPzV Standby', 'OPzS Standby', 'Gel Leisure Bloc', 'OGi Bloc',
      'QUASAR VRLA', 'QUASAR Estándar', 'Bajo Mantenimiento', 'PzV Bajo Mantenimiento'
    ];
    const solarSubfamilies = ['OPzV Solar', 'OPzS Solar', 'Gel Solar Bloc', 'QUASAR Gel Bloc', 'Gel Semi-Tracción Bloc'];
    const tractionSubfamilies = ['Larga Duración', 'QUASAR Flooded Bloc', 'QUASAR Estándar', 'Gel Semi-Tracción Bloc'];

    if (operationType === 'Standby/Flotación (UPS)') {
      candidates = candidates.filter(f => standbySubfamilies.includes(f));
      reasons.push('Operación standby: se priorizan tecnologías de larga vida en flotación (OPzV ideal).');
    } else if (operationType === 'Ciclado Diario (Solar)') {
      candidates = candidates.filter(f => solarSubfamilies.includes(f));
      reasons.push('Operación solar: se priorizan tecnologías resistentes a ciclos profundos diarios.');
    } else if (operationType === 'Tracción / Carga Oportunidad') {
      candidates = candidates.filter(f => tractionSubfamilies.includes(f));
      reasons.push('Operación tracción: se priorizan tecnologías de ciclo profundo (QUASAR si multi-turno).');
    }

    // Alta temperatura: favorecer OPzV y QUASAR
    if (maxTemp === '>35°C') {
      const heatFriendly = ['OPzV Standby', 'OPzV Solar', 'QUASAR Estándar', 'QUASAR VRLA', 'Larga Duración', 'QUASAR Flooded Bloc'];
      candidates = candidates.filter(f => heatFriendly.includes(f));
      reasons.push('Temperatura extrema (>35°C): se priorizan OPzV y QUASAR (mejor comportamiento térmico).');
    }

    // Autonomía
    if (autonomyReqH2 === '<2 h (Alta descarga)') {
      reasons.push('Alta descarga (UPS): se valora baja resistencia interna.');
    } else if (autonomyReqH2 === '>8 h') {
      reasons.push('Larga autonomía (>8h): se prioriza capacidad de descarga profunda.');
    }

    // Ordenar por preferencia CONSIDERANDO CICLOS
    const preferenceOrderHighCycles = [
      'QUASAR Estándar', 'QUASAR Flooded Bloc', 'QUASAR Gel Bloc', 'QUASAR VRLA',
      'OPzV Solar', 'OPzS Solar', 'Larga Duración', 'OPzV Standby',
      'Gel Solar Bloc', 'OGi Bloc', 'OPzS Standby', 'Gel Semi-Tracción Bloc'
    ];

    const preferenceOrderLowCycles = [
      'OPzV Standby', 'OPzV Solar', 'OGi Bloc', 'Gel Leisure Bloc',
      'OPzS Standby', 'Gel Solar Bloc', 'QUASAR VRLA', 'Larga Duración',
      'OPzS Solar', 'QUASAR Gel Bloc', 'QUASAR Flooded Bloc', 'QUASAR Estándar'
    ];

    const preferenceOrder = cycleCategory === 'alto' ? preferenceOrderHighCycles : preferenceOrderLowCycles;

    candidates.sort((a, b) => {
      const idxA = preferenceOrder.indexOf(a);
      const idxB = preferenceOrder.indexOf(b);
      if (idxA === -1 && idxB === -1) return a.localeCompare(b);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });

    const winner = candidates[0] || 'OPzV Standby';
    return { candidates, winner, reasons };
  }, [maxTemp, autonomyReqH2, maintenanceAvailable, operationType, cyclesPerYear, modelos]);

  // NO setear automáticamente - el usuario selecciona en H3/H4

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">H2 · Selector de Familia Eternity</h1>
        <p className="text-gray-600 mt-4">Cargando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">H2 · Selector de Familia Eternity</h1>
        <p className="text-red-600 mt-4">Error al cargar catálogo: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">H2 · Criterios Técnicos de Selección</h1>
        <p className="text-gray-600 mt-2">
          Analiza las condiciones de la ubicación para identificar la familia Eternity más adecuada. Las subfamilias y modelos específicos se seleccionan en H4 (Dimensionador).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Entradas */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-6 text-blue-800 border-b pb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Condiciones de la Ubicación
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                Ciclos anuales estimados
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                value={cyclesPerYear}
                onChange={(e) => setCyclesPerYear(e.target.value)}
              >
                <option value="<500">&lt; 500/año (Standby, UPS, Telecom)</option>
                <option value="500-1000">500-1000/año (Solar estándar, Logística)</option>
                <option value=">1000">&gt; 1000/año (Multi-turno, Picos)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <ThermometerSun className="w-4 h-4 text-orange-500" />
                Temperatura ambiente máxima
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                value={maxTemp}
                onChange={(e) => setMaxTemp(e.target.value)}
              >
                <option value="<25°C">Menos de 25°C</option>
                <option value="25-35°C">25-35°C (Habitual)</option>
                <option value=">35°C">Más de 35°C (Extrema)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Autonomía requerida
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                value={autonomyReqH2}
                onChange={(e) => setAutonomyReqH2(e.target.value)}
              >
                <option value="<2 h (Alta descarga)">&lt; 2 h (Alta descarga, UPS)</option>
                <option value="2-8 h">2 a 8 h</option>
                <option value=">8 h">&gt; 8 h (Larga duración)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-gray-500" />
                ¿Mantenimiento disponible?
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                value={maintenanceAvailable}
                onChange={(e) => setMaintenanceAvailable(e.target.value)}
              >
                <option value="Sí">Sí, personal calificado</option>
                <option value="No">No, sitio remoto o sin personal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Battery className="w-4 h-4 text-green-500" />
                Tipo de operación
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                value={operationType}
                onChange={(e) => setOperationType(e.target.value)}
              >
                <option value="Standby/Flotación (UPS)">Standby / Flotación (Cortes raros, UPS)</option>
                <option value="Ciclado Diario (Solar)">Ciclado Diario (Solar / Off-grid)</option>
                <option value="Tracción / Carga Oportunidad">Tracción / Carga de Oportunidad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Espacio disponible</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                value={availableSpace}
                onChange={(e) => setAvailableSpace(e.target.value)}
              >
                <option value="Amplio">Amplio</option>
                <option value="Reducido o sin ventilación">Reducido o sin ventilación</option>
                <option value="Muy reducido">Muy reducido</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-900 border-b border-blue-200 pb-2">Familia Sugerida</h2>

            <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
              <CheckCircle className="w-10 h-10 text-blue-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Primera opción</p>
                <p className="text-2xl font-bold text-blue-900">{evaluation.winner}</p>
                <p className="text-xs text-gray-500 mt-1">Seleccionarás la subfamilia específica en H4 (Dimensionador)</p>
              </div>
              <button
                onClick={() => {
                  setSelectedFamilyDetail(evaluation.winner);
                  setShowArgumentary(true);
                }}
                className="flex-shrink-0 p-2 hover:bg-blue-100 rounded-lg transition-colors"
                title="Ver argumentario técnico"
              >
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </button>
            </div>

            {evaluation.reasons.length > 0 && (
              <div className="space-y-2">
                <p className="font-semibold text-blue-800 text-sm">¿Por qué?</p>
                <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
                  {evaluation.reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-sm font-semibold mb-3 text-gray-500 uppercase tracking-wider">Otras familias válidas</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {evaluation.candidates.length > 0 ? (
                evaluation.candidates.map((family) => (
                  <div
                    key={family}
                    className="px-3 py-2 rounded text-sm bg-gray-50 text-gray-700 border border-gray-200"
                  >
                    {family}
                  </div>
                ))
              ) : (
                <p className="text-sm text-red-600">No hay familias Eternity que cumplan todas las condiciones indicadas.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Argumentario */}
      {showArgumentary && selectedFamilyDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 border-b border-blue-900 p-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedFamilyDetail}</h2>
                <p className="text-sm text-blue-100 mt-1">{familyDatabase[selectedFamilyDetail]?.technology || 'Batería Eternity'}</p>
              </div>
              <button
                onClick={() => setShowArgumentary(false)}
                className="p-1 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {familyDatabase[selectedFamilyDetail] ? (
                <>
                  {/* Especificaciones Base */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-xs text-slate-600 font-semibold">CICLOS</p>
                      <p className="text-sm font-medium text-slate-900">{familyDatabase[selectedFamilyDetail].cycles}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-xs text-slate-600 font-semibold">VIDA ESPERADA</p>
                      <p className="text-sm font-medium text-slate-900">{familyDatabase[selectedFamilyDetail].lifeYears}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-xs text-slate-600 font-semibold">PRECIO INDICATIVO</p>
                      <p className="text-sm font-medium text-slate-900">{familyDatabase[selectedFamilyDetail].priceRange}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-xs text-slate-600 font-semibold">MANTENIMIENTO</p>
                      <p className="text-sm font-medium text-slate-900 capitalize">
                        {familyDatabase[selectedFamilyDetail].maintenance === 'cero' ? '✓ Cero' : '⚠️ Periódico'}
                      </p>
                    </div>
                  </div>

                  {/* IMPACTO OPERATIVO - La sección clave */}
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <TrendingDown className="w-5 h-5" />
                      Impacto de Degradación (¿Qué pasa cuando envejece?)
                    </h3>
                    <p className="text-sm text-red-800 whitespace-pre-line leading-relaxed">
                      {familyDatabase[selectedFamilyDetail].degradationImpact}
                    </p>
                  </div>

                  {/* RIESGO OPERATIVO */}
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Riesgo Operativo en El Salvador
                    </h3>
                    <p className="text-sm text-orange-800 whitespace-pre-line">
                      {familyDatabase[selectedFamilyDetail].operationalRisk}
                    </p>
                  </div>

                  {/* Ventajas y Limitaciones */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-green-700 mb-3">✓ Ventajas</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {familyDatabase[selectedFamilyDetail].advantages.map((adv, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-700 mb-3">✗ Limitaciones</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {familyDatabase[selectedFamilyDetail].limitations.map((lim, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-red-600 font-bold">•</span>
                            <span>{lim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* TCO 5 AÑOS */}
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                    <h3 className="text-lg font-semibold text-amber-900 mb-3">💰 TCO 5 Años (Total Cost of Ownership)</h3>
                    <p className="text-sm text-amber-800 font-mono whitespace-pre-wrap">
                      {familyDatabase[selectedFamilyDetail].tco5YearsEstimate}
                    </p>
                  </div>

                  {/* RECOMENDACIÓN */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 Recomendación</h3>
                    <p className="text-sm text-blue-800 whitespace-pre-line">
                      {familyDatabase[selectedFamilyDetail].recommendation}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded text-xs text-gray-600 border border-gray-200">
                    <p><strong>Importante:</strong> Esta solución debe ser validada con la situación técnica local. El costo operativo depende mucho del clima, acceso a servicios técnicos, y disciplina de mantenimiento. Consulta con Dirección de Eternity para caso específico.</p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-600">Familia no encontrada en base de datos</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
