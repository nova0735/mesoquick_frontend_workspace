import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

/**
 * Layout maestro del backoffice de agentes.
 *   [ Sidebar ] [ TopBar                 ]
 *   [         ] [ <Outlet /> (contenido) ]
 *
 * El panel de contexto del usuario de soporte (derecha) no vive aquí:
 * se compondrá dentro de cada página que lo necesite (ej. ChatPage en Fase 6)
 * porque no todas las vistas del agente lo requieren.
 */
export function MainLayout() {
  return (
    <div className="flex min-h-screen bg-base font-sans text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
