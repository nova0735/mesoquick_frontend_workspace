export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  defaultAddress: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export type RegisterFormErrors = Partial<
  Record<keyof RegisterFormData, string>
>;

export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  defaultAddress: string;
  createdAt: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  register: (data: RegisterFormData) => Promise<void>;
  login: (data: LoginFormData) => Promise<void>;
  /**
   * Actualiza campos editables del perfil del usuario actual.
   * Por ahora solo telefono y direccion principal.
   */
  updateProfile: (
    changes: Partial<Pick<AuthUser, 'phone' | 'defaultAddress'>>
  ) => void;
  logout: () => void;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;