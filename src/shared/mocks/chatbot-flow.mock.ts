/**
 * Árbol de decisiones del chatbot automatizado.
 * Cada nodo tiene un mensaje del bot y opciones que el usuario puede elegir.
 * Cada opción lleva a otro nodo o termina con escalation a agente humano.
 */

export interface ChatbotOption {
  id: string;
  label: string;
  nextNodeId?: string;
  escalateToAgent?: boolean;
}

export interface ChatbotNode {
  id: string;
  message: string;
  options?: ChatbotOption[];
  isEnd?: boolean;
}

export const chatbotFlow: Record<string, ChatbotNode> = {
  start: {
    id: 'start',
    message:
      '¡Hola! Soy el asistente virtual de Mesoquick 👋\n\n¿En qué puedo ayudarte hoy?',
    options: [
      { id: 'opt-1', label: 'Tengo un problema con un pedido', nextNodeId: 'order_issue' },
      { id: 'opt-2', label: 'Consulta sobre pagos', nextNodeId: 'payment_issue' },
      { id: 'opt-3', label: 'No encuentro un producto', nextNodeId: 'product_search' },
      { id: 'opt-4', label: 'Otro tema', escalateToAgent: true },
    ],
  },

  order_issue: {
    id: 'order_issue',
    message:
      'Entiendo, lamento que tengas un problema con tu pedido 😔\n\n¿Qué tipo de inconveniente tienes?',
    options: [
      { id: 'opt-5', label: 'Mi pedido se atrasó', nextNodeId: 'order_delayed' },
      { id: 'opt-6', label: 'Recibí algo equivocado', nextNodeId: 'wrong_item' },
      { id: 'opt-7', label: 'Quiero cancelar mi pedido', nextNodeId: 'cancel_order' },
      { id: 'opt-8', label: 'Otro problema', escalateToAgent: true },
    ],
  },

  order_delayed: {
    id: 'order_delayed',
    message:
      'Los tiempos de entrega pueden variar por tráfico o alta demanda. Si tu pedido lleva más de 1 hora de retraso, te ofreceremos un cupón de compensación del 15% para tu próxima compra.\n\n¿Esto te ayuda?',
    options: [
      { id: 'opt-9', label: 'Sí, perfecto', nextNodeId: 'thank_you' },
      { id: 'opt-10', label: 'No, quiero hablar con alguien', escalateToAgent: true },
    ],
  },

  wrong_item: {
    id: 'wrong_item',
    message:
      'Lo lamento mucho 🙏. Vamos a procesarte un reembolso del producto equivocado. Te conectaré con un agente para confirmar los detalles.',
    options: [
      { id: 'opt-11', label: 'Conectar con agente', escalateToAgent: true },
    ],
  },

  cancel_order: {
    id: 'cancel_order',
    message:
      'Puedes cancelar tu pedido si aún no está en preparación. Si ya inició la preparación, se aplicará una pequeña multa del 20%.\n\n¿Deseas continuar con la cancelación?',
    options: [
      { id: 'opt-12', label: 'Sí, cancelar', escalateToAgent: true },
      { id: 'opt-13', label: 'No, mejor espero', nextNodeId: 'thank_you' },
    ],
  },

  payment_issue: {
    id: 'payment_issue',
    message: '¿Qué problema tienes con el pago?',
    options: [
      { id: 'opt-14', label: 'Me cobraron de más', escalateToAgent: true },
      { id: 'opt-15', label: 'Mi tarjeta fue rechazada', nextNodeId: 'card_rejected' },
      { id: 'opt-16', label: 'Quiero un reembolso', escalateToAgent: true },
    ],
  },

  card_rejected: {
    id: 'card_rejected',
    message:
      'Las tarjetas pueden ser rechazadas por:\n\n• Fondos insuficientes\n• Tarjeta vencida\n• Bloqueo por seguridad del banco\n\nTe recomiendo contactar a tu banco o intentar con otro método de pago. ¿Eso resuelve tu duda?',
    options: [
      { id: 'opt-17', label: 'Sí, gracias', nextNodeId: 'thank_you' },
      { id: 'opt-18', label: 'Necesito más ayuda', escalateToAgent: true },
    ],
  },

  product_search: {
    id: 'product_search',
    message:
      'Puedes buscar productos desde la barra de búsqueda en el catálogo 🔍. Si no encuentras lo que buscas, es posible que ningún comercio cerca lo tenga disponible.\n\n¿Te ayudo con algo más?',
    options: [
      { id: 'opt-19', label: 'Sí, otra consulta', nextNodeId: 'start' },
      { id: 'opt-20', label: 'No, eso era todo', nextNodeId: 'thank_you' },
    ],
  },

  thank_you: {
    id: 'thank_you',
    message: '¡Perfecto! Me alegra haber podido ayudarte 😊\n\nQue tengas un excelente día.',
    isEnd: true,
  },
};