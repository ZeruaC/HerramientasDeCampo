import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
        setError('Cuenta creada. Por favor inicia sesión.');
        setTimeout(() => setIsLogin(true), 1500);
      }
      navigate('/');
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 flex flex-col">
      {/* Header con logos */}
      <div className="flex justify-between items-center px-8 py-6 gap-4">
        <img src="/logos/balore-logo.png" alt="Balore" className="h-12 object-contain" />
        <img src="/logos/pelsa-logo.jpeg" alt="PELSA" className="h-16 object-contain" />
        <img src="/logos/eternity-logo.png" alt="Eternity" className="h-14 object-contain" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="grid grid-cols-2 gap-16 w-full max-w-7xl items-center">
          {/* Left side - Professional image */}
          <div className="hidden lg:block">
            <div
              className="rounded-xl overflow-hidden shadow-2xl h-[500px] bg-cover bg-center border-4 border-slate-500"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%), url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 400 500%27%3E%3Cdefs%3E%3ClinearGradient id=%27grad%27 x1=%270%25%27 y1=%270%25%27 x2=%27100%25%27 y2=%27100%25%27%3E%3Cstop offset=%270%25%27 style=%27stop-color:%2338444d;stop-opacity:1%27 /%3E%3Cstop offset=%27100%25%27 style=%27stop-color:%231e2938;stop-opacity:1%27 /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%27400%27 height=%27500%27 fill=%27url(%23grad)%27/%3E%3Ccircle cx=%27100%27 cy=%27100%27 r=%2750%27 fill=%27%234a9eff%27 opacity=%270.1%27/%3E%3Ccircle cx=%27350%27 cy=%27450%27 r=%27100%27 fill=%27%234a9eff%27 opacity=%270.05%27/%3E%3Crect x=%2750%27 y=%27150%27 width=%27300%27 height=%27200%27 fill=%27%232d3e52%27 rx=%2710%27/%3E%3Ctext x=%27200%27 y=%27240%27 font-size=%2724%27 text-anchor=%27middle%27 fill=%27%234a9eff%27 font-weight=%27bold%27%3ESoluciones%3C/text%3E%3Ctext x=%27200%27 y=%27270%27 font-size=%2720%27 text-anchor=%27middle%27 fill=%27%23a0c4ff%27%3Ede Respaldo%3C/text%3E%3C/svg%3E")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-32 h-32 mx-auto text-blue-400 opacity-40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-slate-400 text-lg font-semibold">Energía Confiable</p>
                  <p className="text-slate-500 text-sm mt-2">Soluciones Profesionales</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-10">
              <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
                HERRAMIENTAS DE CAMPO
              </h1>
              <p className="text-center text-gray-600 font-semibold mb-8">
                PARA PROFESIONALES
              </p>

              <p className="text-center text-gray-700 text-sm mb-6">
                {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea una nueva cuenta'}
              </p>

              {error && (
                <div className={`${error.includes('creada') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-lg mb-6 text-sm`}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors mt-6"
                >
                  {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm mb-2">
                  {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                </p>
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
                </button>
              </div>
            </div>

            <p className="text-center text-slate-400 text-xs mt-6">
              Versión 3.0 · 2026-07-18 · Material de formación interno
            </p>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="h-16 bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400"></div>
    </div>
  );
}
