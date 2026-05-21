/**
 * Motor de detección de intenciones del agente de soporte.
 *
 * Funciona con matching de keywords (técnica clásica pre-IA).
 * Cuando llegue el backend con un agente real (o LLM), este archivo
 * se puede reemplazar por llamadas a la API correspondiente.
 *
 * El detector toma un mensaje del usuario y devuelve la intención más
 * probable basándose en palabras clave encontradas.
 */

export type Intent =
  | 'greeting'
  | 'farewell'
  | 'thanks'
  | 'delayed_order'
  | 'cancel_order'
  | 'refund'
  | 'wrong_order'
  | 'payment_issue'
  | 'change_address'
  | 'coupon_help'
  | 'account_help'
  | 'business_question'
  | 'human_request'
  | 'help_generic'
  | 'unknown';

/**
 * Diccionario de keywords por intención.
 * Una intención puede tener múltiples grupos de keywords;
 * el match es positivo si CUALQUIERA de los grupos hace match.
 *
 * Cada grupo es un array de palabras que TODAS deben aparecer
 * (más restrictivo). Esto reduce falsos positivos.
 */
interface IntentRule {
  intent: Intent;
  /** Cualquiera de estos grupos debe matchear completamente */
  keywordGroups: string[][];
  /** Prioridad (mayor = se evalúa primero) */
  priority: number;
}

