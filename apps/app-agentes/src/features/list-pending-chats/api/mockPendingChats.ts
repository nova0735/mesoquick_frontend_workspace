import type { Chat } from '../../../entities/chat';

/**
 * Cola de chats pendientes — mock del endpoint GET /api/chats/pendientes (§3.2).
 *
 * Mezcla intencional:
 *   - Clientes, repartidores y empresas.
 *   - Algunos escalados desde el chatbot (escalatedFromBot: true), otros no.
 *   - Tiempos de apertura distintos para que el orden por antigüedad sea visible.
 *
 * Los `userId` referencian entradas existentes en MOCK_SUPPORT_USERS para que el
 * panel derecho de contexto pueda cargar el perfil completo sin endpoints reales.
 *
 * TODO(backend): reemplazar por GET /api/chats/pendientes vía core-network.
 * El servidor devolverá esta lista filtrada y ordenada según su lógica de prioridad.
 */

// Fijo el "ahora" al cargar el módulo para que los timestamps relativos sean
// estables durante toda la sesión y no muten entre re-renders.
const REFERENCE_NOW = Date.now();

function minutesAgo(minutes: number): string {
  return new Date(REFERENCE_NOW - minutes * 60_000).toISOString();
}

export const MOCK_PENDING_CHATS: readonly Chat[] = [
  {
    id: 'chat-001',
    requester: {
      userId: 'client-101',
      userType: 'CLIENT',
      name: 'Andrea Figueroa',
    },
    status: 'PENDING',
    openedAt: minutesAgo(8),
    lastActivityAt: minutesAgo(4),
    escalatedFromBot: true,
    subject: 'Pedido no entregado',
  },
  {
    id: 'chat-002',
    requester: {
      userId: 'courier-202',
      userType: 'COURIER',
      name: 'Keyla Mejía',
    },
    status: 'PENDING',
    openedAt: minutesAgo(3),
    lastActivityAt: minutesAgo(3),
    escalatedFromBot: false,
    subject: 'Solicitud de aumento de tarifa por clima',
  },
  {
    id: 'chat-003',
    requester: {
      userId: 'client-102',
      userType: 'CLIENT',
      name: 'Luis Fernando Paz',
    },
    status: 'PENDING',
    openedAt: minutesAgo(14),
    lastActivityAt: minutesAgo(14),
    escalatedFromBot: false,
    subject: 'Cobro duplicado en tarjeta',
  },
  {
    id: 'chat-004',
    requester: {
      userId: 'business-301',
      userType: 'BUSINESS',
      name: 'Laura Cáceres',
    },
    status: 'PENDING',
    openedAt: minutesAgo(27),
    lastActivityAt: minutesAgo(22),
    escalatedFromBot: true,
    subject: 'Pedido marcado entregado pero el cliente no lo recibió',
  },
];
