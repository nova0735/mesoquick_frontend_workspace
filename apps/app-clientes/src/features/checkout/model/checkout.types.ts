import type { PaymentMethod } from '@shared/types';

/** Pasos del wizard de checkout */
export type CheckoutStep = 'address' | 'payment' | 'review';

export const CHECKOUT_STEPS: CheckoutStep[] = ['address', 'payment', 'review'];

export const STEP_LABELS: Record<CheckoutStep, string> = {
  address: 'Dirección',
  payment: 'Pago',
  review: 'Resumen',
};

/** Datos del formulario de dirección */
export interface AddressFormData {
  address: string;
  references?: string;
}

/** Datos del formulario de pago */
export interface PaymentFormData {
  method: PaymentMethod;
  couponCode?: string;
}

/** Estado completo del checkout */
export interface CheckoutState {
  currentStep: CheckoutStep;
  addressData: AddressFormData | null;
  paymentData: PaymentFormData | null;
  appliedCoupon: string | null;
  discount: number;
  isSubmitting: boolean;
  confirmedOrderId: string | null;
}
