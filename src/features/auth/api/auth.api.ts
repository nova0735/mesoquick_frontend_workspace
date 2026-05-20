/**
 * Capa API de autenticación.
 *
 * MOCK: usa users.db.ts (localStorage) como "base de datos".
 *
 * PARA MIGRAR AL BACKEND REAL:
 * Solo reemplazar el cuerpo de loginUser/registerUser/logoutUser
 * con llamadas fetch al broker. La firma de las funciones NO cambia,
 * así que los componentes UI no se enteran de la migración.
 *
 * Ejemplo futuro:
 *   export async function loginUser(data) {
 *     const res = await fetch(`${BROKER_URL}/auth/login`, {...});
 *     if (!res.ok) throw new Error('Credenciales inválidas');
 *     return res.json();
 *   }
 */

import type {
  RegisterFormData,
  LoginFormData,
  AuthUser,
} from '../model/auth.types';
import {
  emailExists,
  insertUser,
  findUserByCredentials,
  type StoredUser,
} from './users.db';

const fakeDelay = (ms = 700): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Registra un nuevo usuario en la BD mock.
 * Lanza error si el email ya existe.
 */
export async function registerUser(data: RegisterFormData): Promise<AuthUser> {
  await fakeDelay();

  if (emailExists(data.email)) {
    throw new Error('Este correo ya está registrado');
  }

  const newUser: StoredUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name: data.name,
    email: data.email.trim().toLowerCase(),
    phone: data.phone,
    defaultAddress: data.defaultAddress,
    createdAt: new Date().toISOString(),
    password: data.password,
  };

  insertUser(newUser);

  // Devolvemos el AuthUser SIN la contraseña (no se expone a la app)
  const { password: _, ...publicUser } = newUser;
  return publicUser;
}

/**
 * Valida credenciales contra la BD mock.
 * Lanza error si email o password son incorrectos.
 */
export async function loginUser(data: LoginFormData): Promise<AuthUser> {
  await fakeDelay();

  const user = findUserByCredentials(data.email, data.password);
  if (!user) {
    throw new Error('Email o contraseña incorrectos');
  }

  // Devolvemos el AuthUser SIN la contraseña
  const { password: _, ...publicUser } = user;
  return publicUser;
}

export async function logoutUser(): Promise<void> {
  await fakeDelay(300);
}