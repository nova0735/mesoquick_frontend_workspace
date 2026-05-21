/**
 * Tipo de usuario que un agente puede consultar desde el panel de servicio
 * al cliente (§3.3 Interacciones UI Agentes).
 *
 * - CLIENT: comensal que hace pedidos desde app-clientes.
 * - COURIER: repartidor de app-repartidores.
 * - BUSINESS: restaurante/empresa de app-empresas.
 *
 * No se incluyen AGENT ni ADMIN porque los agentes no se consultan entre sí
 * por esta vía (para eso existe el Directorio interno §3.5).
 */
export type SupportUserType = 'CLIENT' | 'COURIER' | 'BUSINESS';

export const SUPPORT_USER_TYPE_LABEL: Record<SupportUserType, string> = {
  CLIENT: 'Cliente',
  COURIER: 'Repartidor',
  BUSINESS: 'Empresa',
};

/**
 * Convierte el slug de URL a SupportUserType. Las rutas usan slugs en español
 * minúsculas (/users/cliente/:id) para mayor legibilidad, pero internamente
 * manejamos el enum en inglés mayúsculas (alineado con UserRole del shell-login).
 */
export const URL_SLUG_TO_TYPE: Record<string, SupportUserType> = {
  cliente: 'CLIENT',
  repartidor: 'COURIER',
  empresa: 'BUSINESS',
};

export const TYPE_TO_URL_SLUG: Record<SupportUserType, string> = {
  CLIENT: 'cliente',
  COURIER: 'repartidor',
  BUSINESS: 'empresa',
};

/**
 * Estado del usuario desde el punto de vista del servicio al cliente.
 * El bloqueo se gestionará desde Fase 5 (Herramientas administrativas).
 */
export type SupportUserStatus = 'ACTIVE' | 'BLOCKED';

export const SUPPORT_USER_STATUS_LABEL: Record<SupportUserStatus, string> = {
  ACTIVE: 'Activo',
  BLOCKED: 'Bloqueado',
};

/**
 * Usuario consultable por el agente. Campos comunes a los tres tipos.
 *
 * Notas:
 * - `registeredAt` se guarda como ISO string para evitar serialización.
 * - `businessName` aplica solo si type === 'BUSINESS'; para otros es undefined.
 * - El avatar es opcional; si no viene, la UI muestra iniciales.
 */
export interface SupportUser {
  id: string;
  type: SupportUserType;
  name: string;
  email: string;
  phone: string;
  status: SupportUserStatus;
  registeredAt: string;
  avatarUrl?: string;
  businessName?: string;
}

/**
 * Saldo del repartidor — solo aplica a SupportUser con type 'COURIER'.
 *
 * - `available`: dinero ya liquidado, listo para retirar.
 * - `inTransit`: ganancias de pedidos aún no liquidados (típicamente del día).
 * - `recentMovements`: últimos N movimientos para contexto del agente.
 *
 * TODO(backend): este contrato debe alinearse con lo que exponga el servicio
 * de liquidaciones de couriers. El mock asume unidades en HNL.
 */
export interface CourierBalanceMovement {
  id: string;
  date: string;
  concept: string;
  amount: number;
}

export interface CourierBalance {
  courierId: string;
  available: number;
  inTransit: number;
  currency: 'HNL';
  recentMovements: readonly CourierBalanceMovement[];
}
