import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Mail,
  Phone,
  ShieldOff,
  UserRound,
} from 'lucide-react';
import {
  SUPPORT_USER_STATUS_LABEL,
  SUPPORT_USER_TYPE_LABEL,
  TYPE_TO_URL_SLUG,
  type SupportUser,
} from '../../../entities/support-user';
import { useAdminStore } from '../../../entities/admin-action';

interface ChatUserContextPanelProps {
  user: SupportUser;
}

/**
 * Tarjeta de contexto del usuario solicitante para el panel derecho del chat.
 * Datos básicos (nombre, email, teléfono, estado) + link al detalle completo
 * en /users/:tipo/:id donde el agente puede ver historial de pedidos, etc.
 *
 * Se suscribe al admin store para reflejar al instante los cambios de estado
 * (bloqueo/desbloqueo) que el agente haga desde la barra de acciones que
 * acompaña a este panel en la página.
 */
export function ChatUserContextPanel({ user }: ChatUserContextPanelProps) {
  const statusOverride = useAdminStore(
    (state) => state.userStatusOverrides[user.id],
  );
  const effectiveStatus = statusOverride ?? user.status;
  const isBlocked = effectiveStatus === 'BLOCKED';
  const slug = TYPE_TO_URL_SLUG[user.type];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <header className="p-4 border-b border-gray-200 bg-base">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <UserRound className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              {SUPPORT_USER_TYPE_LABEL[user.type]}
            </p>
            <h2 className="text-base font-bold text-primary truncate">
              {user.name}
            </h2>
            {user.businessName && (
              <p className="text-xs text-gray-500 truncate">
                {user.businessName}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="p-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>{user.phone}</span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          {isBlocked ? (
            <ShieldOff className="w-4 h-4 text-red-500 flex-shrink-0" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-green-base ml-1 mr-1 flex-shrink-0" />
          )}
          <span
            className={`text-xs font-semibold ${
              isBlocked ? 'text-red-600' : 'text-green-base'
            }`}
          >
            {SUPPORT_USER_STATUS_LABEL[effectiveStatus]}
          </span>
        </div>
      </div>

      <footer className="px-4 py-3 border-t border-gray-200 bg-base">
        <Link
          to={`/users/${slug}/${user.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          Ver perfil completo
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </footer>
    </div>
  );
}
