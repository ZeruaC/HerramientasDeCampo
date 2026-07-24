import { useMemo, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useCatalog } from '../hooks/useCatalog';
import { Calculator, TrendingDown, DollarSign, Battery, AlertCircle } from 'lucide-react';

export default function H4() {
  const {
    audit,
    selectedModelH4,
    genericCapex, setGenericCapex,
    genericLife, setGenericLife,
    genericMaint, setGenericMaint,
    genericInstall, setGenericInstall,
    eternityCapex, setEternityCapex,
    eternityLife, setEternityLife,
    eternityMaint, setEternityMaint,
    eternityInstall, setEternityInstall
  } = useStore();

  const { modelos } = useCatalog();

  const selectedModel = useMemo(() => {
    return modelos.find(m => m.modelo === selectedModelH4);
  }, [modelos, selectedModelH4]);

  // Precargar datos desde auditoría y modelo seleccionado en H3
  useEffect(() => {
    if (audit.anosServicio > 0 && genericLife === 0) {
      setGenericLife(audit.anosServicio);
    }
    if (selectedModel) {
      // Vida útil estimada: valores de familyData.ts
      if (eternityLife === 0) {
        const subfamily = selectedModel.subfamilia;
        let estimatedLife = 12; // default
        if (subfamily?.includes('Larga Duración')) estimatedLife = 9; // 8-10 años → promedio
        if (subfamily?.includes('OPzV Standby')) estimatedLife = 20; // 20 años en flotación
        if (subfamily?.includes('QUASAR')) estimatedLife = 7; // 6-8 años → promedio
        if (subfamily?.includes('OPzV Solar')) estimatedLife = 8; // 7-10 años → promedio
        if (subfamily?.includes('OPzS Solar')) estimatedLife = 6; // 5-8 años → promedio
        if (subfamily?.includes('Gel') || subfamily?.includes('Gel Solar Bloc')) estimatedLife = 10;
        if (subfamily?.includes('OPzS Standby')) estimatedLife = 12; // Standby típico
        setEternityLife(estimatedLife);
      }
    }
  }, [audit, selectedModel, genericLife, eternityLife, setGenericLife, setEternityLife]);

  const calcReplacements = (horizon: number, life: number) => {
    if (!life || life <= 0) return 0;
    return Math.ceil(horizon / life) - 1;
  };

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

  const genReplacements5 = calcReplacements(5, genericLife);
  const etReplacements5 = calcReplacements(5, eternityLife);

  const genTCO5 = (genericCapex * (1 + genReplacements5)) + (genericInstall * (1 + genReplacements5)) + (genericMaint * 5);
  const etTCO5 = (eternityCapex * (1 + etReplacements5)) + (eternityInstall * (1 + etReplacements5)) + (eternityMaint * 5);

  const savings10 = genTCO10 - etTCO10;
  const savingsPct10 = genTCO10 > 0 ? (savings10 / genTCO10) * 100 : 0;
  const etCostPerYear10 = etTCO10 > 0 ? etTCO10 / 10 : 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">H4 · Calculadora TCO (Coste Total de Propiedad)</h1>
        <p className="text-gray-600 mt-2">
          Manejo de la objeción de precio: compara la solución Eternity seleccionada con la instalación actual / competencia.
        </p>
      </div>

      {selectedModel ? (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Battery className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-900">Modelo Eternity seleccionado en H3</p>
            <p className="text-sm text-blue-800">
              {selectedModel.modelo} — {selectedModel.subfamilia} — {selectedModel.especificaciones?.capacidad_nominal_ah || '-'} Ah / {selectedModel.especificaciones?.voltaje_v || '-'} V
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-yellow-900">No hay modelo Eternity seleccionado</p>
            <p className="text-sm text-yellow-800">Ve primero a H3 · Dimensionador para elegir el modelo a ofertar.</p>
          </div>
        </div>
      )}

      <div className="mb-8 p-5 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
        <h3 className="font-bold text-blue-900 mb-2">💡 RELLENA CON DATOS REALES PARA PRECISIÓN</h3>
        <p className="text-sm text-blue-800 mb-3">
          <strong>Para que el TCO sea preciso, obtén estos datos de fuentes reales:</strong>
        </p>
        <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
          <li><strong>Alternativa:</strong> Coste real de la instalación actual o presupuesto de competencia</li>
          <li><strong>Eternity:</strong> CAPEX del modelo seleccionado en H3</li>
          <li><strong>Vida Útil:</strong> Datasheet de producto o experiencia de campo</li>
          <li><strong>Mantenimiento anual:</strong> Costo de servicio técnico, repuestos y agua (si aplica)</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-gray-400">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Alternativa Actual / Competencia
            {audit.marca && <span className="block text-sm font-normal text-gray-500">{audit.marca} {audit.modelo}</span>}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CAPEX inicial (banco completo, USD)</label>
              <div className="relative">
                <DollarSign className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
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
                <DollarSign className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
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
                <DollarSign className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                  value={genericInstall || ''}
                  onChange={(e) => setGenericInstall(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            Propuesta Eternity
            {selectedModel && <span className="block text-sm font-normal text-blue-600">{selectedModel.modelo}</span>}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CAPEX inicial (banco completo, USD)</label>
              <div className="relative">
                <DollarSign className="h-4 w-4 text-blue-400 absolute left-3 top-2.5" />
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
                <DollarSign className="h-4 w-4 text-blue-400 absolute left-3 top-2.5" />
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
                <DollarSign className="h-4 w-4 text-blue-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={eternityInstall || ''}
                  onChange={(e) => setEternityInstall(Number(e.target.value))}
                />
              </div>
            </div>
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
}
