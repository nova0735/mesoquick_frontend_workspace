import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useSessionStore } from '../../entities/session';

/**
 * Guard de rutas protegidas. Verifica dos cosas:
 *   1. Existe una sesión hidratada en el store.
 *   2. El rol del usuario es 'AGENT' — cualquier otro rol queda fuera de esta app.
 *
 * Sin sesión válida → redirige al shell-login (que vive en otro origen/puerto).
 * Con sesión pero rol incorrecto → muestra pantalla de bloqueo + botón para
 * volver al shell-login.
 *
 * Se lee de VITE_SHELL_LOGIN_URL (Vercel) con fallback al puerto local
 * del docker-compose dev.
 */
const SHELL_LOGIN_URL =
  import.meta.env.VITE_SHELL_LOGIN_URL || 'http://localhost:5173/';

export function ProtectedRoute() {
  const user = useSessionStore((state) => state.user);
  const clear = useSessionStore((state) => state.clear);

  useEffect(() => {
    if (!user) {
      window.location.replace(SHELL_LOGIN_URL);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base font-sans">
        <div className="text-primary text-sm">Redirigiendo al inicio de sesión…</div>
      </div>
    );
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
            onClick={() => {
              clear();
              window.localStorage.removeItem('access_token');
              window.location.replace(SHELL_LOGIN_URL);
            }}
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
