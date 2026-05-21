import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@features/auth/model/useAuthStore';
import { ROUTES } from '@app/router/routes';

/**
 * LoginPage (standalone)
 *
 * Fallback para usuarios que entran directo a la app de clientes sin pasar
 * por el shell-login. Usa el mismo método `login()` del store, que internamente
 * intenta el broker real primero y cae al mock si el broker está caído.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) clearError();
    await login({ email: email.trim().toLowerCase(), password });

    const currentError = useAuthStore.getState().error;
    const isAuth = useAuthStore.getState().isAuthenticated;
    if (!currentError && isAuth) {
      navigate(ROUTES.HOME, { replace: true });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-md bg-bg-elevated border border-border rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-text-heading mb-2">
            Iniciar sesión
          </h1>
          <p className="text-sm text-text/70">
            Bienvenido de vuelta a Mesoquick.
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-text-heading">
              Correo electrónico
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1 block w-full px-3 py-2 rounded-md border border-border bg-bg text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-text-heading">
              Contraseña
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-1 block w-full px-3 py-2 rounded-md border border-border bg-bg text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isLoading ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm text-text/70">
          <p>
            ¿No tienes cuenta?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="text-accent font-semibold hover:underline"
            >
              Crear cuenta
            </Link>
          </p>
          <p className="text-xs">
            ¿Llegaste aquí por error?{' '}
            <a
              href="https://mesoquick-login.vercel.app/"
              className="text-accent hover:underline"
            >
              Ir al login unificado
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}