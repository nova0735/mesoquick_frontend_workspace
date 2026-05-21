import { create } from 'zustand';
import type { SupportUserStatus, SupportUserType } from '../../support-user';
import type {
  AdminActionLogEntry,
  AdminActionType,
  CompensationKind,
  CompensationRecord,
  CouponDiscountType,
  FareAdjustmentRecord,
  FareAdjustmentType,
  IncidentRecord,
  IncidentType,
  StatusOverrideMap,
  TotalOverrideMap,
} from './types';

/**
 * Store único para toda la Fase 5. Agrupa los efectos de las 4 acciones
 * administrativas sobre los mocks:
 *
 * - userStatusOverrides: muta el status del usuario sin tocar MOCK_SUPPORT_USERS.
 * - orderTotalOverrides: muta el total de una orden sin tocar MOCK_ORDER_HISTORY.
 * - compensations / incidents / fareAdjustments: registros persistidos en memoria.
 * - log: lista cronológica de todas las acciones por usuario afectado.
 *
 * TODO(backend): cada acción actualmente muta este store local; al migrar, cada
 * método llamará al endpoint correspondiente y solo actualizará el store con el
 * resultado del servidor.
 *
 * Regla de consumo: usar selectores atómicos para no re-renderizar de más.
 *   const overrideStatus = useAdminStore((s) => s.userStatusOverrides[userId]);
 */
interface AdminStoreState {
  userStatusOverrides: StatusOverrideMap;
  orderTotalOverrides: TotalOverrideMap;
  compensations: CompensationRecord[];
  incidents: IncidentRecord[];
  fareAdjustments: FareAdjustmentRecord[];
  log: AdminActionLogEntry[];
}

interface BlockUserInput {
  userId: string;
  userType: SupportUserType;
  reason: string;
  performedBy: string;
  makeBlocked: boolean;
}

interface ReportIncidentInput {
  courierId: string;
  courierType: SupportUserType;
  incidentType: IncidentType;
  description: string;
  reportedBy: string;
  relatedOrderId?: string;
}

interface AdjustFareInput {
  orderId: string;
  userId: string;
  userType: SupportUserType;
  originalTotal: number;
  adjustmentType: FareAdjustmentType;
  newTotal: number;
  reason: string;
  adjustedBy: string;
}

interface GrantCompensationInput {
  userId: string;
  userType: SupportUserType;
  kind: CompensationKind;
  amount: number;
  couponDiscountType?: CouponDiscountType;
  couponExpiresAt?: string;
  reason: string;
  grantedBy: string;
}

interface AdminStoreActions {
  blockUser: (input: BlockUserInput) => void;
  reportIncident: (input: ReportIncidentInput) => void;
  adjustFare: (input: AdjustFareInput) => void;
  grantCompensation: (input: GrantCompensationInput) => CompensationRecord;
  selectLogForUser: (userId: string) => AdminActionLogEntry[];
}

export type AdminStore = AdminStoreState & AdminStoreActions;

/**
 * Pequeño helper para generar IDs monotónicos dentro de este runtime.
 * No es criptográficamente seguro; el backend eventualmente asignará los reales.
 */
