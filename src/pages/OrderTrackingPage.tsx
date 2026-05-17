import { useParams, Navigate } from 'react-router-dom';
import { ROUTES } from '@app/router/routes';
import { useOrderTracking } from '@features/orders/model/useOrderTracking';
import { OrderDetail } from '@features/orders/ui/OrderDetail';

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();

  // Si no hay orderId en la URL, redirige al historial
  if (!orderId) {
    return <Navigate to={ROUTES.ORDERS} replace />;
  }

  const { order, isLoading, error } = useOrderTracking(orderId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3 py-16">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-text/60 text-sm">Cargando seguimiento...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-semibold">No se encontró el pedido</p>
          <p className="text-red-400 text-sm mt-1">
            {error ?? 'El pedido no existe o fue eliminado'}
          </p>
        </div>
      </main>
    );
  }

  const isLive = order.status !== 'delivered' && order.status !== 'cancelled';

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <OrderDetail order={order} isLive={isLive} />
    </main>
  );
}