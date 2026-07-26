import { useStore } from '../store/useStore';
import { AlertCircle, DollarSign, Clock, Building2, Zap, CheckCircle2 } from 'lucide-react';

export const H1 = () => {
  const {
    clientName,
    sector,
    audit,
    setAudit,
    outagesPerYear,
    setOutagesPerYear,
    durationHours,
    setDurationHours,
    costPerHour,
    setCostPerHour,
  } = useStore();

  const annualLoss = outagesPerYear * durationHours * costPerHour;
  const fiveYearLoss = annualLoss * 5;

  const handleProblemChange = (field: string, value: boolean | string) => {
    setAudit({ [field]: value });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">H1 · Cuantificador del Dolor del Cliente</h1>
        <p className="text-gray-600 mt-2">
          Auditoría + cuantificación económica. Cambia la conversación de '¿cuánto cuesta la batería?' a '¿cuánto le cuesta a usted no tenerla?'
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* SECCIÓN A: Datos del Cliente (desde Checklist) */}
          <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
            <h2 className="text-lg font-semibold mb-4 text-green-800 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              A. Datos del Cliente
            </h2>
            <div className="space-y-2 text-sm text-green-900">
              <div><strong>Cliente:</strong> {clientName || 'No especificado'}</div>
              <div><strong>Sector:</strong> {sector || 'No especificado'}</div>
            </div>
          </div>

          {/* SECCIÓN B: Datos Técnicos de la Instalación Actual */}
          <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
            <h2 className="text-lg font-semibold mb-4 text-blue-800 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              B. Datos Técnicos de la Instalación Actual
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  value={audit.marca || ''}
                  onChange={(e) => handleProblemChange('marca', e.target.value)}
                  placeholder="ej: Northstar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  value={audit.modelo || ''}
                  onChange={(e) => handleProblemChange('modelo', e.target.value)}
                  placeholder="ej: LFG"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tecnología</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  value={audit.tecnologia || ''}
                  onChange={(e) => handleProblemChange('tecnologia', e.target.value)}
                >
                  <option value="">Selecciona...</option>
                  <option value="AGM/VRLA">AGM/VRLA</option>
                  <option value="Gel">Gel</option>
                  <option value="Flooded">Flooded</option>
                  <option value="Litio">Litio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voltaje del sistema (V DC)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  value={audit.voltajeSistema || ''}
                  onChange={(e) => handleProblemChange('voltajeSistema', e.target.value)}
                  placeholder="ej: 48"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad nominal (Ah)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  value={audit.capacidadAh || ''}
                  onChange={(e) => handleProblemChange('capacidadAh', e.target.value)}
                  placeholder="ej: 1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">C-rate de referencia</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  value={audit.cRate || ''}
                  onChange={(e) => handleProblemChange('cRate', e.target.value)}
                >
                  <option value="">Selecciona...</option>
                  <option value="C10">C10</option>
                  <option value="C20">C20</option>
                  <option value="C100">C100</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nº de elementos / bloques</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  value={audit.numeroElementos || ''}
                  onChange={(e) => handleProblemChange('numeroElementos', e.target.value)}
                  placeholder="ej: 24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Años en servicio</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  value={audit.anosServicio || ''}
                  onChange={(e) => handleProblemChange('anosServicio', e.target.value)}
                  placeholder="ej: 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de uso</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  value={audit.uso || ''}
                  onChange={(e) => handleProblemChange('uso', e.target.value)}
                >
                  <option value="">Selecciona...</option>
                  <option value="Standby/Flotación (UPS)">Standby/Flotación (UPS)</option>
                  <option value="Ciclado Diario (Solar)">Ciclado Diario (Solar)</option>
                  <option value="Tracción / Carga Oportunidad">Tracción / Carga Oportunidad</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">¿Mantenimiento disponible en planta?</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  value={audit.mantenimientoDisponible || ''}
                  onChange={(e) => handleProblemChange('mantenimientoDisponible', e.target.value)}
                >
                  <option value="">Selecciona...</option>
                  <option value="Sí">Sí, personal calificado</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Espacio disponible para nueva bancada</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  value={audit.espacioDisponible || ''}
                  onChange={(e) => handleProblemChange('espacioDisponible', e.target.value)}
                >
                  <option value="">Selecciona...</option>
                  <option value="Amplio">Amplio</option>
                  <option value="Reducido">Reducido</option>
                  <option value="Muy reducido">Muy reducido</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN C: Problemas Detectados */}
          <div className="bg-orange-50 rounded-lg shadow-md p-6 border border-orange-200">
            <h2 className="text-lg font-semibold mb-4 text-orange-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              C. Problemas Detectados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'cortesFrecuentes', label: 'Cortes frecuentes' },
                { key: 'finDeVida', label: 'Baterías en fin de vida' },
                { key: 'mantenimientoCostoso', label: 'Mantenimiento costoso o imposible' },
                { key: 'faltaVentilacion', label: 'Falta de ventilación / sobrecalentamiento' },
                { key: 'espacioInsuficiente', label: 'Espacio insuficiente' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!(audit[key as keyof typeof audit])}
                    onChange={(e) => handleProblemChange(key, e.target.checked)}
                    className="w-4 h-4"
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Otros problemas / observaciones</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                rows={3}
                value={audit.otrosProblemas || ''}
                onChange={(e) => handleProblemChange('otrosProblemas', e.target.value)}
                placeholder="Detalles adicionales relevantes..."
              />
            </div>
          </div>

          {/* SECCIÓN D: Datos Económicos Simplificados */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border-2 border-green-300">
            <h2 className="text-xl font-semibold mb-4 text-green-800 border-b-2 border-green-300 pb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              D. Impacto Económico por Falta de Energía ⭐ REQUERIDO PARA H5
            </h2>
            <div className="p-4 bg-red-100 border-l-4 border-red-600 mb-4 text-red-800 text-sm">
              <strong>⚠️ ESTOS DATOS SON OBLIGATORIOS para H5 (Propuesta)</strong> — sin ellos no se puede generar la propuesta económica.
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-600" />
                    ¿Cuántas paradas/año? *
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-3 border-2 border-red-300 rounded-md bg-red-50 focus:ring-red-500 focus:border-red-500"
                    value={outagesPerYear || ''}
                    onChange={(e) => setOutagesPerYear(Number(e.target.value))}
                    placeholder="ej: 12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-600" />
                    Duración promedio (horas) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-3 border-2 border-red-300 rounded-md bg-red-50 focus:ring-red-500 focus:border-red-500"
                    value={durationHours || ''}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    placeholder="ej: 4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-red-600" />
                    Coste/hora sin energía (USD) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-3 border-2 border-red-300 rounded-md bg-red-50 focus:ring-red-500 focus:border-red-500"
                    value={costPerHour || ''}
                    onChange={(e) => setCostPerHour(Number(e.target.value))}
                    placeholder="ej: 500"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 text-blue-800 text-sm rounded-md flex gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Cómo calcular coste/hora:</strong> (Margen bruto diario ÷ horas productivas) + Mano de obra parada + Penalizaciones contractuales + Pérdida de clientes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL LATERAL: El Dolor en Números */}
        <div className="space-y-6">
          <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-100 sticky top-8">
            <h2 className="text-xl font-semibold mb-4 text-red-800 border-b border-red-200 pb-2">El Dolor en Números</h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-red-600 mb-1">Cálculo:</p>
                <p className="text-xs text-gray-600 mb-2">
                  {outagesPerYear} paradas/año × {durationHours}h × ${costPerHour}/h
                </p>
              </div>
              <div>
                <p className="text-sm text-red-600 mb-1">PÉRDIDA ANUAL ESTIMADA</p>
                <p className="text-4xl font-black text-red-600">${annualLoss.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-red-600 mb-1">Pérdida en 5 años (horizonte de la solución)</p>
                <p className="text-3xl font-bold text-red-900">${fiveYearLoss.toLocaleString()}</p>
              </div>

              {annualLoss > 0 && (
                <div className="p-4 bg-green-50 text-green-800 text-sm rounded-md flex gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <p>
                    <strong>Propuesta de solución:</strong> Una batería Eternity bien dimensionada eliminaría esta pérdida.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Guion */}
          <div className="bg-gray-50 rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Guion para la Visita</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
              <li>Auditoría: <em>"Esta es la instalación que tiene hoy..."</em></li>
              <li>Preguntas: <em>"¿Cuántas paradas al año?"</em> — deja que el cliente ponga sus números.</li>
              <li>Rellenar <strong>CON el cliente mirando</strong>: los números son suyos.</li>
              <li>Presenta la pérdida anual <strong>antes</strong> de hablar de producto.</li>
              <li>Cierra: <em>"¿Tiene sentido que le prepare una propuesta para eliminar esta pérdida?"</em></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
