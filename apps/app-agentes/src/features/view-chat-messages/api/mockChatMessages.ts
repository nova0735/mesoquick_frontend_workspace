import type { ChatMessage } from '../../../entities/chat';

/**
 * Historial de mensajes por chat — mock del endpoint
 * GET /api/chats/:chatId/mensajes (§3.2).
 *
 * Incluye:
 *   - Chats escalados desde el bot (chat-001, chat-004): hilo previo con
 *     mensajes del bot y del usuario antes de la transferencia al agente.
 *   - Chats pendientes "normales": solo el mensaje inicial del usuario.
 *   - Chats activos: ida y vuelta con el agente demo.
 *
 * Las claves son los `id` de los chats sembrados en mockPendingChats y
 * mockActiveChats.
 *
 * TODO(backend): reemplazar por GET /api/chats/:chatId/mensajes vía
 * core-network. El backend devolverá el historial completo incluyendo el
 * hilo del chatbot cuando aplique (campo escalado_desde_bot: true según §3.2).
 */

const REFERENCE_NOW = Date.now();

function timeAgo(minutes: number, seconds = 0): string {
  return new Date(
    REFERENCE_NOW - minutes * 60_000 - seconds * 1_000,
  ).toISOString();
}

const BOT_NAME = 'MesoQuick Bot';
const AGENT_DEMO_NAME = 'Agente Demo';

