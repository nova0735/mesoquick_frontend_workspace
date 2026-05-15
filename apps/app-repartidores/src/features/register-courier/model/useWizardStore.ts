import { create } from 'zustand';
import { AuthAPI } from '@mesoquick/core-network';

// 1. Definimos estrictamente todos los campos que pide Postman
export interface RegisterDTO {
  firstName: string;
  lastName: string;
  birthDate: string; // Formato esperado: YYYY-MM-DD
  nationality: string;
  department: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  cui: string;
  nit: string;
  vehicleType: string;
  licensePlate: string;
  bankAccountType: string;
  bankId: string;
}

// 2. Estado inicial completamente limpio (Sin datos Demo)
const initialDTO: RegisterDTO = {
  firstName: '',
  lastName: '',
  birthDate: '',
  nationality: '',
  department: '',
  address: '',
  phone: '',
  email: '',
  password: '',
  cui: '',
  nit: '',
  vehicleType: 'MOTORCYCLE',
  licensePlate: '',
  bankAccountType: '',
  bankId: '',
};

interface WizardState {
  step: number;
  dto: RegisterDTO;
  files: Record<string, File | null>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (data: Partial<RegisterDTO>) => void;
  updateFiles: (files: Record<string, File | null>) => void;
  submit: () => Promise<void>;
}

// Función para convertir archivo físico a Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const useWizardStore = create<WizardState>((set, get) => ({
  step: 1,
  dto: initialDTO,
  files: { dpiPhoto: null, profilePhoto: null }, // Claves exactas para los archivos
  isLoading: false,
  error: null,
  isSuccess: false,
  
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 5) })), // Ajustaremos el número de pasos luego si es necesario
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  
  updateData: (data) => set((state) => ({ dto: { ...state.dto, ...data } })),
  updateFiles: (newFiles) => set((state) => ({ files: { ...state.files, ...newFiles } })),
  
  submit: async () => {
    const { dto, files } = get();
    set({ isLoading: true, error: null });
    
    try {
      if (!files.dpiPhoto || !files.profilePhoto) {
        throw new Error("Las fotografías son obligatorias.");
      }

      const dpiPhotoBase64 = await fileToBase64(files.dpiPhoto);
      const profilePhotoBase64 = await fileToBase64(files.profilePhoto);

      // Armamos el Payload (¡Esta vez nadie lo va a alterar!)
      const payload = {
        firstName: dto.firstName,
        lastName: dto.lastName,
        birthDate: dto.birthDate,
        nationality: dto.nationality,
        department: dto.department,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        cui: dto.cui,
        dpiPhotoBase64: dpiPhotoBase64,
        nit: dto.nit,
        profilePhotoBase64: profilePhotoBase64,
        vehicleType: dto.vehicleType,
        licensePlate: dto.licensePlate,
        bankAccountType: dto.bankAccountType,
        bankId: dto.bankId,
        passwordRaw: dto.password, // El único que le importa a Railway
        rol: 3
      };

      const response = await fetch('https://broker-services-production.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // Si el servidor nos rechaza (Ej. Error 400 o 500)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error del servidor al procesar el registro.');
      }

      // Si llegamos aquí, ¡fue un código 200/201 de Éxito!
      set({ isLoading: false, isSuccess: true });
    } catch (err: any) {
      console.error("Error al registrar:", err);
      set({ 
        isLoading: false, 
        error: err.message || 'Error de conexión.' 
      });
    }
  }
}));