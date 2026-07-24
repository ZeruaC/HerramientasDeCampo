import { useStore, type AuditData } from '../store/useStore';
import { ClipboardList, Eye, Battery, Wrench, AlertTriangle, ThermometerSun, Wind, Ruler } from 'lucide-react';

export default function Audit() {
  const { audit, setAudit } = useStore();

  const booleanOptions = [
    { value: true, label: 'Sí' },
    { value: false, label: 'No' },
  ];

  const problemas = [
    { key: 'cortesFrecuentes', label: 'Cortes / fallos frecuentes' },
    { key: 'finDeVida', label: 'Baterías en fin de vida' },
    { key: 'mantenimientoCostoso', label: 'Mantenimiento costoso o imposible' },
    { key: 'faltaVentilacion', label: 'Falta de ventilación / sobrecalentamiento' },
    { key: 'espacioInsuficiente', label: 'Espacio insuficiente' },
  ] as const;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-blue-600" />
          Auditoría de la Instalación Actual
        </h1>
        <p className="text-gray-600 mt-2">
          Inspección visual y técnica de la bancada existente. Estos datos alimentan el argumentario comercial y la selección de la solución Eternity.
        </p>
      </div>

      {/* A. Inspección visual */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-t-4 border-blue-500">
        <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          A. Inspección Visual
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: 'sulfatacion', label: '¿Sulfatación visible en bornes/carcasas?' },
            { key: 'corrosion', label: '¿Corrosión en elementos o conexiones?' },
            { key: 'hinchazon', label: '¿Hinchazón o deformación de carcasas?' },
            { key: 'fugas', label: '¿Fugas de electrolito / humedad?' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <div className="flex gap-3">
                {booleanOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setAudit({ [key]: opt.value } as Partial<typeof audit>)}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                      (audit as any)[key] === opt.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Battery className="w-4 h-4" />
              Estado de cables y bornes
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={audit.cablesBornes}
              onChange={(e) => setAudit({ cablesBornes: e.target.value as AuditData['cablesBornes'] })}
            >
              <option value="bueno">Bueno / limpio / apretado</option>
              <option value="corrosion">Con corrosión</option>
              <option value="desgaste">Desgastados o pelados</option>
              <option value="suelto">Bornes sueltos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado de la bancada / soporte</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={audit.bancada}
              onChange={(e) => setAudit({ bancada: e.target.value as AuditData['bancada'] })}
            >
              <option value="buena">Buena / nivelada / aislada</option>
              <option value="oxidada">Oxidada / deteriorada</option>
              <option value="inestable">Inestable o sin aislamiento</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Wind className="w-4 h-4" />
              Ventilación de la sala
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={audit.ventilacion}
              onChange={(e) => setAudit({ ventilacion: e.target.value as AuditData['ventilacion'] })}
            >
              <option value="adecuada">Adecuada</option>
              <option value="insuficiente">Insuficiente</option>
              <option value="sinVentilacion">Sin ventilación forzada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <ThermometerSun className="w-4 h-4" />
              Temperatura ambiente medida (°C)
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={audit.temperaturaAmbiente || ''}
              onChange={(e) => setAudit({ temperaturaAmbiente: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Limpieza general</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={audit.limpieza}
              onChange={(e) => setAudit({ limpieza: e.target.value as AuditData['limpieza'] })}
            >
              <option value="buena">Buena</option>
              <option value="regular">Regular</option>
              <option value="mala">Mala / acumulación de polvo</option>
            </select>
          </div>
        </div>
      </div>

      {/* B. Datos técnicos actuales */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-t-4 border-green-500">
        <h2 className="text-xl font-semibold mb-4 text-green-800 border-b pb-2 flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          B. Datos Técnicos de la Instalación Actual
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={audit.marca}
              onChange={(e) => setAudit({ marca: e.target.value })}
              placeholder="Ej. Exide, Hoppecke, Tudor..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={audit.modelo}
              onChange={(e) => setAudit({ modelo: e.target.value })}
              placeholder="Modelo exacto de la placa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tecnología</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={audit.tecnologia}
              onChange={(e) => setAudit({ tecnologia: e.target.value })}
            >
              <option value="">Seleccionar...</option>
              <option value="AGM">AGM / VRLA</option>
              <option value="Gel">Gel</option>
              <option value="OPzS">OPzS (inundado tubular)</option>
              <option value="OPzV">OPzV (gel tubular)</option>
              <option value="Plomo abierto">Plomo-ácido abierto</option>
              <option value="Litio">Litio</option>
              <option value="Desconocida">Desconocida</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voltaje del sistema (V DC)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={audit.voltajeSistema || ''}
              onChange={(e) => setAudit({ voltajeSistema: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad nominal (Ah)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={audit.capacidadAh || ''}
              onChange={(e) => setAudit({ capacidadAh: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">C-rate de referencia</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={audit.cRate}
              onChange={(e) => setAudit({ cRate: e.target.value })}
            >
              <option value="C10">C10</option>
              <option value="C20">C20</option>
              <option value="C100">C100</option>
              <option value="C5">C5</option>
              <option value="Desconocido">Desconocido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de elementos / bloques</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={audit.numeroElementos || ''}
              onChange={(e) => setAudit({ numeroElementos: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Años en servicio</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={audit.anosServicio || ''}
              onChange={(e) => setAudit({ anosServicio: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de uso</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={audit.uso}
              onChange={(e) => setAudit({ uso: e.target.value as AuditData['uso'] })}
            >
              <option value="Standby/Flotación (UPS)">Standby / Flotación (UPS)</option>
              <option value="Ciclado Diario (Solar)">Ciclado Diario (Solar)</option>
              <option value="Tracción / Carga Oportunidad">Tracción / Carga de Oportunidad</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">¿Mantenimiento disponible en planta?</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={audit.mantenimientoDisponible}
              onChange={(e) => setAudit({ mantenimientoDisponible: e.target.value as AuditData['mantenimientoDisponible'] })}
            >
              <option value="Sí">Sí, personal calificado</option>
              <option value="No">No, sitio remoto o sin personal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Espacio disponible para nueva bancada
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={audit.espacioDisponible}
              onChange={(e) => setAudit({ espacioDisponible: e.target.value as AuditData['espacioDisponible'] })}
            >
              <option value="Amplio">Amplio</option>
              <option value="Reducido">Reducido</option>
              <option value="Muy reducido">Muy reducido</option>
            </select>
          </div>
        </div>
      </div>

      {/* C. Problemas detectados */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-t-4 border-red-500">
        <h2 className="text-xl font-semibold mb-4 text-red-800 border-b pb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          C. Problemas Detectados
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problemas.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-red-600 rounded"
                checked={(audit as any)[key]}
                onChange={(e) => setAudit({ [key]: e.target.checked } as Partial<typeof audit>)}
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Otros problemas / observaciones</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
            value={audit.otrosProblemas}
            onChange={(e) => setAudit({ otrosProblemas: e.target.value })}
            placeholder="Detalles adicionales relevantes para el argumentario..."
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>Siguiente paso:</strong> completa esta auditoría y continúa a <strong>H1 · Dolor del cliente</strong> para cuantificar el impacto económico de los problemas detectados.
      </div>
    </div>
  );
}
