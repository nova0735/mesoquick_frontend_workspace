import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  SUPPORT_USER_STATUS_LABEL,
  type SupportUser,
} from '../../../entities/support-user';
import { UserTypeBadge } from '../../user-directory';

interface UserDetailHeaderProps {
  user: SupportUser;
}

/**
 * Encabezado de la página de detalle del usuario.
 * Incluye avatar/iniciales, nombre, tipo, estado y botón de regreso a /users.
 *
 * NOTA: No hay botón de bloquear/desbloquear todavía — eso viene en Fase 5
 * (Herramientas administrativas).
 */
export function UserDetailHeader({ user }: UserDetailHeaderProps) {
  const isBlocked = user.status === 'BLOCKED';

  return (
    <header className="space-y-3">
      <Link
        to="/users"
        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver a resultados
      </Link>

      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-primary">
            {getInitials(user.name)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-primary truncate">
              {user.name}
            </h1>
            <UserTypeBadge type={user.type} />
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isBlocked
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-base/15 text-green-base'
              }`}
            >
              {SUPPORT_USER_STATUS_LABEL[user.status]}
            </span>
          </div>
          {user.businessName && (
            <p className="text-sm text-gray-600 mt-0.5">{user.businessName}</p>
          )}
        </div>
      </div>
    </header>
  );
}

function getInitials(name: string): string {
  const parts = name.split(' ');
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return (first + last).toUpperCase();
}
