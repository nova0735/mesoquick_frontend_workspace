// src/features/orders/ui/OrderList.tsx

import { ShoppingBag } from 'lucide-react';
import { Spinner, EmptyState } from '@shared/ui';
import { OrderCard } from './OrderCard';
import type { Order } from '../model/orders.types';

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

export function OrderList({ orders, isLoading, error }: OrderListProps) {
  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-text/60 text-sm">Cargando tus pedidos...</p>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-600 font-medium">Ocurrió un error</p>
        <p className="text-red-500 text-sm mt-1">{error}</p>
      </div>
    );
  }

  // Sin pedidos
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="w-12 h-12 text-text/30" />}
        title="Sin pedidos aún"
        description="Cuando realices tu primer pedido aparecerá aquí"
      />
    );
  }

  // Separar activos de historial
  const activeOrders = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  );
  const pastOrders = orders.filter(
    (o) => o.status === 'delivered' || o.status === 'cancelled'
  );

  return (
    <div className="space-y-6">
      {/* Pedidos activos */}
      {activeOrders.length > 0 && (
        <section>
          <h2 className="text-text-heading font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            En curso ({activeOrders.length})
          </h2>
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}

      {/* Historial */}
      {pastOrders.length > 0 && (
        <section>
          <h2 className="text-text-heading font-semibold mb-3">
            Historial
          </h2>
          <div className="space-y-3">
            {pastOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}