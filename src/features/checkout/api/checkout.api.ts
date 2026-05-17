import type { CartItem, PaymentMethod } from '@shared/types';

interface SubmitOrderPayload {
  businessId: string;
  businessName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  couponCode?: string;
}

/**
 * Envía un pedido al backend.
 * HOY: simula latencia y devuelve un ID generado localmente.
 * MAÑANA: reemplazar el body con fetch al broker real.
 */
export async function submitOrder(payload: SubmitOrderPayload): Promise<string> {
  // Simula latencia de red
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // En la integración real, esto vendrá del response del broker
  const orderId = `order-${Date.now()}`;
  console.info('[checkout.api] Pedido simulado creado:', orderId, payload);
  return orderId;
}

/** Cupones válidos para demo (sustituir por endpoint cuando el backend esté). */
const VALID_COUPONS: Record<string, number> = {
  BIENVENIDO10: 10,
  MESO20: 20,
  DESCUENTO5: 5,
};

export interface CouponResult {
  valid: boolean;
  discount: number;
  message: string;
}

export async function validateCoupon(code: string): Promise<CouponResult> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const normalized = code.trim().toUpperCase();
  const discount = VALID_COUPONS[normalized];

  if (discount !== undefined) {
    return { valid: true, discount, message: `¡Cupón aplicado! Ahorraste Q ${discount}.00` };
  }
  return { valid: false, discount: 0, message: 'Cupón no válido o expirado.' };
}
