import { useState, useEffect, useRef } from 'react';
import { fetchOrderById, fetchBrokerOrderById, updateBrokerOrderStatus } from '../api/orders.api';
import { useOrdersStore } from './useOrdersStore';
import { ORDER_STATUS_FLOW } from './orders.types';
import type { TrackingState, OrderStatus, Order } from './orders.types';

// ============================================================================
//  Tracking en tiempo real. Estrategia:
//  1) Resolvemos el pedido inicial (store local o mock).
//  2) Si el pedido tiene businessId numérico (broker), arrancamos polling
//     contra GET /api/logistica/entregas/{id}. Si responde, usamos su estado.
//  3) Si el broker falla, caemos a la simulación local con setInterval
//     avanzando por ORDER_STATUS_FLOW cada 8s.
// ============================================================================

const TRACKING_INTERVAL_MS = 8000;
const BROKER_BASE_URL = 'https://broker-services-production.up.railway.app/api';
const BROKER_TIMEOUT_MS = 5000;

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

function mapBrokerStatusToOrderStatus(s: string): OrderStatus | null {
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
    case 'en_transito':
      return 'on_the_way';
    case 'entregado':
    case 'completado':
    case 'delivered':
      return 'delivered';
    case 'cancelado':
    case 'cancelled':
      return 'cancelled';
    default:
      return null;
  }
}

/**
 * Pega a /api/logistica/entregas/{id} (timeout 5s) y devuelve el estado mapeado.
 * Si broker falla o no entiende la respuesta, devuelve null.
 */
async function fetchBrokerLogisticsStatus(orderId: string): Promise<OrderStatus | null> {
  if (!/^\d+$/.test(orderId)) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), BROKER_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${BROKER_BASE_URL}/logistica/entregas/${orderId}`,
      {
        headers: { ...authHeaders() },
        signal: controller.signal,
      },
    );
    if (!response.ok) return null;

    const json = await response.json();
    const raw = unwrap<{ estado?: string; status?: string }>(json);
    const status = raw?.estado ?? raw?.status;
    if (!status) return null;

    return mapBrokerStatusToOrderStatus(status);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function useOrderTracking(orderId: string): TrackingState {
  const [state, setState] = useState<TrackingState>({
    order: null,
    isLoading: true,
    error: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const brokerAliveRef = useRef<boolean>(true);
  // Mantenemos un ref con el estado actual para que el setInterval
  // siempre lea el último valor sin re-crear el timer.
  const stateRef = useRef<TrackingState>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const clearTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Suscripción al store: si el pedido se cancela desde otro lado
  // (ej. el botón de cancelar), refleja el cambio acá inmediatamente.
  const storeOrder = useOrdersStore((s) =>
    s.orders.find((o) => o.id === orderId),
  );

  useEffect(() => {
    if (!storeOrder) return;
    if (storeOrder.status === 'cancelled') {
      clearTracking();
      setState({ order: storeOrder, isLoading: false, error: null });
    }
  }, [storeOrder?.status]);

  useEffect(() => {
    if (!orderId) return;

    setState({ order: null, isLoading: true, error: null });

    const resolveOrder = async (): Promise<Order> => {
      const localOrder = useOrdersStore
        .getState()
        .orders.find((o) => o.id === orderId);

      if (localOrder) {
        // Si el pedido es del broker, intentamos refrescarlo con la última
        // info real (status puede haber cambiado en backoffice).
        if (/^\d+$/.test(localOrder.businessId) && /^\d+$/.test(orderId)) {
          const fresh = await fetchBrokerOrderById(localOrder.businessId, orderId);
          if (fresh) return fresh;
        }
        return localOrder;
      }

      return await fetchOrderById(orderId);
    };

    resolveOrder()
      .then((order) => {
        setState({ order, isLoading: false, error: null });

        // No iniciar polling si ya está en estado final
        if (
          order.status === 'delivered' ||
          order.status === 'cancelled'
        ) {
          return;
        }

        intervalRef.current = setInterval(async () => {
          // Snapshot del estado actual para decidir qué hacer
          const currentState = stateRef.current;
          if (!currentState.order) return;

          if (currentState.order.status === 'cancelled') {
            clearTracking();
            return;
          }

          // 1) Si el broker estuvo vivo en la última vuelta, intentamos broker
          let nextStatus: OrderStatus | null = null;
          if (brokerAliveRef.current) {
            nextStatus = await fetchBrokerLogisticsStatus(orderId);
            if (nextStatus == null) {
              // broker fallido — marcamos como muerto y caemos al simulador
              brokerAliveRef.current = false;
            }
          }

          // 2) Fallback: avanzar localmente por el flujo
          if (nextStatus == null) {
            const currentIndex = ORDER_STATUS_FLOW.indexOf(
              currentState.order.status as typeof ORDER_STATUS_FLOW[number],
            );
            const isLastStatus = currentIndex >= ORDER_STATUS_FLOW.length - 1;
            if (isLastStatus) {
              clearTracking();
              return;
            }
            nextStatus = ORDER_STATUS_FLOW[currentIndex + 1] as OrderStatus;
          }

          // Si no hubo cambio, no hacemos nada
          if (nextStatus === currentState.order.status) {
            return;
          }

          const updatedOrder = { ...currentState.order, status: nextStatus };
          setState({ ...currentState, order: updatedOrder });

          // Sincronizar con store global
          useOrdersStore.getState().updateOrderStatus(orderId, nextStatus);

          // Si tenemos businessId del broker, propagamos el cambio
          // (fire-and-forget — el local manda)
          if (
            /^\d+$/.test(updatedOrder.businessId) &&
            /^\d+$/.test(orderId) &&
            brokerAliveRef.current
          ) {
            void updateBrokerOrderStatus(
              updatedOrder.businessId,
              orderId,
              nextStatus,
            );
          }

          if (nextStatus === 'delivered' || nextStatus === 'cancelled') {
            clearTracking();
          }
        }, TRACKING_INTERVAL_MS);
      })
      .catch((err) => {
        const message =
          err instanceof Error ? err.message : 'Error al rastrear pedido';
        setState({ order: null, isLoading: false, error: message });
      });

    return () => clearTracking();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return state;
}
