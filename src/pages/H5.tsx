import { useState, useMemo, useEffect, Fragment, useRef } from 'react';
import html2pdf from 'html2pdf.js';

import { useStore } from '../store/useStore';
import { useCatalog } from '../hooks/useCatalog';
import { useProposals } from '../hooks/useProposals';
import { useAuth } from '../context/AuthContext';
import { getPDFPath, hasPDF } from '../data/pdfMapping';
import { Presentation, Building, Battery, TrendingUp, Download, Save, FileText, PenLine } from 'lucide-react';

export const H5 = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [proposalNumber, setProposalNumber] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [signedAt, setSignedAt] = useState<string | null>(null);

  const { user } = useAuth();
  const { saveProposal, updateProposalByNumber, getProposalByNumber } = useProposals();

  const {
    currentProposalNumber, setCurrentProposalNumber,
    clientName, sector,
    contactPerson, phoneNumber, location,
    audit,
    maxTemp, autonomyReqH2, maintenanceAvailable, operationType, availableSpace,
    outagesPerYear, durationHours, costPerHour,
    recommendedFamily, selectedFamilyH4,
    eternityCapex, genericCapex, genericLife, genericMaint, genericInstall, eternityLife, eternityMaint, eternityInstall,
    systemVoltage, selectedModelH4, autonomyReqH4,
    loadPowerW, minTempH4, maxDod, inverterEfficiency
  } = useStore();

  const { modelos, loading } = useCatalog();

  // Si venimos de "abrir" una propuesta guardada (buscador en el sidebar),
  // recupera su número y estado de firma para no perderlos al re-guardar.
  useEffect(() => {
    if (!currentProposalNumber) return;
    setProposalNumber(currentProposalNumber);
    getProposalByNumber(currentProposalNumber).then((p) => {
      if (p?.signed_at) setSignedAt(p.signed_at);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProposalNumber]);

  // Calculate H1 losses
  const annualLoss = outagesPerYear * durationHours * costPerHour;
  const fiveYearLoss = annualLoss * 5;

  const handleSaveProposal = async () => {
    if (!clientName) {
      setSaveMessage('Por favor ingresa cliente, sector y datos económicos en H1');
      return;
    }
    if (!outagesPerYear || !durationHours || !costPerHour) {
      setSaveMessage('Por favor completa los datos económicos en H1');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const proposalData: any = {
        sector: sector || undefined,
        contact_person: contactPerson || undefined,
        phone_number: phoneNumber || undefined,
        location: location || undefined,
        audit_data: Object.keys(audit).length > 0 ? audit : undefined,
        max_temp: maxTemp || undefined,
        autonomy_req_h2: autonomyReqH2 || undefined,
        maintenance_available: maintenanceAvailable || undefined,
        operation_type: operationType || undefined,
        available_space: availableSpace || undefined,
        annual_loss: annualLoss,
        outages_per_year: outagesPerYear,
        duration_hours: durationHours,
        cost_per_hour: costPerHour,
        recommended_family: recommendedFamily || undefined,
        selected_family_h4: selectedFamilyH4 || undefined,
        eternity_capex: eternityCapex || undefined,
        system_voltage: systemVoltage || undefined,
        selected_model: selectedModelH4 || undefined,
        autonomy_hours: autonomyReqH4 || undefined,
        generic_capex: genericCapex || undefined,
        generic_life: genericLife || undefined,
        generic_maint: genericMaint || undefined,
        generic_install: genericInstall || undefined,
        eternity_life: eternityLife || undefined,
        eternity_maint: eternityMaint || undefined,
        eternity_install: eternityInstall || undefined,
        load_power_w: loadPowerW || undefined,
        min_temp_h4: minTempH4 || undefined,
        max_dod: maxDod || undefined,
        inverter_efficiency: inverterEfficiency || undefined,
      };

      // Guardar SIEMPRE crea una propuesta nueva, aunque se haya abierto una
      // anterior desde el buscador: reemitir o modificar una oferta no debe
      // tocar los datos de la que ya existía (puede estar firmada y enviada).
      const wasReopened = !!proposalNumber;
      const propNum = await saveProposal(clientName, proposalData);
      setProposalNumber(propNum);
      setCurrentProposalNumber(propNum);
      setSignedAt(null);
      setSaveMessage(
        wasReopened
          ? `✅ Nueva propuesta creada a partir de la anterior: ${propNum}`
          : `✅ Propuesta guardada: ${propNum}`
      );
    } catch (err: any) {
      setSaveMessage(`❌ Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSign = async (checked: boolean) => {
    if (!proposalNumber) return;
    setIsSigning(true);
    try {
      if (checked) {
        const now = new Date().toISOString();
        await updateProposalByNumber(proposalNumber, { signed_at: now });
        setSignedAt(now);
      } else {
        await updateProposalByNumber(proposalNumber, { signed_at: null as unknown as string });
        setSignedAt(null);
      }
    } catch (err: any) {
      setSaveMessage(`❌ Error al firmar: ${err.message}`);
    } finally {
      setIsSigning(false);
    }
  };

  const handleExportPDF = () => {
    if (!contentRef.current) return;
    setIsExporting(true);

    const element = contentRef.current;
    const options: any = {
      margin: 10,
      filename: `${proposalNumber || 'Propuesta'}-${clientName || 'Cliente'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(options).from(element).save().finally(() => setIsExporting(false));
  };

  // Re-calculate H3 TCO using the same horizon as H3: the guaranteed life of
  // the Eternity vasos (eternityLife), not a fixed number of years.
  const horizonYears = eternityLife > 0 ? eternityLife : 0;
  const calcReplacements = (horizon: number, life: number) => (!life || life <= 0 ? 0 : Math.ceil(horizon / life) - 1);
  const genReplacements10 = calcReplacements(horizonYears, genericLife);
  const etReplacements10 = calcReplacements(horizonYears, eternityLife);
  const genTCO10 = (genericCapex * (1 + genReplacements10)) + (genericInstall * (1 + genReplacements10)) + (genericMaint * horizonYears);
  const etTCO10 = (eternityCapex * (1 + etReplacements10)) + (eternityInstall * (1 + etReplacements10)) + (eternityMaint * horizonYears);
  const savings10 = genTCO10 - etTCO10;
  const etCostPerYear10 = horizonYears > 0 ? etTCO10 / horizonYears : 0;

  // Calculate Payback (Months to recover investment based on avoided losses)
  const paybackMonths = annualLoss > 0 ? (eternityCapex / annualLoss) * 12 : 0;

  const chosenModelObj = modelos.find(m => m.modelo === selectedModelH4);
  const capacityStr = chosenModelObj ? `${chosenModelObj.especificaciones?.capacidad_nominal_ah || '-'} Ah` : '-';

  return (
    <div className="p-8 max-w-4xl mx-auto pb-24">
      <div className="flex justify-between items-start mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900 flex items-center gap-3">
            <Presentation className="w-8 h-8 text-indigo-600" />
            H5 · Propuesta de Solución de Continuidad
          </h1>
          <p className="text-gray-500 mt-2">
            Resumen ejecutivo para {clientName || 'Cliente'} — Confidencial
          </p>
          {proposalNumber && (
            <p className="text-green-600 font-semibold mt-1">
              Propuesta: {proposalNumber}
            </p>
          )}
        </div>
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
      </div>

      <div ref={contentRef}>

      <div className="space-y-8">
        {/* 1. Cliente y Situación Actual */}
        <section className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
            <Building className="w-5 h-5 text-gray-400" />
            1. Situación Actual y Riesgo Operativo
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Cliente</p>
              <p className="font-semibold text-gray-800">{clientName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Sector</p>
              <p className="font-semibold text-gray-800">{sector || '-'}</p>
            </div>
            <div className="bg-red-50 p-3 rounded border border-red-100 col-span-2 md:col-span-1">
              <p className="text-xs text-red-600 font-bold uppercase">Pérdida Anual Estimada</p>
              <p className="text-xl font-black text-red-700">${annualLoss.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 p-3 rounded border border-red-100 col-span-2 md:col-span-1">
              <p className="text-xs text-red-600 font-bold uppercase">Riesgo Acumulado (5 Años)</p>
              <p className="text-xl font-black text-red-700">${fiveYearLoss.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* 2. Solución Propuesta */}
        <section className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
            <Battery className="w-5 h-5 text-gray-400" />
            2. Solución Tecnológica Eternity
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Tecnología Seleccionada</p>
              <p className="font-bold text-blue-900 text-lg">{recommendedFamily || '-'}</p>
              <p className="text-xs text-gray-500 mt-1">Óptima para las condiciones térmicas y operativas de su planta.</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Modelo Dimensionado</p>
              <p className="font-bold text-gray-800 text-lg">{selectedModelH4 || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Sistema y Capacidad</p>
              <p className="font-semibold text-gray-800">{systemVoltage} VDC — {capacityStr}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Autonomía de Diseño</p>
              <p className="font-semibold text-gray-800">{autonomyReqH4} horas</p>
            </div>
          </div>
          {hasPDF(recommendedFamily) && (
            <a
              href={getPDFPath(recommendedFamily)!}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 print:hidden inline-flex items-center gap-2 text-sm font-medium text-indigo-700 hover:text-indigo-900 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-md transition-colors"
            >
              <FileText className="w-4 h-4" />
              Ver ficha técnica de {recommendedFamily} (adjuntar al enviar la propuesta)
            </a>
          )}
        </section>

        {/* 3. Justificación Económica */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200 p-6">
          <h2 className="text-xl font-bold text-green-900 flex items-center gap-2 mb-4 border-b border-green-200 pb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            3. Justificación Económica (ROI)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded border border-green-100 shadow-sm text-center">
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Inversión (CAPEX)</p>
              <p className="text-2xl font-black text-gray-800">${eternityCapex.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded border border-green-100 shadow-sm text-center">
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Retorno de Inversión</p>
              <p className="text-2xl font-black text-green-600">{paybackMonths.toFixed(1)} meses</p>
              <p className="text-xs text-gray-400">(frente a pérdidas)</p>
            </div>
            <div className="bg-white p-4 rounded border border-green-100 shadow-sm text-center">
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Ahorro vs Alternativa ({horizonYears || '-'} años)</p>
              <p className="text-2xl font-black text-blue-700">${savings10.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white bg-opacity-60 p-4 rounded text-green-900 italic text-sm">
            <p>
              <strong>Resumen Ejecutivo:</strong> La inversión de ${eternityCapex.toLocaleString()} en la tecnología {recommendedFamily} se amortiza en tan solo {paybackMonths.toFixed(1)} meses al evitar las paradas actuales. Además, gracias a su mayor vida útil, reduce su Coste Total de Propiedad en ${savings10.toLocaleString()} a lo largo de {horizonYears} años (vida útil garantizada) comparado con tecnologías estándar, con un coste anualizado de solo ${etCostPerYear10.toLocaleString()}/año.
            </p>
          </div>
        </section>

        {/* 4. Firma y Validez */}
        <section className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
            <PenLine className="w-5 h-5 text-indigo-500" />
            4. Firma
          </h2>
          <div className="flex gap-4 items-center bg-indigo-50 p-4 rounded border border-indigo-100">
            <input
              type="checkbox"
              className="w-5 h-5 text-indigo-600 rounded print:hidden"
              checked={!!signedAt}
              disabled={!proposalNumber || isSigning}
              onChange={(e) => handleSign(e.target.checked)}
            />
            <div className="text-indigo-900">
              <p className="font-medium">Firmo como Asesor Técnico Comercial de PELSA</p>
              {signedAt ? (
                <p className="text-sm">
                  Firmado el {new Date(signedAt).toLocaleDateString()} a las {new Date(signedAt).toLocaleTimeString()} — válida hasta el{' '}
                  {new Date(new Date(signedAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()} (30 días).
                </p>
              ) : (
                <p className="text-sm font-normal text-indigo-700">
                  {proposalNumber ? 'Al firmar, empiezan a contar los 30 días de validez.' : 'Guarda la propuesta primero para poder firmarla.'}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="pt-8 flex justify-between items-end border-t border-gray-300">
          <div>
            <p className="text-xs text-gray-500">Documento generado el {new Date().toLocaleDateString()}</p>
            <p className="text-xs text-gray-500">
              {signedAt
                ? `Válida hasta el ${new Date(new Date(signedAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`
                : 'Validez de la propuesta: 30 días desde la firma'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-700">Grupo PELSA</p>
            <p className="text-xs text-gray-500 mt-8 border-t border-gray-400 pt-1 inline-block w-48 text-center">Firma Asesor Técnico Comercial</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
