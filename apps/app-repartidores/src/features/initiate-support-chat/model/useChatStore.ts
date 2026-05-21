import { create } from 'zustand';
import { getChatHistory } from '../api/chat.api';
import { ChatMessageIncoming, ChatMessageOutgoing } from '../../../entities/support/model/types';
import { SocketManager } from '@mesoquick/core-network';

interface ChatState {
  messages: ChatMessageIncoming[];
  isLoadingHistory: boolean;
  isConnected: boolean;
  error: string | null;
  initChat: () => Promise<void>;
  sendMessage: (text: string) => void;
  disconnectChat: () => void;
}

const WS_PATH = '/ws/chats/support';

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoadingHistory: false,
  isConnected: false,
  error: null,

  initChat: async () => {
    set({ isLoadingHistory: true, error: null });
    
    try {
      // 1. REST Hydration
      const history = await getChatHistory();
      set({ messages: history.messages, isLoadingHistory: false });

      // 2. WSS Connection
      const socketManager = SocketManager.getInstance();
      socketManager.connect(WS_PATH);
      
      socketManager.subscribe(WS_PATH, (data: any) => {
        // Detect incoming message and append immutably
        if (data && data.messageId && data.text) {
          set((state) => ({
            messages: [...state.messages, data as ChatMessageIncoming]
          }));
        }
      });

      set({ isConnected: true });
    } catch (error: unknown) {
      set({ error: 'Error al inicializar el chat de soporte.', isLoadingHistory: false });
    }
  },

  sendMessage: (text: string) => {
    const payload: ChatMessageOutgoing = { text };
    SocketManager.getInstance().emit(WS_PATH, payload);
    
    // Optimistic UI Update (simulating the courier's message instantly)
    const optimisticMessage: ChatMessageIncoming = {
      messageId: `opt-${Date.now()}`,
      senderId: 'me',
      senderRole: 'COURIER',
      senderName: 'Yo',
      text,
      timestamp: new Date().toISOString()
    };
    
    set((state) => ({
      messages: [...state.messages, optimisticMessage]
    }));
  },

  disconnectChat: () => {
    SocketManager.getInstance().disconnect(WS_PATH);
    set({ isConnected: false, messages: [] });
  }
}));
