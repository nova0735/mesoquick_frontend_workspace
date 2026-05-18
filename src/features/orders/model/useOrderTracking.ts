import { useState, useEffect, useRef } from 'react';
import { fetchOrderById } from '../api/orders.api';
import { ORDER_STATUS_FLOW } from './orders.types';
import type { TrackingState, OrderStatus } from './orders.types';

// Intervalo en milisegundos entre cada cambio de estado (8 segundos)
const TRACKING_INTERVAL_MS = 8000;

export function useOrderTracking(orderId: string): TrackingState {
  const [state, setState] = useState<TrackingState>({
    order: null,
    isLoading: true,
    error: null,
  });

  // Usamos useRef para guardar el interval y poder limpiarlo
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!orderId) return;

    // 1. Cargamos el pedido inicial
    setState({ order: null, isLoading: true, error: null });

    fetchOrderById(orderId)
      .then((order) => {
        setState({ order, isLoading: false, error: null });

        // 2. Si ya está entregado o cancelado, no iniciamos el interval
        if (order.status === 'delivered' || order.status === 'cancelled') {
          return;
        }

        // 3. Iniciamos la simulación de avance de estados
        intervalRef.current = setInterval(() => {
          setState((prev) => {
            if (!prev.order) return prev;

            const currentIndex = ORDER_STATUS_FLOW.indexOf(
              prev.order.status as typeof ORDER_STATUS_FLOW[number]
            );

            // Si ya llegamos al último estado, detenemos el interval
            const isLastStatus = currentIndex >= ORDER_STATUS_FLOW.length - 1;
            if (isLastStatus) {
              clearTracking();
              return prev;
            }

            // Avanzamos al siguiente estado
            const nextStatus = ORDER_STATUS_FLOW[currentIndex + 1] as OrderStatus;
            const updatedOrder = { ...prev.order, status: nextStatus };

            // Si llegamos a 'delivered', detenemos el interval
            if (nextStatus === 'delivered') {
              clearTracking();
            }

            return { ...prev, order: updatedOrder };
          });
        }, TRACKING_INTERVAL_MS);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Error al rastrear pedido';
        setState({ order: null, isLoading: false, error: message });
      });

    // Limpieza al desmontar el componente o cambiar de pedido
    return () => clearTracking();
  }, [orderId]);

  return state;
}