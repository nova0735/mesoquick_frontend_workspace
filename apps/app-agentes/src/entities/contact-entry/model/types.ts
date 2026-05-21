/**
 * Departamentos internos disponibles en el directorio de contacto.
 *
 * Alineados con la sección §3.5 del PDF de Interacciones UI Agentes:
 * el directorio debe permitir a los agentes localizar rápidamente a
 * operaciones, supervisores, finanzas y legal.
 */
export type Department =
  | 'OPERACIONES'
  | 'SUPERVISORES'
  | 'FINANZAS'
  | 'LEGAL'
  | 'SOPORTE_TECNICO';

export const DEPARTMENT_LABEL: Record<Department, string> = {
  OPERACIONES: 'Operaciones',
  SUPERVISORES: 'Supervisores',
  FINANZAS: 'Finanzas',
  LEGAL: 'Legal',
  SOPORTE_TECNICO: 'Soporte Técnico',
};

/**
 * Un contacto del directorio interno.
 *
 * - `available`: indica si la persona está en turno actualmente. En mock
 *   siempre es estático; con el backend esto vendría del estado de turno real.
 * - `phone` y `email`: al menos uno debe existir, pero el tipo no lo fuerza
 *   a nivel de TS para no complicar el modelo — la validación la haría el backend.
 */
export interface ContactEntry {
  id: string;
  name: string;
  role: string;
  department: Department;
  phone: string | null;
  email: string;
  available: boolean;
}
