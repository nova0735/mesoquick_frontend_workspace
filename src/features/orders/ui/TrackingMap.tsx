// src/features/orders/ui/TrackingMap.tsx

import { MapPin, Bike } from 'lucide-react';
import type { OrderStatus } from '../model/orders.types';

interface TrackingMapProps {
  status: OrderStatus;
  businessName: string;
  deliveryAddress: string;
}

export function TrackingMap({
  status,
  businessName,
  deliveryAddress,
}: TrackingMapProps) {
  const isOnTheWay = status === 'on_the_way';
  const isDelivered = status === 'delivered';

  return (
    <div className="relative bg-accent-bg rounded-xl overflow-hidden h-40 border border-border">
      {/* Fondo simulado del mapa */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full grid grid-cols-6 grid-rows-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border border-accent/30" />
          ))}
        </div>
      </div>

      {/* Línea de ruta */}
      {(isOnTheWay || isDelivered) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-0.5 bg-accent/40 rounded-full" />
        </div>
      )}

      {/* Punto de origen (restaurante) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
        <div className="bg-orange-500 text-white p-1.5 rounded-full shadow-md">
          <MapPin className="w-3 h-3" />
        </div>
        <span className="text-xs text-text/60 bg-bg/80 px-1 rounded max-w-16 text-center truncate">
          {businessName}
        </span>
      </div>

      {/* Repartidor animado (solo si está en camino) */}
      {isOnTheWay && (
        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
          <div className="bg-accent text-white p-2 rounded-full shadow-lg animate-bounce">
            <Bike className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Punto de destino (usuario) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
        <div
          className={`p-1.5 rounded-full shadow-md text-white
            ${isDelivered ? 'bg-green-500' : 'bg-accent'}`}
        >
          <MapPin className="w-3 h-3" />
        </div>
        <span className="text-xs text-text/60 bg-bg/80 px-1 rounded max-w-16 text-center truncate">
          {deliveryAddress}
        </span>
      </div>

      {/* Etiqueta placeholder */}
      <div className="absolute bottom-2 right-2">
        <span className="text-xs text-text/30 bg-bg/60 px-2 py-0.5 rounded-full">
          Mapa simulado
        </span>
      </div>
    </div>
  );
}