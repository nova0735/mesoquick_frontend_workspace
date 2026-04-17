import type { CourierBalance } from '../../../entities/support-user';
import { MOCK_COURIER_BALANCES } from './mockCourierBalance';

/**
 * Devuelve el saldo del repartidor indicado.
 *
 * TODO(backend): reemplazar por GET /api/support/couriers/{id}/balance.
 */
export function getCourierBalance(courierId: string): CourierBalance | null {
  return (
    MOCK_COURIER_BALANCES.find((b) => b.courierId === courierId) ?? null
  );
}
