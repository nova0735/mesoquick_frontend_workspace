import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@features/cart/model/useCartStore';
import { ROUTES } from '@app/router/routes';

/**
 * Botón del carrito con badge de cantidad.
 * La líder técnica (Heather) lo monta en el Header global.
 */
export default function CartIconButton() {
  const navigate = useNavigate();
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <button
      onClick={() => navigate(ROUTES.CART)}
      className="relative p-2 rounded-lg hover:bg-accent-bg transition-colors text-text hover:text-accent"
      aria-label={`Carrito${totalItems > 0 ? ` (${totalItems} artículos)` : ''}`}
    >
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-accent text-white text-[10px] font-bold px-1">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}
