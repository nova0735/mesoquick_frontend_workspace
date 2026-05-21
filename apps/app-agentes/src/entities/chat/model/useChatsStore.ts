import { create } from 'zustand';
import type { Chat, ChatMessage, ChatResolution } from './types';

/**
 * Store central de la Fase 6 (Chat §3.2). Vive en entities/ porque su estado
 * lo leen y mutan múltiples features independientes:
 *
 *   - list-pending-chats     → lee chats con status 'PENDING'
 *   - list-active-chats      → lee chats 'IN_ATTENTION' del agente actual
 *   - view-chat-messages     → lee messagesByChatId[selectedChatId]
 *   - send-chat-message      → llama appendMessage()
 *   - take-chat              → llama takeChat()
 *   - close-chat             → llama closeChat()
 *   - simulate-chat-events   → llama addIncomingChat / appendMessage (mock WS)
 *
 * TODO(backend): cuando esté la conexión real al Servicio de Chats vía
 * SocketManager (@mesoquick/core-network), las acciones de mutación pasarán
 * a llamar los endpoints/eventos correspondientes de §3.2 y solo aplicarán el
 * resultado del servidor en este store.
 *
 * Regla de consumo (Zustand v5): NUNCA filtrar/mapear dentro de un selector
 * (causa infinite loop). Para derivados, leer la mapa cruda con un selector
 * atómico y usar useMemo en el componente.
 */
interface ChatsStoreState {
  chats: Record<string, Chat>;
  messagesByChatId: Record<string, ChatMessage[]>;
  selectedChatId: string | null;
  isInboxHydrated: boolean;
}

interface HydrateInboxInput {
  chats: readonly Chat[];
  messagesByChatId: Record<string, readonly ChatMessage[]>;
}

interface TakeChatInput {
  chatId: string;
  agentId: string;
}

interface CloseChatInput {
  chatId: string;
  resolution: ChatResolution;
  notes: string;
}

interface AppendMessageInput {
  chatId: string;
  message: ChatMessage;
}

interface AddIncomingChatInput {
  chat: Chat;
  initialMessages?: readonly ChatMessage[];
}

interface ChatsStoreActions {
  hydrateInbox: (input: HydrateInboxInput) => void;
  selectChat: (chatId: string | null) => void;
  takeChat: (input: TakeChatInput) => void;
  closeChat: (input: CloseChatInput) => void;
  appendMessage: (input: AppendMessageInput) => void;
  addIncomingChat: (input: AddIncomingChatInput) => void;
}

export type ChatsStore = ChatsStoreState & ChatsStoreActions;

function nowIso(): string {
  return new Date().toISOString();
}

export const useChatsStore = create<ChatsStore>((set) => ({
  chats: {},
  messagesByChatId: {},
  selectedChatId: null,
  isInboxHydrated: false,

  hydrateInbox: ({ chats, messagesByChatId }) => {
    set((state) => {
      if (state.isInboxHydrated) return state;
      const chatsMap: Record<string, Chat> = {};
      for (const chat of chats) chatsMap[chat.id] = chat;
      const messagesMap: Record<string, ChatMessage[]> = {};
      for (const [chatId, msgs] of Object.entries(messagesByChatId)) {
        messagesMap[chatId] = [...msgs];
      }
      return {
        chats: chatsMap,
        messagesByChatId: messagesMap,
        isInboxHydrated: true,
      };
    });
  },

  selectChat: (chatId) => set({ selectedChatId: chatId }),

  takeChat: ({ chatId, agentId }) => {
    set((state) => {
      const existing = state.chats[chatId];
      if (!existing || existing.status !== 'PENDING') return state;
      const updated: Chat = {
        ...existing,
        status: 'IN_ATTENTION',
        assignedAgentId: agentId,
        lastActivityAt: nowIso(),
      };
      return { chats: { ...state.chats, [chatId]: updated } };
    });
  },

  closeChat: ({ chatId, resolution, notes }) => {
    set((state) => {
      const existing = state.chats[chatId];
      if (!existing) return state;
      const closedAt = nowIso();
      const updated: Chat = {
        ...existing,
        status: 'CLOSED',
        resolution,
        closeNotes: notes,
        closedAt,
        lastActivityAt: closedAt,
      };
      return { chats: { ...state.chats, [chatId]: updated } };
    });
  },

  appendMessage: ({ chatId, message }) => {
    set((state) => {
      const prevMsgs = state.messagesByChatId[chatId] ?? [];
      const updatedMessages: Record<string, ChatMessage[]> = {
        ...state.messagesByChatId,
        [chatId]: [...prevMsgs, message],
      };
      const existing = state.chats[chatId];
      const updatedChats: Record<string, Chat> = existing
        ? {
            ...state.chats,
            [chatId]: { ...existing, lastActivityAt: message.sentAt },
          }
        : state.chats;
      return {
        messagesByChatId: updatedMessages,
        chats: updatedChats,
      };
    });
  },

  addIncomingChat: ({ chat, initialMessages }) => {
    set((state) => {
      if (state.chats[chat.id]) return state;
      return {
        chats: { ...state.chats, [chat.id]: chat },
        messagesByChatId: {
          ...state.messagesByChatId,
          [chat.id]: initialMessages ? [...initialMessages] : [],
        },
      };
    });
  },
}));
