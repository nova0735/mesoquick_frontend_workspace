// src/features/orders/ui/TrackingTimeline.tsx

import { Check, Clock } from 'lucide-react';
import { ORDER_STATUS_FLOW, ORDER_STATUS_CONFIG } from '../model/orders.types';
import type { OrderStatus } from '../model/orders.types';

interface TrackingTimelineProps {
  currentStatus: OrderStatus;
}

export function TrackingTimeline({ currentStatus }: TrackingTimelineProps) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-600 font-semibold">Pedido cancelado</p>
        <p className="text-red-400 text-sm mt-1">Este pedido fue cancelado</p>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(
    currentStatus as (typeof ORDER_STATUS_FLOW)[number]
  );

  return (
    <div className="py-2">
      {ORDER_STATUS_FLOW.map((status, index) => {
        const config = ORDER_STATUS_CONFIG[status];
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;
        const isLast = index === ORDER_STATUS_FLOW.length - 1;

        return (
          <div key={status} className="flex gap-4">
            {/* Columna izquierda: círculo + línea */}
            <div className="flex flex-col items-center">
              {/* Círculo indicador */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  transition-all duration-500
                  ${isCompleted ? 'bg-green-500' : ''}
                  ${isCurrent ? 'bg-accent ring-4 ring-accent/20' : ''}
                  ${isPending ? 'bg-border' : ''}
                `}
              >
                {isCompleted && <Check className="w-4 h-4 text-white" />}
                {isCurrent && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
                {isPending && (
                  <Clock className="w-3 h-3 text-text/30" />
                )}
              </div>

              {/* Línea vertical entre pasos */}
              {!isLast && (
                <div
                  className={`
                    w-0.5 h-10 mt-1 transition-all duration-500
                    ${isCompleted ? 'bg-green-500' : 'bg-border'}
                  `}
                />
              )}
            </div>

            {/* Columna derecha: texto */}
            <div className="pb-8 pt-1">
              <p
                className={`font-semibold text-sm transition-colors duration-300
                  ${isCurrent ? 'text-accent' : ''}
                  ${isCompleted ? 'text-green-600' : ''}
                  ${isPending ? 'text-text/30' : ''}
                `}
              >
                {config.label}
                {isCurrent && (
                  <span className="ml-2 text-xs font-normal text-accent/70">
                    ← Ahora
                  </span>
                )}
              </p>
              <p
                className={`text-xs mt-0.5 transition-colors duration-300
                  ${isPending ? 'text-text/20' : 'text-text/50'}
                `}
              >
                {config.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}