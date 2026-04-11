import { create } from 'zustand';
import { registerCourierRequest } from '../api/register.api';

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  vehicleType: string;
  plate: string;
  idImage: File | null;
  licenseImage: File | null;
}

interface WizardState {
  step: number;
  dto: RegisterDTO;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

interface WizardActions {
  nextStep: () => void;
  prevStep: () => void;
  updateData: (partialData: Partial<RegisterDTO>) => void;
  submit: () => Promise<void>;
}

const initialDTO: RegisterDTO = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  vehicleType: 'MOTORCYCLE',
  plate: '',
  idImage: null,
  licenseImage: null,
};

/**
 * 🧠 MODEL LAYER: Wizard de Registro (Zustand)
 * Encapsula el estado del formulario por pasos y la lógica de envío final.
 */
export const useRegisterWizardStore = create<WizardState & WizardActions>((set, get) => ({
  step: 1,
  dto: initialDTO,
  isLoading: false,
  error: null,
  isSuccess: false,

  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
  
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  
  updateData: (partialData) => set((state) => ({ dto: { ...state.dto, ...partialData } })),
  
  submit: async () => {
    const { dto } = get();
    set({ isLoading: true, error: null, isSuccess: false });

    try {
      const formData = new FormData();
      
      // Empaquetamos todos los datos (textos y archivos) dinámicamente
      Object.entries(dto).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });

      await registerCourierRequest(formData);
      set({ isSuccess: true, isLoading: false });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Error al procesar el registro. Intenta de nuevo.';
      set({ error: errorMsg, isLoading: false });
    }
  }
}));