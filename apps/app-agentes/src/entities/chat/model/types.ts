import type { SupportUserType } from '../../support-user';

/**
 * Estado de un chat de soporte desde el punto de vista del agente
 * (§3.2 Interacciones UI Agentes).
 *
 * - PENDING: en cola, ningún agente lo ha tomado todavía.
 * - IN_ATTENTION: asignado al agente actual; admite mensajes en ambos sentidos.
 * - CLOSED: resuelto. Pasa por aquí cualquiera que sea la resolución final.
 */
export type ChatStatus = 'PENDING' | 'IN_ATTENTION' | 'CLOSED';

export const CHAT_STATUS_LABEL: Record<ChatStatus, string> = {
  PENDING: 'Pendiente',
  IN_ATTENTION: 'En atención',
  CLOSED: 'Cerrado',
};

/**
 * Resolución registrada al cerrar el chat. Lista cerrada según §3.2:
 * "solucionado, solucionado con compensación, solucionado con devolución,
 *  no solucionado, cerrado por vencimiento".
 */
export type ChatResolution =
  | 'SOLVED'
  | 'SOLVED_WITH_COMPENSATION'
  | 'SOLVED_WITH_REFUND'
  | 'UNSOLVED'
  | 'EXPIRED';

export const CHAT_RESOLUTION_LABEL: Record<ChatResolution, string> = {
  SOLVED: 'Solucionado',
  SOLVED_WITH_COMPENSATION: 'Solucionado con compensación',
  SOLVED_WITH_REFUND: 'Solucionado con devolución',
  UNSOLVED: 'No solucionado',
  EXPIRED: 'Cerrado por vencimiento',
};

/**
 * Emisor de un mensaje en el hilo. BOT solo aparece en chats escalados
 * desde el Servicio al Cliente Automatizado (§3.5).
 */
export type ChatMessageSender = 'USER' | 'AGENT' | 'BOT' | 'SYSTEM';

export interface ChatMessage {
  id: string;
  chatId: string;
  sender: ChatMessageSender;
  /** Nombre legible mostrado en el bubble. Ej: "Andrea Figueroa", "Agente Demo". */
  senderName: string;
  text: string;
  /** ISO timestamp. */
  sentAt: string;
}

/**
 * Usuario que abrió el caso de soporte, embebido en el chat para que la lista
 * de inbox no tenga que cruzar tablas. El detalle completo (teléfono, saldo,
 * historial) se carga aparte desde entities/support-user.
 */
export interface ChatRequester {
  userId: string;
  userType: SupportUserType;
  name: string;
}

/**
 * Chat de soporte. El campo `id` mapea al `id_chat` mencionado en §3.2.
 *
 * - `assignedAgentId`: undefined mientras PENDING; se asigna al tomar el chat.
 * - `escalatedFromBot`: true si el chat vino del chatbot. Cambia el badge en
 *   la inbox y carga el hilo previo del bot en el historial.
 * - `resolution` y `closedAt`: solo definidos cuando status === 'CLOSED'.
 */
export interface Chat {
  id: string;
  requester: ChatRequester;
  status: ChatStatus;
  /** ISO timestamp de apertura del caso. */
  openedAt: string;
  /** Última actividad (último mensaje, cambio de estado). Usado para ordenar. */
  lastActivityAt: string;
  assignedAgentId?: string;
  escalatedFromBot: boolean;
  /** Asunto corto, derivado del primer mensaje o del bot al escalar. */
  subject: string;
  resolution?: ChatResolution;
  closedAt?: string;
  closeNotes?: string;
}
