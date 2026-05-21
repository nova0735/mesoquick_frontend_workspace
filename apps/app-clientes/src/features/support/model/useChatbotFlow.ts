import { useState, useCallback } from 'react';
import { chatbotFlow } from '@shared/mocks';
import type { ChatbotOption } from '@shared/mocks';
import type { ChatMessage, ChatbotState } from './support.types';

/**
 * Genera un ID único simple para mensajes.
 */
function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Hook que maneja el estado del chatbot automatizado.
 * Navega el árbol de decisiones definido en chatbotFlow.mock.ts.
 */
export function useChatbotFlow() {
  const [state, setState] = useState<ChatbotState>(() => {
    const startNode = chatbotFlow.start;
    return {
      messages: [
        {
          id: generateId(),
          role: 'bot',
          content: startNode.message,
          timestamp: new Date().toISOString(),
        },
      ],
      currentNodeId: 'start',
      isFinished: false,
      escalatedToAgent: false,
    };
  });

  /**
   * El usuario eligió una opción. Procesamos la transición.
   */
  const selectOption = useCallback((option: ChatbotOption) => {
    setState((prev) => {
      // 1. Agregar mensaje del usuario con su elección
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: option.label,
        timestamp: new Date().toISOString(),
      };

      // 2. Si la opción escala a agente, terminar y marcar
      if (option.escalateToAgent) {
        const systemMessage: ChatMessage = {
          id: generateId(),
          role: 'system',
          content:
            'Te estamos conectando con un agente humano. Por favor espera un momento...',
          timestamp: new Date().toISOString(),
        };
        return {
          ...prev,
          messages: [...prev.messages, userMessage, systemMessage],
          isFinished: true,
          escalatedToAgent: true,
        };
      }

      // 3. Si hay nodo siguiente, mostrar el mensaje del bot
      if (option.nextNodeId) {
        const nextNode = chatbotFlow[option.nextNodeId];
        if (!nextNode) {
          console.warn(`Nodo no encontrado: ${option.nextNodeId}`);
          return prev;
        }

        const botMessage: ChatMessage = {
          id: generateId(),
          role: 'bot',
          content: nextNode.message,
          timestamp: new Date().toISOString(),
        };

        return {
          ...prev,
          messages: [...prev.messages, userMessage, botMessage],
          currentNodeId: nextNode.id,
          isFinished: !!nextNode.isEnd,
        };
      }

      return prev;
    });
  }, []);

  /**
   * Reinicia el chatbot al inicio.
   */
  const restart = useCallback(() => {
    const startNode = chatbotFlow.start;
    setState({
      messages: [
        {
          id: generateId(),
          role: 'bot',
          content: startNode.message,
          timestamp: new Date().toISOString(),
        },
      ],
      currentNodeId: 'start',
      isFinished: false,
      escalatedToAgent: false,
    });
  }, []);

  // Las opciones actuales (las del nodo en el que estamos)
  const currentOptions = state.isFinished
    ? []
    : chatbotFlow[state.currentNodeId]?.options || [];

  return {
    messages: state.messages,
    currentOptions,
    isFinished: state.isFinished,
    escalatedToAgent: state.escalatedToAgent,
    selectOption,
    restart,
  };
}