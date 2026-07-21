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
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header con logos */}
      <div className="bg-teal-50 border-b-2 border-cyan-300">
        <div className="flex justify-between items-center px-8 py-6 gap-4">
          <img src="/logos/balore-logo.png" alt="Balore" className="h-16 object-contain" />
          <img src="/logos/pelsa-logo.jpeg" alt="PELSA" className="h-16 object-contain" />
          <img src="/logos/eternity-logo.png" alt="Eternity" className="h-16 object-contain" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="grid grid-cols-2 gap-16 w-full max-w-7xl items-stretch">
          {/* Left side - Professional image */}
          <div>
            <div className="rounded-xl overflow-hidden shadow-2xl h-full border-4 border-slate-500">
              <img
                src="/logos/technician.png"
                alt="Técnico profesional"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl p-10 w-full">
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
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 py-4">
        <div className="text-center">
          <p className="text-slate-800 text-xs font-medium">
            Versión 3.0 · 2026-07-18 · Material de formación interno
          </p>
          <p className="text-slate-700 text-xs mt-1">
            © 2026 Balore Engineering. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
