// src/features/orders/api/orders.api.ts
//
// Capa de pedidos. broker-first + fallback mock.
//
// IMPORTANTE: El broker organiza pedidos bajo /api/restaurantes/{id}/pedidos.
// Como NO existe "pedidos por cliente" directo, las funciones que reciben
// solo orderId mantienen el mock como fuente principal. Para acceder al
// broker se exporta una variante extra `fetchBrokerOrderById(restauranteId, pedidoId)`
// y `updateBrokerOrderStatus(restauranteId, pedidoId, status)` que el store
// y los hooks usan cuando saben el businessId.
//
// Las firmas originales (fetchOrdersByUser, fetchOrderById, updateOrderStatusApi)
// mantienen compatibilidad y caen al mock — así no rompemos consumidores.

import { ordersMock } from '@shared/mocks';
import type { Order, OrderStatus, OrderItem, PaymentMethod } from './../model/orders.types';

// ============================================================================
//  Broker config
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

function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in (payload as object)) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

// ============================================================================
//  Mapping broker -> shape interno
// ============================================================================

interface BrokerOrderItem {
  id?: number | string;
  producto_id: number | string;
  producto_nombre?: string;
  nombre?: string;
  cantidad: number;
  precio_unitario: number | string;
  subtotal?: number | string;
}

interface BrokerOrder {
  id: number | string;
  restaurante_id: number | string;
  restaurante_nombre?: string;
  cliente_id?: number | string;
  estado: string;
  estado_id?: number;
  metodo_pago?: string;
  direccion_entrega?: string;
  subtotal: number | string;
  costo_envio?: number | string;
  descuento?: number | string;
  total: number | string;
  cupon?: string;
  fecha_creacion?: string;
  fecha_estimada?: string;
  items?: BrokerOrderItem[];
  [k: string]: unknown;
}

