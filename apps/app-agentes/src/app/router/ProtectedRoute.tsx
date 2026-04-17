import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useSessionStore } from '../../entities/session';

/**
 * Guard de rutas protegidas. Verifica dos cosas:
 *   1. Existe una sesión hidratada en el store.
 *   2. El rol del usuario es 'AGENT' — cualquier otro rol queda fuera de esta app.
 *
 * Cuando el login real de @mesoquick/shell-login esté disponible, este guard
 * sigue funcionando sin cambios: el contrato (mesoquick.session en localStorage
 * + AuthResponse.user.role) es el mismo.
 */
export function ProtectedRoute() {
  const user = useSessionStore((state) => state.user);
  const clear = useSessionStore((state) => state.clear);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== 'AGENT') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base font-sans p-6">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg border-t-4 border-accent p-6 text-center">
          <ShieldAlert className="w-12 h-12 mx-auto text-accent mb-3" />
          <h1 className="text-xl font-semibold text-primary mb-2">
            Acceso restringido
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Tu rol <code className="text-primary">{user.role}</code> no tiene
            permitido acceder al panel de Agentes de Servicio al Cliente.
          </p>
          <button
            type="button"
            onClick={clear}
            className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
