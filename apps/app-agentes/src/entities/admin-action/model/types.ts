import type { SupportUserStatus, SupportUserType } from '../../support-user';

/**
 * Acciones administrativas que un agente puede ejecutar desde el panel
 * de servicio al cliente (§3.4 Interacciones UI Agentes).
 *
 * Todas las acciones se registran en un log asociado al usuario afectado
 * para trazabilidad.
 */
export type AdminActionType =
  | 'USER_BLOCKED'
  | 'USER_UNBLOCKED'
  | 'COURIER_INCIDENT_REPORTED'
  | 'FARE_ADJUSTED'
  | 'COMPENSATION_GRANTED';

export const ADMIN_ACTION_LABEL: Record<AdminActionType, string> = {
  USER_BLOCKED: 'Usuario bloqueado',
  USER_UNBLOCKED: 'Usuario desbloqueado',
  COURIER_INCIDENT_REPORTED: 'Incidente reportado',
  FARE_ADJUSTED: 'Tarifa ajustada',
  COMPENSATION_GRANTED: 'Compensación otorgada',
};

/**
 * Tipos de incidentes para repartidores. Lista cerrada inicial — si el
 * backend soporta más, ampliar aquí manteniendo el enum.
 */
export type IncidentType =
  | 'LATE_DELIVERY'
  | 'RUDE_BEHAVIOR'
  | 'DAMAGED_ORDER'
  | 'ABANDONED_ORDER'
  | 'OTHER';

export const INCIDENT_TYPE_LABEL: Record<IncidentType, string> = {
  LATE_DELIVERY: 'Entrega tardía',
  RUDE_BEHAVIOR: 'Trato inadecuado',
  DAMAGED_ORDER: 'Pedido dañado',
  ABANDONED_ORDER: 'Pedido abandonado',
  OTHER: 'Otro',
};

/**
 * Una compensación puede ser crédito directo (se abona al wallet del cliente)
 * o la generación de un cupón (código reutilizable con vencimiento).
 *
 * TODO(backend): los cupones se crearán a través del servicio de cupones del
 * backend. El código se genera acá solo como preview; el real lo devuelve el
 * servicio al recibir los parámetros (monto, tipo, expiración).
 */
export type CompensationKind = 'CREDIT' | 'COUPON';

export const COMPENSATION_KIND_LABEL: Record<CompensationKind, string> = {
  CREDIT: 'Crédito directo',
  COUPON: 'Cupón',
};

export type CouponDiscountType = 'PERCENT' | 'FIXED';

export const COUPON_DISCOUNT_TYPE_LABEL: Record<CouponDiscountType, string> = {
  PERCENT: 'Porcentaje',
  FIXED: 'Monto fijo (HNL)',
};

/**
 * Tipos de ajuste de tarifa. Pueden extenderse con "EXTRA_CHARGE" si se
 * requiere cobrar cargos adicionales; por ahora mantengo solo descuentos
 * y reembolsos que son lo usual desde servicio al cliente.
 */
export type FareAdjustmentType = 'DISCOUNT' | 'REFUND' | 'OVERRIDE';

export const FARE_ADJUSTMENT_TYPE_LABEL: Record<FareAdjustmentType, string> = {
  DISCOUNT: 'Aplicar descuento',
  REFUND: 'Reembolso total',
  OVERRIDE: 'Establecer nuevo total',
};

/**
 * Entrada del log de acciones administrativas. Se asocia al usuario
 * afectado para mostrar el histórico en el detalle.
 *
 * `details` es un texto libre renderizado como resumen humano; los campos
 * estructurados específicos de cada tipo se guardan en `payload`.
 */
export interface AdminActionLogEntry {
  id: string;
  type: AdminActionType;
  userId: string;
  userType: SupportUserType;
  performedAt: string;
  performedBy: string;
  reason: string;
  summary: string;
  payload?: Record<string, unknown>;
}

/**
 * Compensación emitida. Para kind=COUPON incluye código + tipo/monto/expiración.
 * Para kind=CREDIT solo monto.
 */
export interface CompensationRecord {
  id: string;
  userId: string;
  kind: CompensationKind;
  amount: number;
  currency: 'HNL';
  couponCode?: string;
  couponDiscountType?: CouponDiscountType;
  couponExpiresAt?: string;
  reason: string;
  grantedAt: string;
}

/**
 * Incidente reportado sobre un repartidor.
 */
export interface IncidentRecord {
  id: string;
  courierId: string;
  type: IncidentType;
  description: string;
  reportedAt: string;
  reportedBy: string;
  relatedOrderId?: string;
}

/**
 * Registro de ajuste de tarifa de una orden.
 */
export interface FareAdjustmentRecord {
  id: string;
  orderId: string;
  type: FareAdjustmentType;
  originalTotal: number;
  newTotal: number;
  reason: string;
  adjustedAt: string;
  adjustedBy: string;
}

/**
 * Override de estado por usuario (bloqueado/activo) aplicado sobre los mocks.
 * Vive en el admin store para que las mutaciones reactivas se reflejen en la UI
 * sin tener que mutar MOCK_SUPPORT_USERS (que es readonly).
 */
export type StatusOverrideMap = Record<string, SupportUserStatus>;

/**
 * Override de total por orden. Misma razón que StatusOverrideMap.
 */
export type TotalOverrideMap = Record<string, number>;
