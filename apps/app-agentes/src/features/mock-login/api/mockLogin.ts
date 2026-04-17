import type { AuthResponse } from '../../../entities/session';

/**
 * Simulación local del endpoint POST /api/auth/login descrito en la sección
 * 3.1 del "Documento de Interacciones" del módulo de Agentes.
 *
 * TODO(backend): cuando el Bróker esté disponible, reemplazar esta función por
 * una llamada real usando la instancia Singleton de Axios de
 * @mesoquick/core-network:
 *
 *   const { data } = await http.post<AuthResponse>('/api/auth/login', creds);
 *   return data;
 *
 * Mientras tanto, validamos contra un único agente fijo.
 */

export interface LoginCredentialsInput {
  email: string;
  password: string;
}

// Credenciales válidas en modo DEV. Cualquier otra combinación falla.
export const MOCK_AGENT_CREDENTIALS = {
  email: 'agente@mesoquick.com',
  password: 'Demo1234',
} as const;

// Delay simulado para que el estado de carga del formulario sea visible.
const NETWORK_DELAY_MS = 400;

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Correo o contraseña incorrectos.');
    this.name = 'InvalidCredentialsError';
  }
}

export async function mockLogin(
  credentials: LoginCredentialsInput,
): Promise<AuthResponse> {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, NETWORK_DELAY_MS);
  });

  const isValid =
    credentials.email.trim().toLowerCase() === MOCK_AGENT_CREDENTIALS.email &&
    credentials.password === MOCK_AGENT_CREDENTIALS.password;

  if (!isValid) {
    throw new InvalidCredentialsError();
  }

  // JWT falso — cualquier string sirve mientras no haya verificación real.
  return {
    token: 'mock.jwt.agent-demo-token',
    user: {
      id: 'agent-001',
      name: 'Agente Demo',
      role: 'AGENT',
    },
  };
}
