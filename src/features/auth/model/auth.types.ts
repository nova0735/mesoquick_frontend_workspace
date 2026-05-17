export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  defaultAddress: string;
}

export type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string>>;
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  defaultAddress: string;
  createdAt: string;
}