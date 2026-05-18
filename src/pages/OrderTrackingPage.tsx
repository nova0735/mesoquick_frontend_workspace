import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { ROUTES } from '@app/router/routes';
import { useOrderTracking } from '@features/orders/model/useOrderTracking';
import { useOrdersStore } from '@features/orders/model/useOrdersStore';
import { OrderDetail } from '@features/orders/ui/OrderDetail';
import { Button, Modal, toast } from '@shared/ui';
import type { OrderStatus } from '@features/orders/model/orders.types';

/**
 * Estados desde los cuales se puede cancelar un pedido.
 * Una vez en preparación, ya no.
 */
const CANCELLABLE_STATUSES: OrderStatus[] = ['pending', 'confirmed'];

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();

  // Si no hay orderId en la URL, redirige al historial
  if (!orderId) {
    return <Navigate to={ROUTES.ORDERS} replace />;
  }

  const { order, isLoading, error } = useOrderTracking(orderId);
  const cancelOrderInStore = useOrdersStore((s) => s.cancelOrder);

  // Estado del modal de confirmación de cancelación
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleAskCancel = () => setIsConfirmOpen(true);
  const handleDismissCancel = () => setIsConfirmOpen(false);

  const handleConfirmCancel = () => {
    if (!orderId) return;
    const success = cancelOrderInStore(orderId);
    setIsConfirmOpen(false);

    if (success) {
      toast.success('Pedido cancelado correctamente.');
    } else {
      // Esto solo pasaría si el estado cambió justo antes de cancelar
      toast.error('No se pudo cancelar: el pedido ya esta en preparacion.');
    }
  };

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
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Botón de cancelar — solo visible si el estado lo permite */}
      {canCancel && (
        <div className="flex justify-end">
          <Button
            variant="danger"
            size="sm"
            onClick={handleAskCancel}
            leftIcon={<XCircle className="w-4 h-4" />}
          >
            Cancelar pedido
          </Button>
        </div>
      )}

      <OrderDetail order={order} isLive={isLive} />

      {/* Modal de confirmación de cancelación */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={handleDismissCancel}
        title="¿Cancelar este pedido?"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleDismissCancel}>
              No, mantener pedido
            </Button>
            <Button variant="danger" onClick={handleConfirmCancel}>
              Sí, cancelar
            </Button>
          </div>
        }
      >
        <p className="text-text">
          Esta acción no se puede deshacer. Una vez cancelado, tendrías
          que armar el pedido de nuevo si querés ordenarlo.
        </p>
        <p className="text-sm text-text/70 mt-2">
          <strong className="text-text-heading">Importante:</strong> solo
          podés cancelar mientras el comercio no haya empezado a preparar
          tu pedido.
        </p>
      </Modal>
    </main>
  );
}