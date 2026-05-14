import { useState, useEffect, useCallback } from 'react';
import type { ChatMessage, AgentChatState } from './support.types';

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Hook que simula chat con un agente humano.
 * Por ahora el agente responde con respuestas pregrabadas para demo.
 * Cuando el broker esté listo, esto se reemplaza por WebSocket real.
 */
export function useAgentChat() {
  const [state, setState] = useState<AgentChatState>({
    messages: [],
    isConnected: false,
    agentName: undefined,
  });

  // Simular conexión inicial del agente
  useEffect(() => {
    const timer = setTimeout(() => {
      setState({
        messages: [
          {
            id: generateId(),
            role: 'agent',
            content:
              '¡Hola! Soy Carlos, agente de soporte de Mesoquick. ¿En qué te puedo ayudar?',
            timestamp: new Date().toISOString(),
          },
        ],
        isConnected: true,
        agentName: 'Carlos',
      });
    }, 2000); // 2 segundos para simular conexión

    return () => clearTimeout(timer);
  }, []);

  /**
   * El usuario envía un mensaje. El agente "responde" después de un delay.
   */
  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    // Simular respuesta del agente después de 1.5 segundos
    setTimeout(() => {
      const responses = [
        'Entiendo tu situación. Déjame revisar tu caso un momento.',
        'Gracias por la información. Estoy verificando los detalles.',
        'Permíteme un segundo mientras consulto con el equipo.',
        'Comprendo. Vamos a buscar la mejor solución para ti.',
        'Tomé nota. ¿Algún detalle adicional que quieras agregar?',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const agentMessage: ChatMessage = {
        id: generateId(),
        role: 'agent',
        content: randomResponse,
        timestamp: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, agentMessage],
      }));
    }, 1500);
  }, []);

  return {
    messages: state.messages,
    isConnected: state.isConnected,
    agentName: state.agentName,
    sendMessage,
  };
}