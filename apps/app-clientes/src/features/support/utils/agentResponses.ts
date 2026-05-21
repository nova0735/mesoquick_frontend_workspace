import type { Intent } from './intentDetector';

/**
 * Generador de respuestas del agente Carlos.
 *
 * Cada intent tiene 2-4 variantes de respuesta para que el agente
 * no suene repetitivo. La variante se elige al azar.
 *
 * Cuando llegue el broker con un agente real, este archivo se
 * reemplaza por las respuestas del agente humano vía WebSocket.
 */

interface ResponseConfig {
  /** Variantes posibles de respuesta — se elige una al azar */
  variants: string[];
  /** Sugerencias de seguimiento (chips clickeables) */
  followUps?: string[];
  /** Tiempo simulado de respuesta en ms */
  delayMs?: number;
}

/**
 * Configuración de respuestas por intención.
 * Las respuestas son naturales, amigables y proporcionan
 * información concreta (no relleno tipo "tomé nota").
 */
const RESPONSES: Record<Intent, ResponseConfig> = {
  greeting: {
    variants: [
      '¡Hola! ¿En qué te puedo ayudar hoy?',
      '¡Hola, qué gusto saludarte! Contame qué necesitás.',
      '¡Hola! Estoy acá para ayudarte. ¿Cuál es tu consulta?',
    ],
    followUps: [
      'Mi pedido está atrasado',
      'Quiero cancelar un pedido',
      'Tengo un problema con el pago',
    ],
    delayMs: 800,
  },

  farewell: {
    variants: [
      '¡Listo! Cualquier otra cosa, escribime sin dudar. Que tengas un excelente día 👋',
      '¡Perfecto! Gracias por contactarnos. Estoy acá cuando me necesites de nuevo.',
      '¡Hasta luego! Si tenés más dudas, no dudes en volver. Que disfrutes tu pedido 🍔',
    ],
    delayMs: 700,
  },

  thanks: {
    variants: [
      '¡De nada! Es un placer ayudarte. ¿Hay algo más en lo que pueda asistirte?',
      '¡No hay de qué! Para eso estamos. ¿Algo más?',
      '¡Con gusto! Decime si necesitás algo más.',
    ],
    followUps: ['No, eso es todo', 'Tengo otra consulta'],
    delayMs: 700,
  },

  delayed_order: {
    variants: [
      'Lamento mucho la demora 😔 Esto puede pasar por alta demanda o tráfico. Te recomiendo ir a "Mis pedidos" y tocar "Rastrear" para ver en tiempo real dónde está tu repartidor. Si pasaron más de 60 minutos del tiempo estimado, podemos ofrecerte un cupón de compensación.',
      'Entiendo la frustración. Lo primero: revisá en "Mis pedidos" el estado actual del rastreo. Si tu pedido lleva más de 1 hora retrasado respecto al estimado, contame el número de pedido (#xxx-GT) y te aplico un cupón de descuento para tu próxima compra.',
    ],
    followUps: [
      'Pasaron más de 60 minutos',
      'Quiero un reembolso',
      'Ya está, gracias',
    ],
    delayMs: 1500,
  },

  cancel_order: {
    variants: [
      'Puedo ayudarte con eso. Las cancelaciones funcionan así:\n\n• **Si el pedido aún no se preparó**: lo cancelás vos mismo desde "Mis pedidos" → tocar el pedido → botón "Cancelar pedido".\n\n• **Si ya está preparándose o en camino**: ya no se puede cancelar, pero podés rechazarlo cuando llegue.\n\n¿En qué estado está tu pedido?',
      'Claro, te explico el proceso de cancelación:\n\n1. Andá a "Mis pedidos" en el menú\n2. Tocá el pedido que querés cancelar\n3. Si todavía está en estado "Confirmado" o "Pendiente", verás el botón "Cancelar pedido"\n\nSi ya está "Preparando" o "En camino", lamentablemente no se puede cancelar desde la app. ¿Cuál es el estado actual?',
    ],
    followUps: [
      'Mi pedido está "Preparando"',
      'Está "Confirmado" todavía',
      'Ya está en camino',
    ],
    delayMs: 1400,
  },

  refund: {
    variants: [
      'Te ayudo con eso. Los reembolsos se procesan según el motivo:\n\n• **Pedido cancelado a tiempo**: reembolso automático en 3-5 días hábiles.\n• **Pedido mal preparado o faltante**: reembolso parcial o total según el caso.\n• **Pedido nunca entregado**: reembolso total.\n\n¿Cuál es tu caso? Contame el número de pedido (#xxx-GT) para revisarlo.',
      'Por supuesto. Para procesar tu reembolso necesito:\n\n1. El número del pedido (lo encontrás en "Mis pedidos")\n2. El motivo de la solicitud\n3. Si aplica, una foto del problema\n\nLos reembolsos se acreditan en 3-5 días hábiles al mismo método de pago que usaste.',
    ],
    followUps: ['Pedido nunca llegó', 'Faltaban productos', 'Mejor un cupón'],
    delayMs: 1500,
  },

  wrong_order: {
    variants: [
      '¡Qué fastidio, lamento que haya pasado! 😔 Esto lo solucionamos rápido. Necesito:\n\n1. El número de pedido (#xxx-GT)\n2. Una breve descripción de qué llegó mal (producto incorrecto, faltante, dañado)\n\nSegún el caso, podemos ofrecerte: reposición del producto, reembolso parcial, o cupón para tu próxima compra.',
      'Disculpá la mala experiencia. Vamos a resolverlo. Para procesar la queja:\n\n• Si **faltó un producto**: reembolso del valor del producto faltante.\n• Si **llegó otro producto**: podemos coordinar el cambio o reembolsar.\n• Si llegó **en mal estado**: reembolso total + cupón de disculpa.\n\n¿Cuál de estos casos es el tuyo?',
    ],
    followUps: [
      'Faltó un producto',
      'Llegó algo que no pedí',
      'Está en mal estado',
    ],
    delayMs: 1500,
  },

  payment_issue: {
    variants: [
      'Los problemas de pago los tomamos muy en serio. Te ayudo a resolverlo:\n\n• **Cobro duplicado**: revisamos con el banco, en 24-48hs se reversa el cobro extra automáticamente.\n• **Tarjeta rechazada**: puede ser saldo insuficiente, límite diario, o que tu banco bloqueó el cargo. Probá con otra tarjeta o contactá a tu banco.\n• **Cargo sin pedido**: esto requiere verificación urgente, necesito el monto y la fecha exacta.\n\n¿Cuál es tu caso?',
      'Lamento el inconveniente con el pago. Para ayudarte mejor, contame:\n\n1. ¿Qué pasó exactamente? (error al pagar, cobro duplicado, monto incorrecto, etc.)\n2. ¿En qué fecha aproximada?\n3. Si tenés el monto o número de pedido, mejor.\n\nLas disputas de cobro se resuelven generalmente en 2-3 días hábiles.',
    ],
    followUps: ['Cobro duplicado', 'Tarjeta rechazada', 'Monto incorrecto'],
    delayMs: 1600,
  },

  change_address: {
    variants: [
      'Para cambiar tu dirección hay dos opciones:\n\n• **Para tu próximo pedido**: andá a "Perfil" → "Editar" y actualizá tu dirección principal. La próxima vez que vayas al checkout, ya aparecerá la nueva.\n\n• **Para un pedido en curso**: si el repartidor todavía no salió del comercio, podemos intentar avisarle. Pasame el número de pedido (#xxx-GT) y vemos.',
      'Te explico:\n\n• Si querés cambiar tu **dirección por defecto** (la que aparece siempre): "Perfil" → "Editar" → modificá "Dirección principal".\n\n• Si querés enviar **un pedido específico a otra dirección**: en el checkout, en el paso "Dirección", podés modificarla antes de continuar.\n\n¿Cuál de los dos casos es?',
    ],
    followUps: ['Cambiar la dirección por defecto', 'Para un pedido en curso'],
    delayMs: 1300,
  },

  coupon_help: {
    variants: [
      'Te ayudo con los cupones. Los códigos válidos actualmente son:\n\n• **BIENVENIDO10** — 10% de descuento, válido para usuarios nuevos\n• **MESOQUICK15** — Q15 de descuento en pedidos +Q100\n\n💡 Tips si no te funciona:\n- Verificá que esté escrito en MAYÚSCULAS\n- Algunos cupones tienen monto mínimo\n- Cada cupón se usa una sola vez por cuenta\n\n¿Querés que te ayude con algo más específico?',
      'Si tu cupón no funciona, suele ser por:\n\n1. **Mal escrito** — los códigos son sensibles a mayúsculas\n2. **No cumple el monto mínimo** — algunos requieren un mínimo de compra\n3. **Ya lo usaste** — son de un solo uso por cuenta\n4. **Expiró** — los cupones tienen fecha límite\n\nProbá con `BIENVENIDO10` (10% off) o `MESOQUICK15` (Q15 off en pedidos de +Q100).',
    ],
    followUps: ['Probar BIENVENIDO10', 'Dame otro cupón'],
    delayMs: 1300,
  },

  account_help: {
    variants: [
      'Para gestionar tu cuenta:\n\n• **Editar datos** (teléfono, dirección, nombre): andá a "Perfil" → botón "Editar" arriba a la derecha.\n• **Cambiar contraseña**: por ahora solo desde nuestro equipo, pero estamos por habilitarlo en la app.\n• **Email registrado**: es tu identificador, no se puede cambiar por seguridad.\n• **Eliminar cuenta**: contactanos por este chat y procesamos la solicitud.\n\n¿Qué querés modificar?',
      'Te oriento:\n\n• Tus datos básicos los editás en `/perfil/editar` (botón "Editar" en tu perfil).\n• Para problemas de inicio de sesión, asegurate de usar el email correcto y revisá mayúsculas en la contraseña.\n• Si tenés varios pedidos pendientes y no te aparecen, hacé logout y login de nuevo.\n\n¿Qué necesitás puntualmente?',
    ],
    followUps: ['Editar mi perfil', 'No puedo iniciar sesión'],
    delayMs: 1300,
  },

  business_question: {
    variants: [
      'En Mesoquick tenemos 3 categorías de comercios:\n\n🍴 **Restaurantes** — comidas preparadas, listos en 20-40 min\n💊 **Farmacias** — medicamentos y productos de salud, 15-30 min\n🛒 **Supermercados** — despensa diaria, 30-50 min\n\nPodés explorar todos en "Explorar" desde el menú principal. Los horarios varían por comercio: algunos abren 24/7, otros solo en horario diurno. El estado "Abierto/Cerrado" se ve en cada tarjeta.',
      'Para ver los comercios disponibles, andá a la sección "Explorar" en el menú. Ahí podés filtrar por:\n\n• **Categoría** — restaurantes, farmacias, supermercados\n• **Estado** — solo abiertos / todos\n• **Búsqueda** por nombre\n\nLos horarios y disponibilidad se actualizan en tiempo real según cada comercio.',
    ],
    followUps: ['Ir a Explorar', 'Restaurantes abiertos ahora'],
    delayMs: 1300,
  },

  human_request: {
    variants: [
      'Tranqui, soy Carlos del equipo de soporte 🙋 No soy un robot pero entiendo la confusión. Contame qué necesitás y vemos cómo resolverlo juntos. Si lo tuyo es muy complejo, puedo escalarlo a otro miembro del equipo.',
      'Soy un agente real, Carlos. Pasa que algunas respuestas las tengo preparadas para ir más rápido en consultas frecuentes. Pero si tu caso es particular, contame con detalle y lo veo personalmente.',
    ],
    followUps: ['Tengo un caso complejo', 'Mejor cuéntame las opciones'],
    delayMs: 1100,
  },

  help_generic: {
    variants: [
      'Por supuesto, estoy acá para ayudarte. ¿Cuál es tu situación? Para orientarte mejor, decime si tu consulta es sobre:\n\n• Un pedido (retraso, cancelación, problema)\n• Un pago o reembolso\n• Tu cuenta o perfil\n• Algo más',
      '¡Claro! Contame qué pasa. Si me das un poquito más de contexto, te puedo ayudar más rápido. ¿Tu consulta es sobre un pedido, un pago, tu cuenta, o algo distinto?',
    ],
    followUps: [
      'Sobre un pedido',
      'Sobre un pago',
      'Sobre mi cuenta',
      'Otra cosa',
    ],
    delayMs: 1100,
  },

  unknown: {
    variants: [
      'Mmm, no estoy seguro de haberte entendido bien 🤔 ¿Podrías reformular tu consulta? O si querés, elegí uno de los temas frecuentes:',
      'Disculpá, no te entendí del todo. ¿Me lo podés explicar de otra forma? Mientras tanto, estos son los temas con los que más ayudo:',
      'No tengo claro qué necesitás. Para ayudarte mejor, ¿podrías dar más detalles? O elegí entre estos temas:',
    ],
    followUps: [
      'Mi pedido está atrasado',
      'Quiero cancelar un pedido',
      'Problema con el pago',
      'Cambiar datos del perfil',
    ],
    delayMs: 1200,
  },
};

