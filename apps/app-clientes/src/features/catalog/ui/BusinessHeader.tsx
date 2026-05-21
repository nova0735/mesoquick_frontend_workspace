import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Clock,
  Bike,
  ShoppingBag,
} from 'lucide-react';
import { Card, Badge } from '@shared/ui';
import { formatPrice } from '@shared/lib/formatters';
import { ROUTES } from '@app/router/routes';
import type {
  Business,
  BusinessCategory,
  BusinessStatus,
} from '@shared/types';

interface BusinessHeaderProps {
  business: Business;
}

type StatusVariant = 'success' | 'warning' | 'danger';
type StatusDisplay = { label: string; variant: StatusVariant };

const STATUS_DISPLAY: Record<BusinessStatus, StatusDisplay> = {
  open: { label: 'Abierto', variant: 'success' },
  busy: { label: 'Ocupado', variant: 'warning' },
  closed: { label: 'Cerrado', variant: 'danger' },
};

const CATEGORY_LABEL: Record<BusinessCategory, string> = {
  restaurant: 'Restaurante',
  pharmacy: 'Farmacia',
  supermarket: 'Supermercado',
};

const formatReviewCount = (n: number): string =>
  n < 1000 ? String(n) : `${(n / 1000).toFixed(1)}k`;

interface StatItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-accent-bg flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-text">{label}</p>
        <p className="font-semibold text-text-heading text-sm">{value}</p>
      </div>
    </div>
  );
}

export default function BusinessHeader({ business }: BusinessHeaderProps) {
  // Guarda defensiva: si business es null en un render intermedio
  // (puede pasar al combinar varios useEffect/Zustand), no renderizamos nada.
  if (!business) return null;

  const statusDisplay = STATUS_DISPLAY[business.status];
  const categoryLabel = CATEGORY_LABEL[business.category];

  return (
    <div className="space-y-5">
      <Link
        to={ROUTES.CATALOG}
        className="inline-flex items-center gap-1 text-sm text-text hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al catalogo
      </Link>

      <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-code-bg">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1.5">
          <Badge variant="default">{categoryLabel}</Badge>
          <h1 className="text-2xl md:text-3xl font-semibold text-text-heading">
            {business.name}
          </h1>
        </div>
        <Badge variant={statusDisplay.variant}>{statusDisplay.label}</Badge>
      </div>

      <div className="flex items-center gap-1 text-sm">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        <span className="font-semibold text-text-heading">
          {business.rating.toFixed(1)}
        </span>
        <span className="text-text">
          ({formatReviewCount(business.reviewCount)} valoraciones)
        </span>
      </div>

      <p className="text-text leading-relaxed">{business.description}</p>

      {business.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {business.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <Card className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatItem
          icon={<Clock className="w-5 h-5 text-accent" />}
          label="Tiempo estimado"
          value={business.deliveryTime}
        />
        <StatItem
          icon={<Bike className="w-5 h-5 text-accent" />}
          label="Envio"
          value={formatPrice(business.deliveryFee)}
        />
        <StatItem
          icon={<ShoppingBag className="w-5 h-5 text-accent" />}
          label="Pedido minimo"
          value={formatPrice(business.minOrder)}
        />
      </Card>
    </div>
  );
}