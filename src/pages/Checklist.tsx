import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Users, Phone, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Checklist() {
  const {
    clientName, setClientName,
    sector, setSector,
    contactPerson, setContactPerson,
    phoneNumber, setPhoneNumber,
    location, setLocation
  } = useStore();
  const navigate = useNavigate();

  const handleNext = () => {
    if (!clientName.trim() || !sector.trim()) {
      alert('Por favor completa Empresa y Sector');
      return;
    }
    navigate('/auditoria');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Checklist Inicial</h1>
        <p className="text-gray-600 mt-2">
          Captura los datos básicos del cliente antes de iniciar la auditoría.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="space-y-6">
          {/* Empresa */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Cliente / Empresa *
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nombre de la empresa"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Sector / Industria *
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona un sector...</option>
              <option value="Salud">Salud / Hospitales</option>
              <option value="Manufactura">Manufactura</option>
              <option value="Comercio">Comercio</option>
              <option value="Telecomunicaciones">Telecomunicaciones</option>
              <option value="Agroindustria">Agroindustria</option>
              <option value="Energía">Energía</option>
              <option value="Minería">Minería</option>
              <option value="Datos">Centro de datos</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Persona de Contacto */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Persona de Contacto
            </label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Nombre de la persona de contacto"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-600" />
              Teléfono
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+503 XXXX-XXXX"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-600" />
              Ubicación / Dirección
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Dirección de la instalación"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Próximo paso:</p>
              <p>Después completarás la auditoría visual de la instalación actual del cliente.</p>
            </div>
          </div>

          {/* Button */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
            >
              <span>Continuar a Auditoría</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
