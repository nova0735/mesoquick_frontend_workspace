import { useEffect, type ReactNode } from 'react';
import { useSessionStore } from '../../entities/session';

/**
 * Hidrata el store de sesión desde localStorage al arrancar la app.
 * Debe envolver al router. Mientras no termine la hidratación, muestra una
 * pantalla de carga para evitar que el ProtectedRoute redirija por error.
 */
interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const isHydrated = useSessionStore((state) => state.isHydrated);
  const hydrateFromStorage = useSessionStore((state) => state.hydrateFromStorage);

  useEffect(() => {
    hydrateFromStorage();
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
