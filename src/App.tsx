import { H6 } from './pages/H6';
import { H5 } from './pages/H5';
import { H4 } from './pages/H4';
import { H3 } from './pages/H3';
import { H2 } from './pages/H2';
import { H1 } from './pages/H1';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Battery, FileText, Settings, BarChart3, Wrench, FileCheck, Presentation } from 'lucide-react';
import { Catalogo } from './pages/Catalogo';

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
      <Link to="/catalogo" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-gray-400">
        <Battery className="w-8 h-8 text-gray-500 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">Catálogo</h3>
          <p className="text-sm text-gray-600">Catálogo de productos Eternity con especificaciones.</p>
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
        <FileCheck className="w-8 h-8 text-purple-500 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">H5 · Checklist Garantía</h3>
          <p className="text-sm text-gray-600">Checklist de instalación y registro de garantía.</p>
        </div>
      </Link>
      
      <Link to="/h6" className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-start gap-4 border-l-4 border-indigo-600">
        <Presentation className="w-8 h-8 text-indigo-600 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">H6 · Propuesta ROI</h3>
          <p className="text-sm text-gray-600">Hoja resumen ejecutiva — consolida automáticamente H1 a H4.</p>
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
          ? 'bg-blue-50 text-blue-700 font-medium' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
      <span>{children}</span>
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <aside className="w-64 bg-white shadow-md flex flex-col h-full z-10">
          <div className="p-5 border-b">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <Layout className="w-6 h-6 text-blue-600" />
              <span>Eternity Tools</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <SidebarLink to="/" icon={Layout}>Inicio</SidebarLink>
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Herramientas</p>
            </div>
            <SidebarLink to="/catalogo" icon={Battery}>Catálogo</SidebarLink>
            <SidebarLink to="/h1" icon={FileText}>H1 · Dolor Cliente</SidebarLink>
            <SidebarLink to="/h2" icon={Settings}>H2 · Selector Familia</SidebarLink>
            <SidebarLink to="/h3" icon={BarChart3}>H3 · TCO</SidebarLink>
            <SidebarLink to="/h4" icon={Wrench}>H4 · Dimensionador</SidebarLink>
            <SidebarLink to="/h5" icon={FileCheck}>H5 · Checklist</SidebarLink>
            <SidebarLink to="/h6" icon={Presentation}>H6 · Propuesta ROI</SidebarLink>
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/h1" element={<H1 />} />
            <Route path="/h2" element={<H2 />} />
            <Route path="/h3" element={<H3 />} />
            <Route path="/h4" element={<H4 />} />
            <Route path="/h5" element={<H5 />} />
            <Route path="/h6" element={<H6 />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
