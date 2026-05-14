/**
 * Tipos específicos de la feature de soporte.
 */

export type ChatRole = 'bot' | 'user' | 'agent' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string; // ISO date
}

export type SupportChannel = 'chatbot' | 'agent';

export interface ChatbotState {
  messages: ChatMessage[];
  currentNodeId: string;
  isFinished: boolean;
  escalatedToAgent: boolean;
}

export interface AgentChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  agentName?: string;
}