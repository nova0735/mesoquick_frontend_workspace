import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@features/auth/model/useAuthStore';

/**
 * SessionBootstrap
 *
 * Monta una sola vez al iniciar la app. Resuelve la sesión en este orden:
 *   1. Si la URL trae ?token=XXX (vino del shell-login), lo recoge.
 *   2. Si no, valida el token persistido en localStorage contra el broker.
 *
 * No bloquea el render: la app arranca y la sesión se hidrata en background.
 */
export function SessionBootstrap({ children }: { children: ReactNode }) {
  const hydrateFromUrl = useAuthStore((s) => s.hydrateFromUrl);
  const hydrateFromStorage = useAuthStore((s) => s.hydrateFromStorage);

  useEffect(() => {
    (async () => {
      await hydrateFromUrl();
      await hydrateFromStorage();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}