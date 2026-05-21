import { Users } from 'lucide-react';
import {
  MOCK_SUPPORT_USERS,
  UserSearchBar,
  useUserSearch,
} from '../../../features/view-user-profile';
import { UserResultsList } from '../../../widgets/user-directory';

/**
 * Página de búsqueda de usuarios (§3.3).
 * Permite al agente buscar clientes, repartidores o empresas por texto libre
 * o filtrar por tipo. Al hacer click en un resultado navega a
 * /users/:tipo/:id (UserDetailPage).
 *
 * TODO(backend): reemplazar MOCK_SUPPORT_USERS por una llamada paginada al
 * endpoint real. El hook useUserSearch se mantendrá como filtro cliente
 * para refinamientos; la paginación la manejará un hook aparte.
 */
export function UsersSearchPage() {
  const { query, setQuery, typeFilter, setTypeFilter, results, totalCount } =
    useUserSearch({ source: MOCK_SUPPORT_USERS });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Users className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Consulta de usuarios</h1>
        </div>
        <p className="text-sm text-gray-600">
          Busca clientes, repartidores o empresas para ver su perfil, historial
          de órdenes y, en el caso de repartidores, su saldo.
        </p>
      </header>

      <UserSearchBar
        query={query}
        onQueryChange={setQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <div className="text-xs text-gray-500">
        Mostrando{' '}
        <span className="font-semibold text-primary">{results.length}</span> de{' '}
        <span className="font-semibold text-primary">{totalCount}</span>{' '}
        usuarios.
      </div>

      <UserResultsList users={results} />
    </div>
  );
}
