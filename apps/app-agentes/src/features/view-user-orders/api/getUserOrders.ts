import type { OrderHistoryItem } from '../../../entities/order-history';
import type { SupportUserType } from '../../../entities/support-user';
import { useAdminStore } from '../../../entities/admin-action';
import { MOCK_ORDER_HISTORY } from './mockOrderHistory';

/**
 * Devuelve las órdenes asociadas a un usuario según su tipo, aplicando
 * los overrides de total provocados por la acción "Ajustar tarifa" (Fase 5).
 *
 * TODO(backend): reemplazar por GET /api/support/orders?userType=X&userId=Y.
 * Mantener el orden descendente por fecha para que la UI no tenga que
 * ordenar por su cuenta.
 */
export function getOrdersForUser(
  type: SupportUserType,
  userId: string,
): readonly OrderHistoryItem[] {
  const matches = MOCK_ORDER_HISTORY.filter((order) => {
    switch (type) {
      case 'CLIENT':
        return order.clientId === userId;
      case 'COURIER':
        return order.courierId === userId;
      case 'BUSINESS':
        return order.businessId === userId;
    }
  });

  const overrides = useAdminStore.getState().orderTotalOverrides;
  const withOverrides = matches.map((order) =>
    overrides[order.id] !== undefined
      ? { ...order, total: overrides[order.id] }
      : order,
  );

  return withOverrides.sort((a, b) => b.placedAt.localeCompare(a.placedAt));
}
