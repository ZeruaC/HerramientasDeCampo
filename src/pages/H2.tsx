import { useState, useMemo, useEffect, Fragment } from 'react';

import { useStore } from '../store/useStore';
import { useCatalog } from '../hooks/useCatalog';
import { ThermometerSun, Clock, Wrench, Battery, ShieldAlert, CheckCircle } from 'lucide-react';

export const H2 = () => {
  const {
    maxTemp, setMaxTemp,
    autonomyReqH2, setAutonomyReqH2,
    maintenanceAvailable, setMaintenanceAvailable,
    operationType, setOperationType,
    availableSpace, setAvailableSpace,
    setRecommendedFamily,
    setSelectedFamilyH4
  } = useStore();

  const { familias, loading, error } = useCatalog();

  // Scoring logic - Recommends subfamilies based on client conditions
  const evaluation = useMemo(() => {
    let scores = {
      'OPzV Standby': 0,
      'OPzV Solar': 0,
      'OPzS Solar': 0,
      'OPzS Standby': 0,
      'Gel Leisure Bloc': 0,
      'Gel Solar Bloc': 0,
      'Larga Duración': 0,
      'QUASAR Estándar': 0,
      'QUASAR Flooded Bloc': 0,
      'QUASAR Gel Bloc': 0,
      'QUASAR VRLA': 0
    };

    let reasons = [];

    // Temp rules
    if (maxTemp === '>35°C') {
      scores['OPzV Standby'] += 2;
      scores['OPzV Solar'] += 2;
      scores['OPzS Solar'] -= 1;
      scores['OPzS Standby'] -= 1;
      reasons.push("Alta temperatura: OPzV y QUASAR tienen mejor comportamiento térmico.");
    } else if (maxTemp === '25-35°C') {
      scores['OPzV Standby'] += 1;
      scores['OPzS Solar'] += 1;
    }

    // Maintenance rules
    if (maintenanceAvailable === 'No') {
      scores['OPzV Standby'] += 2;
      scores['OPzV Solar'] += 2;
      scores['Gel Leisure Bloc'] += 1;
      scores['OPzS Solar'] -= 3;
      scores['OPzS Standby'] -= 3;
      scores['Larga Duración'] -= 2;
      reasons.push("Sin mantenimiento: Se excluyen tecnologías inundadas (OPzS, Larga Duración).");
    } else {
      scores['OPzS Solar'] += 2;
      scores['OPzS Standby'] += 2;
      scores['Larga Duración'] += 2;
    }

    // Operation type rules
    if (operationType === 'Ciclado Diario (Solar)') {
      scores['OPzV Solar'] += 3;
      scores['Gel Solar Bloc'] += 3;
      scores['OPzS Solar'] += 2;
      scores['OPzV Standby'] -= 1;
      scores['OPzS Standby'] -= 1;
    } else if (operationType === 'Tracción / Carga Oportunidad') {
      scores['QUASAR Flooded Bloc'] += 5;
      scores['Larga Duración'] += 4;
      scores['QUASAR Estándar'] += 3;
      reasons.push("Operación de tracción: QUASAR y Larga Duración recomendados para ciclos profundos.");
    } else {
      scores['OPzV Standby'] += 2;
      scores['Gel Leisure Bloc'] += 1;
      scores['QUASAR VRLA'] += 1;
    }

    // Autonomy rules
    if (autonomyReqH2 === '<2 h (Alta descarga)') {
      scores['QUASAR Estándar'] += 2;
      scores['QUASAR Gel Bloc'] += 1;
    } else if (autonomyReqH2 === '>8 h') {
      scores['OPzV Standby'] += 1;
      scores['OPzS Standby'] += 1;
      scores['Gel Leisure Bloc'] += 1;
    }

    // Find the winner
    let maxScore = -999;
    let winner = 'OPzV Standby';

    Object.entries(scores).forEach(([family, score]) => {
      if (score > maxScore) {
        maxScore = score;
        winner = family;
      }
    });

    return { scores, winner, reasons };
  }, [maxTemp, autonomyReqH2, maintenanceAvailable, operationType]);

  // Update store when evaluation changes
  useEffect(() => {
    setRecommendedFamily(evaluation.winner);
    setSelectedFamilyH4(evaluation.winner);
  }, [evaluation.winner, setRecommendedFamily, setSelectedFamilyH4]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">H2 · Selector de Familia Eternity</h1>
        <p className="text-gray-600 mt-2">
          Cualificación técnica del proyecto. Filtra las subfamilias válidas basado en condiciones reales del site.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Entradas */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-6 text-blue-800 border-b pb-2">Condiciones del Site</h2>

          <div className="space-y-5">
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
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-900 border-b border-blue-200 pb-2">Subfamilia Recomendada</h2>

            <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
              <CheckCircle className="w-10 h-10 text-green-500 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Mejor opción</p>
                <p className="text-2xl font-bold text-blue-900">{evaluation.winner}</p>
              </div>
            </div>

            {evaluation.reasons.length > 0 && (
              <div className="space-y-2">
                <p className="font-semibold text-blue-800 text-sm">Razones:</p>
                <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
                  {evaluation.reasons.map((reason: string, idx: number) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-sm font-semibold mb-3 text-gray-500 uppercase tracking-wider">Puntuación por Subfamilia</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(evaluation.scores).sort((a: any, b: any) => b[1] - a[1]).map(([family, score]: any) => (
                <div key={family} className="flex justify-between items-center text-sm p-2 rounded hover:bg-gray-50">
                  <span className={family === evaluation.winner ? 'font-bold text-blue-800' : 'text-gray-600'}>
                    {family}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    family === evaluation.winner ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {score > 0 ? '+' : ''}{score}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500 italic border-t pt-2">
              Los modelos específicos se seleccionan en H4 (Dimensionador) según los requisitos técnicos exactos.
            </p>
          </div>
        </div>

        {/* Catálogo Dinámico */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">📦 Catálogo Eternity (603 modelos)</h2>

          {loading ? (
            <p className="text-gray-500">Cargando catálogo...</p>
          ) : error ? (
            <p className="text-red-600">Error al cargar catálogo: {error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(familias).map(([familiaName, familia]: any) => (
                <div key={familiaName} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-900 mb-2">{familiaName}</h3>
                  <div className="space-y-1 text-sm">
                    {Object.entries(familia.subfamilias || {}).map(([subfamName, subfam]: any) => (
                      <div key={subfamName} className="text-gray-700">
                        <span className="font-medium">{subfamName}:</span> {subfam.total_modelos} modelos
                        {subfam.modelos_enriquecidos && (
                          <span className="text-green-600"> ({subfam.modelos_enriquecidos} con especificaciones)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
