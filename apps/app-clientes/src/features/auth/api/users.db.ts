/**
 * "Base de datos" mock de usuarios registrados.
 *
 * NOTA ARQUITECTURAL:
 * Este archivo simula una BD de usuarios mientras no hay backend real.
 * Cuando el broker esté disponible, este archivo se ELIMINA y las
 * funciones loginUser/registerUser en auth.api.ts apuntan al broker.
 * Los componentes UI no cambian.
 *
 * NOTA DE SEGURIDAD:
 * Guardar contraseñas en plain text en localStorage es INACEPTABLE en
 * producción. Acá es válido SOLO porque es un mock académico. En producción
 * real, las contraseñas se hashean (bcrypt/argon2) del lado del servidor
 * y JAMÁS se exponen al frontend.
 */

import type { AuthUser } from '../model/auth.types';

/**
 * Registro de usuario en la "BD". Incluye contraseña en plain text
 * (solo en mock, ver nota arriba).
 */
export interface StoredUser extends AuthUser {
  password: string;
}

const STORAGE_KEY = 'mesoquick:users-db';

/**
 * Lee la lista de usuarios registrados desde localStorage.
 * Si hay corrupción de datos, devuelve array vacío sin crashear.
 */
function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Silenciar (modo incógnito, cuota llena, etc.)
  }
}

/**
 * Verifica si un email ya está registrado.
 */
export function emailExists(email: string): boolean {
  const users = readUsers();
  const normalized = email.trim().toLowerCase();
  return users.some((u) => u.email.toLowerCase() === normalized);
}

/**
 * Agrega un usuario nuevo a la "BD".
 * Lanza error si el email ya existe (validar antes con emailExists).
 */
export function insertUser(user: StoredUser): void {
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    throw new Error('Este correo ya está registrado');
  }
  users.push(user);
  writeUsers(users);
}

/**
 * Busca un usuario por email+password. Devuelve null si no coincide.
 */
export function findUserByCredentials(
  email: string,
  password: string
): StoredUser | null {
  const users = readUsers();
  const normalized = email.trim().toLowerCase();
  const found = users.find(
    (u) => u.email.toLowerCase() === normalized && u.password === password
  );
  return found ?? null;
}

/**
 * Actualiza datos editables de un usuario existente.
 * No permite cambiar email ni password desde acá (eso sería otra acción).
 */
export function updateUser(
  userId: string,
  changes: Partial<Pick<AuthUser, 'phone' | 'defaultAddress' | 'name'>>
): void {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return;
  users[idx] = { ...users[idx], ...changes };
  writeUsers(users);
}