import { useNavigate } from 'react-router-dom';
import { useCheckoutStore } from './useCheckoutStore';
import { useCartStore } from '@features/cart/model/useCartStore';
import { submitOrder } from '@features/checkout/api/checkout.api';
import { buildRoute } from '@app/router/routes';
import type { AddressFormData, PaymentFormData } from './checkout.types';

/**
 * Hook de orquestación del checkout.
 * Conecta el store, el carrito y la API para manejar el flujo completo.
 */
export function useCheckoutFlow() {
  const navigate = useNavigate();
  const store = useCheckoutStore();
  const cartItems = useCartStore((s) => s.items);
  const cartSubtotal = useCartStore((s) => s.subtotal());
  const currentBusinessId = useCartStore((s) => s.currentBusinessId);
  const currentBusinessName = useCartStore((s) => s.currentBusinessName);
  const clearCart = useCartStore((s) => s.clearCart);

  const DELIVERY_FEE = 15;
  const total = cartSubtotal + DELIVERY_FEE - store.discount;

  const saveAddress = (data: AddressFormData) => {
    store.setAddressData(data);
    store.nextStep();
  };

  const savePayment = (data: PaymentFormData) => {
    store.setPaymentData(data);
    store.nextStep();
  };

  const placeOrder = async () => {
    if (!store.addressData || !store.paymentData || !currentBusinessId) return;

    store.setSubmitting(true);
    try {
      const orderId = await submitOrder({
        businessId: currentBusinessId,
        businessName: currentBusinessName ?? '',
        items: cartItems,
        subtotal: cartSubtotal,
        deliveryFee: DELIVERY_FEE,
        discount: store.discount,
        total,
        paymentMethod: store.paymentData.method,
        deliveryAddress: store.addressData.address,
        couponCode: store.appliedCoupon ?? undefined,
      });

      store.setConfirmedOrder(orderId);
      clearCart();
      store.resetCheckout();
      navigate(buildRoute.orderConfirmation(orderId));
    } finally {
      store.setSubmitting(false);
    }
  };

  return {
    currentStep: store.currentStep,
    addressData: store.addressData,
    paymentData: store.paymentData,
    appliedCoupon: store.appliedCoupon,
    discount: store.discount,
    deliveryFee: DELIVERY_FEE,
    subtotal: cartSubtotal,
    total,
    cartItems,
    currentBusinessName,
    isSubmitting: store.isSubmitting,
    saveAddress,
    savePayment,
    goBack: store.prevStep,
    placeOrder,
    applyDiscount: store.applyDiscount,
    removeDiscount: store.removeDiscount,
  };
}
