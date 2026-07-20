import { useState, useMemo, useEffect, Fragment } from 'react';

import { useStore } from '../store/useStore';
import { AlertCircle, DollarSign, Clock, Hash, AlertTriangle } from 'lucide-react';

export const H1 = () => {
  const {
    clientName, setClientName,
    sector, setSector,
    outageHoursPerWeek, setOutageHoursPerWeek,
    affectedLines, setAffectedLines,
    costPerHour, setCostPerHour,
    fixedCostPerIncident, setFixedCostPerIncident,
    incidentsPerWeek, setIncidentsPerWeek
  } = useStore();

  const weeklyLoss = (outageHoursPerWeek * affectedLines * costPerHour) + (incidentsPerWeek * fixedCostPerIncident);
  const annualLoss = weeklyLoss * 52;
  const fiveYearLoss = annualLoss * 5;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">H1 · Cuantificador del Dolor del Cliente</h1>
        <p className="text-gray-600 mt-2">
          Se usa en la primera visita. Cambia la conversación de '¿cuánto cuesta la batería?' a '¿cuánto le cuesta a usted no tenerla?'
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Datos del Cliente */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Datos del Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente / Empresa</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ejemplo Industrial S.A."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Industria"
                />
              </div>
            </div>
          </div>

          {/* Entradas - Realidad Energética */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Entradas — Realidad Energética</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  Horas de corte/interrupción por semana
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={outageHoursPerWeek || ''}
                  onChange={(e) => setOutageHoursPerWeek(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-500" />
                  Nº de equipos o líneas afectadas
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={affectedLines || ''}
                  onChange={(e) => setAffectedLines(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  Coste por hora de interrupción y equipo (USD)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={costPerHour || ''}
                  onChange={(e) => setCostPerHour(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  Coste fijo adicional por incidente (arranques, mermas)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={fixedCostPerIncident || ''}
                  onChange={(e) => setFixedCostPerIncident(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gray-500" />
                  Nº de incidentes por semana
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={incidentsPerWeek || ''}
                  onChange={(e) => setIncidentsPerWeek(Number(e.target.value))}
                />
              </div>

              <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-md flex gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>Si el cliente no conoce su coste/hora: (margen bruto diario ÷ horas productivas) + mano de obra parada + penalizaciones contractuales.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Resultados */}
          <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-100">
            <h2 className="text-xl font-semibold mb-4 text-red-800 border-b border-red-200 pb-2">El Dolor en Números</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-red-600 mb-1">Pérdida semanal estimada</p>
                <p className="text-2xl font-bold text-red-900">${weeklyLoss.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm font-bold text-red-800 mb-1">PÉRDIDA ANUAL ESTIMADA</p>
                <p className="text-4xl font-black text-red-600">${annualLoss.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-red-600 mb-1">Pérdida en 5 años (horizonte de la solución)</p>
                <p className="text-2xl font-bold text-red-900">${fiveYearLoss.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Guion */}
          <div className="bg-gray-50 rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Guion para la Visita</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
              <li>Pregunta, no afirmes: <em>"¿Cuántas horas al mes paran por cortes?"</em> — deja que el cliente ponga sus números.</li>
              <li>Rellena esta hoja <strong>CON el cliente mirando la pantalla</strong>: los números son suyos, no tuyos.</li>
              <li>Presenta la pérdida anual antes de hablar de producto o precio.</li>
              <li>Cierra con: <em>"Con estos datos, ¿tiene sentido que le prepare una propuesta que elimine esta pérdida?"</em></li>
              <li>El resultado pasa automáticamente a la H6 (Generador de Propuesta).</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
