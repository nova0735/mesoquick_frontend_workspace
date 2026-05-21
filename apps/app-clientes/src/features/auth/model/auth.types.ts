// ============================================================================
//  Register
// ============================================================================

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  defaultAddress: string;
}

export type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string>>;

// ============================================================================
//  Login
// ============================================================================

export interface LoginFormData {
  email: string;
  password: string;
}

export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

// ============================================================================
//  User
// ============================================================================

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  defaultAddress: string;
  createdAt: string;
  /** Rol opcional, presente solo cuando la sesión viene del broker. */
  role?: string;
}

// ============================================================================
//  Store state + actions
// ============================================================================

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrating: boolean;
  error: string | null;
  /** JWT del broker cuando hay sesión real. Null en modo mock. */
  token: string | null;
}

export interface AuthActions {
  /**
   * Registra un usuario nuevo. Intenta primero contra el broker real;
   * si el broker no responde o falla, cae al mock local para que la app
   * siga funcionando standalone (modo demo).
   */
  register: (data: RegisterFormData) => Promise<void>;

  /**
   * Inicia sesión. Intenta primero contra el broker; si falla por red
   * o por endpoint caído, cae al mock local.
   */
  login: (data: LoginFormData) => Promise<void>;

  /** Actualiza teléfono y dirección del usuario actual. */
  updateProfile: (changes: Partial<Pick<AuthUser, 'phone' | 'defaultAddress'>>) => void;

  logout: () => void;
  clearError: () => void;

  // ─── Integración con shell-login ─────────────────────────────────────────

  /**
   * Si la URL trae ?token=XXX (shell-login redirigió aquí tras login),
   * persiste el token, valida contra /auth/me y monta la sesión.
   */
  hydrateFromUrl: () => Promise<void>;

  /**
   * Al iniciar la app, valida un token previamente persistido contra el broker.
   * Si es válido, monta la sesión; si no, queda como invitado.
   */
  hydrateFromStorage: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;