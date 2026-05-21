import { useSessionStore } from '../../../entities/session';
import { decodeAgentToken, InvalidTokenError } from '../api/decodeAgentToken';

/**
 * Clave usada por @mesoquick/core-network/axios.interceptor para inyectar el
 * Bearer token. La duplicamos junto a "mesoquick.session" (la clave nativa
 * de app-agentes) para que tanto el store local como el cliente HTTP encuentren
 * el JWT sin un refactor del interceptor.
 */
const CORE_NETWORK_TOKEN_KEY = 'access_token';

/**
 * URL del shell-login a la que devolvemos al usuario cuando el handshake
 * falla (token inválido, expirado o rol no permitido).
 *
 * TODO(env): cuando el monorepo exponga una variable VITE_SHELL_LOGIN_URL,
 * leerla en vez de hardcodearla.
 */
const SHELL_LOGIN_URL = 'http://localhost:5173/';

function stripTokenFromUrl(): void {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('token')) return;
  url.searchParams.delete('token');
  const cleanedPath = url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : '') + url.hash;
  window.history.replaceState({}, '', cleanedPath);
}

/**
 * Intenta hidratar la sesión a partir del query param `?token=...` con el que
 * shell-login redirige tras un login exitoso.
 *
 * Devuelve `true` si pudo hidratar (en cuyo caso NO hay que llamar a
 * hydrateFromStorage después), `false` si no había token en la URL.
 *
 * Si el token está presente pero es inválido/expirado, redirige al shell-login
 * y devuelve `true` para indicar que el flujo ya fue manejado.
 */
export function bootstrapSessionFromUrl(): boolean {
  const params = new URLSearchParams(window.location.search);
  const rawToken = params.get('token');
  if (!rawToken) return false;

  try {
    const session = decodeAgentToken(rawToken);

    useSessionStore.getState().setSession(session);
    window.localStorage.setItem(CORE_NETWORK_TOKEN_KEY, session.token);

    stripTokenFromUrl();
    return true;
  } catch (error) {
    const message =
      error instanceof InvalidTokenError
        ? error.message
        : 'Error desconocido al procesar el token.';
    console.error('[receive-session] Token rechazado:', message);

    stripTokenFromUrl();
    window.location.replace(SHELL_LOGIN_URL);
    return true;
  }
}
