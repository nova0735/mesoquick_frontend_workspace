import { create } from 'zustand';
import type { CheckoutState, CheckoutStep, AddressFormData, PaymentFormData } from './checkout.types';

interface CheckoutStore extends CheckoutState {
  setStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setAddressData: (data: AddressFormData) => void;
  setPaymentData: (data: PaymentFormData) => void;
  applyDiscount: (coupon: string, amount: number) => void;
  removeDiscount: () => void;
  setSubmitting: (value: boolean) => void;
  setConfirmedOrder: (orderId: string) => void;
  resetCheckout: () => void;
}

const STEPS: CheckoutStep[] = ['address', 'payment', 'review'];

const initialState: CheckoutState = {
  currentStep: 'address',
  addressData: null,
  paymentData: null,
  appliedCoupon: null,
  discount: 0,
  isSubmitting: false,
  confirmedOrderId: null,
};

export const useCheckoutStore = create<CheckoutStore>()((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const idx = STEPS.indexOf(get().currentStep);
    if (idx < STEPS.length - 1) {
      set({ currentStep: STEPS[idx + 1] });
    }
  },

  prevStep: () => {
    const idx = STEPS.indexOf(get().currentStep);
    if (idx > 0) {
      set({ currentStep: STEPS[idx - 1] });
    }
  },

  setAddressData: (data) => set({ addressData: data }),

  setPaymentData: (data) => set({ paymentData: data }),

  applyDiscount: (coupon, amount) =>
    set({ appliedCoupon: coupon, discount: amount }),

  removeDiscount: () =>
    set({ appliedCoupon: null, discount: 0 }),

  setSubmitting: (value) => set({ isSubmitting: value }),

  setConfirmedOrder: (orderId) => set({ confirmedOrderId: orderId }),

  resetCheckout: () => set(initialState),
}));
