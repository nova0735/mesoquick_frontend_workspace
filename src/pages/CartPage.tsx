import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@shared/ui';
import { useCartStore } from '@features/cart/model/useCartStore';
import CartItem from '@features/cart/ui/CartItem';
import CartSummary from '@features/cart/ui/CartSummary';
import EmptyCart from '@features/cart/ui/EmptyCart';
import { ROUTES } from '@app/router/routes';

export default function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const currentBusinessName = useCartStore((s) => s.currentBusinessName);
  const clearCart = useCartStore((s) => s.clearCart);
  const hasItems = items.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-accent" />
          <h1 className="text-xl font-bold text-text-heading">Mi carrito</h1>
        </div>
        {hasItems && (
          <button
            onClick={clearCart}
            className="text-xs text-text hover:text-red-500 transition-colors"
          >
            Vaciar carrito
          </button>
        )}
      </div>

      {hasItems ? (
        <>
          {/* Comercio activo */}
          {currentBusinessName && (
            <p className="text-sm text-text">
              Pedido de{' '}
              <span className="font-semibold text-text-heading">{currentBusinessName}</span>
            </p>
          )}

          {/* Lista de items */}
          <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
            {items.map((item) => (
              <div key={item.product.id} className="px-4">
                <CartItem item={item} />
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="border border-border rounded-lg p-4">
            <CartSummary />
          </div>

          {/* Acciones */}
          <div className="space-y-2">
            <Button fullWidth onClick={() => navigate(ROUTES.CHECKOUT)}>
              Ir al checkout
            </Button>
            <Button
              fullWidth
              variant="outline"
              onClick={() => navigate(ROUTES.CATALOG)}
            >
              Seguir comprando
            </Button>
          </div>
        </>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
}
