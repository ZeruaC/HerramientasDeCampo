import { useState, useMemo } from 'react';

import { useCatalog } from '../hooks/useCatalog';
import { Search } from 'lucide-react';

export const Catalogo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('Todas');

  const { modelos, loading, error } = useCatalog();

  const familias = useMemo(() => {
    const uniqueFamilias = Array.from(new Set(modelos.map(p => p.familia || '')));
    return ['Todas', ...uniqueFamilias.filter(f => f).sort()];
  }, [modelos]);

  const filteredCatalogo = useMemo(() => {
    return modelos.filter((modelo: any) => {
      const matchesSearch = modelo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (modelo.subfamilia || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFamily = selectedFamily === 'Todas' || modelo.familia === selectedFamily;

      return matchesSearch && matchesFamily;
    });
  }, [modelos, searchTerm, selectedFamily]);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Catálogo de Productos Eternity</h1>
        <p className="text-gray-600">Cargando catálogo...</p>
      </div>
    );
  }

  if (error || modelos.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Catálogo de Productos Eternity</h1>
        <div className="p-4 bg-red-50 text-red-800 rounded-lg">
          Error cargando catálogo: {error || 'No models found'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Catálogo de Productos Eternity</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Buscar por modelo o especificación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-64">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border bg-white"
            value={selectedFamily}
            onChange={(e) => setSelectedFamily(e.target.value)}
          >
            {familias.map((familia: string) => (
              <option key={familia} value={familia}>{familia}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Familia</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subfamilia</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voltaje (V)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad (Ah)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCatalogo.length > 0 ? (
              filteredCatalogo.map((modelo: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {modelo.modelo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{modelo.familia || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{modelo.subfamilia || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {modelo.especificaciones?.voltaje_v || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {modelo.especificaciones?.capacidad_nominal_ah || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      modelo.estado === 'Enriquecido'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {modelo.estado || 'Básico'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                  No se encontraron productos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
