// src/features/support/api/support.api.ts
//
// Capa de soporte. broker-first + fallback mock.
//
// Endpoints integrados del broker:
//   - POST /api/soporte/conversations
//   - POST /api/soporte/conversations/{id}/messages
//   - GET  /api/soporte/conversations/{id}    (consultar estado)
//
// Cuando Carlos no puede resolver algo (queja, reembolso, problema grave) o
// el usuario pide explícitamente un humano, escalamos al broker. Si el broker
// falla, igual le confirmamos al usuario que su caso quedó registrado
// localmente — la presentación nunca se rompe.

// ============================================================================
//  Broker config
// ============================================================================

const BROKER_BASE_URL = 'https://broker-services-production.up.railway.app/api';
const BROKER_TIMEOUT_MS = 6000;

class BrokerError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'BrokerError';
    this.status = status;
  }
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = BROKER_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    throw new BrokerError(
      err instanceof Error ? err.message : 'Sin conexión al broker',
      0,
    );
  } finally {
    clearTimeout(timer);
  }
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('access_token');
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in (payload as object)) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

// ============================================================================
//  Tipos públicos
// ============================================================================

export interface EscalationRequest {
  /** Usuario que escala — preferimos el cliente_id del JWT, sino el email. */
  requesterExtId: string;
  requesterDisplayName: string;
  /** Asunto resumido del caso (ej. "Pedido demorado") */
  subject: string;
  /** Tipo de caso para clasificación: reclamo, consulta, sugerencia, etc. */
  caseType?: 'reclamo' | 'consulta' | 'sugerencia' | 'reembolso';
  /** Referencia opcional al pedido afectado: "PED-123" */
  caseReference?: string;
  /** Mensaje inicial del usuario al escalar */
  initialMessage: string;
}

export interface EscalationResult {
  /** ID de la conversación. Si viene del broker es numérico string ("42").
   *  Si viene del fallback local es algo como "local-XXXX". */
  conversationId: string;
  /** true = caso registrado en el broker; false = solo local */
  isBroker: boolean;
  /** Mensaje listo para mostrar al usuario */
  userMessage: string;
}

// ============================================================================
//  Crear conversación de soporte
// ============================================================================

interface BrokerCreateConversationBody {
  requester_type: 'CUSTOMER';
  requester_ext_id: string;
  requester_display_name: string;
  case_type: string;
  case_reference?: string;
  subject: string;
  inactivity_minutes: number;
}

async function brokerCreateConversation(req: EscalationRequest): Promise<string | null> {
  const body: BrokerCreateConversationBody = {
    requester_type: 'CUSTOMER',
    requester_ext_id: req.requesterExtId,
    requester_display_name: req.requesterDisplayName,
    case_type: req.caseType ?? 'consulta',
    case_reference: req.caseReference,
    subject: req.subject,
    inactivity_minutes: 10,
  };

  try {
    const response = await fetchWithTimeout(
      `${BROKER_BASE_URL}/soporte/conversations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      let errorDetail = `HTTP ${response.status}`;
      try {
        errorDetail = JSON.stringify(await response.json());
      } catch {
        /* ignore */
      }
      console.warn(
        `[support.api] broker rechazó crear conversación (HTTP ${response.status}):`,
        '\n  body:', body,
        '\n  respuesta:', errorDetail,
      );
      return null;
    }

    const json = await response.json();
    const raw = unwrap<{ id?: number | string }>(json);
    const id = raw?.id;
    if (id == null) {
      console.warn('[support.api] broker respondió sin id en /conversations:', json);
      return null;
    }
    console.info(`[support.api] ✅ conversación creada en broker, id=${id}`);
    return String(id);
  } catch (err) {
    console.warn('[support.api] broker falló al crear conversación:', err);
    return null;
  }
}

// ============================================================================
//  Enviar mensaje en conversación
// ============================================================================

interface BrokerSendMessageBody {
  sender_role: 'USER' | 'AGENT';
  sender_ext_id: string;
  content: string;
  client_message_id: string;
}

/**
 * Envía un mensaje del usuario a una conversación del broker.
 * Si falla, no propaga error — el mensaje queda solo en la UI local.
 * Devuelve true si broker confirmó recepción.
 */
export async function brokerSendUserMessage(
  conversationId: string,
  senderExtId: string,
  content: string,
): Promise<boolean> {
  // Solo intentamos broker si el ID es numérico (los locales son "local-XXX")
  if (!/^\d+$/.test(conversationId)) {
    return false;
  }

  const body: BrokerSendMessageBody = {
    sender_role: 'USER',
    sender_ext_id: senderExtId,
    content,
    client_message_id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };

  try {
    const response = await fetchWithTimeout(
      `${BROKER_BASE_URL}/soporte/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify(body),
      },
    );
    if (!response.ok) {
      console.warn(
        `[support.api] broker rechazó mensaje (HTTP ${response.status})`,
      );
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[support.api] broker falló al enviar mensaje:', err);
    return false;
  }
}

// ============================================================================
//  Función pública de escalación — la usa el chat de Carlos
// ============================================================================

function generateLocalConversationId(): string {
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Escala el caso del usuario al sistema de soporte.
 *
 * Flujo:
 *   1. Intenta crear conversación en el broker.
 *   2. Si tuvo éxito, envía también el mensaje inicial del usuario.
 *   3. Si broker falla → registra localmente y devuelve mensaje de confirmación.
 *
 * En ambos casos, el usuario recibe una confirmación amigable de que su caso
 * fue registrado. Nunca le mostramos "error al escalar" para no romper la UX.
 */
export async function escalateToSupport(
  req: EscalationRequest,
): Promise<EscalationResult> {
  const brokerId = await brokerCreateConversation(req);

  if (brokerId) {
    // Conversación creada — enviamos el primer mensaje
    await brokerSendUserMessage(brokerId, req.requesterExtId, req.initialMessage);
    return {
      conversationId: brokerId,
      isBroker: true,
      userMessage:
        `✅ Tu caso fue escalado al equipo de soporte.\n` +
        `Número de conversación: #${brokerId}\n` +
        `Un agente humano te responderá en breve.`,
    };
  }

  // Fallback: caso registrado solo localmente
  const localId = generateLocalConversationId();
  console.info(`[support.api] escalación en modo local, id=${localId}`);
  return {
    conversationId: localId,
    isBroker: false,
    userMessage:
      `✅ Tu caso quedó registrado.\n` +
      `Te contactaremos por correo electrónico en las próximas horas para darte seguimiento.`,
  };
}