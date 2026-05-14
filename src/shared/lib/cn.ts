import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind inteligentemente.
 * - clsx: une clases condicionales
 * - tailwind-merge: resuelve conflictos (ej: si pasas "p-2 p-4", deja solo "p-4")
 *
 * Uso:
 * cn('p-4 bg-accent', isActive && 'border-2', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}