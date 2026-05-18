
import { create } from 'zustand';
import { fetchOrdersByUser, fetchOrderById } from '../api/orders.api';
import type { OrdersStore, OrderStatus } from './orders.types';

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
      set({ orders, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar pedidos';
      set({ error: message, isLoading: false });
    }
  },

  // ─── Cargar un pedido específico por ID ──────────────────────────────────
  fetchOrderById: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const order = await fetchOrderById(orderId);
      set({ selectedOrder: order, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar el pedido';
      set({ error: message, isLoading: false });
    }
  },

  // ─── Seleccionar / deseleccionar un pedido ────────────────────────────────
  selectOrder: (order) => {
    set({ selectedOrder: order });
  },

  // ─── Actualizar el estado de un pedido en memoria ────────────────────────
  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    const { orders, selectedOrder } = get();

    // Actualiza en la lista general
    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status } : o
    );

    // Actualiza también el pedido seleccionado si es el mismo
    const updatedSelected =
      selectedOrder?.id === orderId
        ? { ...selectedOrder, status }
        : selectedOrder;

    set({ orders: updatedOrders, selectedOrder: updatedSelected });
  },

  // ─── Limpiar errores ──────────────────────────────────────────────────────
  clearError: () => set({ error: null }),
}));