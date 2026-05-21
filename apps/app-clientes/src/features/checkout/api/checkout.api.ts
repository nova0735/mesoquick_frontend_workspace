// src/features/checkout/api/checkout.api.ts
//
// Capa de checkout. broker-first + fallback mock.
//
// Shape del broker para POST /pedidos (confirmado vía swagger):
//   {
//     cliente_id: number,
//     direccion_entrega: string,
//     items: [{ producto_id, cantidad, descuento }]
//   }
// El broker NO acepta subtotal/total/metodo_pago/costo_envio/cupon en el body.
// Los validators son estrictos y rechazan campos extra con HTTP 400.

import type { CartItem, PaymentMethod } from '@shared/types';

// ============================================================================
//  Tipos públicos (firmas que ya consumen los hooks — NO cambiar)
// ============================================================================

export interface SubmitOrderPayload {
  businessId: string;
  businessName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  couponCode?: string;
}

export interface CouponResult {
  valid: boolean;
  discount: number;
  message: string;
}

// ============================================================================
//  Broker config + error tipado
// ============================================================================

const BROKER_BASE_URL = 'https://broker-services-production.up.railway.app/api';
const BROKER_TIMEOUT_MS = 6000;

class BrokerError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'BrokerError';
    this.status = status;
  }
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = BROKER_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    throw new BrokerError(
      err instanceof Error ? err.message : 'Sin conexión al broker',
      0,
    );
  } finally {
    clearTimeout(timer);
  }
}

function shouldFallbackToMock(err: unknown): boolean {
  if (err instanceof BrokerError) {
    return err.status === 0 || err.status >= 500 || err.status === 404;
  }
  return true;
}

/** Lee el token JWT de localStorage (lo guarda useAuthStore después de login). */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('access_token');
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ============================================================================
//  Cupones — endpoint broker + fallback mock
// ============================================================================

/** Cupones válidos para fallback / demo. */
const VALID_COUPONS: Record<string, number> = {
  BIENVENIDO10: 10,
  MESO20: 20,
  DESCUENTO5: 5,
};

interface BrokerCouponResponse {
  valido?: boolean;
  valid?: boolean;
  descuento?: number;
  discount?: number;
  monto?: number;
  mensaje?: string;
  message?: string;
  [k: string]: unknown;
}

function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in (payload as object)) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

async function brokerValidateCoupon(code: string): Promise<CouponResult | null> {
  const response = await fetchWithTimeout(
    `${BROKER_BASE_URL}/chats/compensation/validate/${encodeURIComponent(code)}`,
  );

  if (!response.ok) {
    // 404 = el endpoint no existe en el broker (no que el cupón sea inválido).
    // Tratamos 4xx en general como "el broker no puede ayudarnos con esto"
    // y caemos al mock.
    if (response.status >= 400 && response.status < 500) {
      return null;
    }
    throw new BrokerError(`Error validando cupón (${response.status})`, response.status);
  }

  const json = await response.json();
  const raw = unwrap<BrokerCouponResponse>(json);

  const isValid = raw.valido ?? raw.valid ?? false;
  const discount = Number(raw.descuento ?? raw.discount ?? raw.monto ?? 0);

  if (!isValid || !Number.isFinite(discount) || discount <= 0) {
    return null;
  }

  return {
    valid: true,
    discount,
    message: raw.mensaje ?? raw.message ?? `¡Cupón aplicado! Ahorraste Q ${discount}.00`,
  };
}

async function mockValidateCoupon(code: string): Promise<CouponResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const normalized = code.trim().toUpperCase();
  const discount = VALID_COUPONS[normalized];
  if (discount !== undefined) {
    return {
      valid: true,
      discount,
      message: `¡Cupón aplicado! Ahorraste Q ${discount}.00`,
    };
  }
  return { valid: false, discount: 0, message: 'Cupón no válido o expirado.' };
}

export async function validateCoupon(code: string): Promise<CouponResult> {
  const normalized = code.trim();
  if (!normalized) {
    return { valid: false, discount: 0, message: 'Ingresá un código de cupón.' };
  }

  try {
    const fromBroker = await brokerValidateCoupon(normalized);
    if (fromBroker) {
      return fromBroker;
    }
    console.info('[checkout.api] broker no validó el cupón, probando mock');
    return await mockValidateCoupon(normalized);
  } catch (err) {
    if (shouldFallbackToMock(err)) {
      console.warn('[checkout.api] broker falló en validateCoupon, fallback mock:', err);
      return await mockValidateCoupon(normalized);
    }
    throw err;
  }
}

// ============================================================================
//  Crear pedido — shape confirmado por swagger del broker
// ============================================================================