let idCounter = 1000;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function pushLog(
  state: AdminStoreState,
  type: AdminActionType,
  userId: string,
  userType: SupportUserType,
  performedBy: string,
  reason: string,
  summary: string,
  payload?: Record<string, unknown>,
): AdminActionLogEntry[] {
  const entry: AdminActionLogEntry = {
    id: nextId('log'),
    type,
    userId,
    userType,
    performedAt: nowIso(),
    performedBy,
    reason,
    summary,
    payload,
  };
  return [entry, ...state.log];
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  userStatusOverrides: {},
  orderTotalOverrides: {},
  compensations: [],
  incidents: [],
  fareAdjustments: [],
  log: [],

  blockUser: ({ userId, userType, reason, performedBy, makeBlocked }) => {
    set((state) => {
      const newStatus: SupportUserStatus = makeBlocked ? 'BLOCKED' : 'ACTIVE';
      const newOverrides = { ...state.userStatusOverrides, [userId]: newStatus };
      return {
        userStatusOverrides: newOverrides,
        log: pushLog(
          state,
          makeBlocked ? 'USER_BLOCKED' : 'USER_UNBLOCKED',
          userId,
          userType,
          performedBy,
          reason,
          makeBlocked
            ? 'Se bloqueó el acceso del usuario a la plataforma'
            : 'Se restauró el acceso del usuario a la plataforma',
        ),
      };
    });
  },

  reportIncident: ({
    courierId,
    courierType,
    incidentType,
    description,
    reportedBy,
    relatedOrderId,
  }) => {
    set((state) => {
      const record: IncidentRecord = {
        id: nextId('inc'),
        courierId,
        type: incidentType,
        description,
        reportedAt: nowIso(),
        reportedBy,
        relatedOrderId,
      };
      return {
        incidents: [record, ...state.incidents],
        log: pushLog(
          state,
          'COURIER_INCIDENT_REPORTED',
          courierId,
          courierType,
          reportedBy,
          description,
          `Incidente registrado: ${incidentType}`,
          { incidentId: record.id, relatedOrderId },
        ),
      };
    });
  },

  adjustFare: ({
    orderId,
    userId,
    userType,
    originalTotal,
    adjustmentType,
    newTotal,
    reason,
    adjustedBy,
  }) => {
    set((state) => {
      const record: FareAdjustmentRecord = {
        id: nextId('far'),
        orderId,
        type: adjustmentType,
        originalTotal,
        newTotal,
        reason,
        adjustedAt: nowIso(),
        adjustedBy,
      };
      return {
        orderTotalOverrides: {
          ...state.orderTotalOverrides,
          [orderId]: newTotal,
        },
        fareAdjustments: [record, ...state.fareAdjustments],
        log: pushLog(
          state,
          'FARE_ADJUSTED',
          userId,
          userType,
          adjustedBy,
          reason,
          `Orden ${orderId}: ${originalTotal.toFixed(2)} → ${newTotal.toFixed(2)} HNL`,
          { orderId, adjustmentType, originalTotal, newTotal },
        ),
      };
    });
  },

  grantCompensation: ({
    userId,
    userType,
    kind,
    amount,
    couponDiscountType,
    couponExpiresAt,
    reason,
    grantedBy,
  }) => {
    const record: CompensationRecord = {
      id: nextId('comp'),
      userId,
      kind,
      amount,
      currency: 'HNL',
      reason,
      grantedAt: nowIso(),
      couponCode:
        kind === 'COUPON' ? generateCouponCode(userId) : undefined,
      couponDiscountType: kind === 'COUPON' ? couponDiscountType : undefined,
      couponExpiresAt: kind === 'COUPON' ? couponExpiresAt : undefined,
    };

    set((state) => ({
      compensations: [record, ...state.compensations],
      log: pushLog(
        state,
        'COMPENSATION_GRANTED',
        userId,
        userType,
        grantedBy,
        reason,
        kind === 'COUPON'
          ? `Cupón ${record.couponCode} emitido (${formatCouponAmount(
              amount,
              couponDiscountType,
            )})`
          : `Crédito directo de HNL ${amount.toFixed(2)}`,
        {
          compensationId: record.id,
          kind,
          couponCode: record.couponCode,
        },
      ),
    }));

    return record;
  },

  selectLogForUser: (userId) =>
    get().log.filter((entry) => entry.userId === userId),
}));

function generateCouponCode(userId: string): string {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  const userHint = userId.slice(-4).toUpperCase();
  return `MQ-${userHint}-${suffix}`;
}

function formatCouponAmount(
  amount: number,
  type?: CouponDiscountType,
): string {
  if (type === 'PERCENT') return `${amount}%`;
  return `HNL ${amount.toFixed(2)}`;
}
