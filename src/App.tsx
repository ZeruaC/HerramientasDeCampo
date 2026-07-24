import { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Layout,
  FileText,
  Settings,
  BarChart3,
  Wrench,
  FileCheck,
  Presentation,
  LogOut,
  ClipboardList,
  Search,
  FileSearch,
  CheckCircle,
  Loader2,
} from 'lucide-react';

import Login from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext.tsx';
import { useAuth } from './hooks/useAuth';
import { useStore } from './store/useStore';

const Checklist = lazy(() => import('./pages/Checklist'));
const Audit = lazy(() => import('./pages/Audit'));
const H1 = lazy(() => import('./pages/H1'));
const H2 = lazy(() => import('./pages/H2'));
const H3 = lazy(() => import('./pages/H3'));
const H4 = lazy(() => import('./pages/H4'));
const H5 = lazy(() => import('./pages/H5'));
const H6 = lazy(() => import('./pages/H6'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <div className="flex items-center gap-3 text-slate-500">
      <Loader2 className="w-6 h-6 animate-spin" />
      <span className="text-sm font-medium">Cargando herramienta...</span>
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Kit Herramientas Eternity</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Decisión que apoya: ¿Vale la pena invertir?</h2>
        <p className="text-gray-600 text-lg">
          Esta aplicación reúne las herramientas comerciales y técnicas necesarias para dimensionar,
          justificar y proponer soluciones de respaldo de energía Eternity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/checklist"
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-purple-600"
        >
          <ClipboardList className="w-8 h-8 text-purple-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">Checklist Inicial</h3>
            <p className="text-sm text-gray-600">Captura datos básicos del cliente.</p>
          </div>
        </Link>

        <Link
          to="/auditoria"
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-blue-600"
        >
          <ClipboardList className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">Auditoría Inicial</h3>
            <p className="text-sm text-gray-600">Inspección visual y técnica de la instalación actual del cliente.</p>
          </div>
        </Link>

        <Link
          to="/h1"
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-red-500"
        >
          <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">H1 · Dolor Cliente</h3>
            <p className="text-sm text-gray-600">Cuantificador del dolor del cliente. Convierte la falta de respaldo en una cifra.</p>
          </div>
        </Link>

        <Link
          to="/h2"
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-blue-500"
        >
          <Settings className="w-8 h-8 text-blue-500 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">H2 · Selector Familia</h3>
            <p className="text-sm text-gray-600">Selección técnica del proyecto basada en condiciones de ubicación.</p>
          </div>
        </Link>

        <Link
          to="/h3"
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-orange-500"
        >
          <Wrench className="w-8 h-8 text-orange-500 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">H3 · Dimensionador</h3>
            <p className="text-sm text-gray-600">Dimensionador de bancos de baterías con factores reales.</p>
          </div>
        </Link>

        <Link
          to="/h4"
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-green-500"
        >
          <BarChart3 className="w-8 h-8 text-green-500 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">H4 · Calculadora TCO</h3>
            <p className="text-sm text-gray-600">Calculadora del Coste Total de Propiedad vs alternativa.</p>
          </div>
        </Link>

        <Link
          to="/h5"
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-purple-500"
        >
          <Presentation className="w-8 h-8 text-purple-500 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">H5 · Propuesta</h3>
            <p className="text-sm text-gray-600">Hoja resumen ejecutiva para enviar al cliente.</p>
          </div>
        </Link>

        <Link
          to="/h6"
          className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-indigo-600"
        >
          <FileCheck className="w-8 h-8 text-indigo-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">H6 · Verificación de Instalación</h3>
            <p className="text-sm text-gray-600">Checklist de puesta en marcha. Solo para ofertas vendidas e instaladas.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

const SidebarLink = ({
  to,
  icon: Icon,
  children,
}: {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
        isActive ? 'bg-green-500/20 text-green-300 font-medium' : 'text-slate-400 hover:bg-slate-700/50'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-green-400' : 'text-slate-500'}`} />
      <span>{children}</span>
    </Link>
  );
};

const ProposalSearch = () => {
  const navigate = useNavigate();
  const { setCurrentProposalNumber, setProposalMode } = useStore();
  const [proposalNumber, setProposalNumber] = useState('');
  const [installNumber, setInstallNumber] = useState('');

  const viewProposal = () => {
    if (!proposalNumber.trim()) return;
    setCurrentProposalNumber(proposalNumber.trim());
    setProposalMode('view');
    navigate('/h5');
  };

  const openInstallationCheck = () => {
    if (!installNumber.trim()) return;
    setCurrentProposalNumber(installNumber.trim());
    setProposalMode('view');
    navigate('/h6');
  };

  return (
    <div className="px-3 py-4 border-t border-slate-700 space-y-4">
      <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ofertas</p>

      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={proposalNumber}
            onChange={(e) => setProposalNumber(e.target.value)}
            placeholder="Nº propuesta"
            className="w-full bg-slate-800 text-slate-200 text-sm rounded-md pl-8 pr-2 py-2 border border-slate-600 focus:border-green-400 focus:outline-none"
          />
          <FileSearch className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
        <button
          onClick={viewProposal}
          className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm py-2 rounded-md transition-colors"
        >
          <Search className="w-4 h-4" />
          Ver propuesta
        </button>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={installNumber}
            onChange={(e) => setInstallNumber(e.target.value)}
            placeholder="Nº oferta instalada"
            className="w-full bg-slate-800 text-slate-200 text-sm rounded-md pl-8 pr-2 py-2 border border-slate-600 focus:border-green-400 focus:outline-none"
          />
          <CheckCircle className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
        <button
          onClick={openInstallationCheck}
          className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm py-2 rounded-md transition-colors"
        >
          <FileCheck className="w-4 h-4" />
          Verificación instalación
        </button>
      </div>
    </div>
  );
};

function AppContent() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg flex flex-col overflow-hidden z-10">
          <div className="p-4 border-b border-slate-700">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white">
              <Layout className="w-6 h-6 text-green-400" />
              <span>Herramientas de Campo</span>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            <SidebarLink to="/" icon={Layout}>Inicio</SidebarLink>

            <div className="pt-3 pb-2">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Flujo de venta</p>
            </div>
            <SidebarLink to="/checklist" icon={ClipboardList}>Checklist Inicial</SidebarLink>
            <SidebarLink to="/auditoria" icon={ClipboardList}>Auditoría Inicial</SidebarLink>
            <SidebarLink to="/h1" icon={FileText}>H1 · Dolor Cliente</SidebarLink>
            <SidebarLink to="/h2" icon={Settings}>H2 · Selector Familia</SidebarLink>
            <SidebarLink to="/h3" icon={Wrench}>H3 · Dimensionador</SidebarLink>
            <SidebarLink to="/h4" icon={BarChart3}>H4 · TCO</SidebarLink>
            <SidebarLink to="/h5" icon={Presentation}>H5 · Propuesta</SidebarLink>
          </nav>

          <ProposalSearch />

          <div className="p-3 border-t border-slate-700 space-y-3">
            <div className="text-xs text-slate-400 truncate">{user.email}</div>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-2 text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
            <div className="flex justify-center">
              <img src="/logos/balore-favicon.png" alt="Balore" className="h-6 object-contain opacity-75" />
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
          <div className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/checklist" element={<Checklist />} />
                <Route path="/auditoria" element={<Audit />} />
                <Route path="/h1" element={<H1 />} />
                <Route path="/h2" element={<H2 />} />
                <Route path="/h3" element={<H3 />} />
                <Route path="/h4" element={<H4 />} />
                <Route path="/h5" element={<H5 />} />
                <Route path="/h6" element={<H6 />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
