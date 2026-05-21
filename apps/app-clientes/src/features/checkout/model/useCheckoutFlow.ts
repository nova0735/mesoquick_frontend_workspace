import { useNavigate } from 'react-router-dom';
import { useCheckoutStore } from './useCheckoutStore';
import { useCartStore } from '@features/cart/model/useCartStore';
import { useOrdersStore } from '@features/orders';
import { useAuthStore } from '@features/auth/model/useAuthStore';
import { submitOrder } from '@features/checkout/api/checkout.api';
import { ROUTES } from '@app/router/routes';
import { userMock } from '@shared/mocks';
import type { AddressFormData, PaymentFormData } from './checkout.types';
import type { Order } from '@features/orders';
import { toast } from '@shared/ui';

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
  const addOrder = useOrdersStore((s) => s.addOrder);
  const authUser = useAuthStore((s) => s.user);

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

      // Construir el objeto Order completo y agregarlo al store de orders.
      // Esto hace que el pedido aparezca en "Mis pedidos" y permite el tracking
      // sin necesidad de re-fetch del backend.
      const newOrder: Order = {
        id: orderId,
        userId: authUser?.id ?? userMock.id,
        businessId: currentBusinessId,
        businessName: currentBusinessName ?? '',
        status: 'pending',
        paymentMethod: store.paymentData.method,
        deliveryAddress: store.addressData.address,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          subtotal: item.product.price * item.quantity,
        })),
        subtotal: cartSubtotal,
        deliveryFee: DELIVERY_FEE,
        discount: store.discount,
        total,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        couponCode: store.appliedCoupon ?? undefined,
      };

      addOrder(newOrder);
      store.setConfirmedOrder(orderId);
      clearCart();
      store.resetCheckout();

      // Vamos directo a "Mis pedidos" para que el usuario vea su pedido nuevo
      // arriba de la lista (la confirmación se omite por decisión de UX).
      toast.success('¡Pedido confirmado! Te avisaremos cuando esté en camino.');
      navigate(ROUTES.ORDERS);
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