import { useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useOrdersStore } from '@features/orders/model/useOrdersStore';
import { OrderList } from '@features/orders/ui/OrderList';
import { userMock } from '@shared/mocks';

export default function OrdersPage() {
  const { orders, isLoading, error, fetchOrders } = useOrdersStore();

  useEffect(() => {
    fetchOrders(userMock.id);
  }, [fetchOrders]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      {/* Título */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-accent-bg p-2 rounded-xl">
          <ShoppingBag className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-text-heading font-bold text-xl">
            Mis pedidos
          </h1>
          <p className="text-text/50 text-sm">
            Historial y seguimiento de tus pedidos
          </p>
        </div>
      </div>

      {/* Lista de pedidos */}
      <OrderList
        orders={orders}
        isLoading={isLoading}
        error={error}
      />
    </main>
  );
}