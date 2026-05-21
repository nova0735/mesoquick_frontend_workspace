import { jwtDecode } from 'jwt-decode';
import type { AuthResponse, AuthenticatedUser, UserRole } from '../../../entities/session';

/**
 * Claims que esperamos del JWT emitido por el broker.
 *
 * El backend aún no estandarizó el shape, así que aceptamos variantes:
 *   - id: `sub`, `id`, `userId`, `usuario_id`
 *   - rol: `role`, `rol`
 *   - nombre: `name`, `nombre`; si no viene, se deriva del email
 */
interface BrokerTokenClaims {
  sub?: string | number;
  id?: string | number;
  userId?: string | number;
  usuario_id?: string | number;

  email?: string;
  name?: string;
  nombre?: string;

  role?: string;
  rol?: string;

  exp?: number;
  iat?: number;
}

export class InvalidTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTokenError';
  }
}

const ROLE_ALIASES: Record<string, UserRole> = {
  AGENT: 'AGENT',
  AGENTE: 'AGENT',
  agent: 'AGENT',
  agente: 'AGENT',
  COURIER: 'COURIER',
  REPARTIDOR: 'COURIER',
  courier: 'COURIER',
  repartidor: 'COURIER',
  CLIENT: 'CLIENT',
  CLIENTE: 'CLIENT',
  client: 'CLIENT',
  cliente: 'CLIENT',
  BUSINESS: 'BUSINESS',
  EMPRESA: 'BUSINESS',
  business: 'BUSINESS',
  empresa: 'BUSINESS',
  ADMIN: 'ADMIN',
  admin: 'ADMIN',
};

function normalizeRole(raw: string | undefined): UserRole | null {
  if (!raw) return null;
  return ROLE_ALIASES[raw] ?? ROLE_ALIASES[raw.toUpperCase()] ?? null;
}

function pickId(claims: BrokerTokenClaims): string | null {
  const candidate =
    claims.sub ?? claims.id ?? claims.userId ?? claims.usuario_id;
  if (candidate === undefined || candidate === null) return null;
  return String(candidate);
}

function pickName(claims: BrokerTokenClaims): string {
  if (claims.name && claims.name.trim()) return claims.name.trim();
  if (claims.nombre && claims.nombre.trim()) return claims.nombre.trim();
  // Fallback: derivar del email (parte antes del @, capitalizada)
  if (claims.email) {
    const localPart = claims.email.split('@')[0];
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  }
  return 'Agente';
}

function isExpired(exp: number | undefined): boolean {
  if (!exp) return false;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return exp <= nowSeconds;
}

/**
 * Decodifica el JWT entregado por shell-login y lo convierte en un AuthResponse
 * usable por el store de sesión de app-agentes.
 *
 * No valida la firma del token (eso le toca al backend en cada request) —
 * solo decodifica el payload y verifica la estructura mínima + expiración.
 */
export function decodeAgentToken(token: string): AuthResponse {
  let claims: BrokerTokenClaims;
  try {
    claims = jwtDecode<BrokerTokenClaims>(token);
  } catch {
    throw new InvalidTokenError('El token no es un JWT válido.');
  }

  if (isExpired(claims.exp)) {
    throw new InvalidTokenError('El token está expirado.');
  }

  const id = pickId(claims);
  if (!id) {
    throw new InvalidTokenError('El token no incluye un identificador de usuario.');
  }

  const role = normalizeRole(claims.role ?? claims.rol);
  if (!role) {
    throw new InvalidTokenError(
      `Rol "${claims.role ?? claims.rol ?? '(vacío)'}" no reconocido en el token.`,
    );
  }

  const user: AuthenticatedUser = {
    id,
    role,
    name: pickName(claims),
  };

  return { token, user };
}
