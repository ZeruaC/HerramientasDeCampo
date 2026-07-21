import { useState, useMemo, useEffect, Fragment } from 'react';

import { useStore } from '../store/useStore';
import { useCatalog } from '../hooks/useCatalog';
import { Wrench,  Info, ShieldCheck, Settings } from 'lucide-react';

export const H4 = () => {
  const {
    loadPowerW, setLoadPowerW,
    autonomyReqH4, setAutonomyReqH4,
    systemVoltage, setSystemVoltage,
    minTempH4, setMinTempH4,
    selectedFamilyH4, setSelectedFamilyH4,
    maxDod, setMaxDod,
    inverterEfficiency, setInverterEfficiency,
    selectedModelH4, setSelectedModelH4
  } = useStore();

  const { modelos, familias, loading, error } = useCatalog();

  // Convert modelo objects to format compatible with calculation logic
  const catalogoArray = useMemo(() => {
    return modelos.map(m => ({
      modelo: m.modelo,
      familia: m.familia,
      subfamilia: m.subfamilia,
      v: m.especificaciones?.voltaje_v || 2, // Default 2V
      ah: m.especificaciones?.capacidad_nominal_ah || 0,
      especificaciones: JSON.stringify(m.especificaciones || {}),
      link: '',
      notas: m.estado || ''
    }));
  }, [modelos]);

  // Calculation Logic
  const calcResults = useMemo(() => {
    // 1. Energía necesaria E (Wh) = P * t / η
    const E = (loadPowerW * autonomyReqH4) / inverterEfficiency;
    
    // 2. Factor de temperatura (approx rule of thumb for Lead-Acid)
    // 25C = 1.0, lower temps reduce capacity (e.g., -0.006 per degree below 25)
    let Ftemp = 1.0;
    if (minTempH4 < 25) {
      Ftemp = 1.0 - ((25 - minTempH4) * 0.008); // approx 0.8% loss per degree below 25
      if (Ftemp < 0.5) Ftemp = 0.5;
    }
    
    // 3. Capacidad requerida C (Ah) = E / (V * DOD * Ftemp)
    const C_req = E / (systemVoltage * maxDod * Ftemp);

    // Find models in the selected family
    const familyModels = catalogoArray.filter(p => p.familia.includes(selectedFamilyH4) || p.subfamilia === selectedFamilyH4);
    
    // Find suggested model (assuming 1 string for simplicity first)
    // Elements in series = System Voltage / Cell Voltage (usually 2V or 12V)
    let suggestedModel = null;
    let strings = 1;
    let series = 0;
    
    if (familyModels.length > 0) {
      // Sort by C10 capacity ascending
      const sortedModels = [...familyModels].sort((a, b) => a.ah - b.ah);
      
      // Try 1 string first
      suggestedModel = sortedModels.find(m => m.ah >= C_req);
      
      // If 1 string isn't enough, try up to 4 strings
      if (!suggestedModel) {
        for (let s = 2; s <= 4; s++) {
          const reqPerString = C_req / s;
          const found = sortedModels.find(m => m.ah >= reqPerString);
          if (found) {
            suggestedModel = found;
            strings = s;
            break;
          }
        }
        // If still not enough, just take the biggest one and calc required strings
        if (!suggestedModel) {
          suggestedModel = sortedModels[sortedModels.length - 1];
          strings = Math.ceil(C_req / suggestedModel.ah);
        }
      }
      
      if (suggestedModel) {
        series = systemVoltage / suggestedModel.v;
      }
    }

    // Set the selected model if empty or family changed
    if (suggestedModel && (!selectedModelH4 || !catalogoArray.find(m => m.modelo === selectedModelH4 && (m.familia.includes(selectedFamilyH4) || m.subfamilia === selectedFamilyH4)))) {
       // Only update in a timeout to avoid render cycle warnings if we were to set state directly in useMemo
       setTimeout(() => setSelectedModelH4(suggestedModel.modelo), 0);
    }

    // Calculate details for chosen model
    const chosenModelObj = catalogoArray.find(m => m.modelo === (selectedModelH4 || suggestedModel?.modelo));
    
    let actualCapacity = 0;
    let margin = 0;
    
    if (chosenModelObj) {
      series = systemVoltage / chosenModelObj.v;
      // Recalculate strings needed for chosen model if user manually changed it
      if (selectedModelH4 && selectedModelH4 !== suggestedModel?.modelo) {
        strings = Math.ceil(C_req / chosenModelObj.ah);
      }
      actualCapacity = chosenModelObj.ah * strings;
      margin = ((actualCapacity - C_req) / C_req) * 100;
    }

    return {
      E,
      Ftemp,
      C_req,
      suggestedModel: suggestedModel?.modelo || 'Ninguno',
      series,
      strings,
      totalElements: series * strings,
      actualCapacity,
      margin,
      chosenModelObj
    };
  }, [loadPowerW, autonomyReqH4, systemVoltage, minTempH4, selectedFamilyH4, maxDod, inverterEfficiency, selectedModelH4, setSelectedModelH4, catalogoArray]);

  const uniqueFamilies = useMemo(() => {
    const familySet = new Set<string>();
    modelos.forEach(m => {
      familySet.add(m.familia || '');
    });
    return Array.from(familySet).sort();
  }, [modelos]);

  // Show loading state
  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">H4 · Dimensionador de Bancos de Baterías</h1>
        <p className="text-gray-600 mt-4">Cargando catálogo...</p>
      </div>
    );
  }

  if (error || modelos.length === 0) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">H4 · Dimensionador de Bancos de Baterías</h1>
        <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-lg">
          Error cargando catálogo: {error || 'No models found'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">H4 · Dimensionador de Bancos de Baterías</h1>
        <p className="text-gray-600 mt-2">
          Dimensiona en campo en menos de 5 minutos con factores de corrección reales. E = P×t/η · C = E/(V×DOD×Ftemp)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Entradas */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-500" />
              Requisitos del Sistema
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Potencia de la carga (W)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  value={loadPowerW || ''}
                  onChange={(e) => setLoadPowerW(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autonomía requerida (h)</label>
                <input
                  type="number"
                  step="0.5"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  value={autonomyReqH4 || ''}
                  onChange={(e) => setAutonomyReqH4(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tensión del sistema (V DC)</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-white"
                  value={systemVoltage}
                  onChange={(e) => setSystemVoltage(Number(e.target.value))}
                >
                  <option value={12}>12 V</option>
                  <option value={24}>24 V</option>
                  <option value={48}>48 V</option>
                  <option value={110}>110 V</option>
                  <option value={125}>125 V</option>
                  <option value={220}>220 V</option>
                  <option value={384}>384 V</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temp. mínima de operación (°C)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  value={minTempH4 || ''}
                  onChange={(e) => setMinTempH4(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Familia Eternity (de H2 o manual)</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-white"
                  value={selectedFamilyH4}
                  onChange={(e) => setSelectedFamilyH4(e.target.value)}
                >
                  {uniqueFamilies.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profundidad de descarga máx. (DOD)</label>
                <input
                  type="number"
                  step="0.05"
                  max="1"
                  min="0.1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  value={maxDod || ''}
                  onChange={(e) => setMaxDod(Number(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">Recomendado: 0.8 OPzV/OPzS, 0.5 Solar/AGM</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Eficiencia del inversor (η)</label>
                <input
                  type="number"
                  step="0.01"
                  max="1"
                  min="0.5"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  value={inverterEfficiency || ''}
                  onChange={(e) => setInverterEfficiency(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border shadow-sm">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Energía Necesaria (E)</p>
              <p className="text-2xl font-bold text-gray-800">{calcResults.E.toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-lg font-normal">Wh</span></p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border shadow-sm">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Factor Temp. (Ftemp)</p>
              <p className="text-2xl font-bold text-gray-800">{calcResults.Ftemp.toFixed(2)}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 shadow-sm">
              <p className="text-sm text-orange-800 uppercase tracking-wide font-semibold mb-1">Capacidad Req. (C)</p>
              <p className="text-3xl font-black text-orange-600">{calcResults.C_req.toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-lg font-bold">Ah</span></p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden border">
            <div className="bg-gray-800 px-6 py-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-gray-300" />
              <h2 className="text-lg font-bold text-white">Configuración del Banco</h2>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div>
                  <p className="text-sm text-blue-600 font-semibold mb-1">💡 Modelo Sugerido</p>
                  <p className="text-lg font-bold text-blue-800">{calcResults.suggestedModel}</p>
                  <p className="text-xs text-blue-600 mt-1">Mínimo que cumple los requisitos</p>
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Modelo Elegido (Cambiar si prefieres)</label>
                  <select
                    className={`w-full p-2 border-2 rounded-md bg-white font-semibold text-gray-800 ${
                      selectedModelH4 === calcResults.suggestedModel
                        ? 'border-blue-500 focus:ring-blue-500'
                        : 'border-gray-300 focus:ring-orange-500'
                    }`}
                    value={selectedModelH4 || calcResults.suggestedModel}
                    onChange={(e) => setSelectedModelH4(e.target.value)}
                  >
                    {catalogoArray.filter(p => p.familia.includes(selectedFamilyH4) || p.subfamilia === selectedFamilyH4).map(m => (
                      <option key={m.modelo} value={m.modelo}>
                        {m.modelo} ({m.ah} Ah) {m.modelo === calcResults.suggestedModel ? '✓ Sugerido' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tensión Unitaria</p>
                  <p className="text-xl font-bold">{calcResults.chosenModelObj?.v || 0} V</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacidad Unitaria</p>
                  <p className="text-xl font-bold">{calcResults.chosenModelObj?.ah || 0} Ah</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Elementos SERIE</p>
                  <p className="text-xl font-bold text-blue-600">{calcResults.series}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ramas PARALELO</p>
                  <p className="text-xl font-bold text-blue-600">{calcResults.strings}</p>
                </div>
              </div>

              <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Total Elementos</p>
                  <p className="text-4xl font-black text-gray-800">{calcResults.totalElements}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Cap. Instalada</p>
                  <p className="text-4xl font-black text-green-600">{calcResults.actualCapacity.toLocaleString()} <span className="text-xl">Ah</span></p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Margen</p>
                  <p className={`text-4xl font-black ${calcResults.margin > 50 ? 'text-red-500' : 'text-green-600'}`}>
                    +{calcResults.margin.toFixed(1)}%
                  </p>
                </div>
              </div>

              {calcResults.strings > 4 && (
                <div className="mt-4 p-3 bg-red-50 text-red-800 text-sm rounded-md flex gap-2 items-start">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p><strong>Alerta:</strong> Más de 4 ramas en paralelo desequilibra corrientes. Se recomienda subir de modelo de elemento (Ah mayor) antes que añadir más ramas.</p>
                </div>
              )}
              {calcResults.margin > 50 && (
                <div className="mt-2 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-md flex gap-2 items-start">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p><strong>Aviso:</strong> Margen &gt; 50%. Valorar elegir un modelo inferior o reducir ramas si el presupuesto es ajustado.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Buenas Prácticas
            </h3>
            <ul className="list-disc pl-5 text-sm text-blue-900 space-y-1">
              <li>Mide la carga <strong>REAL</strong> con pinza (W) — no te fíes de la placa: suele estar sobredimensionada.</li>
              <li>La autonomía la define el proceso del cliente (tiempo de parada tolerable), no un número redondo.</li>
              <li>Usa la temperatura <strong>MÍNIMA</strong> del emplazamiento: es la que penaliza capacidad.</li>
              <li>El resultado pasa automáticamente a la H6 (Generador de Propuesta).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
