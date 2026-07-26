import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FilePlus } from 'lucide-react';
import { useProposals, type Proposal } from '../hooks/useProposals';
import { useStore } from '../store/useStore';

export const ProposalSearch = () => {
  const navigate = useNavigate();
  const { getProposals, loading } = useProposals();
  const store = useStore();

  const [clientFilter, setClientFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [results, setResults] = useState<Proposal[] | null>(null);

  const handleSearch = async () => {
    const all = await getProposals();
    const filtered = all.filter((p) => {
      if (clientFilter && !p.client_name.toLowerCase().includes(clientFilter.toLowerCase())) return false;
      const created = p.created_at.slice(0, 10);
      if (dateFrom && created < dateFrom) return false;
      if (dateTo && created > dateTo) return false;
      return true;
    });
    setResults(filtered);
  };

  const handleOpen = (p: Proposal) => {
    store.setCurrentProposalNumber(p.proposal_number);
    store.setClientName(p.client_name);
    store.setSector(p.sector || '');
    store.setContactPerson(p.contact_person || '');
    store.setPhoneNumber(p.phone_number || '');
    store.setLocation(p.location || '');
    useStore.setState({ audit: p.audit_data || {} });
    store.setOutagesPerYear(p.outages_per_year || 0);
    store.setDurationHours(p.duration_hours || 0);
    store.setCostPerHour(p.cost_per_hour || 0);
    store.setRecommendedFamily(p.recommended_family || '');
    store.setSelectedFamilyH4(p.selected_family_h4 || p.recommended_family || '');
    store.setSelectedModelH4(p.selected_model || '');
    store.setSystemVoltage(p.system_voltage || 48);
    store.setAutonomyReqH4(p.autonomy_hours || 0);
    store.setEternityCapex(p.eternity_capex || 0);
    store.setEternityLife(p.eternity_life || 0);
    store.setEternityMaint(p.eternity_maint || 0);
    store.setEternityInstall(p.eternity_install || 0);
    store.setGenericCapex(p.generic_capex || 0);
    store.setGenericLife(p.generic_life || 0);
    store.setGenericMaint(p.generic_maint || 0);
    store.setGenericInstall(p.generic_install || 0);
    store.setLoadPowerW(p.load_power_w || 0);
    store.setMinTempH4(p.min_temp_h4 || 25);
    store.setMaxDod(p.max_dod || 0.8);
    store.setInverterEfficiency(p.inverter_efficiency || 0.9);
    navigate('/h5');
  };

  const handleNew = () => {
    store.setCurrentProposalNumber('');
    navigate('/checklist');
  };

  return (
    <div className="p-3 border-t border-slate-700 space-y-2">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Buscar Propuestas</p>
        <button
          onClick={handleNew}
          title="Nueva propuesta"
          className="text-slate-400 hover:text-green-400 transition-colors"
        >
          <FilePlus className="w-4 h-4" />
        </button>
      </div>
      <input
        type="text"
        placeholder="Cliente..."
        value={clientFilter}
        onChange={(e) => setClientFilter(e.target.value)}
        className="w-full text-sm rounded-md bg-slate-800 border border-slate-600 text-slate-200 placeholder-slate-500 px-2 py-1.5 focus:outline-none focus:border-green-500"
      />
      <div className="flex gap-1">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          title="Desde"
          className="w-1/2 text-xs rounded-md bg-slate-800 border border-slate-600 text-slate-300 px-1 py-1 focus:outline-none focus:border-green-500"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          title="Hasta"
          className="w-1/2 text-xs rounded-md bg-slate-800 border border-slate-600 text-slate-300 px-1 py-1 focus:outline-none focus:border-green-500"
        />
      </div>
      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full flex items-center justify-center gap-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-slate-200 py-1.5 rounded-md transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
      {results && (
        <div className="max-h-40 overflow-y-auto space-y-1">
          {results.length === 0 ? (
            <p className="text-xs text-slate-500 px-1 py-1">Sin resultados</p>
          ) : (
            results.map((p) => (
              <button
                key={p.id}
                onClick={() => handleOpen(p)}
                className="w-full text-left text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md px-2 py-1.5 transition-colors"
              >
                <div className="font-medium truncate">{p.client_name}</div>
                <div className="text-slate-500">
                  {p.proposal_number} · {new Date(p.created_at).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
