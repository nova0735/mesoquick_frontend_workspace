import { userMock } from '@shared/mocks';
import type {
  RegisterFormData,
  LoginFormData,
  AuthUser,
} from '../model/auth.types';

// ============================================================================
//  MOCK (modo demo / fallback si el broker está caído)
// ============================================================================

const fakeDelay = (ms = 700): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * "BD" en localStorage para que los usuarios registrados en modo mock
 * sobrevivan recargas y puedan loguearse después.
 *
 * Estructura: { [email]: { user: AuthUser, password: string } }
 */
const MOCK_USERS_KEY = 'mesoquick-mock-users';

interface MockUserRecord {
  user: AuthUser;
  password: string;
}

function readMockDb(): Record<string, MockUserRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(MOCK_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeMockDb(db: Record<string, MockUserRecord>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(db));
}

export async function registerUser(data: RegisterFormData): Promise<AuthUser> {
  await fakeDelay();

  const email = data.email.trim().toLowerCase();
  const db = readMockDb();

  // El userMock predefinido no se puede sobreescribir
  if (email === userMock.email.toLowerCase()) {
    throw new Error('Este correo ya está registrado');
  }

  if (db[email]) {
    throw new Error('Este correo ya está registrado');
  }

  const newUser: AuthUser = {
    id: `user_${Date.now()}`,
    name: data.name,
    email,
    phone: data.phone,
    defaultAddress: data.defaultAddress,
    createdAt: new Date().toISOString(),
  };

  db[email] = { user: newUser, password: data.password };
  writeMockDb(db);

  return newUser;
}

export async function loginUser(data: LoginFormData): Promise<AuthUser> {
  await fakeDelay();

  const email = data.email.trim().toLowerCase();

  // 1) Intentar con el usuario predefinido (cualquier contraseña pasa, es demo)
  if (email === userMock.email.toLowerCase()) {
    return {
      id: userMock.id,
      name: userMock.name,
      email: userMock.email,
      phone: userMock.phone,
      defaultAddress: userMock.defaultAddress,
      createdAt: userMock.createdAt,
    };
  }

  // 2) Intentar con usuarios registrados en mock
  const db = readMockDb();
  const record = db[email];
  if (!record) {
    throw new Error('Correo o contraseña incorrectos');
  }
  if (record.password !== data.password) {
    throw new Error('Correo o contraseña incorrectos');
  }

  return record.user;
}

export async function logoutUser(): Promise<void> {
  await fakeDelay(300);
}

// ============================================================================
//  BROKER REAL (Railway) — integración con shell-login
// ============================================================================

const BROKER_BASE_URL =
  (import.meta.env.VITE_BROKER_URL as string | undefined) ??
  'https://broker-services-production.up.railway.app/api';

export const CLIENT_ROLE_ID = 1;

export interface BrokerUser {
  id: string | number;
  email: string;
  rol?: string | number;
  role?: string | number;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  [k: string]: any;
}

export interface BrokerLoginResponse {
  token: string;
  usuario: BrokerUser;
}

/** Error con código HTTP para que el store pueda decidir caer al mock o no. */
export class BrokerError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'BrokerError';
    this.status = status;
  }
}

async function buildBrokerError(response: Response, fallback: string): Promise<BrokerError> {
  let detail = fallback;
  try {
    const errData = await response.json();
    detail = errData.message ?? errData.error ?? `${fallback} (${response.status})`;
  } catch {
    detail = `${fallback} (${response.status})`;
  }
  return new BrokerError(detail, response.status);
}

/** POST /auth/login */
export async function brokerLogin(
  email: string,
  password: string
): Promise<BrokerLoginResponse> {
  const response = await fetch(`${BROKER_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw await buildBrokerError(response, 'Credenciales inválidas o error del servidor');
  }

  const result = await response.json();
  return (result.data ?? result) as BrokerLoginResponse;
}

/** POST /auth/register con rol = cliente. */
export async function brokerRegisterClient(
  payload: RegisterFormData
): Promise<unknown> {
  const [firstName, ...rest] = payload.name.trim().split(' ');
  const lastName = rest.join(' ') || firstName;

  const response = await fetch(`${BROKER_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName,
      lastName,
      email: payload.email,
      phone: payload.phone,
      address: payload.defaultAddress,
      password: payload.password,
      rol: CLIENT_ROLE_ID,
    }),
  });

  if (!response.ok) {
    throw await buildBrokerError(response, 'Error al registrar usuario en el servidor');
  }

  const result = await response.json();
  return result.data ?? { ok: true };
}

/** GET /auth/me */
export async function brokerGetMe(token: string): Promise<BrokerUser> {
  const response = await fetch(`${BROKER_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw await buildBrokerError(response, 'Token inválido o expirado');
  }

  const result = await response.json();
  return (result.data ?? result) as BrokerUser;
}

export function isClientRole(rol: string | number | undefined): boolean {
  if (rol == null) return false;
  if (typeof rol === 'number') return rol === CLIENT_ROLE_ID;
  const n = String(rol).trim().toLowerCase();
  return n === '1' || n === 'cliente' || n === 'client';
}

export function mapBrokerUserToAuthUser(u: BrokerUser): AuthUser {
  const composedName =
    u.name ?? [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
  const name = composedName || u.email?.split('@')[0] || 'Cliente';

  return {
    id: String(u.id),
    name,
    email: u.email,
    phone: u.phone ?? '',
    defaultAddress: u.address ?? '',
    createdAt: u.createdAt ?? new Date().toISOString(),
    role: u.rol != null ? String(u.rol) : u.role != null ? String(u.role) : undefined,
  };
}