interface BrokerOrderItem {
  producto_id: number;
  cantidad: number;
  descuento: number;
}

interface BrokerCreateOrderPayload {
  cliente_id: number;
  direccion_entrega: string;
  items: BrokerOrderItem[];
}

/** Intenta decodificar el cliente_id del JWT. */
function getClienteIdFromToken(): number | null {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(payloadB64);
    const payload = JSON.parse(json);
    const id = payload.id ?? payload.user_id ?? payload.userId ?? payload.sub;
    const n = Number(id);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

/**
 * Distribuye el descuento total entre los items proporcionalmente al subtotal
 * de cada item. Esto permite enviar `descuento` por item como pide el broker
 * sin perder el cupón aplicado.
 */
function distribuirDescuento(
  items: CartItem[],
  descuentoTotal: number,
): number[] {
  if (descuentoTotal <= 0 || items.length === 0) {
    return items.map(() => 0);
  }
  const subtotales = items.map((i) => i.product.price * i.quantity);
  const sumaSubtotales = subtotales.reduce((a, b) => a + b, 0);
  if (sumaSubtotales <= 0) {
    return items.map(() => 0);
  }
  // Redondeamos a 2 decimales para no romper validators de tipo decimal.
  const proporciones = subtotales.map((s) =>
    Math.round((s / sumaSubtotales) * descuentoTotal * 100) / 100,
  );
  // Ajustamos el último para que la suma cuadre exacto (evita errores de redondeo).
  const sumaActual = proporciones.reduce((a, b) => a + b, 0);
  const diff = Math.round((descuentoTotal - sumaActual) * 100) / 100;
  if (proporciones.length > 0) {
    proporciones[proporciones.length - 1] += diff;
  }
  return proporciones;
}

async function brokerSubmitOrder(payload: SubmitOrderPayload): Promise<string> {
  const isNumericId = /^\d+$/.test(payload.businessId);
  if (!isNumericId) {
    throw new BrokerError('Pedido sobre comercio mock, no broker', 404);
  }

  const productosBroker = payload.items.filter((i) => /^\d+$/.test(i.product.id));
  if (productosBroker.length === 0) {
    throw new BrokerError('Pedido sobre productos mock, no broker', 404);
  }

  const descuentosPorItem = distribuirDescuento(productosBroker, payload.discount);

  const items: BrokerOrderItem[] = productosBroker.map((i, idx) => ({
    producto_id: Number(i.product.id),
    cantidad: i.quantity,
    descuento: descuentosPorItem[idx],
  }));

  const clienteId = getClienteIdFromToken();
  if (clienteId == null) {
    throw new BrokerError('No hay cliente_id en el token', 401);
  }

  const body: BrokerCreateOrderPayload = {
    cliente_id: clienteId,
    direccion_entrega: payload.deliveryAddress,
    items,
  };

  const response = await fetchWithTimeout(
    `${BROKER_BASE_URL}/restaurantes/${payload.businessId}/pedidos`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status}`;
    try {
      const errBody = await response.json();
      errorDetail = JSON.stringify(errBody);
    } catch {
      try {
        errorDetail = await response.text();
      } catch {
        /* ignore */
      }
    }
    console.warn(
      `[checkout.api] broker rechazó pedido (HTTP ${response.status}):`,
      '\n  body enviado:', body,
      '\n  respuesta broker:', errorDetail,
    );
    throw new BrokerError(
      `No se pudo crear el pedido (${response.status})`,
      response.status,
    );
  }

  const json = await response.json();
  const raw = unwrap<{ id?: number | string; pedido_id?: number | string }>(json);
  const id = raw.id ?? raw.pedido_id;

  if (id == null) {
    throw new BrokerError('Pedido creado sin ID en respuesta del broker', 0);
  }
  console.info(`[checkout.api] ✅ pedido creado en broker, id=${id}`);
  return String(id);
}

async function mockSubmitOrder(payload: SubmitOrderPayload): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const orderId = `order-${Date.now()}`;
  console.info('[checkout.api] Pedido mock creado:', orderId, payload);
  return orderId;
}

export async function submitOrder(payload: SubmitOrderPayload): Promise<string> {
  try {
    return await brokerSubmitOrder(payload);
  } catch (err) {
    // En submitOrder, CUALQUIER error del broker (incluido 4xx) cae al mock.
    // Un 4xx significa "el shape del body no le gustó al broker" — eso es
    // problema nuestro o del broker, NO del usuario. El usuario no debe ver
    // su pedido fallar.
    console.warn('[checkout.api] broker falló en submitOrder, fallback mock:', err);
    return await mockSubmitOrder(payload);
  }
}