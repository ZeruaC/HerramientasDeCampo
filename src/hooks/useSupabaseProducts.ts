import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Product {
  id: string;
  model_name: string;
  familia: string;
  subfamilia: string;
  voltage_v: number;
  capacity_ah: number;
  weight_kg: number;
  cycles_at_80pct_dod: number;
  floating_life_years: number;
  maintenance_required: boolean;
  specifications: Record<string, any>;
}

export function useSupabaseProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('subfamilia', { ascending: true });

      if (fetchError) throw fetchError;
      setProducts((data as Product[]) || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSubfamiliasByFamilia = (familia: string) => {
    return [...new Set(products.filter(p => p.familia === familia).map(p => p.subfamilia))];
  };

  const getModelosBySubfamilia = (subfamilia: string) => {
    return products.filter(p => p.subfamilia === subfamilia);
  };

  const searchProducts = (query: string) => {
    return products.filter(p =>
      p.model_name.toLowerCase().includes(query.toLowerCase()) ||
      p.subfamilia.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    products,
    loading,
    error,
    getSubfamiliasByFamilia,
    getModelosBySubfamilia,
    searchProducts,
    reload: loadProducts,
  };
}
