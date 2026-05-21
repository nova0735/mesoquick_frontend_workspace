import type { Chat } from '../../../entities/chat';

/**
 * Chats ya tomados por el agente en sesión — mock del endpoint
 * GET /api/chats/activos/:agenteId (§3.2).
 *
 * Como el endpoint es por agente, los seeds están "asignados" al agente demo
 * `agent-001`. Cuando se conecte el backend, el filtrado lo hace el servidor;
 * acá lo simulamos en el campo assignedAgentId.
 *
 * TODO(backend): reemplazar por GET /api/chats/activos/:agenteId vía
 * core-network. El backend probablemente paginará — el cliente solo lee la
 * página actual del store.
 */

const REFERENCE_NOW = Date.now();

function minutesAgo(minutes: number): string {
  return new Date(REFERENCE_NOW - minutes * 60_000).toISOString();
}

/** ID del agente demo. Coincide con el que devuelve mockLogin(). */
const DEMO_AGENT_ID = 'agent-001';

export const MOCK_ACTIVE_CHATS: readonly Chat[] = [
  {
    id: 'chat-005',
    requester: {
      userId: 'client-103',
      userType: 'CLIENT',
      name: 'Gabriela Midence',
    },
    status: 'IN_ATTENTION',
    openedAt: minutesAgo(40),
    lastActivityAt: minutesAgo(2),
    assignedAgentId: DEMO_AGENT_ID,
    escalatedFromBot: false,
    subject: 'Disputa por bloqueo de cuenta',
  },
  {
    id: 'chat-006',
    requester: {
      userId: 'courier-201',
      userType: 'COURIER',
      name: 'Óscar Bautista',
    },
    status: 'IN_ATTENTION',
    openedAt: minutesAgo(18),
    lastActivityAt: minutesAgo(1),
    assignedAgentId: DEMO_AGENT_ID,
    escalatedFromBot: false,
    subject: 'Saldo de hoy no se ha actualizado',
  },
];
