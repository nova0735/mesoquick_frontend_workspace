import { Badge } from '@shared/ui';
import { ORDER_STATUS_CONFIG } from '../model/orders.types';
import type { OrderStatus } from '../model/orders.types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];

  if (!config) return null;

  return (
    <Badge
      className={`
        ${config.color} 
        ${config.bgColor} 
        font-semibold border-0
        ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'}
      `}
    >
      {config.label}
    </Badge>
  );
}