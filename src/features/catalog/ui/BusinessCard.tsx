// Card visual de un comercio

import { Link } from 'react-router-dom';
import { Star, Clock, Bike } from 'lucide-react';
import { Card, Badge } from '@shared/ui';
import { cn } from '@shared/lib/cn';
import { formatPrice } from '@shared/lib/formatters';
import { buildRoute } from '@app/router/routes';
import type { Business, BusinessStatus } from '@shared/types';

interface BusinessCardProps {
  business: Business;
}

type StatusBadgeConfig = {
  label: string;
  variant: 'warning' | 'danger';
};

// Configuración visual del badge superpuesto sobre la imagen
// Cuando el comercio está abierto no mostramos badge por defecto
const STATUS_BADGE: Record<BusinessStatus, StatusBadgeConfig | null> = {
  open: null,
  busy: { label: 'Ocupado', variant: 'warning' },
  closed: { label: 'Cerrado', variant: 'danger' },
};

// Formato compacto para conteo de reseñas
const formatReviewCount = (n: number): string =>
  n < 1000 ? String(n) : `${(n / 1000).toFixed(1)}k`;

export default function BusinessCard({ business }: BusinessCardProps) {
  const statusBadge = STATUS_BADGE[business.status];
  const isClosed = business.status === 'closed';

  return (
    <Link
      to={buildRoute.businessDetail(business.id)}
      className="group block"
      aria-label={`Ver detalle de ${business.name}`}
    >
      <Card
        hoverable
        padding="none"
        className="overflow-hidden h-full flex flex-col"
      >
        {/* Imagen + badge de status superpuesto */}
        <div className="relative aspect-[16/10] overflow-hidden bg-code-bg">
          <img
            src={business.image}
            alt={business.name}
            loading="lazy"
            className={cn(
              'w-full h-full object-cover transition-transform duration-300',
              'group-hover:scale-105',
              isClosed && 'grayscale opacity-60'
            )}
          />
          {statusBadge && (
            <div className="absolute top-2 right-2">
              <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          {/* Nombre + rating en la misma fila */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-text-heading line-clamp-1">
              {business.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0 text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-medium text-text-heading">
                {business.rating.toFixed(1)}
              </span>
              <span className="text-text">
                ({formatReviewCount(business.reviewCount)})
              </span>
            </div>
          </div>

          {/* Descripción */}
          <p className="text-sm text-text line-clamp-2">
            {business.description}
          </p>

          {/* Tags — máximo 3 visibles para no saturar la card */}
          {business.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {business.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer: tiempo de delivery + tarifa. mt-auto lo pega abajo
              para que las cards de la grilla queden alineadas aunque
              tengan descripciones de distinto largo. */}
          <div className="flex items-center gap-3 text-xs text-text mt-auto pt-2 border-t border-border">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {business.deliveryTime}
            </span>
            <span className="flex items-center gap-1">
              <Bike className="w-3.5 h-3.5" />
              {formatPrice(business.deliveryFee)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}