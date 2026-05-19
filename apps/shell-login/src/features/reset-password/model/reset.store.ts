import { create } from 'zustand';
import { sendPasswordResetEmail } from '../api/reset.api';

interface ResetPasswordState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

interface ResetPasswordActions {
  requestReset: (email: string) => Promise<void>;
}

/**
 * STORE DE RESET DE CONTRASEÑA (Zustand)
 * 
 * 🧩 NOTA DE ARQUITECTURA FSD:
 * Feature Model (`features/reset-password/model`). Maneja el estado asíncrono de 
 * la solicitud de recuperación de contraseña de forma estandarizada e independiente.
 */
export const useResetPasswordStore = create<ResetPasswordState & ResetPasswordActions>((set) => ({
  isLoading: false,
  isSuccess: false,
  error: null,

  requestReset: async (email: string) => {
    set({ isLoading: true, error: null, isSuccess: false });
    
    try {
      await sendPasswordResetEmail(email);
      // Si el correo se envía correctamente, cambiamos el estado de éxito a true
      set({ isLoading: false, isSuccess: true });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || 'Error al solicitar el enlace. Intenta de nuevo.';
      set({ isLoading: false, error: errorMessage, isSuccess: false });
    }
  }
}));