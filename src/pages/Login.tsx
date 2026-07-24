import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, Zap } from 'lucide-react';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header con logos */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center gap-4">
            <img src="/logos/balore-logo.png" alt="Balore" className="h-12 md:h-16 object-contain" />
            <img src="/logos/pelsa-logo.jpeg" alt="PELSA" className="h-12 md:h-16 object-contain" />
            <img src="/logos/eternity-logo.png" alt="Eternity" className="h-12 md:h-16 object-contain" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 w-full max-w-6xl items-center">
          {/* Left side - Value proposition + image */}
          <div className="order-2 lg:order-1 space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Herramientas de Campo</h2>
                  <p className="text-sm text-slate-500">Eternity Technologies</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Argumentario comercial y técnico para profesionales
              </h3>

              <ul className="space-y-4">
                {[
                  'Auditoría visual de instalaciones existentes',
                  'Cuantificación del dolor económico del cliente',
                  'Selección técnica de familia Eternity',
                  'Dimensionado de bancos de baterías',
                  'Comparativa TCO y generación de propuestas',
                  'Checklist de verificación de instalación',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700">
                    <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white hidden lg:block">
              <img
                src="/logos/technician.png"
                alt="Técnico profesional"
                className="w-full h-80 object-cover object-top"
              />
            </div>
          </div>

          {/* Right side - Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 shadow-lg shadow-blue-600/20 mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Bienvenido de nuevo
                </h1>
                <p className="text-slate-500 mt-2 text-sm">
                  Inicia sesión para acceder a las herramientas de campo
                </p>
              </div>

              {error && (
                <div className="mb-6 px-4 py-3 rounded-xl text-sm flex items-start gap-2 bg-red-50 border border-red-200 text-red-800">
                  <span className="mt-0.5">⚠</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Iniciar Sesión
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-5 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-medium">
            Versión 4.0 · 2026-07-23 · Material de formación interno
          </p>
          <p className="text-xs mt-1 text-slate-500">
            © 2026 Balore Engineering. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
