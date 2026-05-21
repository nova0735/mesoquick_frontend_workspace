import type {
  ChatMessageSender,
  ChatRequester,
} from '../../../entities/chat';

/**
 * Script de eventos mock para simular el WS /ws/agente/:agenteId (§3.2).
 *
 * Cada paso describe qué pasa y cuándo (afterMs medido desde el momento en que
 * el simulador se monta en el InboxPage). El hook useChatEventSimulator es
 * quien convierte los templates en estados reales del store con timestamps
 * frescos al momento del fire.
 *
 * Eventos cubiertos:
 *   - Nuevo chat pendiente entrante (con o sin escalamiento de bot).
 *   - Nuevo mensaje del usuario en un chat existente (push del servidor).
 *
 * TODO(backend): reemplazar por suscripción real a SocketManager de
 * @mesoquick/core-network. El servidor emitirá eventos análogos en tiempo real
 * y cada uno se traducirá a un addIncomingChat / appendMessage del store.
 */

interface ScriptedMessage {
  id: string;
  sender: ChatMessageSender;
  senderName: string;
  text: string;
  /**
   * Cuántos segundos antes del fire se colocará el sentAt. Sirve para que el
   * hilo previo del bot tenga timestamps ordenados naturalmente cuando llega
   * un chat escalado.
   */
  secondsAgoFromFire?: number;
}

interface IncomingChatTemplate {
  chatId: string;
  requester: ChatRequester;
  escalatedFromBot: boolean;
  subject: string;
  initialMessages?: readonly ScriptedMessage[];
}

interface UserMessageTemplate {
  chatId: string;
  senderName: string;
  text: string;
}

export type ScriptStep =
  | { kind: 'INCOMING_CHAT'; afterMs: number; template: IncomingChatTemplate }
  | { kind: 'USER_MESSAGE'; afterMs: number; template: UserMessageTemplate };

export const CHAT_EVENT_SCRIPT: readonly ScriptStep[] = [
  {
    kind: 'USER_MESSAGE',
    afterMs: 20_000,
    template: {
      chatId: 'chat-005',
      senderName: 'Gabriela Midence',
      text: '¿Tienen alguna actualización? Necesito mi cuenta urgentemente.',
    },
  },
  {
    kind: 'INCOMING_CHAT',
    afterMs: 40_000,
    template: {
      chatId: 'chat-007',
      requester: {
        userId: 'business-302',
        userType: 'BUSINESS',
        name: 'Manuel Ordóñez',
      },
      escalatedFromBot: false,
      subject: 'Cliente reportó comida fría',
      initialMessages: [
        {
          id: 'msg-007-1',
          sender: 'USER',
          senderName: 'Manuel Ordóñez',
          text: 'Hola, un cliente nos llamó diciendo que la comida llegó fría. ¿Podemos coordinar un reembolso parcial?',
        },
      ],
    },
  },
  {
    kind: 'USER_MESSAGE',
    afterMs: 70_000,
    template: {
      chatId: 'chat-006',
      senderName: 'Óscar Bautista',
      text: '¡Gracias! Aquí espero.',
    },
  },
  {
    kind: 'INCOMING_CHAT',
    afterMs: 95_000,
    template: {
      chatId: 'chat-008',
      requester: {
        userId: 'business-303',
        userType: 'BUSINESS',
        name: 'Patricia Vallecillo',
      },
      escalatedFromBot: true,
      subject: 'Inventario desactualizado en la app',
      initialMessages: [
        {
          id: 'msg-008-1',
          sender: 'BOT',
          senderName: 'MesoQuick Bot',
          text: 'Hola, soy el asistente automatizado de MesoQuick. ¿En qué te ayudo?',
          secondsAgoFromFire: 90,
        },
        {
          id: 'msg-008-2',
          sender: 'USER',
          senderName: 'Patricia Vallecillo',
          text: 'Mi menú actualizado del jueves no aparece, los clientes siguen viendo el menú viejo.',
          secondsAgoFromFire: 60,
        },
        {
          id: 'msg-008-3',
          sender: 'BOT',
          senderName: 'MesoQuick Bot',
          text: 'Este caso requiere intervención humana. Te transfiero con un agente ahora mismo.',
          secondsAgoFromFire: 30,
        },
        {
          id: 'msg-008-4',
          sender: 'SYSTEM',
          senderName: 'Sistema',
          text: 'Caso escalado desde el chatbot. Esperando a que un agente lo tome.',
          secondsAgoFromFire: 5,
        },
      ],
    },
  },
];