export const MOCK_CHAT_MESSAGES: Record<string, readonly ChatMessage[]> = {
  // === Pendientes ===

  // chat-001: Andrea (cliente) — hilo previo del bot, sin agente todavía.
  'chat-001': [
    {
      id: 'msg-001-1',
      chatId: 'chat-001',
      sender: 'BOT',
      senderName: BOT_NAME,
      text: 'Hola Andrea, soy el asistente automatizado de MesoQuick. ¿En qué te puedo ayudar?',
      sentAt: timeAgo(8),
    },
    {
      id: 'msg-001-2',
      chatId: 'chat-001',
      sender: 'USER',
      senderName: 'Andrea Figueroa',
      text: 'Mi pedido no ha llegado y ya pasaron casi 50 minutos.',
      sentAt: timeAgo(7, 30),
    },
    {
      id: 'msg-001-3',
      chatId: 'chat-001',
      sender: 'BOT',
      senderName: BOT_NAME,
      text: 'Lamento mucho la espera. ¿Me podrías indicar el número de tu pedido?',
      sentAt: timeAgo(7),
    },
    {
      id: 'msg-001-4',
      chatId: 'chat-001',
      sender: 'USER',
      senderName: 'Andrea Figueroa',
      text: 'ORD-4421',
      sentAt: timeAgo(6, 30),
    },
    {
      id: 'msg-001-5',
      chatId: 'chat-001',
      sender: 'BOT',
      senderName: BOT_NAME,
      text: 'Gracias. Como el caso requiere intervención humana, voy a transferirte con un agente. Por favor espera un momento.',
      sentAt: timeAgo(5),
    },
    {
      id: 'msg-001-6',
      chatId: 'chat-001',
      sender: 'SYSTEM',
      senderName: 'Sistema',
      text: 'Caso escalado desde el chatbot. Esperando a que un agente lo tome.',
      sentAt: timeAgo(4),
    },
  ],

  // chat-002: Keyla (repartidora) — mensaje inicial sin bot.
  'chat-002': [
    {
      id: 'msg-002-1',
      chatId: 'chat-002',
      sender: 'USER',
      senderName: 'Keyla Mejía',
      text: 'Buenas, está lloviendo muy fuerte en El Hatillo. ¿Pueden autorizar tarifa por clima para mis viajes de esta hora?',
      sentAt: timeAgo(3),
    },
  ],

  // chat-003: Luis Fernando (cliente) — mensaje inicial sin bot.
  'chat-003': [
    {
      id: 'msg-003-1',
      chatId: 'chat-003',
      sender: 'USER',
      senderName: 'Luis Fernando Paz',
      text: 'Hola, vi en mi estado de cuenta que me cobraron dos veces el pedido ORD-4399. Necesito que me reembolsen uno.',
      sentAt: timeAgo(14),
    },
  ],

  // chat-004: Laura (negocio) — hilo previo del bot.
  'chat-004': [
    {
      id: 'msg-004-1',
      chatId: 'chat-004',
      sender: 'BOT',
      senderName: BOT_NAME,
      text: 'Hola, soy el asistente automatizado de MesoQuick. ¿En qué te puedo ayudar?',
      sentAt: timeAgo(27),
    },
    {
      id: 'msg-004-2',
      chatId: 'chat-004',
      sender: 'USER',
      senderName: 'Laura Cáceres',
      text: 'La app dice que el pedido ORD-4380 ya fue entregado, pero el cliente nos está llamando y dice que nunca lo recibió.',
      sentAt: timeAgo(26),
    },
    {
      id: 'msg-004-3',
      chatId: 'chat-004',
      sender: 'BOT',
      senderName: BOT_NAME,
      text: 'Este caso requiere investigación de un agente humano. Te transfiero ahora mismo.',
      sentAt: timeAgo(24),
    },
    {
      id: 'msg-004-4',
      chatId: 'chat-004',
      sender: 'SYSTEM',
      senderName: 'Sistema',
      text: 'Caso escalado desde el chatbot. Esperando a que un agente lo tome.',
      sentAt: timeAgo(22),
    },
  ],

  // === Activos (asignados al agente demo) ===

  // chat-005: Gabriela (cliente bloqueada) — disputa por bloqueo.
  'chat-005': [
    {
      id: 'msg-005-1',
      chatId: 'chat-005',
      sender: 'USER',
      senderName: 'Gabriela Midence',
      text: 'Hola, mi cuenta aparece bloqueada y no entiendo por qué. No he hecho nada raro.',
      sentAt: timeAgo(40),
    },
    {
      id: 'msg-005-2',
      chatId: 'chat-005',
      sender: 'AGENT',
      senderName: AGENT_DEMO_NAME,
      text: 'Hola Gabriela, soy del equipo de soporte. Voy a revisar tu caso. ¿Recuerdas si compartiste tu cuenta con alguien recientemente?',
      sentAt: timeAgo(35),
    },
    {
      id: 'msg-005-3',
      chatId: 'chat-005',
      sender: 'USER',
      senderName: 'Gabriela Midence',
      text: 'No, nadie más tiene mi contraseña. Solo la uso yo desde mi celular.',
      sentAt: timeAgo(2),
    },
  ],

  // chat-006: Óscar (repartidor) — saldo no actualizado.
  'chat-006': [
    {
      id: 'msg-006-1',
      chatId: 'chat-006',
      sender: 'USER',
      senderName: 'Óscar Bautista',
      text: 'Buenas, completé 3 viajes hoy pero solo me aparece el saldo del primero.',
      sentAt: timeAgo(18),
    },
    {
      id: 'msg-006-2',
      chatId: 'chat-006',
      sender: 'AGENT',
      senderName: AGENT_DEMO_NAME,
      text: 'Hola Óscar, gracias por reportarlo. ¿Me das los IDs de los otros dos pedidos?',
      sentAt: timeAgo(12),
    },
    {
      id: 'msg-006-3',
      chatId: 'chat-006',
      sender: 'USER',
      senderName: 'Óscar Bautista',
      text: 'ORD-4400 y ORD-4412.',
      sentAt: timeAgo(3),
    },
    {
      id: 'msg-006-4',
      chatId: 'chat-006',
      sender: 'AGENT',
      senderName: AGENT_DEMO_NAME,
      text: 'Perfecto, ya estoy verificando con el sistema de liquidaciones. Dame unos minutos.',
      sentAt: timeAgo(1),
    },
  ],
};
