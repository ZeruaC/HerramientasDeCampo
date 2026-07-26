import { useState, useMemo, useEffect } from 'react';

import { useStore } from '../store/useStore';
import { useCatalog } from '../hooks/useCatalog';
import { ThermometerSun, Clock, Wrench, Battery, CheckCircle, Info } from 'lucide-react';

export const H2 = () => {
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    audit,
    maxTemp, setMaxTemp,
    autonomyReqH2, setAutonomyReqH2,
    maintenanceAvailable, setMaintenanceAvailable,
    operationType, setOperationType,
    availableSpace, setAvailableSpace,
    setRecommendedFamily,
    setSelectedFamilyH4
  } = useStore();

  const { familias, modelos, loading, error } = useCatalog();

  // Prellenar desde los datos ya capturados en H1 (auditoría), en vez de
  // volver a preguntar lo mismo. El técnico puede seguir ajustándolo aquí.
  useEffect(() => {
    if (audit.mantenimientoDisponible && audit.mantenimientoDisponible !== maintenanceAvailable) {
      setMaintenanceAvailable(audit.mantenimientoDisponible);
    }
    if (audit.uso && audit.uso !== operationType) {
      setOperationType(audit.uso);
    }
    if (audit.espacioDisponible && audit.espacioDisponible !== availableSpace) {
      setAvailableSpace(audit.espacioDisponible);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audit.mantenimientoDisponible, audit.uso, audit.espacioDisponible]);

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
      scores['OPzS Standby'] += 2;
      scores['Gel Leisure Bloc'] += 1;
      scores['QUASAR VRLA'] += 1;
    }

    if (autonomyReqH2 === '<2 h (Alta descarga)') {
      scores['QUASAR Estándar'] += 2;
      scores['QUASAR Gel Bloc'] += 1;
    } else if (autonomyReqH2 === '>8 h') {
      scores['OPzV Standby'] += 1;
      scores['OPzS Standby'] += 1;
      scores['Gel Leisure Bloc'] += 1;
    }

    if (availableSpace === 'Muy reducido') {
      scores['Gel Leisure Bloc'] += 2;
      scores['Gel Solar Bloc'] += 2;
      scores['QUASAR Gel Bloc'] += 2;
      scores['QUASAR Flooded Bloc'] += 1;
      scores['OPzS Standby'] -= 2;
      scores['OPzS Solar'] -= 1;
      scores['Larga Duración'] -= 2;
      reasons.push("Espacio muy reducido: formatos bloc compactos son preferibles a vasos OPzS/Larga Duración.");
    } else if (availableSpace === 'Reducido') {
      scores['Gel Leisure Bloc'] += 1;
      scores['QUASAR Gel Bloc'] += 1;
    }

    let maxScore = -999;
    let winner = 'OPzV Standby';

    Object.entries(scores).forEach(([family, score]) => {
      if (score > maxScore) {
        maxScore = score;
        winner = family;
      }
    });

    return { scores, winner, reasons };
  }, [maxTemp, autonomyReqH2, maintenanceAvailable, operationType, availableSpace]);

  useEffect(() => {
    setRecommendedFamily(evaluation.winner);
    setSelectedFamilyH4(evaluation.winner);
  }, [evaluation.winner, setRecommendedFamily, setSelectedFamilyH4]);

  // Modelos concretos disponibles dentro de la subfamilia ganadora. El tamaño
  // exacto (Ah, nº de ramas) se resuelve en H4 con la potencia/autonomía reales,
  // pero aquí ya se puede ver qué modelos son posibles para esta subfamilia.
  const winningModels = useMemo(() => {
    return modelos
      .filter(m => m.subfamilia === evaluation.winner)
      .map(m => ({ modelo: m.modelo, ah: m.especificaciones?.capacidad_nominal_ah || 0 }))
      .sort((a, b) => a.ah - b.ah);
  }, [modelos, evaluation.winner]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">H2 · Selector de Familia Eternity</h1>
        <p className="text-gray-600 mt-2">
          Cualificación técnica del proyecto. Filtra las subfamilias válidas basado en condiciones reales del site.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                {audit.mantenimientoDisponible && (
                  <span className="text-xs font-normal text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Prellenado desde H1</span>
                )}
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
                {audit.uso && (
                  <span className="text-xs font-normal text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Prellenado desde H1</span>
                )}
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
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Battery className="w-4 h-4 text-purple-500" />
                Espacio disponible
                {audit.espacioDisponible && (
                  <span className="text-xs font-normal text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Prellenado desde H1</span>
                )}
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                value={availableSpace}
                onChange={(e) => setAvailableSpace(e.target.value)}
              >
                <option value="Amplio">Amplio</option>
                <option value="Reducido">Reducido</option>
                <option value="Muy reducido">Muy reducido</option>
              </select>
            </div>

            <button
              onClick={() => setIsCompleted(true)}
              disabled={isCompleted}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {isCompleted ? '✓ Completado' : 'Completar y ver familia sugerida'}
            </button>
          </div>
        </div>

        {isCompleted && (
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
              <h2 className="text-sm font-semibold mb-3 text-gray-500 uppercase tracking-wider">
                Modelos posibles en {evaluation.winner}
              </h2>
              {winningModels.length > 0 ? (
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {winningModels.map(({ modelo, ah }) => (
                    <span key={modelo} className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {modelo}{ah > 0 ? ` (${ah} Ah)` : ''}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No hay modelos cargados para esta subfamilia.</p>
              )}
              <p className="mt-3 text-xs text-gray-500 italic border-t pt-2 flex items-start gap-1">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                El modelo y nº de ramas exactos se calculan en H4 (Dimensionador) según potencia y autonomía reales.
              </p>
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
        )}
      </div>

    </div>
  );
};