export interface AgentResponse {
  content: string;
  followUps?: string[];
  delayMs: number;
}

/**
 * Devuelve una respuesta del agente para una intención dada.
 * Si la intención tiene múltiples variantes, elige una al azar.
 */
export function generateResponse(intent: Intent): AgentResponse {
  const config = RESPONSES[intent];
  const variant =
    config.variants[Math.floor(Math.random() * config.variants.length)];

  return {
    content: variant,
    followUps: config.followUps,
    delayMs: config.delayMs ?? 1200,
  };
}

/**
 * Saludo inicial del agente (personalizable con nombre del usuario).
 */
export function getInitialGreeting(userName?: string): AgentResponse {
  const variants = userName
    ? [
        `¡Hola ${userName}! Soy Carlos, agente de soporte de Mesoquick. ¿En qué te puedo ayudar hoy?`,
        `¡${userName}, qué gusto saludarte! Soy Carlos del equipo de soporte. Contame qué necesitás.`,
      ]
    : [
        '¡Hola! Soy Carlos, agente de soporte de Mesoquick. ¿En qué te puedo ayudar?',
        '¡Hola! Soy Carlos del equipo de Mesoquick. Estoy acá para resolver cualquier duda o problema.',
      ];

  return {
    content: variants[Math.floor(Math.random() * variants.length)],
    followUps: [
      'Mi pedido está atrasado',
      'Quiero cancelar un pedido',
      'Problema con el pago',
      'Otra consulta',
    ],
    delayMs: 0,
  };
}