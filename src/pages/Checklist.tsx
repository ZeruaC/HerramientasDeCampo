import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Phone, MapPin } from 'lucide-react';

export const Checklist = () => {
  const navigate = useNavigate();
  const { clientName, setClientName, sector, setSector, contactPerson, setContactPerson, phoneNumber, setPhoneNumber, location, setLocation } = useStore();

  const handleContinue = () => {
    if (clientName.trim() && sector.trim()) {
      navigate('/h1');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Checklist Inicial</h1>
        <p className="text-gray-600 mt-2">
          Captura los datos básicos del cliente antes de la auditoría.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Empresa / Cliente *
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre de la empresa"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sector Industrial *
          </label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Selecciona un sector...</option>
            <option value="Telecomunicaciones">Telecomunicaciones</option>
            <option value="Sanitario">Sanitario</option>
            <option value="Hogar">Hogar</option>
            <option value="Industria">Industria</option>
            <option value="Comercial">Comercial</option>
            <option value="Energía">Energía</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Persona de Contacto
          </label>
          <input
            type="text"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre y cargo"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Teléfono de Contacto
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+503 XXXX XXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Ubicación
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ciudad, departamento"
          />
        </div>

        <button
          onClick={handleContinue}
          disabled={!clientName.trim() || !sector.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors mt-8"
        >
          Continuar a H1 · Dolor Cliente
        </button>
      </div>
    </div>
  );
};
