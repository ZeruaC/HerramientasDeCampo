import { useState, useMemo, useEffect, Fragment } from 'react';

import { useStore } from '../store/useStore';
import { Calculator, TrendingDown, DollarSign } from 'lucide-react';

export const H3 = () => {
  const {
    genericCapex, setGenericCapex,
    genericLife, setGenericLife,
    genericMaint, setGenericMaint,
    genericInstall, setGenericInstall,
    
    eternityCapex, setEternityCapex,
    eternityLife, setEternityLife,
    eternityMaint, setEternityMaint,
    eternityInstall, setEternityInstall
  } = useStore();

  // Helper to calculate total replacements in a given horizon
  const calcReplacements = (horizon: number, life: number) => {
    // If life is 3 years, over 10 years you buy at year 0, year 3, year 6, year 9 (4 purchases = 3 replacements)
    return Math.ceil(horizon / life) - 1;
  };

  // 10 Years Horizon
  const genReplacements10 = calcReplacements(10, genericLife);
  const etReplacements10 = calcReplacements(10, eternityLife);

  const genCapex10 = genericCapex * (1 + genReplacements10);
  const etCapex10 = eternityCapex * (1 + etReplacements10);

  const genInst10 = genericInstall * (1 + genReplacements10);
  const etInst10 = eternityInstall * (1 + etReplacements10);

  const genMaint10 = genericMaint * 10;
  const etMaint10 = eternityMaint * 10;

  const genTCO10 = genCapex10 + genInst10 + genMaint10;
  const etTCO10 = etCapex10 + etInst10 + etMaint10;

  // 5 Years Horizon
  const genReplacements5 = calcReplacements(5, genericLife);
  const etReplacements5 = calcReplacements(5, eternityLife);

  const genTCO5 = (genericCapex * (1 + genReplacements5)) + (genericInstall * (1 + genReplacements5)) + (genericMaint * 5);
  const etTCO5 = (eternityCapex * (1 + etReplacements5)) + (eternityInstall * (1 + etReplacements5)) + (eternityMaint * 5);

  // Comparisons
  const savings10 = genTCO10 - etTCO10;
  const savingsPct10 = (savings10 / genTCO10) * 100;
  const etCostPerYear10 = etTCO10 / 10;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">H3 · Calculadora TCO (Coste Total de Propiedad)</h1>
        <p className="text-gray-600 mt-2">
          Manejo de la objeción de precio: transforma "está muy cara" en "es la opción más barata por año de vida útil".
        </p>
      </div>

      <div className="mb-8 p-5 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          💡 RELLENA CON DATOS REALES PARA PRECISIÓN
        </h3>
        <p className="text-sm text-blue-800 mb-3">
          <strong>Para que el TCO sea preciso, obtén estos datos de fuentes reales:</strong>
        </p>
        <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
          <li><strong>CAPEX:</strong> Presupuesto real de proveedor o competencia</li>
          <li><strong>Vida Útil (años):</strong> Datasheet de producto o experiencia de campo</li>
          <li><strong>Mantenimiento anual:</strong> Costo de servicio técnico, repuestos y agua (si aplica)</li>
          <li><strong>Instalación:</strong> Mano de obra, cableado y accesorios</li>
        </ul>
        <p className="text-xs text-blue-700 mt-3 italic">Sin datos precisos, el resultado será aproximado. Úsalo como punto de partida, no como conclusión final.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Entradas Generica */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-gray-400">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Alternativa Genérica</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CAPEX inicial (banco completo, USD)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                  value={genericCapex || ''}
                  onChange={(e) => setGenericCapex(Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vida útil estimada (años)</label>
              <input
                type="number"
                step="0.5"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                value={genericLife || ''}
                onChange={(e) => setGenericLife(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mantenimiento anual (USD)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                  value={genericMaint || ''}
                  onChange={(e) => setGenericMaint(Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coste de instalación/sustitución (USD por vez)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                  value={genericInstall || ''}
                  onChange={(e) => setGenericInstall(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
            <strong>💡 Tip:</strong> Si tienes datos, rellena con presupuestos reales de competencia. Sino, aproxima basándote en referencias de mercado.
          </div>
        </div>

        {/* Entradas Eternity */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Propuesta Eternity</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CAPEX inicial (banco completo, USD)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-blue-400" />
                </div>
                <input
                  type="number"
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={eternityCapex || ''}
                  onChange={(e) => setEternityCapex(Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vida útil estimada (años)</label>
              <input
                type="number"
                step="0.5"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={eternityLife || ''}
                onChange={(e) => setEternityLife(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mantenimiento anual (USD)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-blue-400" />
                </div>
                <input
                  type="number"
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={eternityMaint || ''}
                  onChange={(e) => setEternityMaint(Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coste de instalación/sustitución (USD por vez)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-blue-400" />
                </div>
                <input
                  type="number"
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={eternityInstall || ''}
                  onChange={(e) => setEternityInstall(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
            <strong>💡 Tip:</strong> Usa tu CAPEX real de Eternity, datasheet de vida útil, y costos de servicio. Cuanto más preciso, mejor la propuesta.
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-2">
          <Calculator className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-800">Cálculo — Horizonte de 10 Años</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Concepto</th>
                <th className="p-4 font-medium text-right">Alternativa</th>
                <th className="p-4 font-medium text-right">Eternity</th>
                <th className="p-4 font-medium text-right text-green-600">Ventaja Eternity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="p-4 text-gray-800">Compras del equipo (uds.)</td>
                <td className="p-4 text-right">{1 + genReplacements10}</td>
                <td className="p-4 text-right font-semibold text-blue-700">{1 + etReplacements10}</td>
                <td className="p-4 text-right text-green-600">{(1 + genReplacements10) - (1 + etReplacements10)} menos</td>
              </tr>
              <tr>
                <td className="p-4 text-gray-800">CAPEX total acumulado</td>
                <td className="p-4 text-right">${genCapex10.toLocaleString()}</td>
                <td className="p-4 text-right">${etCapex10.toLocaleString()}</td>
                <td className="p-4 text-right text-green-600">${(genCapex10 - etCapex10).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="p-4 text-gray-800">Instalaciones acumuladas</td>
                <td className="p-4 text-right">${genInst10.toLocaleString()}</td>
                <td className="p-4 text-right">${etInst10.toLocaleString()}</td>
                <td className="p-4 text-right text-green-600">${(genInst10 - etInst10).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="p-4 text-gray-800">Mantenimiento acumulado</td>
                <td className="p-4 text-right">${genMaint10.toLocaleString()}</td>
                <td className="p-4 text-right">${etMaint10.toLocaleString()}</td>
                <td className="p-4 text-right text-green-600">${(genMaint10 - etMaint10).toLocaleString()}</td>
              </tr>
              <tr className="bg-gray-50 font-medium">
                <td className="p-4 text-gray-800">TCO a 5 años</td>
                <td className="p-4 text-right">${genTCO5.toLocaleString()}</td>
                <td className="p-4 text-right">${etTCO5.toLocaleString()}</td>
                <td className="p-4 text-right text-green-600">${(genTCO5 - etTCO5).toLocaleString()}</td>
              </tr>
              <tr className="bg-blue-50 font-bold text-lg">
                <td className="p-4 text-blue-900">TCO A 10 AÑOS</td>
                <td className="p-4 text-right">${genTCO10.toLocaleString()}</td>
                <td className="p-4 text-right text-blue-700">${etTCO10.toLocaleString()}</td>
                <td className="p-4 text-right text-green-600">${savings10.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
          <TrendingDown className="w-6 h-6" />
          Resultado para el Cliente
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 text-center">
            <p className="text-sm text-gray-500 uppercase font-semibold mb-1">Ahorro Total (10 años)</p>
            <p className="text-3xl font-black text-green-600">${savings10.toLocaleString()}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 text-center">
            <p className="text-sm text-gray-500 uppercase font-semibold mb-1">Ahorro Relativo</p>
            <p className="text-3xl font-bold text-green-600">{savingsPct10.toFixed(1)}%</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 text-center">
            <p className="text-sm text-gray-500 uppercase font-semibold mb-1">Coste por año de vida</p>
            <p className="text-3xl font-bold text-blue-700">${etCostPerYear10.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-100 rounded-md">
          <p className="font-semibold text-green-900 mb-1">Frase de cierre:</p>
          <p className="text-green-800 italic">
            "Aunque la inversión inicial parezca mayor, en la realidad técnica de su planta, la solución Eternity le ahorrará <strong>${savings10.toLocaleString()}</strong> a lo largo de 10 años, reduciendo su coste total de propiedad en un <strong>{savingsPct10.toFixed(0)}%</strong>."
          </p>
        </div>
        <p className="text-xs text-green-700 mt-4 opacity-80">
          Nota: El TCO no incluye coste de paradas no planificadas por fallo prematuro (usar H1 para ese argumento) ni coste financiero. Ambos juegan a favor de la opción de mayor vida útil.
        </p>
      </div>
    </div>
  );
};