function mapBrokerStatusToOrderStatus(s: string): OrderStatus {
  const norm = (s ?? '').toLowerCase().replace(/\s+/g, '_');
  switch (norm) {
    case 'pendiente':
    case 'pending':
      return 'pending';
    case 'confirmado':
    case 'aceptado':
    case 'confirmed':
      return 'confirmed';
    case 'preparando':
    case 'en_preparacion':
    case 'preparing':
      return 'preparing';
    case 'en_camino':
    case 'en_ruta':
    case 'enviado':
    case 'on_the_way':
      return 'on_the_way';
    case 'entregado':
    case 'completado':
    case 'delivered':
      return 'delivered';
    case 'cancelado':
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
}

function mapOrderStatusToBroker(s: OrderStatus): string {
  switch (s) {
    case 'pending':
      return 'pendiente';
    case 'confirmed':
      return 'confirmado';
    case 'preparing':
      return 'preparando';
    case 'on_the_way':
      return 'en_camino';
    case 'delivered':
      return 'entregado';
    case 'cancelled':
      return 'cancelado';
  }
}

function mapBrokerPaymentToPaymentMethod(pm: string | undefined): PaymentMethod {
  const norm = (pm ?? '').toLowerCase();
  if (norm.includes('credito') || norm.includes('credit')) return 'credit_card';
  if (norm.includes('debito') || norm.includes('debit')) return 'debit_card';
  return 'cash';
}

function toNum(v: number | string | undefined, fallback = 0): number {
  if (v == null) return fallback;
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return Number.isFinite(n) ? n : fallback;
}

function mapBrokerOrderToOrder(raw: BrokerOrder, currentUserId: string): Order {
  const items: OrderItem[] = (raw.items ?? []).map((it) => ({
    productId: String(it.producto_id),
    productName: it.producto_nombre ?? it.nombre ?? `Producto ${it.producto_id}`,
    quantity: it.cantidad,
    price: toNum(it.precio_unitario),
    subtotal: toNum(it.subtotal, toNum(it.precio_unitario) * it.cantidad),
  }));

  return {
    id: String(raw.id),
    userId: raw.cliente_id != null ? String(raw.cliente_id) : currentUserId,
    businessId: String(raw.restaurante_id),
    businessName: raw.restaurante_nombre ?? `Restaurante ${raw.restaurante_id}`,
    items,
    status: mapBrokerStatusToOrderStatus(raw.estado),
    paymentMethod: mapBrokerPaymentToPaymentMethod(raw.metodo_pago),
    deliveryAddress: raw.direccion_entrega ?? '',
    subtotal: toNum(raw.subtotal),
    deliveryFee: toNum(raw.costo_envio),
    discount: toNum(raw.descuento),
    total: toNum(raw.total),
    createdAt: raw.fecha_creacion ?? new Date().toISOString(),
    estimatedDelivery: raw.fecha_estimada ?? new Date(Date.now() + 35 * 60_000).toISOString(),
    couponCode: raw.cupon,
  };
}

function getCurrentUserId(): string {
  if (typeof window === 'undefined') return '';
  try {
    const raw = localStorage.getItem('mesoquick-auth');
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.id ?? '';
  } catch {
    return '';
  }
}

// ============================================================================
//  Broker — funciones públicas (las usan store / tracking cuando saben el businessId)
// ============================================================================

/**
 * Refresca un pedido desde el broker. Devuelve null si broker falla — el caller
 * decide si conservar el estado local.
 */
export async function fetchBrokerOrderById(
  restauranteId: string,
  pedidoId: string,
): Promise<Order | null> {
  if (!/^\d+$/.test(restauranteId) || !/^\d+$/.test(pedidoId)) {
    return null;
  }
  try {
    const response = await fetchWithTimeout(
      `${BROKER_BASE_URL}/restaurantes/${restauranteId}/pedidos/${pedidoId}`,
      { headers: { ...authHeaders() } },
    );
    if (!response.ok) {
      throw new BrokerError(
        `Pedido ${pedidoId} no disponible (${response.status})`,
        response.status,
      );
    }
    const json = await response.json();
    const raw = unwrap<BrokerOrder>(json);
    if (!raw || !raw.id) {
      return null;
    }
    return mapBrokerOrderToOrder(raw, getCurrentUserId());
  } catch (err) {
    if (shouldFallbackToMock(err)) {
      console.warn(
        `[orders.api] broker falló en fetchBrokerOrderById(${restauranteId}, ${pedidoId}):`,
        err,
      );
      return null;
    }
    throw err;
  }
}

/**
 * Sincroniza un cambio de estado con el broker. Si falla, no rompe la UX —
 * el caller ya hizo el cambio local y eso es lo que ve el usuario.
 * Devuelve true si el broker confirmó, false en cualquier otro caso.
 */
export async function updateBrokerOrderStatus(
  restauranteId: string,
  pedidoId: string,
  status: OrderStatus,
): Promise<boolean> {
  if (!/^\d+$/.test(restauranteId) || !/^\d+$/.test(pedidoId)) {
    return false;
  }
  try {
    const response = await fetchWithTimeout(
      `${BROKER_BASE_URL}/restaurantes/${restauranteId}/pedidos/${pedidoId}/estado`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({ estado: mapOrderStatusToBroker(status) }),
      },
    );
    return response.ok;
  } catch (err) {
    console.warn(
      `[orders.api] broker falló al actualizar estado de ${pedidoId}:`,
      err,
    );
    return false;
  }
}

// ============================================================================
//  Mock (fallback + compatibilidad con la API anterior)
// ============================================================================

const fakeDelay = (ms = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchOrdersByUser(userId: string): Promise<Order[]> {
  await fakeDelay();
  const orders = ordersMock.filter((o) => o.userId === userId);
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function fetchOrderById(orderId: string): Promise<Order> {
  await fakeDelay(300);
  const order = ordersMock.find((o) => o.id === orderId);
  if (!order) {
    throw new Error(`Pedido con ID "${orderId}" no encontrado.`);
  }
  return order;
}

export async function updateOrderStatusApi(
  orderId: string,
  status: OrderStatus,
): Promise<Order> {
  await fakeDelay(200);
  const order = ordersMock.find((o) => o.id === orderId);
  if (!order) {
    // El caller decide qué hacer; pero devolvemos un shape mínimo válido
    return {
      id: orderId,
      userId: getCurrentUserId(),
      businessId: '',
      businessName: '',
      items: [],
      status,
      paymentMethod: 'cash',
      deliveryAddress: '',
      subtotal: 0,
      deliveryFee: 0,
      discount: 0,
      total: 0,
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 30 * 60_000).toISOString(),
    };
  }
  return { ...order, status };
}
