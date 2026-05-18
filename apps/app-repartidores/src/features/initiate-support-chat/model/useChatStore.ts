import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { SocketManager } from '@mesoquick/core-network';
import { getChatHistory, ChatMessage } from '../api/chat.api';

interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  initializeChat: () => Promise<void>;
  addMessage: (message: ChatMessage) => void;
}

export const useChatStore = create<ChatState>()(
  subscribeWithSelector((set, get) => ({
    messages: [],
    isConnected: false,
    initializeChat: async () => {
      try {
        const history = await getChatHistory();
        set({ messages: history });

        const isSecure = window.location.protocol === 'https:';
        const wsProtocol = isSecure ? 'wss://' : 'ws://';
        // Priorizar variable de entorno, si no existe, usar el host actual con el endpoint de Vite Proxy
        const wsUrl = import.meta.env.VITE_WS_URL || `${wsProtocol}${window.location.host}/ws/support/chat`;

        SocketManager.getInstance().connect(wsUrl);
        SocketManager.getInstance().subscribe(wsUrl, (message: ChatMessage) => {
          get().addMessage(message);
        });
        set({ isConnected: true });
      } catch (error) {
        console.error('Error al inicializar chat:', error);
      }
    },
    addMessage: (message: ChatMessage) => {
      set((state) => ({ messages: [...state.messages, message] }));
    },
  }))
);