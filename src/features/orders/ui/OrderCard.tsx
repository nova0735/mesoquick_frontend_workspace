// src/features/orders/ui/OrderCard.tsx

import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Clock } from 'lucide-react';
import { Card, Button } from '@shared/ui';
import { formatPrice, formatRelativeTime } from '@shared/lib/formatters';
import { buildRoute } from '@app/router/routes';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { Order } from '../model/orders.types';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate();

  const handleTrack = () => {
    navigate(buildRoute.orderTracking(order.id));
  };

  const isActive =
    order.status !== 'delivered' && order.status !== 'cancelled';

  return (
    <Card className="p-4 border border-border bg-bg hover:shadow-md transition-shadow">
      {/* Encabezado: negocio + estado */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-accent-bg p-2 rounded-lg">
            <ShoppingBag className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-text-heading text-sm">
              {order.businessName}
            </p>
            <div className="flex items-center gap-1 text-xs text-text/60 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>{formatRelativeTime(order.createdAt)}</span>
            </div>
          </div>
        </div>
        <OrderStatusBadge status={order.status} size="sm" />
      </div>

      {/* Items del pedido */}
      <div className="mb-3 space-y-1">
        {order.items.slice(0, 2).map((item) => (
          <p key={item.productId} className="text-xs text-text/70">
            {item.quantity}x {item.productName}
          </p>
        ))}
        {order.items.length > 2 && (
          <p className="text-xs text-text/50">
            +{order.items.length - 2} producto(s) más
          </p>
        )}
      </div>

      {/* Total + botón */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div>
          <p className="text-xs text-text/50">Total</p>
          <p className="font-bold text-text-heading">
            {formatPrice(order.total)}
          </p>
        </div>

        <Button
          onClick={handleTrack}
          className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
            isActive
              ? 'bg-accent text-white hover:bg-accent/90'
              : 'border border-border text-text hover:bg-accent-bg'
          }`}
        >
          {isActive ? 'Rastrear' : 'Ver detalle'}
          <ChevronRight className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
}