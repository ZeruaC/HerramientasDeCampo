import { create } from 'zustand';

export interface AuditData {
  // Inspección visual
  sulfatacion: boolean;
  corrosion: boolean;
  hinchazon: boolean;
  fugas: boolean;
  cablesBornes: 'bueno' | 'corrosion' | 'desgaste' | 'suelto';
  bancada: 'buena' | 'oxidada' | 'inestable';
  ventilacion: 'adecuada' | 'insuficiente' | 'sinVentilacion';
  temperaturaAmbiente: number;
  limpieza: 'buena' | 'regular' | 'mala';

  // Datos técnicos actuales
  marca: string;
  modelo: string;
  tecnologia: string;
  voltajeSistema: number;
  capacidadAh: number;
  cRate: string;
  numeroElementos: number;
  anosServicio: number;
  uso: 'Standby/Flotación (UPS)' | 'Ciclado Diario (Solar)' | 'Tracción / Carga Oportunidad';
  mantenimientoDisponible: 'Sí' | 'No';
  espacioDisponible: 'Amplio' | 'Reducido' | 'Muy reducido';

  // Problemas detectados
  cortesFrecuentes: boolean;
  finDeVida: boolean;
  mantenimientoCostoso: boolean;
  faltaVentilacion: boolean;
  espacioInsuficiente: boolean;
  otrosProblemas: string;
}

interface StoreState {
  // Navigation / proposal mode
  currentProposalNumber: string;
  setCurrentProposalNumber: (num: string) => void;
  proposalMode: 'edit' | 'view';
  setProposalMode: (mode: 'edit' | 'view') => void;

  // Audit Data
  audit: AuditData;
  setAudit: (audit: Partial<AuditData>) => void;
  resetAudit: () => void;

