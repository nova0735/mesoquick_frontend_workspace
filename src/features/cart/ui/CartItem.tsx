import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '@shared/types';
import { Button } from '@shared/ui';
import { formatPrice } from '@shared/lib/formatters';
import { useCartStore } from '@features/cart/model/useCartStore';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  return (
    <div className="flex gap-3 py-3 border-b border-border last:border-0">
      {/* Imagen */}
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
      />

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text-heading text-sm leading-tight truncate">
          {product.name}
        </p>
        <p className="text-xs text-text mt-0.5">{formatPrice(product.price)}</p>

        {/* Controles de cantidad */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-accent-bg hover:border-accent-border transition-colors text-text"
            aria-label="Reducir cantidad"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center text-sm font-medium text-text-heading">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-accent-bg hover:border-accent-border transition-colors text-text"
            aria-label="Aumentar cantidad"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Subtotal + eliminar */}
      <div className="flex flex-col items-end justify-between flex-shrink-0">
        <span className="text-sm font-semibold text-text-heading">
          {formatPrice(product.price * quantity)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeItem(product.id)}
          className="p-1 h-auto text-text hover:text-red-500"
          aria-label="Eliminar producto"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
