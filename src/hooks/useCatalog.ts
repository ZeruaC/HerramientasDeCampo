import { useEffect, useState } from 'react';

export interface Modelo {
  familia: string;
  subfamilia: string;
  modelo: string;
  especificaciones?: {
    peso_kg?: number;
    voltaje_v?: number;
    capacidad_nominal_ah?: number;
    resistencia_interna_ohm?: number;
    corriente_corto_circuito_a?: number;
    dimensiones_mm?: {
      longitud: number;
      ancho: number;
      altura_h1: number;
      altura_h2: number;
    };
  };
  capacidades_crate?: {
    c10: number;
    c12: number;
    c20: number;
    c24: number;
    c48: number;
    c72: number;
    c100: number;
    c120: number;
    c240?: number;
  };
  ciclos?: {
    temp_referencia: string;
    valores: {
      [key: string]: { iu: number; iui: number };
    };
  };
  estado?: string;
}

export interface Subfamilia {
  nombre: string;
  total_modelos: number;
  modelos_enriquecidos?: number;
  modelos: Modelo[];
}

export interface Familia {
  nombre: string;
  subfamilias: { [key: string]: Subfamilia };
}

export const useCatalog = () => {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [familias, setFamilias] = useState<{ [key: string]: Familia }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/ETERNITY_CATALOGO_FINAL.json')
      .then(res => res.json())
      .then(data => {
        // Extraer familias
        const catalogo = data.catalogo_eternity_completo;
        setFamilias(catalogo.familias);

        // Extraer todos los modelos en array plano
        const allModelos: Modelo[] = [];
        Object.values(catalogo.familias).forEach((familia: Familia) => {
          Object.values(familia.subfamilias).forEach((subfamilia: Subfamilia) => {
            allModelos.push(...subfamilia.modelos);
          });
        });
        setModelos(allModelos);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Métodos útiles
  const getSubfamiliasByFamilia = (familia: string): string[] => {
    return Object.keys(familias[familia]?.subfamilias || {});
  };

  const getModelosBySubfamilia = (familia: string, subfamilia: string): Modelo[] => {
    return familias[familia]?.subfamilias[subfamilia]?.modelos || [];
  };

  const searchModelos = (query: string): Modelo[] => {
    return modelos.filter(m =>
      m.modelo.toLowerCase().includes(query.toLowerCase()) ||
      m.subfamilia.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    modelos,
    familias,
    loading,
    error,
    getSubfamiliasByFamilia,
    getModelosBySubfamilia,
    searchModelos,
  };
};
