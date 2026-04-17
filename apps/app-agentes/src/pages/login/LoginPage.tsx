import { Navigate } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import { useSessionStore } from '../../entities/session';
import { MockLoginForm } from '../../features/mock-login';

/**
 * Página de login en modo DEV MOCK.
 *
 * TODO(auth): esta página es temporal. Cuando @mesoquick/shell-login esté
 * listo y el Bróker exponga POST /api/auth/login, esta ruta debe eliminarse
 * por completo y el usuario llegará a app-agentes ya autenticado (con el JWT
 * persistido en localStorage bajo la clave "mesoquick.session" por shell-login).
 */
export function LoginPage() {
  const user = useSessionStore((state) => state.user);

  // Si ya hay una sesión de agente, no mostrar el login.
  if (user && user.role === 'AGENT') {
    return <Navigate to="/inbox" replace />;
  }

  return (
    <div className="min-h-screen bg-base font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg border-t-4 border-primary p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary">MesoQuick</h1>
            <p className="text-sm text-gray-500 mt-1">
              Panel de Agentes de Servicio al Cliente
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 mb-5 bg-accent/10 border border-accent/40 rounded-lg text-xs text-primary">
            <FlaskConical className="w-4 h-4 flex-shrink-0 text-accent" />
            <span>
              <strong>Entorno de desarrollo.</strong> El login real vivirá en{' '}
              <code>@mesoquick/shell-login</code> cuando el backend esté listo.
            </span>
          </div>

          <MockLoginForm />
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          © 2026 MesoQuick — Uso interno
        </p>
      </div>
    </div>
  );
}
