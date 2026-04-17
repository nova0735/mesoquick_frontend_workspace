import type { SupportUser } from '../../../entities/support-user';

/**
 * Usuarios mock consultables desde el panel de agentes.
 *
 * Distribución: 3 clientes, 3 repartidores, 3 empresas. Algunos bloqueados
 * para probar el badge de estado. Los IDs siguen el patrón <tipo>-NNN y se
 * referencian desde mockOrderHistory y mockCourierBalance.
 *
 * TODO(backend): reemplazar por GET /api/support/users vía @mesoquick/core-network.
 * El endpoint real probablemente segmentará por tipo, así que al migrar
 * habrá que ajustar findUser para llamar al endpoint correcto según type.
 */
export const MOCK_SUPPORT_USERS: readonly SupportUser[] = [
  {
    id: 'client-101',
    type: 'CLIENT',
    name: 'Andrea Figueroa',
    email: 'andrea.figueroa@mail.com',
    phone: '+504 9811-2233',
    status: 'ACTIVE',
    registeredAt: '2024-11-03T10:15:00.000Z',
  },
  {
    id: 'client-102',
    type: 'CLIENT',
    name: 'Luis Fernando Paz',
    email: 'lfpaz@mail.com',
    phone: '+504 9922-3344',
    status: 'ACTIVE',
    registeredAt: '2025-02-17T18:42:00.000Z',
  },
  {
    id: 'client-103',
    type: 'CLIENT',
    name: 'Gabriela Midence',
    email: 'gmidence@mail.com',
    phone: '+504 9733-4455',
    status: 'BLOCKED',
    registeredAt: '2025-06-09T08:30:00.000Z',
  },
  {
    id: 'courier-201',
    type: 'COURIER',
    name: 'Óscar Bautista',
    email: 'oscar.bautista@mesoquick-riders.hn',
    phone: '+504 9644-5566',
    status: 'ACTIVE',
    registeredAt: '2024-08-21T13:00:00.000Z',
  },
  {
    id: 'courier-202',
    type: 'COURIER',
    name: 'Keyla Mejía',
    email: 'keyla.mejia@mesoquick-riders.hn',
    phone: '+504 9555-6677',
    status: 'ACTIVE',
    registeredAt: '2025-01-12T09:18:00.000Z',
  },
  {
    id: 'courier-203',
    type: 'COURIER',
    name: 'Julio César Díaz',
    email: 'jcdiaz@mesoquick-riders.hn',
    phone: '+504 9466-7788',
    status: 'BLOCKED',
    registeredAt: '2024-10-01T12:00:00.000Z',
  },
  {
    id: 'business-301',
    type: 'BUSINESS',
    name: 'Laura Cáceres',
    email: 'laura.caceres@pupusasdonaluz.hn',
    phone: '+504 2250-1122',
    status: 'ACTIVE',
    registeredAt: '2024-05-14T16:00:00.000Z',
    businessName: 'Pupusas Doña Luz',
  },
  {
    id: 'business-302',
    type: 'BUSINESS',
    name: 'Manuel Ordóñez',
    email: 'manuel@burgermaster.hn',
    phone: '+504 2251-3344',
    status: 'ACTIVE',
    registeredAt: '2024-09-02T11:30:00.000Z',
    businessName: 'Burger Master Tegus',
  },
  {
    id: 'business-303',
    type: 'BUSINESS',
    name: 'Patricia Vallecillo',
    email: 'patricia@caferenacer.hn',
    phone: '+504 2252-5566',
    status: 'ACTIVE',
    registeredAt: '2025-03-20T14:45:00.000Z',
    businessName: 'Café Renacer',
  },
];
