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

        const url = 'ws://localhost:8080/ws/support/chat'; // Asumir URL, ajustar si necesario
        SocketManager.connect(url);
        SocketManager.subscribe('/ws/support/chat', (message: ChatMessage) => {
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