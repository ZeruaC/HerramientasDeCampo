// Mapeo de subfamilia Eternity -> ficha técnica (PDF oficial del fabricante).
// Fuente: PDFs originales en Catalogo Eternity/ (ver INDEX.md).

const pdfMappings: Record<string, string> = {
  'Larga Duración': '/pdfs/subfamilias/MOTIVE-LONG-LIFE-FAMILY-BROCHURE-SPANISH-lo-res-17.06.26.pdf',
  'Bajo Mantenimiento': '/pdfs/subfamilias/MOTIVE-LOW-MAINTENANCE-FAMILY-BROCHURE-SPANISH-lo-res-21.01.26.pdf',
  'PzV Bajo Mantenimiento': '/pdfs/subfamilias/MAINTENANCE-FREE-PZV-FAMILY-BROCHURE-SPANISH-lo-res-06.03.25.pdf',
  'Minería': '/pdfs/subfamilias/MINING-FAMILY-BROCHURE-SPANISH-24.01.23-lo-res.pdf',
  'QUASAR Estándar': '/pdfs/subfamilias/Quasar-main-brochure-SPANISH-lo-res-11.02.26.pdf',
  'QUASAR VRLA': '/pdfs/subfamilias/Quasar-VRLA-main-brochure-Spanish-lo-res-17.06.25.pdf',
  'QUASAR Flooded Bloc': '/pdfs/subfamilias/QUASAR-MOTIVE-FLOODED-BLOC-BROCHURE-ALL-RANGES-SPANISH-lo-res-28.07.25.pdf',
  'QUASAR Gel Bloc': '/pdfs/subfamilias/QUASAR-CARBON-NANO-GEL-BLOC-SPANISH-BROCHURE-16.01.26.pdf',
  'Gel Leisure Bloc': '/pdfs/subfamilias/MOTIVE-GEL-LEISURE-BLOC-FAMILY-BROCHURE-SPANISH-lo-res-10.06.25.pdf',
  'Gel Semi-Tracción Bloc': '/pdfs/subfamilias/MOTIVE-GEL-SEMI-TRACTION-BLOC-FAMILY-BROCHURE-SPANISH-lo-res-10.06.25.pdf',
  'Gel Solar Bloc': '/pdfs/subfamilias/NP-GEL-SOLAR-BLOC-BATTERY-FAMILY-BROCHURE-SPANISH-lo-res-10.06.25.pdf',
  'OGi Bloc': '/pdfs/subfamilias/NP-OGi-BLOC-BATTERY-FAMILY-BROCHURE-SPANISH-lo-res-06.05.25.pdf',
  'OPzV Standby': '/pdfs/subfamilias/OPZV-STANDBY-MAIN-BROCHURE-SPANISH-lo-res-17.07.25.pdf',
  'OPzV Solar': '/pdfs/subfamilias/OPZV-SOLAR-BATTERY-BROCHURE-SPANISH-lo-res-29.05.25.pdf',
  'OPzS Standby': '/pdfs/subfamilias/Network-OPzS-Standby-with-OPzS-Bloc-Battery-Main-Brochure-Spanish-10.07.24-lo-res.pdf',
  'OPzS Solar': '/pdfs/subfamilias/OPZS-SOLAR-BATTERY-BROCHURE-SPANISH-10.07.24-lo-res.pdf',
};

export function hasPDF(subfamilia: string): boolean {
  return subfamilia in pdfMappings;
}

export function getPDFPath(subfamilia: string): string | null {
  return pdfMappings[subfamilia] || null;
}
