import { create } from 'zustand';
import { fetchOrdersByUser, fetchOrderById } from '../api/orders.api';
import type { OrdersStore, OrderStatus, Order } from './orders.types';

/**
 * Estados desde los cuales se permite cancelar un pedido.
 * Una vez que el comercio empieza a preparar, ya no se puede.
 */
const CANCELLABLE_STATUSES: OrderStatus[] = ['pending', 'confirmed'];

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  // ─── Estado inicial ──────────────────────────────────────────────────────
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,

  // ─── Cargar todos los pedidos de un usuario ──────────────────────────────
  fetchOrders: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await fetchOrdersByUser(userId);
      // Preserva pedidos creados localmente que aún no están en el backend.
      const localOrders = get().orders.filter(
        (o) => !orders.find((srv) => srv.id === o.id)
      );
      set({ orders: [...localOrders, ...orders], isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar pedidos';
      set({ error: message, isLoading: false });
    }
  },

  // ─── Cargar un pedido específico por ID ──────────────────────────────────
  fetchOrderById: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const local = get().orders.find((o) => o.id === orderId);
      if (local) {
        set({ selectedOrder: local, isLoading: false });
        return;
      }
      const order = await fetchOrderById(orderId);
      set({ selectedOrder: order, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar el pedido';
      set({ error: message, isLoading: false });
    }
  },

  // ─── Agregar un pedido recién creado (desde checkout) ────────────────────
  addOrder: (order: Order) => {
    set((state) => ({
      orders: [order, ...state.orders],
      selectedOrder: order,
    }));
  },

  // ─── Cancelar un pedido ───────────────────────────────────────────────────
  /**
   * Cancela un pedido si su estado lo permite (pending o confirmed).
   * Una vez en preparación, en camino, o entregado, no se puede cancelar.
   * Devuelve true si la cancelación procedió, false si fue rechazada.
   */
  cancelOrder: (orderId: string): boolean => {
    const { orders, selectedOrder } = get();
    const target = orders.find((o) => o.id === orderId);

    // El pedido no existe o ya no es cancelable
    if (!target || !CANCELLABLE_STATUSES.includes(target.status)) {
      return false;
    }

    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus } : o
    );

    const updatedSelected =
      selectedOrder?.id === orderId
        ? { ...selectedOrder, status: 'cancelled' as OrderStatus }
        : selectedOrder;

    set({ orders: updatedOrders, selectedOrder: updatedSelected });
    return true;
  },

  // ─── Seleccionar / deseleccionar un pedido ────────────────────────────────
  selectOrder: (order) => {
    set({ selectedOrder: order });
  },

  // ─── Actualizar el estado de un pedido en memoria ────────────────────────
  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    const { orders, selectedOrder } = get();

    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status } : o
    );

    const updatedSelected =
      selectedOrder?.id === orderId
        ? { ...selectedOrder, status }
        : selectedOrder;

    set({ orders: updatedOrders, selectedOrder: updatedSelected });
  },

  // ─── Limpiar errores ──────────────────────────────────────────────────────
  clearError: () => set({ error: null }),
}));