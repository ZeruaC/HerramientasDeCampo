import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
    loadProductsFromSupabase();
  }, []);

  const loadProductsFromSupabase = async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('products')
        .select('model_name, familia, subfamilia, specifications')
        .order('subfamilia', { ascending: true });

      if (dbError) throw dbError;

      if (!data || data.length === 0) {
        setError('No products found in database');
        setLoading(false);
        return;
      }

      // Transform database rows to Modelo format
      const allModelos: Modelo[] = data.map((product: any) => ({
        familia: product.familia,
        subfamilia: product.subfamilia,
        modelo: product.model_name,
        especificaciones: product.specifications?.especificaciones || {},
        capacidades_crate: product.specifications?.capacidades_crate,
        ciclos: product.specifications?.ciclos,
        estado: product.specifications?.estado
      }));

      // Build familias structure from modelos
      const familiasObj: { [key: string]: Familia } = {};

      allModelos.forEach((modelo) => {
        if (!familiasObj[modelo.familia]) {
          familiasObj[modelo.familia] = {
            nombre: modelo.familia,
            subfamilias: {}
          };
        }

        if (!familiasObj[modelo.familia].subfamilias[modelo.subfamilia]) {
          familiasObj[modelo.familia].subfamilias[modelo.subfamilia] = {
            nombre: modelo.subfamilia,
            total_modelos: 0,
            modelos: []
          };
        }

        familiasObj[modelo.familia].subfamilias[modelo.subfamilia].modelos.push(modelo);
        familiasObj[modelo.familia].subfamilias[modelo.subfamilia].total_modelos++;
      });

      setModelos(allModelos);
      setFamilias(familiasObj);
      setLoading(false);
    } catch (err: any) {
      console.error('Error loading products from Supabase:', err);
      setError(err.message || 'Error loading products');
      setLoading(false);
    }
  };

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
