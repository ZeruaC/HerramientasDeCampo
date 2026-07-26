import { create } from 'zustand';

export interface AuditData {
  marca?: string;
  modelo?: string;
  tecnologia?: string;
  voltajeSistema?: number;
  capacidadAh?: number;
  cRate?: string;
  numeroElementos?: number;
  anosServicio?: number;
  uso?: string;
  mantenimientoDisponible?: string;
  espacioDisponible?: string;
  cortesFrecuentes?: boolean;
  finDeVida?: boolean;
  mantenimientoCostoso?: boolean;
  faltaVentilacion?: boolean;
  espacioInsuficiente?: boolean;
  otrosProblemas?: string;
}

interface StoreState {
  // Checklist data
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

  // Audit data
  audit: AuditData;
  setAudit: (audit: Partial<AuditData>) => void;

  // H1 Data (Dolor del Cliente)
  outagesPerYear: number;
  setOutagesPerYear: (outages: number) => void;
  durationHours: number;
  setDurationHours: (hours: number) => void;
  costPerHour: number;
  setCostPerHour: (cost: number) => void;

  outageHoursPerWeek: number;
  setOutageHoursPerWeek: (hours: number) => void;
  affectedLines: number;
  setAffectedLines: (lines: number) => void;
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

  // H3 Data
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

  // H4 Data
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
}

export const useStore = create<StoreState>((set) => ({
  // Checklist
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

  // Audit
  audit: {},
  setAudit: (audit) => set((state) => ({ audit: { ...state.audit, ...audit } })),

  // H1
  outagesPerYear: 0,
  setOutagesPerYear: (outages) => set({ outagesPerYear: outages }),
  durationHours: 0,
  setDurationHours: (hours) => set({ durationHours: hours }),
  costPerHour: 0,
  setCostPerHour: (cost) => set({ costPerHour: cost }),

  outageHoursPerWeek: 0,
  setOutageHoursPerWeek: (hours) => set({ outageHoursPerWeek: hours }),
  affectedLines: 0,
  setAffectedLines: (lines) => set({ affectedLines: lines }),
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

  // H3
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

  // H4
  loadPowerW: 0,
  setLoadPowerW: (power) => set({ loadPowerW: power }),
  autonomyReqH4: 0,
  setAutonomyReqH4: (autonomy) => set({ autonomyReqH4: autonomy }),
  systemVoltage: 48,
  setSystemVoltage: (voltage) => set({ systemVoltage: voltage }),
  // 25°C = "sin derateo" por defecto, no 0: un site real puede estar a 0°C,
  // así que 0 no sirve como "todavía sin rellenar" para este campo.
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
}));
