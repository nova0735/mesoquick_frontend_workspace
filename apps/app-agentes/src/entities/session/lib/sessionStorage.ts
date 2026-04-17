import type { AuthResponse } from '../model/types';

/**
 * Helpers de persistencia local de la sesión.
 *
 * Clave: "mesoquick.session". Este mismo slot será escrito por
 * @mesoquick/shell-login cuando el login real entre en producción, de modo que
 * app-agentes pueda hidratar sin cambiar una sola línea.
 */
const SESSION_STORAGE_KEY = 'mesoquick.session';

export function readSession(): AuthResponse | null {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isAuthResponse(parsed)) return null;
    return parsed;
  } catch {
    // localStorage puede estar bloqueado o el JSON corrupto — tratamos como "sin sesión".
    return null;
  }
}

export function writeSession(payload: AuthResponse): void {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

/**
 * Type-guard defensivo: no confiamos ciegamente en lo que haya en localStorage.
 * Un JSON viejo o manipulado no debe poder romper el arranque de la app.
 */
function isAuthResponse(value: unknown): value is AuthResponse {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.token !== 'string') return false;
  const user = candidate.user;
  if (typeof user !== 'object' || user === null) return false;
  const u = user as Record<string, unknown>;
  return (
    typeof u.id === 'string' &&
    typeof u.name === 'string' &&
    typeof u.role === 'string'
  );
}
