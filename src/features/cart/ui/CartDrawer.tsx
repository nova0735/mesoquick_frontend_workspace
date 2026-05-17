import { useNavigate } from 'react-router-dom';
import { Drawer, Button } from '@shared/ui';
import { useCartStore } from '@features/cart/model/useCartStore';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';
import { ROUTES } from '@app/router/routes';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const currentBusinessName = useCartStore((s) => s.currentBusinessName);
  const clearCart = useCartStore((s) => s.clearCart);
  const hasItems = items.length > 0;

  const handleCheckout = () => {
    onClose();
    navigate(ROUTES.CHECKOUT);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={hasItems && currentBusinessName ? currentBusinessName : 'Mi carrito'}
      side="right"
      footer={
        hasItems ? (
          <div className="space-y-3">
            <CartSummary />
            <Button fullWidth onClick={handleCheckout}>
              Ir al checkout
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={clearCart}
              className="text-xs text-text/60 h-8"
            >
              Vaciar carrito
            </Button>
          </div>
        ) : undefined
      }
    >
      {hasItems ? (
        <div>
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyCart />
      )}
    </Drawer>
  );
}
