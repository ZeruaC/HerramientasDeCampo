import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface Proposal {
  id: string;
  proposal_number: string;
  client_name: string;
  sector?: string;
  outage_hours_per_week?: number;
  affected_lines?: number;
  cost_per_hour?: number;
  annual_loss?: number;
  recommended_family?: string;
  eternity_capex?: number;
  system_voltage?: number;
  selected_model?: string;
  autonomy_hours?: number;
  status: string;
  created_at: string;
}

export function useProposals() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateProposalNumber = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = now.getTime().toString().slice(-3); // Last 3 digits of timestamp
    return `PROP-${date}-${timestamp}`;
  };

  const saveProposal = async (clientName: string, data: Partial<Proposal>) => {
    if (!user) throw new Error('No authenticated user');

    setLoading(true);
    setError('');

    try {
      const proposal_number = generateProposalNumber();
      const { error: insertError } = await supabase.from('proposals').insert({
        user_id: user.id,
        proposal_number,
        client_name: clientName,
        status: 'draft',
        ...data,
      });

      if (insertError) throw insertError;
      return proposal_number;
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

  return { saveProposal, getProposals, updateProposal, loading, error };
}
