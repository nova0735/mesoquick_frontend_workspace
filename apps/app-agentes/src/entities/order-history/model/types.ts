/**
 * Estados posibles de una orden desde la perspectiva del agente.
 * Simplificados vs. los estados internos de repartidores/clientes: aquí solo
 * interesa el resultado final y si está en curso.
 */
export type OrderStatus =
  | 'DELIVERED'
  | 'CANCELLED'
  | 'IN_PROGRESS'
  | 'REFUNDED';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  IN_PROGRESS: 'En curso',
  REFUNDED: 'Reembolsado',
};

/**
 * Item del historial de órdenes. Incluye las tres puntas del pedido
 * (cliente, repartidor, negocio) porque desde el panel del agente puede
 * interesar cualquiera de los tres al investigar un caso.
 *
 * TODO(backend): definir con el equipo de orders el contrato real; este mock
 * asume la misma orden es visible desde los tres tipos de usuario.
 */
export interface OrderHistoryItem {
  id: string;
  placedAt: string;
  clientId: string;
  clientName: string;
  businessId: string;
  businessName: string;
  courierId: string | null;
  courierName: string | null;
  total: number;
  currency: 'HNL';
  status: OrderStatus;
}
