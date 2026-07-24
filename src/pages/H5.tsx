import { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';

import { useStore } from '../store/useStore';
import { useCatalog } from '../hooks/useCatalog';
import { useProposals, type Proposal } from '../hooks/useProposals';
import { Presentation, Building, Battery, TrendingUp, ArrowRight, Download, Save, AlertCircle, FileSearch, FileText } from 'lucide-react';
import { getPDFPath, hasPDF } from '../data/pdfMapping';

export default function H5() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [proposalNumber, setProposalNumber] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [loadedProposal, setLoadedProposal] = useState<Proposal | null>(null);
  const [includePDF, setIncludePDF] = useState(false);

  const { saveProposal, getProposalByNumber } = useProposals();

  const {
    currentProposalNumber,
    proposalMode,
    setProposalMode,
    audit,
    clientName,
    sector,
    outageHoursPerWeek, affectedLines, costPerHour, fixedCostPerIncident, incidentsPerWeek,
    recommendedFamily, selectedSubfamily,
    genericCapex, genericLife, genericMaint, genericInstall,
    eternityCapex, eternityLife, eternityMaint, eternityInstall,
    systemVoltage, selectedModelH4, autonomyReqH4, loadPowerW, maxDod, inverterEfficiency
  } = useStore();

  const displaySubfamily = loadedProposal?.selected_subfamily || selectedSubfamily;

  const isViewMode = proposalMode === 'view';

  const { modelos } = useCatalog();

  // Cargar propuesta si estamos en modo lectura
  useEffect(() => {
    if (isViewMode && currentProposalNumber) {
      getProposalByNumber(currentProposalNumber).then((proposal) => {
        if (proposal) {
          setLoadedProposal(proposal);
          setProposalNumber(proposal.proposal_number);
        } else {
          setSaveMessage('❌ Propuesta no encontrada');
        }
      });
    }
  }, [isViewMode, currentProposalNumber, getProposalByNumber]);

  // Resetear a modo edición si se desmonta o se navega manualmente
  useEffect(() => {
    return () => {
      if (isViewMode) {
        setProposalMode('edit');
      }
    };
  }, [isViewMode, setProposalMode]);

  const handleSaveProposal = async () => {
    if (!clientName) {
      setSaveMessage('Por favor ingresa el nombre del cliente en H1');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    const weeklyLoss = (outageHoursPerWeek * affectedLines * costPerHour) + (incidentsPerWeek * fixedCostPerIncident);
    const annualLoss = weeklyLoss * 52;

    const calcReplacements = (horizon: number, life: number) => (!life || life <= 0 ? 0 : Math.ceil(horizon / life) - 1);
    const genReplacements10 = calcReplacements(10, genericLife);
    const etReplacements10 = calcReplacements(10, eternityLife);
    const genTCO10 = (genericCapex * (1 + genReplacements10)) + (genericInstall * (1 + genReplacements10)) + (genericMaint * 10);
    const etTCO10 = (eternityCapex * (1 + etReplacements10)) + (eternityInstall * (1 + etReplacements10)) + (eternityMaint * 10);
    const savings10 = genTCO10 - etTCO10;
    const paybackMonths = annualLoss > 0 ? (eternityCapex / annualLoss) * 12 : 0;

    try {
      const propNum = await saveProposal(clientName, {
        sector: sector || undefined,
        outage_hours_per_week: outageHoursPerWeek || undefined,
        affected_lines: affectedLines || undefined,
        cost_per_hour: costPerHour || undefined,
        annual_loss: annualLoss,
        recommended_family: recommendedFamily || undefined,
        selected_subfamily: selectedSubfamily || undefined,
        eternity_capex: eternityCapex || undefined,
        generic_capex: genericCapex || undefined,
        generic_life: genericLife || undefined,
        generic_maint: genericMaint || undefined,
        generic_install: genericInstall || undefined,
        system_voltage: systemVoltage || undefined,
        selected_model: selectedModelH4 || undefined,
        autonomy_hours: autonomyReqH4 || undefined,
        load_power_w: loadPowerW || undefined,
        max_dod: maxDod || undefined,
        inverter_efficiency: inverterEfficiency || undefined,
        tco_savings_10y: savings10 || undefined,
        payback_months: paybackMonths || undefined,
        // TODO: audit_data column needs to be added to proposals table in Supabase
      });

      setProposalNumber(propNum);
      setSaveMessage(`✅ Propuesta guardada: ${propNum}`);
    } catch (err: any) {
      setSaveMessage(`❌ Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!contentRef.current) return;
    setIsExporting(true);

    try {
      const element = contentRef.current;
      const options: any = {
        margin: 10,
        filename: `${proposalNumber || 'Propuesta'}-${clientName || 'Cliente'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };

      const pdfGenerator = html2pdf().set(options).from(element);

      // Incluir ficha técnica si se seleccionó
      if (includePDF && displaySubfamily) {
        const pdfPath = getPDFPath(displaySubfamily);
        if (pdfPath && hasPDF(displaySubfamily)) {
          pdfGenerator.toPdf().get('pdf').then((pdf: any) => {
            pdf.addPage();
            pdf.setFontSize(14);
            pdf.text('FICHA TÉCNICA DE PRODUCTO', 20, 20);
            pdf.setFontSize(10);
            pdf.text(`Subfamilia: ${displaySubfamily}`, 20, 35);
            pdf.setFontSize(9);
            pdf.text('Descarga disponible en: public/pdfs/subfamilias/', 20, 50);
            pdf.setTextColor(100, 100, 100);
            pdf.text('(Documento técnico detallado del fabricante)', 20, 58);
          });
        }
      }

      pdfGenerator.save();
    } catch (err) {
      console.error('Error exportando PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Datos a mostrar (desde propuesta cargada o store)
  const displayClientName = loadedProposal?.client_name || clientName;
  const displaySector = loadedProposal?.sector || sector;
  const displayOutageHours = loadedProposal?.outage_hours_per_week ?? outageHoursPerWeek;
  const displayAffectedLines = loadedProposal?.affected_lines ?? affectedLines;
  const displayCostPerHour = loadedProposal?.cost_per_hour ?? costPerHour;
  const displayFixedCost = 0;
  const displayIncidents = 0;
  const displayAnnualLoss = loadedProposal?.annual_loss ??
    ((displayOutageHours * displayAffectedLines * displayCostPerHour) + (displayIncidents * displayFixedCost)) * 52;
  const displayFiveYearLoss = displayAnnualLoss * 5;
  const displayFamily = loadedProposal?.recommended_family || recommendedFamily;
  const displayModel = loadedProposal?.selected_model || selectedModelH4;
  const displayVoltage = loadedProposal?.system_voltage ?? systemVoltage;
  const displayAutonomy = loadedProposal?.autonomy_hours ?? autonomyReqH4;
  const displayEternityCapex = loadedProposal?.eternity_capex ?? eternityCapex;
  const displaySavings = loadedProposal?.tco_savings_10y ??
    (() => {
      const calcReplacements = (horizon: number, life: number) => (!life || life <= 0 ? 0 : Math.ceil(horizon / life) - 1);
      const genReplacements10 = calcReplacements(10, genericLife);
      const etReplacements10 = calcReplacements(10, eternityLife);
      const genTCO10 = (genericCapex * (1 + genReplacements10)) + (genericInstall * (1 + genReplacements10)) + (genericMaint * 10);
      const etTCO10 = (eternityCapex * (1 + etReplacements10)) + (eternityInstall * (1 + etReplacements10)) + (eternityMaint * 10);
      return genTCO10 - etTCO10;
    })();
  const displayPayback = loadedProposal?.payback_months ??
    (displayAnnualLoss > 0 ? (displayEternityCapex / displayAnnualLoss) * 12 : 0);

  const chosenModelObj = modelos.find(m => m.modelo === displayModel);
  const capacityStr = chosenModelObj ? `${chosenModelObj.especificaciones?.capacidad_nominal_ah || '-'} Ah` : '-';

  if (isViewMode && !loadedProposal && currentProposalNumber) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-900 flex items-center gap-3">
          <FileSearch className="w-8 h-8 text-indigo-600" />
          Cargando propuesta...
        </h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto pb-24">
      <div className="flex justify-between items-start mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900 flex items-center gap-3">
            <Presentation className="w-8 h-8 text-indigo-600" />
            H5 · Propuesta de Solución de Continuidad
          </h1>
          <p className="text-gray-500 mt-2">
            Resumen ejecutivo para {displayClientName || 'Cliente'} — Confidencial
          </p>
          {proposalNumber && (
            <p className="text-green-600 font-semibold mt-1">Propuesta: {proposalNumber}</p>
          )}
          {isViewMode && (
            <p className="text-xs text-gray-500 mt-1">Modo lectura</p>
          )}
        </div>
        {!isViewMode && (
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSaveProposal}
              disabled={isSaving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md shadow-sm transition print:hidden"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Propuesta'}</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md shadow-sm transition print:hidden"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exportando...' : 'Exportar a PDF'}</span>
            </button>
            {saveMessage && (
              <p className="text-xs mt-2 text-center">{saveMessage}</p>
            )}
          </div>
        )}
      </div>

      {isViewMode && !loadedProposal && currentProposalNumber && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-900">Propuesta no encontrada</p>
            <p className="text-sm text-red-800">No se ha encontrado la propuesta {currentProposalNumber}.</p>
          </div>
        </div>
      )}

      <div ref={contentRef}>
        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
              <Building className="w-5 h-5 text-gray-400" />
              1. Situación Actual y Riesgo Operativo
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">Cliente</p>
                <p className="font-semibold text-gray-800">{displayClientName || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Sector</p>
                <p className="font-semibold text-gray-800">{displaySector || '-'}</p>
              </div>
              <div className="bg-red-50 p-3 rounded border border-red-100 col-span-2 md:col-span-1">
                <p className="text-xs text-red-600 font-bold uppercase">Pérdida Anual Estimada</p>
                <p className="text-xl font-black text-red-700">${displayAnnualLoss.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 p-3 rounded border border-red-100 col-span-2 md:col-span-1">
                <p className="text-xs text-red-600 font-bold uppercase">Riesgo Acumulado (5 Años)</p>
                <p className="text-xl font-black text-red-700">${displayFiveYearLoss.toLocaleString()}</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
              <Battery className="w-5 h-5 text-gray-400" />
              2. Solución Tecnológica Eternity
            </h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Tecnología Seleccionada</p>
                <p className="font-bold text-blue-900 text-lg">{displayFamily || '-'}</p>
                <p className="text-xs text-gray-500 mt-1">Óptima para las condiciones térmicas y operativas de su planta.</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Modelo Dimensionado</p>
                <p className="font-bold text-gray-800 text-lg">{displayModel || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Sistema y Capacidad</p>
                <p className="font-semibold text-gray-800">{displayVoltage} VDC — {capacityStr}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Autonomía de Diseño</p>
                <p className="font-semibold text-gray-800">{displayAutonomy} horas</p>
              </div>
            </div>
            {displaySubfamily && hasPDF(displaySubfamily) && (
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePDF}
                    onChange={(e) => setIncludePDF(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="flex items-center gap-2 text-sm font-medium text-blue-900">
                    <FileText className="w-4 h-4" />
                    Incluir ficha técnica de {displaySubfamily} en PDF
                  </span>
                </label>
                <p className="text-xs text-blue-700 ml-7 mt-1">Se agregará la hoja de especificaciones técnicas del producto al descargar la propuesta</p>
              </div>
            )}
          </section>

          <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200 p-6">
            <h2 className="text-xl font-bold text-green-900 flex items-center gap-2 mb-4 border-b border-green-200 pb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              3. Justificación Económica (ROI)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-4 rounded border border-green-100 shadow-sm text-center">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Inversión (CAPEX)</p>
                <p className="text-2xl font-black text-gray-800">${displayEternityCapex.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded border border-green-100 shadow-sm text-center">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Retorno de Inversión</p>
                <p className="text-2xl font-black text-green-600">{displayPayback.toFixed(1)} meses</p>
                <p className="text-xs text-gray-400">(frente a pérdidas)</p>
              </div>
              <div className="bg-white p-4 rounded border border-green-100 shadow-sm text-center">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Ahorro vs Alternativa (10 años)</p>
                <p className="text-2xl font-black text-blue-700">${displaySavings.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white bg-opacity-60 p-4 rounded text-green-900 italic text-sm">
              <p>
                <strong>Resumen Ejecutivo:</strong> La inversión de ${displayEternityCapex.toLocaleString()} en la tecnología {displayFamily} se amortiza en tan solo {displayPayback.toFixed(1)} meses al evitar las paradas actuales. Además, gracias a su mayor vida útil, reduce su Coste Total de Propiedad en ${displaySavings.toLocaleString()} a lo largo de 10 años comparado con tecnologías estándar.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
              <ArrowRight className="w-5 h-5 text-indigo-500" />
              4. Siguiente Paso
            </h2>
            <div className="flex gap-4 items-center bg-indigo-50 p-4 rounded border border-indigo-100">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
              <p className="text-indigo-900 font-medium">
                Auditoría técnica gratuita en sitio para validar el cargador existente y condiciones finales de instalación.
                <br /><span className="text-sm font-normal">Fecha propuesta: ___/___/20__</span>
              </p>
            </div>
          </section>

          <div className="pt-8 flex justify-between items-end border-t border-gray-300">
            <div>
              <p className="text-xs text-gray-500">Documento generado el {new Date().toLocaleDateString()}</p>
              <p className="text-xs text-gray-500">Validez de la propuesta: 30 días</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-700">Eternity Technologies</p>
              <p className="text-xs text-gray-500 mt-8 border-t border-gray-400 pt-1 inline-block w-48 text-center">Firma Asesor / Comercial</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
