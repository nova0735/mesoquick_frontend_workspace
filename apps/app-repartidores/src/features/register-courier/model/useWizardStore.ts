import { create } from 'zustand';
// Importamos la función de la API. Asumimos que la IA sí generó el archivo register.api.ts
import { submitCourierRegistration } from '../api/register.api'; 

interface WizardState {
  currentStep: number;
  formData: Record<string, any>;
  files: Record<string, File | null>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Record<string, any>) => void;
  updateFiles: (files: Record<string, File | null>) => void;
  submitWizard: () => Promise<void>;
}

export const useWizardStore = create<WizardState>((set, get) => ({
  currentStep: 1,
  formData: {},
  files: {},
  isLoading: false,
  error: null,
  isSuccess: false,
  
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  
  updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  updateFiles: (newFiles) => set((state) => ({ files: { ...state.files, ...newFiles } })),
  
  submitWizard: async () => {
    const { formData, files } = get();
    set({ isLoading: true, error: null });
    
    try {
      // Ensamblaje nativo del FormData para enviar archivos e información mezclada
      const data = new FormData();
      
      // 1. Adjuntar textos
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value as string);
      });
      // 2. Adjuntar imágenes físicas
      Object.entries(files).forEach(([key, file]) => {
        if (file) data.append(key, file);
      });
      
      await submitCourierRegistration(data);
      set({ isLoading: false, isSuccess: true });
    } catch (err: any) {
      set({ isLoading: false, error: err.response?.data?.message || 'Ocurrió un error en el registro.' });
    }
  }
}));