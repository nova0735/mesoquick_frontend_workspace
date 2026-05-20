import { useEffect, type ReactNode } from 'react';
import { useSessionStore } from '../../entities/session';
import { bootstrapSessionFromUrl } from '../../features/receive-session';

/**
 * Hidrata el store de sesión al arrancar la app.
 *
 * Orden de prioridad:
 *   1. Si la URL trae `?token=...` (handshake desde shell-login), se decodifica
 *      el JWT y se persiste como la sesión activa.
 *   2. Si no, se hidrata desde localStorage (sesión previa del mismo agente).
 *
 * Mientras no termine, muestra una pantalla de carga para evitar que el
 * ProtectedRoute redirija por error al shell-login.
 */
interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const isHydrated = useSessionStore((state) => state.isHydrated);
  const hydrateFromStorage = useSessionStore((state) => state.hydrateFromStorage);

  useEffect(() => {
    const hydratedFromUrl = bootstrapSessionFromUrl();
    if (!hydratedFromUrl) {
      hydrateFromStorage();
    }
  }, [hydrateFromStorage]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base font-sans">
        <div className="text-primary text-sm">Cargando sesión…</div>
      </div>
    );
  }

  return <>{children}</>;
}
