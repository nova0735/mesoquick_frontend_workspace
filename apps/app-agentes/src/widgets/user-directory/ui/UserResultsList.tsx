import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import {
  TYPE_TO_URL_SLUG,
  SUPPORT_USER_STATUS_LABEL,
  type SupportUser,
} from '../../../entities/support-user';
import { UserTypeBadge } from './UserTypeBadge';

interface UserResultsListProps {
  users: readonly SupportUser[];
}

/**
 * Lista de resultados de la búsqueda de usuarios. Cada tarjeta navega al
 * detalle del usuario (/users/:tipo/:id) al hacer click.
 */
export function UserResultsList({ users }: UserResultsListProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
        <Users className="w-10 h-10 mb-3 text-gray-300" />
        <p className="text-sm font-semibold">No se encontraron usuarios</p>
        <p className="text-xs mt-1">
          Prueba con otro término o cambia el filtro de tipo.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {users.map((user) => (
        <li key={`${user.type}-${user.id}`}>
          <Link
            to={`/users/${TYPE_TO_URL_SLUG[user.type]}/${user.id}`}
            className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm hover:border-primary transition"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">
                {getInitials(user.name)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-sm font-semibold text-primary truncate">
                  {user.name}
                </h3>
                <span
                  className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                    user.status === 'ACTIVE' ? 'bg-green-base' : 'bg-red-500'
                  }`}
                  title={SUPPORT_USER_STATUS_LABEL[user.status]}
                />
              </div>

              {user.businessName && (
                <p className="text-xs text-gray-600 truncate">
                  {user.businessName}
                </p>
              )}

              <div className="flex items-center gap-2 mt-1">
                <UserTypeBadge type={user.type} />
                <span className="font-mono text-[10px] text-gray-400">
                  {user.id}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-1 truncate">
                {user.email}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function getInitials(name: string): string {
  const parts = name.split(' ');
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return (first + last).toUpperCase();
}
