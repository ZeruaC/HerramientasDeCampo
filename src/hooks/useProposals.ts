import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface Proposal {
  id: string;
  proposal_number: string;
  client_name: string;
  sector?: string;
  contact_person?: string;
  phone_number?: string;
  location?: string;
  audit_data?: Record<string, any>;
  max_temp?: string;
  autonomy_req_h2?: string;
  maintenance_available?: string;
  operation_type?: string;
  available_space?: string;
  outages_per_year?: number;
  duration_hours?: number;
  cost_per_hour?: number;
  annual_loss?: number;
  recommended_family?: string;
  selected_family_h4?: string;
  eternity_capex?: number;
  system_voltage?: number;
  selected_model?: string;
  autonomy_hours?: number;
  generic_capex?: number;
  generic_life?: number;
  generic_maint?: number;
  generic_install?: number;
  eternity_life?: number;
  eternity_maint?: number;
  eternity_install?: number;
  load_power_w?: number;
  min_temp_h4?: number;
  max_dod?: number;
  inverter_efficiency?: number;
  status: string;
  created_at: string;
  signed_at?: string;
  checklist_data?: Record<string, any>;
}

export function useProposals() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // El número de propuesta (OF-1027, OF-1028, ...) lo asigna la base de
  // datos mediante una SEQUENCE (ver migración 006): es atómico y único por
  // construcción, no hace falta generarlo ni reintentar en el cliente.
  const saveProposal = async (clientName: string, data: Partial<Proposal>) => {
    if (!user) throw new Error('No authenticated user');

    setLoading(true);
    setError('');

    try {
      const { data: inserted, error: insertError } = await supabase
        .from('proposals')
        .insert({
          user_id: user.id,
          client_name: clientName,
          status: 'draft',
          ...data,
        })
        .select('proposal_number')
        .single();

      if (insertError) throw insertError;
      return inserted.proposal_number as string;
    } catch (err: any) {
      const message = err.message || 'Error saving proposal';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProposals = async () => {
    if (!user) return [];

    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('proposals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      return (data as Proposal[]) || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getProposalByNumber = async (proposalNumber: string) => {
    if (!user) return null;

    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('proposals')
        .select('*')
        .eq('proposal_number', proposalNumber)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;
      return data as Proposal;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProposal = async (proposalId: string, updates: Partial<Proposal>) => {
    if (!user) throw new Error('No authenticated user');

    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('proposals')
        .update(updates)
        .eq('id', proposalId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProposalByNumber = async (proposalNumber: string, updates: Partial<Proposal>) => {
    if (!user) throw new Error('No authenticated user');

    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('proposals')
        .update(updates)
        .eq('proposal_number', proposalNumber)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { saveProposal, getProposals, getProposalByNumber, updateProposal, updateProposalByNumber, loading, error };
}
