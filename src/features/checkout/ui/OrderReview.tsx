import { MapPin, CreditCard, Banknote, Store } from 'lucide-react';
import { Button, Card } from '@shared/ui';
import { formatPrice } from '@shared/lib/formatters';
import type { CartItem, PaymentMethod } from '@shared/types';

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: 'Efectivo',
  credit_card: 'Tarjeta de crédito',
  debit_card: 'Tarjeta de débito',
};

const PAYMENT_ICONS: Record<PaymentMethod, React.ReactNode> = {
  cash: <Banknote className="w-4 h-4" />,
  credit_card: <CreditCard className="w-4 h-4" />,
  debit_card: <CreditCard className="w-4 h-4" />,
};

interface OrderReviewProps {
  cartItems: CartItem[];
  businessName: string;
  address: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  appliedCoupon: string | null;
  isSubmitting: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

export default function OrderReview({
  cartItems,
  businessName,
  address,
  paymentMethod,
  subtotal,
  deliveryFee,
  discount,
  total,
  appliedCoupon,
  isSubmitting,
  onConfirm,
  onBack,
}: OrderReviewProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-heading">Revisa tu pedido</h2>
        <p className="text-sm text-text mt-0.5">Confirma los detalles antes de ordenar.</p>
      </div>

      {/* Comercio */}
      <Card padding="sm">
        <div className="flex items-center gap-2 text-sm">
          <Store className="w-4 h-4 text-accent flex-shrink-0" />
          <span className="font-medium text-text-heading">{businessName}</span>
        </div>
      </Card>

      {/* Productos */}
      <Card padding="sm">
        <p className="text-xs font-semibold text-text uppercase tracking-wide mb-2">
          Productos
        </p>
        <div className="space-y-2">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-text">
                {item.quantity}× {item.product.name}
              </span>
              <span className="text-text-heading font-medium">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Dirección */}
      <Card padding="sm">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-text uppercase tracking-wide mb-0.5">
              Entrega en
            </p>
            <p className="text-text-heading">{address}</p>
          </div>
        </div>
      </Card>

      {/* Pago */}
      <Card padding="sm">
        <div className="flex items-center gap-2 text-sm">
          {PAYMENT_ICONS[paymentMethod]}
          <div>
            <p className="text-xs font-semibold text-text uppercase tracking-wide mb-0.5">
              Método de pago
            </p>
            <p className="text-text-heading">{PAYMENT_LABELS[paymentMethod]}</p>
          </div>
        </div>
      </Card>

      {/* Totales */}
      <Card padding="sm">
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-text">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-text">
            <span>Envío</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Descuento {appliedCoupon && `(${appliedCoupon})`}</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-text-heading border-t border-border pt-2 mt-1">
            <span>Total</span>
            <span className="text-accent">{formatPrice(total)}</span>
          </div>
        </div>
      </Card>

      {/* Acciones */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting} className="flex-1">
          Atrás
        </Button>
        <Button onClick={onConfirm} isLoading={isSubmitting} className="flex-1">
          Confirmar pedido
        </Button>
      </div>
    </div>
  );
}
