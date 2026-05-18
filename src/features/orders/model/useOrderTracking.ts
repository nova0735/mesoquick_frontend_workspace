import { useState, useEffect, useRef } from 'react';
import { fetchOrderById } from '../api/orders.api';
import { useOrdersStore } from './useOrdersStore';
import { ORDER_STATUS_FLOW } from './orders.types';
import type { TrackingState, OrderStatus, Order } from './orders.types';

const TRACKING_INTERVAL_MS = 8000;

export function useOrderTracking(orderId: string): TrackingState {
  const [state, setState] = useState<TrackingState>({
    order: null,
    isLoading: true,
    error: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Suscripción al store: si el pedido se cancela desde otro lado
  // (ej. el botón de cancelar), refleja el cambio acá inmediatamente.
  const storeOrder = useOrdersStore((s) =>
    s.orders.find((o) => o.id === orderId)
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
        return localOrder;
      }

      return await fetchOrderById(orderId);
    };

    resolveOrder()
      .then((order) => {
        setState({ order, isLoading: false, error: null });

        // No iniciar interval si ya está en estado final
        if (
          order.status === 'delivered' ||
          order.status === 'cancelled'
        ) {
          return;
        }

        intervalRef.current = setInterval(() => {
          setState((prev) => {
            if (!prev.order) return prev;

            // Si fue cancelado en otra parte, detener
            if (prev.order.status === 'cancelled') {
              clearTracking();
              return prev;
            }

            const currentIndex = ORDER_STATUS_FLOW.indexOf(
              prev.order.status as typeof ORDER_STATUS_FLOW[number]
            );

            const isLastStatus = currentIndex >= ORDER_STATUS_FLOW.length - 1;
            if (isLastStatus) {
              clearTracking();
              return prev;
            }

            const nextStatus = ORDER_STATUS_FLOW[currentIndex + 1] as OrderStatus;
            const updatedOrder = { ...prev.order, status: nextStatus };

            // Sincronizar también con el store global
            useOrdersStore.getState().updateOrderStatus(orderId, nextStatus);

            if (nextStatus === 'delivered') {
              clearTracking();
            }

            return { ...prev, order: updatedOrder };
          });
        }, TRACKING_INTERVAL_MS);
      })
      .catch((err) => {
        const message =
          err instanceof Error ? err.message : 'Error al rastrear pedido';
        setState({ order: null, isLoading: false, error: message });
      });

    return () => clearTracking();
  }, [orderId]);

  return state;
}