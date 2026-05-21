import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  registerUser,
  loginUser,
  brokerLogin,
  brokerRegisterClient,
  brokerGetMe,
  isClientRole,
  mapBrokerUserToAuthUser,
} from '../api/auth.api';
import type {
  AuthStore,
  AuthUser,
  RegisterFormData,
  LoginFormData,
} from './auth.types';

const TOKEN_KEY = 'access_token';

function persistToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Para REGISTRO: caer al mock si el broker no responde o tira 500.
 * Si tira 400 (ej. email duplicado), respetar y mostrar al usuario.
 */
function shouldFallbackOnRegister(err: unknown): boolean {
  const status = (err as { status?: number })?.status;
  if (status == null) return true;
  return status >= 500 && status < 600;
}

/**
 * Para LOGIN: caer al mock si el broker no responde, tira 500, o tira 401/404.
 * El 401/404 importa porque el usuario puede haberse registrado en modo mock
 * (broker estaba caído) y ahora intentar loguearse. El mock buscará en su BD
 * local; si tampoco existe ahí, devolverá un error claro al usuario.
 */
function shouldFallbackOnLogin(err: unknown): boolean {
  const status = (err as { status?: number })?.status;
  if (status == null) return true;
  if (status >= 500 && status < 600) return true;
  if (status === 401 || status === 404) return true;
  return false;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrating: false,
      error: null,
      token: typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,

      // ─────────────────────────────── register ──────────────────────────────
      register: async (data: RegisterFormData) => {
        set({ isLoading: true, error: null });
        try {
          try {
            await brokerRegisterClient(data);
            const loginData = await brokerLogin(data.email, data.password);
            persistToken(loginData.token);
            set({
              user: mapBrokerUserToAuthUser({
                ...loginData.usuario,
                phone: loginData.usuario.phone ?? data.phone,
                address: loginData.usuario.address ?? data.defaultAddress,
              }),
              token: loginData.token,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          } catch (brokerErr) {
            console.warn('⚠️ Broker no disponible o devolvió error:', brokerErr);
            if (!shouldFallbackOnRegister(brokerErr)) {
              const msg = brokerErr instanceof Error ? brokerErr.message : 'Error de registro';
              set({ error: msg, isLoading: false });
              return;
            }
            console.info('ℹ️ Usando registro mock (broker caído)');
            const user = await registerUser(data);
            set({ user, isAuthenticated: true, isLoading: false });
          }
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Error al registrarse';
          set({ error: message, isLoading: false });
        }
      },

      // ──────────────────────────────── login ────────────────────────────────
      login: async (data: LoginFormData) => {
        set({ isLoading: true, error: null });
        try {
          try {
            const result = await brokerLogin(data.email, data.password);
            persistToken(result.token);
            set({
              user: mapBrokerUserToAuthUser(result.usuario),
              token: result.token,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          } catch (brokerErr) {
            console.warn('⚠️ Broker no disponible o devolvió error:', brokerErr);
            if (!shouldFallbackOnLogin(brokerErr)) {
              const msg = brokerErr instanceof Error ? brokerErr.message : 'Error de login';
              set({ error: msg, isLoading: false });
              return;
            }
            console.info('ℹ️ Intentando login mock (broker caído o usuario solo local)');
            const user = await loginUser(data);
            set({ user, isAuthenticated: true, isLoading: false });
          }
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Error al iniciar sesión';
          set({ error: message, isLoading: false });
        }
      },

      // ────────────────────────────── update ─────────────────────────────────
      updateProfile: (
        changes: Partial<Pick<AuthUser, 'phone' | 'defaultAddress'>>
      ) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...changes } });
      },

      logout: () => {
        persistToken(null);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      // ──────────────────────── hydrate from URL ─────────────────────────────
      hydrateFromUrl: async () => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get('token');
        if (!tokenFromUrl) return;

        params.delete('token');
        const cleanQuery = params.toString();
        const newUrl =
          window.location.pathname +
          (cleanQuery ? `?${cleanQuery}` : '') +
          window.location.hash;
        window.history.replaceState({}, document.title, newUrl);

        persistToken(tokenFromUrl);
        set({ token: tokenFromUrl, isHydrating: true });

        try {
          const me = await brokerGetMe(tokenFromUrl);
          if (!isClientRole(me.rol ?? me.role)) {
            persistToken(null);
            set({
              token: null,
              user: null,
              isAuthenticated: false,
              isHydrating: false,
              error:
                'Esta sesión no pertenece a una cuenta de cliente. Iniciá sesión de nuevo.',
            });
            return;
          }
          set({
            user: mapBrokerUserToAuthUser(me),
            isAuthenticated: true,
            isHydrating: false,
            error: null,
          });
        } catch {
          persistToken(null);
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isHydrating: false,
          });
        }
      },

      // ─────────────────────── hydrate from storage ──────────────────────────
      hydrateFromStorage: async () => {
        if (typeof window === 'undefined') return;
        const token = localStorage.getItem(TOKEN_KEY) ?? get().token;
        if (!token) return;

        set({ isHydrating: true });
        try {
          const me = await brokerGetMe(token);
          if (!isClientRole(me.rol ?? me.role)) {
            persistToken(null);
            set({
              token: null,
              user: null,
              isAuthenticated: false,
              isHydrating: false,
            });
            return;
          }
          set({
            user: mapBrokerUserToAuthUser(me),
            token,
            isAuthenticated: true,
            isHydrating: false,
          });
        } catch {
          set({ isHydrating: false });
        }
      },
    }),
    {
      name: 'mesoquick-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
);