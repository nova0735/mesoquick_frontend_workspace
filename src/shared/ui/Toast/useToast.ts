import { create } from 'zustand';
import type { ToastVariant } from './Toast';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  show: (message: string, variant?: ToastVariant, duration?: number) => void;
  dismiss: (id: string) => void;
}

/**
 * Store global de toasts. Cualquier componente puede llamar a `toast.success(...)`
 * sin necesidad de pasar props ni levantar estado a nivel de página.
 */
const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  show: (message, variant = 'info', duration) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, variant, duration }],
    }));
  },
  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

/**
 * API pública para disparar toasts desde cualquier feature.
 *
 * Ejemplo:
 *   import { toast } from '@shared/ui';
 *   toast.success('Producto agregado al carrito');
 *   toast.error('No se pudo agregar el producto');
 *   toast.info('Te avisamos cuando esté listo');
 */
export const toast = {
  success: (message: string, duration?: number) =>
    useToastStore.getState().show(message, 'success', duration),
  error: (message: string, duration?: number) =>
    useToastStore.getState().show(message, 'error', duration),
  info: (message: string, duration?: number) =>
    useToastStore.getState().show(message, 'info', duration),
};

/** Hook usado por el ToastContainer para suscribirse al store. */
export function useToasts() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return { toasts, dismiss };
}