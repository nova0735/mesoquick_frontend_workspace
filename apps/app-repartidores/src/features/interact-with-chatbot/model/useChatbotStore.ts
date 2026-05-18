import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { sendMessage, ChatbotMessage } from '../api/chatbot.api';
import { useWalletStore } from '../../../entities/wallet/model/useWalletStore';

interface ChatbotState {
  messages: ChatbotMessage[];
  isTyping: boolean;
  sendMessage: (message: string) => Promise<void>;
}

export const useChatbotStore = create<ChatbotState>()(
  subscribeWithSelector((set, get) => ({
    messages: [],
    isTyping: false,
    sendMessage: async (message: string) => {
      const userMessage: ChatbotMessage = {
        id: Date.now().toString(),
        content: message,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };
      set((state) => ({ messages: [...state.messages, userMessage], isTyping: true }));

      try {
        const botResponse = await sendMessage(message);
        set((state) => ({ messages: [...state.messages, botResponse], isTyping: false }));

        if (botResponse.action?.type === 'COMPENSATION') {
          // Invocar fetchWalletSummary con fechas actuales
          const today = new Date();
          const startDate = today.toISOString().split('T')[0];
          const endDate = startDate;
          useWalletStore.getState().fetchWalletSummary(startDate, endDate);
        }
      } catch (error) {
        set({ isTyping: false });
        console.error('Error al enviar mensaje:', error);
      }
    },
  }))
);