import { Inbox } from 'lucide-react';
import { useSessionStore } from '../../entities/session';

/**
 * Placeholder de la bandeja de chats. El contenido real se construirá en la
 * Fase 6 (último paso), junto con la conexión WebSocket del Servicio de Chats.
 * Por ahora solo confirma que la sesión fue hidratada correctamente.
 */
export function InboxPage() {
  const user = useSessionStore((state) => state.user);

  return (
    <div className="max-w-3xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Inbox className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-primary">
              Bandeja de chats
            </h1>
            <p className="text-sm text-gray-500">
              Bienvenido/a, {user?.name}.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 text-sm text-gray-600 space-y-2">
          <p>
            Esta sección se construirá en la última fase del módulo, una vez
            terminadas las secciones más simples (FAQs, directorio, consulta de
            usuario y herramientas administrativas).
          </p>
          <p className="text-xs text-gray-400"> Gestión de Chats con
            Usuarios.
          </p>
        </div>
      </div>
    </div>
  );
}
