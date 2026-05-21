import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@features/auth/model/useAuthStore';
import { detectIntent } from '../utils/intentDetector';
import { generateResponse, getInitialGreeting } from '../utils/agentResponses';
import { escalateToSupport } from '../api/support.api';
import type { ChatMessage, AgentChatState } from './support.types';
import type { Intent } from '../utils/intentDetector';

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Intents que ameritan escalación a un agente humano real.
 * Carlos puede dar la primera respuesta, pero para estos casos también
 * ofrece un botón "Escalar a soporte" que crea una conversación real
 * en el broker (con fallback local si broker está caído).
 */
const ESCALATION_INTENTS: ReadonlySet<Intent> = new Set([
  'delayed_order',
  'cancel_order',
  'refund',
  'wrong_order',
  'payment_issue',
  'human_request',
]);

/** Mapea intent → tipo de caso para el broker. */
function intentToCaseType(intent: Intent): 'reclamo' | 'consulta' | 'reembolso' {
  if (intent === 'refund') return 'reembolso';
  if (
    intent === 'delayed_order' ||
    intent === 'wrong_order' ||
    intent === 'payment_issue' ||
    intent === 'cancel_order'
  ) {
    return 'reclamo';
  }
  return 'consulta';
}

/** Resumen corto del caso según intent + mensaje, para el campo "subject". */
function intentToSubject(intent: Intent, userMessage: string): string {
  switch (intent) {
    case 'delayed_order':
      return 'Pedido demorado';
    case 'cancel_order':
      return 'Solicitud de cancelación';
    case 'refund':
      return 'Solicitud de reembolso';
    case 'wrong_order':
      return 'Pedido incorrecto';
    case 'payment_issue':
      return 'Problema con pago';
    case 'human_request':
      return 'Atención humana solicitada';
    default:
      return userMessage.slice(0, 60);
  }
}

/**
 * Hook del chat con Carlos.
 *
 * Carlos responde local e instantáneamente con sus 13 intents (saludos, FAQs,
 * tracking, etc). Para casos que ameritan atención humana (queja, reembolso,
 * pedido demorado, etc), Carlos ofrece además un botón "Escalar a soporte"
 * que crea una conversación real en el broker (`POST /soporte/conversations`)
 * y envía el mensaje del usuario.
 *
 * Si el broker está caído, la escalación cae a un registro local y al usuario
 * se le confirma igual que su caso quedó registrado.
 */
export function useAgentChat() {
  const user = useAuthStore((s) => s.user);
  const [state, setState] = useState<AgentChatState>({
    messages: [],
    isConnected: false,
    agentName: undefined,
    isTyping: false,
  });

  // Última intent escalable detectada, para que el botón "Escalar" sepa qué
  // mandar al broker. Se limpia cuando el usuario escala o cuando manda otro
  // mensaje no-escalable.
  const [pendingEscalation, setPendingEscalation] = useState<{
    intent: Intent;
    userMessage: string;
  } | null>(null);

  const [isEscalating, setIsEscalating] = useState(false);

  // Conexión inicial del agente con saludo personalizado
  useEffect(() => {
    const connectionTimer = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isConnected: true,
        agentName: 'Carlos',
        isTyping: true,
      }));

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * El usuario envía un mensaje. Carlos detecta intención y responde.
   * Si el intent es "escalable", marcamos pendingEscalation para que la UI
   * muestre el botón "Escalar a soporte".
   */
  const sendMessage = useCallback((content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

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

    const intent = detectIntent(trimmed);
    const response = generateResponse(intent);

    // Solo armamos pending si el intent amerita un humano real
    if (ESCALATION_INTENTS.has(intent)) {
      setPendingEscalation({ intent, userMessage: trimmed });
    } else {
      setPendingEscalation(null);
    }

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

  /**
   * Escala el caso pendiente al broker. Pega a POST /api/soporte/conversations
   * con el shape confirmado por swagger. Si broker falla, cae a registro local
   * y aun así confirma al usuario.
   */
  const escalateNow = useCallback(async () => {
    if (!pendingEscalation || isEscalating) return;
    setIsEscalating(true);

    // Identidad del solicitante. Preferimos user.id si está logueado.
    const requesterExtId = user?.id
      ? `cliente-${user.id}`
      : user?.email
        ? `cliente-${user.email}`
        : `cliente-anon-${Date.now()}`;
    const requesterDisplayName = user?.name ?? 'Cliente Mesoquick';

    try {
      const result = await escalateToSupport({
        requesterExtId,
        requesterDisplayName,
        subject: intentToSubject(pendingEscalation.intent, pendingEscalation.userMessage),
        caseType: intentToCaseType(pendingEscalation.intent),
        initialMessage: pendingEscalation.userMessage,
      });

      const systemMessage: ChatMessage = {
        id: generateId(),
        role: 'system',
        content: result.userMessage,
        timestamp: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, systemMessage],
      }));
    } finally {
      setPendingEscalation(null);
      setIsEscalating(false);
    }
  }, [pendingEscalation, isEscalating, user]);

  return {
    messages: state.messages,
    isConnected: state.isConnected,
    agentName: state.agentName,
    isTyping: state.isTyping,
    sendMessage,
    /** true si el último mensaje del usuario amerita escalar a humano */
    canEscalate: pendingEscalation !== null,
    /** Acción para escalar el caso al broker (con fallback local). */
    escalate: escalateNow,
    isEscalating,
  };
}