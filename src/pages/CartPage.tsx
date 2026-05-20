import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock } from 'lucide-react';
import { Button } from '@shared/ui';
import { useCartStore } from '@features/cart/model/useCartStore';
import { useAuthStore } from '@features/auth/model/useAuthStore';
import CartItem from '@features/cart/ui/CartItem';
import CartSummary from '@features/cart/ui/CartSummary';
import EmptyCart from '@features/cart/ui/EmptyCart';
import { ROUTES } from '@app/router/routes';

export default function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const currentBusinessName = useCartStore((s) => s.currentBusinessName);
  const clearCart = useCartStore((s) => s.clearCart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasItems = items.length > 0;

  /**
   * Al clickear "Ir al checkout":
   * - Si está logueado → navega normal a /checkout
   * - Si NO → redirige a /login, guardando /checkout como destino
   */
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate(ROUTES.CHECKOUT);
    } else {
      navigate(ROUTES.LOGIN, {
        state: { from: ROUTES.CHECKOUT },
      });
    }
  };

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
              <span className="font-semibold text-text-heading">
                {currentBusinessName}
              </span>
            </p>
          )}

          {/* Aviso si no está logueado */}
          {!isAuthenticated && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                <span className="font-semibold">
                  Iniciá sesión para finalizar tu pedido.
                </span>{' '}
                Necesitamos saber a quién y dónde entregar.
              </p>
            </div>
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
            <Button fullWidth onClick={handleCheckout}>
              {isAuthenticated ? 'Ir al checkout' : 'Iniciar sesión y continuar'}
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