const INTENT_RULES: IntentRule[] = [
  // Saludos (alta prioridad para que no se confundan con preguntas)
  {
    intent: 'greeting',
    keywordGroups: [
      ['hola'],
      ['buenas'],
      ['buenos', 'dias'],
      ['buenas', 'tardes'],
      ['buenas', 'noches'],
      ['saludos'],
      ['hey'],
      ['hi'],
    ],
    priority: 100,
  },

  // Despedidas
  {
    intent: 'farewell',
    keywordGroups: [
      ['adios'],
      ['chao'],
      ['hasta', 'luego'],
      ['nos', 'vemos'],
      ['bye'],
      ['gracias', 'eso', 'todo'],
      ['solo', 'eso'],
    ],
    priority: 95,
  },

  // Agradecimientos
  {
    intent: 'thanks',
    keywordGroups: [
      ['gracias'],
      ['agradezco'],
      ['mil', 'gracias'],
      ['muchas', 'gracias'],
      ['te', 'agradezco'],
    ],
    priority: 90,
  },

  // Pedido atrasado / no llegó
  {
    intent: 'delayed_order',
    keywordGroups: [
      ['pedido', 'atrasado'],
      ['pedido', 'tarde'],
      ['pedido', 'demora'],
      ['pedido', 'no', 'llega'],
      ['pedido', 'no', 'llego'],
      ['pedido', 'tardando'],
      ['donde', 'pedido'],
      ['donde', 'esta', 'pedido'],
      ['repartidor', 'no', 'llega'],
      ['tarda'],
      ['demorado'],
      ['atrasado'],
    ],
    priority: 80,
  },

  // Cancelar pedido
  {
    intent: 'cancel_order',
    keywordGroups: [
      ['cancelar', 'pedido'],
      ['anular', 'pedido'],
      ['cancelar', 'orden'],
      ['ya', 'no', 'quiero'],
      ['cancelacion'],
    ],
    priority: 80,
  },

  // Reembolso / devolución
  {
    intent: 'refund',
    keywordGroups: [
      ['reembolso'],
      ['devolucion'],
      ['devolver'],
      ['quiero', 'dinero'],
      ['quiero', 'mi', 'dinero'],
      ['recuperar', 'dinero'],
      ['plata', 'vuelta'],
      ['regresar', 'dinero'],
    ],
    priority: 80,
  },

  // Pedido equivocado / faltante
  {
    intent: 'wrong_order',
    keywordGroups: [
      ['pedido', 'equivocado'],
      ['pedido', 'mal'],
      ['orden', 'incorrecta'],
      ['producto', 'incorrecto'],
      ['no', 'es', 'pedi'],
      ['llego', 'mal'],
      ['falta', 'producto'],
      ['falta', 'algo'],
      ['esta', 'incompleto'],
      ['no', 'pedi', 'esto'],
      ['equivocaron'],
    ],
    priority: 80,
  },

  // Problema con pago
  {
    intent: 'payment_issue',
    keywordGroups: [
      ['cobraron', 'dos'],
      ['cobro', 'doble'],
      ['cobro', 'duplicado'],
      ['cargo', 'doble'],
      ['error', 'pago'],
      ['no', 'puedo', 'pagar'],
      ['tarjeta', 'rechazada'],
      ['problema', 'tarjeta'],
      ['problema', 'pago'],
      ['fallo', 'pago'],
    ],
    priority: 80,
  },

  // Cambiar dirección
  {
    intent: 'change_address',
    keywordGroups: [
      ['cambiar', 'direccion'],
      ['cambiar', 'lugar'],
      ['otra', 'direccion'],
      ['mal', 'direccion'],
      ['direccion', 'equivocada'],
      ['direccion', 'incorrecta'],
    ],
    priority: 75,
  },

  // Ayuda con cupones
  {
    intent: 'coupon_help',
    keywordGroups: [
      ['cupon'],
      ['codigo', 'descuento'],
      ['promocion'],
      ['descuento', 'no', 'funciona'],
      ['codigo', 'no', 'funciona'],
    ],
    priority: 75,
  },

  // Ayuda con cuenta
  {
    intent: 'account_help',
    keywordGroups: [
      ['cambiar', 'contraseña'],
      ['cambiar', 'password'],
      ['olvide', 'contraseña'],
      ['no', 'puedo', 'entrar'],
      ['cambiar', 'correo'],
      ['cambiar', 'telefono'],
      ['cambiar', 'datos'],
      ['editar', 'perfil'],
      ['mi', 'cuenta'],
    ],
    priority: 75,
  },

  // Pregunta sobre comercios
  {
    intent: 'business_question',
    keywordGroups: [
      ['restaurante'],
      ['farmacia'],
      ['supermercado'],
      ['donde', 'comprar'],
      ['que', 'comercios'],
      ['comercios', 'abiertos'],
      ['esta', 'abierto'],
      ['horario'],
      ['estan', 'cerrados'],
    ],
    priority: 70,
  },

  // Pedir hablar con humano (escalamiento)
  {
    intent: 'human_request',
    keywordGroups: [
      ['hablar', 'persona'],
      ['hablar', 'humano'],
      ['agente', 'real'],
      ['persona', 'real'],
      ['no', 'eres', 'humano'],
      ['eres', 'robot'],
      ['eres', 'bot'],
    ],
    priority: 70,
  },

  // Pedido de ayuda genérico
  {
    intent: 'help_generic',
    keywordGroups: [
      ['ayudame'],
      ['ayuda'],
      ['auxilio'],
      ['necesito', 'ayuda'],
      ['help'],
      ['problema'],
      ['tengo', 'duda'],
      ['una', 'pregunta'],
    ],
    priority: 50, // baja prioridad — fallback antes que unknown
  },
];

/**
 * Normaliza un texto para comparación:
 * - Lo pasa a minúsculas
 * - Quita tildes/acentos
 * - Quita signos de puntuación
 * - Colapsa espacios
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Verifica si todas las keywords del grupo aparecen como palabras
 * completas en el texto normalizado.
 */
function matchesGroup(text: string, keywords: string[]): boolean {
  const words = text.split(' ');
  return keywords.every((keyword) => words.includes(keyword));
}

/**
 * Detecta la intención de un mensaje del usuario.
 * Evalúa las reglas en orden de prioridad (mayor primero) y devuelve
 * la primera que matchee. Si ninguna matchea, devuelve 'unknown'.
 */
export function detectIntent(message: string): Intent {
  const normalized = normalize(message);
  if (!normalized) return 'unknown';

  // Ordenar reglas por prioridad descendente
  const sortedRules = [...INTENT_RULES].sort(
    (a, b) => b.priority - a.priority
  );

  for (const rule of sortedRules) {
    for (const group of rule.keywordGroups) {
      if (matchesGroup(normalized, group)) {
        return rule.intent;
      }
    }
  }

  return 'unknown';
}