import { useState, useMemo, useEffect, Fragment, useRef } from 'react';
import html2pdf from 'html2pdf.js';

import { useStore } from '../store/useStore';
import { useCatalog } from '../hooks/useCatalog';
import { Presentation, Building, Battery, TrendingUp, ArrowRight, Download } from 'lucide-react';

export const H6 = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const {
    clientName, sector,
    outageHoursPerWeek, affectedLines, costPerHour, fixedCostPerIncident, incidentsPerWeek,
    recommendedFamily,
    eternityCapex, genericCapex, genericLife, genericMaint, genericInstall, eternityLife, eternityMaint, eternityInstall,
    systemVoltage, selectedModelH4, autonomyReqH4
  } = useStore();

  const { modelos, loading } = useCatalog();

  const handleExportPDF = () => {
    if (!contentRef.current) return;
    setIsExporting(true);

    const element = contentRef.current;
    const options: any = {
      margin: 10,
      filename: `Propuesta-${clientName || 'Cliente'}-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(options).from(element).save().finally(() => setIsExporting(false));
  };

  // Re-calculate H1
  const weeklyLoss = (outageHoursPerWeek * affectedLines * costPerHour) + (incidentsPerWeek * fixedCostPerIncident);
  const annualLoss = weeklyLoss * 52;
  const fiveYearLoss = annualLoss * 5;

  // Re-calculate H3 (10 years)
  const calcReplacements = (horizon: number, life: number) => Math.ceil(horizon / life) - 1;
  const genReplacements10 = calcReplacements(10, genericLife);
  const etReplacements10 = calcReplacements(10, eternityLife);
  const genTCO10 = (genericCapex * (1 + genReplacements10)) + (genericInstall * (1 + genReplacements10)) + (genericMaint * 10);
  const etTCO10 = (eternityCapex * (1 + etReplacements10)) + (eternityInstall * (1 + etReplacements10)) + (eternityMaint * 10);
  const savings10 = genTCO10 - etTCO10;
  const etCostPerYear10 = etTCO10 / 10;

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
            Propuesta de Solución de Continuidad
          </h1>
          <p className="text-gray-500 mt-2">
            Resumen ejecutivo para {clientName || 'Cliente'} — Confidencial
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md shadow-sm transition print:hidden"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Exportando...' : 'Exportar a PDF'}</span>
        </button>
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
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Ahorro vs Alternativa (10 años)</p>
              <p className="text-2xl font-black text-blue-700">${savings10.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white bg-opacity-60 p-4 rounded text-green-900 italic text-sm">
            <p>
              <strong>Resumen Ejecutivo:</strong> La inversión de ${eternityCapex.toLocaleString()} en la tecnología {recommendedFamily} se amortiza en tan solo {paybackMonths.toFixed(1)} meses al evitar las paradas actuales. Además, gracias a su mayor vida útil, reduce su Coste Total de Propiedad en ${savings10.toLocaleString()} a lo largo de 10 años comparado con tecnologías estándar, con un coste anualizado de solo ${etCostPerYear10.toLocaleString()}/año.
            </p>
          </div>
        </section>

        {/* 4. Siguientes Pasos */}
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
};
