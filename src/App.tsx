import { H6 } from './pages/H6';
import { H5 } from './pages/H5';
import { H4 } from './pages/H4';
import { H3 } from './pages/H3';
import { H2 } from './pages/H2';
import { H1 } from './pages/H1';
import { Checklist } from './pages/Checklist';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Layout, Battery, FileText, Settings, BarChart3, Wrench, FileCheck, Presentation, LogOut, ClipboardList } from 'lucide-react';
import { Catalogo } from './pages/Catalogo';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Placeholder components for pages
const Home = () => (
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
      <Link to="/checklist" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-purple-600">
        <ClipboardList className="w-8 h-8 text-purple-600 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">Checklist Inicial</h3>
          <p className="text-sm text-gray-600">Captura datos básicos del cliente.</p>
        </div>
      </Link>

      <Link to="/h1" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-red-500">
        <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">H1 · Dolor Cliente</h3>
          <p className="text-sm text-gray-600">Cuantificador del dolor del cliente. Convierte la falta de respaldo en una cifra.</p>
        </div>
      </Link>
      
      <Link to="/h2" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-blue-500">
        <Settings className="w-8 h-8 text-blue-500 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">H2 · Selector Familia</h3>
          <p className="text-sm text-gray-600">Selección técnica del proyecto. Elimina errores de selección.</p>
        </div>
      </Link>
      
      <Link to="/h3" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-green-500">
        <BarChart3 className="w-8 h-8 text-green-500 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">H3 · Calculadora TCO</h3>
          <p className="text-sm text-gray-600">Calculadora del Coste Total de Propiedad vs alternativa.</p>
        </div>
      </Link>
      
      <Link to="/h4" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-orange-500">
        <Wrench className="w-8 h-8 text-orange-500 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">H4 · Dimensionador</h3>
          <p className="text-sm text-gray-600">Dimensionador de bancos de baterías con factores reales.</p>
        </div>
      </Link>
      
      <Link to="/h5" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-purple-500">
        <Presentation className="w-8 h-8 text-purple-500 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">H5 · Propuesta</h3>
          <p className="text-sm text-gray-600">Hoja resumen ejecutiva para enviar al cliente.</p>
        </div>
      </Link>

      <Link to="/h6" className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-indigo-600">
        <FileCheck className="w-8 h-8 text-indigo-600 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">H6 · Checklist</h3>
          <p className="text-sm text-gray-600">Checklist de puesta en marcha.</p>
        </div>
      </Link>
    </div>
  </div>
);








const SidebarLink = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
        isActive
          ? 'bg-green-500/20 text-green-300 font-medium'
          : 'text-slate-400 hover:bg-slate-700/50'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-green-400' : 'text-slate-500'}`} />
      <span>{children}</span>
    </Link>
  );
};

function AppContent() {
  const { user, signOut, loading } = useAuth();
  const location = useLocation();

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg flex flex-col h-full z-10">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white">
            <Layout className="w-6 h-6 text-green-400" />
            <span>Herramientas de Campo</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <SidebarLink to="/" icon={Layout}>Inicio</SidebarLink>
          <div className="pt-3 pb-2">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Flujo de Venta</p>
          </div>
          <SidebarLink to="/checklist" icon={ClipboardList}>Checklist Inicial</SidebarLink>
          <SidebarLink to="/h1" icon={FileText}>H1 · Dolor Cliente</SidebarLink>
          <SidebarLink to="/h2" icon={Settings}>H2 · Selector Familia</SidebarLink>
          <SidebarLink to="/h3" icon={BarChart3}>H3 · TCO</SidebarLink>
          <SidebarLink to="/h4" icon={Wrench}>H4 · Dimensionador</SidebarLink>
          <SidebarLink to="/h5" icon={FileCheck}>H5 · Propuesta</SidebarLink>
          <SidebarLink to="/h6" icon={Presentation}>H6 · Checklist</SidebarLink>
        </nav>
        {/* User info and logout */}
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
      <main className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 min-w-0">
        <Header />

        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/h1" element={<H1 />} />
            <Route path="/h2" element={<H2 />} />
            <Route path="/h3" element={<H3 />} />
            <Route path="/h4" element={<H4 />} />
            <Route path="/h5" element={<H5 />} />
            <Route path="/h6" element={<H6 />} />
          </Routes>
        </div>

        <Footer />
      </main>
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
