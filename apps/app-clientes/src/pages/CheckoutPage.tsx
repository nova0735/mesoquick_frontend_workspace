import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCartStore } from '@features/cart/model/useCartStore';
import { useCheckoutFlow } from '@features/checkout/model/useCheckoutFlow';
import CheckoutStepper from '@features/checkout/ui/CheckoutStepper';
import AddressStep from '@features/checkout/ui/AddressStep';
import PaymentStep from '@features/checkout/ui/PaymentStep';
import OrderReview from '@features/checkout/ui/OrderReview';
import { ROUTES } from '@app/router/routes';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cartItems = useCartStore((s) => s.items);

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate(ROUTES.CART, { replace: true });
    }
  }, [cartItems.length, navigate]);

  const flow = useCheckoutFlow();

  if (cartItems.length === 0) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Flecha para volver al carrito */}
      <button
        onClick={() => navigate(ROUTES.CART)}
        className="inline-flex items-center gap-1.5 text-sm text-text hover:text-accent transition-colors group"
        aria-label="Volver al carrito"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        Volver al carrito
      </button>

      {/* Stepper */}
      <CheckoutStepper currentStep={flow.currentStep} />

      {/* Paso activo */}
      <div>
        {flow.currentStep === 'address' && (
          <AddressStep
            initialData={flow.addressData}
            onNext={flow.saveAddress}
          />
        )}

        {flow.currentStep === 'payment' && (
          <PaymentStep
            initialData={flow.paymentData}
            appliedCoupon={flow.appliedCoupon}
            onApplyCoupon={flow.applyDiscount}
            onRemoveCoupon={flow.removeDiscount}
            onNext={flow.savePayment}
            onBack={flow.goBack}
          />
        )}

        {flow.currentStep === 'review' && (
          <OrderReview
            cartItems={flow.cartItems}
            businessName={flow.currentBusinessName ?? ''}
            address={flow.addressData?.address ?? ''}
            paymentMethod={flow.paymentData?.method ?? 'cash'}
            subtotal={flow.subtotal}
            deliveryFee={flow.deliveryFee}
            discount={flow.discount}
            total={flow.total}
            appliedCoupon={flow.appliedCoupon}
            isSubmitting={flow.isSubmitting}
            onConfirm={flow.placeOrder}
            onBack={flow.goBack}
          />
        )}
      </div>
    </div>
  );
}