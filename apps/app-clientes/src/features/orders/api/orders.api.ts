// src/features/orders/api/orders.api.ts

import { ordersMock } from '@shared/mocks';
import type { Order, OrderStatus } from '../model/orders.types';

// Simula el delay de red (entre 400ms y 800ms)
const fakeDelay = (ms = 600): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ─── Obtener todos los pedidos de un usuario ───────────────────────────────
export async function fetchOrdersByUser(userId: string): Promise<Order[]> {
  await fakeDelay();

  const orders = ordersMock.filter((order) => order.userId === userId);

  // Ordenamos del más reciente al más antiguo
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// ─── Obtener un pedido por su ID ───────────────────────────────────────────
export async function fetchOrderById(orderId: string): Promise<Order> {
  await fakeDelay(400);

  const order = ordersMock.find((o) => o.id === orderId);

  if (!order) {
    throw new Error(`Pedido con ID "${orderId}" no encontrado.`);
  }

  return order;
}

// ─── Simular actualización de estado (cuando llegue el broker, se reemplaza) ─
export async function updateOrderStatusApi(
  orderId: string,
  status: OrderStatus
): Promise<Order> {
  await fakeDelay(300);

  const order = ordersMock.find((o) => o.id === orderId);

  if (!order) {
    throw new Error(`No se pudo actualizar el pedido "${orderId}".`);
  }

  // Retornamos el pedido con el nuevo estado (el mock es inmutable,
  // el store guarda el estado actualizado en memoria)
  return { ...order, status };
}