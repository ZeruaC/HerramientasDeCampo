import { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';

import { ClipboardCheck, Check, X, Minus, Printer, Save, AlertCircle, FileSearch } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useProposals, type Proposal } from '../hooks/useProposals';

type CheckStatus = 'OK' | 'NOK' | 'NA' | null;

interface CheckItemState {
  status: CheckStatus;
  value: string;
  obs: string;
}

interface ChecklistItemDef {
  id: number;
  category: string;
  text: string;
  hasValue: boolean;
  valueLabel?: string;
}

export default function H6() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [loadedProposal, setLoadedProposal] = useState<Proposal | null>(null);

  const {
    currentProposalNumber,
    proposalMode,
    setProposalMode,
    clientName,
    selectedModelH4,
  } = useStore();

  const { getProposalByNumber, updateProposalByNumber } = useProposals();
  const isViewMode = proposalMode === 'view';

  const [proposalNumber, setProposalNumber] = useState(currentProposalNumber);

  const [checklistData, setChecklistData] = useState({
    ubicacion: '',
    fecha: new Date().toISOString().split('T')[0],
    tecnico: '',
    cantidad: '',
    serie: '',
  });

  const checklistItems: ChecklistItemDef[] = [
    { id: 1, category: 'A. RECEPCIÓN Y MONTAJE', text: 'Inspección visual: sin grietas, fugas ni deformación de carcasas', hasValue: false },
    { id: 2, category: 'A. RECEPCIÓN Y MONTAJE', text: 'Polaridad verificada elemento a elemento antes de conectar', hasValue: false },
    { id: 3, category: 'A. RECEPCIÓN Y MONTAJE', text: 'Conexiones limpias y con grasa neutra / protector aplicado', hasValue: false },
    { id: 4, category: 'A. RECEPCIÓN Y MONTAJE', text: 'Torque de conexiones según fabricante', hasValue: true, valueLabel: 'N·m aplicado' },
    { id: 5, category: 'A. RECEPCIÓN Y MONTAJE', text: 'Separación entre elementos ≥ 10 mm y bancada nivelada', hasValue: false },
    { id: 6, category: 'A. RECEPCIÓN Y MONTAJE', text: 'Aislamiento del banco respecto a bancada verificado', hasValue: false },

    { id: 7, category: 'B. ENTORNO', text: 'Sala con ventilación conforme a EN IEC 62485-2', hasValue: false },
    { id: 8, category: 'B. ENTORNO', text: 'Temperatura ambiente de la sala registrada', hasValue: true, valueLabel: '°C' },
    { id: 9, category: 'B. ENTORNO', text: 'Sin fuentes de calor/chispa próximas; señalización instalada', hasValue: false },
    { id: 10, category: 'B. ENTORNO', text: 'EPIs y medios de seguridad disponibles (lavaojos si OPzS)', hasValue: false },

    { id: 11, category: 'C. PUESTA EN MARCHA ELÉCTRICA', text: 'Tensión en circuito abierto (OCV) por elemento dentro de rango', hasValue: true, valueLabel: 'V mín registrado' },
    { id: 12, category: 'C. PUESTA EN MARCHA ELÉCTRICA', text: 'Desviación máxima de OCV entre elementos ≤ 0,05 V (2 V)', hasValue: true, valueLabel: 'V máx registrado' },
    { id: 13, category: 'C. PUESTA EN MARCHA ELÉCTRICA', text: 'Tensión total del banco medida y registrada', hasValue: true, valueLabel: 'V total' },
    { id: 14, category: 'C. PUESTA EN MARCHA ELÉCTRICA', text: 'Setpoint de FLOTACIÓN del cargador ajustado (V/elem)', hasValue: true, valueLabel: 'V/elem' },
    { id: 15, category: 'C. PUESTA EN MARCHA ELÉCTRICA', text: 'Setpoint de ABSORCIÓN/carga ajustado (V/elem)', hasValue: true, valueLabel: 'V/elem' },
    { id: 16, category: 'C. PUESTA EN MARCHA ELÉCTRICA', text: 'Compensación térmica del cargador activada (mV/°C/elem)', hasValue: true, valueLabel: 'mV/°C' },
    { id: 17, category: 'C. PUESTA EN MARCHA ELÉCTRICA', text: 'Limitación de corriente de carga configurada (% C10)', hasValue: true, valueLabel: '% C10' },

    { id: 18, category: 'D. VALIDACIÓN FINAL', text: 'Prueba de autonomía bajo carga real superada', hasValue: true, valueLabel: 'min ensayados' },
    { id: 19, category: 'D. VALIDACIÓN FINAL', text: 'Registro fotográfico del banco e instalación realizado', hasValue: false },
    { id: 20, category: 'D. VALIDACIÓN FINAL', text: 'Cliente informado del plan de mantenimiento y garantía', hasValue: false },
  ];

  const [checks, setChecks] = useState<Record<number, CheckItemState>>({});

  // Cargar propuesta si estamos en modo lectura
  useEffect(() => {
    if (isViewMode && currentProposalNumber) {
      setProposalNumber(currentProposalNumber);
      getProposalByNumber(currentProposalNumber).then((proposal) => {
        if (proposal) {
          setLoadedProposal(proposal);
          if (proposal.checklist_data) {
            setChecks(proposal.checklist_data.checks || {});
            setChecklistData(prev => ({
              ...prev,
              ...(proposal.checklist_data?.metadata || {}),
            }));
          }
        } else {
          setSaveMessage('❌ Propuesta no encontrada');
        }
      });
    }
  }, [isViewMode, currentProposalNumber, getProposalByNumber]);

  useEffect(() => {
    return () => {
      if (isViewMode) {
        setProposalMode('edit');
      }
    };
  }, [isViewMode, setProposalMode]);

  const toggleCheck = (id: number, status: CheckStatus) => {
    setChecks((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: prev[id]?.status === status ? null : status,
        value: prev[id]?.value || '',
        obs: prev[id]?.obs || '',
      },
    }));
  };

  const updateField = (id: number, field: 'value' | 'obs', val: string) => {
    setChecks((prev) => ({
      ...prev,
      [id]: {
        status: prev[id]?.status || null,
        value: field === 'value' ? val : (prev[id]?.value || ''),
        obs: field === 'obs' ? val : (prev[id]?.obs || ''),
      },
    }));
  };

  const applicableItems = checklistItems.filter(item => checks[item.id]?.status !== 'NA');
  const okCount = applicableItems.filter(item => checks[item.id]?.status === 'OK').length;
  const isApto = applicableItems.length > 0 && okCount === applicableItems.length;
  const nokCount = applicableItems.filter(item => checks[item.id]?.status === 'NOK').length;

  const groupedItems = checklistItems.reduce<Record<string, ChecklistItemDef[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleSaveChecklist = async () => {
    if (!proposalNumber) {
      setSaveMessage('⚠️ Ingresa el número de propuesta (PROP-...)');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      await updateProposalByNumber(proposalNumber, {
        status: isApto ? 'installed' : 'pending_installation',
        checklist_data: {
          metadata: checklistData,
          checks,
          isApto,
          savedAt: new Date().toISOString(),
        },
      });

      setSaveMessage(`✅ Checklist guardado - Estado: ${isApto ? 'APTO' : 'PENDIENTE'}`);
    } catch (err: any) {
      setSaveMessage(`❌ Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = () => {
    if (!contentRef.current) return;
    setIsExporting(true);

    const element = contentRef.current;
    const options: any = {
      margin: 10,
      filename: `${proposalNumber || 'Checklist'}-${loadedProposal?.client_name || clientName || 'Cliente'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };

    html2pdf().set(options).from(element).save().finally(() => setIsExporting(false));
  };

  const displayClientName = loadedProposal?.client_name || clientName;
  const displayModel = loadedProposal?.selected_model || selectedModelH4;

  if (isViewMode && !loadedProposal && currentProposalNumber) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FileSearch className="w-8 h-8 text-purple-600" />
          Cargando checklist...
        </h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-purple-600" />
            H6 · Verificación de Instalación y Garantía
          </h1>
          <p className="text-gray-600 mt-2 max-w-3xl">
            Documento que activa la cobertura de fábrica. Completar en la puesta en marcha, firmar y adjuntar al expediente de garantía.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleSaveChecklist}
            disabled={isSaving}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded shadow-sm transition print:hidden"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Checklist'}</span>
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded shadow-sm transition print:hidden"
          >
            <Printer className="w-4 h-4" />
            <span>{isExporting ? 'Exportando...' : 'Descargar PDF'}</span>
          </button>
          {saveMessage && (
            <p className="text-xs text-center">{saveMessage}</p>
          )}
        </div>
      </div>

      {isViewMode && !loadedProposal && currentProposalNumber && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-900">Propuesta no encontrada</p>
            <p className="text-sm text-red-800">No se ha encontrado la oferta {currentProposalNumber}.</p>
          </div>
        </div>
      )}

      <div ref={contentRef}>
        <div className="bg-white rounded-lg shadow-md border mb-8">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">Datos del Proyecto</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded bg-gray-50" value={displayClientName} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nº Oferta (PROP-...)</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded bg-blue-50"
                placeholder="PROP-YYYY-MM-DD-###"
                value={proposalNumber}
                onChange={(e) => setProposalNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Técnico instalador</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded" value={checklistData.tecnico} onChange={(e) => setChecklistData(prev => ({ ...prev, tecnico: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación / planta</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded" value={checklistData.ubicacion} onChange={(e) => setChecklistData(prev => ({ ...prev, ubicacion: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded bg-gray-50" value={displayModel} readOnly />
              </div>
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cant.</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded" value={checklistData.cantidad} onChange={(e) => setChecklistData(prev => ({ ...prev, cantidad: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha puesta en marcha</label>
              <input type="date" className="w-full p-2 border border-gray-300 rounded" value={checklistData.fecha} onChange={(e) => setChecklistData(prev => ({ ...prev, fecha: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nº de serie / Lote</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded" value={checklistData.serie} onChange={(e) => setChecklistData(prev => ({ ...prev, serie: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="p-3 w-10 text-center">Nº</th>
                <th className="p-3">Punto de verificación</th>
                <th className="p-3 w-36 text-center">Estado</th>
                <th className="p-3 w-40">Valor medido</th>
                <th className="p-3 w-48">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(groupedItems).map(([category, items]) => (
                <tbody key={category}>
                  <tr className="bg-purple-50">
                    <td colSpan={5} className="p-3 font-bold text-purple-900 text-sm">{category}</td>
                  </tr>
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-3 text-center text-gray-500 font-medium">{item.id}</td>
                      <td className="p-3 text-sm text-gray-800">{item.text}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => toggleCheck(item.id, 'OK')}
                            className={`p-1.5 rounded-full border ${checks[item.id]?.status === 'OK' ? 'bg-green-100 border-green-500 text-green-600' : 'bg-white border-gray-300 text-gray-400 hover:bg-gray-100'}`}
                            title="OK"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleCheck(item.id, 'NOK')}
                            className={`p-1.5 rounded-full border ${checks[item.id]?.status === 'NOK' ? 'bg-red-100 border-red-500 text-red-600' : 'bg-white border-gray-300 text-gray-400 hover:bg-gray-100'}`}
                            title="No OK"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleCheck(item.id, 'NA')}
                            className={`p-1.5 rounded-full border ${checks[item.id]?.status === 'NA' ? 'bg-gray-200 border-gray-500 text-gray-600' : 'bg-white border-gray-300 text-gray-400 hover:bg-gray-100'}`}
                            title="No Aplica"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        {item.hasValue && checks[item.id]?.status !== 'NA' && (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              className="w-full p-1.5 text-sm border border-gray-300 rounded"
                              placeholder={item.valueLabel}
                              value={checks[item.id]?.value || ''}
                              onChange={(e) => updateField(item.id, 'value', e.target.value)}
                            />
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          className="w-full p-1.5 text-sm border border-gray-300 rounded"
                          placeholder="..."
                          value={checks[item.id]?.obs || ''}
                          onChange={(e) => updateField(item.id, 'obs', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-6">
          <div className={`flex-1 rounded-lg border p-6 flex flex-col justify-center items-center text-center ${isApto ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">Resultado Final</p>
            <div className="flex items-end gap-2 mb-2">
              <span className={`text-4xl font-black ${isApto ? 'text-green-600' : 'text-gray-700'}`}>{okCount}</span>
              <span className="text-xl text-gray-500 mb-1">/ {applicableItems.length}</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Puntos OK aplicables</p>
            {nokCount > 0 && (
              <p className="text-red-600 text-sm mb-4">{nokCount} punto(s) No OK</p>
            )}

            {isApto ? (
              <div className="bg-green-600 text-white font-bold py-2 px-6 rounded-full inline-flex items-center gap-2">
                <Check className="w-5 h-5" />
                APTO PARA REGISTRO DE GARANTÍA
              </div>
            ) : (
              <div className="bg-gray-300 text-gray-600 font-bold py-2 px-6 rounded-full">
                NO APTO (Completar puntos)
              </div>
            )}
          </div>

          <div className="flex-1 bg-white rounded-lg border p-6 flex flex-col justify-end">
            <div className="grid grid-cols-2 gap-8 h-full">
              <div className="border-b-2 border-gray-300 flex items-end pb-2">
                <span className="text-sm text-gray-500 font-medium">Firma Técnico:</span>
              </div>
              <div className="border-b-2 border-gray-300 flex items-end pb-2">
                <span className="text-sm text-gray-500 font-medium">Firma Cliente:</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
