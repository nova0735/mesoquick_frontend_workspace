/**
 * Contratos de sesión compartidos con el Orquestador @mesoquick/shell-login.
 *
 * TODO(contracts): cuando el monorepo extraiga los DTOs a un paquete compartido
 * (ej. @mesoquick/contracts), reemplazar esta duplicación por un import.
 * Fuente de verdad actual: apps/shell-login/src/entities/session/model/types.ts
 */

export type UserRole = 'CLIENT' | 'COURIER' | 'BUSINESS' | 'AGENT' | 'ADMIN';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  name: string;
}

export interface AuthResponse {
  token: string; // JWT
  user: AuthenticatedUser;
}

/**
 * Estado vivo de la sesión dentro de la app de agentes.
 * Se deriva de un AuthResponse ya hidratado desde localStorage o desde el login.
 */
export interface SessionState {
  token: string | null;
  user: AuthenticatedUser | null;
  isHydrated: boolean;
}
