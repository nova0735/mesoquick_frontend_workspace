// src/features/orders/model/orders.types.ts

import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
} from '@shared/types';

export type { Order, OrderItem, OrderStatus, PaymentMethod };

// ─── Estado del store ──────────────────────────────────────────────────────
export interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

// ─── Acciones del store ────────────────────────────────────────────────────
export interface OrdersActions {
  fetchOrders: (userId: string) => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  selectOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  clearError: () => void;
}

// ─── Store completo ────────────────────────────────────────────────────────
export type OrdersStore = OrdersState & OrdersActions;

// ─── Estado del hook de tracking ──────────────────────────────────────────
export interface TrackingState {
  order: Order | null;
  isLoading: boolean;
  error: string | null;
}

// ─── Un paso del timeline ──────────────────────────────────────────────────
export interface TimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  icon: string;
}

// ─── Secuencia de estados (para la simulación del tracking) ───────────────
export const ORDER_STATUS_FLOW = [
  'pending',
  'confirmed',
  'preparing',
  'on_the_way',
  'delivered',
] as const;

// ─── Config visual por estado ──────────────────────────────────────────────
export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  description: string;
  icon: string;
}

export const ORDER_STATUS_CONFIG: { [key: string]: StatusConfig } = {
  pending: {
    label: 'Pendiente',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: 'Tu pedido esta esperando confirmacion',
    icon: 'Clock',
  },
  confirmed: {
    label: 'Confirmado',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'El restaurante acepto tu pedido',
    icon: 'CheckCircle',
  },
  preparing: {
    label: 'Preparando',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: 'Estan preparando tu pedido',
    icon: 'ChefHat',
  },
  on_the_way: {
    label: 'En camino',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: 'Tu repartidor ya viene en camino',
    icon: 'Bike',
  },
  delivered: {
    label: 'Entregado',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Tu pedido fue entregado',
    icon: 'PackageCheck',
  },
  cancelled: {
    label: 'Cancelado',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: 'Este pedido fue cancelado',
    icon: 'XCircle',
  },
};