  // H1 Data & Checklist
  clientName: string;
  setClientName: (name: string) => void;
  sector: string;
  setSector: (sector: string) => void;
  contactPerson: string;
  setContactPerson: (person: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  location: string;
  setLocation: (location: string) => void;
  outageHoursPerWeek: number;
  setOutageHoursPerWeek: (hours: number) => void;
  affectedLines: number;
  setAffectedLines: (lines: number) => void;
  costPerHour: number;
  setCostPerHour: (cost: number) => void;
  fixedCostPerIncident: number;
  setFixedCostPerIncident: (cost: number) => void;
  incidentsPerWeek: number;
  setIncidentsPerWeek: (incidents: number) => void;

  // H2 Data
  maxTemp: string;
  setMaxTemp: (temp: string) => void;
  autonomyReqH2: string;
  setAutonomyReqH2: (autonomy: string) => void;
  maintenanceAvailable: string;
  setMaintenanceAvailable: (maint: string) => void;
  operationType: string;
  setOperationType: (op: string) => void;
  availableSpace: string;
  setAvailableSpace: (space: string) => void;
  recommendedFamily: string;
  setRecommendedFamily: (family: string) => void;
  selectedSubfamily: string;
  setSelectedSubfamily: (subfamily: string) => void;

  // H3 Data (Dimensionador - was H4)
  loadPowerW: number;
  setLoadPowerW: (power: number) => void;
  autonomyReqH4: number;
  setAutonomyReqH4: (autonomy: number) => void;
  systemVoltage: number;
  setSystemVoltage: (voltage: number) => void;
  minTempH4: number;
  setMinTempH4: (temp: number) => void;
  selectedFamilyH4: string;
  setSelectedFamilyH4: (family: string) => void;
  maxDod: number;
  setMaxDod: (dod: number) => void;
  inverterEfficiency: number;
  setInverterEfficiency: (eff: number) => void;
  selectedModelH4: string;
  setSelectedModelH4: (model: string) => void;

  // H4 Data (TCO - was H3)
  genericCapex: number;
  setGenericCapex: (capex: number) => void;
  genericLife: number;
  setGenericLife: (life: number) => void;
  genericMaint: number;
  setGenericMaint: (maint: number) => void;
  genericInstall: number;
  setGenericInstall: (install: number) => void;

  eternityCapex: number;
  setEternityCapex: (capex: number) => void;
  eternityLife: number;
  setEternityLife: (life: number) => void;
  eternityMaint: number;
  setEternityMaint: (maint: number) => void;
  eternityInstall: number;
  setEternityInstall: (install: number) => void;
}

const defaultAudit: AuditData = {
  sulfatacion: false,
  corrosion: false,
  hinchazon: false,
  fugas: false,
  cablesBornes: 'bueno',
  bancada: 'buena',
  ventilacion: 'adecuada',
  temperaturaAmbiente: 25,
  limpieza: 'buena',

  marca: '',
  modelo: '',
  tecnologia: '',
  voltajeSistema: 48,
  capacidadAh: 0,
  cRate: 'C10',
  numeroElementos: 0,
  anosServicio: 0,
  uso: 'Standby/Flotación (UPS)',
  mantenimientoDisponible: 'No',
  espacioDisponible: 'Reducido',

  cortesFrecuentes: false,
  finDeVida: false,
  mantenimientoCostoso: false,
  faltaVentilacion: false,
  espacioInsuficiente: false,
  otrosProblemas: '',
};

export const useStore = create<StoreState>((set) => ({
  // Navigation
  currentProposalNumber: '',
  setCurrentProposalNumber: (num) => set({ currentProposalNumber: num }),
  proposalMode: 'edit',
  setProposalMode: (mode) => set({ proposalMode: mode }),

  // Audit
  audit: defaultAudit,
  setAudit: (audit) => set((state) => ({ audit: { ...state.audit, ...audit } })),
  resetAudit: () => set({ audit: defaultAudit }),

  // H1 & Checklist
  clientName: '',
  setClientName: (name) => set({ clientName: name }),
  sector: '',
  setSector: (sector) => set({ sector }),
  contactPerson: '',
  setContactPerson: (person) => set({ contactPerson: person }),
  phoneNumber: '',
  setPhoneNumber: (phone) => set({ phoneNumber: phone }),
  location: '',
  setLocation: (location) => set({ location }),
  outageHoursPerWeek: 0,
  setOutageHoursPerWeek: (hours) => set({ outageHoursPerWeek: hours }),
  affectedLines: 0,
  setAffectedLines: (lines) => set({ affectedLines: lines }),
  costPerHour: 0,
  setCostPerHour: (cost) => set({ costPerHour: cost }),
  fixedCostPerIncident: 0,
  setFixedCostPerIncident: (cost) => set({ fixedCostPerIncident: cost }),
  incidentsPerWeek: 0,
  setIncidentsPerWeek: (incidents) => set({ incidentsPerWeek: incidents }),

  // H2
  maxTemp: '25-35°C',
  setMaxTemp: (temp) => set({ maxTemp: temp }),
  autonomyReqH2: '>8 h',
  setAutonomyReqH2: (autonomy) => set({ autonomyReqH2: autonomy }),
  maintenanceAvailable: 'No',
  setMaintenanceAvailable: (maint) => set({ maintenanceAvailable: maint }),
  operationType: 'Standby/Flotación (UPS)',
  setOperationType: (op) => set({ operationType: op }),
  availableSpace: 'Reducido o sin ventilación',
  setAvailableSpace: (space) => set({ availableSpace: space }),
  recommendedFamily: '',
  setRecommendedFamily: (family) => set({ recommendedFamily: family }),
  selectedSubfamily: '',
  setSelectedSubfamily: (subfamily) => set({ selectedSubfamily: subfamily }),

  // H3 (Dimensionador)
  loadPowerW: 3000,
  setLoadPowerW: (power) => set({ loadPowerW: power }),
  autonomyReqH4: 8,
  setAutonomyReqH4: (autonomy) => set({ autonomyReqH4: autonomy }),
  systemVoltage: 48,
  setSystemVoltage: (voltage) => set({ systemVoltage: voltage }),
  minTempH4: 25,
  setMinTempH4: (temp) => set({ minTempH4: temp }),
  selectedFamilyH4: 'OPzV Standby',
  setSelectedFamilyH4: (family) => set({ selectedFamilyH4: family }),
  maxDod: 0.8,
  setMaxDod: (dod) => set({ maxDod: dod }),
  inverterEfficiency: 0.9,
  setInverterEfficiency: (eff) => set({ inverterEfficiency: eff }),
  selectedModelH4: '',
  setSelectedModelH4: (model) => set({ selectedModelH4: model }),

  // H4 (TCO)
  genericCapex: 0,
  setGenericCapex: (capex) => set({ genericCapex: capex }),
  genericLife: 0,
  setGenericLife: (life) => set({ genericLife: life }),
  genericMaint: 0,
  setGenericMaint: (maint) => set({ genericMaint: maint }),
  genericInstall: 0,
  setGenericInstall: (install) => set({ genericInstall: install }),

  eternityCapex: 0,
  setEternityCapex: (capex) => set({ eternityCapex: capex }),
  eternityLife: 0,
  setEternityLife: (life) => set({ eternityLife: life }),
  eternityMaint: 0,
  setEternityMaint: (maint) => set({ eternityMaint: maint }),
  eternityInstall: 0,
  setEternityInstall: (install) => set({ eternityInstall: install }),
}));
