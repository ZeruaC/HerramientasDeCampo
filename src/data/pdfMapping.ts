/**
 * Mapeo de subfamilias Eternity a archivos PDF
 * Fuente: Catálogo Eternity oficial
 */

export interface PDFMapping {
  subfamilia: string;
  pdfFile: string;
  pdfPath: string; // Ruta pública
}

export const pdfMappings: Record<string, PDFMapping> = {
  'Larga Duración': {
    subfamilia: 'Larga Duración',
    pdfFile: 'MOTIVE-LONG-LIFE-FAMILY-BROCHURE-SPANISH-lo-res-17.06.26.pdf',
    pdfPath: '/pdfs/subfamilias/MOTIVE-LONG-LIFE-FAMILY-BROCHURE-SPANISH-lo-res-17.06.26.pdf'
  },

  'Bajo Mantenimiento': {
    subfamilia: 'Bajo Mantenimiento',
    pdfFile: 'MOTIVE-LOW-MAINTENANCE-FAMILY-BROCHURE-SPANISH-lo-res-21.01.26.pdf',
    pdfPath: '/pdfs/subfamilias/MOTIVE-LOW-MAINTENANCE-FAMILY-BROCHURE-SPANISH-lo-res-21.01.26.pdf'
  },

  'OPzV Standby': {
    subfamilia: 'OPzV Standby',
    pdfFile: 'OPZV-STANDBY-MAIN-BROCHURE-SPANISH-lo-res-17.07.25.pdf',
    pdfPath: '/pdfs/subfamilias/OPZV-STANDBY-MAIN-BROCHURE-SPANISH-lo-res-17.07.25.pdf'
  },

  'OPzV Solar': {
    subfamilia: 'OPzV Solar',
    pdfFile: 'OPZV-SOLAR-BATTERY-BROCHURE-SPANISH-lo-res-29.05.25.pdf',
    pdfPath: '/pdfs/subfamilias/OPZV-SOLAR-BATTERY-BROCHURE-SPANISH-lo-res-29.05.25.pdf'
  },

  'OPzS Standby': {
    subfamilia: 'OPzS Standby',
    pdfFile: 'Network-OPzS-Standby-with-OPzS-Bloc-Battery-Main-Brochure-Spanish-10.07.24-lo-res.pdf',
    pdfPath: '/pdfs/subfamilias/Network-OPzS-Standby-with-OPzS-Bloc-Battery-Main-Brochure-Spanish-10.07.24-lo-res.pdf'
  },

  'OPzS Solar': {
    subfamilia: 'OPzS Solar',
    pdfFile: 'OPZS-SOLAR-BATTERY-BROCHURE-SPANISH-10.07.24-lo-res.pdf',
    pdfPath: '/pdfs/subfamilias/OPZS-SOLAR-BATTERY-BROCHURE-SPANISH-10.07.24-lo-res.pdf'
  },

  'QUASAR Estándar': {
    subfamilia: 'QUASAR Estándar',
    pdfFile: 'QUASAR-MOTIVE-FLOODED-BLOC-BROCHURE-ALL-RANGES-SPANISH-lo-res-28.07.25.pdf',
    pdfPath: '/pdfs/subfamilias/QUASAR-MOTIVE-FLOODED-BLOC-BROCHURE-ALL-RANGES-SPANISH-lo-res-28.07.25.pdf'
  },

  'QUASAR Gel Bloc': {
    subfamilia: 'QUASAR Gel Bloc',
    pdfFile: 'QUASAR-CARBON-NANO-GEL-BLOC-SPANISH-BROCHURE-16.01.26.pdf',
    pdfPath: '/pdfs/subfamilias/QUASAR-CARBON-NANO-GEL-BLOC-SPANISH-BROCHURE-16.01.26.pdf'
  },

  'QUASAR VRLA': {
    subfamilia: 'QUASAR VRLA',
    pdfFile: 'Quasar-VRLA-main-brochure-Spanish-lo-res-17.06.25.pdf',
    pdfPath: '/pdfs/subfamilias/Quasar-VRLA-main-brochure-Spanish-lo-res-17.06.25.pdf'
  },

  'QUASAR Flooded Bloc': {
    subfamilia: 'QUASAR Flooded Bloc',
    pdfFile: 'QUASAR-MOTIVE-FLOODED-BLOC-BROCHURE-ALL-RANGES-SPANISH-lo-res-28.07.25.pdf',
    pdfPath: '/pdfs/subfamilias/QUASAR-MOTIVE-FLOODED-BLOC-BROCHURE-ALL-RANGES-SPANISH-lo-res-28.07.25.pdf'
  },

  'Gel Leisure Bloc': {
    subfamilia: 'Gel Leisure Bloc',
    pdfFile: 'MOTIVE-GEL-LEISURE-BLOC-FAMILY-BROCHURE-SPANISH-lo-res-10.06.25.pdf',
    pdfPath: '/pdfs/subfamilias/MOTIVE-GEL-LEISURE-BLOC-FAMILY-BROCHURE-SPANISH-lo-res-10.06.25.pdf'
  },

  'Gel Solar Bloc': {
    subfamilia: 'Gel Solar Bloc',
    pdfFile: 'NP-GEL-SOLAR-BLOC-BATTERY-FAMILY-BROCHURE-SPANISH-lo-res-10.06.25.pdf',
    pdfPath: '/pdfs/subfamilias/NP-GEL-SOLAR-BLOC-BATTERY-FAMILY-BROCHURE-SPANISH-lo-res-10.06.25.pdf'
  },

  'Gel Semi-Tracción Bloc': {
    subfamilia: 'Gel Semi-Tracción Bloc',
    pdfFile: 'MOTIVE-GEL-SEMI-TRACTION-BLOC-FAMILY-BROCHURE-SPANISH-lo-res-10.06.25.pdf',
    pdfPath: '/pdfs/subfamilias/MOTIVE-GEL-SEMI-TRACTION-BLOC-FAMILY-BROCHURE-SPANISH-lo-res-10.06.25.pdf'
  },

  'OGi Bloc': {
    subfamilia: 'OGi Bloc',
    pdfFile: 'NP-OGi-BLOC-BATTERY-FAMILY-BROCHURE-SPANISH-lo-res-06.05.25.pdf',
    pdfPath: '/pdfs/subfamilias/NP-OGi-BLOC-BATTERY-FAMILY-BROCHURE-SPANISH-lo-res-06.05.25.pdf'
  },

  'Minería': {
    subfamilia: 'Minería',
    pdfFile: 'MINING-FAMILY-BROCHURE-SPANISH-24.01.23-lo-res.pdf',
    pdfPath: '/pdfs/subfamilias/MINING-FAMILY-BROCHURE-SPANISH-24.01.23-lo-res.pdf'
  },

  'PzV Bajo Mantenimiento': {
    subfamilia: 'PzV Bajo Mantenimiento',
    pdfFile: 'MAINTENANCE-FREE-PZV-FAMILY-BROCHURE-SPANISH-lo-res-06.03.25.pdf',
    pdfPath: '/pdfs/subfamilias/MAINTENANCE-FREE-PZV-FAMILY-BROCHURE-SPANISH-lo-res-06.03.25.pdf'
  }
};

/**
 * Obtener PDF de una subfamilia
 */
export function getPDFPath(subfamilia: string): string | null {
  const mapping = pdfMappings[subfamilia];
  return mapping ? mapping.pdfPath : null;
}

/**
 * Verificar si existe PDF para una subfamilia
 */
export function hasPDF(subfamilia: string): boolean {
  return subfamilia in pdfMappings;
}
