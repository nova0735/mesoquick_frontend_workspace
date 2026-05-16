import { Plus } from 'lucide-react';
import { Card, Badge, Button } from '@shared/ui';
import { cn } from '@shared/lib/cn';
import { formatPrice } from '@shared/lib/formatters';
import type { Product } from '@shared/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const isUnavailable = !product.available;

  return (
    <Card
      padding="none"
      className={cn(
        'overflow-hidden flex flex-row h-full',
        isUnavailable && 'opacity-60'
      )}
    >
      <div className="w-28 sm:w-32 shrink-0 bg-code-bg overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col flex-1 p-3 min-w-0 gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-text-heading text-sm line-clamp-1">
            {product.name}
          </h3>
          {isUnavailable && (
            <Badge variant="danger" className="shrink-0">
              Agotado
            </Badge>
          )}
        </div>

        <p className="text-xs text-text line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          <span className="font-semibold text-text-heading">
            {formatPrice(product.price)}
          </span>

          {!isUnavailable && onAddToCart && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddToCart(product)}
              leftIcon={<Plus className="w-4 h-4" />}
              aria-label={`Agregar ${product.name} al carrito`}
            >
              Agregar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}