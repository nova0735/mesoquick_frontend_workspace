// src/features/orders/ui/OrderDetail.tsx

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Headphones, CreditCard, MapPin, Clock } from 'lucide-react';
import { Card, Button } from '@shared/ui';
import { formatPrice, formatDate } from '@shared/lib/formatters';
import { ROUTES } from '@app/router/routes';
import { OrderStatusBadge } from './OrderStatusBadge';
import { TrackingTimeline } from './TrackingTimeline';
import { TrackingMap } from './TrackingMap';
import type { Order } from '../model/orders.types';

interface OrderDetailProps {
  order: Order;
  isLive?: boolean;
}

const PAYMENT_LABEL: Record<string, string> = {
  cash: 'Efectivo',
  credit_card: 'Tarjeta de crédito',
  debit_card: 'Tarjeta de débito',
};

export function OrderDetail({ order, isLive = false }: OrderDetailProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-text/60 hover:text-text transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Info del negocio */}
      <Card className="p-4 border border-border">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-text-heading font-bold text-lg">
              {order.businessName}
            </h1>
            <div className="flex items-center gap-1 text-text/50 text-xs mt-1">
              <Clock className="w-3 h-3" />
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>
          {isLive && (
            <div className="flex items-center gap-1.5 bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              En vivo
            </div>
          )}
        </div>
      </Card>

      {/* Mapa (solo si está activo) */}
      {order.status !== 'cancelled' && order.status !== 'pending' && (
        <TrackingMap
          status={order.status}
          businessName={order.businessName}
          deliveryAddress={order.deliveryAddress}
        />
      )}

      {/* Timeline */}
      <Card className="p-4 border border-border">
        <h2 className="font-semibold text-text-heading mb-4">
          Estado del pedido
        </h2>
        <TrackingTimeline currentStatus={order.status} />
      </Card>

      {/* Productos */}
      <Card className="p-4 border border-border">
        <h2 className="font-semibold text-text-heading mb-3">
          Productos
        </h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-text/80">
                {item.quantity}x {item.productName}
              </span>
              <span className="text-text-heading font-medium">
                {formatPrice(item.subtotal)}
              </span>
            </div>
          ))}
        </div>

        {/* Resumen de costos */}
        <div className="mt-4 pt-3 border-t border-border space-y-1.5">
          <div className="flex justify-between text-sm text-text/60">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-text/60">
            <span>Envío</span>
            <span>{formatPrice(order.deliveryFee)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Descuento</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-text-heading pt-1 border-t border-border">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </Card>

      {/* Info de entrega y pago */}
      <Card className="p-4 border border-border space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-text/50">Dirección de entrega</p>
            <p className="text-sm text-text-heading">{order.deliveryAddress}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CreditCard className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-text/50">Método de pago</p>
            <p className="text-sm text-text-heading">
              {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
            </p>
          </div>
        </div>
      </Card>

      {/* Botón soporte — SOLO navega, no implementa */}
      <Button
        onClick={() => navigate(ROUTES.SUPPORT)}
        className="w-full flex items-center justify-center gap-2 border border-border text-text hover:bg-accent-bg transition-colors py-3 rounded-xl text-sm font-medium"
      >
        <Headphones className="w-4 h-4" />
        Solicitar soporte
      </Button>
    </div>
  );
}