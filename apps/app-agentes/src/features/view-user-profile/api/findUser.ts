import type {
  SupportUser,
  SupportUserType,
} from '../../../entities/support-user';
import { useAdminStore } from '../../../entities/admin-action';
import { MOCK_SUPPORT_USERS } from './mockUsers';

/**
 * Busca un usuario por (type, id) en los mocks y aplica cualquier override
 * de status que haya hecho una acción administrativa (Fase 5).
 *
 * No es un hook: para re-renderizar cuando cambia el status, el componente
 * consumidor debe suscribirse por separado al store mediante un selector.
 * Usamos getState() porque esta función se llama en tiempo de render desde
 * la página; Zustand garantiza que el render se re-dispara cuando el
 * componente lee otro selector del mismo store.
 *
 * TODO(backend): reemplazar por GET /api/support/users/{type}/{id} cuando el
 * endpoint exista. El status vendrá del servidor y el override local saldrá
 * del flujo.
 */
export function findUserByTypeAndId(
  type: SupportUserType,
  id: string,
): SupportUser | null {
  const user = MOCK_SUPPORT_USERS.find(
    (u) => u.type === type && u.id === id,
  );
  if (!user) return null;

  const override = useAdminStore.getState().userStatusOverrides[user.id];
  if (override && override !== user.status) {
    return { ...user, status: override };
  }
  return user;
}
