import React, { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../../entities/session/model/auth.store';

// ==========================================
// FEATURE: Hydrate Session
// ==========================================
// 🧩 NOTA DE ARQUITECTURA (FSD):
// Este es un componente 'provider' a nivel de feature. Su única responsabilidad
// es disparar la acción de hidratación y mostrar un estado de carga global
// mientras se verifica la sesión. Envuelve toda la aplicación.

const FullScreenLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-t-transparent border-[#3c606b] rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500">Verificando sesión...</p>
    </div>
  </div>
);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  // Obtenemos la acción y el estado del store.
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrating = useAuthStore((state) => state.isHydrating);

  // Usamos useEffect para llamar a la acción de hidratación una sola vez
  // cuando el componente se monta por primera vez.
  useEffect(() => {
    hydrate();
  }, [hydrate]); // El linter puede pedir `hydrate` como dependencia. Es seguro.

  // Mientras el store está en estado de "hidratación", mostramos un loader global.
  // Esto previene parpadeos o renderizados de rutas protegidas antes de tiempo.
  if (isHydrating) {
    return <FullScreenLoader />;
  }

  // Una vez la hidratación termina, renderizamos el resto de la aplicación.
  return <>{children}</>;
};