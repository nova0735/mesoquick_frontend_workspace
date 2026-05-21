import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@features/auth/model/useAuthStore';
import { detectIntent } from '../utils/intentDetector';
import { generateResponse, getInitialGreeting } from '../utils/agentResponses';
import type { ChatMessage, AgentChatState } from './support.types';

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Hook que simula chat con un agente humano usando detección de
 * intenciones por keywords. Las respuestas son contextuales según
 * el mensaje del usuario.
 *
 * Cuando llegue el broker real, este archivo se reemplaza por una
 * conexión WebSocket al agente humano. Los componentes UI no cambian.
 */
export function useAgentChat() {
  const user = useAuthStore((s) => s.user);
  const [state, setState] = useState<AgentChatState>({
    messages: [],
    isConnected: false,
    agentName: undefined,
    isTyping: false,
  });

  // Conexión inicial del agente con saludo personalizado
  useEffect(() => {
    const connectionTimer = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isConnected: true,
        agentName: 'Carlos',
        isTyping: true,
      }));

      // Saludo después de "escribir" un momento
      const greetingTimer = setTimeout(() => {
        const greeting = getInitialGreeting(user?.name);
        const message: ChatMessage = {
          id: generateId(),
          role: 'agent',
          content: greeting.content,
          timestamp: new Date().toISOString(),
          followUps: greeting.followUps,
        };

        setState((prev) => ({
          ...prev,
          messages: [message],
          isTyping: false,
        }));
      }, 1000);

      return () => clearTimeout(greetingTimer);
    }, 1500);

    return () => clearTimeout(connectionTimer);
    // Solo se ejecuta al montar el componente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * El usuario envía un mensaje. El sistema detecta la intención
   * y el agente "responde" con una respuesta contextual.
   */
  const sendMessage = useCallback((content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    // 1. Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }));

    // 2. Detectar intención del mensaje
    const intent = detectIntent(trimmed);
    const response = generateResponse(intent);

    // 3. "Escribir" durante un tiempo realista y luego responder
    setTimeout(() => {
      const agentMessage: ChatMessage = {
        id: generateId(),
        role: 'agent',
        content: response.content,
        timestamp: new Date().toISOString(),
        followUps: response.followUps,
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, agentMessage],
        isTyping: false,
      }));
    }, response.delayMs);
  }, []);

  return {
    messages: state.messages,
    isConnected: state.isConnected,
    agentName: state.agentName,
    isTyping: state.isTyping,
    sendMessage,
  };
}