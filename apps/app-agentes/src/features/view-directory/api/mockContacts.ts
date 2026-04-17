import type { ContactEntry } from '../../../entities/contact-entry';

/**
 * Directorio interno mock para el panel de agentes.
 *
 * TODO(backend): reemplazar por GET /api/agents/directory vía
 * @mesoquick/core-network. Mantener la misma forma ContactEntry[].
 */
export const MOCK_CONTACTS: readonly ContactEntry[] = [
  {
    id: 'contact-001',
    name: 'Carlos Mendoza',
    role: 'Coordinador de operaciones',
    department: 'OPERACIONES',
    phone: '+504 9876-5432',
    email: 'carlos.mendoza@mesoquick.com',
    available: true,
  },
  {
    id: 'contact-002',
    name: 'María Elena Reyes',
    role: 'Supervisora de turno',
    department: 'SUPERVISORES',
    phone: '+504 9812-3456',
    email: 'maria.reyes@mesoquick.com',
    available: true,
  },
  {
    id: 'contact-003',
    name: 'José Hernández',
    role: 'Supervisor nocturno',
    department: 'SUPERVISORES',
    phone: '+504 9845-6789',
    email: 'jose.hernandez@mesoquick.com',
    available: false,
  },
  {
    id: 'contact-004',
    name: 'Ana Patricia López',
    role: 'Analista de pagos',
    department: 'FINANZAS',
    phone: null,
    email: 'ana.lopez@mesoquick.com',
    available: true,
  },
  {
    id: 'contact-005',
    name: 'Roberto Castillo',
    role: 'Contador de compensaciones',
    department: 'FINANZAS',
    phone: '+504 9901-2345',
    email: 'roberto.castillo@mesoquick.com',
    available: false,
  },
  {
    id: 'contact-006',
    name: 'Lucía Fernanda Cruz',
    role: 'Asesora legal de turno',
    department: 'LEGAL',
    phone: '+504 9923-4567',
    email: 'lucia.cruz@mesoquick.com',
    available: true,
  },
  {
    id: 'contact-007',
    name: 'Diego Ramírez',
    role: 'Ingeniero de soporte',
    department: 'SOPORTE_TECNICO',
    phone: null,
    email: 'diego.ramirez@mesoquick.com',
    available: true,
  },
  {
    id: 'contact-008',
    name: 'Sofía Martínez',
    role: 'Líder de operaciones de campo',
    department: 'OPERACIONES',
    phone: '+504 9867-1234',
    email: 'sofia.martinez@mesoquick.com',
    available: false,
  },
];
