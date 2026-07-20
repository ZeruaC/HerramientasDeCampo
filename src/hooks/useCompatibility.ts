import { useEffect, useState } from 'react';

export interface CompatibilityRule {
  nombre: string;
  usos_validos: string[];
  temp_min: number;
  temp_max: number;
  requiere_mantenimiento: boolean;
  tipo_mantenimiento: string;
  espacio_minimo_mm: number;
  autonomia_recomendada: string;
  nota: string;
}

export interface CompatibilityMatrix {
  compatibility_rules: {
    [familia: string]: {
      [subfamilia: string]: CompatibilityRule;
    };
  };
  condiciones_cliente_mapping: any;
}

export const useCompatibility = () => {
  const [matrix, setMatrix] = useState<CompatibilityMatrix | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/COMPATIBILITY_MATRIX.json')
      .then(res => res.json())
      .then(data => {
        setMatrix(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filtrar subfamilias válidas según condiciones del cliente
  const getValidSubfamilies = (
    maxTemp: string,
    maintenanceAvailable: string,
    operationType: string
  ): string[] => {
    if (!matrix) return [];

    // Obtener subfamilias permitidas por cada condición
    const tempMapping = matrix.condiciones_cliente_mapping?.temperatura?.[maxTemp];
    const maintMapping = matrix.condiciones_cliente_mapping?.mantenimiento?.[maintenanceAvailable];
    const opTypeMapping = matrix.condiciones_cliente_mapping?.operacion?.[operationType];

    // Iniciar con subfamilias por temperatura
    let valid = new Set<string>(tempMapping?.favorece || []);

    // Intersectar con mantenimiento
    if (maintMapping?.permite) {
      const filtered = new Set<string>();
      valid.forEach(subfam => {
        if (maintMapping.permite.includes(subfam)) {
          filtered.add(subfam);
        }
      });
      valid = filtered;
    }

    // Intersectar con operación
    if (opTypeMapping?.permite) {
      const filtered = new Set<string>();
      valid.forEach(subfam => {
        if (opTypeMapping.permite.includes(subfam)) {
          filtered.add(subfam);
        }
      });
      valid = filtered;
    }

    return Array.from(valid).sort();
  };

  // Obtener detalles de una subfamilia
  const getSubfamilyDetails = (subfamiliaName: string): CompatibilityRule | null => {
    if (!matrix) return null;

    for (const familia of Object.values(matrix.compatibility_rules)) {
      if (familia[subfamiliaName as keyof typeof familia]) {
        return familia[subfamiliaName as keyof typeof familia];
      }
    }
    return null;
  };

  return {
    matrix,
    loading,
    error,
    getValidSubfamilies,
    getSubfamilyDetails,
  };
};
