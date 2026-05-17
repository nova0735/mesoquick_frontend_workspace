import { useCartStore } from '@features/cart/model/useCartStore';
import { formatPrice } from '@shared/lib/formatters';

/** Tarifa de envío fija mientras no haya backend. */
const DELIVERY_FEE = 15;

export default function CartSummary() {
  const subtotal = useCartStore((s) => s.subtotal());
  const total = subtotal + DELIVERY_FEE;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-text">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-text">
        <span>Envío</span>
        <span>{formatPrice(DELIVERY_FEE)}</span>
      </div>
      <div className="flex justify-between font-semibold text-text-heading border-t border-border pt-2 mt-2">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
