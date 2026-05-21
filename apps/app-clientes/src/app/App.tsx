/**
 * 🚀 Cambios al archivo: src/app/App.tsx
 *
 * Solo agregar el componente SessionBootstrap envolviendo a AppRouter.
 * Esto es lo que dispara la hidratación cuando la app carga (URL o storage).
 *
 * Las líneas marcadas con ➕ son nuevas.
 */

import AppProviders from './providers/AppProviders';
import AppRouter from './router/AppRouter';
import { SessionBootstrap } from '@features/auth/ui/SessionBootstrap'; // ➕ NUEVO

export default function App() {
  return (
    <AppProviders>
      <SessionBootstrap>          {/* ➕ NUEVO */}
        <AppRouter />
      </SessionBootstrap>          {/* ➕ NUEVO */}
    </AppProviders>
  );
}